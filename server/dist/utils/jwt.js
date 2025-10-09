"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.canAccessResource = exports.hasRole = exports.extractTokenFromHeader = exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const types_1 = require("../types");
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';
const generateAccessToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
        issuer: 'jiu-jitsu-academy-manager',
        audience: 'jiu-jitsu-academy-users'
    });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (userId, tenantId) => {
    return jsonwebtoken_1.default.sign({ userId, tenantId, type: 'refresh' }, JWT_REFRESH_SECRET, {
        expiresIn: JWT_REFRESH_EXPIRES_IN,
        issuer: 'jiu-jitsu-academy-manager',
        audience: 'jiu-jitsu-academy-users'
    });
};
exports.generateRefreshToken = generateRefreshToken;
const verifyAccessToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET, {
            issuer: 'jiu-jitsu-academy-manager',
            audience: 'jiu-jitsu-academy-users'
        });
    }
    catch (error) {
        throw new Error('Invalid or expired access token');
    }
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    try {
        const payload = jsonwebtoken_1.default.verify(token, JWT_REFRESH_SECRET, {
            issuer: 'jiu-jitsu-academy-manager',
            audience: 'jiu-jitsu-academy-users'
        });
        if (payload.type !== 'refresh') {
            throw new Error('Invalid token type');
        }
        return {
            userId: payload.userId,
            tenantId: payload.tenantId
        };
    }
    catch (error) {
        throw new Error('Invalid or expired refresh token');
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
const extractTokenFromHeader = (authHeader) => {
    if (!authHeader) {
        return null;
    }
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return null;
    }
    return parts[1];
};
exports.extractTokenFromHeader = extractTokenFromHeader;
const hasRole = (userRole, requiredRole) => {
    const roleHierarchy = {
        [types_1.UserRole.STUDENT]: 1,
        [types_1.UserRole.COACH]: 2,
        [types_1.UserRole.BRANCH_MANAGER]: 3,
        [types_1.UserRole.SYSTEM_MANAGER]: 4
    };
    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};
exports.hasRole = hasRole;
const canAccessResource = (userTenantId, resourceTenantId) => {
    return userTenantId === resourceTenantId;
};
exports.canAccessResource = canAccessResource;
//# sourceMappingURL=jwt.js.map