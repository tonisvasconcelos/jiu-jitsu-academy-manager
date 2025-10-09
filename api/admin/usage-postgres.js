import { testConnection } from '../shared/postgresDatabase.js';

export default async function handler(req, res) {
  // Force redeployment - Usage Tracking v1
  console.log('PostgreSQL Usage Tracking API called:', req.method, req.body);

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
    // Test database connection
    await testConnection();

    switch (req.method) {
      case 'GET':
        return await handleGetUsage(req, res);
      case 'POST':
        return await handleCheckUsage(req, res);
      default:
        return res.status(405).json({ 
          success: false, 
          error: 'Method not allowed' 
        });
    }
  } catch (error) {
    console.error('Usage Tracking error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
}

// Get usage statistics for a tenant
async function handleGetUsage(req, res) {
  try {
    const { tenantId } = req.query;
    
    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'Tenant ID is required'
      });
    }

    const db = (await import('../shared/postgresDatabase.js')).default;

    // Get tenant and its limits
    const tenant = await db.oneOrNone('SELECT * FROM tenants WHERE id = $1', [tenantId]);
    if (!tenant) {
      return res.status(404).json({
        success: false,
        error: 'Tenant not found'
      });
    }

    const limits = tenant.license_limits || {};

    // Get current usage counts
    const usage = await db.task(async (t) => {
      const [
        studentsCount,
        coachesCount,
        branchesCount,
        classesCount,
        championshipsCount,
        weightDivisionsCount,
        fightModalitiesCount,
        affiliationsCount
      ] = await Promise.all([
        t.one('SELECT COUNT(*) as count FROM students WHERE tenant_id = $1', [tenantId]),
        t.one('SELECT COUNT(*) as count FROM users WHERE tenant_id = $1 AND role = $2', [tenantId, 'coach']),
        t.one('SELECT COUNT(*) as count FROM branches WHERE tenant_id = $1', [tenantId]),
        t.one('SELECT COUNT(*) as count FROM classes WHERE tenant_id = $1', [tenantId]),
        t.one('SELECT COUNT(*) as count FROM championships WHERE tenant_id = $1', [tenantId]),
        t.one('SELECT COUNT(*) as count FROM weight_divisions WHERE tenant_id = $1', [tenantId]),
        t.one('SELECT COUNT(*) as count FROM fight_modalities WHERE tenant_id = $1', [tenantId]),
        t.one('SELECT COUNT(*) as count FROM affiliations WHERE tenant_id = $1', [tenantId])
      ]);

      return {
        students: parseInt(studentsCount.count),
        coaches: parseInt(coachesCount.count),
        branches: parseInt(branchesCount.count),
        classes: parseInt(classesCount.count),
        championships: parseInt(championshipsCount.count),
        weight_divisions: parseInt(weightDivisionsCount.count),
        fight_modalities: parseInt(fightModalitiesCount.count),
        affiliations: parseInt(affiliationsCount.count)
      };
    });

    // Calculate usage percentages and check limits
    const usageStats = Object.keys(limits).map(key => {
      const current = usage[key] || 0;
      const limit = limits[key];
      const isUnlimited = limit === -1;
      const percentage = isUnlimited ? 0 : Math.round((current / limit) * 100);
      const isOverLimit = !isUnlimited && current > limit;
      const remaining = isUnlimited ? -1 : Math.max(0, limit - current);

      return {
        type: key,
        current,
        limit: isUnlimited ? 'Unlimited' : limit,
        remaining,
        percentage,
        isOverLimit,
        isUnlimited
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        tenant: {
          id: tenant.id,
          name: tenant.name,
          domain: tenant.domain,
          plan: tenant.plan
        },
        limits,
        usage,
        usageStats,
        summary: {
          totalItems: Object.values(usage).reduce((sum, count) => sum + count, 0),
          overLimitItems: usageStats.filter(item => item.isOverLimit).length,
          nearLimitItems: usageStats.filter(item => !item.isUnlimited && item.percentage >= 80).length
        }
      }
    });

  } catch (error) {
    console.error('Error getting usage:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve usage statistics',
      details: error.message
    });
  }
}

// Check if a specific operation is allowed (for validation before creating records)
async function handleCheckUsage(req, res) {
  try {
    const { tenantId, operation, itemType } = req.body;
    
    if (!tenantId || !operation || !itemType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: tenantId, operation, itemType'
      });
    }

    const db = (await import('../shared/postgresDatabase.js')).default;

    // Get tenant limits
    const tenant = await db.oneOrNone('SELECT license_limits FROM tenants WHERE id = $1', [tenantId]);
    if (!tenant) {
      return res.status(404).json({
        success: false,
        error: 'Tenant not found'
      });
    }

    const limits = tenant.license_limits || {};
    const limit = limits[itemType];

    // If unlimited, always allow
    if (limit === -1) {
      return res.status(200).json({
        success: true,
        allowed: true,
        reason: 'Unlimited plan'
      });
    }

    // Get current count for the item type
    let currentCount = 0;
    switch (itemType) {
      case 'students':
        const studentsResult = await db.one('SELECT COUNT(*) as count FROM students WHERE tenant_id = $1', [tenantId]);
        currentCount = parseInt(studentsResult.count);
        break;
      case 'coaches':
        const coachesResult = await db.one('SELECT COUNT(*) as count FROM users WHERE tenant_id = $1 AND role = $2', [tenantId, 'coach']);
        currentCount = parseInt(coachesResult.count);
        break;
      case 'branches':
        const branchesResult = await db.one('SELECT COUNT(*) as count FROM branches WHERE tenant_id = $1', [tenantId]);
        currentCount = parseInt(branchesResult.count);
        break;
      case 'classes':
        const classesResult = await db.one('SELECT COUNT(*) as count FROM classes WHERE tenant_id = $1', [tenantId]);
        currentCount = parseInt(classesResult.count);
        break;
      case 'championships':
        const championshipsResult = await db.one('SELECT COUNT(*) as count FROM championships WHERE tenant_id = $1', [tenantId]);
        currentCount = parseInt(championshipsResult.count);
        break;
      case 'weight_divisions':
        const weightDivisionsResult = await db.one('SELECT COUNT(*) as count FROM weight_divisions WHERE tenant_id = $1', [tenantId]);
        currentCount = parseInt(weightDivisionsResult.count);
        break;
      case 'fight_modalities':
        const fightModalitiesResult = await db.one('SELECT COUNT(*) as count FROM fight_modalities WHERE tenant_id = $1', [tenantId]);
        currentCount = parseInt(fightModalitiesResult.count);
        break;
      case 'affiliations':
        const affiliationsResult = await db.one('SELECT COUNT(*) as count FROM affiliations WHERE tenant_id = $1', [tenantId]);
        currentCount = parseInt(affiliationsResult.count);
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid item type'
        });
    }

    const allowed = currentCount < limit;
    const remaining = Math.max(0, limit - currentCount);

    return res.status(200).json({
      success: true,
      allowed,
      current: currentCount,
      limit,
      remaining,
      reason: allowed ? 'Within limits' : `Limit exceeded. Current: ${currentCount}, Limit: ${limit}`
    });

  } catch (error) {
    console.error('Error checking usage:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to check usage',
      details: error.message
    });
  }
}
