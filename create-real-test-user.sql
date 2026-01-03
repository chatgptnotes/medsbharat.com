-- Create test user for real database authentication
-- Run this in Supabase SQL Editor

-- Create user with email admin@gmail.com and password "bhupendra"
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
  'test-admin-' || extract(epoch from now()),
  'admin@gmail.com',
  'Admin User',
  '+917898765432',
  'PATIENT',
  crypt('bhupendra', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  NOW()
) 
ON CONFLICT (email) DO UPDATE SET
  "passwordHash" = EXCLUDED."passwordHash",
  "updatedAt" = NOW();

-- Verify the user was created
SELECT id, email, name, role FROM users WHERE email = 'admin@gmail.com';