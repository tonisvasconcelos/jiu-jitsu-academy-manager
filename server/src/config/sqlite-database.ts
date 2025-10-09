import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';

// SQLite database setup for testing without Docker
const dbPath = path.join(__dirname, '../../test-academy.db');
const db = new sqlite3.Database(dbPath);

// Promisify database methods
const dbRun = promisify(db.run.bind(db));
const dbGet = promisify(db.get.bind(db));
const dbAll = promisify(db.all.bind(db));

export const query = async (sql: string, params: any[] = []): Promise<any> => {
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

export const testConnection = async (): Promise<void> => {
  try {
    await query('SELECT 1 as test');
    console.log('✅ SQLite database connection successful');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};

export default db;
