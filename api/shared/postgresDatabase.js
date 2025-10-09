import pgPromise from 'pg-promise';

// Initialize pg-promise
const pgp = pgPromise({
  query: (e) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('SQL:', e.query);
    }
  },
  error: (err, e) => {
    console.error('Database Error:', err);
  }
});

// Database configuration for Neon PostgreSQL
const dbConfig = {
  host: process.env.DB_HOST || 'ep-steep-tooth-ac14qe2b-pooler.sa-east-1.aws.neon.tech',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'neondb',
  user: process.env.DB_USER || 'neondb_owner',
  password: process.env.DB_PASSWORD || 'npg_5NJmWgEc4rtU',
  ssl: { rejectUnauthorized: false }, // Always use SSL for Neon
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// Create database connection
const db = pgp(dbConfig);

// Test database connection
export const testConnection = async () => {
  try {
    const result = await db.one('SELECT NOW()');
    console.log('✅ PostgreSQL connection successful:', result.now);
    return result;
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error);
    throw error;
  }
};

// Set tenant context for RLS (Row Level Security)
export const setTenantContext = async (tenantId) => {
  try {
    await db.none('SELECT set_config($1, $2, true)', ['current_tenant_id', tenantId]);
  } catch (error) {
    console.error('Error setting tenant context:', error);
    throw error;
  }
};

// Clear tenant context
export const clearTenantContext = async () => {
  try {
    await db.none('SELECT set_config($1, NULL, true)', ['current_tenant_id']);
  } catch (error) {
    console.error('Error clearing tenant context:', error);
    throw error;
  }
};

// Authentication service functions
export const authService = {
  // Find tenant by domain
  async findTenantByDomain(domain) {
    try {
      const tenant = await db.oneOrNone(
        'SELECT * FROM tenants WHERE domain = $1 AND is_active = true',
        [domain]
      );
      return tenant;
    } catch (error) {
      console.error('Error finding tenant by domain:', error);
      throw error;
    }
  },

  // Find user by email within tenant
  async findUserByEmail(email, tenantId) {
    try {
      const user = await db.oneOrNone(
        'SELECT * FROM users WHERE email = $1 AND tenant_id = $2',
        [email, tenantId]
      );
      return user;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  },

  // Update last login
  async updateLastLogin(userId, tenantId) {
    try {
      await db.none(
        'UPDATE users SET last_login = NOW() WHERE id = $1 AND tenant_id = $2',
        [userId, tenantId]
      );
    } catch (error) {
      console.error('Error updating last login:', error);
      throw error;
    }
  }
};

export default db;
export { pgp };
