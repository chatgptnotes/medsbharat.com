# Vercel Database Connection Fix

## Problem
Vercel's serverless environment cannot connect to Supabase using either:
- Port 5432 (Direct connection)
- Port 6543 (Session pooler on db.{project}.supabase.co)

## Root Cause
Supabase requires using a specific Transaction Mode pooler URL for serverless environments like Vercel.

## Solution Steps

### 1. Get Transaction Mode Connection String from Supabase

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/hcacdavejbbzqzqjoqbp
2. Navigate to: **Settings** → **Database** → **Connection Pooling**
3. Select: **Transaction Mode**
4. Copy the connection string (it should look like):
   ```
   postgresql://postgres.{project-ref}:[YOUR-PASSWORD]@aws-0-{region}.pooler.supabase.com:5432/postgres
   ```

### 2. Update Vercel Environment Variable

Run this command (replace `{YOUR-PASSWORD}` with your actual Supabase password):

```bash
printf "postgresql://postgres.hcacdavejbbzqzqjoqbp:[YOUR-PASSWORD]@aws-0-{region}.pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=1" | vercel env add DATABASE_URL production
```

### 3. Remove old DATABASE_URL

```bash
vercel env rm DATABASE_URL production
```

Then re-add the correct one from step 2.

### 4. Redeploy

```bash
vercel --prod
```

## Alternative: Use Supabase JS Client

If the pooler still doesn't work, we can refactor to use `@supabase/supabase-js` instead of Prisma for database operations in serverless functions.

## Current Status

✅ Database schema synced to production
✅ Tables exist in Supabase
❌ Vercel cannot connect to database (networking issue)

## Test Command

After fixing:
```bash
curl -s https://www.medsbharat.com/api/test-db-connection | jq .
```

Should return:
```json
{
  "success": true,
  "message": "Database connection successful",
  "userCount": 2
}
```

## Notes

- Current DATABASE_URL uses: `db.hcacdavejbbzqzqjoqbp.supabase.co:6543`
- This doesn't work from Vercel serverless
- Need Transaction Mode pooler: `aws-0-{region}.pooler.supabase.com:5432`
- Password in URL needs to be URL-encoded: `@` → `%40`
