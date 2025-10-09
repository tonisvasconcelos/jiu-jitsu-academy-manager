// Import hybrid database service
import { userService, tenantService } from '../shared/hybridDatabase.js';

// In-memory storage for students (in a real app, this would be a database)
let students = [];

// Initialize with some sample data
function initializeStudents() {
  if (students.length === 0) {
    // Add some sample students for different tenants
    students = [
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
}

// Student operations
export const studentService = {
  // Get all students for a tenant
  getByTenant: async (tenantId) => {
    initializeStudents();
    return students.filter(student => student.tenantId === tenantId);
  },

  // Get student by ID
  getById: async (id) => {
    initializeStudents();
    return students.find(student => student.id === id);
  },

  // Create new student
  create: async (studentData) => {
    initializeStudents();
    
    const newStudent = {
      id: `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...studentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    students.push(newStudent);
    console.log('Created new student:', newStudent.firstName, newStudent.lastName, 'for tenant:', studentData.tenantId);
    return newStudent;
  },

  // Update student
  update: async (id, updateData) => {
    initializeStudents();
    
    const index = students.findIndex(student => student.id === id);
    if (index === -1) {
      return null;
    }

    students[index] = {
      ...students[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return students[index];
  },

  // Delete student
  delete: async (id) => {
    initializeStudents();
    
    const index = students.findIndex(student => student.id === id);
    if (index === -1) {
      return false;
    }

    students.splice(index, 1);
    return true;
  }
};

// API endpoint for student management (CRUD operations)
export default async function handler(req, res) {
  console.log('Students API called:', req.method, req.body);
  
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

    switch (req.method) {
      case 'GET':
        return await getStudents(req, res, tenantId);
      case 'POST':
        return await createStudent(req, res, tenantId);
      case 'PUT':
        return await updateStudent(req, res, tenantId);
      case 'DELETE':
        return await deleteStudent(req, res, tenantId);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Students API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get all students for a tenant
async function getStudents(req, res, tenantId) {
  try {
    const students = await studentService.getByTenant(tenantId);
    console.log(`Retrieved ${students.length} students for tenant ${tenantId}`);
    
    res.status(200).json({
      success: true,
      data: students,
      count: students.length
    });
  } catch (error) {
    console.error('Error getting students:', error);
    res.status(500).json({ error: 'Failed to retrieve students' });
  }
}

// Create new student
async function createStudent(req, res, tenantId) {
  try {
    const studentData = {
      ...req.body,
      tenantId: tenantId
    };

    const newStudent = await studentService.create(studentData);
    console.log('Created student:', newStudent.firstName, newStudent.lastName);
    
    res.status(201).json({
      success: true,
      data: newStudent,
      message: 'Student created successfully'
    });
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ error: 'Failed to create student' });
  }
}

// Update student
async function updateStudent(req, res, tenantId) {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'Student ID is required' });
    }

    const updateData = req.body;
    const updatedStudent = await studentService.update(id, updateData);
    
    if (!updatedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }

    console.log('Updated student:', updatedStudent.firstName, updatedStudent.lastName);
    
    res.status(200).json({
      success: true,
      data: updatedStudent,
      message: 'Student updated successfully'
    });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'Failed to update student' });
  }
}

// Delete student
async function deleteStudent(req, res, tenantId) {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'Student ID is required' });
    }

    const deleted = await studentService.delete(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Student not found' });
    }

    console.log('Deleted student with ID:', id);
    
    res.status(200).json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
}
