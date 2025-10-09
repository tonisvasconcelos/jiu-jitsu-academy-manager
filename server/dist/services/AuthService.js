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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
const UserRepository_1 = require("../repositories/UserRepository");
const TenantRepository_1 = require("../repositories/TenantRepository");
const jwt_1 = require("../utils/jwt");
const types_1 = require("../types");
class AuthService {
    constructor() {
        this.userRepository = new UserRepository_1.UserRepository();
        this.tenantRepository = new TenantRepository_1.TenantRepository();
    }
    async login(credentials) {
        const { email, password, tenantDomain } = credentials;
        const tenant = await this.tenantRepository.findByDomain(tenantDomain);
        if (!tenant) {
            throw new Error('Invalid tenant domain');
        }
        if (!tenant.is_active) {
            throw new Error('Tenant account is inactive');
        }
        if (tenant.license_end < new Date()) {
            throw new Error('Tenant license has expired');
        }
        const user = await this.userRepository.findByEmail(email, tenant.id);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password_hash);
        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }
        if (user.status === types_1.UserStatus.SUSPENDED) {
            throw new Error('Account is suspended');
        }
        if (user.status === types_1.UserStatus.INACTIVE) {
            throw new Error('Account is inactive');
        }
        await this.userRepository.updateLastLogin(user.id, tenant.id);
        const accessToken = (0, jwt_1.generateAccessToken)({
            userId: user.id,
            tenantId: tenant.id,
            role: user.role,
            email: user.email
        });
        const refreshToken = (0, jwt_1.generateRefreshToken)(user.id, tenant.id);
        const { password_hash, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            tenant,
            accessToken,
            refreshToken
        };
    }
    async register(data) {
        const { email, password, firstName, lastName, phone, role, tenantDomain, branchId } = data;
        const tenant = await this.tenantRepository.findByDomain(tenantDomain);
        if (!tenant) {
            throw new Error('Invalid tenant domain');
        }
        if (!tenant.is_active) {
            throw new Error('Tenant account is inactive');
        }
        const existingUser = await this.userRepository.findByEmail(email, tenant.id);
        if (existingUser) {
            throw new Error('User already exists with this email');
        }
        const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
        const passwordHash = await bcryptjs_1.default.hash(password, saltRounds);
        const userData = {
            tenant_id: tenant.id,
            email,
            password_hash: passwordHash,
            first_name: firstName,
            last_name: lastName,
            phone,
            role,
            status: types_1.UserStatus.PENDING,
            branch_id: branchId,
            email_verified: false,
            email_verification_token: (0, uuid_1.v4)()
        };
        const user = await this.userRepository.create(userData);
        const accessToken = (0, jwt_1.generateAccessToken)({
            userId: user.id,
            tenantId: tenant.id,
            role: user.role,
            email: user.email
        });
        const refreshToken = (0, jwt_1.generateRefreshToken)(user.id, tenant.id);
        const { password_hash, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            tenant,
            accessToken,
            refreshToken
        };
    }
    async refreshToken(refreshToken) {
        const { verifyRefreshToken } = await Promise.resolve().then(() => __importStar(require('../utils/jwt')));
        const { userId, tenantId } = verifyRefreshToken(refreshToken);
        const user = await this.userRepository.findById(userId, tenantId);
        if (!user) {
            throw new Error('User not found');
        }
        if (user.status === types_1.UserStatus.SUSPENDED || user.status === types_1.UserStatus.INACTIVE) {
            throw new Error('Account is suspended or inactive');
        }
        const accessToken = (0, jwt_1.generateAccessToken)({
            userId: user.id,
            tenantId: user.tenant_id,
            role: user.role,
            email: user.email
        });
        const newRefreshToken = (0, jwt_1.generateRefreshToken)(user.id, user.tenant_id);
        return {
            accessToken,
            refreshToken: newRefreshToken
        };
    }
    async changePassword(userId, tenantId, currentPassword, newPassword) {
        const user = await this.userRepository.findById(userId, tenantId);
        if (!user) {
            throw new Error('User not found');
        }
        const isValidPassword = await bcryptjs_1.default.compare(currentPassword, user.password_hash);
        if (!isValidPassword) {
            throw new Error('Current password is incorrect');
        }
        const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
        const newPasswordHash = await bcryptjs_1.default.hash(newPassword, saltRounds);
        await this.userRepository.updatePassword(userId, tenantId, newPasswordHash);
    }
    async requestPasswordReset(email, tenantDomain) {
        const tenant = await this.tenantRepository.findByDomain(tenantDomain);
        if (!tenant) {
            throw new Error('Invalid tenant domain');
        }
        const user = await this.userRepository.findByEmail(email, tenant.id);
        if (!user) {
            return;
        }
        const resetToken = (0, uuid_1.v4)();
        const expires = new Date(Date.now() + 3600000);
        await this.userRepository.setPasswordResetToken(user.id, tenant.id, resetToken, expires);
        console.log(`Password reset token for ${email}: ${resetToken}`);
    }
    async resetPassword(token, newPassword) {
        const user = await this.userRepository.findByPasswordResetToken(token);
        if (!user) {
            throw new Error('Invalid or expired reset token');
        }
        const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
        const newPasswordHash = await bcryptjs_1.default.hash(newPassword, saltRounds);
        await this.userRepository.updatePassword(user.id, user.tenant_id, newPasswordHash);
    }
    async verifyEmail(token) {
        const user = await this.userRepository.findByEmailVerificationToken(token);
        if (!user) {
            throw new Error('Invalid verification token');
        }
        await this.userRepository.verifyEmail(user.id, user.tenant_id);
        if (user.status === types_1.UserStatus.PENDING) {
            await this.userRepository.updateStatus(user.id, user.tenant_id, types_1.UserStatus.ACTIVE);
        }
    }
    async resendEmailVerification(email, tenantDomain) {
        const tenant = await this.tenantRepository.findByDomain(tenantDomain);
        if (!tenant) {
            throw new Error('Invalid tenant domain');
        }
        const user = await this.userRepository.findByEmail(email, tenant.id);
        if (!user) {
            throw new Error('User not found');
        }
        if (user.email_verified) {
            throw new Error('Email is already verified');
        }
        const verificationToken = (0, uuid_1.v4)();
        await this.userRepository.setEmailVerificationToken(user.id, tenant.id, verificationToken);
        console.log(`Email verification token for ${email}: ${verificationToken}`);
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map