# 🚀 Database Setup Instructions

## Current Status

The category tabs are **ACTIVE** and working with sample/mock data. To see real products from the database, you need to run the SQL migrations in Supabase.

---

## ⚡ Quick Setup (2 Minutes)

### Step 1: Open Supabase SQL Editor

Click here: **https://supabase.com/dashboard/project/hcacdavejbbzqzqjoqbp/sql**

### Step 2: Run Schema Migration

1. Open file: `migrations/001_init.sql`
2. Copy **ALL** content (Cmd+A, Cmd+C)
3. Paste into Supabase SQL Editor
4. Click **"Run"** button (or press Ctrl+Enter)
5. Wait for "Success" message (~5 seconds)

### Step 3: Run Seed Data

1. Open file: `migrations/002_seed_data.sql`
2. Copy **ALL** content (Cmd+A, Cmd+C)
3. Paste into Supabase SQL Editor
4. Click **"Run"** button
5. Wait for "Success" message (~3 seconds)

### Step 4: Refresh Your Browser

Go to http://localhost:3000 and refresh. The category tabs will now show **real products** from the database instead of sample data.

---

## ✅ What This Creates

### 11 Database Tables
- users, accounts, sessions, verification_tokens
- pharmacies, medicines
- addresses, orders, order_items
- reviews

### Sample Data
- 8 Users (1 admin, 1 patient, 6 pharmacy owners)
- 6 Pharmacies (all in Nagpur, all approved)
- 30 Medicines (5 per pharmacy)
- 1 Sample review

---

## 🎯 How Category Tabs Work

The CategoryTabs component:

1. **Tries to fetch from database** via `/api/products/by-category`
2. **If database is empty or errors**, falls back to mock data automatically
3. **Shows a blue info banner** when using mock data
4. **Switches to real data** once migrations are run (banner disappears)

---

## 🔍 Verify Setup

In Supabase SQL Editor, run:

```sql
-- Check if tables exist
SELECT COUNT(*) FROM information_schema.tables
WHERE table_schema = 'public';
-- Expected: 11

-- Check pharmacies
SELECT "businessName", rating, "totalOrders"
FROM pharmacies
ORDER BY rating DESC;
-- Expected: 6 pharmacies

-- Check medicines by category
SELECT category, COUNT(*)
FROM medicines
GROUP BY category
ORDER BY category;
-- Expected: Various categories
```

---

## ⚠️ Troubleshooting

### "Tenant or user not found" Error

This means the database credentials are invalid or Supabase project is paused. Check:

1. Go to https://supabase.com/dashboard/project/hcacdavejbbzqzqjoqbp
2. Check if project is **Active** (not paused)
3. Verify DATABASE_URL in `.env` is correct

### Tables Already Exist

If you see "relation already exists" error, drop tables first:

```sql
DROP TABLE IF EXISTS reviews, order_items, orders, addresses,
medicines, pharmacies, verification_tokens, sessions, accounts,
users CASCADE;

DROP TYPE IF EXISTS "Role", "PharmacyStatus", "OrderStatus",
"PaymentMethod", "PaymentStatus";
```

Then run `001_init.sql` again.

---

## 📱 Test After Setup

Once migrations are complete:

1. Visit http://localhost:3000
2. Click on different category tabs (Medication, Healthcare, etc.)
3. You should see products changing for each category
4. Blue info banner should disappear
5. Products will have real pharmacy names

---

## 📚 More Details

For complete documentation, see:
- `RUN_MIGRATIONS.md` - Detailed migration guide
- `migrations/README.md` - Migration file documentation
- `ARCHITECTURE.md` - Database schema details

---

**Need Help?** Check the Supabase dashboard or run the verification queries above.

---

**Version:** 1.8
**Date:** December 31, 2024
**Repository:** chatgptnotes/medsbharat.com
