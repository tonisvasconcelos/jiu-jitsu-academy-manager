// Shared data service for managing tenants and users
// This simulates a database in a real application

// Use a more persistent approach for serverless functions
// In production, this would be a real database like PostgreSQL, MongoDB, etc.

// Create a simple in-memory store that can be shared across function invocations
// This is a workaround for serverless stateless nature
const createDataStore = () => {
  if (!global.oss365DataStore) {
    global.oss365DataStore = {
      tenants: [],
      users: [],
      initialized: false
    };
  }
  return global.oss365DataStore;
};

// Initialize with hardcoded data
let tenants = [
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
  }
];

let users = [
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
  }
];

// Initialize data store
const dataStore = createDataStore();

// Initialize with hardcoded data if not already initialized
if (!dataStore.initialized) {
  dataStore.tenants = [...tenants];
  dataStore.users = [...users];
  dataStore.initialized = true;
  console.log('Data store initialized with', dataStore.tenants.length, 'tenants and', dataStore.users.length, 'users');
}

// Tenant operations
export const tenantService = {
  // Get all tenants
  getAll: () => {
    return [...dataStore.tenants];
  },

  // Get tenant by ID
  getById: (id) => {
    console.log('Looking for tenant ID:', id);
    console.log('Available tenant IDs:', dataStore.tenants.map(t => t.id));
    const found = dataStore.tenants.find(tenant => tenant.id === id);
    console.log('Found tenant:', found ? found.name : 'NOT FOUND');
    return found;
  },

  // Get tenant by domain
  getByDomain: (domain) => {
    return dataStore.tenants.find(tenant => tenant.domain === domain);
  },

  // Create new tenant
  create: (tenantData) => {
    const newTenant = {
      id: `tenant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...tenantData,
      createdAt: new Date().toISOString(),
      userCount: 0
    };
    
    console.log('Creating new tenant:', newTenant);
    dataStore.tenants.push(newTenant);
    console.log('Total tenants after creation:', dataStore.tenants.length);
    console.log('All tenant IDs:', dataStore.tenants.map(t => t.id));
    return newTenant;
  },

  // Update tenant
  update: (id, updateData) => {
    const index = dataStore.tenants.findIndex(tenant => tenant.id === id);
    if (index === -1) {
      return null;
    }
    
    dataStore.tenants[index] = {
      ...dataStore.tenants[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    return dataStore.tenants[index];
  },

  // Delete tenant
  delete: (id) => {
    const index = dataStore.tenants.findIndex(tenant => tenant.id === id);
    if (index === -1) {
      return false;
    }
    
    dataStore.tenants.splice(index, 1);
    return true;
  },

  // Update user count
  updateUserCount: (tenantId, increment) => {
    const tenant = dataStore.tenants.find(t => t.id === tenantId);
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
  getAll: () => {
    return [...dataStore.users];
  },

  // Get user by ID
  getById: (id) => {
    return dataStore.users.find(user => user.id === id);
  },

  // Get user by email
  getByEmail: (email) => {
    return dataStore.users.find(user => user.email === email);
  },

  // Get users by tenant
  getByTenant: (tenantId) => {
    return dataStore.users.filter(user => user.tenantId === tenantId);
  },

  // Create new user
  create: (userData) => {
    const newUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...userData,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    
    dataStore.users.push(newUser);
    
    // Update tenant user count
    tenantService.updateUserCount(userData.tenantId, 1);
    
    return newUser;
  },

  // Create multiple users
  createBulk: (usersData) => {
    const createdUsers = [];
    
    for (const userData of usersData) {
      const newUser = userService.create(userData);
      createdUsers.push(newUser);
    }
    
    return createdUsers;
  },

  // Update user
  update: (id, updateData) => {
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
  delete: (id) => {
    const index = users.findIndex(user => user.id === id);
    if (index === -1) {
      return false;
    }
    
    const user = users[index];
    users.splice(index, 1);
    
    // Update tenant user count
    tenantService.updateUserCount(user.tenantId, -1);
    
    return true;
  },

  // Authenticate user
  authenticate: (email, password, domain) => {
    // Find tenant by domain
    const tenant = tenantService.getByDomain(domain);
    if (!tenant || !tenant.isActive) {
      return { success: false, error: 'Invalid tenant domain' };
    }

    // Find user by email and tenant
    const user = users.find(u => u.email === email && u.tenantId === tenant.id);
    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }

    // Check password
    if (user.password !== password) {
      return { success: false, error: 'Invalid credentials' };
    }

    // Check user status
    if (user.status !== 'active') {
      return { success: false, error: 'User account is inactive' };
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        tenantId: user.tenantId
      },
      tenant: {
        id: tenant.id,
        name: tenant.name,
        domain: tenant.domain
      }
    };
  }
};

// Export default for easy importing
export default {
  tenantService,
  userService
};
