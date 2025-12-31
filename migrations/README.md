# Database Migration Scripts

**Project:** MedsBharat.com
**Date:** December 31, 2024
**Database:** PostgreSQL (Supabase)

---

## Files

1. **`001_init.sql`** - Initial schema (tables, indexes, foreign keys)
2. **`002_seed_data.sql`** - Seed data (users, pharmacies, medicines)

---

## Quick Start

### Option 1: Run in Supabase SQL Editor (Recommended)

1. **Go to Supabase SQL Editor:**
   https://supabase.com/dashboard/project/hcacdavejbbzqzqjoqbp/sql

2. **Run Initial Schema:**
   - Copy contents of `001_init.sql`
   - Paste into SQL editor
   - Click "Run" or press `Ctrl+Enter`
   - Wait for "Success" message

3. **Run Seed Data:**
   - Copy contents of `002_seed_data.sql`
   - Paste into SQL editor
   - Click "Run"
   - Wait for "Success" message

### Option 2: Run via psql CLI

```bash
# Set your Supabase connection string
export DATABASE_URL="postgresql://postgres.hcacdavejbbzqzqjoqbp:Chindwada%401@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"

# Run initial schema
psql "$DATABASE_URL" < migrations/001_init.sql

# Run seed data
psql "$DATABASE_URL" < migrations/002_seed_data.sql
```

### Option 3: Run via Prisma

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Run seed script (TypeScript)
npm run db:seed
```

---

## What Gets Created

### Schema (001_init.sql)

**11 Tables:**
1. `users` - User accounts (patients, pharmacy owners, admins)
2. `accounts` - NextAuth OAuth accounts
3. `sessions` - NextAuth sessions
4. `verification_tokens` - Email/phone verification
5. `pharmacies` - Pharmacy stores
6. `medicines` - Medicine catalog
7. `addresses` - User delivery addresses
8. `orders` - Customer orders
9. `order_items` - Order line items
10. `reviews` - Pharmacy reviews & ratings

**5 Enums:**
- Role (PATIENT, PHARMACY_OWNER, SUPER_ADMIN)
- PharmacyStatus (PENDING, APPROVED, REJECTED)
- OrderStatus (PENDING, CONFIRMED, PREPARING, OUT_FOR_DELIVERY, DELIVERED, CANCELLED)
- PaymentMethod (UPI, CARD, PAY_AT_PHARMACY)
- PaymentStatus (PENDING, COMPLETED, FAILED, REFUNDED)

**23 Indexes:**
- Performance indexes on frequently queried columns
- Spatial indexes for location-based queries
- Unique constraints for data integrity

**11 Foreign Keys:**
- Referential integrity between tables
- CASCADE deletes where appropriate
- RESTRICT deletes for business-critical data

### Seed Data (002_seed_data.sql)

**8 Users:**
- 1 Super Admin: admin@medsbharat.com (password: admin123)
- 1 Test Patient: patient@test.com (password: patient123)
- 6 Pharmacy Owners (password: pharmacy123)

**6 Pharmacies (All in Nagpur):**
1. Hope Pharmacy - Sitabuldi
2. Apollo Pharmacy - Wardha Road
3. MedPlus - Civil Lines
4. Wellness Forever - Dharampeth
5. Care & Cure Pharmacy - Sadar
6. HealthPlus Pharmacy - Ramdaspeth

**30 Medicines:**
- 5 medicines per pharmacy
- Categories: diabetes, blood-pressure, pain-relief, antibiotics, cold-cough, stomach-care, heart-care
- Common medicines: Metformin, Amlodipine, Paracetamol, etc.
- Price variations across pharmacies (for comparison)

**1 Sample Review:**
- 5-star review for Hope Pharmacy

---

## Test Credentials

### Super Admin
- **Email:** admin@medsbharat.com
- **Password:** admin123
- **Role:** SUPER_ADMIN

### Test Patient
- **Email:** patient@test.com
- **Phone:** 9876543210
- **Password:** patient123
- **Role:** PATIENT

### Pharmacy Owners
- **Password:** pharmacy123 (for all 6 owners)
- **Phone Numbers:** 9123456789 - 9123456794

---

## Verification

After running migrations, verify in Supabase:

### Check Tables Created
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Expected: 11 tables

### Check Data Seeded
```sql
-- Count users
SELECT role, COUNT(*) FROM users GROUP BY role;
-- Expected: 1 SUPER_ADMIN, 1 PATIENT, 6 PHARMACY_OWNER

-- Count pharmacies
SELECT status, COUNT(*) FROM pharmacies GROUP BY status;
-- Expected: 6 APPROVED

-- Count medicines
SELECT COUNT(*) FROM medicines;
-- Expected: 30

-- Check medicine availability by pharmacy
SELECT p.businessName, COUNT(m.id) as medicine_count
FROM pharmacies p
LEFT JOIN medicines m ON m."pharmacyId" = p.id
GROUP BY p.id, p.businessName
ORDER BY p.businessName;
-- Expected: 5 medicines per pharmacy
```

### Test Queries

**Find pharmacies near a location:**
```sql
SELECT
  "businessName",
  address,
  rating,
  "totalReviews"
FROM pharmacies
WHERE status = 'APPROVED'
ORDER BY rating DESC;
```

**Search medicines across pharmacies:**
```sql
SELECT
  m.name,
  m.price,
  m.mrp,
  p."businessName"
FROM medicines m
JOIN pharmacies p ON p.id = m."pharmacyId"
WHERE m.name ILIKE '%metformin%'
AND m.available = true
ORDER BY m.price ASC;
```

**Get pharmacy with medicines:**
```sql
SELECT
  p."businessName",
  p.rating,
  COUNT(m.id) as total_medicines
FROM pharmacies p
LEFT JOIN medicines m ON m."pharmacyId" = p.id
WHERE p.status = 'APPROVED'
GROUP BY p.id, p."businessName", p.rating;
```

---

## Troubleshooting

### Error: "relation already exists"

The tables already exist in your database.

**Solution:**
```sql
-- Drop all tables (CAUTION: This deletes all data!)
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS addresses CASCADE;
DROP TABLE IF EXISTS medicines CASCADE;
DROP TABLE IF EXISTS pharmacies CASCADE;
DROP TABLE IF EXISTS verification_tokens CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop enums
DROP TYPE IF EXISTS "Role";
DROP TYPE IF EXISTS "PharmacyStatus";
DROP TYPE IF EXISTS "OrderStatus";
DROP TYPE IF EXISTS "PaymentMethod";
DROP TYPE IF EXISTS "PaymentStatus";

-- Now run 001_init.sql again
```

### Error: "duplicate key value violates unique constraint"

The seed data is being inserted twice.

**Solution:**
```sql
-- Clear existing data
TRUNCATE TABLE reviews, order_items, orders, addresses, medicines, pharmacies, verification_tokens, sessions, accounts, users RESTART IDENTITY CASCADE;

-- Now run 002_seed_data.sql again
```

### Error: "column does not exist"

Schema mismatch between SQL and Prisma.

**Solution:**
1. Make sure `001_init.sql` ran successfully
2. Check Prisma schema matches SQL schema
3. Run `npx prisma generate` to regenerate client

---

## Next Steps

After running migrations:

1. **Test the application:**
   ```bash
   npm run dev
   # Visit http://localhost:3000
   # Search for "Metformin"
   ```

2. **Verify data in Prisma Studio:**
   ```bash
   npm run db:studio
   # Opens at http://localhost:5555
   ```

3. **Test API endpoints:**
   ```bash
   # Search API
   curl "http://localhost:3000/api/search?q=metformin&type=medicine"

   # Pharmacies API
   curl "http://localhost:3000/api/pharmacies"

   # Pharmacy detail
   curl "http://localhost:3000/api/pharmacies/clxpharmacy000001"
   ```

---

## Production Deployment

For Vercel deployment:

1. **Run migrations in Supabase dashboard** (recommended)
2. **Set environment variables in Vercel:**
   - DATABASE_URL (pooled connection)
   - All other env vars from VERCEL_ENV_VARIABLES.txt

3. **Don't run migrations from Vercel build:**
   - Migrations should only run manually in Supabase
   - Prisma generate will run automatically via postinstall script

---

## Backup & Restore

### Create Backup
```bash
pg_dump "$DATABASE_URL" > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore Backup
```bash
psql "$DATABASE_URL" < backup_20241231_120000.sql
```

---

## Support

**Issues:** Report at https://github.com/chatgptnotes/medsbharat.com/issues

**Documentation:**
- `README.md` - Project overview
- `SUPABASE_SETUP.md` - Supabase configuration
- `VERCEL_DEPLOYMENT.md` - Deployment guide

---

**Version:** 1.0
**Date:** December 31, 2024
**Database:** PostgreSQL (Supabase)
