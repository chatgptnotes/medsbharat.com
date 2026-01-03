# Prisma 7 Migration Guide

**Project:** MedsBharat.com
**Prisma Version:** 7.2.0
**Date:** December 31, 2024

---

## What Changed in Prisma 7

Prisma 7 introduced breaking changes in how database connections are configured:

### Old Way (Prisma 5.x - 6.x)
```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")  // ❌ No longer supported
}
```

### New Way (Prisma 7+)
```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"  // ✅ Only provider type
}
```

```typescript
// prisma.config.ts
export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL  // ✅ URL moved here
  }
})
```

```typescript
// src/lib/prisma.ts
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })  // ✅ Adapter pattern
```

---

## Error You Might See

```
Error: Prisma schema validation - (get-config wasm)
Error code: P1012
error: The datasource property `url` is no longer supported in schema files.
Move connection URLs for Migrate to `prisma.config.ts`
```

**Solution:** Remove the `url` line from `datasource db` block in `schema.prisma`

---

## Why This Change?

### Benefits of Prisma 7 Configuration

1. **Separation of Concerns**
   - Schema defines structure (models, relations)
   - Config file handles environment-specific settings
   - Client code manages connections

2. **Better Connection Management**
   - Support for connection pooling (PgBouncer, Supabase)
   - Direct database connections
   - Accelerate integration

3. **Serverless Optimization**
   - Adapter pattern works better with serverless environments
   - Connection pooling reduces cold start times
   - Better resource management

---

## Configuration Files

### 1. `prisma/schema.prisma`
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}

// Models...
model User {
  id    String @id @default(cuid())
  email String @unique
  // ...
}
```

**Purpose:** Define database schema only

### 2. `prisma.config.ts`
```typescript
import "dotenv/config"
import { defineConfig } from "prisma/config"

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL || "postgresql://placeholder",
  },
})
```

**Purpose:** Configure migrations and database URL

### 3. `src/lib/prisma.ts`
```typescript
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL

  if (connectionString) {
    const pool = new Pool({ connectionString })
    const adapter = new PrismaPg(pool)
    return new PrismaClient({ adapter })
  }

  return new PrismaClient()
}

export const prisma = createPrismaClient()
```

**Purpose:** Create Prisma Client with connection adapter

---

## Migration Commands

All Prisma commands work the same way:

```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name your_migration_name

# Apply migrations
npx prisma migrate deploy

# Open Prisma Studio
npx prisma studio

# Reset database
npx prisma migrate reset
```

**Note:** Prisma CLI reads from `prisma.config.ts` automatically.

---

## Common Issues & Solutions

### Issue 1: "url is no longer supported"
**Error:**
```
error: The datasource property `url` is no longer supported
```

**Solution:**
Remove `url = env("DATABASE_URL")` from `prisma/schema.prisma`

### Issue 2: "Cannot find module 'dotenv/config'"
**Error:**
```
Cannot find module 'dotenv/config'
```

**Solution:**
```bash
npm install --save-dev dotenv
```

### Issue 3: "PrismaPg is not a constructor"
**Error:**
```
TypeError: PrismaPg is not a constructor
```

**Solution:**
Install the PostgreSQL adapter:
```bash
npm install @prisma/adapter-pg pg
```

### Issue 4: Build fails on Vercel
**Error:**
```
Prisma Client could not be generated
```

**Solution:**
Ensure `postinstall` script in `package.json`:
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

---

## Environment Variables

Required in `.env.local`:

```env
# Local Development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/medsbharat"

# Production (Vercel/Supabase)
DATABASE_URL="postgresql://user:pass@host:5432/db?pgbouncer=true"
```

**Note:** Connection pooling (PgBouncer) works seamlessly with adapter pattern.

---

## Vercel Deployment

For Vercel with Supabase:

1. **Environment Variables** (Vercel Dashboard):
   ```
   DATABASE_URL = your_supabase_connection_pooling_url
   ```

2. **Build Settings:**
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Connection Pooling:**
   Supabase provides connection pooling URLs automatically. Use the "Connection Pooling" URL from Supabase dashboard.

---

## Testing the Setup

After migration, verify everything works:

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma Client
npx prisma generate

# 3. Run migrations
npx prisma migrate dev

# 4. Seed database
npm run db:seed

# 5. Start dev server
npm run dev
```

---

## References

- [Prisma 7 Upgrade Guide](https://www.prisma.io/docs/guides/upgrade-guides/upgrading-versions/upgrading-to-prisma-7)
- [Prisma 7 Config Documentation](https://pris.ly/d/config-datasource)
- [Prisma Adapter Pattern](https://pris.ly/d/prisma7-client-config)
- [Connection Pooling Guide](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)

---

**Version:** 1.0
**Date:** December 31, 2024
**Status:** Migration Complete ✅
