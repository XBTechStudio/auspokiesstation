/**
 * 本地数据库初始化脚本 (xbtech19)
 * 运行: node scripts/init-local-database.js
 */

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const dbConfig = {
  host: process.env.DB_HOST || '45.32.122.230',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER_LOCAL || 'xbtech19',
  password: process.env.DB_PASSWORD_LOCAL || 'VugpICWuRg7xVIzhpvid',
  database: process.env.DB_NAME_LOCAL || 'xbtech19',
};

async function initDatabase() {
  let connection;
  
  try {
    console.log('Connecting to local database (xbtech19)...');
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected successfully!');

    // Create admin_users table
    console.log('\nCreating admin_users table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✓ admin_users table created');

    // Create announcements table (local management)
    console.log('\nCreating announcements table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS announcements (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        category VARCHAR(100) NOT NULL,
        image VARCHAR(500),
        is_important BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category),
        INDEX idx_is_important (is_important),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✓ announcements table created');

    // Create site_settings table (local override settings)
    console.log('\nCreating site_settings table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        \`key\` VARCHAR(100) NOT NULL UNIQUE,
        \`value\` TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_key (\`key\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✓ site_settings table created');

    // Check if default user exists
    const [rows] = await connection.query(
      'SELECT COUNT(*) as count FROM admin_users WHERE username = ?',
      ['xbtech']
    );

    if (rows[0].count === 0) {
      console.log('\nCreating default admin user...');
      const hashedPassword = await bcrypt.hash('xbtech', 10);
      
      await connection.query(
        'INSERT INTO admin_users (username, password) VALUES (?, ?)',
        ['xbtech', hashedPassword]
      );
      
      console.log('✓ Default admin user created');
      console.log('  Username: xbtech');
      console.log('  Password: xbtech');
      console.log('\n⚠️  Please change the default password after first login!');
    } else {
      console.log('\nDefault admin user already exists');
      // Update password if needed
      const [userRows] = await connection.query(
        'SELECT id FROM admin_users WHERE username = ?',
        ['xbtech']
      );
      if (userRows.length > 0) {
        const hashedPassword = await bcrypt.hash('xbtech', 10);
        await connection.query(
          'UPDATE admin_users SET password = ? WHERE username = ?',
          [hashedPassword, 'xbtech']
        );
        console.log('✓ Admin user password updated');
      }
    }

    console.log('\n✓ Database initialization completed successfully!');
    console.log('\nDatabase: xbtech19');
    console.log('Tables created:');
    console.log('  - admin_users (管理员用户)');
    console.log('  - announcements (公告 - 本地管理)');
    console.log('  - site_settings (站点设置 - 本地覆盖)');

  } catch (error) {
    console.error('\n✗ Database initialization failed:');
    console.error(error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n⚠️  Database access denied!');
      console.error('Please check:');
      console.error('1. Database credentials are correct');
      console.error('2. User has permission to access from your IP');
      console.error('3. Database server allows remote connections');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('\n⚠️  Database does not exist!');
      console.error('Please create the database first:');
      console.error('  CREATE DATABASE xbtech19 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');
    }
    
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initDatabase();
