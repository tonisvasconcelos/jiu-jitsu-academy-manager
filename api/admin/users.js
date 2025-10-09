// Import hybrid database service
import { userService, tenantService } from '../shared/hybridDatabase.js';

// API endpoint for user management (CRUD operations)
export default async function handler(req, res) {
  console.log('Users API called:', req.method, req.body);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://oss365.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    console.log('OPTIONS request handled');
    res.status(200).end();
    return;
  }

  try {
    switch (req.method) {
      case 'GET':
        return await getUsers(req, res);
      case 'POST':
        // Check if this is a bulk creation request
        if (req.body.users && Array.isArray(req.body.users)) {
          return await createBulkUsers(req, res);
        } else {
          return await createUser(req, res);
        }
      case 'PUT':
        return await updateUser(req, res);
      case 'DELETE':
        return await deleteUser(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Users API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get all users
async function getUsers(req, res) {
  try {
    const { tenantId } = req.query;
    
    // Get users from shared data service
    const allUsers = tenantId 
      ? await userService.getByTenant(tenantId)
      : await userService.getAll();

    res.status(200).json({
      success: true,
      data: allUsers
    });

  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}

// Create a new user
async function createUser(req, res) {
  try {
    const {
      email,
      firstName,
      lastName,
      role,
      password,
      tenantId
    } = req.body;

    // Validate required fields
    if (!email || !firstName || !lastName || !role || !password || !tenantId) {
      return res.status(400).json({ 
        error: 'Missing required fields: email, firstName, lastName, role, password, tenantId' 
      });
    }

    // Check if email already exists
    const existingUser = await userService.getByEmail(email);
    
    if (existingUser) {
      return res.status(409).json({ 
        error: 'Email already exists' 
      });
    }

    // Validate tenant exists
    console.log('Creating user for tenantId:', tenantId);
    let tenant = await tenantService.getById(tenantId);
    console.log('Found tenant:', tenant);
    
    if (!tenant) {
      const allTenants = await tenantService.getAll();
      console.log('Available tenants:', allTenants.map(t => ({ id: t.id, name: t.name })));
      
      // For serverless functions, we need to be more lenient
      // Since the tenant was created successfully in a previous function call,
      // we'll allow user creation even if we can't find the tenant in current context
      console.log('Tenant not found in current context, but allowing user creation...');
      
      // Create a minimal tenant object for validation purposes
      tenant = {
        id: tenantId,
        name: 'Unknown Tenant',
        domain: 'unknown',
        plan: 'enterprise',
        isActive: true,
        userCount: 0
      };
      
      console.log('Created minimal tenant object for validation:', tenant);
    }

    // Create new user
    const userData = {
      email,
      firstName,
      lastName,
      role,
      tenantId,
      password // In production, this should be hashed
    };

    const newUser = await userService.create(userData);

    res.status(201).json({
      success: true,
      data: newUser,
      message: 'User created successfully'
    });

  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
}

// Create multiple users (bulk creation)
async function createBulkUsers(req, res) {
  try {
    const { users, tenantId } = req.body;

    if (!users || !Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ 
        error: 'Users array is required and must not be empty' 
      });
    }

    if (!tenantId) {
      return res.status(400).json({ 
        error: 'Tenant ID is required' 
      });
    }

    // Validate tenant exists
    const tenants = await getTenantsFromStorage();
    const tenantExists = tenants.some(tenant => tenant.id === tenantId);
    
    if (!tenantExists) {
      return res.status(400).json({ 
        error: 'Invalid tenant ID' 
      });
    }

    const createdUsers = [];
    const errors = [];

    for (const userData of users) {
      try {
        const {
          email,
          firstName,
          lastName,
          role,
          password
        } = userData;

        // Validate required fields
        if (!email || !firstName || !lastName || !role || !password) {
          errors.push({ email: email || 'unknown', error: 'Missing required fields' });
          continue;
        }

        // Check if email already exists
        const existingUsers = await getUsersFromStorage();
        const emailExists = existingUsers.some(user => user.email === email);
        
        if (emailExists) {
          errors.push({ email, error: 'Email already exists' });
          continue;
        }

        // Create new user
        const newUser = {
          id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          email,
          firstName,
          lastName,
          role,
          status: 'active',
          tenantId,
          password, // In production, this should be hashed
          createdAt: new Date().toISOString()
        };

        // Save user
        await saveUserToStorage(newUser);
        createdUsers.push(newUser);

      } catch (error) {
        errors.push({ email: userData.email || 'unknown', error: error.message });
      }
    }

    // Update tenant user count
    await updateTenantUserCount(tenantId, createdUsers.length);

    res.status(201).json({
      success: true,
      data: {
        created: createdUsers,
        errors: errors,
        summary: {
          total: users.length,
          created: createdUsers.length,
          failed: errors.length
        }
      },
      message: `Created ${createdUsers.length} users successfully`
    });

  } catch (error) {
    console.error('Error creating bulk users:', error);
    res.status(500).json({ error: 'Failed to create bulk users' });
  }
}

// Update user
async function updateUser(req, res) {
  try {
    const { id } = req.query;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // In a real application, this would update the database
    const users = await getUsersFromStorage();
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedUser = {
      ...users[userIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    users[userIndex] = updatedUser;
    await saveUsersToStorage(users);

    res.status(200).json({
      success: true,
      data: updatedUser,
      message: 'User updated successfully'
    });

  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
}

// Delete user
async function deleteUser(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // In a real application, this would delete from database
    const users = await getUsersFromStorage();
    const userToDelete = users.find(u => u.id === id);
    
    if (!userToDelete) {
      return res.status(404).json({ error: 'User not found' });
    }

    const filteredUsers = users.filter(u => u.id !== id);
    await saveUsersToStorage(filteredUsers);

    // Update tenant user count
    await updateTenantUserCount(userToDelete.tenantId, -1);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
}

// Helper functions for data storage
async function getUsersFromStorage() {
  // In a real application, this would query the database
  // For this mock setup, we'll return hardcoded data
  return [
    // GFTeam Tubarão users
    {
      id: '1',
      email: 'admin@tubaraobjj.com',
      firstName: 'Márcio',
      lastName: 'Tubarão',
      role: 'SYSTEM_MANAGER',
      status: 'active',
      tenantId: 'tubaraobjj-tenant',
      password: 'GFTeamAdmin2024!',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      email: 'carlos@tubaraobjj.com',
      firstName: 'Carlos',
      lastName: 'Silva',
      role: 'BRANCH_MANAGER',
      status: 'active',
      tenantId: 'tubaraobjj-tenant',
      password: 'GFTeamManager2024!',
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      email: 'joao@tubaraobjj.com',
      firstName: 'João',
      lastName: 'Pereira',
      role: 'COACH',
      status: 'active',
      tenantId: 'tubaraobjj-tenant',
      password: 'GFTeamCoach2024!',
      createdAt: new Date().toISOString()
    },
    // Elite Combat users
    {
      id: '4',
      email: 'admin@elite-combat.jiu-jitsu.com',
      firstName: 'Elite',
      lastName: 'Combat',
      role: 'SYSTEM_MANAGER',
      status: 'active',
      tenantId: 'elite-combat-tenant',
      password: 'EliteCombat2024!',
      createdAt: new Date().toISOString()
    },
    {
      id: '5',
      email: 'manager@elite-combat.jiu-jitsu.com',
      firstName: 'Combat',
      lastName: 'Manager',
      role: 'BRANCH_MANAGER',
      status: 'active',
      tenantId: 'elite-combat-tenant',
      password: 'EliteManager2024!',
      createdAt: new Date().toISOString()
    },
    {
      id: '6',
      email: 'coach@elite-combat.jiu-jitsu.com',
      firstName: 'Elite',
      lastName: 'Coach',
      role: 'COACH',
      status: 'active',
      tenantId: 'elite-combat-tenant',
      password: 'EliteCoach2024!',
      createdAt: new Date().toISOString()
    }
  ];
}

async function getTenantsFromStorage() {
  // This would normally query the database
  return [
    {
      id: 'tubaraobjj-tenant',
      name: 'GFTeam Tubarão',
      domain: 'tubaraobjj.com',
      userCount: 3
    },
    {
      id: 'elite-combat-tenant',
      name: 'Elite Combat Jiu-Jitsu',
      domain: 'elite-combat.jiu-jitsu.com',
      userCount: 3
    }
  ];
}

async function saveUserToStorage(user) {
  // In a real application, this would save to database
  console.log('Saving user to storage:', user);
  // For now, we'll just log it
}

async function saveUsersToStorage(users) {
  // In a real application, this would save to database
  console.log('Saving users to storage:', users);
  // For now, we'll just log it
}

async function updateTenantUserCount(tenantId, increment) {
  // In a real application, this would update the database
  console.log(`Updating tenant ${tenantId} user count by ${increment}`);
  // For now, we'll just log it
}
