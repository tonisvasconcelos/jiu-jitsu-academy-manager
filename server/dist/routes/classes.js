"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ClassRepository_1 = require("../repositories/ClassRepository");
const auth_1 = require("../middlewares/auth");
const errorHandler_1 = require("../middlewares/errorHandler");
const types_1 = require("../types");
const router = (0, express_1.Router)();
const classRepository = new ClassRepository_1.ClassRepository();
router.get('/', auth_1.authenticate, (0, auth_1.authorize)(types_1.UserRole.COACH), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const tenantId = req.user.tenantId;
    const { page = 1, limit = 10 } = req.query;
    const result = await classRepository.findAll(tenantId, {
        page: parseInt(page),
        limit: parseInt(limit)
    });
    res.json({
        success: true,
        data: result.data,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: result.total,
            totalPages: Math.ceil(result.total / parseInt(limit))
        }
    });
}));
exports.default = router;
//# sourceMappingURL=classes.js.map