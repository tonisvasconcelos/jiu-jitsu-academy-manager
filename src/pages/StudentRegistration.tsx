import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useStudents, Student } from '../contexts/StudentContext'
import { useBranches } from '../contexts/BranchContext'
import { useWeightDivisions } from '../contexts/WeightDivisionContext'
import * as XLSX from 'xlsx'

const StudentRegistration: React.FC = () => {
  const { t } = useLanguage()
  const { students, deleteStudent, addStudent } = useStudents()
  const { branches } = useBranches()
  const { weightDivisions } = useWeightDivisions()
  const [isImporting, setIsImporting] = useState(false)
  const [importResult, setImportResult] = useState<{ success: number; errors: string[] } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [beltFilter, setBeltFilter] = useState('all')
  const [genderFilter, setGenderFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [branchFilter, setBranchFilter] = useState('all')
  const [kidsFilter, setKidsFilter] = useState('all') // Added kids filter state
  const [weightDivisionFilter, setWeightDivisionFilter] = useState('all') // Added weight division filter state
  
  console.log('=== STUDENT REGISTRATION: RENDER ===')
  console.log('StudentRegistration: Current students:', students)
  console.log('StudentRegistration: Students count:', students.length)

  const getBeltColor = (beltLevel: string) => {
    const colors = {
      // Adult belts
      white: 'bg-gray-200 text-gray-800',
      blue: 'bg-blue-500 text-white',
      purple: 'bg-purple-500 text-white',
      brown: 'bg-amber-600 text-white',
      black: 'bg-gray-800 text-white',
      // BJJ Kids belts
      'kids-white': 'bg-gray-200 text-gray-800',
      'kids-gray-white': 'bg-gray-300 text-gray-800',
      'kids-gray': 'bg-gray-400 text-white',
      'kids-gray-black': 'bg-gray-600 text-white',
      'kids-yellow-white': 'bg-yellow-200 text-gray-800',
      'kids-yellow': 'bg-yellow-500 text-white',
      'kids-yellow-black': 'bg-yellow-700 text-white',
      'kids-orange-white': 'bg-orange-200 text-gray-800',
      'kids-orange': 'bg-orange-500 text-white',
      'kids-orange-black': 'bg-orange-700 text-white',
      'kids-green-white': 'bg-green-200 text-gray-800',
      'kids-green': 'bg-green-500 text-white',
      'kids-green-black': 'bg-green-700 text-white',
      // Judo Kids belts
      'judo-kids-white': 'bg-gray-200 text-gray-800',
      'judo-kids-white-yellow': 'bg-yellow-100 text-gray-800',
      'judo-kids-yellow': 'bg-yellow-500 text-white',
      'judo-kids-yellow-orange': 'bg-orange-300 text-white',
      'judo-kids-orange': 'bg-orange-500 text-white',
      'judo-kids-orange-green': 'bg-green-300 text-white',
      'judo-kids-green': 'bg-green-500 text-white'
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

  const getWeightDivisionName = (divisionId?: string) => {
    if (!divisionId) return 'Not assigned'
    const division = weightDivisions.find(d => d.divisionId === divisionId)
    return division ? division.name : 'Unknown Division'
  }


  const getWeightDivisionByWeight = (weight: number, gender: 'male' | 'female' | 'other', isKidsStudent: boolean) => {
    const ageGroup = isKidsStudent ? 'kids' : 'adult'
    const genderFilter = gender === 'other' ? 'both' : gender
    
    return weightDivisions.find(division => 
      division.active &&
      weight >= division.minWeight && 
      weight < division.maxWeight &&
      (division.gender === genderFilter || division.gender === 'both') &&
      (division.ageGroup === ageGroup || division.ageGroup === 'both')
    )
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
          'Is Kids Student': student.isKidsStudent ? 'Yes' : 'No',
          'Weight (kg)': student.weight || '',
          'Weight Division': getWeightDivisionName(student.weightDivisionId),
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
          { wch: 15 }, // Is Kids Student
          { wch: 12 }, // Weight (kg)
          { wch: 15 }, // Weight Division
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
            'Is Kids Student': 'No',
            'Weight (kg)': '75.5',
            'Weight Division': 'Light',
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
            'Birth Date': '2010-05-20',
            'Gender': 'female',
            'Belt Level': 'kids-yellow',
            'Is Kids Student': 'Yes',
            'Weight (kg)': '25.0',
            'Weight Division': 'Light',
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
          { wch: 15 }, // Is Kids Student
          { wch: 12 }, // Weight (kg)
          { wch: 15 }, // Weight Division
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
          beltLevel: (row['Belt Level'] || 'white').toLowerCase() as 'white' | 'blue' | 'purple' | 'brown' | 'black' | 'kids-white' | 'kids-gray-white' | 'kids-gray' | 'kids-gray-black' | 'kids-yellow-white' | 'kids-yellow' | 'kids-yellow-black' | 'kids-orange-white' | 'kids-orange' | 'kids-orange-black' | 'kids-green-white' | 'kids-green' | 'kids-green-black' | 'judo-kids-white' | 'judo-kids-white-yellow' | 'judo-kids-yellow' | 'judo-kids-yellow-orange' | 'judo-kids-orange' | 'judo-kids-orange-green' | 'judo-kids-green',
          documentId: String(row['Document ID'] || '').trim(),
          email: String(row['Email'] || '').trim(),
          phone: String(row['Phone'] || '').trim(),
          branchId: String(row['Branch ID'] || 'BR001').trim(),
              active: String(row['Active'] || 'true').toLowerCase() === 'true',
              isKidsStudent: String(row['Is Kids Student'] || 'false').toLowerCase() === 'yes' || String(row['Is Kids Student'] || 'false').toLowerCase() === 'true',
              weight: row['Weight (kg)'] ? parseFloat(String(row['Weight (kg)'])) : undefined,
              weightDivisionId: undefined, // Will be calculated automatically based on weight
              photoUrl: String(row['Photo URL'] || '').trim() || undefined
        }

        // Validate data types
        if (!['male', 'female', 'other'].includes(newStudent.gender)) {
          errors.push(`Row ${index + 2}: Invalid gender. Must be 'male', 'female', or 'other'`)
          return
        }

        const validBeltLevels = [
          'white', 'blue', 'purple', 'brown', 'black',
          'kids-white', 'kids-gray-white', 'kids-gray', 'kids-gray-black',
          'kids-yellow-white', 'kids-yellow', 'kids-yellow-black',
          'kids-orange-white', 'kids-orange', 'kids-orange-black',
          'kids-green-white', 'kids-green', 'kids-green-black',
          'judo-kids-white', 'judo-kids-white-yellow', 'judo-kids-yellow',
          'judo-kids-yellow-orange', 'judo-kids-orange', 'judo-kids-orange-green', 'judo-kids-green'
        ];
        if (!validBeltLevels.includes(newStudent.beltLevel)) {
          errors.push(`Row ${index + 2}: Invalid belt level. Must be one of: ${validBeltLevels.join(', ')}`)
          return
        }

        // Validate date format
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/
        if (!dateRegex.test(newStudent.birthDate)) {
          errors.push(`Row ${index + 2}: Invalid birth date format. Use YYYY-MM-DD`)
          return
        }

        // Auto-calculate weight division if weight is provided
        if (newStudent.weight && newStudent.weight > 0) {
          const weightDivision = getWeightDivisionByWeight(newStudent.weight, newStudent.gender, newStudent.isKidsStudent)
          if (weightDivision) {
            newStudent.weightDivisionId = weightDivision.divisionId
            console.log(`Auto-assigned weight division: ${weightDivision.name} for student ${newStudent.firstName} ${newStudent.lastName}`)
          }
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
    setKidsFilter('all')
    setWeightDivisionFilter('all')
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

    // Kids filter
    const matchesKids = kidsFilter === 'all' || 
      (kidsFilter === 'kids' && student.isKidsStudent) ||
      (kidsFilter === 'adults' && !student.isKidsStudent)

    // Weight division filter
    const matchesWeightDivision = weightDivisionFilter === 'all' || 
      (weightDivisionFilter === 'assigned' && student.weightDivisionId) ||
      (weightDivisionFilter === 'unassigned' && !student.weightDivisionId) ||
      (student.weightDivisionId === weightDivisionFilter)

    return matchesSearch && matchesBelt && matchesGender && matchesStatus && matchesBranch && matchesKids && matchesWeightDivision
  })

  const hasActiveFilters = searchTerm !== '' || beltFilter !== 'all' || genderFilter !== 'all' || statusFilter !== 'all' || branchFilter !== 'all' || kidsFilter !== 'all' || weightDivisionFilter !== 'all'

  // Calculate belt counts (using filtered students for dynamic counts)
  const totalStudents = students.length
  const activeStudents = students.filter(s => s.active).length
  const filteredTotalStudents = filteredStudents.length
  
  // Adult belt counts based on filtered students (dynamic)
  const blackBelts = filteredStudents.filter(s => (s.beltLevel || '').toLowerCase() === 'black').length
  const whiteBelts = filteredStudents.filter(s => (s.beltLevel || '').toLowerCase() === 'white').length
  const blueBelts = filteredStudents.filter(s => (s.beltLevel || '').toLowerCase() === 'blue').length
  const purpleBelts = filteredStudents.filter(s => (s.beltLevel || '').toLowerCase() === 'purple').length
  const brownBelts = filteredStudents.filter(s => (s.beltLevel || '').toLowerCase() === 'brown').length

  // BJJ Kids belt counts based on filtered students (dynamic)
  const kidsWhiteBelts = filteredStudents.filter(s => (s.beltLevel || '').toLowerCase() === 'kids-white').length
  const kidsGrayWhiteBelts = filteredStudents.filter(s => (s.beltLevel || '').toLowerCase() === 'kids-gray-white').length
  const kidsGrayBelts = filteredStudents.filter(s => (s.beltLevel || '').toLowerCase() === 'kids-gray').length
  const kidsGrayBlackBelts = filteredStudents.filter(s => (s.beltLevel || '').toLowerCase() === 'kids-gray-black').length
  const kidsYellowWhiteBelts = filteredStudents.filter(s => (s.beltLevel || '').toLowerCase() === 'kids-yellow-white').length
  const kidsYellowBelts = filteredStudents.filter(s => (s.beltLevel || '').toLowerCase() === 'kids-yellow').length
  const kidsYellowBlackBelts = filteredStudents.filter(s => (s.beltLevel || '').toLowerCase() === 'kids-yellow-black').length
  const kidsOrangeWhiteBelts = filteredStudents.filter(s => (s.beltLevel || '').toLowerCase() === 'kids-orange-white').length
  const kidsOrangeBelts = filteredStudents.filter(s => (s.beltLevel || '').toLowerCase() === 'kids-orange').length
  const kidsOrangeBlackBelts = filteredStudents.filter(s => (s.beltLevel || '').toLowerCase() === 'kids-orange-black').length
  const kidsGreenWhiteBelts = filteredStudents.filter(s => (s.beltLevel || '').toLowerCase() === 'kids-green-white').length
  const kidsGreenBelts = filteredStudents.filter(s => (s.beltLevel || '').toLowerCase() === 'kids-green').length
  const kidsGreenBlackBelts = filteredStudents.filter(s => (s.beltLevel || '').toLowerCase() === 'kids-green-black').length

  // Judo Kids belt counts based on filtered students (dynamic)
  const judoKidsWhiteBelts = filteredStudents.filter(s => (s.beltLevel || '').toLowerCase() === 'judo-kids-white').length
  const judoKidsWhiteYellowBelts = filteredStudents.filter(s => (s.beltLevel || '').toLowerCase() === 'judo-kids-white-yellow').length
  const judoKidsYellowBelts = filteredStudents.filter(s => (s.beltLevel || '').toLowerCase() === 'judo-kids-yellow').length
  const judoKidsYellowOrangeBelts = filteredStudents.filter(s => (s.beltLevel || '').toLowerCase() === 'judo-kids-yellow-orange').length
  const judoKidsOrangeBelts = filteredStudents.filter(s => (s.beltLevel || '').toLowerCase() === 'judo-kids-orange').length
  const judoKidsOrangeGreenBelts = filteredStudents.filter(s => (s.beltLevel || '').toLowerCase() === 'judo-kids-orange-green').length
  const judoKidsGreenBelts = filteredStudents.filter(s => (s.beltLevel || '').toLowerCase() === 'judo-kids-green').length

  // Calculate percentages (using filtered total for dynamic percentages)
  const getPercentage = (count: number) => {
    if (filteredTotalStudents === 0) return '0%'
    return `${Math.round((count / filteredTotalStudents) * 100)}%`
  }

  const blackBeltsPercentage = getPercentage(blackBelts)
  const whiteBeltsPercentage = getPercentage(whiteBelts)
  const blueBeltsPercentage = getPercentage(blueBelts)
  const purpleBeltsPercentage = getPercentage(purpleBelts)
  const brownBeltsPercentage = getPercentage(brownBelts)

  // BJJ Kids belt percentages
  const kidsWhiteBeltsPercentage = getPercentage(kidsWhiteBelts)
  const kidsGrayWhiteBeltsPercentage = getPercentage(kidsGrayWhiteBelts)
  const kidsGrayBeltsPercentage = getPercentage(kidsGrayBelts)
  const kidsGrayBlackBeltsPercentage = getPercentage(kidsGrayBlackBelts)
  const kidsYellowWhiteBeltsPercentage = getPercentage(kidsYellowWhiteBelts)
  const kidsYellowBeltsPercentage = getPercentage(kidsYellowBelts)
  const kidsYellowBlackBeltsPercentage = getPercentage(kidsYellowBlackBelts)
  const kidsOrangeWhiteBeltsPercentage = getPercentage(kidsOrangeWhiteBelts)
  const kidsOrangeBeltsPercentage = getPercentage(kidsOrangeBelts)
  const kidsOrangeBlackBeltsPercentage = getPercentage(kidsOrangeBlackBelts)
  const kidsGreenWhiteBeltsPercentage = getPercentage(kidsGreenWhiteBelts)
  const kidsGreenBeltsPercentage = getPercentage(kidsGreenBelts)
  const kidsGreenBlackBeltsPercentage = getPercentage(kidsGreenBlackBelts)

  // Judo Kids belt percentages
  const judoKidsWhiteBeltsPercentage = getPercentage(judoKidsWhiteBelts)
  const judoKidsWhiteYellowBeltsPercentage = getPercentage(judoKidsWhiteYellowBelts)
  const judoKidsYellowBeltsPercentage = getPercentage(judoKidsYellowBelts)
  const judoKidsYellowOrangeBeltsPercentage = getPercentage(judoKidsYellowOrangeBelts)
  const judoKidsOrangeBeltsPercentage = getPercentage(judoKidsOrangeBelts)
  const judoKidsOrangeGreenBeltsPercentage = getPercentage(judoKidsOrangeGreenBelts)
  const judoKidsGreenBeltsPercentage = getPercentage(judoKidsGreenBelts)

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
        </div>

        {/* Belt Level Counts - Organized by ADULTS and KIDS */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">{t('belt-level-counts')}</h2>
          
          {/* Adult Belts Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <span className="mr-2">👨‍💼</span>
              ADULTS
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
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

            {/* Black Belts */}
            <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-gray-800/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-1">{t('black-belts')}</p>
                  <p className="text-2xl font-bold text-white">{blackBelts}</p>
                  <p className="text-xs text-gray-500 mt-1">{blackBeltsPercentage}</p>
                </div>
                <div className="p-2 bg-gray-800/20 rounded-lg shadow-md">
                  <span className="text-xl text-gray-800">🥋</span>
                </div>
              </div>
            </div>
            </div>
          </div>

          {/* BJJ Kids Belts Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <span className="mr-2">🥋</span>
              BJJ KIDS (Under 16)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {/* BJJ Kids White */}
            <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-gray-200/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-1">White</p>
                  <p className="text-2xl font-bold text-white">{kidsWhiteBelts}</p>
                  <p className="text-xs text-gray-500 mt-1">{kidsWhiteBeltsPercentage}</p>
                </div>
                <div className="p-2 bg-gray-200/20 rounded-lg shadow-md">
                  <span className="text-xl text-gray-200">🥋</span>
                </div>
              </div>
            </div>

            {/* BJJ Kids Gray/White */}
            <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-gray-300/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-1">Gray/White</p>
                  <p className="text-2xl font-bold text-white">{kidsGrayWhiteBelts}</p>
                  <p className="text-xs text-gray-500 mt-1">{kidsGrayWhiteBeltsPercentage}</p>
                </div>
                <div className="p-2 bg-gray-300/20 rounded-lg shadow-md">
                  <span className="text-xl text-gray-300">🥋</span>
                </div>
              </div>
            </div>

            {/* BJJ Kids Gray */}
            <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-gray-400/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-1">Gray</p>
                  <p className="text-2xl font-bold text-white">{kidsGrayBelts}</p>
                  <p className="text-xs text-gray-500 mt-1">{kidsGrayBeltsPercentage}</p>
                </div>
                <div className="p-2 bg-gray-400/20 rounded-lg shadow-md">
                  <span className="text-xl text-gray-400">🥋</span>
                </div>
              </div>
            </div>

            {/* BJJ Kids Gray/Black */}
            <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-gray-600/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-1">Gray/Black</p>
                  <p className="text-2xl font-bold text-white">{kidsGrayBlackBelts}</p>
                  <p className="text-xs text-gray-500 mt-1">{kidsGrayBlackBeltsPercentage}</p>
                </div>
                <div className="p-2 bg-gray-600/20 rounded-lg shadow-md">
                  <span className="text-xl text-gray-600">🥋</span>
                </div>
              </div>
            </div>

            {/* BJJ Kids Yellow/White */}
            <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-yellow-200/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-1">Yellow/White</p>
                  <p className="text-2xl font-bold text-white">{kidsYellowWhiteBelts}</p>
                  <p className="text-xs text-gray-500 mt-1">{kidsYellowWhiteBeltsPercentage}</p>
                </div>
                <div className="p-2 bg-yellow-200/20 rounded-lg shadow-md">
                  <span className="text-xl text-yellow-200">🥋</span>
                </div>
              </div>
            </div>

            {/* BJJ Kids Yellow */}
            <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-yellow-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-1">Yellow</p>
                  <p className="text-2xl font-bold text-white">{kidsYellowBelts}</p>
                  <p className="text-xs text-gray-500 mt-1">{kidsYellowBeltsPercentage}</p>
                </div>
                <div className="p-2 bg-yellow-500/20 rounded-lg shadow-md">
                  <span className="text-xl text-yellow-500">🥋</span>
                </div>
              </div>
            </div>

            {/* BJJ Kids Yellow/Black */}
            <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-yellow-700/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-1">Yellow/Black</p>
                  <p className="text-2xl font-bold text-white">{kidsYellowBlackBelts}</p>
                  <p className="text-xs text-gray-500 mt-1">{kidsYellowBlackBeltsPercentage}</p>
                </div>
                <div className="p-2 bg-yellow-700/20 rounded-lg shadow-md">
                  <span className="text-xl text-yellow-700">🥋</span>
                </div>
              </div>
            </div>

            {/* BJJ Kids Orange/White */}
            <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-200/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-1">Orange/White</p>
                  <p className="text-2xl font-bold text-white">{kidsOrangeWhiteBelts}</p>
                  <p className="text-xs text-gray-500 mt-1">{kidsOrangeWhiteBeltsPercentage}</p>
                </div>
                <div className="p-2 bg-orange-200/20 rounded-lg shadow-md">
                  <span className="text-xl text-orange-200">🥋</span>
                </div>
              </div>
            </div>

            {/* BJJ Kids Orange */}
            <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-1">Orange</p>
                  <p className="text-2xl font-bold text-white">{kidsOrangeBelts}</p>
                  <p className="text-xs text-gray-500 mt-1">{kidsOrangeBeltsPercentage}</p>
                </div>
                <div className="p-2 bg-orange-500/20 rounded-lg shadow-md">
                  <span className="text-xl text-orange-500">🥋</span>
                </div>
              </div>
            </div>

            {/* BJJ Kids Orange/Black */}
            <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-700/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-1">Orange/Black</p>
                  <p className="text-2xl font-bold text-white">{kidsOrangeBlackBelts}</p>
                  <p className="text-xs text-gray-500 mt-1">{kidsOrangeBlackBeltsPercentage}</p>
                </div>
                <div className="p-2 bg-orange-700/20 rounded-lg shadow-md">
                  <span className="text-xl text-orange-700">🥋</span>
                </div>
              </div>
            </div>

            {/* BJJ Kids Green/White */}
            <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-200/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-1">Green/White</p>
                  <p className="text-2xl font-bold text-white">{kidsGreenWhiteBelts}</p>
                  <p className="text-xs text-gray-500 mt-1">{kidsGreenWhiteBeltsPercentage}</p>
                </div>
                <div className="p-2 bg-green-200/20 rounded-lg shadow-md">
                  <span className="text-xl text-green-200">🥋</span>
                </div>
              </div>
            </div>

            {/* BJJ Kids Green */}
            <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-1">Green</p>
                  <p className="text-2xl font-bold text-white">{kidsGreenBelts}</p>
                  <p className="text-xs text-gray-500 mt-1">{kidsGreenBeltsPercentage}</p>
                </div>
                <div className="p-2 bg-green-500/20 rounded-lg shadow-md">
                  <span className="text-xl text-green-500">🥋</span>
                </div>
              </div>
            </div>

            {/* BJJ Kids Green/Black */}
            <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-700/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-1">Green/Black</p>
                  <p className="text-2xl font-bold text-white">{kidsGreenBlackBelts}</p>
                  <p className="text-xs text-gray-500 mt-1">{kidsGreenBlackBeltsPercentage}</p>
                </div>
                <div className="p-2 bg-green-700/20 rounded-lg shadow-md">
                  <span className="text-xl text-green-700">🥋</span>
                </div>
              </div>
            </div>
            </div>
          </div>

          {/* Judo Kids Belts Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <span className="mr-2">🥋</span>
              JUDO KIDS (Under 15)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {/* Judo Kids White */}
            <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-gray-200/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-1">White</p>
                  <p className="text-2xl font-bold text-white">{judoKidsWhiteBelts}</p>
                  <p className="text-xs text-gray-500 mt-1">{judoKidsWhiteBeltsPercentage}</p>
                </div>
                <div className="p-2 bg-gray-200/20 rounded-lg shadow-md">
                  <span className="text-xl text-gray-200">🥋</span>
                </div>
              </div>
            </div>

            {/* Judo Kids White/Yellow */}
            <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-yellow-100/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-1">White/Yellow</p>
                  <p className="text-2xl font-bold text-white">{judoKidsWhiteYellowBelts}</p>
                  <p className="text-xs text-gray-500 mt-1">{judoKidsWhiteYellowBeltsPercentage}</p>
                </div>
                <div className="p-2 bg-yellow-100/20 rounded-lg shadow-md">
                  <span className="text-xl text-yellow-100">🥋</span>
                </div>
              </div>
            </div>

            {/* Judo Kids Yellow */}
            <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-yellow-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-1">Yellow</p>
                  <p className="text-2xl font-bold text-white">{judoKidsYellowBelts}</p>
                  <p className="text-xs text-gray-500 mt-1">{judoKidsYellowBeltsPercentage}</p>
                </div>
                <div className="p-2 bg-yellow-500/20 rounded-lg shadow-md">
                  <span className="text-xl text-yellow-500">🥋</span>
                </div>
              </div>
            </div>

            {/* Judo Kids Yellow/Orange */}
            <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-300/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-1">Yellow/Orange</p>
                  <p className="text-2xl font-bold text-white">{judoKidsYellowOrangeBelts}</p>
                  <p className="text-xs text-gray-500 mt-1">{judoKidsYellowOrangeBeltsPercentage}</p>
                </div>
                <div className="p-2 bg-orange-300/20 rounded-lg shadow-md">
                  <span className="text-xl text-orange-300">🥋</span>
                </div>
              </div>
            </div>

            {/* Judo Kids Orange */}
            <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-1">Orange</p>
                  <p className="text-2xl font-bold text-white">{judoKidsOrangeBelts}</p>
                  <p className="text-xs text-gray-500 mt-1">{judoKidsOrangeBeltsPercentage}</p>
                </div>
                <div className="p-2 bg-orange-500/20 rounded-lg shadow-md">
                  <span className="text-xl text-orange-500">🥋</span>
                </div>
              </div>
            </div>

            {/* Judo Kids Orange/Green */}
            <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-300/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-1">Orange/Green</p>
                  <p className="text-2xl font-bold text-white">{judoKidsOrangeGreenBelts}</p>
                  <p className="text-xs text-gray-500 mt-1">{judoKidsOrangeGreenBeltsPercentage}</p>
                </div>
                <div className="p-2 bg-green-300/20 rounded-lg shadow-md">
                  <span className="text-xl text-green-300">🥋</span>
                </div>
              </div>
            </div>

            {/* Judo Kids Green */}
            <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-1">Green</p>
                  <p className="text-2xl font-bold text-white">{judoKidsGreenBelts}</p>
                  <p className="text-xs text-gray-500 mt-1">{judoKidsGreenBeltsPercentage}</p>
                </div>
                <div className="p-2 bg-green-500/20 rounded-lg shadow-md">
                  <span className="text-xl text-green-500">🥋</span>
                </div>
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
                  <optgroup label="Adult Belts" className="bg-gray-800">
                    <option value="white" className="bg-gray-800">{t('white')}</option>
                    <option value="blue" className="bg-gray-800">{t('blue')}</option>
                    <option value="purple" className="bg-gray-800">{t('purple')}</option>
                    <option value="brown" className="bg-gray-800">{t('brown')}</option>
                    <option value="black" className="bg-gray-800">{t('black')}</option>
                  </optgroup>
                  <optgroup label="Kids Belts (BJJ - Under 16)" className="bg-gray-800">
                    <option value="kids-white" className="bg-gray-800">White</option>
                    <option value="kids-gray-white" className="bg-gray-800">Gray/White</option>
                    <option value="kids-gray" className="bg-gray-800">Solid Gray</option>
                    <option value="kids-gray-black" className="bg-gray-800">Gray/Black</option>
                    <option value="kids-yellow-white" className="bg-gray-800">Yellow/White</option>
                    <option value="kids-yellow" className="bg-gray-800">Solid Yellow</option>
                    <option value="kids-yellow-black" className="bg-gray-800">Yellow/Black</option>
                    <option value="kids-orange-white" className="bg-gray-800">Orange/White</option>
                    <option value="kids-orange" className="bg-gray-800">Solid Orange</option>
                    <option value="kids-orange-black" className="bg-gray-800">Orange/Black</option>
                    <option value="kids-green-white" className="bg-gray-800">Green/White</option>
                    <option value="kids-green" className="bg-gray-800">Solid Green</option>
                    <option value="kids-green-black" className="bg-gray-800">Green/Black</option>
                  </optgroup>
                  <optgroup label="Kids Belts (Judo - Under 15)" className="bg-gray-800">
                    <option value="judo-kids-white" className="bg-gray-800">White</option>
                    <option value="judo-kids-white-yellow" className="bg-gray-800">White/Yellow</option>
                    <option value="judo-kids-yellow" className="bg-gray-800">Yellow</option>
                    <option value="judo-kids-yellow-orange" className="bg-gray-800">Yellow/Orange</option>
                    <option value="judo-kids-orange" className="bg-gray-800">Orange</option>
                    <option value="judo-kids-orange-green" className="bg-gray-800">Orange/Green</option>
                    <option value="judo-kids-green" className="bg-gray-800">Green</option>
                  </optgroup>
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

              {/* Kids Filter */}
              <div className="relative">
                <select
                  value={kidsFilter}
                  onChange={(e) => setKidsFilter(e.target.value)}
                  className="appearance-none bg-white/10 border border-white/20 rounded-xl text-white px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 min-w-[140px]"
                >
                  <option value="all" className="bg-gray-800">All Students</option>
                  <option value="kids" className="bg-gray-800">Kids Only</option>
                  <option value="adults" className="bg-gray-800">Adults Only</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-400">👶</span>
                </div>
              </div>

              {/* Weight Division Filter */}
              <div className="relative">
                <select
                  value={weightDivisionFilter}
                  onChange={(e) => setWeightDivisionFilter(e.target.value)}
                  className="appearance-none bg-white/10 border border-white/20 rounded-xl text-white px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 min-w-[140px]"
                >
                  <option value="all" className="bg-gray-800">All Divisions</option>
                  <option value="assigned" className="bg-gray-800">Assigned Only</option>
                  <option value="unassigned" className="bg-gray-800">Unassigned Only</option>
                  {weightDivisions.filter(d => d.active).map(division => (
                    <option key={division.divisionId} value={division.divisionId} className="bg-gray-800">
                      {division.name} ({division.gender === 'both' ? 'All' : division.gender})
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-400">⚖️</span>
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
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Weight</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-400">
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
                        {student.beltLevel.startsWith('kids-') 
                          ? `${student.beltLevel.replace('kids-', '').replace('-', '/').split('/').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('/')} Belt`
                          : student.beltLevel.startsWith('judo-kids-')
                          ? `Judo ${student.beltLevel.replace('judo-kids-', '').replace('-', '/').split('/').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('/')} Belt`
                          : `${student.beltLevel.charAt(0).toUpperCase() + student.beltLevel.slice(1)} Belt`
                        }
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">
                        {student.weight ? `${student.weight} kg` : 'Not set'}
                      </div>
                      <div className="text-xs text-gray-400">
                        {getWeightDivisionName(student.weightDivisionId)}
                      </div>
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
