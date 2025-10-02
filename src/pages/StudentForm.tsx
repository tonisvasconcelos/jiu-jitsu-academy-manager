import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useStudents, Student } from '../contexts/StudentContext'

const StudentForm: React.FC = () => {
  const { t } = useLanguage()
  const { action, id } = useParams<{ action: string; id?: string }>()
  const navigate = useNavigate()
  const { addStudent, updateStudent, getStudent } = useStudents()
  
  const [student, setStudent] = useState<Student>({
    studentId: '',
    firstName: '',
    lastName: '',
    displayName: '',
    birthDate: '',
    gender: 'male',
    beltLevel: 'white',
    documentId: '',
    email: '',
    phone: '',
    branchId: 'BR001',
    active: true,
    photoUrl: ''
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isReadOnly, setIsReadOnly] = useState(action === 'view')

  // Sample branches data
  const branches = [
    { id: 'BR001', name: 'Main Branch - São Paulo' },
    { id: 'BR002', name: 'Branch - Rio de Janeiro' },
    { id: 'BR003', name: 'Branch - Belo Horizonte' }
  ]

  useEffect(() => {
    if (action === 'edit' || action === 'view') {
      // Load student data from context
      const existingStudent = getStudent(id || '')
      if (existingStudent) {
        setStudent(existingStudent)
      }
    } else if (action === 'new') {
      // Generate new student ID
      setStudent(prev => ({
        ...prev,
        studentId: `STU${String(Date.now()).slice(-6)}`
      }))
    }
  }, [action, id, getStudent])

  const handleInputChange = (field: keyof Student, value: string | boolean) => {
    setStudent(prev => {
      const updated = { ...prev, [field]: value }
      
      // Auto-generate displayName
      if (field === 'firstName' || field === 'lastName') {
        updated.displayName = `${updated.firstName} ${updated.lastName}`.trim()
      }
      
      return updated
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('=== FORM SUBMISSION STARTED ===')
    console.log('Action:', action)
    console.log('Student data before submission:', student)
    
    // Check if required fields are filled
    if (!student.firstName || !student.lastName || !student.birthDate || !student.documentId || !student.email || !student.phone) {
      console.error('Missing required fields:', {
        firstName: student.firstName,
        lastName: student.lastName,
        birthDate: student.birthDate,
        documentId: student.documentId,
        email: student.email,
        phone: student.phone
      })
      alert('Please fill in all required fields')
      return
    }
    
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Form submitted with action:', action)
    console.log('Student data:', student)
    
    if (action === 'new') {
      console.log('Adding new student...')
      addStudent(student)
      console.log('Student added to context')
    } else if (action === 'edit') {
      console.log('Updating student...')
      updateStudent(student.studentId, student)
    }
    
    setIsLoading(false)
    
    // Navigate back to list
    navigate('/students/registration')
  }

  const getPageTitle = () => {
    switch (action) {
      case 'new': return 'New Student'
      case 'edit': return 'Edit Student'
      case 'view': return 'View Student'
      default: return 'Student'
    }
  }

  const getPageIcon = () => {
    switch (action) {
      case 'new': return '➕'
      case 'edit': return '✏️'
      case 'view': return '👁️'
      default: return '👤'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-3">
                {getPageIcon()} {getPageTitle()}
              </h1>
              <p className="text-lg text-gray-300">
                {action === 'new' && 'Register a new student'}
                {action === 'edit' && 'Update student information'}
                {action === 'view' && 'View student details'}
              </p>
            </div>
            <Link
              to="/students/registration"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center"
            >
              ← Back to List
            </Link>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student ID */}
              <div>
                <label htmlFor="studentId" className="block text-sm font-medium text-gray-300 mb-2">Student ID</label>
                <input
                  id="studentId"
                  name="studentId"
                  type="text"
                  value={student.studentId}
                  readOnly
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Display Name */}
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  value={student.displayName}
                  readOnly
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">First Name *</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={student.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                />
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">Last Name *</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={student.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                />
              </div>

              {/* Birth Date */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Birth Date *</label>
                <input
                  type="date"
                  value={student.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  required
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Gender *</label>
                <select
                  value={student.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  required
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Belt Level */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Belt Level *</label>
                <select
                  value={student.beltLevel}
                  onChange={(e) => handleInputChange('beltLevel', e.target.value)}
                  required
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                >
                  <option value="white">White Belt</option>
                  <option value="blue">Blue Belt</option>
                  <option value="purple">Purple Belt</option>
                  <option value="brown">Brown Belt</option>
                  <option value="black">Black Belt</option>
                </select>
              </div>

              {/* Branch */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Branch *</label>
                <select
                  value={student.branchId}
                  onChange={(e) => handleInputChange('branchId', e.target.value)}
                  required
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                >
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Contact Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Document ID */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Document ID *</label>
                <input
                  type="text"
                  value={student.documentId}
                  onChange={(e) => handleInputChange('documentId', e.target.value)}
                  required
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                <input
                  type="email"
                  value={student.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone *</label>
                <input
                  type="tel"
                  value={student.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                />
              </div>

              {/* Photo URL */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Photo URL</label>
                <input
                  type="url"
                  value={student.photoUrl || ''}
                  onChange={(e) => handleInputChange('photoUrl', e.target.value)}
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Status</h2>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="active"
                checked={student.active}
                onChange={(e) => handleInputChange('active', e.target.checked)}
                disabled={isReadOnly}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
              />
              <label htmlFor="active" className="ml-2 block text-sm text-gray-300">
                Active Student
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          {!isReadOnly && (
            <div className="flex justify-end space-x-4">
              <Link
                to="/students/registration"
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition-all duration-300"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : action === 'new' ? 'Create Student' : 'Update Student'}
              </button>
            </div>
          )}

          {isReadOnly && (
            <div className="flex justify-end space-x-4">
              <Link
                to="/students/registration"
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition-all duration-300"
              >
                Back to List
              </Link>
              <Link
                to={`/students/registration/edit/${student.studentId}`}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
              >
                Edit Student
              </Link>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default StudentForm
