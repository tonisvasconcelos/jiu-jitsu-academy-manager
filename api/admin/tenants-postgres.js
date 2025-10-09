import bcrypt from 'bcryptjs';
import { authService, testConnection } from '../shared/postgresDatabase.js';

export default async function handler(req, res) {
  // Force redeployment - Tenant Management v1
  console.log('PostgreSQL Tenant Management API called:', req.method, req.body);

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Test database connection
    await testConnection();

    switch (req.method) {
      case 'GET':
        return await handleGetTenants(req, res);
      case 'POST':
        return await handleCreateTenant(req, res);
      case 'PUT':
        return await handleUpdateTenant(req, res);
      case 'DELETE':
        return await handleDeleteTenant(req, res);
      default:
        return res.status(405).json({ 
          success: false, 
          error: 'Method not allowed' 
        });
    }
  } catch (error) {
    console.error('Tenant Management error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
}

// Get all tenants (admin only)
async function handleGetTenants(req, res) {
  try {
    const { authService } = await import('../shared/postgresDatabase.js');
    const db = (await import('../shared/postgresDatabase.js')).default;
    
    const tenants = await db.any('SELECT * FROM tenants ORDER BY created_at DESC');
    
    return res.status(200).json({
      success: true,
      data: tenants,
      count: tenants.length
    });
  } catch (error) {
    console.error('Error getting tenants:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve tenants',
      details: error.message
    });
  }
}

// Create new tenant with admin user
async function handleCreateTenant(req, res) {
  try {
    const { 
      name, 
      domain, 
      contactEmail, 
      contactPhone, 
      address,
      plan = 'trial',
      adminEmail,
      adminPassword,
      adminFirstName,
      adminLastName
    } = req.body;

    // Validate required fields
    if (!name || !domain || !contactEmail || !adminEmail || !adminPassword) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, domain, contactEmail, adminEmail, adminPassword'
      });
    }

    const db = (await import('../shared/postgresDatabase.js')).default;

    // Start transaction
    const result = await db.tx(async (t) => {
      // Create tenant
      const tenant = await t.one(`
        INSERT INTO tenants (
          name, domain, plan, contact_email, contact_phone, address,
          license_start, license_end, is_active, settings
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `, [
        name,
        domain,
        plan,
        contactEmail,
        contactPhone || null,
        address || null,
        new Date(),
        new Date(Date.now() + (plan === 'trial' ? 14 * 24 * 60 * 60 * 1000 : 365 * 24 * 60 * 60 * 1000)), // 14 days for trial, 1 year for paid
        true,
        JSON.stringify({
          currency: 'USD',
          language: 'ENU',
          timezone: 'America/New_York',
          features: {
            publicBooking: true,
            classScheduling: true,
            studentManagement: true,
            championshipManagement: plan !== 'trial'
          }
        })
      ]);

      // Hash admin password
      const hashedPassword = await bcrypt.hash(adminPassword, 12);

      // Create admin user
      const adminUser = await t.one(`
        INSERT INTO users (
          tenant_id, email, password_hash, first_name, last_name,
          role, status, email_verified
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, email, first_name, last_name, role, status, created_at
      `, [
        tenant.id,
        adminEmail,
        hashedPassword,
        adminFirstName || 'Admin',
        adminLastName || 'User',
        'system_manager',
        'active',
        true
      ]);

      // Create default branch
      const branch = await t.one(`
        INSERT INTO branches (
          tenant_id, name, address, city, state, country, postal_code,
          phone, email, manager_id, is_active, capacity
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *
      `, [
        tenant.id,
        'Main Dojo',
        address || '123 Main Street',
        'City',
        'State',
        'Country',
        '12345',
        contactPhone || null,
        contactEmail,
        adminUser.id,
        true,
        50
      ]);

      return { tenant, adminUser, branch };
    });

    return res.status(201).json({
      success: true,
      message: 'Tenant created successfully',
      data: {
        tenant: result.tenant,
        adminUser: {
          ...result.adminUser,
          password: '[HIDDEN]'
        },
        branch: result.branch
      }
    });

  } catch (error) {
    console.error('Error creating tenant:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create tenant',
      details: error.message
    });
  }
}

// Update tenant
async function handleUpdateTenant(req, res) {
  try {
    const { id } = req.query;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Tenant ID is required'
      });
    }

    const db = (await import('../shared/postgresDatabase.js')).default;

    // Build dynamic update query
    const allowedFields = ['name', 'domain', 'plan', 'contact_email', 'contact_phone', 'address', 'is_active', 'settings'];
    const updates = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key)) {
        updates.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid fields to update'
      });
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const tenant = await db.one(`
      UPDATE tenants 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `, values);

    return res.status(200).json({
      success: true,
      message: 'Tenant updated successfully',
      data: tenant
    });

  } catch (error) {
    console.error('Error updating tenant:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update tenant',
      details: error.message
    });
  }
}

// Delete tenant
async function handleDeleteTenant(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Tenant ID is required'
      });
    }

    const db = (await import('../shared/postgresDatabase.js')).default;

    // Delete tenant (cascade will handle related records)
    await db.none('DELETE FROM tenants WHERE id = $1', [id]);

    return res.status(200).json({
      success: true,
      message: 'Tenant deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting tenant:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete tenant',
      details: error.message
    });
  }
}
