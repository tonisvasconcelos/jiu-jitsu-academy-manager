import { db } from '../shared/postgresDatabase.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🔍 Starting database diagnostics...');

    // 1. Basic connection info
    const connectionInfo = await db.one(`
      SELECT 
        current_database() as database,
        current_user as user,
        current_schema() as schema,
        current_setting('search_path') as search_path
    `);

    // 2. Check if tenants table exists and get schema info
    const tableInfo = await db.oneOrNone(`
      SELECT 
        schemaname,
        tablename,
        rowsecurity as rls_enabled
      FROM pg_tables 
      WHERE tablename = 'tenants'
    `);

    // 3. Get RLS policies on tenants table
    const rlsPolicies = await db.any(`
      SELECT 
        policyname,
        permissive,
        roles,
        cmd,
        qual,
        with_check
      FROM pg_policies 
      WHERE tablename = 'tenants'
    `);

    // 4. Count total rows in tenants table
    const rowCount = await db.one(`
      SELECT COUNT(*) as total_rows 
      FROM public.tenants
    `);

    // 5. Test tenant lookup with exact domain
    const testTenant = await db.oneOrNone(`
      SELECT id, domain, name, is_active 
      FROM public.tenants 
      WHERE domain = $1
    `, ['gbbrrj01']);

    // 6. Test with normalized comparison
    const normalizedTenant = await db.oneOrNone(`
      SELECT id, domain, name, is_active 
      FROM public.tenants 
      WHERE lower(trim(domain)) = lower(trim($1))
    `, ['gbbrrj01']);

    // 7. Get all tenants for comparison
    const allTenants = await db.any(`
      SELECT id, domain, name, is_active 
      FROM public.tenants 
      ORDER BY domain
    `);

    const diagnostics = {
      timestamp: new Date().toISOString(),
      connection: connectionInfo,
      tableInfo: tableInfo || { error: 'tenants table not found' },
      rlsPolicies: rlsPolicies,
      rowCount: rowCount.total_rows,
      testLookup: {
        exact: testTenant,
        normalized: normalizedTenant
      },
      allTenants: allTenants,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV,
        dbHost: process.env.DB_HOST ? 'set' : 'not set',
        dbName: process.env.DB_NAME ? 'set' : 'not set'
      }
    };

    console.log('📊 Database diagnostics completed:', JSON.stringify(diagnostics, null, 2));

    return res.status(200).json({
      success: true,
      diagnostics
    });

  } catch (error) {
    console.error('❌ Database diagnostics failed:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Database diagnostics failed',
      details: error.message,
      stack: error.stack
    });
  }
}
