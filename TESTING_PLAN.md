# Testing Plan for Student Upload and Faculty Selection Features

## Overview
This document outlines the testing approach for the merged student upload and faculty selection features from version2 into version1 of the EduManage Pro application.

## Unit Testing Approach

### StudentUploadModule Testing
1. **Form Validation Tests**
   - Verify that the form requires all fields (title, faculty selection, file)
   - Check that appropriate error messages are displayed when fields are missing
   - Ensure the submit button is disabled when required fields are empty

2. **File Handling Tests**
   - Test file selection functionality
   - Verify file information display (name, size)
   - Check file size formatting (bytes to KB/MB conversion)

3. **Submission Tests**
   - Validate that submissions are added to the history list
   - Confirm that the form is reset after successful submission
   - Check that status indicators are displayed correctly

### FacultyDashboardModule Testing
1. **Filtering Tests**
   - Verify search functionality works with student names, titles, and file names
   - Test status filtering (all, submitted, approved, rejected)
   - Confirm combined search and filter functionality

2. **Action Tests**
   - Test approve functionality
   - Test reject functionality
   - Verify status updates are reflected in the UI

3. **Display Tests**
   - Check that submissions are displayed with correct information
   - Verify status icons are displayed correctly
   - Confirm responsive layout on different screen sizes

## Integration Testing Approach

### API Endpoint Testing
1. **Student Upload Endpoint** (`/api/student/upload`)
   - Test authenticated access (student role required)
   - Verify file upload with metadata (title, description, facultyId)
   - Confirm database record creation with correct faculty assignment

2. **Faculty Submissions Endpoint** (`/api/faculty/{id}/assessments`)
   - Test authenticated access (faculty role required)
   - Verify faculty can only access their own submissions
   - Confirm 403 response when accessing another faculty's endpoint

3. **Faculty List Endpoint** (`/api/faculties`)
   - Test that endpoint returns expected faculty list
   - Verify data structure matches frontend expectations

## Manual QA Checklist

### Student Workflow
- [ ] Student can login exactly as before (v1 UI) using sample credentials
- [ ] Student sees v1 dashboard layout with the new upload widget
- [ ] Student can select a faculty member from the dropdown
- [ ] Student can upload a file with title and description
- [ ] Student receives confirmation of successful upload
- [ ] Student can see their submission in the history list
- [ ] Student can see status updates (pending, approved, rejected)

### Faculty Workflow
- [ ] Faculty can login exactly as before (v1 UI) using sample credentials
- [ ] Faculty can access the "Student Submissions" section
- [ ] Faculty can see submissions assigned to them
- [ ] Faculty can filter submissions by status
- [ ] Faculty can search submissions by student name, title, or file name
- [ ] Faculty can approve submissions
- [ ] Faculty can reject submissions
- [ ] Faculty cannot see submissions not assigned to them

### Security Testing
- [ ] Unauthenticated users cannot access upload or faculty endpoints
- [ ] Students cannot access faculty endpoints
- [ ] Faculty cannot access another faculty's submissions
- [ ] Proper error messages are displayed for unauthorized access

## Test Data

### Sample Credentials
- **Student**: username: `student`, password: `student123`
- **Faculty**: username: `faculty`, password: `faculty123`
- **Admin**: username: `admin`, password: `admin123`

### Test Files
- Small text file (1KB)
- Medium PDF file (1MB)
- Large image file (5MB)

### Faculty Test Data
- Dr. Smith (Computer Science)
- Prof. Johnson (Mathematics)
- Dr. Williams (Physics)
- Prof. Brown (Chemistry)

## Expected Results

### Database Validation
- [ ] Student uploads are stored in the `student_uploads` table
- [ ] Each record has the correct `student_id` and `faculty_id`
- [ ] File paths are stored securely outside the web root
- [ ] Status updates are correctly reflected in the database

### UI Validation
- [ ] All existing v1 functionality remains unchanged
- [ ] New features integrate seamlessly with existing UI
- [ ] Responsive design works on all screen sizes
- [ ] Error messages are clear and helpful

### Performance Validation
- [ ] File uploads complete within reasonable time
- [ ] Filtering and searching are responsive
- [ ] Large file uploads don't block the UI

## Rollback Plan

If issues are found during testing:
1. Revert the feature branch
2. Restore database from backup if migration was destructive
3. Redeploy previous build
4. Document issues and fix before next deployment attempt

## Success Criteria

All tests must pass in staging environment before production deployment:
- [ ] Unit tests pass with >90% coverage
- [ ] Integration tests pass
- [ ] Manual QA checklist completed
- [ ] Security testing passes
- [ ] Performance testing meets requirements