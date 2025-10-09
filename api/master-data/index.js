// Generic master data API service
// Handles CRUD operations for all master data types (students, teachers, branches, etc.)

// In-memory storage for all master data (in a real app, this would be a database)
const masterDataStorage = {
  students: [],
  teachers: [],
  branches: [],
  fightModalities: [],
  weightDivisions: [],
  classSchedules: [],
  championships: [],
  championshipCategories: [],
  championshipRegistrations: [],
  championshipResults: [],
  championshipOfficials: [],
  championshipSponsors: [],
  championshipQualifiedLocations: [],
  fightAssociations: [],
  fightTeams: [],
  fightPhases: [],
  fights: [],
  affiliations: [],
  studentModalities: [],
  branchFacilities: [],
  classCheckIns: []
};

// Initialize with sample data
function initializeMasterData() {
  // Sample students
  if (masterDataStorage.students.length === 0) {
    masterDataStorage.students = [
      {
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
      }
    ];
  }

  // Sample teachers
  if (masterDataStorage.teachers.length === 0) {
    masterDataStorage.teachers = [
      {
        id: 'teacher_1',
        tenantId: 'tubaraobjj-tenant',
        teacherId: 'TCH001',
        firstName: 'Márcio',
        lastName: 'Tubarão',
        displayName: 'Márcio Tubarão',
        email: 'marcio@tubaraobjj.com',
        phone: '21973668820',
        branchId: 'main-branch',
        active: true,
        specialization: 'Brazilian Jiu-Jitsu',
        beltLevel: 'black',
        yearsExperience: 15,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }

  // Sample branches
  if (masterDataStorage.branches.length === 0) {
    masterDataStorage.branches = [
      {
        id: 'branch_1',
        tenantId: 'tubaraobjj-tenant',
        name: 'Main Branch - São Paulo',
        address: 'R. Teodoro da Silva, 725 - Vila Isabel, Rio de Janeiro - RJ, 20560-060',
        city: 'Rio de Janeiro',
        state: 'RJ',
        country: 'Brazil',
        postalCode: '20560-060',
        phone: '+55 21 97366-8820',
        email: 'marciotubaraobjj@gmail.com',
        managerId: 'teacher_1',
        active: true,
        capacity: 100,
        facilities: ['Mats', 'Changing Rooms', 'Showers'],
        coordinates: { latitude: -22.9068, longitude: -43.1729 },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }

  // Sample fight modalities
  if (masterDataStorage.fightModalities.length === 0) {
    masterDataStorage.fightModalities = [
      {
        id: 'modality_1',
        tenantId: 'tubaraobjj-tenant',
        name: 'Brazilian Jiu-Jitsu',
        description: 'Brazilian Jiu-Jitsu training and competition',
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }

  // Sample weight divisions
  if (masterDataStorage.weightDivisions.length === 0) {
    masterDataStorage.weightDivisions = [
      {
        id: 'weight_1',
        tenantId: 'tubaraobjj-tenant',
        name: 'Ultra Heavy',
        minWeight: 100,
        maxWeight: null,
        gender: 'male',
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }
}

// Generic master data service
export const masterDataService = {
  // Get all items for a tenant
  getByTenant: async (dataType, tenantId) => {
    initializeMasterData();
    return masterDataStorage[dataType]?.filter(item => item.tenantId === tenantId) || [];
  },

  // Get item by ID
  getById: async (dataType, id) => {
    initializeMasterData();
    return masterDataStorage[dataType]?.find(item => item.id === id);
  },

  // Create new item
  create: async (dataType, itemData) => {
    initializeMasterData();
    
    if (!masterDataStorage[dataType]) {
      masterDataStorage[dataType] = [];
    }
    
    const newItem = {
      id: `${dataType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...itemData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    masterDataStorage[dataType].push(newItem);
    console.log(`Created new ${dataType}:`, newItem.name || newItem.firstName || newItem.id, 'for tenant:', itemData.tenantId);
    return newItem;
  },

  // Update item
  update: async (dataType, id, updateData) => {
    initializeMasterData();
    
    if (!masterDataStorage[dataType]) {
      return null;
    }
    
    const index = masterDataStorage[dataType].findIndex(item => item.id === id);
    if (index === -1) {
      return null;
    }

    masterDataStorage[dataType][index] = {
      ...masterDataStorage[dataType][index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return masterDataStorage[dataType][index];
  },

  // Delete item
  delete: async (dataType, id) => {
    initializeMasterData();
    
    if (!masterDataStorage[dataType]) {
      return false;
    }
    
    const index = masterDataStorage[dataType].findIndex(item => item.id === id);
    if (index === -1) {
      return false;
    }

    masterDataStorage[dataType].splice(index, 1);
    return true;
  }
};

// API endpoint for master data management
export default async function handler(req, res) {
  console.log('Master Data API called:', req.method, req.body);
  
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
    // Extract tenant ID from token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    const token = authHeader.substring(7);
    let decodedToken;
    try {
      decodedToken = JSON.parse(Buffer.from(token, 'base64').toString());
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    const tenantId = decodedToken.tenantId;
    if (!tenantId) {
      return res.status(401).json({ error: 'Tenant ID not found in token' });
    }

    // Get data type from query parameter
    const { dataType } = req.query;
    if (!dataType) {
      return res.status(400).json({ error: 'Data type is required' });
    }

    // Validate data type
    const validDataTypes = Object.keys(masterDataStorage);
    if (!validDataTypes.includes(dataType)) {
      return res.status(400).json({ error: `Invalid data type. Valid types: ${validDataTypes.join(', ')}` });
    }

    switch (req.method) {
      case 'GET':
        return await getMasterData(req, res, dataType, tenantId);
      case 'POST':
        return await createMasterData(req, res, dataType, tenantId);
      case 'PUT':
        return await updateMasterData(req, res, dataType, tenantId);
      case 'DELETE':
        return await deleteMasterData(req, res, dataType, tenantId);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Master Data API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get all items for a tenant
async function getMasterData(req, res, dataType, tenantId) {
  try {
    const items = await masterDataService.getByTenant(dataType, tenantId);
    console.log(`Retrieved ${items.length} ${dataType} for tenant ${tenantId}`);
    
    res.status(200).json({
      success: true,
      data: items,
      count: items.length
    });
  } catch (error) {
    console.error(`Error getting ${dataType}:`, error);
    res.status(500).json({ error: `Failed to retrieve ${dataType}` });
  }
}

// Create new item
async function createMasterData(req, res, dataType, tenantId) {
  try {
    const itemData = {
      ...req.body,
      tenantId: tenantId
    };

    const newItem = await masterDataService.create(dataType, itemData);
    console.log(`Created ${dataType}:`, newItem.name || newItem.firstName || newItem.id);
    
    res.status(201).json({
      success: true,
      data: newItem,
      message: `${dataType} created successfully`
    });
  } catch (error) {
    console.error(`Error creating ${dataType}:`, error);
    res.status(500).json({ error: `Failed to create ${dataType}` });
  }
}

// Update item
async function updateMasterData(req, res, dataType, tenantId) {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

    const updateData = req.body;
    const updatedItem = await masterDataService.update(dataType, id, updateData);
    
    if (!updatedItem) {
      return res.status(404).json({ error: `${dataType} not found` });
    }

    console.log(`Updated ${dataType}:`, updatedItem.name || updatedItem.firstName || updatedItem.id);
    
    res.status(200).json({
      success: true,
      data: updatedItem,
      message: `${dataType} updated successfully`
    });
  } catch (error) {
    console.error(`Error updating ${dataType}:`, error);
    res.status(500).json({ error: `Failed to update ${dataType}` });
  }
}

// Delete item
async function deleteMasterData(req, res, dataType, tenantId) {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

    const deleted = await masterDataService.delete(dataType, id);
    
    if (!deleted) {
      return res.status(404).json({ error: `${dataType} not found` });
    }

    console.log(`Deleted ${dataType} with ID:`, id);
    
    res.status(200).json({
      success: true,
      message: `${dataType} deleted successfully`
    });
  } catch (error) {
    console.error(`Error deleting ${dataType}:`, error);
    res.status(500).json({ error: `Failed to delete ${dataType}` });
  }
}
