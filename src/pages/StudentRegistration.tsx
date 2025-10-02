import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useStudents, Student } from '../contexts/StudentContext'
import { useBranches } from '../contexts/BranchContext'
import * as XLSX from 'xlsx'

const StudentRegistration: React.FC = () => {
  const { t } = useLanguage()
  const { students, deleteStudent, addStudent } = useStudents()
  const { branches } = useBranches()
  const [isImporting, setIsImporting] = useState(false)
  const [importResult, setImportResult] = useState<{ success: number; errors: string[] } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [beltFilter, setBeltFilter] = useState('all')
  const [genderFilter, setGenderFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [branchFilter, setBranchFilter] = useState('all')
  
  console.log('=== STUDENT REGISTRATION: RENDER ===')
  console.log('StudentRegistration: Current students:', students)
  console.log('StudentRegistration: Students count:', students.length)

  const getBeltColor = (beltLevel: string) => {
    const colors = {
      white: 'bg-gray-200 text-gray-800',
      blue: 'bg-blue-500 text-white',
      purple: 'bg-purple-500 text-white',
      brown: 'bg-amber-600 text-white',
      black: 'bg-gray-800 text-white'
    }
    return colors[beltLevel as keyof typeof colors] || 'bg-gray-200 text-gray-800'
  }

  const getGenderIcon = (gender: string) => {
    return gender === 'male' ? '👨' : gender === 'female' ? '👩' : '👤'
  }

  const getBranchName = (branchId: string) => {
    const branch = branches.find(b => b.branchId === branchId)
    return branch ? branch.name : 'Unknown Branch'
  }

  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const dob = new Date(birthDate)
    let age = today.getFullYear() - dob.getFullYear()
    const m = today.getMonth() - dob.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--
    }
    return age
  }

  const handleDeleteStudent = (studentId: string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      deleteStudent(studentId)
    }
  }


  const handleExportToExcel = () => {
    if (students.length === 0) {
      alert('No students to export!')
      return
    }

    // Prepare data for Excel export
    const exportData = students.map(student => ({
      'Student ID': student.studentId,
      'First Name': student.firstName,
      'Last Name': student.lastName,
      'Display Name': student.displayName,
      'Birth Date': student.birthDate,
      'Age': calculateAge(student.birthDate),
          'Gender': t((student.gender || '').toLowerCase()),
          'Belt Level': t((student.beltLevel || '').toLowerCase()),
      'Document ID': student.documentId,
      'Email': student.email,
      'Phone': student.phone,
      'Branch ID': student.branchId,
      'Active': student.active ? t('active') : 'Inactive',
      'Photo URL': student.photoUrl || ''
    }))

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(exportData)

    // Set column widths
    const colWidths = [
      { wch: 12 }, // Student ID
      { wch: 15 }, // First Name
      { wch: 15 }, // Last Name
      { wch: 20 }, // Display Name
      { wch: 12 }, // Birth Date
      { wch: 8 },  // Age
      { wch: 10 }, // Gender
      { wch: 12 }, // Belt Level
      { wch: 15 }, // Document ID
      { wch: 25 }, // Email
      { wch: 15 }, // Phone
      { wch: 12 }, // Branch ID
      { wch: 10 }, // Active
      { wch: 30 }  // Photo URL
    ]
    ws['!cols'] = colWidths

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Students')

    // Generate filename with current date
    const currentDate = new Date().toISOString().split('T')[0]
    const filename = `students_export_${currentDate}.xlsx`

    // Save file
    XLSX.writeFile(wb, filename)
  }

  const handleDownloadTemplate = () => {
    // Create template data
    const templateData = [
      {
        'First Name': 'João',
        'Last Name': 'Silva',
        'Birth Date': '1990-01-15',
        'Gender': 'male',
        'Belt Level': 'blue',
        'Document ID': '12345678901',
        'Email': 'joao.silva@email.com',
        'Phone': '+55 11 99999-9999',
        'Branch ID': 'BR001',
        'Active': 'true',
        'Photo URL': 'https://example.com/photo.jpg'
      },
      {
        'First Name': 'Maria',
        'Last Name': 'Santos',
        'Birth Date': '1995-05-20',
        'Gender': 'female',
        'Belt Level': 'purple',
        'Document ID': '98765432100',
        'Email': 'maria.santos@email.com',
        'Phone': '+55 11 88888-8888',
        'Branch ID': 'BR001',
        'Active': 'true',
        'Photo URL': ''
      }
    ]

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(templateData)

    // Set column widths
    const colWidths = [
      { wch: 15 }, // First Name
      { wch: 15 }, // Last Name
      { wch: 12 }, // Birth Date
      { wch: 10 }, // Gender
      { wch: 12 }, // Belt Level
      { wch: 15 }, // Document ID
      { wch: 25 }, // Email
      { wch: 15 }, // Phone
      { wch: 12 }, // Branch ID
      { wch: 10 }, // Active
      { wch: 30 }  // Photo URL
    ]
    ws['!cols'] = colWidths

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Students Template')

    // Save file
    XLSX.writeFile(wb, 'students_import_template.xlsx')
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        processImportData(jsonData)
      } catch (error) {
        console.error('Error reading Excel file:', error)
        setImportResult({ success: 0, errors: ['Error reading Excel file. Please check the file format.'] })
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const processImportData = (data: any[]) => {
    setIsImporting(true)
    setImportResult(null)

    let successCount = 0
    const errors: string[] = []

    data.forEach((row, index) => {
      try {
        // Validate required fields
        if (!row['First Name'] || !row['Last Name'] || !row['Birth Date']) {
          errors.push(`Row ${index + 2}: Missing required fields (First Name, Last Name, Birth Date)`)
          return
        }

        // Generate unique student ID
        const studentId = `STU${String(Date.now() + index).slice(-6)}`

        // Create student object
        const newStudent: Student = {
          studentId,
          firstName: String(row['First Name']).trim(),
          lastName: String(row['Last Name']).trim(),
          displayName: `${String(row['First Name']).trim()} ${String(row['Last Name']).trim()}`,
          birthDate: String(row['Birth Date']).trim(),
          gender: (row['Gender'] || 'other').toLowerCase() as 'male' | 'female' | 'other',
          beltLevel: (row['Belt Level'] || 'white').toLowerCase() as 'white' | 'blue' | 'purple' | 'brown' | 'black',
          documentId: String(row['Document ID'] || '').trim(),
          email: String(row['Email'] || '').trim(),
          phone: String(row['Phone'] || '').trim(),
          branchId: String(row['Branch ID'] || 'BR001').trim(),
          active: String(row['Active'] || 'true').toLowerCase() === 'true',
          photoUrl: String(row['Photo URL'] || '').trim() || undefined
        }

        // Validate data types
        if (!['male', 'female', 'other'].includes(newStudent.gender)) {
          errors.push(`Row ${index + 2}: Invalid gender. Must be 'male', 'female', or 'other'`)
          return
        }

        if (!['white', 'blue', 'purple', 'brown', 'black'].includes(newStudent.beltLevel)) {
          errors.push(`Row ${index + 2}: Invalid belt level. Must be 'white', 'blue', 'purple', 'brown', or 'black'`)
          return
        }

        // Validate date format
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/
        if (!dateRegex.test(newStudent.birthDate)) {
          errors.push(`Row ${index + 2}: Invalid birth date format. Use YYYY-MM-DD`)
          return
        }

        // Add student
        addStudent(newStudent)
        successCount++

      } catch (error) {
        errors.push(`Row ${index + 2}: ${error}`)
      }
    })

    setIsImporting(false)
    setImportResult({ success: successCount, errors })

    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

      // Filter functions
      const clearAllFilters = () => {
        setSearchTerm('')
        setBeltFilter('all')
        setGenderFilter('all')
        setStatusFilter('all')
        setBranchFilter('all')
      }

  const filteredStudents = students.filter(student => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      (student.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.lastName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.displayName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.email || '').toLowerCase().includes(searchTerm.toLowerCase())

    // Belt filter
    const matchesBelt = beltFilter === 'all' || (student.beltLevel || '').toLowerCase() === beltFilter.toLowerCase()

    // Gender filter
    const matchesGender = genderFilter === 'all' || (student.gender || '').toLowerCase() === genderFilter.toLowerCase()

        // Status filter
        const matchesStatus = statusFilter === 'all' || 
          (statusFilter === 'active' && student.active) ||
          (statusFilter === 'inactive' && !student.active)

        // Branch filter
        const matchesBranch = branchFilter === 'all' || (student.branchId || '').toLowerCase() === branchFilter.toLowerCase()

        return matchesSearch && matchesBelt && matchesGender && matchesStatus && matchesBranch
  })

  const hasActiveFilters = searchTerm !== '' || beltFilter !== 'all' || genderFilter !== 'all' || statusFilter !== 'all' || branchFilter !== 'all'

  // Calculate belt counts
  const totalStudents = students.length
  const activeStudents = students.filter(s => s.active).length
  const blackBelts = students.filter(s => (s.beltLevel || '').toLowerCase() === 'black').length
  const whiteBelts = students.filter(s => (s.beltLevel || '').toLowerCase() === 'white').length
  const blueBelts = students.filter(s => (s.beltLevel || '').toLowerCase() === 'blue').length
  const purpleBelts = students.filter(s => (s.beltLevel || '').toLowerCase() === 'purple').length
  const brownBelts = students.filter(s => (s.beltLevel || '').toLowerCase() === 'brown').length

  // Calculate percentages
  const getPercentage = (count: number) => {
    if (totalStudents === 0) return '0%'
    return `${Math.round((count / totalStudents) * 100)}%`
  }

  const blackBeltsPercentage = getPercentage(blackBelts)
  const whiteBeltsPercentage = getPercentage(whiteBelts)
  const blueBeltsPercentage = getPercentage(blueBelts)
  const purpleBeltsPercentage = getPercentage(purpleBelts)
  const brownBeltsPercentage = getPercentage(brownBelts)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-3">
                {t('student-registration')}
              </h1>
              <p className="text-lg text-gray-300 max-w-2xl">
                Manage student registrations and information
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleDownloadTemplate}
                title={t('download-template')}
                className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white p-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gray-500/25 flex items-center justify-center"
              >
                <span className="text-lg">📋</span>
              </button>
              <button
                onClick={handleImportClick}
                disabled={isImporting}
                title={isImporting ? 'Importing...' : t('import-from-excel')}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white p-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-lg">{isImporting ? '⏳' : '📥'}</span>
              </button>
              <button
                onClick={handleExportToExcel}
                title={t('export-to-excel')}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 flex items-center justify-center"
              >
                <span className="text-lg">📊</span>
              </button>
              <Link
                to="/students/registration/new"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 flex items-center"
              >
                <span className="mr-2">➕</span>
                New Student
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Total Students</p>
                <p className="text-3xl font-bold text-white">{totalStudents}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Active Students</p>
                <p className="text-3xl font-bold text-white">{activeStudents}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Black Belts</p>
                <p className="text-3xl font-bold text-white">{blackBelts}</p>
                <p className="text-xs text-gray-500 mt-1">{blackBeltsPercentage} of total</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg">
                <span className="text-2xl">🥋</span>
              </div>
            </div>
          </div>
        </div>

        {/* Other Belt Counts (Smaller) */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">{t('belt-level-counts')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {/* White Belts */}
            <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-gray-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-1">{t('white-belts')}</p>
                  <p className="text-2xl font-bold text-white">{whiteBelts}</p>
                  <p className="text-xs text-gray-500 mt-1">{whiteBeltsPercentage}</p>
                </div>
                <div className="p-2 bg-gray-200/20 rounded-lg shadow-md">
                  <span className="text-xl text-gray-200">🥋</span>
                </div>
              </div>
            </div>

            {/* Blue Belts */}
            <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-1">{t('blue-belts')}</p>
                  <p className="text-2xl font-bold text-white">{blueBelts}</p>
                  <p className="text-xs text-gray-500 mt-1">{blueBeltsPercentage}</p>
                </div>
                <div className="p-2 bg-blue-500/20 rounded-lg shadow-md">
                  <span className="text-xl text-blue-400">🥋</span>
                </div>
              </div>
            </div>

            {/* Purple Belts */}
            <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-1">{t('purple-belts')}</p>
                  <p className="text-2xl font-bold text-white">{purpleBelts}</p>
                  <p className="text-xs text-gray-500 mt-1">{purpleBeltsPercentage}</p>
                </div>
                <div className="p-2 bg-purple-500/20 rounded-lg shadow-md">
                  <span className="text-xl text-purple-400">🥋</span>
                </div>
              </div>
            </div>

            {/* Brown Belts */}
            <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-amber-700/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-1">{t('brown-belts')}</p>
                  <p className="text-2xl font-bold text-white">{brownBelts}</p>
                  <p className="text-xs text-gray-500 mt-1">{brownBeltsPercentage}</p>
                </div>
                <div className="p-2 bg-amber-700/20 rounded-lg shadow-md">
                  <span className="text-xl text-amber-600">🥋</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Filter Bar */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-lg">🔍</span>
                </div>
                <input
                  type="text"
                  placeholder={t('search-students')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap gap-3">
              {/* Branch Filter */}
              <div className="relative">
                <select
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                  className="appearance-none bg-white/10 border border-white/20 rounded-xl text-white px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 min-w-[140px]"
                >
                  <option value="all" className="bg-gray-800">All Branches</option>
                  {branches.filter(branch => branch.active).map(branch => (
                    <option key={branch.branchId} value={branch.branchId} className="bg-gray-800">{branch.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-400">🏢</span>
                </div>
              </div>

              {/* Belt Filter */}
              <div className="relative">
                <select
                  value={beltFilter}
                  onChange={(e) => setBeltFilter(e.target.value)}
                  className="appearance-none bg-white/10 border border-white/20 rounded-xl text-white px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 min-w-[140px]"
                >
                  <option value="all" className="bg-gray-800">{t('all-belts')}</option>
                  <option value="white" className="bg-gray-800">{t('white')}</option>
                  <option value="blue" className="bg-gray-800">{t('blue')}</option>
                  <option value="purple" className="bg-gray-800">{t('purple')}</option>
                  <option value="brown" className="bg-gray-800">{t('brown')}</option>
                  <option value="black" className="bg-gray-800">{t('black')}</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-400">🥋</span>
                </div>
              </div>

              {/* Gender Filter */}
              <div className="relative">
                <select
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                  className="appearance-none bg-white/10 border border-white/20 rounded-xl text-white px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 min-w-[140px]"
                >
                  <option value="all" className="bg-gray-800">{t('all-genders')}</option>
                  <option value="male" className="bg-gray-800">{t('male')}</option>
                  <option value="female" className="bg-gray-800">{t('female')}</option>
                  <option value="other" className="bg-gray-800">{t('other')}</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-400">👤</span>
                </div>
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none bg-white/10 border border-white/20 rounded-xl text-white px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 min-w-[140px]"
                >
                  <option value="all" className="bg-gray-800">{t('all-status')}</option>
                  <option value="active" className="bg-gray-800">{t('active-only')}</option>
                  <option value="inactive" className="bg-gray-800">{t('inactive-only')}</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-400">✅</span>
                </div>
              </div>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 flex items-center"
                >
                  <span className="mr-2">🗑️</span>
                  {t('clear-filters')}
                </button>
              )}
            </div>
          </div>

          {/* Filter Results Summary */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-300">
                  Showing {filteredStudents.length} of {students.length} students
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchTerm && (
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs">
                      Search: "{searchTerm}"
                    </span>
                  )}
                  {branchFilter !== 'all' && (
                    <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-lg text-xs">
                      Branch: {getBranchName(branchFilter)}
                    </span>
                  )}
                  {beltFilter !== 'all' && (
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-xs">
                      Belt: {t((beltFilter || '').toLowerCase())}
                    </span>
                  )}
                  {genderFilter !== 'all' && (
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs">
                      Gender: {t((genderFilter || '').toLowerCase())}
                    </span>
                  )}
                  {statusFilter !== 'all' && (
                    <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-lg text-xs">
                      Status: {t((statusFilter || '').toLowerCase())}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Students Table */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-semibold text-white">Students List</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Branch</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Belt Level</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-400">
                      {hasActiveFilters ? 'No students match the current filters.' : 'No students registered yet.'}
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                  <tr key={student.studentId} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          {student.photoUrl ? (
                            <img className="h-12 w-12 rounded-full object-cover" src={student.photoUrl} alt={student.displayName} />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                              <span className="text-white text-lg font-semibold">
                                {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{student.displayName}</div>
                          <div className="text-sm text-gray-400">ID: {student.studentId}</div>
                          <div className="text-sm text-gray-400 flex items-center">
                            <span className="mr-1">{getGenderIcon(student.gender)}</span>
                            {new Date().getFullYear() - new Date(student.birthDate).getFullYear()} years old
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-300">🏢</span>
                        <span className="ml-2 text-sm text-white">{getBranchName(student.branchId)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getBeltColor(student.beltLevel)}`}>
                        {student.beltLevel.charAt(0).toUpperCase() + student.beltLevel.slice(1)} Belt
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{student.email}</div>
                      <div className="text-sm text-gray-400">{student.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        student.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {student.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/students/registration/view/${student.studentId}`}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          👁️ View
                        </Link>
                        <Link
                          to={`/students/registration/edit/${student.studentId}`}
                          className="text-green-400 hover:text-green-300 transition-colors"
                        >
                          ✏️ Edit
                        </Link>
                        <button 
                          onClick={() => handleDeleteStudent(student.studentId)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {/* Import Result Modal */}
        {importResult && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">
                  {importResult.success > 0 ? t('import-success') : t('import-error')}
                </h3>
                <button
                  onClick={() => setImportResult(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="text-center">
                  <div className={`text-4xl mb-2 ${importResult.success > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {importResult.success > 0 ? '✅' : '❌'}
                  </div>
                  <p className="text-white">
                    {importResult.success > 0 
                      ? `${importResult.success} students imported successfully!`
                      : 'No students were imported due to errors.'
                    }
                  </p>
                </div>

                {importResult.errors.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Errors:</h4>
                    <div className="max-h-32 overflow-y-auto bg-black/20 rounded-lg p-3">
                      {importResult.errors.map((error, index) => (
                        <p key={index} className="text-red-400 text-xs mb-1">{error}</p>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={() => setImportResult(null)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentRegistration
