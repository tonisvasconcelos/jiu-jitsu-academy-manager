import { BaseRepository } from './BaseRepository';
import { User, UserRole, UserStatus } from '../types';
export declare class UserRepository extends BaseRepository<User> {
    constructor();
    protected getSearchFields(): string[];
    findByEmail(email: string, tenantId: string): Promise<User | null>;
    findByRole(role: UserRole, tenantId: string): Promise<User[]>;
    findByBranch(branchId: string, tenantId: string): Promise<User[]>;
    findCoachesByBranch(branchId: string, tenantId: string): Promise<User[]>;
    updateStatus(id: string, tenantId: string, status: UserStatus): Promise<User | null>;
    updateLastLogin(id: string, tenantId: string): Promise<void>;
    findByEmailVerificationToken(token: string): Promise<User | null>;
    setEmailVerificationToken(id: string, tenantId: string, token: string): Promise<void>;
    verifyEmail(id: string, tenantId: string): Promise<User | null>;
    setPasswordResetToken(id: string, tenantId: string, token: string, expires: Date): Promise<void>;
    findByPasswordResetToken(token: string): Promise<User | null>;
    clearPasswordResetToken(id: string, tenantId: string): Promise<void>;
    updatePassword(id: string, tenantId: string, passwordHash: string): Promise<void>;
    getStats(tenantId: string): Promise<{
        total: number;
        active: number;
        byRole: Record<UserRole, number>;
    }>;
}
//# sourceMappingURL=UserRepository.d.ts.map