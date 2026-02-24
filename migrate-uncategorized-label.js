require('dotenv').config();
const pool = require('./lib/utils/pool');

async function migrate() {
  try {
    await pool.query(`
      ALTER TABLE restaurant_settings
      ADD COLUMN IF NOT EXISTS uncategorized_label VARCHAR(50) DEFAULT 'Uncategorized'
    `);
    console.log('✅ Added uncategorized_label column');
    await pool.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
    process.exit(1);
  }
}

migrate();
