import { db, testConnection } from '../shared/postgresDatabase.js';

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

  console.log('Tenant Diagnostic API called:', req.method);

  try {
    // Test database connection
    await testConnection();

    if (req.method === 'GET') {
      return await getAllTenants(req, res);
    } else if (req.method === 'POST') {
      return await testTenantLookup(req, res);
    } else {
      res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Tenant diagnostic error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: error.message 
    });
  }
}

async function getAllTenants(req, res) {
  try {
    console.log('Getting all tenants...');
    
    // Get all tenants with their details
    const tenants = await db.any(`
      SELECT 
        id,
        name,
        domain,
        plan,
        contact_email,
        contact_phone,
        address,
        company_id,
        is_active,
        license_start,
        license_end,
        created_at,
        updated_at
      FROM tenants 
      ORDER BY created_at DESC
    `);

    console.log(`Found ${tenants.length} tenants in database`);

    res.status(200).json({
      success: true,
      message: `Found ${tenants.length} tenants`,
      data: tenants
    });
  } catch (error) {
    console.error('Error getting tenants:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get tenants',
      details: error.message
    });
  }
}

async function testTenantLookup(req, res) {
  try {
    const { domain } = req.body;
    
    if (!domain) {
      return res.status(400).json({
        success: false,
        error: 'Domain is required'
      });
    }

    console.log(`Testing tenant lookup for domain: ${domain}`);
    
    // Test exact match
    const exactMatch = await db.oneOrNone(`
      SELECT id, domain, name, is_active 
      FROM tenants 
      WHERE domain = $1
    `, [domain]);
    
    // Test normalized match
    const normalizedMatch = await db.oneOrNone(`
      SELECT id, domain, name, is_active 
      FROM tenants 
      WHERE lower(trim(domain)) = lower(trim($1))
    `, [domain]);
    
    // Get all domains for comparison
    const allDomains = await db.any('SELECT domain FROM tenants ORDER BY domain');
    
    res.status(200).json({
      success: true,
      message: 'Tenant lookup test completed',
      data: {
        inputDomain: domain,
        exactMatch: exactMatch,
        normalizedMatch: normalizedMatch,
        allDomains: allDomains.map(t => t.domain)
      }
    });
  } catch (error) {
    console.error('Error testing tenant lookup:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to test tenant lookup',
      details: error.message
    });
  }
}
