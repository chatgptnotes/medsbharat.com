# URGENT: Database Connection Fix Required

## Current Issue
The Prisma database connection is failing with error: **"FATAL: Tenant or user not found"**

This means the database connection strings in `.env` are incorrect or outdated.

## What You Need to Do

### Step 1: Get Correct Connection Strings from Supabase

1. Open Supabase Dashboard: https://supabase.com/dashboard/project/hcacdavejbbzqzqjoqbp
2. Click **Settings** (gear icon in left sidebar)
3. Click **Database** in Settings menu
4. Scroll to **Connection string** section
5. You'll see several connection options:

#### Option A: Transaction Pooler (Recommended for App)
- Click on **Transaction** tab
- Connection mode: **Transaction**
- Copy the connection string
- It should look like: `postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true`
- Use this for `DATABASE_URL`

#### Option B: Direct Connection (Required for Migrations)
- Click on **Direct** tab
- Copy the connection string
- It should look like: `postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-ap-south-1.compute.internal.supabase.com:5432/postgres`
- Or: `postgresql://postgres.[PROJECT_REF]:[PASSWORD]@db.hcacdavejbbzqzqjoqbp.supabase.co:5432/postgres`
- Use this for `DIRECT_DATABASE_URL`

### Step 2: Update .env File

Replace the current DATABASE_URL and DIRECT_DATABASE_URL in your `.env` file with the NEW strings from Supabase:

```env
# Replace with Transaction Pooler string from Supabase
DATABASE_URL="postgresql://postgres.[YOUR_PROJECT_REF]:[YOUR_PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Replace with Direct Connection string from Supabase
DIRECT_DATABASE_URL="postgresql://postgres.[YOUR_PROJECT_REF]:[YOUR_PASSWORD]@db.hcacdavejbbzqzqjoqbp.supabase.co:5432/postgres"
```

**IMPORTANT:**
- Replace `[YOUR_PROJECT_REF]` with actual project reference
- Replace `[YOUR_PASSWORD]` with your actual database password (URL-encoded if it contains special characters)
- If password contains `@`, encode it as `%40`
- If password contains `!`, encode it as `%21`

### Step 3: Test Connection

After updating `.env`, test the connection:

```bash
npx prisma db pull
```

If successful, you should see: "Introspection completed successfully"

### Step 4: Run Migrations

Once connection is working:

```bash
# Option A: Via Prisma (if DIRECT_DATABASE_URL is set)
npx prisma db push

# Option B: Via Supabase SQL Editor (recommended)
# Copy content from prisma/migrations/004_seed_medicines.sql
# Paste and run in Supabase SQL Editor
```

## Why This Happened

The connection string might be:
1. Using old/outdated credentials
2. Pointing to wrong database instance
3. Using incorrect project reference
4. Password not properly URL-encoded

## Current Workaround

Until you fix the connection, I'll proceed with:
1. Building new features with mock data
2. All features will work in UI
3. Once database is connected, everything will work with real data

## Verification Checklist

- [ ] Got Transaction Pooler URL from Supabase Dashboard
- [ ] Got Direct Connection URL from Supabase Dashboard
- [ ] Updated DATABASE_URL in .env
- [ ] Updated DIRECT_DATABASE_URL in .env
- [ ] URL-encoded password if it contains special characters
- [ ] Tested with `npx prisma db pull`
- [ ] Successfully connected to database
- [ ] Ran migrations/seed scripts

---

**Next Steps After Fixing:**
1. Run medicine seed script (004_seed_medicines.sql)
2. Test search API: `curl http://localhost:3000/api/search?q=dolo&type=medicine`
3. Continue building new features

**Status:** Waiting for correct Supabase connection strings
**Last Updated:** December 31, 2024
