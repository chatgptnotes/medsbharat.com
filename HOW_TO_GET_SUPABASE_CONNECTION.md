# How to Get Supabase Direct Connection String

## Step-by-Step Guide with Screenshots

### Step 1: Open Supabase Dashboard
1. Go to: https://supabase.com/dashboard
2. Login if needed
3. Select your project: **hcacdavejbbzqzqjoqbp**

### Step 2: Navigate to Database Settings
1. In the left sidebar, click the **Settings** icon (gear icon ⚙️) at the bottom
2. In the Settings menu, click **Database**

### Step 3: Find Connection Strings Section
Scroll down to the section called **"Connection string"** or **"Connection pooling"**

You'll see several tabs:
- **URI** (or **Connection string**)
- **JDBC**
- **.NET**
- **Golang**
- **Python**

### Step 4: Get the Connection Strings

#### For DATABASE_URL (Pooled Connection):
1. Look for **"Connection pooling"** section
2. Click on **"Transaction"** mode or **"Session"** mode
3. You'll see a connection string like:
   ```
   postgresql://postgres.hcacdavejbbzqzqjoqbp:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
   ```
4. There should be a toggle or checkbox for **"Use connection pooling"** or **"Pooler"**
5. Copy this string - this is your **DATABASE_URL**

#### For DIRECT_DATABASE_URL (Direct Connection):
1. In the same **"Connection string"** section
2. Look for **"Direct connection"** or toggle OFF the "Use connection pooling" option
3. You'll see a different connection string like:
   ```
   postgresql://postgres.hcacdavejbbzqzqjoqbp:[YOUR-PASSWORD]@db.hcacdavejbbzqzqjoqbp.supabase.co:5432/postgres
   ```
   OR
   ```
   postgresql://postgres.hcacdavejbbzqzqjoqbp:[YOUR-PASSWORD]@aws-0-ap-south-1.compute.internal.supabase.com:5432/postgres
   ```
4. Notice the difference:
   - **Pooled:** Uses `.pooler.supabase.com:6543`
   - **Direct:** Uses `.supabase.co:5432` or `.compute.internal.supabase.com:5432`

### Alternative Method (If Above Doesn't Work):

If you can't find the Direct Connection option, try this:

1. Go to **Settings** → **Database**
2. Look for **"Connection parameters"** or **"Database settings"**
3. You'll see individual fields:
   - **Host:** Should be something like `db.hcacdavejbbzqzqjoqbp.supabase.co`
   - **Port:** Usually `5432` for direct, `6543` for pooled
   - **Database name:** Usually `postgres`
   - **User:** Usually `postgres.hcacdavejbbzqzqjoqbp`
   - **Password:** Your database password

4. Manually construct the connection string:
   ```
   postgresql://[User]:[Password]@[Host]:[Port]/[Database]
   ```

   Example:
   ```
   postgresql://postgres.hcacdavejbbzqzqjoqbp:YourPassword@db.hcacdavejbbzqzqjoqbp.supabase.co:5432/postgres
   ```

## Visual Guide

### What to Look For:

**Pooled Connection (for DATABASE_URL):**
- Contains: `.pooler.supabase.com`
- Port: `6543`
- May have: `?pgbouncer=true` at the end

**Direct Connection (for DIRECT_DATABASE_URL):**
- Contains: `.supabase.co` OR `.compute.internal.supabase.com`
- Port: `5432`
- No pgbouncer parameter

## Quick Check

Run this command to see your current connection strings:
```bash
grep -E "^(DATABASE_URL|DIRECT_DATABASE_URL)" /Users/murali/1backup/medsbharat.com/.env
```

Your current (WRONG) DIRECT_DATABASE_URL:
```
DIRECT_DATABASE_URL="postgresql://postgres.hcacdavejbbzqzqjoqbp:Chindwada%401@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"
```

Notice it says `.pooler.supabase.com` - this is WRONG for direct connection!

It should say:
```
DIRECT_DATABASE_URL="postgresql://postgres.hcacdavejbbzqzqjoqbp:Chindwada%401@db.hcacdavejbbzqzqjoqbp.supabase.co:5432/postgres"
```

## If You Still Can't Find It:

### Option 1: Use Supabase CLI
```bash
# Install Supabase CLI if not installed
brew install supabase/tap/supabase

# Login
supabase login

# Get database URL
supabase db url --project-ref hcacdavejbbzqzqjoqbp
```

### Option 2: Check Project Settings
1. Go to: https://supabase.com/dashboard/project/hcacdavejbbzqzqjoqbp/settings/database
2. Look for **"Connection Info"** section
3. You should see:
   - **Host** (this is your direct connection host)
   - **Port** (should be 5432 for direct)
   - **Database name**
   - **User**

### Option 3: Contact Support
If you still can't find it, the Supabase dashboard might have changed. Here's what you need:
- A connection string WITHOUT `.pooler` in the hostname
- Port `5432` (not `6543`)

## Once You Have Both Strings:

Update your `.env` file:

```env
# Pooled connection (has .pooler and port 6543)
DATABASE_URL="postgresql://postgres.hcacdavejbbzqzqjoqbp:Chindwada%401@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection (has .supabase.co and port 5432)
DIRECT_DATABASE_URL="postgresql://postgres.hcacdavejbbzqzqjoqbp:Chindwada%401@db.hcacdavejbbzqzqjoqbp.supabase.co:5432/postgres"
```

Then test:
```bash
npx prisma db pull
```

If it works, you should see: "Introspection completed successfully"

---

**Need Help?** Take a screenshot of your Supabase Database Settings page and I can help you identify the correct strings.
