-- Final Fix for Supabase Service Role Permissions
-- Run this in Supabase SQL Editor to fix registration/authentication

-- Step 1: Grant all permissions on users table to service_role
GRANT ALL ON TABLE users TO service_role;

-- Step 2: Grant permissions on sequences (for ID generation)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Step 3: Grant permissions on schema
GRANT USAGE ON SCHEMA public TO service_role;

-- Step 4: Create policy for service role (even though RLS is disabled)
DROP POLICY IF EXISTS "Allow service role full access" ON users;
CREATE POLICY "Allow service role full access" ON users
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Step 5: Ensure RLS is disabled (run again to be sure)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Step 6: Grant INSERT, SELECT, UPDATE permissions explicitly
GRANT INSERT, SELECT, UPDATE, DELETE ON users TO service_role;

-- Verification queries (run these to check permissions)
SELECT 
  grantee, 
  privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'users' AND grantee = 'service_role';

-- Check RLS status
SELECT 
  schemaname, 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE tablename = 'users';