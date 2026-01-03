import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runMigration() {
  try {
    console.log('Adding orderCount column to medicines table...');

    await prisma.$executeRaw`
      DO $$
      BEGIN
          IF NOT EXISTS (
              SELECT 1
              FROM information_schema.columns
              WHERE table_name = 'medicines'
              AND column_name = 'ordercount'
          ) THEN
              ALTER TABLE "medicines" ADD COLUMN "orderCount" INTEGER NOT NULL DEFAULT 0;
              RAISE NOTICE 'Column orderCount added successfully';
          ELSE
              RAISE NOTICE 'Column orderCount already exists';
          END IF;
      END $$;
    `;

    console.log('✅ Migration completed successfully!');

    // Verify the column exists
    const result = await prisma.$queryRaw`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'medicines'
      AND column_name = 'ordercount';
    `;

    console.log('Verification:', result);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

runMigration();
