import { UserRole } from '../types';
export interface LoginCredentials {
    domain: string;
    email: string;
    password: string;
}
export interface AuthResult {
    success: boolean;
    token: string;
    user: {
        id: string;
        email: string;
        role: string;
        tenantId: string;
        firstName: string;
        lastName: string;
    };
}
export declare class SimpleAuthService {
    login(credentials: LoginCredentials): Promise<AuthResult>;
    register(data: {
        domain: string;
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role?: UserRole;
    }): Promise<AuthResult>;
}
//# sourceMappingURL=SimpleAuthService.d.ts.map