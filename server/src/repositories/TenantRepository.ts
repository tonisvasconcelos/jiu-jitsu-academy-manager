import { BaseRepository } from './BaseRepository';
import { Tenant, LicensePlan } from '../types';
import db from '../config/database';

export class TenantRepository extends BaseRepository<Tenant> {
  constructor() {
    super('tenants');
  }

  protected getSearchFields(): string[] {
    return ['name', 'domain', 'contact_email'];
  }

  /**
   * Find tenant by domain
   */
  async findByDomain(domain: string): Promise<Tenant | null> {
    const result = await db.oneOrNone(
      'SELECT * FROM tenants WHERE domain = $1',
      [domain]
    );
    return result as Tenant | null;
  }

  /**
   * Check if domain is available
   */
  async isDomainAvailable(domain: string, excludeId?: string): Promise<boolean> {
    let query = 'SELECT 1 FROM tenants WHERE domain = $1';
    const params: any[] = [domain];

    if (excludeId) {
      query += ' AND id != $2';
      params.push(excludeId);
    }

    const result = await db.oneOrNone(query, params);
    return result === null;
  }

  /**
   * Update license information
   */
  async updateLicense(
    id: string,
    plan: LicensePlan,
    licenseStart: Date,
    licenseEnd: Date
  ): Promise<Tenant | null> {
    const result = await db.oneOrNone(
      'UPDATE tenants SET plan = $1, license_start = $2, license_end = $3 WHERE id = $4 RETURNING *',
      [plan, licenseStart, licenseEnd, id]
    );
    return result as Tenant | null;
  }

  /**
   * Update tenant status
   */
  async updateStatus(id: string, isActive: boolean): Promise<Tenant | null> {
    const result = await db.oneOrNone(
      'UPDATE tenants SET is_active = $1 WHERE id = $2 RETURNING *',
      [isActive, id]
    );
    return result as Tenant | null;
  }

  /**
   * Get tenants with expired licenses
   */
  async findExpiredTenants(): Promise<Tenant[]> {
    const result = await db.any(
      'SELECT * FROM tenants WHERE license_end < NOW() AND is_active = true',
      []
    );
    return result as Tenant[];
  }

  /**
   * Get tenants expiring soon (within specified days)
   */
  async findExpiringTenants(days: number = 7): Promise<Tenant[]> {
    const result = await db.any(
      'SELECT * FROM tenants WHERE license_end BETWEEN NOW() AND NOW() + INTERVAL \'${days} days\' AND is_active = true',
      []
    );
    return result as Tenant[];
  }

  /**
   * Update tenant settings
   */
  async updateSettings(id: string, settings: Record<string, any>): Promise<Tenant | null> {
    const result = await db.oneOrNone(
      'UPDATE tenants SET settings = $1 WHERE id = $2 RETURNING *',
      [JSON.stringify(settings), id]
    );
    return result as Tenant | null;
  }

  /**
   * Get tenant statistics
   */
  async getStats(id: string): Promise<{
    totalUsers: number;
    totalBranches: number;
    totalStudents: number;
    totalClasses: number;
    activeUsers: number;
  }> {
    const userStats = await db.one(
      'SELECT COUNT(*) as total, COUNT(CASE WHEN status = \'active\' THEN 1 END) as active FROM users WHERE tenant_id = $1',
      [id]
    );

    const branchStats = await db.one(
      'SELECT COUNT(*) as total FROM branches WHERE tenant_id = $1',
      [id]
    );

    const studentStats = await db.one(
      'SELECT COUNT(*) as total FROM students WHERE tenant_id = $1',
      [id]
    );

    const classStats = await db.one(
      'SELECT COUNT(*) as total FROM classes WHERE tenant_id = $1',
      [id]
    );

    return {
      totalUsers: parseInt(userStats.total),
      totalBranches: parseInt(branchStats.total),
      totalStudents: parseInt(studentStats.total),
      totalClasses: parseInt(classStats.total),
      activeUsers: parseInt(userStats.active)
    };
  }
}
