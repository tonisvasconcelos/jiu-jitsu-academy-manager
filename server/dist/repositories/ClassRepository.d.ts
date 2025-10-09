import { BaseRepository } from './BaseRepository';
import { Class, ClassStatus } from '../types';
export declare class ClassRepository extends BaseRepository<Class> {
    constructor();
    protected getSearchFields(): string[];
    findByBranch(branchId: string, tenantId: string): Promise<Class[]>;
    findByCoach(coachId: string, tenantId: string): Promise<Class[]>;
    findUpcoming(tenantId: string, limit?: number): Promise<Class[]>;
    findByDateRange(tenantId: string, startDate: Date, endDate: Date): Promise<Class[]>;
    findByModality(modality: string, tenantId: string): Promise<Class[]>;
    findAvailable(tenantId: string): Promise<Class[]>;
    updateEnrollmentCount(id: string, tenantId: string, count: number): Promise<Class | null>;
    incrementEnrollment(id: string, tenantId: string): Promise<Class | null>;
    decrementEnrollment(id: string, tenantId: string): Promise<Class | null>;
    updateStatus(id: string, tenantId: string, status: ClassStatus): Promise<Class | null>;
    getStats(tenantId: string): Promise<{
        total: number;
        scheduled: number;
        completed: number;
        cancelled: number;
        totalEnrollments: number;
        averageEnrollment: number;
    }>;
    getPublicClasses(tenantId: string, branchId?: string): Promise<Class[]>;
}
//# sourceMappingURL=ClassRepository.d.ts.map