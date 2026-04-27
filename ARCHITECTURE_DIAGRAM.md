# LoanFlow Architecture & Deployment Diagram

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PRODUCTION ENVIRONMENT                       │
└─────────────────────────────────────────────────────────────────────┘

                              INTERNET
                                 │
                    ┌────────────┴────────────┐
                    │                         │
         ┌──────────▼──────────┐    ┌────────▼─────────┐
         │  NETLIFY (CDN)      │    │   NETLIFY EDGE   │
         │  Frontend Hosting   │    │   Functions      │
         │                     │    │   (Optional)     │
         │ loanflow-frontend   │    │                  │
         │ .netlify.app        │    └──────────────────┘
         └──────────┬──────────┘
                    │
        HTTPS (Port 443)
                    │
         ┌──────────▼───────────────────┐
         │   User's Browser             │
         │                              │
         │  React + Vite Application    │
         │  - Dashboard                 │
         │  - Loan Management           │
         │  - EMI Scheduler             │
         │  - User Management           │
         └──────────┬───────────────────┘
                    │
                    │ API Calls (REST)
                    │ HTTPS (Port 443)
                    │
         ┌──────────▼─────────────────────────────┐
         │     RAILWAY (Backend)                  │
         │     Spring Boot Application            │
         │                                        │
         │  ┌──────────────────────────────┐     │
         │  │  APIs                        │     │
         │  ├──────────────────────────────┤     │
         │  │ - Auth & Login               │     │
         │  │ - Loan Management            │     │
         │  │ - User Management            │     │
         │  │ - EMI Calculations           │     │
         │  │ - Payment Processing         │     │
         │  │ - Risk Analysis              │     │
         │  └──────────────────────────────┘     │
         │                                        │
         │  ┌──────────────────────────────┐     │
         │  │  Business Logic              │     │
         │  ├──────────────────────────────┤     │
         │  │ - Loan Service               │     │
         │  │ - OTP Service (Gmail)        │     │
         │  │ - Payment Service            │     │
         │  │ - Risk Calculator            │     │
         │  │ - Report Generator           │     │
         │  └──────────────────────────────┘     │
         │                                        │
         │  loanflow-backend.railway.app         │
         └──────────┬─────────────────────────────┘
                    │
        JDBC (Port 3306)
                    │
         ┌──────────▼──────────────────┐
         │  RAILWAY MySQL Database     │
         │                             │
         │  loan_management (DB)       │
         │  ├─ users                   │
         │  ├─ borrowers               │
         │  ├─ lenders                 │
         │  ├─ loans                   │
         │  ├─ emi_schedules           │
         │  ├─ payments                │
         │  ├─ loan_requests           │
         │  ├─ loan_offers             │
         │  ├─ risk_reports            │
         │  ├─ otp_records             │
         │  └─ security_logs           │
         │                             │
         └─────────────────────────────┘
```

---

## Deployment Flow Diagram

```
┌─────────────────────┐
│  Your Local Machine │
│  (Development)      │
└──────────┬──────────┘
           │
           │ git push
           │
    ┌──────▼──────────┐
    │  GitHub         │
    │  Repository     │
    │  (loanflow)     │
    └──────┬──────────┘
           │
    ┌──────┴──────────────────────────┐
    │                                 │
    │ Webhook Triggers                │
    │                                 │
┌───▼─────────────────┐      ┌────────▼─────────────┐
│  RAILWAY            │      │  NETLIFY             │
│  (Backend)          │      │  (Frontend)          │
│                     │      │                      │
│ 1. Clone repo       │      │ 1. Clone repo        │
│ 2. Install deps     │      │ 2. Install deps      │
│ 3. Build (mvn)      │      │ 3. Build (npm)       │
│ 4. Start service    │      │ 4. Generate dist/    │
│ 5. Configure DB     │      │ 5. Publish to CDN    │
│ 6. Apply migrations │      │ 6. Assign domain     │
│ 7. Ready for API    │      │ 7. Ready for users   │
│                     │      │                      │
│ URL: xxxxxx.app/api │      │ URL: xxxxx.netlify.app
└─────────────────────┘      └──────────────────────┘
```

---

## Data Flow Diagram

```
┌──────────────────┐
│  User Browser    │
│                  │
│  (1) User Action │
└────────┬─────────┘
         │
         │ HTTP Request
         │ + Auth Token
         │
    ┌────▼─────────────────┐
    │  Netlify CDN         │
    │  Frontend (React)    │
    │                      │
    │  (2) Process Request │
    │  (3) Call API        │
    └────┬─────────────────┘
         │
         │ REST API Call
         │ JSON Payload
         │ HTTPS
         │
    ┌────▼──────────────────────┐
    │  Railway Backend          │
    │  Spring Boot              │
    │                           │
    │  (4) Receive Request      │
    │  (5) Validate Request     │
    │  (6) Authenticate         │
    │  (7) Business Logic       │
    │  (8) Build Response       │
    └────┬──────────────────────┘
         │
         │ JDBC Query
         │
    ┌────▼──────────────────┐
    │  Railway MySQL        │
    │  Database             │
    │                       │
    │  (9) Execute Query    │
    │  (10) Return Data     │
    └────┬──────────────────┘
         │
         │ Query Result
         │
    ┌────▼──────────────────────┐
    │  Backend Processing       │
    │                           │
    │  (11) Format Response     │
    │  (12) Serialize JSON      │
    │  (13) Add Headers         │
    └────┬──────────────────────┘
         │
         │ JSON Response
         │ HTTP 200/400/500
         │
    ┌────▼──────────────────┐
    │  Frontend Processing  │
    │                       │
    │  (14) Parse JSON      │
    │  (15) Update State    │
    │  (16) Re-render UI    │
    │  (17) Display Data    │
    └────┬──────────────────┘
         │
         │ User Sees Update
         │
    ┌────▼──────────────┐
    │  User Browser     │
    │  (18) Updated UI  │
    └───────────────────┘
```

---

## Environment Configuration

```
LOCAL DEVELOPMENT
├── Frontend: http://localhost:5173
├── Backend: http://localhost:8082
├── Database: localhost:3306
├── Config: application.properties
└── .env: Development values

        ↓ Push to GitHub ↓

PRODUCTION
├── Frontend: https://loanflow-frontend.netlify.app
│   ├── Config: .env.production
│   ├── API URL: https://loanflow-backend.railway.app/api
│   └── Hosting: Netlify CDN (Global)
│
├── Backend: https://loanflow-backend.railway.app
│   ├── Config: application-prod.properties
│   ├── Port: 8080 (exposed via Railway)
│   └── Hosting: Railway Container
│
└── Database: Railway MySQL
    ├── Host: railway.internal
    ├── Port: 3306
    └── Managed by: Railway
```

---

## Deployment Timeline

```
Timeline: Day 1 (Deployment Day)

08:00 AM - START
├─ Verify all code is ready
├─ Create GitHub repo
└─ Push code

08:15 AM - BACKEND DEPLOYMENT
├─ Create Railway project
├─ Deploy backend (~5 min)
├─ Add MySQL service (~3 min)
├─ Set environment variables
├─ Configure build commands
├─ Wait for first deploy (~10 min)
├─ Test backend API (✓ API working)
└─ Note Railway URL

09:00 AM - FRONTEND DEPLOYMENT
├─ Update .env.production with Railway URL
├─ Commit changes to GitHub
├─ Create Netlify project
├─ Configure build settings
├─ Deploy frontend (~3 min)
├─ Wait for build complete (~2 min)
└─ Note Netlify URL

09:15 AM - INTEGRATION
├─ Update CORS in backend
├─ Test frontend-backend connection
├─ Test login functionality
├─ Test key features
└─ Monitor logs

10:00 AM - COMPLETE ✓
├─ Frontend: Live on Netlify
├─ Backend: Live on Railway
├─ Database: Connected & Working
├─ All Systems: Operational
└─ Ready for Users
```

---

## Database Schema Overview

```
┌─────────────────────────┐
│     USERS (Base)        │
├─────────────────────────┤
│ id (PK)                 │
│ email                   │
│ full_name               │
│ password                │
│ role (ADMIN/USER)       │
│ created_at              │
│ updated_at              │
└──────┬──────────────────┘
       │
       ├─────────────────────────────┐
       │                             │
    ┌──▼──────────────┐    ┌────────▼───────┐
    │  BORROWERS      │    │  LENDERS        │
    ├─────────────────┤    ├─────────────────┤
    │ id (PK)         │    │ id (PK)         │
    │ user_id (FK)    │    │ user_id (FK)    │
    │ credit_score    │    │ company_name    │
    │ kyc_verified    │    │ total_disbursed │
    │ risk_level      │    │ active_loans    │
    │ active_loans    │    └────────────────┘
    └──┬──────────────┘
       │
    ┌──▼─────────────┐
    │  LOANS          │
    ├─────────────────┤
    │ id (PK)         │
    │ borrower_id (FK)│
    │ lender_id (FK)  │
    │ amount          │
    │ interest_rate   │
    │ tenure          │
    │ status          │
    │ created_at      │
    └──┬──────────────┘
       │
       ├──────────────────────┐
       │                      │
    ┌──▼──────────────┐   ┌──▼───────────┐
    │ EMI_SCHEDULES   │   │ PAYMENTS     │
    ├────────────────┤   ├──────────────┤
    │ id (PK)        │   │ id (PK)      │
    │ loan_id (FK)   │   │ loan_id (FK) │
    │ month          │   │ amount       │
    │ emi_amount     │   │ status       │
    │ principal      │   │ payment_date │
    │ interest       │   │ method       │
    │ balance        │   │ created_at   │
    │ status         │   └──────────────┘
    └────────────────┘

Plus: LOAN_REQUESTS, LOAN_OFFERS, RISK_REPORTS, 
      SECURITY_LOGS, OTP_RECORDS
```

---

## Service Dependencies

```
Frontend Dependencies:
├─ React 18+ (UI Framework)
├─ Vite (Build Tool)
├─ Axios (HTTP Client)
├─ React Router (Routing)
├─ TailwindCSS (Styling)
└─ Context API (State Management)

Backend Dependencies:
├─ Spring Boot 4.0.5
├─ Spring Data JPA (ORM)
├─ Spring Security (Auth)
├─ Spring Web (REST APIs)
├─ MySQL Connector (Database)
├─ JWT (Authentication)
├─ Lombok (Boilerplate reduction)
└─ Jakarta Mail (Email)

Infrastructure:
├─ Railway (Backend Hosting)
│  ├─ Container Platform
│  ├─ MySQL Database
│  ├─ Environment Variables
│  └─ Auto-scaling
│
├─ Netlify (Frontend Hosting)
│  ├─ Static Site Hosting
│  ├─ Global CDN
│  ├─ Continuous Deployment
│  └─ Edge Functions
│
└─ GitHub (Version Control)
   ├─ Code Repository
   ├─ Webhooks
   └─ Deployment Triggers
```

---

## Monitoring & Logging Stack

```
┌────────────────────────────────┐
│  LOGGING & MONITORING          │
└────────────────────────────────┘

Frontend (Netlify):
├─ Build Logs
├─ Deployment Logs
├─ Function Logs
├─ Edge Logs
└─ Analytics

Backend (Railway):
├─ Application Logs
├─ Database Logs
├─ Service Logs
├─ Error Logs
└─ Performance Metrics

Database (Railway MySQL):
├─ Query Logs
├─ Connection Logs
├─ Slow Query Logs
└─ Resource Usage

User Monitoring:
├─ Browser Console Errors
├─ API Response Times
├─ Error Tracking
└─ Usage Analytics
```

---

**Diagram Created:** April 8, 2026  
**System Version:** LoanFlow v1.0  
**Environment:** Production

This provides a complete visual overview of how the system works together!

