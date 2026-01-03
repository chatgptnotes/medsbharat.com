# Vercel Deployment Guide - MedsBharat.com

**Project:** MedsBharat.com - Pharmacy Marketplace
**Date:** December 31, 2024
**Status:** Ready for deployment

---

## Prerequisites

Before deploying to Vercel, ensure you have:

- [x] Supabase project created (hcacdavejbbzqzqjoqbp)
- [x] Supabase database password
- [x] GitHub repository (https://github.com/chatgptnotes/ecommercepharmacy.git)
- [ ] Vercel account (sign up at https://vercel.com)

---

## Step 1: Push Code to GitHub

### 1.1 Review Changes
```bash
git status
```

### 1.2 Stage All Changes
```bash
git add .
```

### 1.3 Commit Changes
```bash
git commit -m "feat: Complete Week 1 - Zomato-style pharmacy marketplace with Supabase

- Add Prisma 7.2.0 schema with marketplace model
- Implement dual search (medicine OR pharmacy)
- Add homepage, search results, and pharmacy detail pages
- Integrate Supabase for production database
- Add cart functionality with Zustand persistence
- Create comprehensive documentation
- Add Docker setup for local development
- Configure seed data for 6 pharmacies and 150+ medicines

🚀 Ready for production deployment on Vercel"
```

### 1.4 Push to GitHub
```bash
git push origin main
```

---

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/new
   - Sign in with GitHub

2. **Import Repository**
   - Click "Import Project"
   - Select "Import Git Repository"
   - Choose: `chatgptnotes/ecommercepharmacy`
   - Click "Import"

3. **Configure Project**
   - **Project Name:** `medsbharat` (or your choice)
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (leave as is)
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `.next` (auto-detected)

4. **Add Environment Variables**
   Click "Environment Variables" and add the following:

   ```
   DATABASE_URL
   postgresql://postgres.hcacdavejbbzqzqjoqbp:YOUR_PASSWORD@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1

   DIRECT_DATABASE_URL
   postgresql://postgres.hcacdavejbbzqzqjoqbp:YOUR_PASSWORD@aws-0-ap-south-1.pooler.supabase.com:5432/postgres

   NEXT_PUBLIC_SUPABASE_URL
   https://hcacdavejbbzqzqjoqbp.supabase.co

   NEXT_PUBLIC_SUPABASE_ANON_KEY
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjYWNkYXZlamJienF6cWpvcWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxNjA3OTcsImV4cCI6MjA4MjczNjc5N30.NJx6EUhhU8wKo_eKQphvduYGtfTngN4qfqwmL8x3AKk

   SUPABASE_SERVICE_ROLE_KEY
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjYWNkYXZlamJienF6cWpvcWJwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzE2MDc5NywiZXhwIjoyMDgyNzM2Nzk3fQ.cULgvjB6DQZsx6PZD0RVdy9eNMDlNgrswLoq2r4EbRE

   NEXTAUTH_SECRET
   [Generate with: openssl rand -base64 32]

   NEXTAUTH_URL
   https://medsbharat.vercel.app
   ```

   **IMPORTANT:** Replace `YOUR_PASSWORD` with your actual Supabase database password!

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (2-3 minutes)

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? medsbharat
# - Directory? ./
# - Override settings? No

# Deploy to production
vercel --prod
```

---

## Step 3: Run Database Migrations on Supabase

After Vercel deployment, you need to set up the database:

### 3.1 Update .env with Supabase Password
```bash
# Edit .env file locally
nano .env

# Replace YOUR_DB_PASSWORD with actual password from Supabase dashboard
```

### 3.2 Run Migrations
```bash
npm run db:migrate
```

This will create all tables in your Supabase database.

### 3.3 Seed Database (Optional but Recommended)
```bash
npm run db:seed
```

This adds:
- 6 pharmacies in Nagpur
- 150+ medicines across categories
- Admin user (admin@medsbharat.com / admin123)
- Test patient (patient@test.com / patient123)

---

## Step 4: Verify Deployment

### 4.1 Check Deployment URL
Your app will be available at: `https://medsbharat.vercel.app`
(or whatever project name you chose)

### 4.2 Test Core Features

1. **Homepage**
   - Visit: https://medsbharat.vercel.app
   - Verify search bar loads
   - Check "How It Works" section

2. **Search Medicine**
   - Search: "Metformin"
   - Should show results from 6 pharmacies
   - Price comparison visible

3. **Search Pharmacy**
   - Search: "Hope Pharmacy"
   - Should show pharmacy details
   - Rating and reviews visible

4. **Pharmacy Detail**
   - Click any pharmacy
   - Category filtering works
   - Add to cart functionality

5. **Cart Persistence**
   - Add items to cart
   - Refresh page
   - Cart items persist

---

## Step 5: Configure Custom Domain (Optional)

### 5.1 Add Domain in Vercel
1. Go to Project Settings > Domains
2. Add your domain (e.g., `medsbharat.com`)
3. Follow DNS configuration instructions

### 5.2 Update Environment Variables
Update `NEXTAUTH_URL` to your custom domain:
```
NEXTAUTH_URL=https://medsbharat.com
```

---

## Environment Variables Reference

### Required for Production

| Variable | Value | Purpose |
|----------|-------|---------|
| `DATABASE_URL` | Supabase pooled connection (port 6543) | Runtime database queries |
| `DIRECT_DATABASE_URL` | Supabase direct connection (port 5432) | Migrations (not used in production) |
| `NEXT_PUBLIC_SUPABASE_URL` | https://hcacdavejbbzqzqjoqbp.supabase.co | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon key | Public API access |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service role key | Admin API access |
| `NEXTAUTH_SECRET` | Random secret (32+ chars) | Session encryption |
| `NEXTAUTH_URL` | Your Vercel URL | Auth redirect URL |

### Optional (Week 2+)

| Variable | Purpose |
|----------|---------|
| `CLOUDINARY_CLOUD_NAME` | Prescription image uploads |
| `CLOUDINARY_API_KEY` | Cloudinary auth |
| `CLOUDINARY_API_SECRET` | Cloudinary auth |
| `GOOGLE_VISION_API_KEY` | OCR for prescriptions |
| `RAZORPAY_KEY_ID` | Payment processing |
| `RAZORPAY_KEY_SECRET` | Payment processing |
| `MSG91_AUTH_KEY` | SMS notifications |

---

## Troubleshooting

### Build Fails: "Prisma Client not generated"

**Solution:** Ensure `postinstall` script in `package.json`:
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

### Error: "password authentication failed"

**Solution:**
1. Check DATABASE_URL has correct password
2. Verify password in Supabase dashboard
3. Re-deploy with correct environment variable

### Error: "prepared transactions not supported"

**Solution:**
- You're using pooled connection (6543) for migrations
- Use DIRECT_DATABASE_URL (port 5432) locally
- Migrations should only run locally, not in Vercel builds

### Pages Load but No Data

**Solution:**
1. Check if database is seeded: Visit Supabase Table Editor
2. Run migrations locally: `npm run db:migrate`
3. Seed database: `npm run db:seed`
4. Verify DATABASE_URL in Vercel environment variables

### Search Returns Empty Results

**Solution:**
1. Verify medicines exist in Supabase
2. Check API routes work: `/api/search?q=test&type=medicine`
3. Check browser console for errors
4. Verify Supabase RLS policies allow read access

---

## Post-Deployment Checklist

After successful deployment:

- [ ] Homepage loads without errors
- [ ] Search (medicine) returns results
- [ ] Search (pharmacy) returns results
- [ ] Pharmacy detail page works
- [ ] Cart functionality works
- [ ] Cart persists on refresh
- [ ] API routes respond correctly
- [ ] Database connection works
- [ ] Environment variables set correctly
- [ ] No console errors in browser
- [ ] Mobile responsive design works
- [ ] Performance score acceptable (Lighthouse)

---

## Monitoring & Analytics

### Vercel Analytics
Enable in Project Settings > Analytics

### Error Tracking
Errors visible in Vercel Logs:
- Visit: https://vercel.com/your-project/logs

### Database Monitoring
Check Supabase Dashboard:
- Database health: https://supabase.com/dashboard/project/hcacdavejbbzqzqjoqbp/settings/database
- API usage: https://supabase.com/dashboard/project/hcacdavejbbzqzqjoqbp/settings/api

---

## Continuous Deployment

Vercel automatically redeploys when you push to GitHub:

```bash
# Make changes locally
git add .
git commit -m "feat: add new feature"
git push origin main

# Vercel automatically deploys
# Check status: https://vercel.com/your-project
```

---

## Rollback (If Needed)

If deployment has issues:

1. **Via Vercel Dashboard:**
   - Go to Deployments
   - Find previous working deployment
   - Click "..." → "Promote to Production"

2. **Via Git:**
   ```bash
   git revert HEAD
   git push origin main
   ```

---

## Next Steps After Deployment

### Week 2 Features
- [ ] Shopping cart page UI
- [ ] Checkout flow
- [ ] Prescription upload (Cloudinary)
- [ ] Payment integration (Razorpay)
- [ ] Order tracking

### Week 3 Features
- [ ] Pharmacy admin dashboard
- [ ] Order management
- [ ] Auto-routing logic
- [ ] SMS notifications

### Production Hardening
- [ ] Enable Supabase RLS policies
- [ ] Set up monitoring alerts
- [ ] Add rate limiting
- [ ] Configure CDN caching
- [ ] Set up error tracking (Sentry)

---

## Support & Resources

### Documentation
- [Vercel Deployment Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Deployment](https://supabase.com/docs/guides/platform/going-into-prod)

### Your Project Docs
- `README.md` - Project overview
- `QUICKSTART.md` - Local development
- `SUPABASE_SETUP.md` - Supabase configuration
- `WEEK1_SUMMARY.md` - What was built

---

**Status:** Ready to deploy
**Next:** Push to GitHub and deploy to Vercel
**Version:** 1.0
**Date:** December 31, 2024
