import pgPromise from 'pg-promise';
declare const pgp: pgPromise.IMain<{}, import("pg-promise/typescript/pg-subset").IClient>;
declare const db: pgPromise.IDatabase<{}, import("pg-promise/typescript/pg-subset").IClient>;
export declare const testConnection: () => Promise<void>;
export declare const setTenantContext: (tenantId: string) => Promise<void>;
export declare const clearTenantContext: () => Promise<void>;
export declare const withTransaction: <T>(callback: (t: pgPromise.ITask<{}>) => Promise<T>) => Promise<T>;
export default db;
export { pgp };
//# sourceMappingURL=database.d.ts.map