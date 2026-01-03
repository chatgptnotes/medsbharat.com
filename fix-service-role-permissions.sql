-- Fix service role permissions for users table
-- Run this in Supabase SQL Editor

-- Grant all permissions on users table to service_role
GRANT ALL ON TABLE users TO service_role;

-- Grant usage on the sequence (for auto-incrementing IDs)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Alternative: Create a specific policy for service role even with RLS disabled
CREATE POLICY "Allow service role full access" ON users
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Check current permissions
SELECT grantee, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'users';

-- Verify service role has access
SELECT 
  schemaname, 
  tablename, 
  grantee, 
  privilege_type 
FROM information_schema.role_table_grants 
WHERE grantee = 'service_role' AND table_name = 'users';