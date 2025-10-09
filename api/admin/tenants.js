// Import hybrid database service
import { tenantService } from '../shared/hybridDatabase.js';

// API endpoint for tenant management (CRUD operations)
export default async function handler(req, res) {
  console.log('Tenants API called:', req.method, req.body);
  
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
        return await getTenants(req, res);
      case 'POST':
        return await createTenant(req, res);
      case 'PUT':
        return await updateTenant(req, res);
      case 'DELETE':
        return await deleteTenant(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Tenants API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get all tenants
async function getTenants(req, res) {
  try {
    const allTenants = await tenantService.getAll();

    res.status(200).json({
      success: true,
      data: allTenants
    });

  } catch (error) {
    console.error('Error getting tenants:', error);
    res.status(500).json({ error: 'Failed to fetch tenants' });
  }
}

// Create a new tenant
async function createTenant(req, res) {
  try {
    const {
      name,
      domain,
      plan,
      contactEmail,
      contactPhone,
      address,
      licenseDays
    } = req.body;

    // Validate required fields
    if (!name || !domain || !contactEmail) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, domain, contactEmail' 
      });
    }

    // Check if domain already exists
    const existingTenant = await tenantService.getByDomain(domain);
    
    if (existingTenant) {
      return res.status(409).json({ 
        error: 'Domain already exists' 
      });
    }

    // Create new tenant
    const tenantData = {
      name,
      domain,
      plan: plan || 'enterprise',
      licenseStart: new Date().toISOString(),
      licenseEnd: new Date(Date.now() + (licenseDays || 365) * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
      contactEmail,
      contactPhone: contactPhone || '',
      address: address || ''
    };

    const newTenant = await tenantService.create(tenantData);

    res.status(201).json({
      success: true,
      data: newTenant,
      message: 'Tenant created successfully'
    });

  } catch (error) {
    console.error('Error creating tenant:', error);
    res.status(500).json({ error: 'Failed to create tenant' });
  }
}

// Update tenant
async function updateTenant(req, res) {
  try {
    const { id } = req.query;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Tenant ID is required' });
    }

    // In a real application, this would update the database
    const tenants = await getTenantsFromStorage();
    const tenantIndex = tenants.findIndex(t => t.id === id);
    
    if (tenantIndex === -1) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    const updatedTenant = {
      ...tenants[tenantIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    tenants[tenantIndex] = updatedTenant;
    await saveTenantsToStorage(tenants);

    res.status(200).json({
      success: true,
      data: updatedTenant,
      message: 'Tenant updated successfully'
    });

  } catch (error) {
    console.error('Error updating tenant:', error);
    res.status(500).json({ error: 'Failed to update tenant' });
  }
}

// Delete tenant
async function deleteTenant(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Tenant ID is required' });
    }

    // In a real application, this would delete from database
    const tenants = await getTenantsFromStorage();
    const filteredTenants = tenants.filter(t => t.id !== id);
    
    if (tenants.length === filteredTenants.length) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    await saveTenantsToStorage(filteredTenants);

    res.status(200).json({
      success: true,
      message: 'Tenant deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting tenant:', error);
    res.status(500).json({ error: 'Failed to delete tenant' });
  }
}

// Helper functions for data storage
async function getTenantsFromStorage() {
  // In a real application, this would query the database
  // For this mock setup, we'll return hardcoded data
  return [
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
}

async function saveTenantToStorage(tenant) {
  // In a real application, this would save to database
  console.log('Saving tenant to storage:', tenant);
  // For now, we'll just log it
}

async function saveTenantsToStorage(tenants) {
  // In a real application, this would save to database
  console.log('Saving tenants to storage:', tenants);
  // For now, we'll just log it
}