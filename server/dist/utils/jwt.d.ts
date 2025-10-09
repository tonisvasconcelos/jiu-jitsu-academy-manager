import { JWTPayload, UserRole } from '../types';
export declare const generateAccessToken: (payload: Omit<JWTPayload, "iat" | "exp">) => string;
export declare const generateRefreshToken: (userId: string, tenantId: string) => string;
export declare const verifyAccessToken: (token: string) => JWTPayload;
export declare const verifyRefreshToken: (token: string) => {
    userId: string;
    tenantId: string;
};
export declare const extractTokenFromHeader: (authHeader: string | undefined) => string | null;
export declare const hasRole: (userRole: UserRole, requiredRole: UserRole) => boolean;
export declare const canAccessResource: (userTenantId: string, resourceTenantId: string) => boolean;
//# sourceMappingURL=jwt.d.ts.map