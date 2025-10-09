// Import hybrid database service
import { userService } from '../shared/hybridDatabase.js';

export default async function handler(req, res) {
  // Force redeployment - v2
  console.log('Login API called:', req.method, req.body);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://oss365.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('OPTIONS request handled');
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

    try {
      const { domain, email, password } = req.body;
      console.log('Login attempt:', { domain, email, password: password ? '***' : 'missing' });

      if (!domain || !email || !password) {
        console.log('Missing required fields');
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Use database service for authentication
      const authResult = await userService.authenticate(email, password, domain);
      console.log('Authentication result:', authResult.success ? 'success' : 'failed');

      if (!authResult.success) {
        return res.status(401).json({ error: authResult.error });
      }

      // Generate token
      const token = Buffer.from(JSON.stringify({
        userId: authResult.user.id,
        tenantId: authResult.tenant.id,
        role: authResult.user.role,
        email: authResult.user.email
      })).toString('base64');

      // Add test data for tubaraobjj.com tenant
      let testData = {};
      if (authResult.tenant.id === 'tubaraobjj-tenant') {
        testData = {
          students: [{
            id: 'student_1',
            tenantId: 'tubaraobjj-tenant',
            studentId: 'STU001',
            firstName: 'Antonio',
            lastName: 'Vasconcelos',
            displayName: 'Antonio Vasconcelos',
            birthDate: '1989-01-01',
            gender: 'male',
            beltLevel: 'blue',
            documentId: '12345678901',
            email: 'tonisvasconcelos@hotmail.com',
            phone: '21998010725',
            branchId: 'main-branch',
            active: true,
            isKidsStudent: false,
            weight: 117,
            weightDivisionId: 'ultra-heavy',
            photoUrl: '',
            preferredLanguage: 'PTB',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }]
        };
      }

      res.status(200).json({
        success: true,
        token,
        user: authResult.user,
        tenant: authResult.tenant,
        testData
      });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
