# 🚀 QUICK START - EMI PAYMENT SYSTEM

## Problem Fixed ✅
EMI schedules were empty because loan wasn't active. Now system auto-creates test data with an approved loan and 24 EMI schedules ready to pay!

---

## 3 Steps to See It Working

### Step 1: Start Backend
```bash
cd loanflow-backend
mvn clean spring-boot:run
```

Wait for:
```
✓ EMI schedules generated: 24 monthly EMIs
Tomcat started on port 8082
```

### Step 2: Start Frontend
```bash
cd loanflow-frontend
npm run dev
```

Opens: http://localhost:5173

### Step 3: Login & Pay
1. Click **Login**
2. Email: `borrower@loanflow.com`
3. Password: `borrower123`
4. Click **EMI Schedule** in sidebar
5. Click **[Pay]** on any UPCOMING EMI
6. Confirm payment in modal
7. Watch EMI change to ✓ PAID

---

## Credentials

| Role | Email | Password |
|------|-------|----------|
| Borrower | borrower@loanflow.com | borrower123 |
| Lender | lender@loanflow.com | lender123 |
| Admin | admin@loanflow.com | admin123 |

---

## What You'll See

### Borrower - EMI Schedule
- ✅ All 24 EMIs listed
- ✅ [Pay] buttons on each
- ✅ Payment details (Principal + Interest)
- ✅ Progress bar (0/24 → 1/24 after payment)

### Lender - Payments
- ✅ See incoming payments
- ✅ Payment ID, amount, borrower name
- ✅ Status: ✓ COMPLETED

### Admin - All Payments
- ✅ View all platform payments
- ✅ Search by ID/borrower/lender
- ✅ Summary statistics

---

## Test Loan Details

```
Loan: LOAN-TEST001
Amount: $50,000
Tenure: 24 months
Interest: 12% p.a.
Monthly EMI: $2,331.99
Borrower: John Doe
Lender: ABC Bank
Status: ACTIVE ✓
```

---

## Key Features Working

✅ 24 EMI schedules auto-generated  
✅ Each EMI has [Pay] button  
✅ Payment modal confirmation  
✅ Real-time status updates  
✅ Payment visible to borrower, lender, admin  
✅ Progress bar tracking  
✅ Complete payment history  

---

**That's it! System is ready to use. 🎉**

