const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

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

  // Mock authentication for Elite Combat Academy
  if (domain === 'elite-combat.jiu-jitsu.com' && 
      email === 'admin@elite-combat.com' && 
      password === 'EliteAdmin2024!') {
    
    const token = Buffer.from(JSON.stringify({
      userId: 'admin-123',
      tenantId: 'elite-combat-123',
      role: 'system_manager',
      email: email
    })).toString('base64');

    return res.json({
      success: true,
      token,
      user: {
        id: 'admin-123',
        email: email,
        role: 'system_manager',
        tenantId: 'elite-combat-123',
        firstName: 'Admin',
        lastName: 'User'
      }
    });
  }

  return res.status(401).json({
    success: false,
    error: 'Invalid credentials'
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
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 API base URL: http://localhost:${PORT}/api`);
  console.log(`🔧 Environment: development`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  process.exit(0);
});
