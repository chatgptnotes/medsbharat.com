-- Drop and recreate users table with proper ID column
-- Run this in Supabase SQL Editor

-- Drop existing users table
DROP TABLE IF EXISTS users CASCADE;

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create new users table with proper ID defaults
CREATE TABLE users (
    id TEXT NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    "passwordHash" TEXT NOT NULL,
    role VARCHAR(50) DEFAULT 'PATIENT' NOT NULL,
    "emailVerified" TIMESTAMP,
    image TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Grant all permissions to service_role
GRANT ALL ON TABLE users TO service_role;

-- Disable RLS for easier access
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Create policy for service role (even with RLS disabled)
CREATE POLICY "Allow service role full access" ON users
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Verify the table structure
SELECT column_name, column_default, is_nullable, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- Check permissions
SELECT grantee, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'users' AND grantee = 'service_role';