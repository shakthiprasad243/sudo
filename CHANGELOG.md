# Changelog

## [1.2.0] - 2023-06-25

### Added
- Student upload functionality allowing students to submit assignments
- Faculty selection feature enabling students to choose faculty recipients
- Faculty dashboard for reviewing and managing student submissions
- New `student_uploads` database table for tracking assignments
- API endpoints for upload management and faculty assignments
- UI components for student uploads and faculty dashboard

### Changed
- Updated navigation to include "My Uploads" for students
- Updated navigation to include "Student Submissions" for faculty
- Enhanced dashboard with additional functionality while preserving existing layout

### Security
- Implemented role-based access control for upload features
- Added file type and size validation
- Secured file storage outside web root

## [1.1.0] - 2023-06-10

### Added
- Initial release of EduManage Pro with core features:
  - Timetable management
  - Attendance tracking
  - User authentication
  - Role-based dashboards

### Changed
- None

### Deprecated
- None

### Removed
- None

### Fixed
- None

### Security
- Implemented secure authentication system
- Added role-based access controls
- Secured database connections

## [1.0.0] - 2023-05-15

### Added
- Initial project setup
- Basic project structure
- Development environment configuration

[1.2.0]: https://github.com/edumanage/edumanage-pro/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/edumanage/edumanage-pro/compare/v1.0.0...v1.1.0