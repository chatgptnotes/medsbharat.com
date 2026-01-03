-- Fix ID column for users table
-- Run this in Supabase SQL Editor

-- Option 1: Set default value for id column (using cuid)
ALTER TABLE users ALTER COLUMN id SET DEFAULT concat('user_', extract(epoch from now()), '_', floor(random() * 1000));

-- Option 2: Or use UUID (more standard)
-- First enable uuid extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Then set default UUID for id column
ALTER TABLE users ALTER COLUMN id SET DEFAULT uuid_generate_v4();

-- Option 3: Or use simple text ID with timestamp
-- ALTER TABLE users ALTER COLUMN id SET DEFAULT concat('user_', extract(epoch from now()));

-- Verify the change
SELECT column_name, column_default, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'id';