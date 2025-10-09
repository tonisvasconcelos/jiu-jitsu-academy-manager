"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSelfAccess = exports.validateBranchAccess = exports.validateTenant = exports.optionalAuth = exports.authorize = exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const database_1 = require("../config/database");
const types_1 = require("../types");
const authenticate = async (req, res, next) => {
    try {
        const token = (0, jwt_1.extractTokenFromHeader)(req.headers.authorization);
        if (!token) {
            res.status(401).json({
                success: false,
                error: 'Access token required'
            });
            return;
        }
        const payload = (0, jwt_1.verifyAccessToken)(token);
        req.user = payload;
        req.tenantId = payload.tenantId;
        await (0, database_1.setTenantContext)(payload.tenantId);
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            error: 'Invalid or expired token'
        });
    }
};
exports.authenticate = authenticate;
const authorize = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
            return;
        }
        const userRole = req.user.role;
        const roleHierarchy = {
            [types_1.UserRole.STUDENT]: 1,
            [types_1.UserRole.COACH]: 2,
            [types_1.UserRole.BRANCH_MANAGER]: 3,
            [types_1.UserRole.SYSTEM_MANAGER]: 4
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
exports.authorize = authorize;
const optionalAuth = async (req, res, next) => {
    try {
        const token = (0, jwt_1.extractTokenFromHeader)(req.headers.authorization);
        if (token) {
            const payload = (0, jwt_1.verifyAccessToken)(token);
            req.user = payload;
            req.tenantId = payload.tenantId;
            await (0, database_1.setTenantContext)(payload.tenantId);
        }
        next();
    }
    catch (error) {
        next();
    }
};
exports.optionalAuth = optionalAuth;
const validateTenant = (req, res, next) => {
    if (!req.user) {
        res.status(401).json({
            success: false,
            error: 'Authentication required'
        });
        return;
    }
    const userTenantId = req.user.tenantId;
    const resourceTenantId = req.params.tenantId || req.body.tenantId;
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
exports.validateTenant = validateTenant;
const validateBranchAccess = (req, res, next) => {
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
    if (userRole === types_1.UserRole.SYSTEM_MANAGER) {
        next();
        return;
    }
    if (!resourceBranchId) {
        next();
        return;
    }
    if (userRole === types_1.UserRole.BRANCH_MANAGER || userRole === types_1.UserRole.COACH) {
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
exports.validateBranchAccess = validateBranchAccess;
const validateSelfAccess = (req, res, next) => {
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
    if (userRole === types_1.UserRole.SYSTEM_MANAGER || userRole === types_1.UserRole.BRANCH_MANAGER) {
        next();
        return;
    }
    if (userRole === types_1.UserRole.COACH) {
        next();
        return;
    }
    if (userRole === types_1.UserRole.STUDENT) {
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
exports.validateSelfAccess = validateSelfAccess;
//# sourceMappingURL=auth.js.map