"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
const database_1 = __importDefault(require("../config/database"));
class TenantRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super('tenants');
    }
    getSearchFields() {
        return ['name', 'domain', 'contact_email'];
    }
    async findByDomain(domain) {
        const result = await database_1.default.oneOrNone('SELECT * FROM tenants WHERE domain = $1', [domain]);
        return result;
    }
    async isDomainAvailable(domain, excludeId) {
        let query = 'SELECT 1 FROM tenants WHERE domain = $1';
        const params = [domain];
        if (excludeId) {
            query += ' AND id != $2';
            params.push(excludeId);
        }
        const result = await database_1.default.oneOrNone(query, params);
        return result === null;
    }
    async updateLicense(id, plan, licenseStart, licenseEnd) {
        const result = await database_1.default.oneOrNone('UPDATE tenants SET plan = $1, license_start = $2, license_end = $3 WHERE id = $4 RETURNING *', [plan, licenseStart, licenseEnd, id]);
        return result;
    }
    async updateStatus(id, isActive) {
        const result = await database_1.default.oneOrNone('UPDATE tenants SET is_active = $1 WHERE id = $2 RETURNING *', [isActive, id]);
        return result;
    }
    async findExpiredTenants() {
        const result = await database_1.default.any('SELECT * FROM tenants WHERE license_end < NOW() AND is_active = true', []);
        return result;
    }
    async findExpiringTenants(days = 7) {
        const result = await database_1.default.any('SELECT * FROM tenants WHERE license_end BETWEEN NOW() AND NOW() + INTERVAL \'${days} days\' AND is_active = true', []);
        return result;
    }
    async updateSettings(id, settings) {
        const result = await database_1.default.oneOrNone('UPDATE tenants SET settings = $1 WHERE id = $2 RETURNING *', [JSON.stringify(settings), id]);
        return result;
    }
    async getStats(id) {
        const userStats = await database_1.default.one('SELECT COUNT(*) as total, COUNT(CASE WHEN status = \'active\' THEN 1 END) as active FROM users WHERE tenant_id = $1', [id]);
        const branchStats = await database_1.default.one('SELECT COUNT(*) as total FROM branches WHERE tenant_id = $1', [id]);
        const studentStats = await database_1.default.one('SELECT COUNT(*) as total FROM students WHERE tenant_id = $1', [id]);
        const classStats = await database_1.default.one('SELECT COUNT(*) as total FROM classes WHERE tenant_id = $1', [id]);
        return {
            totalUsers: parseInt(userStats.total),
            totalBranches: parseInt(branchStats.total),
            totalStudents: parseInt(studentStats.total),
            totalClasses: parseInt(classStats.total),
            activeUsers: parseInt(userStats.active)
        };
    }
}
exports.TenantRepository = TenantRepository;
//# sourceMappingURL=TenantRepository.js.map