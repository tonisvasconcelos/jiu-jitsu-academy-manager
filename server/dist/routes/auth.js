"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthService_1 = require("../services/AuthService");
const validation_1 = require("../middlewares/validation");
const authSchemas_1 = require("../schemas/authSchemas");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
const authService = new AuthService_1.AuthService();
router.post('/login', (0, validation_1.validateRequest)(authSchemas_1.loginSchema), async (req, res, next) => {
    try {
        const { email, password, tenantDomain } = req.body;
        const result = await authService.login({
            email,
            password,
            tenantDomain
        });
        res.json({
            success: true,
            data: result,
            message: 'Login successful'
        });
    }
    catch (error) {
        next(error);
    }
});
router.post('/register', (0, validation_1.validateRequest)(authSchemas_1.registerSchema), async (req, res, next) => {
    try {
        const { email, password, firstName, lastName, phone, role, tenantDomain, branchId } = req.body;
        const result = await authService.register({
            email,
            password,
            firstName,
            lastName,
            phone,
            role,
            tenantDomain,
            branchId
        });
        res.status(201).json({
            success: true,
            data: result,
            message: 'Registration successful. Please check your email for verification.'
        });
    }
    catch (error) {
        next(error);
    }
});
router.post('/refresh', async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                error: 'Refresh token is required'
            });
        }
        const result = await authService.refreshToken(refreshToken);
        return res.json({
            success: true,
            data: result,
            message: 'Token refreshed successfully'
        });
    }
    catch (error) {
        next(error);
    }
});
router.post('/change-password', auth_1.authenticate, (0, validation_1.validateRequest)(authSchemas_1.changePasswordSchema), async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.userId;
        const tenantId = req.user.tenantId;
        await authService.changePassword(userId, tenantId, currentPassword, newPassword);
        return res.json({
            success: true,
            message: 'Password changed successfully'
        });
    }
    catch (error) {
        next(error);
    }
});
router.post('/request-password-reset', async (req, res, next) => {
    try {
        const { email, tenantDomain } = req.body;
        if (!email || !tenantDomain) {
            return res.status(400).json({
                success: false,
                error: 'Email and tenant domain are required'
            });
        }
        await authService.requestPasswordReset(email, tenantDomain);
        return res.json({
            success: true,
            message: 'Password reset email sent (if account exists)'
        });
    }
    catch (error) {
        next(error);
    }
});
router.post('/reset-password', (0, validation_1.validateRequest)(authSchemas_1.resetPasswordSchema), async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;
        await authService.resetPassword(token, newPassword);
        return res.json({
            success: true,
            message: 'Password reset successfully'
        });
    }
    catch (error) {
        next(error);
    }
});
router.get('/verify-email/:token', async (req, res, next) => {
    try {
        const { token } = req.params;
        await authService.verifyEmail(token);
        res.json({
            success: true,
            message: 'Email verified successfully'
        });
    }
    catch (error) {
        next(error);
    }
});
router.post('/resend-verification', async (req, res, next) => {
    try {
        const { email, tenantDomain } = req.body;
        if (!email || !tenantDomain) {
            return res.status(400).json({
                success: false,
                error: 'Email and tenant domain are required'
            });
        }
        await authService.resendEmailVerification(email, tenantDomain);
        return res.json({
            success: true,
            message: 'Verification email sent'
        });
    }
    catch (error) {
        next(error);
    }
});
router.post('/logout', auth_1.authenticate, async (req, res, next) => {
    try {
        return res.json({
            success: true,
            message: 'Logout successful'
        });
    }
    catch (error) {
        next(error);
    }
});
router.get('/me', auth_1.authenticate, async (req, res, next) => {
    try {
        const { UserRepository } = await Promise.resolve().then(() => __importStar(require('../repositories/UserRepository')));
        const { TenantRepository } = await Promise.resolve().then(() => __importStar(require('../repositories/TenantRepository')));
        const userRepository = new UserRepository();
        const tenantRepository = new TenantRepository();
        const userId = req.user.userId;
        const tenantId = req.user.tenantId;
        const [user, tenant] = await Promise.all([
            userRepository.findById(userId, tenantId),
            tenantRepository.findById(tenantId, tenantId)
        ]);
        if (!user || !tenant) {
            return res.status(404).json({
                success: false,
                error: 'User or tenant not found'
            });
        }
        const { password_hash, ...userWithoutPassword } = user;
        return res.json({
            success: true,
            data: {
                user: userWithoutPassword,
                tenant
            }
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map