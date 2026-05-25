/**
 * 更新管理员密码脚本
 * 运行: node scripts/update-admin-password.js
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

async function updateAdminPassword() {
  let connection;
  
  try {
    console.log('Connecting to local database (xbtech19)...');
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected successfully!');

    // Check if xbtech user exists
    const [rows] = await connection.query(
      'SELECT id FROM admin_users WHERE username = ?',
      ['xbtech']
    );

    const hashedPassword = await bcrypt.hash('xbtech', 10);

    if (rows.length > 0) {
      // Update existing user
      await connection.query(
        'UPDATE admin_users SET password = ? WHERE username = ?',
        [hashedPassword, 'xbtech']
      );
      console.log('✓ Admin user password updated');
    } else {
      // Create new user
      await connection.query(
        'INSERT INTO admin_users (username, password) VALUES (?, ?)',
        ['xbtech', hashedPassword]
      );
      console.log('✓ Admin user created');
    }

    // Delete old admin user if exists
    const [oldRows] = await connection.query(
      'SELECT id FROM admin_users WHERE username = ?',
      ['admin']
    );
    if (oldRows.length > 0) {
      await connection.query(
        'DELETE FROM admin_users WHERE username = ?',
        ['admin']
      );
      console.log('✓ Old admin user removed');
    }

    console.log('\n✓ Password update completed!');
    console.log('\nAdmin credentials:');
    console.log('  Username: xbtech');
    console.log('  Password: xbtech');

  } catch (error) {
    console.error('\n✗ Password update failed:');
    console.error(error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

updateAdminPassword();
