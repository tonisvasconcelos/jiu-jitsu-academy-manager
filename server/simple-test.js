const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:3001', 
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:5173'
  ],
  credentials: true
}));
app.use(express.json());

// SQLite database
const db = new sqlite3.Database('./test-academy.db');

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Jiu-Jitsu Academy Manager API is running',
    timestamp: new Date().toISOString()
  });
});

// Simple login endpoint
app.post('/api/auth/login', (req, res) => {
  const { domain, email, password } = req.body;
  
  if (!domain || !email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Domain, email, and password are required'
    });
  }

  // Find tenant by domain
  db.get('SELECT * FROM tenants WHERE domain = ? AND is_active = 1', [domain], (err, tenant) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        error: 'Database error'
      });
    }
    
    if (!tenant) {
      return res.status(401).json({
        success: false,
        error: 'Invalid tenant domain'
      });
    }

    // Find user by email within tenant
    db.get('SELECT * FROM users WHERE email = ? AND tenant_id = ? AND status = ?', 
      [email, tenant.id, 'active'], (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          error: 'Database error'
        });
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      // Verify password
      bcrypt.compare(password, user.password_hash, (err, isValid) => {
        if (err) {
          console.error('Password comparison error:', err);
          return res.status(500).json({
            success: false,
            error: 'Password verification error'
          });
        }

        if (!isValid) {
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
      });
    });
  });
});

// Simple public classes endpoint
app.get('/api/public/classes', (req, res) => {
  const { tenantDomain } = req.query;
  
  if (!tenantDomain) {
    return res.status(400).json({
      success: false,
      error: 'Tenant domain is required'
    });
  }

  // Return sample data
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
  console.log(`🚀 Simple test server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 API base URL: http://localhost:${PORT}/api`);
  console.log(`🔧 Environment: development`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('✅ Database connection closed');
    }
    process.exit(0);
  });
});
