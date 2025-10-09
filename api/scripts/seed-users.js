import bcrypt from 'bcryptjs';
import { testConnection, db } from '../shared/postgresDatabase.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  console.log('User Seeding API called:', req.method);

  try {
    // Test database connection
    await testConnection();

    if (req.method === 'POST') {
      return await seedUsers(req, res);
    } else if (req.method === 'GET') {
      return await checkExistingUsers(req, res);
    } else {
      res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('User seeding error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: error.message 
    });
  }
}

async function checkExistingUsers(req, res) {
  try {
    console.log('Checking existing users...');
    
    // Get all users with their tenant information
    const users = await db.any(`
      SELECT 
        u.id,
        u.email,
        u.first_name,
        u.last_name,
        u.role,
        u.tenant_id,
        t.domain as tenant_domain,
        t.name as tenant_name
      FROM users u
      JOIN tenants t ON u.tenant_id = t.id
      ORDER BY t.domain, u.email
    `);

    console.log(`Found ${users.length} users in database`);

    res.status(200).json({
      success: true,
      message: `Found ${users.length} users`,
      data: users
    });
  } catch (error) {
    console.error('Error checking users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check users',
      details: error.message
    });
  }
}

async function seedUsers(req, res) {
  try {
    console.log('Seeding users...');
    
    // Get all tenants
    const tenants = await db.any('SELECT id, domain, name FROM tenants WHERE is_active = true');
    console.log(`Found ${tenants.length} active tenants:`, tenants);

    const seededUsers = [];

    for (const tenant of tenants) {
      console.log(`Processing tenant: ${tenant.domain} (${tenant.name})`);
      
      // Check if admin user already exists for this tenant
      const existingAdmin = await db.oneOrNone(
        'SELECT id FROM users WHERE tenant_id = $1 AND role = $2',
        [tenant.id, 'system_manager']
      );

      if (existingAdmin) {
        console.log(`Admin user already exists for tenant ${tenant.domain}`);
        continue;
      }

      // Create admin user for this tenant
      const adminEmail = `admin@${tenant.domain}`;
      const adminPassword = 'admin123';
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      const newUser = await db.one(`
        INSERT INTO users (
          tenant_id, email, password_hash, first_name, last_name, role, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, email, first_name, last_name, role
      `, [
        tenant.id,
        adminEmail,
        hashedPassword,
        'Admin',
        'User',
        'system_manager',
        true
      ]);

      seededUsers.push({
        ...newUser,
        tenant_domain: tenant.domain,
        tenant_name: tenant.name,
        password: adminPassword
      });

      console.log(`Created admin user for ${tenant.domain}: ${adminEmail}`);
    }

    res.status(200).json({
      success: true,
      message: `Seeded ${seededUsers.length} admin users`,
      data: seededUsers
    });

  } catch (error) {
    console.error('Error seeding users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to seed users',
      details: error.message
    });
  }
}
