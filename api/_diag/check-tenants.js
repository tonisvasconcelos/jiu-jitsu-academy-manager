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

  try {
    console.log('🔍 Diagnostic: Checking all tenants in database');
    
    // Test database connection
    await testConnection();
    console.log('✅ Database connection successful');

    // Get all tenants
    const tenants = await db.any(`
      SELECT 
        id, 
        domain, 
        name, 
        is_active, 
        plan,
        created_at,
        license_start,
        license_end
      FROM public.tenants 
      ORDER BY created_at DESC
    `);

    console.log('🔍 Found tenants:', tenants.length);
    tenants.forEach((tenant, index) => {
      console.log(`  ${index + 1}. ID: ${tenant.id}, Domain: "${tenant.domain}", Name: "${tenant.name}", Active: ${tenant.is_active}`);
    });

    // Get all users
    const users = await db.any(`
      SELECT 
        u.id,
        u.email,
        u.first_name,
        u.last_name,
        u.role,
        u.status,
        u.tenant_id,
        t.domain as tenant_domain
      FROM public.users u
      JOIN public.tenants t ON u.tenant_id = t.id
      ORDER BY u.created_at DESC
    `);

    console.log('🔍 Found users:', users.length);
    users.forEach((user, index) => {
      console.log(`  ${index + 1}. Email: "${user.email}", Name: "${user.first_name} ${user.last_name}", Role: ${user.role}, Tenant: "${user.tenant_domain}"`);
    });

    return res.status(200).json({
      success: true,
      message: 'Database diagnostic completed',
      data: {
        tenants: tenants,
        users: users,
        summary: {
          totalTenants: tenants.length,
          totalUsers: users.length,
          activeTenants: tenants.filter(t => t.is_active).length
        }
      }
    });

  } catch (error) {
    console.error('❌ Diagnostic error:', error);
    return res.status(500).json({
      success: false,
      error: 'Diagnostic failed',
      details: error.message
    });
  }
}
