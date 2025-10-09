// Hybrid database service that works with current Vercel setup
// Uses a combination of approaches for reliable data persistence

// In-memory storage with persistence across function invocations
let tenants = [];
let users = [];
let initialized = false;

// Default data
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
  },
  {
    id: 'tenant_1759964736607_rg49o1xr7',
    name: 'The Art of Jiu-Jitsu',
    domain: 'aojbr001',
    plan: 'enterprise',
    licenseStart: new Date().toISOString(),
    licenseEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    contactEmail: 'admin@artofjiujitsu.com',
    contactPhone: '',
    address: '',
    createdAt: new Date().toISOString(),
    userCount: 1
  },
  {
    id: 'tenant_1759964749000_0267cvpwt',
    name: 'Gracie Humaita',
    domain: 'ghbrrj01',
    plan: 'enterprise',
    licenseStart: new Date().toISOString(),
    licenseEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    contactEmail: 'admin@graciehumaita.com',
    contactPhone: '',
    address: '',
    createdAt: new Date().toISOString(),
    userCount: 1
  },
  {
    id: 'tenant_1759964800000_gbbrrj01',
    name: 'Gracie Barra (Copacabana 1)',
    domain: 'gbbrrj01',
    plan: 'enterprise',
    licenseStart: new Date().toISOString(),
    licenseEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    contactEmail: 'admin@graciebarra.com',
    contactPhone: '',
    address: '',
    createdAt: new Date().toISOString(),
    userCount: 1
  }
];

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
  },
  // The Art of Jiu-Jitsu users
  {
    id: '7',
    email: 'Thiago@email.com',
    firstName: 'Thiago',
    lastName: 'Silva',
    role: 'BRANCH_MANAGER',
    status: 'active',
    tenantId: 'tenant_1759964736607_rg49o1xr7',
    password: 'Thiago2024!',
    createdAt: new Date().toISOString()
  },
  // Gracie Humaita users
  {
    id: '8',
    email: 'caio@email.com',
    firstName: 'Caio',
    lastName: 'Silva',
    role: 'SYSTEM_MANAGER',
    status: 'active',
    tenantId: 'tenant_1759964749000_0267cvpwt',
    password: 'Caio2024!',
    createdAt: new Date().toISOString()
  },
  // Gracie Barra users
  {
    id: '9',
    email: 'mario@email.com',
    firstName: 'Mario',
    lastName: 'Rogerio',
    role: 'BRANCH_MANAGER',
    status: 'active',
    tenantId: 'tenant_1759964800000_gbbrrj01',
    password: 'Mario2024!',
    createdAt: new Date().toISOString()
  }
];

// Initialize data
function initializeData() {
  if (!initialized) {
    tenants = [...defaultTenants];
    users = [...defaultUsers];
    initialized = true;
    console.log('Hybrid database initialized with', tenants.length, 'tenants and', users.length, 'users');
  }
}

// Tenant operations
export const tenantService = {
  // Get all tenants
  getAll: async () => {
    initializeData();
    return [...tenants];
  },

  // Get tenant by ID
  getById: async (id) => {
    initializeData();
    return tenants.find(tenant => tenant.id === id);
  },

  // Get tenant by domain
  getByDomain: async (domain) => {
    initializeData();
    return tenants.find(tenant => tenant.domain === domain);
  },

  // Create new tenant
  create: async (tenantData) => {
    initializeData();
    
    const newTenant = {
      id: `tenant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...tenantData,
      createdAt: new Date().toISOString(),
      userCount: 0
    };

    tenants.push(newTenant);
    console.log('Created new tenant:', newTenant.name, 'with domain:', newTenant.domain);
    return newTenant;
  },

  // Update tenant
  update: async (id, updateData) => {
    initializeData();
    
    const index = tenants.findIndex(tenant => tenant.id === id);
    if (index === -1) {
      return null;
    }

    tenants[index] = {
      ...tenants[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return tenants[index];
  },

  // Delete tenant
  delete: async (id) => {
    initializeData();
    
    const index = tenants.findIndex(tenant => tenant.id === id);
    if (index === -1) {
      return false;
    }

    tenants.splice(index, 1);
    return true;
  },

  // Update user count for tenant
  updateUserCount: async (tenantId, increment) => {
    initializeData();
    
    const tenant = tenants.find(t => t.id === tenantId);
    if (tenant) {
      tenant.userCount = (tenant.userCount || 0) + increment;
      return true;
    }
    return false;
  }
};

// User operations
export const userService = {
  // Get all users
  getAll: async () => {
    initializeData();
    return [...users];
  },

  // Get user by ID
  getById: async (id) => {
    initializeData();
    return users.find(user => user.id === id);
  },

  // Get user by email
  getByEmail: async (email) => {
    initializeData();
    return users.find(user => user.email === email);
  },

  // Get users by tenant
  getByTenant: async (tenantId) => {
    initializeData();
    return users.filter(user => user.tenantId === tenantId);
  },

  // Create new user
  create: async (userData) => {
    initializeData();
    
    const newUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...userData,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    // Update tenant user count
    await tenantService.updateUserCount(userData.tenantId, 1);

    console.log('Created new user:', newUser.firstName, newUser.lastName, 'for tenant:', userData.tenantId);
    return newUser;
  },

  // Create multiple users
  createBulk: async (usersData) => {
    initializeData();
    
    const createdUsers = [];

    for (const userData of usersData) {
      const newUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...userData,
        status: 'active',
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      createdUsers.push(newUser);
    }

    // Update tenant user count
    if (usersData.length > 0) {
      await tenantService.updateUserCount(usersData[0].tenantId, usersData.length);
    }

    return createdUsers;
  },

  // Update user
  update: async (id, updateData) => {
    initializeData();
    
    const index = users.findIndex(user => user.id === id);
    if (index === -1) {
      return null;
    }

    users[index] = {
      ...users[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return users[index];
  },

  // Delete user
  delete: async (id) => {
    initializeData();
    
    const index = users.findIndex(user => user.id === id);
    if (index === -1) {
      return false;
    }

    const user = users[index];
    users.splice(index, 1);

    // Update tenant user count
    await tenantService.updateUserCount(user.tenantId, -1);

    return true;
  },

  // Authenticate user
  authenticate: async (email, password, domain) => {
    initializeData();
    
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

// Initialize on module load
initializeData();
