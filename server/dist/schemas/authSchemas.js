"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendVerificationSchema = exports.requestPasswordResetSchema = exports.resetPasswordSchema = exports.changePasswordSchema = exports.registerSchema = exports.loginSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const types_1 = require("../types");
const emailSchema = joi_1.default.string().email().lowercase().trim().required();
const passwordSchema = joi_1.default.string().min(8).max(128).required();
const nameSchema = joi_1.default.string().min(2).max(100).trim().required();
const phoneSchema = joi_1.default.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).optional();
const uuidSchema = joi_1.default.string().uuid().required();
const domainSchema = joi_1.default.string().domain().required();
exports.loginSchema = joi_1.default.object({
    email: emailSchema,
    password: joi_1.default.string().required(),
    tenantDomain: domainSchema
});
exports.registerSchema = joi_1.default.object({
    email: emailSchema,
    password: passwordSchema,
    firstName: nameSchema,
    lastName: nameSchema,
    phone: phoneSchema,
    role: joi_1.default.string().valid(...Object.values(types_1.UserRole)).required(),
    tenantDomain: domainSchema,
    branchId: uuidSchema.optional()
});
exports.changePasswordSchema = joi_1.default.object({
    currentPassword: joi_1.default.string().required(),
    newPassword: passwordSchema
});
exports.resetPasswordSchema = joi_1.default.object({
    token: joi_1.default.string().uuid().required(),
    newPassword: passwordSchema
});
exports.requestPasswordResetSchema = joi_1.default.object({
    email: emailSchema,
    tenantDomain: domainSchema
});
exports.resendVerificationSchema = joi_1.default.object({
    email: emailSchema,
    tenantDomain: domainSchema
});
//# sourceMappingURL=authSchemas.js.map