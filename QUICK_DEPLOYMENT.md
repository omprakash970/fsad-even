# LoanFlow Deployment - Quick Setup

This guide provides step-by-step instructions for deploying LoanFlow to production.

## 🚀 Quick Start (15 minutes)

### Prerequisites Checklist
- [ ] GitHub account created
- [ ] Railway account created (https://railway.app)
- [ ] Netlify account created (https://netlify.com)
- [ ] Git installed locally
- [ ] Backend and Frontend ready

---

## PART 1: BACKEND DEPLOYMENT (Railway)

### Step 1: Prepare Local Environment
```bash
cd C:\Users\Oppie_549\final-fsad

# Initialize git if not already done
git init
git add .
git commit -m "Initial commit - LoanFlow"
git branch -M main
```

### Step 2: Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `loanflow`
3. Make it **Public**
4. Click "Create repository"
5. Follow the instructions to push your code:

```bash
git remote add origin https://github.com/YOUR_USERNAME/loanflow.git
git push -u origin main
```

### Step 3: Deploy to Railway

#### A. Create Railway Project
1. Go to https://railway.app
2. Click **"New Project"**
3. Select **"Deploy from GitHub"**
4. Click **"Configure GitHub App"** if first time
5. Authorize Railway
6. Select your `loanflow` repository
7. Select the **root** as the directory (or leave blank)
8. Click **"Deploy"**

#### B. Add MySQL Database
1. In Railway project dashboard
2. Click **"+ New Service"**
3. Select **"Database"** → **"MySQL"**
4. Wait for MySQL service to start

#### C. Configure Environment Variables
In Railway, go to: **Project Settings** → **Environment**

Add these variables:

```
DB_URL=mysql://root:PASSWORD@your-db-host:3306/railway
DB_USERNAME=root
DB_PASSWORD=GET_FROM_MYSQL_SERVICE
JWT_SECRET=your_super_secret_key_which_should_be_long_enough_123456789_CHANGE_THIS
MAIL_USERNAME=omprakashbandi583@gmail.com
MAIL_PASSWORD=bjci xpgx dabt ojil
SPRING_PROFILES_ACTIVE=prod
PORT=8080
```

**To get MySQL credentials:**
1. Click on MySQL service in Railway
2. Go to **Variables** tab
3. Copy `MYSQL_URL` and break it down to get username, password, host

#### D. Set Build & Start Commands
In Railway, go to: **Settings** → **Build & Deploy**

**Build Command:**
```bash
cd loanflow-backend && mvn clean package -DskipTests
```

**Start Command:**
```bash
java -jar loanflow-backend/target/loanflow-backend-0.0.1-SNAPSHOT.jar
```

#### E. Deploy
1. Click **"Deploy"** button
2. Wait 5-10 minutes for build to complete
3. Once successful, note your backend URL: `https://xxxx.railway.app`

---

## PART 2: FRONTEND DEPLOYMENT (Netlify)

### Step 1: Update Frontend Configuration

**File:** `loanflow-frontend/.env.production`

```env
VITE_API_URL=https://YOUR_RAILWAY_BACKEND_URL.railway.app/api
VITE_APP_NAME=LoanFlow
```

**Replace** `YOUR_RAILWAY_BACKEND_URL` with actual Railway URL

### Step 2: Deploy to Netlify

#### A. Connect to Netlify
1. Go to https://netlify.com
2. Click **"Add new site"**
3. Select **"Import an existing project"**
4. Choose **"GitHub"**
5. Authorize Netlify
6. Select your `loanflow` repository

#### B. Configure Build Settings
Set the following:

| Field | Value |
|-------|-------|
| Base directory | `loanflow-frontend` |
| Build command | `npm run build` |
| Publish directory | `loanflow-frontend/dist` |

#### C. Add Environment Variables
In Netlify: **Site settings** → **Build & Deploy** → **Environment**

Add:
```
VITE_API_URL=https://YOUR_RAILWAY_BACKEND_URL.railway.app/api
```

#### D. Deploy
1. Click **"Deploy site"**
2. Wait for build to complete
3. Your frontend URL: `https://loanflow-frontend.netlify.app`

---

## PART 3: CONNECT FRONTEND & BACKEND

### Update Backend CORS

**File:** `loanflow-backend/src/main/java/com/klef/loanflowbackend/config/SecurityConfig.java`

Add this CORS configuration (if not exists):

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList(
        "http://localhost:5173",
        "http://localhost:3000",
        "https://loanflow-frontend.netlify.app",  // Replace with your actual Netlify URL
        "https://your-domain.com"  // Optional: custom domain
    ));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    configuration.setMaxAge(3600L);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

### Commit and Push Changes
```bash
git add .
git commit -m "Configure production deployment"
git push origin main
```

Both Railway and Netlify will automatically redeploy!

---

## ✅ VERIFICATION CHECKLIST

After deployment:

### Test Backend
```bash
# Replace with your actual Railway URL
curl https://your-railway-backend.railway.app/api/auth/test
```

### Test Frontend
1. Open `https://loanflow-frontend.netlify.app`
2. Try login with test credentials:
   - **Admin:** admin@loanflow.com / admin123
   - **Borrower:** borrower@loanflow.com / borrower123
3. Test functionality (apply loan, make payment, etc.)

### Check Logs

**Railway Backend Logs:**
- Go to Railway Dashboard
- Click your project
- Select service from sidebar
- Go to **Logs** tab

**Netlify Frontend Logs:**
- Go to Netlify Dashboard
- Click your site
- Go to **Deploys** tab
- Check build logs and live logs

---

## 🔧 TROUBLESHOOTING

### Problem: Backend won't start
**Solution:**
- Check Railway logs for errors
- Verify all environment variables are set
- Ensure `PORT=8080` is set

### Problem: Database connection fails
**Solution:**
- Verify `DB_URL` format
- Check MySQL service is running in Railway
- Get correct credentials from MySQL service variables

### Problem: CORS errors on frontend
**Solution:**
- Update CORS origins in backend SecurityConfig
- Include your actual Netlify URL
- Redeploy backend after changes

### Problem: Emails not sending
**Solution:**
- Verify Gmail credentials are correct
- Check if Gmail account has "App Passwords" enabled
- Ensure `MAIL_USERNAME` and `MAIL_PASSWORD` match

### Problem: Frontend still calling localhost
**Solution:**
- Check `.env.production` has correct `VITE_API_URL`
- Clear browser cache
- Netlify redeploy should pick up env variables

---

## 📚 USEFUL LINKS

- Railway Dashboard: https://railway.app
- Netlify Dashboard: https://app.netlify.com
- Your Backend: https://YOUR_RAILWAY_URL.railway.app/api
- Your Frontend: https://loanflow-frontend.netlify.app

---

## 💡 TIPS FOR SUCCESS

1. **Always test locally first** before deploying
2. **Keep environment variables secure** - never commit sensitive data
3. **Monitor logs regularly** during first deployment
4. **Set up auto-deploy** - both Railway and Netlify support GitHub webhooks
5. **Keep backups** of your database
6. **Test user flows** thoroughly after deployment

---

## 🎉 CONGRATULATIONS!

Your LoanFlow application is now live! 

- **Frontend URL:** Share this with users
- **Backend API:** Used by frontend automatically
- **Admin Panel:** Accessible from frontend

Happy Deploying! 🚀

