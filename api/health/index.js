import { testConnection } from '../shared/postgresDatabase.js';

export default async function handler(req, res) {
  // Force redeployment - PostgreSQL Health v1
  console.log('PostgreSQL Health API called:', req.method);

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://oss365.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    // Test database connection
    const dbResult = await testConnection();
    
    return res.status(200).json({
      success: true,
      message: 'PostgreSQL Jiu-Jitsu Academy Manager API is running',
      database: {
        connected: true,
        timestamp: dbResult.now,
        type: 'PostgreSQL (Neon)'
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('PostgreSQL Health check error:', error);
    return res.status(500).json({
      success: false,
      message: 'PostgreSQL Jiu-Jitsu Academy Manager API is running',
      database: {
        connected: false,
        error: error.message,
        type: 'PostgreSQL (Neon)'
      },
      timestamp: new Date().toISOString()
    });
  }
}
