# ⚡ Quick Migration Guide - Run Database Setup in 2 Minutes

**Project:** MedsBharat.com
**Database:** Supabase PostgreSQL
**Date:** December 31, 2024

---

## 🚀 Fastest Method: Supabase SQL Editor

### Step 1: Open Supabase SQL Editor

👉 **Click here:** https://supabase.com/dashboard/project/hcacdavejbbzqzqjoqbp/sql

### Step 2: Run Schema Migration

1. Open file: `migrations/001_init.sql`
2. Copy ALL content (Cmd+A, Cmd+C)
3. Paste into Supabase SQL Editor
4. Click **"Run"** button (or press `Ctrl+Enter`)
5. Wait for "Success" message (~5 seconds)

### Step 3: Run Seed Data

1. Open file: `migrations/002_seed_data.sql`
2. Copy ALL content (Cmd+A, Cmd+C)
3. Paste into Supabase SQL Editor
4. Click **"Run"** button
5. Wait for "Success" message (~3 seconds)

### Step 4: Seed Common Medicines (NEW)

1. Open file: `prisma/migrations/004_seed_medicines.sql`
2. Copy ALL content (Cmd+A, Cmd+C)
3. Paste into Supabase SQL Editor
4. Click **"Run"** button
5. Wait for "Success" message (~5 seconds)
6. You should see: **270 rows inserted** (45 medicines × 6 pharmacies)

### Step 5: Verify

Click **"Table Editor"** in Supabase sidebar.

You should see:
- ✅ 11 tables created
- ✅ 6 pharmacies in `Pharmacy` table
- ✅ 270 medicines in `Medicine` table (45 unique medicines × 6 pharmacies)
- ✅ 8 users in `users` table

---

## ✅ That's It!

Your database is ready. Now:

### Test Your Deployment

Visit your Vercel URL (or http://localhost:3000) and:

1. **Search "Dolo"**
   - Should see Dolo 650 Tablet from 6 pharmacies
   - Prices vary (±15% between pharmacies)

2. **Search "Glycomet"**
   - Should see Glycomet 500 SR (Diabetes Care)
   - Requires prescription badge visible

3. **Test Advanced Filters**
   - Filter by category (Pain Relief, Diabetes Care, etc.)
   - Filter by price range (₹0-₹1000)
   - Filter by prescription requirement
   - Filter by discount percentage

4. **Search "Hope Pharmacy"**
   - Should see Hope Pharmacy card
   - 4.5 star rating, 87 reviews
   - Click to see full catalog with 45 medicines

---

## 🔐 Test Credentials

### Admin Login
```
Email: admin@medsbharat.com
Password: admin123
```

### Patient Login
```
Email: patient@test.com
Password: patient123
```

### Pharmacy Owner Login
```
Password: pharmacy123
(Use phone: 9123456789 - 9123456794)
```

---

## 📊 What Was Created

### Tables (11)
- users, accounts, sessions, verification_tokens
- pharmacies, medicines
- addresses, orders, order_items
- reviews

### Data Created
- 8 Users (1 admin, 1 patient, 6 pharmacy owners)
- 6 Pharmacies (all in Nagpur, all APPROVED)
- 270 Medicines (45 unique medicines across 10 categories, each available in all 6 pharmacies)
  - Pain Relief: Dolo 650, Crocin, Combiflam, Brufen, Disprin
  - Cold & Flu: Vicks, Sinarest, Benadryl, Halls, Chericof
  - Diabetes Care: Glycomet, Glimestar, Januvia, Lantus
  - Heart Care: Ecosprin, Telma, Amlokind, Atorva
  - Antibiotics: Augmentin, Azithral, Ciprofloxacin, Cefixime
  - Vitamins: Becosules, Shelcal, Revital, Neurobion, Zincovit
  - Digestive: Pantoprazole, Eno, Digene, Isabgol, Cremaffin
  - Skin Care: Betnovate, Clotrimazole, Lacto Calamine, Acnemoist
  - Baby Care: Gripe Water, Calpol, Dentogel, Cerelac
  - Personal Care: Dettol, Savlon, Band-Aid, Moov
- 1 Sample review

---

## 🔍 Verify Data

In Supabase SQL Editor, run:

```sql
-- Count tables
SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';
-- Expected: 11

-- Check pharmacies
SELECT businessName, rating, totalOrders FROM pharmacies ORDER BY rating DESC;
-- Expected: 6 pharmacies

-- Check medicines
SELECT name, price, COUNT(*) OVER (PARTITION BY name) as pharmacy_count
FROM "Medicine"
WHERE name LIKE '%Dolo%';
-- Expected: Dolo 650 Tablet available in 6 pharmacies with varying prices

-- Check users by role
SELECT role, COUNT(*) FROM users GROUP BY role;
-- Expected: 1 admin, 1 patient, 6 pharmacy owners
```

---

## ⚠️ Troubleshooting

### Error: "relation already exists"

Tables already created. Skip `001_init.sql` or drop tables first:

```sql
DROP TABLE IF EXISTS reviews, order_items, orders, addresses, medicines, pharmacies, verification_tokens, sessions, accounts, users CASCADE;
DROP TYPE IF EXISTS "Role", "PharmacyStatus", "OrderStatus", "PaymentMethod", "PaymentStatus";
```

Then run `001_init.sql` again.

### Error: "duplicate key"

Seed data already inserted. Clear data:

```sql
TRUNCATE TABLE reviews, order_items, orders, addresses, medicines, pharmacies, verification_tokens, sessions, accounts, users RESTART IDENTITY CASCADE;
```

Then run `002_seed_data.sql` again.

---

## 📁 Migration Files

All SQL files are in the project:

- **`migrations/001_init.sql`** - Database schema (991 lines)
- **`migrations/002_seed_data.sql`** - Seed data (400+ lines)
- **`prisma/migrations/004_seed_medicines.sql`** - Common medicines seed (NEW)
- **`migrations/README.md`** - Detailed documentation

---

## 🎯 Next Steps

After migration:

1. ✅ **Database is ready**
2. ✅ **Test data is loaded**
3. 🚀 **Test your app**
4. 📱 **Deploy to production**

---

**Total time:** < 2 minutes
**Difficulty:** Copy & Paste
**Result:** Fully functional database with test data

**Questions?** Check `migrations/README.md` for detailed documentation.
