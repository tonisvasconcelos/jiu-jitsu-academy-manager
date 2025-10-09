"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleAuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
const sqlite_database_1 = require("../config/sqlite-database");
const types_1 = require("../types");
class SimpleAuthService {
    async login(credentials) {
        const { domain, email, password } = credentials;
        const tenantResult = await (0, sqlite_database_1.query)('SELECT * FROM tenants WHERE domain = ? AND is_active = 1', [domain]);
        if (tenantResult.rows.length === 0) {
            throw new Error('Invalid tenant domain');
        }
        const tenant = tenantResult.rows[0];
        if (tenant.license_end && new Date(tenant.license_end) < new Date()) {
            throw new Error('Tenant license has expired');
        }
        const userResult = await (0, sqlite_database_1.query)('SELECT * FROM users WHERE email = ? AND tenant_id = ? AND status = ?', [email, tenant.id, 'active']);
        if (userResult.rows.length === 0) {
            throw new Error('Invalid credentials');
        }
        const user = userResult.rows[0];
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password_hash);
        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }
        const token = Buffer.from(JSON.stringify({
            userId: user.id,
            tenantId: tenant.id,
            role: user.role,
            email: user.email
        })).toString('base64');
        return {
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                tenantId: tenant.id,
                firstName: user.first_name,
                lastName: user.last_name
            }
        };
    }
    async register(data) {
        const { domain, email, password, firstName, lastName, role = types_1.UserRole.STUDENT } = data;
        const tenantResult = await (0, sqlite_database_1.query)('SELECT * FROM tenants WHERE domain = ? AND is_active = 1', [domain]);
        if (tenantResult.rows.length === 0) {
            throw new Error('Invalid tenant domain');
        }
        const tenant = tenantResult.rows[0];
        const existingUserResult = await (0, sqlite_database_1.query)('SELECT * FROM users WHERE email = ? AND tenant_id = ?', [email, tenant.id]);
        if (existingUserResult.rows.length > 0) {
            throw new Error('User already exists with this email');
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 12);
        const userId = (0, uuid_1.v4)();
        await (0, sqlite_database_1.query)(`INSERT INTO users (
        id, tenant_id, email, password_hash, first_name, last_name,
        role, status, email_verified
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [userId, tenant.id, email, passwordHash, firstName, lastName, role, 'active', 1]);
        const token = Buffer.from(JSON.stringify({
            userId,
            tenantId: tenant.id,
            role,
            email
        })).toString('base64');
        return {
            success: true,
            token,
            user: {
                id: userId,
                email,
                role,
                tenantId: tenant.id,
                firstName,
                lastName
            }
        };
    }
}
exports.SimpleAuthService = SimpleAuthService;
//# sourceMappingURL=SimpleAuthService.js.map