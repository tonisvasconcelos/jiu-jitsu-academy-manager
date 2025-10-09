"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userParamsSchema = exports.userQuerySchema = exports.userUpdateSchema = exports.userCreateSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const types_1 = require("../types");
const emailSchema = joi_1.default.string().email().lowercase().trim().required();
const passwordSchema = joi_1.default.string().min(8).max(128).required();
const nameSchema = joi_1.default.string().min(2).max(100).trim().required();
const phoneSchema = joi_1.default.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).optional();
const uuidSchema = joi_1.default.string().uuid().required();
exports.userCreateSchema = joi_1.default.object({
    email: emailSchema,
    password: passwordSchema,
    first_name: nameSchema,
    last_name: nameSchema,
    phone: phoneSchema,
    role: joi_1.default.string().valid(...Object.values(types_1.UserRole)).required(),
    status: joi_1.default.string().valid(...Object.values(types_1.UserStatus)).default(types_1.UserStatus.ACTIVE),
    branch_id: uuidSchema.optional(),
    avatar_url: joi_1.default.string().uri().optional()
});
exports.userUpdateSchema = joi_1.default.object({
    first_name: nameSchema.optional(),
    last_name: nameSchema.optional(),
    phone: phoneSchema,
    status: joi_1.default.string().valid(...Object.values(types_1.UserStatus)).optional(),
    branch_id: uuidSchema.optional(),
    avatar_url: joi_1.default.string().uri().optional()
});
exports.userQuerySchema = joi_1.default.object({
    page: joi_1.default.number().integer().min(1).default(1),
    limit: joi_1.default.number().integer().min(1).max(100).default(10),
    search: joi_1.default.string().max(100).optional(),
    status: joi_1.default.string().valid(...Object.values(types_1.UserStatus)).optional(),
    role: joi_1.default.string().valid(...Object.values(types_1.UserRole)).optional(),
    branch_id: uuidSchema.optional(),
    sortBy: joi_1.default.string().valid('first_name', 'last_name', 'email', 'created_at', 'last_login').default('created_at'),
    sortOrder: joi_1.default.string().valid('asc', 'desc').default('desc')
});
exports.userParamsSchema = joi_1.default.object({
    id: uuidSchema
});
//# sourceMappingURL=userSchemas.js.map