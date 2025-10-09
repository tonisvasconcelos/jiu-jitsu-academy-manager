"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
const database_1 = __importDefault(require("../config/database"));
class ClassRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super('classes');
    }
    getSearchFields() {
        return ['name', 'description', 'modality'];
    }
    async findByBranch(branchId, tenantId) {
        const result = await database_1.default.any('SELECT * FROM classes WHERE branch_id = $1 AND tenant_id = $2 ORDER BY start_time', [branchId, tenantId]);
        return result;
    }
    async findByCoach(coachId, tenantId) {
        const result = await database_1.default.any('SELECT * FROM classes WHERE coach_id = $1 AND tenant_id = $2 ORDER BY start_time', [coachId, tenantId]);
        return result;
    }
    async findUpcoming(tenantId, limit = 10) {
        const result = await database_1.default.any('SELECT * FROM classes WHERE tenant_id = $1 AND start_time > NOW() ORDER BY start_time LIMIT $2', [tenantId, limit]);
        return result;
    }
    async findByDateRange(tenantId, startDate, endDate) {
        const result = await database_1.default.any('SELECT * FROM classes WHERE tenant_id = $1 AND start_time >= $2 AND start_time <= $3 ORDER BY start_time', [tenantId, startDate, endDate]);
        return result;
    }
    async findByModality(modality, tenantId) {
        const result = await database_1.default.any('SELECT * FROM classes WHERE modality = $1 AND tenant_id = $2 ORDER BY start_time', [modality, tenantId]);
        return result;
    }
    async findAvailable(tenantId) {
        const result = await database_1.default.any('SELECT * FROM classes WHERE tenant_id = $1 AND current_enrollment < max_capacity AND start_time > NOW() ORDER BY start_time', [tenantId]);
        return result;
    }
    async updateEnrollmentCount(id, tenantId, count) {
        const result = await database_1.default.oneOrNone('UPDATE classes SET current_enrollment = $1 WHERE id = $2 AND tenant_id = $3 RETURNING *', [count, id, tenantId]);
        return result;
    }
    async incrementEnrollment(id, tenantId) {
        const result = await database_1.default.oneOrNone('UPDATE classes SET current_enrollment = current_enrollment + 1 WHERE id = $1 AND tenant_id = $2 RETURNING *', [id, tenantId]);
        return result;
    }
    async decrementEnrollment(id, tenantId) {
        const result = await database_1.default.oneOrNone('UPDATE classes SET current_enrollment = GREATEST(current_enrollment - 1, 0) WHERE id = $1 AND tenant_id = $2 RETURNING *', [id, tenantId]);
        return result;
    }
    async updateStatus(id, tenantId, status) {
        const result = await database_1.default.oneOrNone('UPDATE classes SET status = $1 WHERE id = $2 AND tenant_id = $3 RETURNING *', [status, id, tenantId]);
        return result;
    }
    async getStats(tenantId) {
        const totalResult = await database_1.default.one('SELECT COUNT(*) as total FROM classes WHERE tenant_id = $1', [tenantId]);
        const statusResults = await database_1.default.any('SELECT status, COUNT(*) as count FROM classes WHERE tenant_id = $1 GROUP BY status', [tenantId]);
        const enrollmentResult = await database_1.default.one('SELECT SUM(current_enrollment) as total_enrollments, AVG(current_enrollment) as avg_enrollment FROM classes WHERE tenant_id = $1', [tenantId]);
        const statusCounts = statusResults.reduce((acc, row) => {
            acc[row.status] = parseInt(row.count);
            return acc;
        }, {});
        return {
            total: parseInt(totalResult.total),
            scheduled: statusCounts.scheduled || 0,
            completed: statusCounts.completed || 0,
            cancelled: statusCounts.cancelled || 0,
            totalEnrollments: parseInt(enrollmentResult.total_enrollments) || 0,
            averageEnrollment: parseFloat(enrollmentResult.avg_enrollment) || 0
        };
    }
    async getPublicClasses(tenantId, branchId) {
        let query = `
      SELECT c.*, b.name as branch_name, u.first_name, u.last_name
      FROM classes c
      JOIN branches b ON c.branch_id = b.id
      JOIN users u ON c.coach_id = u.id
      WHERE c.tenant_id = $1 AND c.start_time > NOW() AND c.status = 'scheduled'
    `;
        const params = [tenantId];
        if (branchId) {
            query += ' AND c.branch_id = $2';
            params.push(branchId);
        }
        query += ' ORDER BY c.start_time';
        const result = await database_1.default.any(query, params);
        return result;
    }
}
exports.ClassRepository = ClassRepository;
//# sourceMappingURL=ClassRepository.js.map