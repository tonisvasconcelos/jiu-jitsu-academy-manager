import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, UserRole } from '../types';
export declare const authenticate: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const authorize: (requiredRole: UserRole) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export declare const optionalAuth: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const validateTenant: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export declare const validateBranchAccess: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export declare const validateSelfAccess: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map