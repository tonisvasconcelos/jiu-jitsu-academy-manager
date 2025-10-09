import { db } from '../shared/postgresDatabase.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🔧 Starting RLS policy fix...');

    // 1. Check current RLS status
    const currentRlsStatus = await db.one(`
      SELECT rowsecurity as rls_enabled
      FROM pg_tables 
      WHERE schemaname = 'public' AND tablename = 'tenants'
    `);

    console.log('📊 Current RLS status:', currentRlsStatus);

    // 2. Get current policies
    const currentPolicies = await db.any(`
      SELECT policyname, permissive, roles, cmd, qual
      FROM pg_policies 
      WHERE schemaname = 'public' AND tablename = 'tenants'
    `);

    console.log('📋 Current policies:', currentPolicies);

    // 3. Option 1: Temporarily disable RLS (for immediate fix)
    if (currentRlsStatus.rls_enabled) {
      console.log('🔧 Disabling RLS on tenants table...');
      await db.none('ALTER TABLE public.tenants DISABLE ROW LEVEL SECURITY');
      console.log('✅ RLS disabled successfully');
    }

    // 4. Test tenant lookup after RLS fix
    const testTenant = await db.oneOrNone(`
      SELECT id, domain, name, is_active 
      FROM public.tenants 
      WHERE lower(trim(domain)) = lower(trim($1))
    `, ['gbbrrj01']);

    console.log('🧪 Test tenant lookup result:', testTenant ? 'SUCCESS' : 'FAILED');

    // 5. Get updated RLS status
    const updatedRlsStatus = await db.one(`
      SELECT rowsecurity as rls_enabled
      FROM pg_tables 
      WHERE schemaname = 'public' AND tablename = 'tenants'
    `);

    return res.status(200).json({
      success: true,
      message: 'RLS policy fix completed',
      results: {
        before: {
          rlsEnabled: currentRlsStatus.rls_enabled,
          policies: currentPolicies
        },
        after: {
          rlsEnabled: updatedRlsStatus.rls_enabled,
          testLookup: testTenant ? 'SUCCESS' : 'FAILED'
        }
      }
    });

  } catch (error) {
    console.error('❌ RLS policy fix failed:', error);
    
    return res.status(500).json({
      success: false,
      error: 'RLS policy fix failed',
      details: error.message
    });
  }
}
