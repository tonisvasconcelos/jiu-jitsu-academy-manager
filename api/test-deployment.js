export default async function handler(req, res) {
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

  res.status(200).json({
    success: true,
    message: 'New API endpoint is working',
    timestamp: new Date().toISOString(),
    method: req.method,
    testData: {
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
    }
  });
}
