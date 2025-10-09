import bcrypt from 'bcryptjs';
import { testConnection, db } from '../shared/postgresDatabase.js';

export default async function handler(req, res) {
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

  // Force redeployment - User Management v1
  console.log('PostgreSQL User Management API called:', req.method, req.body);

  try {
    // Test database connection
    await testConnection();

    switch (req.method) {
      case 'GET':
        return await handleGetUsers(req, res);
      case 'POST':
        return await handleCreateUser(req, res);
      case 'PUT':
        return await handleUpdateUser(req, res);
      case 'DELETE':
        return await handleDeleteUser(req, res);
      default:
        return res.status(405).json({ 
          success: false, 
          error: 'Method not allowed' 
        });
    }
  } catch (error) {
    console.error('User Management error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
}

// Get users (with optional tenant filter)
async function handleGetUsers(req, res) {
  try {
    const { tenantId } = req.query;
    // Using direct db connection
    
    let query = `
      SELECT u.*, t.name as tenant_name, t.domain as tenant_domain
      FROM users u
      LEFT JOIN tenants t ON u.tenant_id = t.id
    `;
    let params = [];

    if (tenantId) {
      query += ' WHERE u.tenant_id = $1';
      params.push(tenantId);
    }

    query += ' ORDER BY u.created_at DESC';

    const users = await db.any(query, params);
    
    return res.status(200).json({
      success: true,
      data: users,
      count: users.length
    });
  } catch (error) {
    console.error('Error getting users:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve users',
      details: error.message
    });
  }
}

// Create new user
async function handleCreateUser(req, res) {
  try {
    const { 
      tenantId,
      email, 
      password,
      firstName,
      lastName,
      phone,
      role = 'student',
      branchId
    } = req.body;

    // Validate required fields
    if (!tenantId || !email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: tenantId, email, password, firstName, lastName'
      });
    }

    // Using direct db connection

    // Check if user already exists
    const existingUser = await db.oneOrNone(
      'SELECT id FROM users WHERE email = $1 AND tenant_id = $2',
      [email, tenantId]
    );

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists in this tenant'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await db.one(`
      INSERT INTO users (
        tenant_id, email, password_hash, first_name, last_name,
        phone, role, status, branch_id, email_verified
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id, email, first_name, last_name, phone, role, status, branch_id, created_at
    `, [
      tenantId,
      email,
      hashedPassword,
      firstName,
      lastName,
      phone || null,
      role,
      'active',
      branchId || null,
      true
    ]);

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user
    });

  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create user',
      details: error.message
    });
  }
}

// Update user
async function handleUpdateUser(req, res) {
  try {
    const { id } = req.query;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    // Using direct db connection

    // Build dynamic update query
    const allowedFields = ['email', 'first_name', 'last_name', 'phone', 'role', 'status', 'branch_id'];
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

    // Handle password update separately
    if (updateData.password) {
      const hashedPassword = await bcrypt.hash(updateData.password, 12);
      updates.push(`password_hash = $${paramCount}`);
      values.push(hashedPassword);
      paramCount++;
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid fields to update'
      });
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const user = await db.one(`
      UPDATE users 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, email, first_name, last_name, phone, role, status, branch_id, updated_at
    `, values);

    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update user',
      details: error.message
    });
  }
}

// Delete user
async function handleDeleteUser(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    // Using direct db connection

    // Delete user
    await db.none('DELETE FROM users WHERE id = $1', [id]);

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete user',
      details: error.message
    });
  }
}
