import sqlite3 from 'sqlite3';
declare const db: sqlite3.Database;
export declare const query: (sql: string, params?: any[]) => Promise<any>;
export declare const testConnection: () => Promise<void>;
export default db;
//# sourceMappingURL=sqlite-database.d.ts.map