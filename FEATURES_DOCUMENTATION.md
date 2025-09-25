# Student Upload and Faculty Selection Features Documentation

## Overview
This document describes the new student upload and faculty selection features that have been integrated into the EduManage Pro application. These features allow students to upload assignments and select faculty recipients, while faculty members can review and manage submissions assigned to them.

## Database Schema

### student_uploads Table
The following table has been added to the database:

```sql
CREATE TABLE IF NOT EXISTS student_uploads (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  student_id BIGINT NOT NULL,
  faculty_id BIGINT DEFAULT NULL,
  title VARCHAR(255),
  description TEXT,
  file_path VARCHAR(1024) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'submitted'
);

CREATE INDEX IF NOT EXISTS idx_student_uploads_faculty ON student_uploads(faculty_id);
```

## API Endpoints

### Student Endpoints
1. **Upload Assignment**
   - **Endpoint**: `POST /api/student/upload`
   - **Authentication**: Required (Student role)
   - **Parameters**: 
     - `file` (multipart/form-data): The file to upload
     - `title` (string): Assignment title
     - `description` (string, optional): Assignment description
     - `facultyId` (string): ID of the faculty member to receive the assignment
   - **Response**: 200 OK on success

2. **Get Student Uploads**
   - **Endpoint**: `GET /api/student/uploads`
   - **Authentication**: Required (Student role)
   - **Response**: List of uploads by the authenticated student

### Faculty Endpoints
1. **Get Faculty Assignments**
   - **Endpoint**: `GET /api/faculty/{id}/assessments`
   - **Authentication**: Required (Faculty role)
   - **Parameters**: 
     - `id` (path): Faculty ID
   - **Response**: List of uploads assigned to the faculty member

2. **Update Assignment Status**
   - **Endpoint**: `PUT /api/faculty/assessments/{id}`
   - **Authentication**: Required (Faculty role)
   - **Parameters**: 
     - `id` (path): Assignment ID
     - `status` (body): New status (approved, rejected)
     - `feedback` (body, optional): Feedback for rejected assignments
   - **Response**: 200 OK on success

### Public Endpoints
1. **Get Faculty List**
   - **Endpoint**: `GET /api/faculties`
   - **Authentication**: Not required
   - **Response**: List of all faculty members

## Frontend Components

### StudentUploadModule
This component provides the student interface for uploading assignments.

**Features:**
- Assignment title and description fields
- Faculty selection dropdown
- File upload with preview
- Submission history with status tracking
- Responsive design

**Props:**
- `userRole` (string): The role of the current user

### FacultyDashboardModule
This component provides the faculty interface for reviewing student submissions.

**Features:**
- Filter submissions by status
- Search by student name, title, or file name
- Approve or reject submissions
- View submission details
- Responsive design

**Props:**
- `userRole` (string): The role of the current user

## Security Considerations

1. **Authentication**: All endpoints require appropriate authentication
2. **Authorization**: Faculty members can only access submissions assigned to them
3. **File Storage**: Files are stored securely outside the web root
4. **Input Validation**: All inputs are validated on the server side
5. **Rate Limiting**: Upload endpoints have rate limiting to prevent abuse

## File Storage

Files are stored with the following security measures:
- Stored outside the web root
- Randomly generated file names
- File type and size validation
- Access controlled through signed URLs

## Notification System

Faculty members receive notifications when:
- A new assignment is submitted to them
- An assignment status is updated

Notifications are sent via:
- In-app notifications
- Email (optional)

## Configuration

The following environment variables can be configured:

```
FILE_UPLOAD_MAX_SIZE=10485760  # 10MB
FILE_STORAGE_PATH=/secure/uploads/
NOTIFICATION_EMAIL_ENABLED=true
```

## Student Credentials

The system uses the same student login approach as version2, where students use their registration number as both username and password.

**Student Login Process:**
- Students log in using their registration number as both username and password
- This approach is consistent with version2 implementation
- All student data from version2 has been integrated

**Example Student Accounts:**
- 22F41A0424 / 22F41A0424 (E CHARAN KUMAR REDDY)
- 22F41A0401 / 22F41A0401 (A AYESHA SIDDIKHA)
- 22F41A0402 / 22F41A0402 (AKASH G)
- 22F41A0403 / 22F41A0403 (ALAKAM JAGADEESH)
- 22F41A0404 / 22F41A0404 (ALAM HARSHITH ROYAL)
- ... (full list includes all 80+ students from version2)

**Other Demo Accounts:**
- Admin: admin / admin123
- Faculty: faculty / faculty123

## Integration with Existing Features

The new features integrate seamlessly with existing v1 functionality:
- Login system remains unchanged for non-student roles
- Navigation structure is preserved
- UI components follow existing design patterns
- Database schema is backward compatible

## Testing

See [TESTING_PLAN.md](TESTING_PLAN.md) for detailed testing procedures.

## Deployment

### Database Migration
Run the provided SQL migration script to create the `student_uploads` table.

### Backend Deployment
1. Deploy updated backend code
2. Configure environment variables
3. Verify API endpoints

### Frontend Deployment
1. Deploy updated frontend code
2. Verify component integration
3. Test user workflows

## Rollback Procedure

If issues are encountered:
1. Revert frontend code deployment
2. Revert backend code deployment
3. Restore database from backup if necessary
4. Document issues and fix before redeployment

## Support and Maintenance

### Common Issues
1. **Upload failures**: Check file size limits and storage permissions
2. **Faculty not appearing**: Verify faculty data in database
3. **Status not updating**: Check backend API connectivity

### Monitoring
- Track upload success/failure rates
- Monitor API response times
- Log authentication failures

### Updates
- Regular security updates for file handling
- Performance optimizations for large file uploads
- UI/UX improvements based on user feedback