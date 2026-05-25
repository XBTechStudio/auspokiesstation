import mysql from 'mysql2/promise';

// WildGroup Database configuration
const dbConfig: mysql.PoolOptions = {
  host: process.env.WG_DB_HOST || '45.32.122.230',
  port: parseInt(process.env.WG_DB_PORT || '3306'),
  user: process.env.WG_DB_USER || 'xbtech14',
  password: process.env.WG_DB_PASSWORD || 'VugpICWuRg7xVIzhpvid',
  database: process.env.WG_DB_NAME || 'xbtech14',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.WG_DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
};

// Create connection pool
let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

// Query helper
export async function query(sql: string, params?: any[]) {
  const connection = await getPool().getConnection();
  try {
    const [results] = await connection.query(sql, params);
    return results;
  } finally {
    connection.release();
  }
}
