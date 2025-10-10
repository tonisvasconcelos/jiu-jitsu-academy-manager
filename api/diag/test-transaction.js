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
    console.log('🧪 Testing database transaction...');
    
    // Test database connection
    await testConnection();
    console.log('✅ Database connection successful');

    // Test simple transaction
    console.log('🔄 Starting test transaction...');
    const result = await db.tx(async (t) => {
      console.log('📝 Inside transaction - creating test record...');
      
      // Try to create a simple test record
      const testRecord = await t.one(`
        INSERT INTO tenants (
          name, domain, plan, contact_email, contact_phone, address,
          license_start, license_end, is_active, settings, license_limits
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id, domain, name
      `, [
        'Test Tenant',
        'test-transaction-' + Date.now(),
        'trial',
        'test@test.com',
        null,
        null,
        new Date(),
        new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
        true,
        JSON.stringify({ test: true }),
        JSON.stringify({ students: 10 })
      ]);
      
      console.log('✅ Test record created:', { id: testRecord.id, domain: testRecord.domain });
      return testRecord;
    });

    console.log('🎉 Transaction completed successfully!');
    console.log('📤 Result:', result);

    // Verify the record was actually saved
    console.log('🔍 Verifying record was saved...');
    const verification = await db.oneOrNone(`
      SELECT id, domain, name FROM tenants WHERE domain = $1
    `, [result.domain]);

    console.log('🔍 Verification result:', verification);

    return res.status(200).json({
      success: true,
      message: 'Transaction test completed',
      data: {
        transactionResult: result,
        verification: verification,
        wasSaved: !!verification
      }
    });

  } catch (error) {
    console.error('❌ Transaction test failed:', error);
    console.error('❌ Error details:', {
      message: error.message,
      code: error.code,
      detail: error.detail,
      stack: error.stack
    });
    return res.status(500).json({
      success: false,
      error: 'Transaction test failed',
      details: error.message,
      errorCode: error.code,
      errorDetail: error.detail
    });
  }
}
