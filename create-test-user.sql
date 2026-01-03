-- Create a test user for login testing
-- Email: bhupendra@gmail.com 
-- Password: password123
-- Role: PATIENT

-- Delete existing user if exists
DELETE FROM users WHERE email = 'bhupendra@gmail.com';

-- Insert test user with bcrypt hashed password
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
  'test-user-bhupendra-123',
  'bhupendra@gmail.com',
  'Bhupendra Kumar',
  '+911234567890',
  'PATIENT',
  '$2b$12$UmdNQIi/yFYsTlAYb6eC5.e8MTCFvXBXCDM6nC2JQF7qjV6HDKpq2',
  NOW(),
  NOW(),
  NOW(),
  NOW()
);

-- Verify the user was created
SELECT id, email, name, role, "passwordHash" FROM users WHERE email = 'bhupendra@gmail.com';