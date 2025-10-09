"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pgp = exports.withTransaction = exports.clearTenantContext = exports.setTenantContext = exports.testConnection = void 0;
const pg_promise_1 = __importDefault(require("pg-promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pgp = (0, pg_promise_1.default)({
    query: (e) => {
        if (process.env.NODE_ENV === 'development') {
            console.log('SQL:', e.query);
        }
    },
    error: (err, e) => {
        console.error('Database Error:', err);
    }
});
exports.pgp = pgp;
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'jiu_jitsu_academy_manager',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
};
const db = pgp(dbConfig);
const testConnection = async () => {
    try {
        await db.one('SELECT NOW()');
        console.log('✅ Database connection established successfully');
    }
    catch (error) {
        console.error('❌ Database connection failed:', error);
        throw error;
    }
};
exports.testConnection = testConnection;
const setTenantContext = async (tenantId) => {
    try {
        await db.none('SELECT set_config($1, $2, true)', ['current_tenant_id', tenantId]);
    }
    catch (error) {
        console.error('Error setting tenant context:', error);
        throw error;
    }
};
exports.setTenantContext = setTenantContext;
const clearTenantContext = async () => {
    try {
        await db.none('SELECT set_config($1, NULL, true)', ['current_tenant_id']);
    }
    catch (error) {
        console.error('Error clearing tenant context:', error);
        throw error;
    }
};
exports.clearTenantContext = clearTenantContext;
const withTransaction = async (callback) => {
    return await db.tx(callback);
};
exports.withTransaction = withTransaction;
exports.default = db;
//# sourceMappingURL=database.js.map