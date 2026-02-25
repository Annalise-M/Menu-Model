require('dotenv').config();
const pool = require('./lib/utils/pool');

async function migrate() {
  try {
    await pool.query(`
      ALTER TABLE restaurant_settings
      ADD COLUMN IF NOT EXISTS primary_font VARCHAR(100) DEFAULT 'Inter, system-ui, sans-serif'
    `);
    console.log('✅ Added primary_font column');
    await pool.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
    process.exit(1);
  }
}

migrate();
