"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TenantRepository_1 = require("../repositories/TenantRepository");
const auth_1 = require("../middlewares/auth");
const errorHandler_1 = require("../middlewares/errorHandler");
const types_1 = require("../types");
const router = (0, express_1.Router)();
const tenantRepository = new TenantRepository_1.TenantRepository();
router.get('/', auth_1.authenticate, (0, auth_1.authorize)(types_1.UserRole.SYSTEM_MANAGER), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    res.json({
        success: true,
        message: 'Tenant management endpoints - to be implemented'
    });
}));
exports.default = router;
//# sourceMappingURL=tenants.js.map