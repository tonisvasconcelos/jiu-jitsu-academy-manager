"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const simple_auth_1 = __importDefault(require("./routes/simple-auth"));
const simple_public_1 = __importDefault(require("./routes/simple-public"));
const errorHandler_1 = require("./middlewares/errorHandler");
const clearTenantContext = async () => {
};
const app = (0, express_1.default)();
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://localhost:5000',
        'http://localhost:5173',
        'https://oss365.app',
        'https://www.oss365.app',
        'https://jiu-jitsu-academy-manager-hfpke530m-oss365.vercel.app',
        'https://jiu-jitsu-academy-manager-of9evjcow-oss365.vercel.app',
        'https://jiu-jitsu-academy-manager-b3b1wks5k-oss365.vercel.app',
        'https://jiu-jitsu-academy-manager-lht5dizys-oss365.vercel.app',
        'https://jiu-jitsu-academy-manager-au1kwaqzi-oss365.vercel.app',
        'https://jiu-jitsu-academy-manager-j8ijitvnx-oss365.vercel.app',
        'https://jiu-jitsu-academy-manager-aacs9ajqz-oss365.vercel.app',
        'https://jiu-jitsu-academy-manager-ansjq98o1-oss365.vercel.app',
        'https://jiu-jitsu-academy-manager-kmvorhcld-oss365.vercel.app',
        'https://jiu-jitsu-academy-manager-nrygzqwtn-oss365.vercel.app',
        'https://jiu-jitsu-academy-manager-hten1uq58-oss365.vercel.app',
        'https://jiu-jitsu-academy-manager-j8ijitvnx-oss365.vercel.app',
        'https://jiu-jitsu-academy-manager-lht5dizys-oss365.vercel.app',
        'https://jiu-jitsu-academy-manager-au1kwaqzi-oss365.vercel.app',
        'https://jiu-jitsu-academy-manager-ansjq98o1-oss365.vercel.app',
        'https://jiu-jitsu-academy-manager-kmvorhcld-oss365.vercel.app',
        'https://jiu-jitsu-academy-manager-nrygzqwtn-oss365.vercel.app',
        'https://jiu-jitsu-academy-manager-hten1uq58-oss365.vercel.app',
        'https://jiu-jitsu-academy-manager-hfpke530m-oss365.vercel.app'
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, compression_1.default)());
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
else {
    app.use((0, morgan_1.default)('combined'));
}
const limiter = (0, express_rate_limit_1.default)({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    message: {
        success: false,
        error: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use('/public', express_1.default.static(path_1.default.join(__dirname, '../public')));
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Jiu-Jitsu Academy Manager API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});
app.use('/api/auth', simple_auth_1.default);
app.use('/api/public', simple_public_1.default);
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../public/index.html'));
});
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});
app.use(errorHandler_1.errorHandler);
app.use((req, res, next) => {
    res.on('finish', async () => {
        try {
            await clearTenantContext();
        }
        catch (error) {
            console.error('Error clearing tenant context:', error);
        }
    });
    next();
});
exports.default = app;
//# sourceMappingURL=app.js.map