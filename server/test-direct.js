#!/usr/bin/env node

const pgPromise = require('pg-promise');

// Initialize pg-promise
const pgp = pgPromise({
  query: (e) => {
    console.log('SQL:', e.query);
  },
  error: (err, e) => {
    console.error('Database Error:', err);
  }
});

// Database configuration - hardcoded for testing
const dbConfig = {
  host: 'ep-steep-tooth-ac14qe2b-pooler.sa-east-1.aws.neon.tech',
  port: 5432,
  database: 'neondb',
  user: 'neondb_owner',
  password: 'npg_5NJmWgEc4rtU',
  ssl: { rejectUnauthorized: false },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// Create database connection
const db = pgp(dbConfig);

async function testConnection() {
  console.log('🔍 Testing direct database connection...');
  console.log('Config:', {
    host: dbConfig.host,
    port: dbConfig.port,
    database: dbConfig.database,
    user: dbConfig.user,
    ssl: dbConfig.ssl
  });
  
  try {
    const result = await db.one('SELECT NOW()');
    console.log('✅ Database connection successful!');
    console.log('Current time:', result.now);
    console.log('🎉 Your PostgreSQL database is ready to use.');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    await db.$pool.end();
  }
}

testConnection();
