import bcrypt from 'bcryptjs';
import { authService, testConnection } from '../shared/postgresDatabase.js';

export default async function handler(req, res) {
  // Force redeployment - PostgreSQL v2
  console.log('PostgreSQL Login API called:', req.method, req.body);

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins for testing
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('OPTIONS request handled');
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    const { email, password, tenantDomain } = req.body;

    // Validate required fields
    if (!email || !password || !tenantDomain) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, and tenant domain are required'
      });
    }

    // Test database connection
    await testConnection();

    // Find tenant by domain
    console.log('Looking for tenant with domain:', tenantDomain);
    const tenant = await authService.findTenantByDomain(tenantDomain);
    console.log('Found tenant:', tenant ? 'YES' : 'NO', tenant);
    if (!tenant) {
      return res.status(401).json({
        success: false,
        error: 'Invalid tenant domain'
      });
    }

    if (!tenant.is_active) {
      return res.status(401).json({
        success: false,
        error: 'Tenant account is inactive'
      });
    }

    // Check if license is still valid
    if (new Date(tenant.license_end) < new Date()) {
      return res.status(401).json({
        success: false,
        error: 'Tenant license has expired'
      });
    }

    // Find user by email within tenant
    const user = await authService.findUserByEmail(email, tenant.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check user status
    if (user.status === 'suspended') {
      return res.status(401).json({
        success: false,
        error: 'Account is suspended'
      });
    }

    if (user.status === 'inactive') {
      return res.status(401).json({
        success: false,
        error: 'Account is inactive'
      });
    }

    // Update last login
    await authService.updateLastLogin(user.id, tenant.id);

    // Generate simple token (in production, use proper JWT)
    const token = Buffer.from(`${user.id}:${tenant.id}:${Date.now()}`).toString('base64');

    // Return success response
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        status: user.status,
        branchId: user.branch_id,
        avatarUrl: user.avatar_url,
        lastLogin: user.last_login
      },
      tenant: {
        id: tenant.id,
        name: tenant.name,
        domain: tenant.domain,
        plan: tenant.plan,
        licenseStart: tenant.license_start,
        licenseEnd: tenant.license_end,
        isActive: tenant.is_active,
        settings: tenant.settings
      }
    });

  } catch (error) {
    console.error('PostgreSQL Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
}
