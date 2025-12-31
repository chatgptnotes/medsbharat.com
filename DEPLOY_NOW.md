# 🚀 Deploy to Vercel NOW - Quick Reference

**5 Minute Deployment**

---

## Step 1: Open Vercel

👉 **Go to:** https://vercel.com/new

Sign in with your GitHub account.

---

## Step 2: Import Repository

1. Click **"Import Project"**
2. Search for: `medsbharat.com`
3. Click **"Import"**

---

## Step 3: Configure (Keep Defaults)

- ✅ Project Name: `medsbharat`
- ✅ Framework: Next.js
- ✅ Root Directory: `./`
- ✅ Build Command: `npm run build`
- ✅ Output Directory: `.next`

---

## Step 4: Add Environment Variables

**⚠️ CRITICAL: Add these before clicking Deploy**

Copy-paste each variable (replace YOUR_DB_PASSWORD):

```
DATABASE_URL
postgresql://postgres.hcacdavejbbzqzqjoqbp:YOUR_DB_PASSWORD@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

```
DIRECT_DATABASE_URL
postgresql://postgres.hcacdavejbbzqzqjoqbp:YOUR_DB_PASSWORD@aws-0-ap-south-1.pooler.supabase.com:5432/postgres
```

```
NEXT_PUBLIC_SUPABASE_URL
https://hcacdavejbbzqzqjoqbp.supabase.co
```

```
NEXT_PUBLIC_SUPABASE_ANON_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjYWNkYXZlamJienF6cWpvcWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxNjA3OTcsImV4cCI6MjA4MjczNjc5N30.NJx6EUhhU8wKo_eKQphvduYGtfTngN4qfqwmL8x3AKk
```

```
SUPABASE_SERVICE_ROLE_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjYWNkYXZlamJienF6cWpvcWJwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzE2MDc5NywiZXhwIjoyMDgyNzM2Nzk3fQ.cULgvjB6DQZsx6PZD0RVdy9eNMDlNgrswLoq2r4EbRE
```

**Generate this one:**
```bash
openssl rand -base64 32
```
Then add as:
```
NEXTAUTH_SECRET
[paste generated value]
```

```
NEXTAUTH_URL
https://medsbharat.vercel.app
```

### Get Database Password

👉 **Go to:** https://supabase.com/dashboard/project/hcacdavejbbzqzqjoqbp/settings/database

Scroll to "Database password" section.

---

## Step 5: Deploy

Click **"Deploy"**

Wait 2-3 minutes. ☕

---

## Step 6: After Deployment

### A. Your app is live at:
`https://medsbharat.vercel.app`

### B. Set up database (locally):

```bash
# Update .env with your database password
nano .env

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed
```

### C. Test your deployment:
1. Visit your Vercel URL
2. Search "Metformin"
3. Should show results from 6 pharmacies

---

## Troubleshooting

**Build fails?**
- Check environment variables
- View logs in Vercel Dashboard

**No search results?**
- Run: `npm run db:migrate`
- Run: `npm run db:seed`

**Need help?**
- Read: `VERCEL_DEPLOYMENT.md`
- Check: `DEPLOYMENT_STATUS.md`

---

## Quick Links

- **Vercel:** https://vercel.com/new
- **GitHub Repo:** https://github.com/chatgptnotes/medsbharat.com
- **Supabase Dashboard:** https://supabase.com/dashboard/project/hcacdavejbbzqzqjoqbp
- **Database Settings:** https://supabase.com/dashboard/project/hcacdavejbbzqzqjoqbp/settings/database

---

**That's it! Your app will be live in 5 minutes.** 🎉
