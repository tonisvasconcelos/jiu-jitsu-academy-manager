"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SimpleAuthService_1 = require("../services/SimpleAuthService");
const router = (0, express_1.Router)();
const authService = new SimpleAuthService_1.SimpleAuthService();
router.post('/login', async (req, res, next) => {
    try {
        const { domain, email, password } = req.body;
        if (!domain || !email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Domain, email, and password are required'
            });
        }
        const result = await authService.login({
            domain,
            email,
            password
        });
        return res.json(result);
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            error: error.message || 'Login failed'
        });
    }
});
router.post('/register', async (req, res, next) => {
    try {
        const { domain, email, password, firstName, lastName, role } = req.body;
        if (!domain || !email || !password || !firstName || !lastName) {
            return res.status(400).json({
                success: false,
                error: 'Domain, email, password, firstName, and lastName are required'
            });
        }
        const result = await authService.register({
            domain,
            email,
            password,
            firstName,
            lastName,
            role
        });
        return res.status(201).json(result);
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message || 'Registration failed'
        });
    }
});
exports.default = router;
//# sourceMappingURL=simple-auth.js.map