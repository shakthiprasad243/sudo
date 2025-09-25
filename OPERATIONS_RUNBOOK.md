# Operations Runbook: Student Upload and Faculty Selection Features

## Overview
This document provides operational guidance for the student upload and faculty selection features in EduManage Pro.

## Deployment Process

### Pre-deployment Checklist
- [ ] Verify database migration script
- [ ] Confirm backup of current database
- [ ] Review configuration settings
- [ ] Test in staging environment
- [ ] Schedule maintenance window

### Deployment Steps
1. **Database Migration**
   ```sql
   -- Apply the migration script
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

2. **Backend Deployment**
   - Deploy updated backend code
   - Verify API endpoints are accessible
   - Test authentication and authorization

3. **Frontend Deployment**
   - Deploy updated frontend code
   - Verify new components load correctly
   - Test user workflows

4. **Post-deployment Verification**
   - [ ] Verify student can upload assignments
   - [ ] Verify faculty can access submissions
   - [ ] Verify database records are created
   - [ ] Verify file storage is working

## Monitoring

### Key Metrics to Monitor
- Upload success rate
- API response times
- Authentication failures
- File storage usage
- Database performance

### Logging
- All upload attempts (success/failure)
- Faculty actions (approve/reject)
- Authentication events
- Error conditions

### Alerting
- Upload failure rate exceeds 5%
- API response time > 5 seconds
- Database errors
- Storage space < 10% remaining

## Troubleshooting

### Common Issues

#### Upload Failures
**Symptoms**: Students report upload errors
**Diagnosis**:
1. Check file size limits
2. Verify storage permissions
3. Review error logs
4. Test with sample files

**Resolution**:
- Adjust configuration settings
- Fix file permissions
- Clear temporary storage
- Restart services if needed

#### Faculty Cannot See Submissions
**Symptoms**: Faculty report missing submissions
**Diagnosis**:
1. Verify faculty-student assignments in database
2. Check faculty ID in upload records
3. Review authorization logic
4. Test API endpoints

**Resolution**:
- Correct database records
- Fix authorization logic
- Clear caches
- Restart services

#### Performance Issues
**Symptoms**: Slow response times
**Diagnosis**:
1. Check database query performance
2. Review file storage performance
3. Monitor system resources
4. Analyze logs for bottlenecks

**Resolution**:
- Optimize database queries
- Add database indexes
- Scale file storage
- Implement caching

## Backup and Recovery

### Database Backup
```bash
# Daily backup script
mysqldump -u username -p database_name student_uploads > backups/student_uploads_$(date +%Y%m%d).sql
```

### File Storage Backup
- Use cloud storage versioning
- Implement regular backup schedules
- Test restore procedures monthly

### Recovery Process
1. Restore database from backup
2. Restore file storage from backup
3. Verify data integrity
4. Test functionality

## Scaling

### Horizontal Scaling
- Load balance API servers
- Distribute file storage
- Use CDN for static assets

### Vertical Scaling
- Increase server resources
- Optimize database configuration
- Implement caching layers

## Security

### Regular Audits
- Review access logs
- Verify file permissions
- Check for unauthorized access attempts
- Update security patches

### Incident Response
1. Isolate affected systems
2. Preserve evidence
3. Notify stakeholders
4. Implement fixes
5. Document incident

## Maintenance

### Regular Tasks
- Weekly: Review logs and metrics
- Monthly: Performance optimization
- Quarterly: Security audit
- Annually: Infrastructure review

### Database Maintenance
- Optimize tables monthly
- Update statistics
- Archive old records
- Monitor growth trends

## Rollback Procedure

### When to Rollback
- Critical bugs in production
- Security vulnerabilities
- Performance degradation
- Data corruption

### Rollback Steps
1. Stop application servers
2. Restore database from backup
3. Deploy previous code version
4. Verify functionality
5. Monitor for issues
6. Document rollback reason

## Contact Information

### Development Team
- Lead Developer: [Name, Email, Phone]
- Backend Developer: [Name, Email, Phone]
- Frontend Developer: [Name, Email, Phone]

### Operations Team
- System Administrator: [Name, Email, Phone]
- Database Administrator: [Name, Email, Phone]

### Support
- Level 1 Support: [Contact Information]
- Level 2 Support: [Contact Information]
- Emergency Contact: [Contact Information]