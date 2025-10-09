const sqlite3 = require('sqlite3');
const { promisify } = require('util');
const path = require('path');

// SQLite database setup for Vercel
const dbPath = path.join(__dirname, '../../test-academy.db');
const db = new sqlite3.Database(dbPath);

// Promisify database methods
const dbRun = promisify(db.run.bind(db));
const dbGet = promisify(db.get.bind(db));
const dbAll = promisify(db.all.bind(db));

const query = async (sql, params = []) => {
  return new Promise((resolve, reject) => {
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      if (sql.includes('COUNT(*)') || sql.includes('LIMIT 1')) {
        db.get(sql, params, (err, row) => {
          if (err) reject(err);
          else resolve({ rows: row ? [row] : [] });
        });
      } else {
        db.all(sql, params, (err, rows) => {
          if (err) reject(err);
          else resolve({ rows: rows || [] });
        });
      }
    } else {
      db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ rows: [{ id: this.lastID }] });
      });
    }
  });
};

const testConnection = async () => {
  try {
    await query('SELECT 1 as test');
    console.log('✅ SQLite database connection successful');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};

module.exports = { query, testConnection };

