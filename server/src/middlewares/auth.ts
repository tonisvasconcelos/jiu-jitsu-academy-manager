import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, extractTokenFromHeader } from '../utils/jwt';
import { setTenantContext } from '../config/database';
import { AuthenticatedRequest, UserRole } from '../types';

/**
 * Authentication middleware
 * Verifies JWT token and sets user context
 */
export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Access token required'
      });
      return;
    }

    // Verify token
    const payload = verifyAccessToken(token);
    
    // Set user context
    req.user = payload;
    req.tenantId = payload.tenantId;

    // Set tenant context for RLS
    await setTenantContext(payload.tenantId);

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }
};

/**
 * Authorization middleware
 * Checks if user has required role
 */
export const authorize = (requiredRole: UserRole) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
      return;
    }

    const userRole = req.user.role;
    const roleHierarchy: Record<UserRole, number> = {
      [UserRole.STUDENT]: 1,
      [UserRole.COACH]: 2,
      [UserRole.BRANCH_MANAGER]: 3,
      [UserRole.SYSTEM_MANAGER]: 4
    };

    if (roleHierarchy[userRole] < roleHierarchy[requiredRole]) {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      });
      return;
    }

    next();
  };
};

/**
 * Optional authentication middleware
 * Sets user context if token is provided, but doesn't require it
 */
export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (token) {
      const payload = verifyAccessToken(token);
      req.user = payload;
      req.tenantId = payload.tenantId;
      await setTenantContext(payload.tenantId);
    }

    next();
  } catch (error) {
    // Continue without authentication for optional auth
    next();
  }
};

/**
 * Tenant validation middleware
 * Ensures user can only access their tenant's data
 */
export const validateTenant = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
    return;
  }

  const userTenantId = req.user.tenantId;
  const resourceTenantId = req.params.tenantId || req.body.tenantId;

  // If no specific tenant ID in request, allow access (RLS will handle it)
  if (!resourceTenantId) {
    next();
    return;
  }

  if (userTenantId !== resourceTenantId) {
    res.status(403).json({
      success: false,
      error: 'Access denied: Invalid tenant'
    });
    return;
  }

  next();
};

/**
 * Branch access middleware
 * Ensures user can only access their branch's data (for coaches and branch managers)
 */
export const validateBranchAccess = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
    return;
  }

  const userRole = req.user.role;
  const userBranchId = req.user.branchId;
  const resourceBranchId = req.params.branchId || req.body.branchId;

  // System managers can access all branches
  if (userRole === UserRole.SYSTEM_MANAGER) {
    next();
    return;
  }

  // If no specific branch ID in request, allow access
  if (!resourceBranchId) {
    next();
    return;
  }

  // Branch managers and coaches can only access their own branch
  if (userRole === UserRole.BRANCH_MANAGER || userRole === UserRole.COACH) {
    if (userBranchId !== resourceBranchId) {
      res.status(403).json({
        success: false,
        error: 'Access denied: Invalid branch'
      });
      return;
    }
  }

  next();
};

/**
 * Self-access middleware
 * Ensures users can only access their own data (for students)
 */
export const validateSelfAccess = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
    return;
  }

  const userRole = req.user.role;
  const userId = req.user.userId;
  const resourceUserId = req.params.userId || req.params.id;

  // System managers and branch managers can access any user
  if (userRole === UserRole.SYSTEM_MANAGER || userRole === UserRole.BRANCH_MANAGER) {
    next();
    return;
  }

  // Coaches can access students in their branch
  if (userRole === UserRole.COACH) {
    // This will be handled by branch access middleware
    next();
    return;
  }

  // Students can only access their own data
  if (userRole === UserRole.STUDENT) {
    if (userId !== resourceUserId) {
      res.status(403).json({
        success: false,
        error: 'Access denied: Can only access own data'
      });
      return;
    }
  }

  next();
};
