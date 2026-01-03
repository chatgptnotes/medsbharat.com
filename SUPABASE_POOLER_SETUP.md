# Supabase Pooler Setup for Vercel + Prisma

## Problem Identified

**Error in Vercel logs:**
```
Can't reach database server at `db.hcacdavejbbzqzqjoqbp.supabase.co:5432`
```

**Root Cause:**
- Vercel serverless functions need connection pooling (can't hold persistent connections)
- Current pooler (pgBouncer) has compatibility issues with Prisma
- pgBouncer in transaction mode doesn't support all Prisma features

## Solution: Enable Supavisor (Prisma-Compatible Pooler)

Supabase now offers **Supavisor**, a connection pooler specifically designed to work with Prisma on serverless platforms.

### Step 1: Check Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/hcacdavejbbzqzqjoqbp
2. Navigate to: **Settings** → **Database**
3. Look for **Connection Pooling** section
4. Check if **Supavisor** is available

### Step 2: Get Supavisor Connection String

There should be two connection string options:

#### Option A: Session Mode (Recommended for Prisma)
```
postgresql://postgres:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres
```

#### Option B: Transaction Mode (Current - Not ideal)
```
postgresql://postgres:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**For Prisma on Vercel, use Session Mode (port 5432)**

### Step 3: Update Vercel Environment Variables

Once you have the Supavisor connection string:

```bash
# Remove old pooler connection
vercel env rm DATABASE_URL production --yes

# Add Supavisor connection (Session Mode)
echo "postgresql://postgres:Chindwada%401@aws-0-ap-south-1.pooler.supabase.com:5432/postgres" | vercel env add DATABASE_URL production

# Also update preview and development
echo "postgresql://postgres:Chindwada%401@aws-0-ap-south-1.pooler.supabase.com:5432/postgres" | vercel env add DATABASE_URL preview

echo "postgresql://postgres:Chindwada%401@aws-0-ap-south-1.pooler.supabase.com:5432/postgres" | vercel env add DATABASE_URL development
```

### Step 4: Verify Connection String Format

The connection string should follow this pattern:

```
postgresql://[USERNAME]:[PASSWORD]@[POOLER_HOST]:5432/[DATABASE]
```

**Key points:**
- ✅ Username: `postgres` (NOT `postgres.PROJECT_REF`)
- ✅ Port: `5432` for session mode
- ✅ Host: `aws-0-ap-south-1.pooler.supabase.com`
- ✅ No `?pgbouncer=true` parameter for session mode

### Step 5: Redeploy

```bash
vercel --prod
```

## Alternative: Check Current Pooler Settings

If Supavisor is not showing in your dashboard, you may need to:

1. **Check Supabase plan**: Some pooler features require paid plans
2. **Contact Supabase support**: Request Supavisor access
3. **Use IPv6 pooler**: Some regions have IPv6 poolers

### How to Find IPv6 Pooler Address

In Supabase Dashboard:
1. Go to **Settings** → **Database**
2. Under **Connection string**, look for **Connection pooling**
3. You should see different connection modes:
   - **Session mode** (port 5432) - Use this for Prisma
   - **Transaction mode** (port 6543) - Current, not ideal for Prisma

## Testing the Connection

Once updated, test locally first:

```bash
# Update your local .env with the pooler connection
DATABASE_URL="postgresql://postgres:Chindwada%401@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"

# Test connection
npx prisma db pull

# If successful, test search
curl "http://localhost:3000/api/search?q=amlo&type=medicine"
```

## Prisma Configuration for Pooling

Your `schema.prisma` should have:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_DATABASE_URL")
}
```

**Important:**
- `DATABASE_URL` = Pooler connection (for Vercel)
- `DIRECT_DATABASE_URL` = Direct connection (for migrations)

## Current Environment Variables Needed

| Variable | Local | Vercel Production |
|----------|-------|-------------------|
| DATABASE_URL | Direct or Pooler | **Pooler (Session Mode)** |
| DIRECT_DATABASE_URL | Direct connection | Direct connection |

**Local .env:**
```env
# For local development, you can use either direct or pooler
DATABASE_URL="postgresql://postgres:Chindwada%401@db.hcacdavejbbzqzqjoqbp.supabase.co:5432/postgres"
DIRECT_DATABASE_URL="postgresql://postgres:Chindwada%401@db.hcacdavejbbzqzqjoqbp.supabase.co:5432/postgres"
```

**Vercel Production:**
```env
# Must use pooler for serverless functions
DATABASE_URL="postgresql://postgres:Chindwada%401@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"
DIRECT_DATABASE_URL="postgresql://postgres:Chindwada%401@db.hcacdavejbbzqzqjoqbp.supabase.co:5432/postgres"
```

## Common Issues

### Issue 1: "Can't reach database server"
- **Cause**: Using direct connection on Vercel
- **Fix**: Use pooler connection in DATABASE_URL

### Issue 2: "Prepared statement already exists"
- **Cause**: Using transaction mode (port 6543) with Prisma
- **Fix**: Use session mode (port 5432)

### Issue 3: "Connection pool timeout"
- **Cause**: Too many connections
- **Fix**: Add `?connection_limit=1` to DATABASE_URL for serverless

### Issue 4: "Tenant or user not found"
- **Cause**: Wrong username format
- **Fix**: Use `postgres`, not `postgres.PROJECT_REF`

## Recommended Connection String for Vercel

```
postgresql://postgres:Chindwada%401@aws-0-ap-south-1.pooler.supabase.com:5432/postgres?connection_limit=1&pool_timeout=0
```

**Parameters explained:**
- `connection_limit=1`: Limit connections per function instance
- `pool_timeout=0`: Don't wait for connections from pool

## Next Steps

1. ✅ Check Supabase Dashboard for pooler settings
2. ✅ Copy the **Session Mode** connection string
3. ✅ Update Vercel environment variables
4. ✅ Redeploy to Vercel
5. ✅ Test production search

## Resources

- Supabase Pooler Docs: https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler
- Prisma + Supabase: https://www.prisma.io/docs/guides/database/supabase
- Vercel + Prisma: https://vercel.com/guides/prisma-with-vercel

---

**Last Updated:** December 31, 2024
**Issue:** Vercel serverless can't use direct database connections
**Solution:** Use Supabase pooler in Session Mode (port 5432)
