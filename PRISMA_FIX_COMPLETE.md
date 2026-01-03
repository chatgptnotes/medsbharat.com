# Complete Prisma Configuration Fix for Supabase

## Problem Summary
The application was experiencing "Tenant or user not found" errors due to incorrect Prisma and Supabase configuration.

## Root Causes Identified

1. **Prisma 7.2.0 Breaking Changes**
   - Prisma 7.x requires adapter or accelerateUrl with "client" engine type
   - No longer supports `url` and `directUrl` in schema.prisma
   - Incompatible with traditional Supabase connection pooling

2. **Incorrect DIRECT_DATABASE_URL**
   - Was using pooler URL instead of direct compute URL
   - Should use `aws-0-ap-south-1.compute.internal.supabase.com` not pooler

3. **Multiple Prisma Client Instances**
   - Both `src/lib/prisma.ts` and `src/lib/db.ts` creating clients
   - Inconsistent configuration between files

## Solution Applied

### Step 1: Downgrade to Prisma 6.9.0
Prisma 6.x works seamlessly with Supabase without requiring adapters.

```bash
npm install prisma@6.9.0 @prisma/client@6.9.0
```

###  Step 2: Fix Database URLs in .env

The correct URLs should be:

```env
# Pooler URL for connection pooling (PgBouncer)
DATABASE_URL="postgresql://postgres.hcacdavejbbzqzqjoqbp:PASSWORD@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct URL (NOT pooler) for migrations
DIRECT_DATABASE_URL="postgresql://postgres.hcacdavejbbzqzqjoqbp:PASSWORD@aws-0-ap-south-1.compute.internal.supabase.com:5432/postgres"
```

**Key Difference:**
- `DATABASE_URL`: Uses `.pooler.supabase.com:6543` with `pgbouncer=true`
- `DIRECT_DATABASE_URL`: Uses `.compute.internal.supabase.com:5432` (NO pooler)

### Step 3: Update Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_DATABASE_URL")
}
```

### Step 4: Simplify Prisma Client Creation

**File: `src/lib/prisma.ts`** (or `src/lib/db.ts`, use ONE file only)

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error'] : ['error'],
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
```

**IMPORTANT:** Remove PG adapter, Pool imports. Standard PrismaClient works with Supabase.

### Step 5: Regenerate and Restart

```bash
# Clear cache
rm -rf .next
rm -rf node_modules/.prisma

# Regenerate Prisma Client
npx prisma generate

# Restart dev server
npm run dev
```

## How to Get Correct Supabase URLs

1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/hcacdavejbbzqzqjoqbp
2. Click **Settings** → **Database**
3. Under **Connection string** section:
   - **Transaction Pooler** (PgBouncer) → Use this for `DATABASE_URL`
   - **Session Pooler** → Skip this
   - **Direct Connection** → Use this for `DIRECT_DATABASE_URL`

## Testing the Fix

After applying the fix, test with:

```bash
# Test database connection
npx prisma db pull

# Test query
curl http://localhost:3000/api/search?q=dolo&type=medicine
```

Expected: Should return medicine results if database is seeded.

## Common Errors Fixed

### Error 1: "Using engine type 'client' requires adapter"
**Cause:** Prisma 7.x incompatibility
**Fix:** Downgrade to Prisma 6.9.0

### Error 2: "Tenant or user not found" (DriverAdapterError)
**Cause:** Using PG adapter with Supabase pooler
**Fix:** Remove adapter, use standard PrismaClient

### Error 3: "Tenant or user not found" (Connection Error)
**Cause:** Incorrect DIRECT_DATABASE_URL using pooler
**Fix:** Use direct compute URL without pooler

### Error 4: Schema validation errors for url/directUrl
**Cause:** Prisma 7.x removed support for these properties
**Fix:** Downgrade to Prisma 6.x

## Next Steps

1. Update .env with correct DIRECT_DATABASE_URL
2. Run migrations via Supabase SQL Editor
3. Seed database with medicines (004_seed_medicines.sql)
4. Test search functionality

## Version Control
- Commit these changes with: `git commit -m "fix: Downgrade to Prisma 6.9.0 for Supabase compatibility"`

---

**Last Updated:** December 31, 2024
**Prisma Version:** 6.9.0
**Next.js Version:** 16.1.1
**Repository:** medsbharat.com
