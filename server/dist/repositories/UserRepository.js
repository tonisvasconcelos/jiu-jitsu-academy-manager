"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
const types_1 = require("../types");
const database_1 = __importDefault(require("../config/database"));
class UserRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super('users');
    }
    getSearchFields() {
        return ['first_name', 'last_name', 'email'];
    }
    async findByEmail(email, tenantId) {
        const result = await database_1.default.oneOrNone('SELECT * FROM users WHERE email = $1 AND tenant_id = $2', [email, tenantId]);
        return result;
    }
    async findByRole(role, tenantId) {
        const result = await database_1.default.any('SELECT * FROM users WHERE role = $1 AND tenant_id = $2 ORDER BY created_at DESC', [role, tenantId]);
        return result;
    }
    async findByBranch(branchId, tenantId) {
        const result = await database_1.default.any('SELECT * FROM users WHERE branch_id = $1 AND tenant_id = $2 ORDER BY created_at DESC', [branchId, tenantId]);
        return result;
    }
    async findCoachesByBranch(branchId, tenantId) {
        const result = await database_1.default.any('SELECT * FROM users WHERE branch_id = $1 AND tenant_id = $2 AND role = $3 ORDER BY first_name, last_name', [branchId, tenantId, types_1.UserRole.COACH]);
        return result;
    }
    async updateStatus(id, tenantId, status) {
        const result = await database_1.default.oneOrNone('UPDATE users SET status = $1 WHERE id = $2 AND tenant_id = $3 RETURNING *', [status, id, tenantId]);
        return result;
    }
    async updateLastLogin(id, tenantId) {
        await database_1.default.none('UPDATE users SET last_login = NOW() WHERE id = $1 AND tenant_id = $2', [id, tenantId]);
    }
    async findByEmailVerificationToken(token) {
        const result = await database_1.default.oneOrNone('SELECT * FROM users WHERE email_verification_token = $1', [token]);
        return result;
    }
    async setEmailVerificationToken(id, tenantId, token) {
        await database_1.default.none('UPDATE users SET email_verification_token = $1 WHERE id = $2 AND tenant_id = $3', [token, id, tenantId]);
    }
    async verifyEmail(id, tenantId) {
        const result = await database_1.default.oneOrNone('UPDATE users SET email_verified = true, email_verification_token = NULL WHERE id = $1 AND tenant_id = $2 RETURNING *', [id, tenantId]);
        return result;
    }
    async setPasswordResetToken(id, tenantId, token, expires) {
        await database_1.default.none('UPDATE users SET password_reset_token = $1, password_reset_expires = $2 WHERE id = $3 AND tenant_id = $4', [token, expires, id, tenantId]);
    }
    async findByPasswordResetToken(token) {
        const result = await database_1.default.oneOrNone('SELECT * FROM users WHERE password_reset_token = $1 AND password_reset_expires > NOW()', [token]);
        return result;
    }
    async clearPasswordResetToken(id, tenantId) {
        await database_1.default.none('UPDATE users SET password_reset_token = NULL, password_reset_expires = NULL WHERE id = $1 AND tenant_id = $2', [id, tenantId]);
    }
    async updatePassword(id, tenantId, passwordHash) {
        await database_1.default.none('UPDATE users SET password_hash = $1, password_reset_token = NULL, password_reset_expires = NULL WHERE id = $2 AND tenant_id = $3', [passwordHash, id, tenantId]);
    }
    async getStats(tenantId) {
        const totalResult = await database_1.default.one('SELECT COUNT(*) as total FROM users WHERE tenant_id = $1', [tenantId]);
        const activeResult = await database_1.default.one('SELECT COUNT(*) as active FROM users WHERE tenant_id = $1 AND status = $2', [tenantId, types_1.UserStatus.ACTIVE]);
        const roleResults = await database_1.default.any('SELECT role, COUNT(*) as count FROM users WHERE tenant_id = $1 GROUP BY role', [tenantId]);
        const byRole = roleResults.reduce((acc, row) => {
            acc[row.role] = parseInt(row.count);
            return acc;
        }, {});
        return {
            total: parseInt(totalResult.total),
            active: parseInt(activeResult.active),
            byRole
        };
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=UserRepository.js.map