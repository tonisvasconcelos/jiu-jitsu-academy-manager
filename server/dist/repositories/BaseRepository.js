"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
const database_1 = __importDefault(require("../config/database"));
class BaseRepository {
    constructor(tableName) {
        this.tableName = tableName;
    }
    async findAll(tenantId, pagination = {}, filters = {}) {
        const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = pagination;
        const offset = (page - 1) * limit;
        let query = `SELECT * FROM ${this.tableName}`;
        let countQuery = `SELECT COUNT(*) as total FROM ${this.tableName}`;
        const conditions = [];
        const params = [];
        conditions.push('tenant_id = $1');
        params.push(tenantId);
        if (filters.search) {
            conditions.push(`(${this.getSearchFields().map(field => `${field} ILIKE $${params.length + 1}`).join(' OR ')})`);
            params.push(`%${filters.search}%`);
        }
        if (filters.status) {
            conditions.push(`status = $${params.length + 1}`);
            params.push(filters.status);
        }
        if (conditions.length > 0) {
            const whereClause = ` WHERE ${conditions.join(' AND ')}`;
            query += whereClause;
            countQuery += whereClause;
        }
        query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
        query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);
        const [data, countResult] = await Promise.all([
            database_1.default.any(query, params),
            database_1.default.one(countQuery, params.slice(0, -2))
        ]);
        return {
            data: data,
            total: parseInt(countResult.total)
        };
    }
    async findById(id, tenantId) {
        const result = await database_1.default.oneOrNone(`SELECT * FROM ${this.tableName} WHERE id = $1 AND tenant_id = $2`, [id, tenantId]);
        return result;
    }
    async create(data) {
        const fields = Object.keys(data);
        const values = Object.values(data);
        const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
        const query = `
      INSERT INTO ${this.tableName} (${fields.join(', ')})
      VALUES (${placeholders})
      RETURNING *
    `;
        const result = await database_1.default.one(query, values);
        return result;
    }
    async update(id, tenantId, data) {
        const fields = Object.keys(data);
        if (fields.length === 0) {
            return this.findById(id, tenantId);
        }
        const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
        const values = [id, ...Object.values(data)];
        const query = `
      UPDATE ${this.tableName}
      SET ${setClause}
      WHERE id = $1 AND tenant_id = $${values.length + 1}
      RETURNING *
    `;
        const result = await database_1.default.oneOrNone(query, [...values, tenantId]);
        return result;
    }
    async delete(id, tenantId) {
        const result = await database_1.default.result(`DELETE FROM ${this.tableName} WHERE id = $1 AND tenant_id = $2`, [id, tenantId]);
        return result.rowCount > 0;
    }
    async exists(id, tenantId) {
        const result = await database_1.default.oneOrNone(`SELECT 1 FROM ${this.tableName} WHERE id = $1 AND tenant_id = $2`, [id, tenantId]);
        return result !== null;
    }
    async count(tenantId, filters = {}) {
        let query = `SELECT COUNT(*) as total FROM ${this.tableName}`;
        const conditions = [];
        const params = [];
        conditions.push('tenant_id = $1');
        params.push(tenantId);
        if (filters.search) {
            conditions.push(`(${this.getSearchFields().map(field => `${field} ILIKE $${params.length + 1}`).join(' OR ')})`);
            params.push(`%${filters.search}%`);
        }
        if (filters.status) {
            conditions.push(`status = $${params.length + 1}`);
            params.push(filters.status);
        }
        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }
        const result = await database_1.default.one(query, params);
        return parseInt(result.total);
    }
    async query(sql, params = []) {
        return await database_1.default.any(sql, params);
    }
    async queryOne(sql, params = []) {
        return await database_1.default.one(sql, params);
    }
    async queryOneOrNone(sql, params = []) {
        return await database_1.default.oneOrNone(sql, params);
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=BaseRepository.js.map