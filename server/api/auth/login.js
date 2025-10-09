const { query } = require('../config/sqlite-database');
const bcrypt = require('bcryptjs');

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://oss365.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { domain, email, password } = req.body;

    if (!domain || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Mock authentication for Elite Combat Academy (for testing)
    if (domain === 'elite-combat.jiu-jitsu.com' && 
        email === 'admin@elite-combat.com' && 
        password === 'EliteAdmin2024!') {
      
      const mockToken = Buffer.from(JSON.stringify({
        userId: 'admin-123',
        tenantId: 'elite-combat-123',
        role: 'system_manager',
        email: email
      })).toString('base64');

      return res.status(200).json({
        success: true,
        token: mockToken,
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

    // Find tenant by domain
    const tenantResult = await query(
      'SELECT * FROM tenants WHERE domain = ? AND is_active = 1',
      [domain]
    );
    
    if (tenantResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid tenant domain' });
    }

    const tenant = tenantResult.rows[0];

    // Find user by email and tenant
    const userResult = await query(
      'SELECT * FROM users WHERE email = ? AND tenant_id = ?',
      [email, tenant.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = userResult.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = Buffer.from(JSON.stringify({
      userId: user.id,
      tenantId: tenant.id,
      role: user.role,
      email: user.email
    })).toString('base64');

    res.status(200).json({
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

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

