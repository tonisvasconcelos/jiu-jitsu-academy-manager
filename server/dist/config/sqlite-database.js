"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConnection = exports.query = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const util_1 = require("util");
const path_1 = __importDefault(require("path"));
const dbPath = path_1.default.join(__dirname, '../../test-academy.db');
const db = new sqlite3_1.default.Database(dbPath);
const dbRun = (0, util_1.promisify)(db.run.bind(db));
const dbGet = (0, util_1.promisify)(db.get.bind(db));
const dbAll = (0, util_1.promisify)(db.all.bind(db));
const query = async (sql, params = []) => {
    return new Promise((resolve, reject) => {
        if (sql.trim().toUpperCase().startsWith('SELECT')) {
            if (sql.includes('COUNT(*)') || sql.includes('LIMIT 1')) {
                db.get(sql, params, (err, row) => {
                    if (err)
                        reject(err);
                    else
                        resolve({ rows: row ? [row] : [] });
                });
            }
            else {
                db.all(sql, params, (err, rows) => {
                    if (err)
                        reject(err);
                    else
                        resolve({ rows: rows || [] });
                });
            }
        }
        else {
            db.run(sql, params, function (err) {
                if (err)
                    reject(err);
                else
                    resolve({ rows: [{ id: this.lastID }] });
            });
        }
    });
};
exports.query = query;
const testConnection = async () => {
    try {
        await (0, exports.query)('SELECT 1 as test');
        console.log('✅ SQLite database connection successful');
    }
    catch (error) {
        console.error('❌ Database connection failed:', error);
        throw error;
    }
};
exports.testConnection = testConnection;
exports.default = db;
//# sourceMappingURL=sqlite-database.js.map