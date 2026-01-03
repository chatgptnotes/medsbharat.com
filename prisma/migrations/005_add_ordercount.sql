-- Add orderCount column to medicines table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'medicines'
        AND column_name = 'ordercount'
    ) THEN
        ALTER TABLE "medicines" ADD COLUMN "orderCount" INTEGER NOT NULL DEFAULT 0;
    END IF;
END $$;
