# Tokyo Story - Production Deployment Guide

## 🚀 Pre-Deployment Checklist

### ✅ Code Quality
- [ ] All tests passing
- [ ] No console.log statements in production code
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Error handling implemented

### ✅ Performance
- [ ] Images optimized with lazy loading
- [ ] Bundle size optimized
- [ ] CDN configured
- [ ] Caching headers set

### ✅ Security
- [ ] HTTPS enabled
- [ ] CORS configured
- [ ] Rate limiting enabled
- [ ] Environment variables secured
- [ ] Database credentials secured

### ✅ Monitoring
- [ ] Error tracking (Sentry) configured
- [ ] Performance monitoring enabled
- [ ] Health checks implemented
- [ ] Uptime monitoring set up

## 🔧 Deployment Steps

### 1. Backend Deployment (Render)

```bash
# 1. Connect your GitHub repository to Render
# 2. Set environment variables in Render dashboard
# 3. Deploy automatically on push to main branch

# Manual deployment (if needed)
git push origin main
```

### 2. Frontend Deployment (Vercel)

```bash
# 1. Connect your GitHub repository to Vercel
# 2. Set environment variables in Vercel dashboard
# 3. Deploy automatically on push to main branch

# Manual deployment (if needed)
vercel --prod
```

### 3. Database Setup

```bash
# 1. Create MongoDB Atlas cluster
# 2. Configure network access
# 3. Create database user
# 4. Update MONGODB_URI in environment variables
```

## 🔍 Health Checks

### Automated Health Check
```bash
# Run health check script
node deploy/health-check.js

# Continuous monitoring
node deploy/health-check.js --continuous --interval=5
```

### Manual Health Checks
- Backend: `https://tokyostorynew.onrender.com/api/health`
- Frontend: `https://tokyo-story-new.vercel.app`
- Database: Check MongoDB Atlas dashboard

## 🔄 Rollback Procedures

### Quick Rollback
```bash
# Rollback to previous commit
./deploy/rollback.sh previous

# Rollback to specific commit
./deploy/rollback.sh commit abc1234

# Check deployment status
./deploy/rollback.sh status
```

### Manual Rollback Steps
1. **Identify the issue**
   - Check error logs
   - Monitor user reports
   - Review performance metrics

2. **Stop the bleeding**
   - Disable problematic features
   - Implement temporary fixes
   - Communicate with users

3. **Rollback deployment**
   - Use rollback script
   - Or manually revert commits
   - Verify rollback success

4. **Post-rollback**
   - Monitor system health
   - Investigate root cause
   - Plan fix for next deployment

## 📊 Monitoring Setup

### 1. Sentry Error Tracking
- [ ] Create Sentry project
- [ ] Add DSN to environment variables
- [ ] Configure error filtering
- [ ] Set up alerts

### 2. Uptime Monitoring
- [ ] Set up UptimeRobot or Pingdom
- [ ] Monitor key endpoints
- [ ] Configure alert notifications
- [ ] Set up status page

### 3. Performance Monitoring
- [ ] Configure Web Vitals tracking
- [ ] Set up Google Analytics
- [ ] Monitor Core Web Vitals
- [ ] Track user experience metrics

## 🛡️ Security Checklist

### Environment Security
- [ ] All secrets in environment variables
- [ ] No hardcoded credentials
- [ ] Database access restricted
- [ ] API keys rotated regularly

### Application Security
- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] SQL injection prevention
- [ ] XSS protection enabled

### Infrastructure Security
- [ ] Firewall configured
- [ ] DDoS protection enabled
- [ ] Regular security updates
- [ ] Access logs monitored

## 📈 Performance Optimization

### Frontend Optimization
- [ ] Code splitting implemented
- [ ] Lazy loading enabled
- [ ] Image optimization
- [ ] Bundle size monitoring
- [ ] CDN configured

### Backend Optimization
- [ ] Database indexing
- [ ] Query optimization
- [ ] Caching implemented
- [ ] Connection pooling
- [ ] Load balancing

## 🚨 Incident Response

### Severity Levels
- **P0 (Critical)**: Complete service outage
- **P1 (High)**: Major feature broken
- **P2 (Medium)**: Minor feature issues
- **P3 (Low)**: Cosmetic issues

### Response Procedures
1. **Acknowledge** the incident
2. **Assess** the impact
3. **Communicate** with stakeholders
4. **Resolve** the issue
5. **Document** lessons learned

### Contact Information
- **On-call Engineer**: [Contact Info]
- **Product Manager**: [Contact Info]
- **DevOps Team**: [Contact Info]

## 📝 Post-Deployment

### Verification Steps
- [ ] All features working
- [ ] Performance metrics normal
- [ ] Error rates acceptable
- [ ] User feedback positive

### Documentation Updates
- [ ] Update deployment notes
- [ ] Document any issues
- [ ] Update runbooks
- [ ] Share lessons learned

## 🔧 Troubleshooting

### Common Issues

#### Backend Issues
```bash
# Check logs
heroku logs --tail

# Check database connection
node -e "console.log(process.env.MONGODB_URI)"

# Test API endpoints
curl https://tokyostorynew.onrender.com/api/health
```

#### Frontend Issues
```bash
# Check build logs
vercel logs

# Test locally
npm run build
npm run start

# Check environment variables
vercel env ls
```

#### Database Issues
- Check MongoDB Atlas dashboard
- Verify connection string
- Check network access rules
- Monitor connection limits

### Emergency Contacts
- **Hosting Provider**: [Support Contact]
- **Database Provider**: [Support Contact]
- **CDN Provider**: [Support Contact]
- **Domain Registrar**: [Support Contact]
