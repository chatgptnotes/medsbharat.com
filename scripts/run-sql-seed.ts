import 'dotenv/config';
import { Pool } from 'pg';
import { readFileSync } from 'fs';

const connectionString = process.env.DATABASE_URL || '';

if (!connectionString) {
  console.error('DATABASE_URL not found in environment');
  process.exit(1);
}

async function runSeedSQL() {
  const pool = new Pool({ connectionString });

  try {
    console.log('🔌 Connecting to database...');

    // Read SQL file
    const sql = readFileSync('/tmp/seed_medicines.sql', 'utf-8');

    console.log('🚀 Running SQL seed script...');

    // Execute SQL
    const result = await pool.query(sql);

    console.log('✅ Seed completed successfully!');
    console.log('\nResults:');
    if (Array.isArray(result) && result.length > 0) {
      console.log(result[result.length - 1].rows[0]); // Last query result (SELECT summary)
    }

  } catch (error) {
    console.error('❌ Error running seed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runSeedSQL();
