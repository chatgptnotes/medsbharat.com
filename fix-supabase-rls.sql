-- Fix Supabase RLS policies for registration
-- Run this in Supabase SQL Editor

-- Enable RLS on users table (if not already enabled)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to insert users (for registration)
CREATE POLICY "Service role can insert users" ON users
  FOR INSERT TO service_role
  WITH CHECK (true);

-- Create policy to allow service role to select users (for authentication)
CREATE POLICY "Service role can select users" ON users
  FOR SELECT TO service_role
  USING (true);

-- Create policy to allow service role to update users 
CREATE POLICY "Service role can update users" ON users
  FOR UPDATE TO service_role
  USING (true);

-- Alternative: If you want to temporarily disable RLS for testing:
-- ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Check current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'users';