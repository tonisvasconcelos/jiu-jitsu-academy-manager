import { BaseRepository } from './BaseRepository';
import { Tenant, LicensePlan } from '../types';
export declare class TenantRepository extends BaseRepository<Tenant> {
    constructor();
    protected getSearchFields(): string[];
    findByDomain(domain: string): Promise<Tenant | null>;
    isDomainAvailable(domain: string, excludeId?: string): Promise<boolean>;
    updateLicense(id: string, plan: LicensePlan, licenseStart: Date, licenseEnd: Date): Promise<Tenant | null>;
    updateStatus(id: string, isActive: boolean): Promise<Tenant | null>;
    findExpiredTenants(): Promise<Tenant[]>;
    findExpiringTenants(days?: number): Promise<Tenant[]>;
    updateSettings(id: string, settings: Record<string, any>): Promise<Tenant | null>;
    getStats(id: string): Promise<{
        totalUsers: number;
        totalBranches: number;
        totalStudents: number;
        totalClasses: number;
        activeUsers: number;
    }>;
}
//# sourceMappingURL=TenantRepository.d.ts.map