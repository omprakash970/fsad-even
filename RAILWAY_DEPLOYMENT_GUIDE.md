# LoanFlow Backend - Railway Deployment Guide

## Step-by-Step Railway Deployment Instructions

### STEP 1: Prepare Your GitHub Repository

1. Ensure your code is pushed to GitHub:
```bash
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

2. Your repository structure should look like:
```
final-fsad/
├── loanflow-backend/
│   ├── src/
│   ├── pom.xml
│   ├── system.properties
│   └── ...
└── loanflow-frontend/
    ├── src/
    ├── package.json
    └── ...
```

---

### STEP 2: Create Railway Account & Project

1. Visit [https://railway.app](https://railway.app)
2. Sign up with GitHub (click "Sign up with GitHub")
3. Authorize Railway to access your GitHub account
4. Click "Create a New Project"

---

### STEP 3: Add MySQL Database Service

1. In your Railway project dashboard, click "Add a service"
2. Click "Database" → "MySQL"
3. Railway will automatically create a MySQL database
4. Note down the generated connection details shown in the dashboard

---

### STEP 4: Deploy Backend from GitHub

1. Click "Add a service" → "GitHub Repo"
2. Select `final-fsad` repository
3. Set the "Root Directory" to `loanflow-backend`
4. Click "Deploy"

---

### STEP 5: Configure Environment Variables

After deployment starts, configure these variables in Railway dashboard:

**Database Variables:**
- `DB_URL` = `jdbc:mysql://{{MYSQL_HOST}}:{{MYSQL_PORT}}/{{MYSQL_DB}}`
- `DB_USERNAME` = `{{MYSQL_USER}}`
- `DB_PASSWORD` = `{{MYSQL_PASSWORD}}`

**JWT Secret:**
- `JWT_SECRET` = `your_super_secret_key_which_should_be_long_enough_123456789_change_this_in_production`

**Mail Configuration (Gmail):**
- `MAIL_USERNAME` = `omprakashbandi583@gmail.com` (your Gmail address)
- `MAIL_PASSWORD` = `bjci xpgx dabt ojil` (your Gmail App Password)

**Optional:**
- `PORT` = `8080` (Railway sets this automatically)
- `SPRING_PROFILES_ACTIVE` = `prod`

---

### STEP 6: Wait for Deployment

1. Watch the deployment logs
2. Wait for "Build successful" message
3. Copy your Railway backend URL (looks like: `https://your-app-name.up.railway.app`)

---

### STEP 7: Update Frontend Configuration

Update your Netlify frontend's environment variable:

**In Netlify Dashboard:**
1. Go to Site settings → Build & deploy → Environment
2. Add new variable:
   - Key: `VITE_API_URL`
   - Value: `https://your-app-name.up.railway.app`

**Update frontend .env file locally:**
```env
VITE_API_URL=https://your-app-name.up.railway.app
```

Then redeploy frontend:
```bash
npm run build
git add .
git commit -m "Update API URL for production"
git push origin main
```

---

### STEP 8: Update Backend CORS Configuration

The CORS has already been updated in SecurityConfig.java to allow:
- `https://loanflow-frontend.netlify.app`
- `https://your-railway-backend.railway.app`

If you have a custom domain, update SecurityConfig.java with your exact URLs.

---

## Verification Checklist

✅ Backend deployed on Railway  
✅ MySQL database connected  
✅ Environment variables configured  
✅ Frontend deployed on Netlify  
✅ Frontend API_URL environment variable set  
✅ CORS configured for Netlify URL  
✅ Can sign up from frontend  
✅ Can login from frontend  
✅ JWT tokens working correctly  

---

## Testing After Deployment

### Test Sign Up:
```bash
curl -X POST https://your-railway-backend.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123",
    "fullName": "Test User",
    "role": "BORROWER"
  }'
```

### Test Login:
```bash
curl -X POST https://your-railway-backend.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123"
  }'
```

### Test Protected Endpoint (with JWT token):
```bash
curl -X GET https://your-railway-backend.railway.app/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## Troubleshooting

### Issue: Build fails with Java/Maven errors
**Solution:**
- Check `system.properties` exists with `java.runtime.version=17`
- Verify `pom.xml` has all dependencies
- Check logs for specific errors

### Issue: Database connection fails
**Solution:**
- Verify `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` are correctly set
- Check Railway MySQL service is running
- Use Railway's provided connection string

### Issue: CORS errors when calling from Netlify
**Solution:**
- Verify your exact Netlify URL in SecurityConfig.java
- Clear browser cache
- Check network tab for exact error message
- Verify backend returned proper CORS headers

### Issue: Email not sending
**Solution:**
- Verify `MAIL_USERNAME` and `MAIL_PASSWORD` are correct
- Check Gmail App Passwords (not your regular Gmail password)
- Verify email configuration in `application-prod.properties`

### Issue: JWT token errors
**Solution:**
- Verify `JWT_SECRET` is set and same value in dev/prod
- Check token expiration
- Clear browser localStorage and retry login

---

## Production Best Practices

1. **Never commit secrets to GitHub**
   - Use Railway environment variables
   - Use `.gitignore` for sensitive files

2. **Monitor your application**
   - Check Railway dashboard logs regularly
   - Set up alerts for deployment failures

3. **Backup your database**
   - Railway offers backup options
   - Enable automatic backups

4. **Update dependencies regularly**
   - Keep Spring Boot updated
   - Security patches are important

5. **Use strong JWT secret**
   - Generate a random 32+ character string
   - Update it periodically

---

## Useful Railway Commands

```bash
# View logs
railway logs

# SSH into container
railway shell

# Check environment variables
railway variables

# Deploy specific branch
railway deploy --branch main
```

---

## Support & Documentation

- Railway Docs: https://docs.railway.app
- Spring Boot: https://spring.io/projects/spring-boot
- MySQL: https://dev.mysql.com/doc
- JWT: https://jwt.io

