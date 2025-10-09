import pgPromise from 'pg-promise';
import dotenv from 'dotenv';

dotenv.config();

// Initialize pg-promise
const pgp = pgPromise({
  // Log SQL queries in development
  query: (e) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('SQL:', e.query);
    }
  },
  // Handle errors
  error: (err, e) => {
    console.error('Database Error:', err);
  }
});

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'jiu_jitsu_academy_manager',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
};

// Create database connection
const db = pgp(dbConfig);

// Test database connection
export const testConnection = async (): Promise<void> => {
  try {
    await db.one('SELECT NOW()');
    console.log('✅ Database connection established successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};

// Set tenant context for RLS (Row Level Security)
export const setTenantContext = async (tenantId: string): Promise<void> => {
  try {
    await db.none('SELECT set_config($1, $2, true)', ['current_tenant_id', tenantId]);
  } catch (error) {
    console.error('Error setting tenant context:', error);
    throw error;
  }
};

// Clear tenant context
export const clearTenantContext = async (): Promise<void> => {
  try {
    await db.none('SELECT set_config($1, NULL, true)', ['current_tenant_id']);
  } catch (error) {
    console.error('Error clearing tenant context:', error);
    throw error;
  }
};

// Transaction helper
export const withTransaction = async <T>(
  callback: (t: pgPromise.ITask<{}>) => Promise<T>
): Promise<T> => {
  return await db.tx(callback);
};

export default db;
export { pgp };
