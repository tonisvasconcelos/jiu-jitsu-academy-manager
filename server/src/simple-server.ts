import express from 'express';
import cors from 'cors';
import path from 'path';
import { query } from './config/sqlite-database';
import bcrypt from 'bcryptjs';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:5000', 
    'http://localhost:5173',
    'https://oss365.app',
    'https://www.oss365.app'
  ],
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Jiu-Jitsu Academy Manager API is running',
    timestamp: new Date().toISOString()
  });
});

// Simple login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { domain, email, password } = req.body;
    
    if (!domain || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Domain, email, and password are required'
      });
    }

    // Find tenant by domain
    const tenantResult = await query(
      'SELECT * FROM tenants WHERE domain = ? AND is_active = 1',
      [domain]
    );
    
    if (tenantResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid tenant domain'
      });
    }

    const tenant = tenantResult.rows[0];

    // Find user by email within tenant
    const userResult = await query(
      'SELECT * FROM users WHERE email = ? AND tenant_id = ? AND status = ?',
      [email, tenant.id, 'active']
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    const user = userResult.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Generate simple token (base64 encoded user info)
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

  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Simple public classes endpoint
app.get('/api/public/classes', async (req, res) => {
  try {
    const { tenantDomain } = req.query;
    
    if (!tenantDomain) {
      return res.status(400).json({
        success: false,
        error: 'Tenant domain is required'
      });
    }

    // For now, return sample data
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
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch classes'
    });
  }
});

// Serve static files
app.use('/public', express.static(path.join(__dirname, '../public')));

// Root endpoint
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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Simple server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 API base URL: http://localhost:${PORT}/api`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
