import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useStudents, Student } from '../contexts/StudentContext'
import { useBranches } from '../contexts/BranchContext'
import { useWeightDivisions } from '../contexts/WeightDivisionContext'
import { useClassCheckIns } from '../contexts/ClassCheckInContext'

const StudentForm: React.FC = () => {
  const { t } = useLanguage()
  const { action, id } = useParams<{ action: string; id?: string }>()
  const navigate = useNavigate()
  const { addStudent, updateStudent, getStudent } = useStudents()
  const { branches } = useBranches()
  const { weightDivisions, getWeightDivisionByWeight } = useWeightDivisions()
  const { getCheckInsByStudent } = useClassCheckIns()
  
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
    branchId: '',
    active: true,
    isKidsStudent: false,
    photoUrl: '',
    preferredLanguage: 'PTB'
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isReadOnly, setIsReadOnly] = useState(action === 'view')
  const [defaultBranchSet, setDefaultBranchSet] = useState(false)
  const [checkInStatsKey, setCheckInStatsKey] = useState(0)

  // Function to calculate age from birth date
  const calculateAge = (birthDate: string) => {
    if (!birthDate) return 0
    const today = new Date()
    const dob = new Date(birthDate)
    let age = today.getFullYear() - dob.getFullYear()
    const m = today.getMonth() - dob.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--
    }
    return age
  }

  // Function to check if student is under 18
  const isUnder18 = (birthDate: string) => {
    return calculateAge(birthDate) < 18
  }

  // Function to get weight division name by ID
  const getWeightDivisionName = (divisionId?: string) => {
    if (!divisionId) return null
    const division = weightDivisions.find(d => d.divisionId === divisionId)
    return division ? division.name : null
  }

  // Get active branches for selection
  const activeBranches = branches.filter(branch => branch.active)
  
  console.log('=== STUDENT FORM DEBUG ===')
  console.log('All branches:', branches)
  console.log('Active branches:', activeBranches)
  console.log('Branches length:', branches.length)
  console.log('Active branches length:', activeBranches.length)

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

  // Separate useEffect to set default branch when branches are loaded (only once)
  useEffect(() => {
    if (action === 'new' && activeBranches.length > 0 && !defaultBranchSet) {
      console.log('StudentForm: Setting default branch to:', activeBranches[0].branchId)
      setStudent(prev => ({
        ...prev,
        branchId: activeBranches[0].branchId
      }))
      setDefaultBranchSet(true)
    }
  }, [activeBranches, action, defaultBranchSet])

  // Debug useEffect to track student state changes
  useEffect(() => {
    console.log('StudentForm: Student state changed, branchId is now:', student.branchId)
  }, [student.branchId])

  // Force re-render of check-in statistics when component mounts or student changes
  useEffect(() => {
    // This effect will trigger whenever the component mounts or student changes
    // The check-in statistics will be recalculated in the render
    console.log('StudentForm: Check-in statistics will be recalculated for student:', student.studentId)
    setCheckInStatsKey(prev => prev + 1) // Force re-render of check-in statistics
  }, [student.studentId])

  // Also update check-in statistics when the component first loads
  useEffect(() => {
    if (student.studentId) {
      setCheckInStatsKey(prev => prev + 1)
    }
  }, [])

  // Update check-in statistics when the page becomes visible (user navigates back)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && student.studentId) {
        console.log('StudentForm: Page became visible, refreshing check-in statistics')
        setCheckInStatsKey(prev => prev + 1)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [student.studentId])

  const handleInputChange = (field: keyof Student, value: string | boolean) => {
    console.log('StudentForm: handleInputChange called with field:', field, 'value:', value)
    if (field === 'branchId') {
      console.log('StudentForm: Branch selection changed to:', value)
      console.log('StudentForm: Previous branchId was:', student.branchId)
      console.log('StudentForm: Available branches:', activeBranches.map(b => ({ id: b.branchId, name: b.name })))
    }
    setStudent(prev => {
      const updated = { ...prev, [field]: value }
      if (field === 'branchId') {
        console.log('StudentForm: Updated student with new branchId:', updated.branchId)
      }
      
      // Auto-generate displayName
      if (field === 'firstName' || field === 'lastName') {
        updated.displayName = `${updated.firstName} ${updated.lastName}`.trim()
      }
      
      // Auto-set isKidsStudent based on birth date
      if (field === 'birthDate' && typeof value === 'string') {
        updated.isKidsStudent = isUnder18(value)
        console.log('StudentForm: Auto-set isKidsStudent to:', updated.isKidsStudent, 'based on age:', calculateAge(value))
      }

      // Auto-calculate weight division when weight changes
      if (field === 'weight' && typeof value === 'number' && value > 0) {
        const weightDivision = getWeightDivisionByWeight(value, updated.gender, updated.isKidsStudent)
        updated.weightDivisionId = weightDivision?.divisionId
        console.log('StudentForm: Auto-calculated weight division:', weightDivision?.name, 'for weight:', value)
      } else if (field === 'weight' && (typeof value !== 'number' || value <= 0)) {
        updated.weightDivisionId = undefined
      }

      // Recalculate weight division when gender or isKidsStudent changes
      if ((field === 'gender' || field === 'isKidsStudent') && updated.weight && updated.weight > 0) {
        const weightDivision = getWeightDivisionByWeight(updated.weight, updated.gender, updated.isKidsStudent)
        updated.weightDivisionId = weightDivision?.divisionId
        console.log('StudentForm: Recalculated weight division:', weightDivision?.name, 'for updated criteria')
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
      
      setIsLoading(false)
      
      // Show confirmation dialog for creating modality assignment
      const createModality = window.confirm(
        'Student created successfully!\n\nWould you like to create a Modality by Student register for this student?'
      )
      
      if (createModality) {
        // Navigate to Student Modality form for this student
        navigate(`/students/modality/new/${student.studentId}`)
      } else {
        // Navigate back to list
        navigate('/students/registration')
      }
    } else if (action === 'edit') {
      console.log('Updating student...')
      updateStudent(student.studentId, student)
      
      setIsLoading(false)
      
      // Navigate back to list
      navigate('/students/registration')
    }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2 sm:mb-3">
                {getPageIcon()} {getPageTitle()}
              </h1>
              <p className="text-base sm:text-lg text-gray-300">
                {action === 'new' && 'Register a new student'}
                {action === 'edit' && 'Update student information'}
                {action === 'view' && 'View student details'}
              </p>
            </div>
            <Link
              to="/students/registration"
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300 flex items-center justify-center text-sm sm:text-base w-full sm:w-auto"
            >
              ← Back to List
            </Link>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6">
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

              {/* Is Kids Student */}
              <div>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={student.isKidsStudent}
                    onChange={(e) => handleInputChange('isKidsStudent', e.target.checked)}
                    disabled={isReadOnly}
                    className="w-5 h-5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2 disabled:opacity-50"
                  />
                  <span className="text-sm font-medium text-gray-300">
                    Is Kids Student (Under 18 years old)
                  </span>
                </label>
                <p className="text-xs text-gray-400 mt-1">
                  Mark this for students under 18 years old for better data classification
                </p>
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={student.weight || ''}
                  onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || undefined)}
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                  placeholder="70.5"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Weight will automatically determine the weight division
                </p>
              </div>

              {/* Weight Division */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Weight Division</label>
                <input
                  type="text"
                  value={getWeightDivisionName(student.weightDivisionId) || 'Not assigned'}
                  readOnly
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Automatically calculated based on weight, gender, and age
                </p>
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
                  <optgroup label="Adult Belts">
                    <option value="white">White Belt</option>
                    <option value="blue">Blue Belt</option>
                    <option value="purple">Purple Belt</option>
                    <option value="brown">Brown Belt</option>
                    <option value="black">Black Belt</option>
                  </optgroup>
                  <optgroup label="Kids Belts (BJJ - Under 16)">
                    <option value="kids-white">White</option>
                    <option value="kids-gray-white">Gray/White</option>
                    <option value="kids-gray">Solid Gray</option>
                    <option value="kids-gray-black">Gray/Black</option>
                    <option value="kids-yellow-white">Yellow/White</option>
                    <option value="kids-yellow">Solid Yellow</option>
                    <option value="kids-yellow-black">Yellow/Black</option>
                    <option value="kids-orange-white">Orange/White</option>
                    <option value="kids-orange">Solid Orange</option>
                    <option value="kids-orange-black">Orange/Black</option>
                    <option value="kids-green-white">Green/White</option>
                    <option value="kids-green">Solid Green</option>
                    <option value="kids-green-black">Green/Black</option>
                  </optgroup>
                  <optgroup label="Kids Belts (Judo - Under 15)">
                    <option value="judo-kids-white">White</option>
                    <option value="judo-kids-white-yellow">White/Yellow</option>
                    <option value="judo-kids-yellow">Yellow</option>
                    <option value="judo-kids-yellow-orange">Yellow/Orange</option>
                    <option value="judo-kids-orange">Orange</option>
                    <option value="judo-kids-orange-green">Orange/Green</option>
                    <option value="judo-kids-green">Green</option>
                  </optgroup>
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
                  {activeBranches.length === 0 ? (
                    <option value="" disabled>No branches available - Please create a branch first</option>
                  ) : (
                    activeBranches.map(branch => (
                      <option key={branch.branchId} value={branch.branchId}>{branch.name}</option>
                    ))
                  )}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6">
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

              {/* Preferred Language for Interactions */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{t('preferred-language')}</label>
                <select
                  value={student.preferredLanguage || 'PTB'}
                  onChange={(e) => handleInputChange('preferredLanguage', e.target.value)}
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                >
                  <option value="ENU">🇺🇸 English</option>
                  <option value="PTB">🇧🇷 Português (Brasil)</option>
                  <option value="ESP">🇪🇸 Español</option>
                  <option value="FRA">🇫🇷 Français</option>
                  <option value="GER">🇩🇪 Deutsch</option>
                  <option value="JPN">🇯🇵 日本語</option>
                  <option value="ITA">🇮🇹 Italiano</option>
                  <option value="RUS">🇷🇺 Русский</option>
                  <option value="ARA">🇸🇦 العربية</option>
                  <option value="KOR">🇰🇷 한국어</option>
                </select>
                <p className="text-xs text-gray-400 mt-1">{t('preferred-language-help')}</p>
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

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6">
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

          {/* Check-in Statistics */}
          <div key={checkInStatsKey} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Check-in Statistics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Total Check-ins */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Total of Check-ins</label>
                <div className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white">
                  {(() => {
                    if (!student.studentId) {
                      return <span className="text-gray-400">No student selected</span>;
                    }
                    
                    const studentCheckIns = getCheckInsByStudent(student.studentId);
                    return (
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-blue-400">{studentCheckIns.length}</span>
                        <span className="text-sm text-gray-400">check-ins</span>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Last Check-in */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Last Check-in</label>
                <div className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white">
                  {(() => {
                    if (!student.studentId) {
                      return <span className="text-gray-400">No student selected</span>;
                    }
                    
                    const studentCheckIns = getCheckInsByStudent(student.studentId);
                    if (studentCheckIns.length === 0) {
                      return <span className="text-gray-400">No check-ins yet</span>;
                    }
                    
                    const lastCheckIn = studentCheckIns.sort((a, b) => 
                      new Date(b.checkInDate + ' ' + b.checkInTime).getTime() - 
                      new Date(a.checkInDate + ' ' + a.checkInTime).getTime()
                    )[0];
                    
                    return (
                      <div>
                        <div className="text-sm text-white">
                          {new Date(lastCheckIn.checkInDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-400">
                          at {lastCheckIn.checkInTime}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Last Check-in Branch */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Last Check-in Branch</label>
                <div className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white">
                  {(() => {
                    if (!student.studentId) {
                      return <span className="text-gray-400">No student selected</span>;
                    }
                    
                    const studentCheckIns = getCheckInsByStudent(student.studentId);
                    if (studentCheckIns.length === 0) {
                      return <span className="text-gray-400">No check-ins yet</span>;
                    }
                    
                    const lastCheckIn = studentCheckIns.sort((a, b) => 
                      new Date(b.checkInDate + ' ' + b.checkInTime).getTime() - 
                      new Date(a.checkInDate + ' ' + a.checkInTime).getTime()
                    )[0];
                    
                    return (
                      <div>
                        <div className="text-sm text-white">{lastCheckIn.branchName}</div>
                        <div className="text-xs text-gray-400">{lastCheckIn.facilityName}</div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* First Check-in */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">First Check-in</label>
                <div className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white">
                  {(() => {
                    if (!student.studentId) {
                      return <span className="text-gray-400">No student selected</span>;
                    }
                    
                    const studentCheckIns = getCheckInsByStudent(student.studentId);
                    if (studentCheckIns.length === 0) {
                      return <span className="text-gray-400">No check-ins yet</span>;
                    }
                    
                    const firstCheckIn = studentCheckIns.sort((a, b) => 
                      new Date(a.checkInDate + ' ' + a.checkInTime).getTime() - 
                      new Date(b.checkInDate + ' ' + b.checkInTime).getTime()
                    )[0];
                    
                    return (
                      <div>
                        <div className="text-sm text-white">
                          {new Date(firstCheckIn.checkInDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-400">
                          at {firstCheckIn.checkInTime}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
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
