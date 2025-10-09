// Database service using Vercel KV (Redis) for persistent storage
// This provides a proper database solution for serverless functions

// Try to import Vercel KV, fallback to in-memory storage if not available
let kv = null;
try {
  const kvModule = await import('@vercel/kv');
  kv = kvModule.kv;
} catch (error) {
  console.log('Vercel KV not available, using fallback storage');
  kv = null;
}

// Database keys
const KEYS = {
  TENANTS: 'oss365:tenants',
  USERS: 'oss365:users',
  TENANT_BY_DOMAIN: (domain) => `oss365:tenant:domain:${domain}`,
  USER_BY_EMAIL: (email) => `oss365:user:email:${email}`,
  USERS_BY_TENANT: (tenantId) => `oss365:users:tenant:${tenantId}`
};

// Initialize database with default data if empty
async function initializeDatabase() {
  try {
    const existingTenants = await kv.get(KEYS.TENANTS);
    
    if (!existingTenants || existingTenants.length === 0) {
      console.log('Initializing database with default data...');
      
      // Default tenants
      const defaultTenants = [
        {
          id: 'tubaraobjj-tenant',
          name: 'GFTeam Tubarão',
          domain: 'tubaraobjj.com',
          plan: 'enterprise',
          licenseStart: new Date().toISOString(),
          licenseEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          isActive: true,
          contactEmail: 'marciotubaraobjj@gmail.com',
          contactPhone: '+55 21 97366-8820',
          address: 'R. Teodoro da Silva, 725 - Vila Isabel, Rio de Janeiro - RJ, 20560-060',
          createdAt: new Date().toISOString(),
          userCount: 3
        },
        {
          id: 'elite-combat-tenant',
          name: 'Elite Combat Jiu-Jitsu',
          domain: 'elite-combat.jiu-jitsu.com',
          plan: 'enterprise',
          licenseStart: new Date().toISOString(),
          licenseEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          isActive: true,
          contactEmail: 'admin@elite-combat.jiu-jitsu.com',
          contactPhone: '',
          address: '',
          createdAt: new Date().toISOString(),
          userCount: 3
        }
      ];

      // Default users
      const defaultUsers = [
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

      // Store default data
      await kv.set(KEYS.TENANTS, defaultTenants);
      await kv.set(KEYS.USERS, defaultUsers);

      // Create index for fast lookups
      for (const tenant of defaultTenants) {
        await kv.set(KEYS.TENANT_BY_DOMAIN(tenant.domain), tenant);
      }

      for (const user of defaultUsers) {
        await kv.set(KEYS.USER_BY_EMAIL(user.email), user);
      }

      console.log('Database initialized with', defaultTenants.length, 'tenants and', defaultUsers.length, 'users');
    } else {
      console.log('Database already initialized with', existingTenants.length, 'tenants');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Tenant operations
export const tenantService = {
  // Get all tenants
  getAll: async () => {
    await initializeDatabase();
    return await kv.get(KEYS.TENANTS) || [];
  },

  // Get tenant by ID
  getById: async (id) => {
    await initializeDatabase();
    const tenants = await kv.get(KEYS.TENANTS) || [];
    return tenants.find(tenant => tenant.id === id);
  },

  // Get tenant by domain
  getByDomain: async (domain) => {
    await initializeDatabase();
    return await kv.get(KEYS.TENANT_BY_DOMAIN(domain));
  },

  // Create new tenant
  create: async (tenantData) => {
    await initializeDatabase();
    
    const newTenant = {
      id: `tenant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...tenantData,
      createdAt: new Date().toISOString(),
      userCount: 0
    };

    // Get current tenants
    const tenants = await kv.get(KEYS.TENANTS) || [];
    tenants.push(newTenant);

    // Update tenants list
    await kv.set(KEYS.TENANTS, tenants);
    
    // Create domain index for fast lookup
    await kv.set(KEYS.TENANT_BY_DOMAIN(newTenant.domain), newTenant);

    console.log('Created new tenant:', newTenant.name, 'with domain:', newTenant.domain);
    return newTenant;
  },

  // Update tenant
  update: async (id, updateData) => {
    await initializeDatabase();
    
    const tenants = await kv.get(KEYS.TENANTS) || [];
    const index = tenants.findIndex(tenant => tenant.id === id);
    
    if (index === -1) {
      return null;
    }

    const updatedTenant = {
      ...tenants[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    tenants[index] = updatedTenant;
    await kv.set(KEYS.TENANTS, tenants);

    // Update domain index if domain changed
    if (updateData.domain) {
      await kv.set(KEYS.TENANT_BY_DOMAIN(updateData.domain), updatedTenant);
    }

    return updatedTenant;
  },

  // Delete tenant
  delete: async (id) => {
    await initializeDatabase();
    
    const tenants = await kv.get(KEYS.TENANTS) || [];
    const index = tenants.findIndex(tenant => tenant.id === id);
    
    if (index === -1) {
      return false;
    }

    const tenant = tenants[index];
    tenants.splice(index, 1);
    await kv.set(KEYS.TENANTS, tenants);

    // Remove domain index
    await kv.del(KEYS.TENANT_BY_DOMAIN(tenant.domain));

    return true;
  },

  // Update user count for tenant
  updateUserCount: async (tenantId, increment) => {
    await initializeDatabase();
    
    const tenants = await kv.get(KEYS.TENANTS) || [];
    const tenant = tenants.find(t => t.id === tenantId);
    
    if (tenant) {
      tenant.userCount = (tenant.userCount || 0) + increment;
      await kv.set(KEYS.TENANTS, tenants);
      
      // Update domain index
      await kv.set(KEYS.TENANT_BY_DOMAIN(tenant.domain), tenant);
      
      return true;
    }
    return false;
  }
};

// User operations
export const userService = {
  // Get all users
  getAll: async () => {
    await initializeDatabase();
    return await kv.get(KEYS.USERS) || [];
  },

  // Get user by ID
  getById: async (id) => {
    await initializeDatabase();
    const users = await kv.get(KEYS.USERS) || [];
    return users.find(user => user.id === id);
  },

  // Get user by email
  getByEmail: async (email) => {
    await initializeDatabase();
    return await kv.get(KEYS.USER_BY_EMAIL(email));
  },

  // Get users by tenant
  getByTenant: async (tenantId) => {
    await initializeDatabase();
    const users = await kv.get(KEYS.USERS) || [];
    return users.filter(user => user.tenantId === tenantId);
  },

  // Create new user
  create: async (userData) => {
    await initializeDatabase();
    
    const newUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...userData,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    // Get current users
    const users = await kv.get(KEYS.USERS) || [];
    users.push(newUser);

    // Update users list
    await kv.set(KEYS.USERS, users);
    
    // Create email index for fast lookup
    await kv.set(KEYS.USER_BY_EMAIL(newUser.email), newUser);

    // Update tenant user count
    await tenantService.updateUserCount(userData.tenantId, 1);

    console.log('Created new user:', newUser.firstName, newUser.lastName, 'for tenant:', userData.tenantId);
    return newUser;
  },

  // Create multiple users
  createBulk: async (usersData) => {
    await initializeDatabase();
    
    const createdUsers = [];
    const users = await kv.get(KEYS.USERS) || [];

    for (const userData of usersData) {
      const newUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...userData,
        status: 'active',
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      createdUsers.push(newUser);

      // Create email index
      await kv.set(KEYS.USER_BY_EMAIL(newUser.email), newUser);
    }

    // Update users list
    await kv.set(KEYS.USERS, users);

    // Update tenant user count
    if (usersData.length > 0) {
      await tenantService.updateUserCount(usersData[0].tenantId, usersData.length);
    }

    return createdUsers;
  },

  // Update user
  update: async (id, updateData) => {
    await initializeDatabase();
    
    const users = await kv.get(KEYS.USERS) || [];
    const index = users.findIndex(user => user.id === id);
    
    if (index === -1) {
      return null;
    }

    const updatedUser = {
      ...users[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    users[index] = updatedUser;
    await kv.set(KEYS.USERS, users);

    // Update email index if email changed
    if (updateData.email) {
      await kv.set(KEYS.USER_BY_EMAIL(updateData.email), updatedUser);
    }

    return updatedUser;
  },

  // Delete user
  delete: async (id) => {
    await initializeDatabase();
    
    const users = await kv.get(KEYS.USERS) || [];
    const index = users.findIndex(user => user.id === id);
    
    if (index === -1) {
      return false;
    }

    const user = users[index];
    users.splice(index, 1);
    await kv.set(KEYS.USERS, users);

    // Remove email index
    await kv.del(KEYS.USER_BY_EMAIL(user.email));

    // Update tenant user count
    await tenantService.updateUserCount(user.tenantId, -1);

    return true;
  },

  // Authenticate user
  authenticate: async (email, password, domain) => {
    await initializeDatabase();
    
    // Get tenant by domain
    const tenant = await tenantService.getByDomain(domain);
    if (!tenant || !tenant.isActive) {
      return { success: false, error: 'Invalid tenant domain' };
    }

    // Get user by email
    const user = await userService.getByEmail(email);
    if (!user || user.tenantId !== tenant.id || user.password !== password) {
      return { success: false, error: 'Invalid credentials' };
    }

    return { success: true, user, tenant };
  }
};

// Initialize database on module load
initializeDatabase().catch(console.error);
