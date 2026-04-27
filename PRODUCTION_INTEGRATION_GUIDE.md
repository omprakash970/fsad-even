# Frontend + Backend Integration Guide

## LoanFlow Frontend on Netlify + Backend on Railway

### 1. Frontend Netlify Configuration

**Netlify Environment Variables:**
```
VITE_API_URL = https://your-railway-backend.up.railway.app
```

**Update your frontend .env file:**
```env
# Development
VITE_API_URL=http://localhost:8082

# This gets overridden by Netlify environment variable in production
```

**Frontend Build Settings (Netlify Dashboard):**
- Build command: `npm run build`
- Publish directory: `dist`
- Environment: Add `VITE_API_URL` variable

### 2. Railway Backend Configuration

**Environment Variables (in Railway Dashboard):**

```ini
# Database
DB_URL=jdbc:mysql://{{MYSQL_HOST}}:{{MYSQL_PORT}}/{{MYSQL_DB}}
DB_USERNAME={{MYSQL_USER}}
DB_PASSWORD={{MYSQL_PASSWORD}}

# JWT
JWT_SECRET=your_secure_secret_key_change_this_in_production

# Mail (Gmail)
MAIL_USERNAME=omprakashbandi583@gmail.com
MAIL_PASSWORD=bjci xpgx dabt ojil

# Spring
SPRING_PROFILES_ACTIVE=prod
```

### 3. CORS Configuration (Already Updated)

SecurityConfig.java now allows:
- ✅ `http://localhost:5173` (local dev)
- ✅ `https://loanflow-frontend.netlify.app` (Netlify production)
- ✅ `https://your-railway-backend.railway.app` (Railway backend)

### 4. API Integration in React

Your apiClient.js should use:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8082';

export const api = {
  auth: {
    register: (data) => fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),
    
    login: (data) => fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),
  }
};
```

### 5. Deployment Steps

#### Step 1: Deploy Backend to Railway
1. Go to railway.app
2. Connect GitHub repository
3. Add MySQL database
4. Set environment variables
5. Deploy

#### Step 2: Update Frontend
```bash
cd loanflow-frontend

# Update .env with your Railway URL
echo "VITE_API_URL=https://your-railway-backend.up.railway.app" > .env.production

# Build and push
npm run build
git add .
git commit -m "Update API URL for production"
git push origin main
```

#### Step 3: Configure Netlify
1. Go to netlify.com
2. Connect your GitHub repo (loanflow-frontend)
3. Set environment variable: `VITE_API_URL=https://your-railway-backend.up.railway.app`
4. Deploy

### 6. Testing Workflow

**Test Sign Up:**
1. Go to https://loanflow-frontend.netlify.app
2. Click "Sign Up"
3. Enter email, password, name, role
4. Click Submit
5. Should receive OTP via email

**Test Login:**
1. Go to https://loanflow-frontend.netlify.app
2. Click "Login"
3. Enter email and password
4. Should receive JWT token
5. Should redirect to dashboard

**Test Protected Routes:**
1. Check localStorage for `token`
2. All subsequent requests should include Authorization header
3. Token should validate against backend

### 7. Common Issues & Solutions

#### Issue: CORS Error
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Solution:**
- Verify exact Netlify URL in SecurityConfig.java
- Rebuild backend
- Redeploy to Railway
- Clear browser cache

#### Issue: API 404 Not Found
**Solution:**
- Verify VITE_API_URL is correct
- Check network tab to see full URL being called
- Verify backend endpoints exist

#### Issue: Authentication Failed
**Solution:**
- Check email/password are correct
- Verify database has the user
- Check JWT_SECRET is set in Railway
- Look at backend logs for errors

#### Issue: Email Not Sending
**Solution:**
- Verify Gmail app password (not regular password)
- Check email in MAIL_USERNAME variable
- Verify SMTP settings in application-prod.properties
- Check backend logs for email errors

### 8. Monitoring

**Check Backend Status:**
```bash
curl https://your-railway-backend.up.railway.app/actuator/health
# Should return 200 OK
```

**Check API Response:**
```bash
curl https://your-railway-backend.up.railway.app/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}'
```

**View Railway Logs:**
- Go to Railway dashboard
- Click your service
- View deployment logs
- Monitor errors

### 9. Production Checklist

- [ ] JWT_SECRET changed from default value
- [ ] Gmail app password configured correctly
- [ ] Database backups enabled
- [ ] Frontend environment variables set
- [ ] CORS origins updated with production URLs
- [ ] SSL/HTTPS enabled (Railway provides this)
- [ ] API testing completed
- [ ] Sign up flow working
- [ ] Login flow working
- [ ] Protected routes working
- [ ] Email notifications working

### 10. Useful Links

- Railway Dashboard: https://railway.app/dashboard
- Netlify Dashboard: https://app.netlify.com
- Gmail App Passwords: https://myaccount.google.com/apppasswords
- Railway Docs: https://docs.railway.app
- Netlify Docs: https://docs.netlify.com

---

**Your Production URLs:**
- Frontend: `https://loanflow-frontend.netlify.app` (will be set after deployment)
- Backend: `https://your-railway-backend.up.railway.app` (will be set after deployment)

Replace these placeholders with actual URLs after deployment!

