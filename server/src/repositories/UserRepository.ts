import { BaseRepository } from './BaseRepository';
import { User, UserRole, UserStatus } from '../types';
import db from '../config/database';

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super('users');
  }

  protected getSearchFields(): string[] {
    return ['first_name', 'last_name', 'email'];
  }

  /**
   * Find user by email within tenant
   */
  async findByEmail(email: string, tenantId: string): Promise<User | null> {
    const result = await db.oneOrNone(
      'SELECT * FROM users WHERE email = $1 AND tenant_id = $2',
      [email, tenantId]
    );
    return result as User | null;
  }

  /**
   * Find users by role within tenant
   */
  async findByRole(role: UserRole, tenantId: string): Promise<User[]> {
    const result = await db.any(
      'SELECT * FROM users WHERE role = $1 AND tenant_id = $2 ORDER BY created_at DESC',
      [role, tenantId]
    );
    return result as User[];
  }

  /**
   * Find users by branch
   */
  async findByBranch(branchId: string, tenantId: string): Promise<User[]> {
    const result = await db.any(
      'SELECT * FROM users WHERE branch_id = $1 AND tenant_id = $2 ORDER BY created_at DESC',
      [branchId, tenantId]
    );
    return result as User[];
  }

  /**
   * Find coaches in a specific branch
   */
  async findCoachesByBranch(branchId: string, tenantId: string): Promise<User[]> {
    const result = await db.any(
      'SELECT * FROM users WHERE branch_id = $1 AND tenant_id = $2 AND role = $3 ORDER BY first_name, last_name',
      [branchId, tenantId, UserRole.COACH]
    );
    return result as User[];
  }

  /**
   * Update user status
   */
  async updateStatus(id: string, tenantId: string, status: UserStatus): Promise<User | null> {
    const result = await db.oneOrNone(
      'UPDATE users SET status = $1 WHERE id = $2 AND tenant_id = $3 RETURNING *',
      [status, id, tenantId]
    );
    return result as User | null;
  }

  /**
   * Update last login timestamp
   */
  async updateLastLogin(id: string, tenantId: string): Promise<void> {
    await db.none(
      'UPDATE users SET last_login = NOW() WHERE id = $1 AND tenant_id = $2',
      [id, tenantId]
    );
  }

  /**
   * Find user by email verification token
   */
  async findByEmailVerificationToken(token: string): Promise<User | null> {
    const result = await db.oneOrNone(
      'SELECT * FROM users WHERE email_verification_token = $1',
      [token]
    );
    return result as User | null;
  }

  /**
   * Set email verification token
   */
  async setEmailVerificationToken(id: string, tenantId: string, token: string): Promise<void> {
    await db.none(
      'UPDATE users SET email_verification_token = $1 WHERE id = $2 AND tenant_id = $3',
      [token, id, tenantId]
    );
  }

  /**
   * Verify email and clear token
   */
  async verifyEmail(id: string, tenantId: string): Promise<User | null> {
    const result = await db.oneOrNone(
      'UPDATE users SET email_verified = true, email_verification_token = NULL WHERE id = $1 AND tenant_id = $2 RETURNING *',
      [id, tenantId]
    );
    return result as User | null;
  }

  /**
   * Set password reset token
   */
  async setPasswordResetToken(id: string, tenantId: string, token: string, expires: Date): Promise<void> {
    await db.none(
      'UPDATE users SET password_reset_token = $1, password_reset_expires = $2 WHERE id = $3 AND tenant_id = $4',
      [token, expires, id, tenantId]
    );
  }

  /**
   * Find user by password reset token
   */
  async findByPasswordResetToken(token: string): Promise<User | null> {
    const result = await db.oneOrNone(
      'SELECT * FROM users WHERE password_reset_token = $1 AND password_reset_expires > NOW()',
      [token]
    );
    return result as User | null;
  }

  /**
   * Clear password reset token
   */
  async clearPasswordResetToken(id: string, tenantId: string): Promise<void> {
    await db.none(
      'UPDATE users SET password_reset_token = NULL, password_reset_expires = NULL WHERE id = $1 AND tenant_id = $2',
      [id, tenantId]
    );
  }

  /**
   * Update password
   */
  async updatePassword(id: string, tenantId: string, passwordHash: string): Promise<void> {
    await db.none(
      'UPDATE users SET password_hash = $1, password_reset_token = NULL, password_reset_expires = NULL WHERE id = $2 AND tenant_id = $3',
      [passwordHash, id, tenantId]
    );
  }

  /**
   * Get user statistics
   */
  async getStats(tenantId: string): Promise<{
    total: number;
    active: number;
    byRole: Record<UserRole, number>;
  }> {
    const totalResult = await db.one(
      'SELECT COUNT(*) as total FROM users WHERE tenant_id = $1',
      [tenantId]
    );

    const activeResult = await db.one(
      'SELECT COUNT(*) as active FROM users WHERE tenant_id = $1 AND status = $2',
      [tenantId, UserStatus.ACTIVE]
    );

    const roleResults = await db.any(
      'SELECT role, COUNT(*) as count FROM users WHERE tenant_id = $1 GROUP BY role',
      [tenantId]
    );

    const byRole = roleResults.reduce((acc, row) => {
      acc[row.role] = parseInt(row.count);
      return acc;
    }, {} as Record<UserRole, number>);

    return {
      total: parseInt(totalResult.total),
      active: parseInt(activeResult.active),
      byRole
    };
  }
}
