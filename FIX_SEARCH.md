# Fix Search Functionality - Complete Guide

**Status**: Search is not working due to Supabase connection issue + medicines not seeded
**Date**: December 31, 2024

---

## Problem Summary

Search is showing "medicines found" but no results because:
1. **Medicines haven't been seeded** in Supabase database yet
2. **Prisma connection failing** with "Tenant or user not found" error
3. **PG adapter incompatibility** with Supabase pooler connection

---

## Solution: 2 Steps

### Step 1: Seed the Medicines Database

**YOU MUST RUN THIS FIRST** - The database is empty!

1. Open Supabase SQL Editor:
   - URL: https://supabase.com/dashboard/project/hcacdavejbbzqzqjoqbp/sql

2. Copy the entire SQL script from:
   - File: `prisma/migrations/004_seed_medicines.sql`
   - Or file: `SEED_MEDICINES.md` (has the same SQL)

3. Paste into Supabase SQL Editor and click "Run"

4. Verify success:
   - You should see "270 rows inserted"
   - Or run this verification query:
   ```sql
   SELECT COUNT(*) FROM "Medicine";
   -- Should return: 270
   ```

### Step 2: Fix Prisma Connection (Choose One Option)

The Prisma connection is failing because of Supabase pooler issues with the PG adapter.

#### Option A: Use Standard Prisma Client (Recommended)

**File**: `src/lib/db.ts`

Replace with:
```typescript
// Database Client
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
```

Then update `prisma/schema.prisma` generator to use "binary" engine:
```prisma
generator client {
  provider = "prisma-client-js"
  engineType = "binary"
}
```

Regenerate Prisma Client:
```bash
npx prisma generate
```

#### Option B: Fix PG Adapter Connection

If you want to keep using PG adapter, you need to get a proper direct connection URL from Supabase.

**File**: `src/lib/db.ts`

```typescript
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Use direct connection, not pooler
const connectionString = process.env.SUPABASE_DIRECT_URL || process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30000,
});

const adapter = new PrismaPg(pool);

export const db = new PrismaClient({
  adapter,
  log: ['error'],
});
```

Then add to `.env`:
```
SUPABASE_DIRECT_URL="postgresql://postgres.hcacdavejbbzqzqjoqbp:Chindwada%401@db.hcacdavejbbzqzqjoqbp.supabase.co:5432/postgres"
```

---

## Testing After Fix

### 1. Restart Dev Server
```bash
npm run dev
```

### 2. Test Search in Browser
Visit: http://localhost:3000/search?q=dolo&type=medicine

You should see:
- "Search results for 'dolo'"
- Dolo 650 Tablet from multiple pharmacies
- Prices varying between pharmacies

### 3. Test Search API Directly
```bash
curl "http://localhost:3000/api/search?q=dolo&type=medicine"
```

Expected response:
```json
{
  "medicines": [
    {
      "id": "...",
      "name": "Dolo 650 Tablet",
      "manufacturer": "Micro Labs",
      "category": "Pain Relief",
      "price": 28.50,
      "mrp": 33.00,
      "available": true,
      "pharmacy": {
        "id": "...",
        "businessName": "Hope Pharmacy",
        ...
      }
    },
    ...
  ],
  "total": 6
}
```

### 4. Test Other Searches
- http://localhost:3000/search?q=glycomet&type=medicine
- http://localhost:3000/search?q=pantoprazole&type=medicine
- http://localhost:3000/search?q=vitamin&type=medicine

---

## Verification Queries

After seeding, run these in Supabase SQL Editor to verify:

### Check Total Medicines
```sql
SELECT COUNT(*) as total FROM "Medicine";
-- Expected: 270
```

### Check Medicines by Category
```sql
SELECT category, COUNT(*) as count
FROM "Medicine"
GROUP BY category
ORDER BY category;
-- Expected: 10 categories
```

### Check a Specific Medicine
```sql
SELECT
  m.name,
  m.price,
  m.mrp,
  m.available,
  p."businessName" as pharmacy
FROM "Medicine" m
JOIN "Pharmacy" p ON m."pharmacyId" = p.id
WHERE m.name LIKE '%Dolo%'
ORDER BY m.price;
-- Expected: 6 rows (one per pharmacy)
```

---

## Common Issues & Solutions

### Issue 1: "Tenant or user not found"
**Cause**: PG adapter trying to use pooled connection
**Fix**: Use Option A above (Standard Prisma Client with binary engine)

### Issue 2: "No medicines found"
**Cause**: Database not seeded yet
**Fix**: Run Step 1 (Seed the medicines)

### Issue 3: "Connection timeout"
**Cause**: Supabase connection string incorrect
**Fix**: Check `.env` file has correct `DATABASE_URL`

### Issue 4: Build errors about adapter
**Cause**: Prisma config requires adapter
**Fix**: Either provide adapter (Option B) or use binary engine (Option A)

---

## Quick Fix (Fastest)

If you just want it working NOW:

1. **Seed database**: Copy/paste `004_seed_medicines.sql` into Supabase SQL Editor and run

2. **Update schema**: Add to `prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client-js"
  engineType = "binary"
}
```

3. **Regenerate client**:
```bash
npx prisma generate
```

4. **Restart**:
```bash
npm run dev
```

5. **Test**:
http://localhost:3000/search?q=dolo&type=medicine

Done! Search should work.

---

## Why This Happened

The project was set up with:
- PG adapter for connection pooling
- Supabase pooler connection string
- But the adapter doesn't work well with Supabase's pooler

The solution is either:
- Use standard Prisma Client (simpler)
- Or fix the connection string to use direct connection

---

## Next Steps After Fix

Once search is working:

1. ✅ Test all 10 medicine categories
2. ✅ Test advanced filters
3. ✅ Test price comparison
4. ✅ Test cart functionality
5. ✅ Test recently viewed tracking
6. 🔄 Continue with Week 2 features (checkout, payments)

---

**Created**: December 31, 2024
**Status**: Awaiting your action on Step 1 (seed database)
