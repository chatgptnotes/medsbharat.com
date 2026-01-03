# Supabase Setup Guide

**Project:** MedsBharat.com
**Supabase Project ID:** hcacdavejbbzqzqjoqbp
**Date:** December 31, 2024

---

## ⚠️ IMPORTANT: Get Your Database Password

Before proceeding, you need to get your Supabase database password:

### Option 1: Check Your Email
When you created the Supabase project, you should have received an email with your database password.

### Option 2: Reset Password in Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/hcacdavejbbzqzqjoqbp/settings/database
2. Scroll to "Database password" section
3. Click "Reset database password"
4. Copy the new password

### Option 3: Find in Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/hcacdavejbbzqzqjoqbp/settings/database
2. Under "Connection string", click "URI"
3. The password is in the connection string

---

## Update Your .env File

Once you have the password, update these lines in `.env`:

```bash
# Replace YOUR_DB_PASSWORD with your actual password
DATABASE_URL="postgresql://postgres.hcacdavejbbzqzqjoqbp:YOUR_DB_PASSWORD@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

DIRECT_DATABASE_URL="postgresql://postgres.hcacdavejbbzqzqjoqbp:YOUR_DB_PASSWORD@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"
```

---

## Supabase Credentials Summary

### Project Details
- **Project Name:** medsbharat.com
- **Project ID:** hcacdavejbbzqzqjoqbp
- **Region:** Asia Pacific (Mumbai) - ap-south-1
- **Project URL:** https://hcacdavejbbzqzqjoqbp.supabase.co

### API Keys (Already in .env)
✅ **Anon Public Key:** eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
✅ **Service Role Key:** eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

### Database Connection
- **Host:** aws-0-ap-south-1.pooler.supabase.com
- **Port (Pooled):** 6543 (for connection pooling - PgBouncer)
- **Port (Direct):** 5432 (for migrations)
- **Database:** postgres
- **User:** postgres.hcacdavejbbzqzqjoqbp
- **Password:** [YOU NEED TO GET THIS]

---

## After Getting Password - Setup Steps

### Step 1: Update .env
Edit `/Users/murali/1backup/medsbharat.com/.env` and replace `YOUR_DB_PASSWORD`

### Step 2: Update prisma.config.ts
```bash
# The file should already use DIRECT_DATABASE_URL for migrations
# Verify it's correct
cat prisma.config.ts
```

### Step 3: Run Migrations
```bash
# This will create all tables in Supabase
npm run db:migrate
```

### Step 4: Seed Database
```bash
# This will add 6 pharmacies and 150+ medicines
npm run db:seed
```

### Step 5: Restart Dev Server
```bash
# Kill current server
lsof -i :3000 | grep LISTEN  # Get PID
kill <PID>

# Start fresh
npm run dev
```

### Step 6: Test
Visit http://localhost:3000 and search for "Metformin"

---

## Connection Types Explained

### DATABASE_URL (Port 6543 - Pooled)
```
postgresql://...@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Used for:**
- Next.js API routes (runtime queries)
- Production serverless functions
- Connection pooling (PgBouncer)

**Limitations:**
- Cannot run migrations
- Cannot use transactions with `BEGIN/COMMIT`
- Best for short-lived queries

### DIRECT_DATABASE_URL (Port 5432 - Direct)
```
postgresql://...@aws-0-ap-south-1.pooler.supabase.com:5432/postgres
```

**Used for:**
- Prisma migrations
- Database administration
- Long-running queries
- Transactions

**Note:** This is a direct connection, not pooled

---

## Prisma Configuration Update

Your `prisma.config.ts` should use `DIRECT_DATABASE_URL`:

```typescript
import "dotenv/config"
import { defineConfig } from "prisma/config"

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL,
  },
})
```

And `src/lib/prisma.ts` should use `DATABASE_URL` (pooled):

```typescript
const connectionString = process.env.DATABASE_URL
```

---

## Verify Connection

Test your connection:

```bash
# Install psql if needed (macOS)
brew install postgresql

# Connect directly
psql "postgresql://postgres.hcacdavejbbzqzqjoqbp:YOUR_PASSWORD@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"
```

If connected successfully, you'll see:
```
postgres=>
```

---

## Troubleshooting

### Error: "password authentication failed"
- Double-check your password in Supabase dashboard
- Make sure there are no extra spaces in .env
- Try resetting the password

### Error: "connection timeout"
- Check your internet connection
- Verify the host: `aws-0-ap-south-1.pooler.supabase.com`
- Try pinging: `ping aws-0-ap-south-1.pooler.supabase.com`

### Error: "prepared transactions not supported"
- You're using pooled connection (6543) for migrations
- Switch to DIRECT_DATABASE_URL (5432) in prisma.config.ts

### Migration fails with "relation already exists"
- The table already exists in Supabase
- Reset migrations: `npm run db:reset`
- Or manually drop tables in Supabase SQL Editor

---

## Supabase Dashboard Links

### Database
- **SQL Editor:** https://supabase.com/dashboard/project/hcacdavejbbzqzqjoqbp/sql
- **Table Editor:** https://supabase.com/dashboard/project/hcacdavejbbzqzqjoqbp/editor
- **Database Settings:** https://supabase.com/dashboard/project/hcacdavejbbzqzqjoqbp/settings/database

### API
- **API Docs:** https://supabase.com/dashboard/project/hcacdavejbbzqzqjoqbp/api
- **API Settings:** https://supabase.com/dashboard/project/hcacdavejbbzqzqjoqbp/settings/api

### Authentication
- **Auth Users:** https://supabase.com/dashboard/project/hcacdavejbbzqzqjoqbp/auth/users
- **Auth Settings:** https://supabase.com/dashboard/project/hcacdavejbbzqzqjoqbp/auth/settings

---

## Next Steps After Setup

1. **Enable Row Level Security (RLS)**
   - Go to Table Editor
   - For each table, enable RLS
   - Create policies for patient/pharmacy/admin access

2. **Set Up Authentication**
   - Configure email/password auth in Auth settings
   - Set up email templates
   - Configure redirect URLs

3. **Deploy to Vercel**
   - Push to GitHub
   - Connect to Vercel
   - Add environment variables
   - Deploy!

---

## Environment Variables for Vercel

When deploying to Vercel, add these environment variables:

```
DATABASE_URL=postgresql://postgres.hcacdavejbbzqzqjoqbp:YOUR_PASSWORD@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1

DIRECT_DATABASE_URL=postgresql://postgres.hcacdavejbbzqzqjoqbp:YOUR_PASSWORD@aws-0-ap-south-1.pooler.supabase.com:5432/postgres

NEXT_PUBLIC_SUPABASE_URL=https://hcacdavejbbzqzqjoqbp.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjYWNkYXZlamJienF6cWpvcWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxNjA3OTcsImV4cCI6MjA4MjczNjc5N30.NJx6EUhhU8wKo_eKQphvduYGtfTngN4qfqwmL8x3AKk

SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjYWNkYXZlamJienF6cWpvcWJwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzE2MDc5NywiZXhwIjoyMDgyNzM2Nzk3fQ.cULgvjB6DQZsx6PZD0RVdy9eNMDlNgrswLoq2r4EbRE

NEXTAUTH_SECRET=generate-new-secret-with-openssl-rand-base64-32
NEXTAUTH_URL=https://your-app.vercel.app
```

---

**Status:** Awaiting database password to continue setup
**Next:** Get password from Supabase dashboard and update .env file

**Version:** 1.2
**Date:** December 31, 2024
