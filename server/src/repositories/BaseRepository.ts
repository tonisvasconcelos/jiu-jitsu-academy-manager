import db from '../config/database';
import { BaseEntity, PaginationParams, FilterParams } from '../types';

/**
 * Base repository class with common CRUD operations
 * Implements multi-tenancy through RLS (Row Level Security)
 */
export abstract class BaseRepository<T extends BaseEntity> {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  /**
   * Find all records with pagination and filtering
   */
  async findAll(
    tenantId: string,
    pagination: PaginationParams = {},
    filters: FilterParams = {}
  ): Promise<{ data: T[]; total: number }> {
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = pagination;
    const offset = (page - 1) * limit;

    let query = `SELECT * FROM ${this.tableName}`;
    let countQuery = `SELECT COUNT(*) as total FROM ${this.tableName}`;
    const conditions: string[] = [];
    const params: any[] = [];

    // Add tenant filter (RLS should handle this, but we add it for extra safety)
    conditions.push('tenant_id = $1');
    params.push(tenantId);

    // Add custom filters
    if (filters.search) {
      conditions.push(`(${this.getSearchFields().map(field => `${field} ILIKE $${params.length + 1}`).join(' OR ')})`);
      params.push(`%${filters.search}%`);
    }

    if (filters.status) {
      conditions.push(`status = $${params.length + 1}`);
      params.push(filters.status);
    }

    // Apply conditions
    if (conditions.length > 0) {
      const whereClause = ` WHERE ${conditions.join(' AND ')}`;
      query += whereClause;
      countQuery += whereClause;
    }

    // Add sorting
    query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;

    // Add pagination
    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const [data, countResult] = await Promise.all([
      db.any(query, params),
      db.one(countQuery, params.slice(0, -2)) // Remove limit and offset for count
    ]);

    return {
      data: data as T[],
      total: parseInt(countResult.total)
    };
  }

  /**
   * Find record by ID
   */
  async findById(id: string, tenantId: string): Promise<T | null> {
    const result = await db.oneOrNone(
      `SELECT * FROM ${this.tableName} WHERE id = $1 AND tenant_id = $2`,
      [id, tenantId]
    );
    return result as T | null;
  }

  /**
   * Create new record
   */
  async create(data: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<T> {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');

    const query = `
      INSERT INTO ${this.tableName} (${fields.join(', ')})
      VALUES (${placeholders})
      RETURNING *
    `;

    const result = await db.one(query, values);
    return result as T;
  }

  /**
   * Update record by ID
   */
  async update(id: string, tenantId: string, data: Partial<Omit<T, 'id' | 'tenant_id' | 'created_at' | 'updated_at'>>): Promise<T | null> {
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

    const result = await db.oneOrNone(query, [...values, tenantId]);
    return result as T | null;
  }

  /**
   * Delete record by ID
   */
  async delete(id: string, tenantId: string): Promise<boolean> {
    const result = await db.result(
      `DELETE FROM ${this.tableName} WHERE id = $1 AND tenant_id = $2`,
      [id, tenantId]
    );
    return result.rowCount > 0;
  }

  /**
   * Check if record exists
   */
  async exists(id: string, tenantId: string): Promise<boolean> {
    const result = await db.oneOrNone(
      `SELECT 1 FROM ${this.tableName} WHERE id = $1 AND tenant_id = $2`,
      [id, tenantId]
    );
    return result !== null;
  }

  /**
   * Count records
   */
  async count(tenantId: string, filters: FilterParams = {}): Promise<number> {
    let query = `SELECT COUNT(*) as total FROM ${this.tableName}`;
    const conditions: string[] = [];
    const params: any[] = [];

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

    const result = await db.one(query, params);
    return parseInt(result.total);
  }

  /**
   * Abstract method to define searchable fields
   * Must be implemented by subclasses
   */
  protected abstract getSearchFields(): string[];

  /**
   * Execute raw query
   */
  protected async query(sql: string, params: any[] = []): Promise<any[]> {
    return await db.any(sql, params);
  }

  /**
   * Execute raw query and return single result
   */
  protected async queryOne(sql: string, params: any[] = []): Promise<any> {
    return await db.one(sql, params);
  }

  /**
   * Execute raw query and return single result or null
   */
  protected async queryOneOrNone(sql: string, params: any[] = []): Promise<any> {
    return await db.oneOrNone(sql, params);
  }
}
