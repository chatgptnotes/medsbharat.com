# Vercel Environment Variables Setup

## Why Search Shows 0 Results on Production

You searched for "amlo" on https://medsbharatcom.vercel.app and got "0 medicines found" because:

1. **Vercel doesn't have the database environment variables set**
2. **Production Supabase database connection isn't configured**

## Solution: Add Environment Variables to Vercel

### Step 1: Go to Vercel Dashboard

1. Open: https://vercel.com/chatgptnotes-6366s-projects/medsbharat.com/settings/environment-variables
2. Or navigate:
   - Go to https://vercel.com
   - Select project: **medsbharat.com**
   - Click **Settings** tab
   - Click **Environment Variables** in left sidebar

### Step 2: Add Database Environment Variables

Add these environment variables:

#### 1. DATABASE_URL
```
postgresql://postgres:Chindwada%401@db.hcacdavejbbzqzqjoqbp.supabase.co:5432/postgres
```
- Environment: **Production, Preview, Development** (select all 3)

#### 2. DIRECT_DATABASE_URL
```
postgresql://postgres:Chindwada%401@db.hcacdavejbbzqzqjoqbp.supabase.co:5432/postgres
```
- Environment: **Production, Preview, Development** (select all 3)

### Step 3: Add Other Required Environment Variables

You may also need to add from your local `.env`:

```bash
# Copy these from your local .env file:
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://medsbharatcom.vercel.app
NEXT_PUBLIC_APP_URL=https://medsbharatcom.vercel.app

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://hcacdavejbbzqzqjoqbp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Cloudinary (if used)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Razorpay (if used)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
```

### Step 4: Redeploy

After adding environment variables:

```bash
# Trigger a new deployment
vercel --prod

# Or click "Redeploy" in Vercel dashboard
```

## Quick Script to Get All Your Local Env Vars

Run this locally to see all your environment variables:

```bash
cat .env | grep -v "^#" | grep -v "^$"
```

Then copy the relevant ones to Vercel.

## Alternative: Use Vercel CLI

```bash
# Set environment variable via CLI
vercel env add DATABASE_URL production

# It will prompt you to enter the value
# Paste: postgresql://postgres:Chindwada%401@db.hcacdavejbbzqzqjoqbp.supabase.co:5432/postgres
```

## Verify Environment Variables

After adding:

1. Go to Vercel Dashboard → Settings → Environment Variables
2. You should see:
   - DATABASE_URL (Production, Preview, Development)
   - DIRECT_DATABASE_URL (Production, Preview, Development)
   - Other env vars

3. Trigger redeploy:
   ```bash
   vercel --prod
   ```

4. Test search again on https://medsbharatcom.vercel.app

## Expected Result After Fix

When you search for "amlo" or "amlodipine":
- Should find medicines in the database
- Should show results (currently shows 0 because no env vars)

## Current Database Status

Your Supabase database has:
- ✅ 6 pharmacies
- ✅ 30 medicines (includes Amlodipine)

But Vercel can't access it without the environment variables.

## Testing Locally vs Production

### Local (http://localhost:3000)
- ✅ Has .env file
- ✅ Can connect to database
- ✅ Should show results

### Production (https://medsbharatcom.vercel.app)
- ❌ No environment variables set
- ❌ Can't connect to database
- ❌ Shows 0 results

**Fix:** Add environment variables in Vercel dashboard

---

**Next Steps:**
1. Add DATABASE_URL to Vercel environment variables
2. Add DIRECT_DATABASE_URL to Vercel environment variables
3. Add other required env vars (NextAuth, Supabase, etc.)
4. Redeploy with `vercel --prod`
5. Test search again

**Documentation:**
- Vercel Env Vars: https://vercel.com/docs/projects/environment-variables
