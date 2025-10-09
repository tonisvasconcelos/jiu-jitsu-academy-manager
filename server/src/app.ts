import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/simple-auth';
// Temporarily disable other routes to get basic server running
// import userRoutes from './routes/users';
// import tenantRoutes from './routes/tenants';
// import branchRoutes from './routes/branches';
// import classRoutes from './routes/classes';
// import studentRoutes from './routes/students';
// import enrollmentRoutes from './routes/enrollments';
// import checkInRoutes from './routes/checkIns';
import publicRoutes from './routes/simple-public';

// Import middleware
import { errorHandler } from './middlewares/errorHandler';
// SQLite doesn't need tenant context clearing like PostgreSQL RLS
const clearTenantContext = async () => {
  // No-op for SQLite
};

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
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
app.use(cors(corsOptions));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for public pages
app.use('/public', express.static(path.join(__dirname, '../public')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Jiu-Jitsu Academy Manager API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API routes
app.use('/api/auth', authRoutes);
// Temporarily disable other routes
// app.use('/api/users', userRoutes);
// app.use('/api/tenants', tenantRoutes);
// app.use('/api/branches', branchRoutes);
// app.use('/api/classes', classRoutes);
// app.use('/api/students', studentRoutes);
// app.use('/api/enrollments', enrollmentRoutes);
// app.use('/api/check-ins', checkInRoutes);
app.use('/api/public', publicRoutes);

// Serve public pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Global error handler
app.use(errorHandler);

// Clear tenant context after each request
app.use((req, res, next) => {
  res.on('finish', async () => {
    try {
      await clearTenantContext();
    } catch (error) {
      console.error('Error clearing tenant context:', error);
    }
  });
  next();
});

export default app;
