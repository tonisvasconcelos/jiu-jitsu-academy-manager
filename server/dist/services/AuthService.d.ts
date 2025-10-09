import { User, UserRole, Tenant } from '../types';
export interface LoginCredentials {
    email: string;
    password: string;
    tenantDomain: string;
}
export interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role: UserRole;
    tenantDomain: string;
    branchId?: string;
}
export interface AuthResult {
    user: Omit<User, 'password_hash'>;
    tenant: Tenant;
    accessToken: string;
    refreshToken: string;
}
export declare class AuthService {
    private userRepository;
    private tenantRepository;
    constructor();
    login(credentials: LoginCredentials): Promise<AuthResult>;
    register(data: RegisterData): Promise<AuthResult>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    changePassword(userId: string, tenantId: string, currentPassword: string, newPassword: string): Promise<void>;
    requestPasswordReset(email: string, tenantDomain: string): Promise<void>;
    resetPassword(token: string, newPassword: string): Promise<void>;
    verifyEmail(token: string): Promise<void>;
    resendEmailVerification(email: string, tenantDomain: string): Promise<void>;
}
//# sourceMappingURL=AuthService.d.ts.map