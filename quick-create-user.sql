-- Quick user creation script for Supabase SQL Editor
-- This bypasses RLS and creates a user directly
-- Email: admin@gmail.com 
-- Phone: +917898765432
-- Password: bhupendra (as entered in the form)

-- First, disable RLS temporarily for this operation
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Delete existing user if exists (optional)
DELETE FROM users WHERE email = 'admin@gmail.com';

-- Create the bcrypt hash for password "bhupendra"
-- Hash generated: $2b$12$hash_will_be_calculated

-- Insert new user directly
INSERT INTO users (
  id,
  email,
  name,
  phone,
  role,
  "passwordHash",
  "emailVerified",
  "phoneVerified", 
  "createdAt",
  "updatedAt"
) VALUES (
  'user-admin-' || extract(epoch from now()),
  'admin@gmail.com',
  'admin',
  '+917898765432',
  'PATIENT',
  crypt('bhupendra', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(), 
  NOW()
);

-- Re-enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Verify the user was created
SELECT id, email, name, phone, role, "createdAt" FROM users WHERE email = 'admin@gmail.com';