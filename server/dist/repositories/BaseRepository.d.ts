import { BaseEntity, PaginationParams, FilterParams } from '../types';
export declare abstract class BaseRepository<T extends BaseEntity> {
    protected tableName: string;
    constructor(tableName: string);
    findAll(tenantId: string, pagination?: PaginationParams, filters?: FilterParams): Promise<{
        data: T[];
        total: number;
    }>;
    findById(id: string, tenantId: string): Promise<T | null>;
    create(data: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<T>;
    update(id: string, tenantId: string, data: Partial<Omit<T, 'id' | 'tenant_id' | 'created_at' | 'updated_at'>>): Promise<T | null>;
    delete(id: string, tenantId: string): Promise<boolean>;
    exists(id: string, tenantId: string): Promise<boolean>;
    count(tenantId: string, filters?: FilterParams): Promise<number>;
    protected abstract getSearchFields(): string[];
    protected query(sql: string, params?: any[]): Promise<any[]>;
    protected queryOne(sql: string, params?: any[]): Promise<any>;
    protected queryOneOrNone(sql: string, params?: any[]): Promise<any>;
}
//# sourceMappingURL=BaseRepository.d.ts.map