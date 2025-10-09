import { BaseRepository } from './BaseRepository';
import { Class, ClassStatus } from '../types';
import db from '../config/database';

export class ClassRepository extends BaseRepository<Class> {
  constructor() {
    super('classes');
  }

  protected getSearchFields(): string[] {
    return ['name', 'description', 'modality'];
  }

  /**
   * Find classes by branch
   */
  async findByBranch(branchId: string, tenantId: string): Promise<Class[]> {
    const result = await db.any(
      'SELECT * FROM classes WHERE branch_id = $1 AND tenant_id = $2 ORDER BY start_time',
      [branchId, tenantId]
    );
    return result as Class[];
  }

  /**
   * Find classes by coach
   */
  async findByCoach(coachId: string, tenantId: string): Promise<Class[]> {
    const result = await db.any(
      'SELECT * FROM classes WHERE coach_id = $1 AND tenant_id = $2 ORDER BY start_time',
      [coachId, tenantId]
    );
    return result as Class[];
  }

  /**
   * Find upcoming classes
   */
  async findUpcoming(tenantId: string, limit: number = 10): Promise<Class[]> {
    const result = await db.any(
      'SELECT * FROM classes WHERE tenant_id = $1 AND start_time > NOW() ORDER BY start_time LIMIT $2',
      [tenantId, limit]
    );
    return result as Class[];
  }

  /**
   * Find classes by date range
   */
  async findByDateRange(
    tenantId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Class[]> {
    const result = await db.any(
      'SELECT * FROM classes WHERE tenant_id = $1 AND start_time >= $2 AND start_time <= $3 ORDER BY start_time',
      [tenantId, startDate, endDate]
    );
    return result as Class[];
  }

  /**
   * Find classes by modality
   */
  async findByModality(modality: string, tenantId: string): Promise<Class[]> {
    const result = await db.any(
      'SELECT * FROM classes WHERE modality = $1 AND tenant_id = $2 ORDER BY start_time',
      [modality, tenantId]
    );
    return result as Class[];
  }

  /**
   * Find available classes (with capacity)
   */
  async findAvailable(tenantId: string): Promise<Class[]> {
    const result = await db.any(
      'SELECT * FROM classes WHERE tenant_id = $1 AND current_enrollment < max_capacity AND start_time > NOW() ORDER BY start_time',
      [tenantId]
    );
    return result as Class[];
  }

  /**
   * Update class enrollment count
   */
  async updateEnrollmentCount(id: string, tenantId: string, count: number): Promise<Class | null> {
    const result = await db.oneOrNone(
      'UPDATE classes SET current_enrollment = $1 WHERE id = $2 AND tenant_id = $3 RETURNING *',
      [count, id, tenantId]
    );
    return result as Class | null;
  }

  /**
   * Increment enrollment count
   */
  async incrementEnrollment(id: string, tenantId: string): Promise<Class | null> {
    const result = await db.oneOrNone(
      'UPDATE classes SET current_enrollment = current_enrollment + 1 WHERE id = $1 AND tenant_id = $2 RETURNING *',
      [id, tenantId]
    );
    return result as Class | null;
  }

  /**
   * Decrement enrollment count
   */
  async decrementEnrollment(id: string, tenantId: string): Promise<Class | null> {
    const result = await db.oneOrNone(
      'UPDATE classes SET current_enrollment = GREATEST(current_enrollment - 1, 0) WHERE id = $1 AND tenant_id = $2 RETURNING *',
      [id, tenantId]
    );
    return result as Class | null;
  }

  /**
   * Update class status
   */
  async updateStatus(id: string, tenantId: string, status: ClassStatus): Promise<Class | null> {
    const result = await db.oneOrNone(
      'UPDATE classes SET status = $1 WHERE id = $2 AND tenant_id = $3 RETURNING *',
      [status, id, tenantId]
    );
    return result as Class | null;
  }

  /**
   * Get class statistics
   */
  async getStats(tenantId: string): Promise<{
    total: number;
    scheduled: number;
    completed: number;
    cancelled: number;
    totalEnrollments: number;
    averageEnrollment: number;
  }> {
    const totalResult = await db.one(
      'SELECT COUNT(*) as total FROM classes WHERE tenant_id = $1',
      [tenantId]
    );

    const statusResults = await db.any(
      'SELECT status, COUNT(*) as count FROM classes WHERE tenant_id = $1 GROUP BY status',
      [tenantId]
    );

    const enrollmentResult = await db.one(
      'SELECT SUM(current_enrollment) as total_enrollments, AVG(current_enrollment) as avg_enrollment FROM classes WHERE tenant_id = $1',
      [tenantId]
    );

    const statusCounts = statusResults.reduce((acc, row) => {
      acc[row.status] = parseInt(row.count);
      return acc;
    }, {} as Record<string, number>);

    return {
      total: parseInt(totalResult.total),
      scheduled: statusCounts.scheduled || 0,
      completed: statusCounts.completed || 0,
      cancelled: statusCounts.cancelled || 0,
      totalEnrollments: parseInt(enrollmentResult.total_enrollments) || 0,
      averageEnrollment: parseFloat(enrollmentResult.avg_enrollment) || 0
    };
  }

  /**
   * Get classes for public calendar (no authentication required)
   */
  async getPublicClasses(tenantId: string, branchId?: string): Promise<Class[]> {
    let query = `
      SELECT c.*, b.name as branch_name, u.first_name, u.last_name
      FROM classes c
      JOIN branches b ON c.branch_id = b.id
      JOIN users u ON c.coach_id = u.id
      WHERE c.tenant_id = $1 AND c.start_time > NOW() AND c.status = 'scheduled'
    `;
    const params: any[] = [tenantId];

    if (branchId) {
      query += ' AND c.branch_id = $2';
      params.push(branchId);
    }

    query += ' ORDER BY c.start_time';

    const result = await db.any(query, params);
    return result as Class[];
  }
}
