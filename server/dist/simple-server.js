"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const sqlite_database_1 = require("./config/sqlite-database");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:3000',
        'http://localhost:5000',
        'http://localhost:5173',
        'https://oss365.app',
        'https://www.oss365.app'
    ],
    credentials: true
}));
app.use(express_1.default.json());
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Jiu-Jitsu Academy Manager API is running',
        timestamp: new Date().toISOString()
    });
});
app.post('/api/auth/login', async (req, res) => {
    try {
        const { domain, email, password } = req.body;
        if (!domain || !email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Domain, email, and password are required'
            });
        }
        const tenantResult = await (0, sqlite_database_1.query)('SELECT * FROM tenants WHERE domain = ? AND is_active = 1', [domain]);
        if (tenantResult.rows.length === 0) {
            return res.status(401).json({
                success: false,
                error: 'Invalid tenant domain'
            });
        }
        const tenant = tenantResult.rows[0];
        const userResult = await (0, sqlite_database_1.query)('SELECT * FROM users WHERE email = ? AND tenant_id = ? AND status = ?', [email, tenant.id, 'active']);
        if (userResult.rows.length === 0) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }
        const user = userResult.rows[0];
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }
        const token = Buffer.from(JSON.stringify({
            userId: user.id,
            tenantId: tenant.id,
            role: user.role,
            email: user.email
        })).toString('base64');
        return res.json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                tenantId: tenant.id,
                firstName: user.first_name,
                lastName: user.last_name
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
app.get('/api/public/classes', async (req, res) => {
    try {
        const { tenantDomain } = req.query;
        if (!tenantDomain) {
            return res.status(400).json({
                success: false,
                error: 'Tenant domain is required'
            });
        }
        return res.json({
            success: true,
            data: {
                classes: [
                    {
                        id: '1',
                        name: 'Beginner BJJ',
                        description: 'Introduction to Brazilian Jiu-Jitsu fundamentals',
                        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
                        maxCapacity: 20,
                        currentEnrollment: 5,
                        price: 30.00,
                        modality: 'Brazilian Jiu-Jitsu'
                    }
                ]
            }
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch classes'
        });
    }
});
app.use('/public', express_1.default.static(path_1.default.join(__dirname, '../public')));
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../public/index.html'));
});
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});
app.listen(PORT, () => {
    console.log(`🚀 Simple server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🌐 API base URL: http://localhost:${PORT}/api`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
});
exports.default = app;
//# sourceMappingURL=simple-server.js.map