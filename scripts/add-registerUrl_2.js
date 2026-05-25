/**
 * Add registerUrl_2 column to brands table in both databases
 * Run: node scripts/add-registerUrl_2.js
 */

const mysql = require('mysql2/promise');

// WildGroup Database configuration (xbtech14)
const wildGroupConfig = {
  host: process.env.WG_DB_HOST || '45.32.122.230',
  port: parseInt(process.env.WG_DB_PORT || '3306'),
  user: process.env.WG_DB_USER || 'xbtech14',
  password: process.env.WG_DB_PASSWORD || 'VugpICWuRg7xVIzhpvid',
  database: process.env.WG_DB_NAME || 'xbtech14',
};

// 88Group Database configuration (xbtech17)
const group88Config = {
  host: process.env.G88_DB_HOST || process.env.DB_HOST || '45.32.122.230',
  port: parseInt(process.env.G88_DB_PORT || process.env.DB_PORT || '3306'),
  user: process.env.G88_DB_USER || process.env.DB_USER || 'xbtech17',
  password: process.env.G88_DB_PASSWORD || process.env.DB_PASSWORD || 'VugpICWuRg7xVIzhpvid',
  database: process.env.G88_DB_NAME || process.env.DB_NAME || 'xbtech17',
};

async function addColumnToDatabase(config, dbName) {
  let connection;
  try {
    console.log(`\nConnecting to ${dbName} database...`);
    connection = await mysql.createConnection(config);
    console.log(`✓ Connected to ${dbName}`);

    // Check if column already exists
    console.log(`Checking if registerUrl_2 column exists in ${dbName}...`);
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME = 'brands' 
      AND COLUMN_NAME = 'registerUrl_2'
    `, [config.database]);

    if (columns.length > 0) {
      console.log(`⚠ Column registerUrl_2 already exists in ${dbName}. Skipping...`);
      return;
    }

    // Add the column
    console.log(`Adding registerUrl_2 column to brands table in ${dbName}...`);
    await connection.query(`
      ALTER TABLE brands 
      ADD COLUMN registerUrl_2 VARCHAR(500) NULL AFTER register_url
    `);
    console.log(`✓ Successfully added registerUrl_2 column to ${dbName}`);

  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log(`⚠ Column registerUrl_2 already exists in ${dbName}. Skipping...`);
    } else {
      console.error(`✗ Error updating ${dbName}:`, error.message);
      throw error;
    }
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('Adding registerUrl_2 column to brands table');
  console.log('='.repeat(60));

  try {
    // Add to WildGroup database
    await addColumnToDatabase(wildGroupConfig, 'WildGroup (xbtech14)');

    // Add to 88Group database
    await addColumnToDatabase(group88Config, '88Group (xbtech17)');

    console.log('\n' + '='.repeat(60));
    console.log('✓ All databases updated successfully!');
    console.log('='.repeat(60));
  } catch (error) {
    console.error('\n✗ Script failed:', error.message);
    process.exit(1);
  }
}

main();
