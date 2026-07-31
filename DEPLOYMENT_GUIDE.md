# 🚀 Dawn Estate - Deployment Guide

## 📋 Step-by-Step Setup

### Step 1: Set Up MySQL Database

1. Create the database and tables using `database-mysql.sql`
2. Ensure the default admin user is created from the same script

### Step 2: Configure Environment

Set the following values in `.env`:
- `DATABASE_URL=mysql://root:@localhost:3306/dawn_estate`
- `JWT_SECRET=your-secret`
- `VITE_API_BASE_URL=http://localhost:3001/api`

### Step 3: Generate Prisma Client

```bash
npm run prisma:generate
```

### Step 4: Run Backend and Frontend

```bash
npm run server
npm run dev
```

### Step 5: Verify Everything Works

1. Test the API: http://localhost:3001/api/health
2. Test the Frontend: http://localhost:5173
3. Login with: `admin@dawnestate.com` / `Admin@2024!`

## 📝 Summary

1. ✅ Run `database-mysql.sql` in MySQL
2. ✅ Configure `.env`
3. ✅ Generate Prisma Client
4. ✅ Start backend and frontend
