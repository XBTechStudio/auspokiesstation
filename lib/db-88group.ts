import mysql from 'mysql2/promise';

// 88Group Database configuration - Using xbtech17 database (same as 88group project)
const dbConfig: mysql.PoolOptions = {
  host: process.env.G88_DB_HOST || process.env.DB_HOST || '45.32.122.230',
  port: parseInt(process.env.G88_DB_PORT || process.env.DB_PORT || '3306'),
  user: process.env.G88_DB_USER || process.env.DB_USER || 'xbtech17',
  password: process.env.G88_DB_PASSWORD || process.env.DB_PASSWORD || 'VugpICWuRg7xVIzhpvid',
  database: process.env.G88_DB_NAME || process.env.DB_NAME || 'xbtech17',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: (process.env.G88_DB_SSL || process.env.DB_SSL) === 'true' ? { rejectUnauthorized: false } : undefined,
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
