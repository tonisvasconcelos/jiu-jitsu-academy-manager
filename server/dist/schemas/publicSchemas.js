"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingSchema = exports.publicClassesQuerySchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.publicClassesQuerySchema = joi_1.default.object({
    tenantDomain: joi_1.default.string().domain().required(),
    branchId: joi_1.default.string().uuid().optional()
});
exports.bookingSchema = joi_1.default.object({
    firstName: joi_1.default.string().min(2).max(100).trim().required(),
    lastName: joi_1.default.string().min(2).max(100).trim().required(),
    email: joi_1.default.string().email().lowercase().trim().required(),
    phone: joi_1.default.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).required(),
    classId: joi_1.default.string().uuid().required(),
    branchId: joi_1.default.string().uuid().required(),
    tenantDomain: joi_1.default.string().domain().required(),
    notes: joi_1.default.string().max(500).optional(),
    preferredContactMethod: joi_1.default.string().valid('email', 'phone').default('email')
});
//# sourceMappingURL=publicSchemas.js.map