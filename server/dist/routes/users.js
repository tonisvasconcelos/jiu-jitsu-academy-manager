"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserRepository_1 = require("../repositories/UserRepository");
const auth_1 = require("../middlewares/auth");
const validation_1 = require("../middlewares/validation");
const userSchemas_1 = require("../schemas/userSchemas");
const errorHandler_1 = require("../middlewares/errorHandler");
const types_1 = require("../types");
const router = (0, express_1.Router)();
const userRepository = new UserRepository_1.UserRepository();
router.get('/', auth_1.authenticate, (0, auth_1.authorize)(types_1.UserRole.COACH), (0, validation_1.validateQuery)(userSchemas_1.userQuerySchema), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const tenantId = req.user.tenantId;
    const { page = 1, limit = 10, search, status, role, branch_id } = req.query;
    const pagination = { page: parseInt(page), limit: parseInt(limit) };
    const filters = { search, status, role, branch_id };
    const result = await userRepository.findAll(tenantId, pagination, filters);
    res.json({
        success: true,
        data: result.data,
        pagination: {
            page: pagination.page,
            limit: pagination.limit,
            total: result.total,
            totalPages: Math.ceil(result.total / pagination.limit)
        }
    });
}));
router.get('/:id', auth_1.authenticate, (0, validation_1.validateParams)(userSchemas_1.userParamsSchema), auth_1.validateSelfAccess, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const tenantId = req.user.tenantId;
    const user = await userRepository.findById(id, tenantId);
    if (!user) {
        return res.status(404).json({
            success: false,
            error: 'User not found'
        });
    }
    const { password_hash, ...userWithoutPassword } = user;
    res.json({
        success: true,
        data: userWithoutPassword
    });
}));
router.post('/', auth_1.authenticate, (0, auth_1.authorize)(types_1.UserRole.BRANCH_MANAGER), (0, validation_1.validateRequest)(userSchemas_1.userCreateSchema), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const tenantId = req.user.tenantId;
    const userData = { ...req.body, tenant_id: tenantId };
    const user = await userRepository.create(userData);
    const { password_hash, ...userWithoutPassword } = user;
    res.status(201).json({
        success: true,
        data: userWithoutPassword,
        message: 'User created successfully'
    });
}));
router.put('/:id', auth_1.authenticate, (0, validation_1.validateParams)(userSchemas_1.userParamsSchema), (0, validation_1.validateRequest)(userSchemas_1.userUpdateSchema), auth_1.validateSelfAccess, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const tenantId = req.user.tenantId;
    const updateData = req.body;
    const user = await userRepository.update(id, tenantId, updateData);
    if (!user) {
        return res.status(404).json({
            success: false,
            error: 'User not found'
        });
    }
    const { password_hash, ...userWithoutPassword } = user;
    res.json({
        success: true,
        data: userWithoutPassword,
        message: 'User updated successfully'
    });
}));
router.delete('/:id', auth_1.authenticate, (0, auth_1.authorize)(types_1.UserRole.SYSTEM_MANAGER), (0, validation_1.validateParams)(userSchemas_1.userParamsSchema), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const tenantId = req.user.tenantId;
    const deleted = await userRepository.delete(id, tenantId);
    if (!deleted) {
        return res.status(404).json({
            success: false,
            error: 'User not found'
        });
    }
    res.json({
        success: true,
        message: 'User deleted successfully'
    });
}));
router.get('/stats', auth_1.authenticate, (0, auth_1.authorize)(types_1.UserRole.COACH), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const tenantId = req.user.tenantId;
    const stats = await userRepository.getStats(tenantId);
    res.json({
        success: true,
        data: stats
    });
}));
router.get('/role/:role', auth_1.authenticate, (0, auth_1.authorize)(types_1.UserRole.COACH), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { role } = req.params;
    const tenantId = req.user.tenantId;
    if (!Object.values(types_1.UserRole).includes(role)) {
        return res.status(400).json({
            success: false,
            error: 'Invalid role'
        });
    }
    const users = await userRepository.findByRole(role, tenantId);
    const usersWithoutPasswords = users.map(user => {
        const { password_hash, ...userWithoutPassword } = user;
        return userWithoutPassword;
    });
    res.json({
        success: true,
        data: usersWithoutPasswords
    });
}));
exports.default = router;
//# sourceMappingURL=users.js.map