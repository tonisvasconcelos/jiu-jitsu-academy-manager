import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useTeachers } from '../contexts/TeacherContext'
import { useBranches } from '../contexts/BranchContext'
import { useFightModalities } from '../contexts/FightModalityContext'
import { useWeightDivisions } from '../contexts/WeightDivisionContext'
import * as XLSX from 'xlsx'

const TeacherRegistration: React.FC = () => {
  const { t } = useLanguage()
  const { teachers, deleteTeacher } = useTeachers()
  const { branches } = useBranches()
  const { modalities } = useFightModalities()
  const { weightDivisions } = useWeightDivisions()
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [beltFilter, setBeltFilter] = useState('all')
  const [genderFilter, setGenderFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [branchFilter, setBranchFilter] = useState('all')
  const [teacherTypeFilter, setTeacherTypeFilter] = useState('all')
  const [modalityFilter, setModalityFilter] = useState('all')
  const [weightDivisionFilter, setWeightDivisionFilter] = useState('all')
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getBranchName = (branchId: string) => {
    const branch = branches.find(b => b.branchId === branchId)
    return branch ? branch.name : 'Unknown Branch'
  }

  const getModalityNames = (modalityIds: string[]) => {
    return modalityIds.map(id => {
      const modality = modalities.find(m => m.modalityId === id)
      return modality ? modality.name : 'Unknown Modality'
    }).join(', ')
  }

  const getWeightDivisionName = (weightDivisionId: string) => {
    const division = weightDivisions.find(wd => wd.divisionId === weightDivisionId)
    return division ? division.name : 'Unassigned'
  }

  const getBeltColor = (beltLevel: string | undefined) => {
    if (!beltLevel) return 'bg-gray-200 text-gray-800'
    
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
      'kids-gray-black': 'bg-gray-500 text-white',
      'kids-yellow-white': 'bg-yellow-200 text-gray-800',
      'kids-yellow': 'bg-yellow-400 text-white',
      'kids-yellow-black': 'bg-yellow-600 text-white',
      'kids-orange-white': 'bg-orange-200 text-gray-800',
      'kids-orange': 'bg-orange-400 text-white',
      'kids-orange-black': 'bg-orange-600 text-white',
      'kids-green-white': 'bg-green-200 text-gray-800',
      'kids-green': 'bg-green-400 text-white',
      'kids-green-black': 'bg-green-600 text-white',
      
      // Judo Kids belts
      'judo-kids-white': 'bg-gray-200 text-gray-800',
      'judo-kids-white-yellow': 'bg-yellow-200 text-gray-800',
      'judo-kids-yellow': 'bg-yellow-400 text-white',
      'judo-kids-yellow-orange': 'bg-orange-300 text-white',
      'judo-kids-orange': 'bg-orange-400 text-white',
      'judo-kids-orange-green': 'bg-green-300 text-white',
      'judo-kids-green': 'bg-green-400 text-white'
    }
    return colors[beltLevel.toLowerCase() as keyof typeof colors] || 'bg-gray-200 text-gray-800'
  }

  const getBeltDisplayName = (beltLevel: string | undefined) => {
    if (!beltLevel) return 'Unknown Belt'
    
    const beltNames = {
      // Adult belts
      white: 'White Belt',
      blue: 'Blue Belt',
      purple: 'Purple Belt',
      brown: 'Brown Belt',
      black: 'Black Belt',
      
      // BJJ Kids belts
      'kids-white': 'White (BJJ Kids)',
      'kids-gray-white': 'Gray/White (BJJ Kids)',
      'kids-gray': 'Gray (BJJ Kids)',
      'kids-gray-black': 'Gray/Black (BJJ Kids)',
      'kids-yellow-white': 'Yellow/White (BJJ Kids)',
      'kids-yellow': 'Yellow (BJJ Kids)',
      'kids-yellow-black': 'Yellow/Black (BJJ Kids)',
      'kids-orange-white': 'Orange/White (BJJ Kids)',
      'kids-orange': 'Orange (BJJ Kids)',
      'kids-orange-black': 'Orange/Black (BJJ Kids)',
      'kids-green-white': 'Green/White (BJJ Kids)',
      'kids-green': 'Green (BJJ Kids)',
      'kids-green-black': 'Green/Black (BJJ Kids)',
      
      // Judo Kids belts
      'judo-kids-white': 'White (Judo Kids)',
      'judo-kids-white-yellow': 'White/Yellow (Judo Kids)',
      'judo-kids-yellow': 'Yellow (Judo Kids)',
      'judo-kids-yellow-orange': 'Yellow/Orange (Judo Kids)',
      'judo-kids-orange': 'Orange (Judo Kids)',
      'judo-kids-orange-green': 'Orange/Green (Judo Kids)',
      'judo-kids-green': 'Green (Judo Kids)'
    }
    return beltNames[beltLevel.toLowerCase() as keyof typeof beltNames] || 'Unknown Belt'
  }

  const getTeacherTypeColor = (teacherType: string) => {
    const colors = {
      professor: 'bg-purple-500/20 text-purple-400',
      instructor: 'bg-blue-500/20 text-blue-400',
      trainee: 'bg-green-500/20 text-green-400'
    }
    return colors[teacherType as keyof typeof colors] || 'bg-gray-500/20 text-gray-400'
  }

  const getTeacherTypeDisplayName = (teacherType: string) => {
    const names = {
      professor: 'Prof.',
      instructor: 'Instructor',
      trainee: 'Trainee'
    }
    return names[teacherType as keyof typeof names] || teacherType
  }

  const handleDeleteTeacher = (teacherId: string) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      deleteTeacher(teacherId)
    }
  }

  const handleExportToExcel = () => {
    const exportData = teachers.map(teacher => {
      const branch = branches.find(b => b.branchId === teacher.branchId)
      const modalityNames = getModalityNames(teacher.fightModalities)
      const weightDivision = weightDivisions.find(wd => wd.divisionId === teacher.weightDivisionId)
      
      return {
        'Teacher ID': teacher.teacherId,
        'Name': teacher.displayName,
        'Teacher Type': getTeacherTypeDisplayName(teacher.teacherType),
        'Belt Level': getBeltDisplayName(teacher.beltLevel),
        'Document ID': teacher.documentId,
        'Email': teacher.email,
        'Phone': teacher.phone,
        'Branch': branch ? branch.name : 'Unknown',
        'Fight Modalities': modalityNames,
        'Experience (Years)': teacher.experience,
        'Hire Date': teacher.hireDate,
        'Weight Division': weightDivision ? weightDivision.name : 'Unassigned',
        'Active': teacher.active ? 'Yes' : 'No',
        'Bio': teacher.bio || ''
      }
    })

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(exportData)

    // Set column widths
    const colWidths = [
      { wch: 12 }, // Teacher ID
      { wch: 20 }, // Name
      { wch: 12 }, // Teacher Type
      { wch: 18 }, // Belt Level
      { wch: 15 }, // Document ID
      { wch: 25 }, // Email
      { wch: 15 }, // Phone
      { wch: 15 }, // Branch
      { wch: 30 }, // Fight Modalities
      { wch: 15 }, // Experience
      { wch: 12 }, // Hire Date
      { wch: 15 }, // Weight Division
      { wch: 8 },  // Active
      { wch: 50 }  // Bio
    ]
    ws['!cols'] = colWidths

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Teachers')

    // Save file
    XLSX.writeFile(wb, 'teachers_export.xlsx')
  }

  const handleImportFromExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        console.log('Imported data:', jsonData)
        // Here you would process the imported data and add teachers
        alert(`Successfully imported ${jsonData.length} teachers from Excel file.`)
      } catch (error) {
        console.error('Error importing Excel file:', error)
        alert('Error importing Excel file. Please check the file format.')
      }
    }
    reader.readAsArrayBuffer(file)
  }

  // Filter teachers based on search and filter criteria
  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = 
      teacher.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.documentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.phone.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesBelt = beltFilter === 'all' || teacher.beltLevel === beltFilter
    const matchesGender = genderFilter === 'all' || teacher.gender === genderFilter
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && teacher.active) ||
      (statusFilter === 'inactive' && !teacher.active)
    const matchesBranch = branchFilter === 'all' || teacher.branchId === branchFilter
    const matchesTeacherType = teacherTypeFilter === 'all' || teacher.teacherType === teacherTypeFilter
    const matchesModality = modalityFilter === 'all' || teacher.fightModalities.includes(modalityFilter)
    const matchesWeightDivision = 
      weightDivisionFilter === 'all' ||
      (weightDivisionFilter === 'assigned' && teacher.weightDivisionId) ||
      (weightDivisionFilter === 'unassigned' && !teacher.weightDivisionId) ||
      (teacher.weightDivisionId === weightDivisionFilter)

    return matchesSearch && matchesBelt && matchesGender && matchesStatus && matchesBranch && matchesTeacherType && matchesModality && matchesWeightDivision
  })

  const hasActiveFilters = searchTerm !== '' || beltFilter !== 'all' || genderFilter !== 'all' || statusFilter !== 'all' || branchFilter !== 'all' || teacherTypeFilter !== 'all' || modalityFilter !== 'all' || weightDivisionFilter !== 'all'

  // Calculate teacher counts
  const totalTeachers = teachers.length
  const activeTeachers = teachers.filter(t => t.active).length
  const filteredTotalTeachers = filteredTeachers.length
  
  // Teacher type counts
  const professors = filteredTeachers.filter(t => t.teacherType === 'professor').length
  const instructors = filteredTeachers.filter(t => t.teacherType === 'instructor').length
  const trainees = filteredTeachers.filter(t => t.teacherType === 'trainee').length

  // Calculate percentages
  const getPercentage = (count: number) => {
    if (filteredTotalTeachers === 0) return '0%'
    return `${Math.round((count / filteredTotalTeachers) * 100)}%`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Teachers & Instructors</h1>
            <p className="text-gray-400">Manage all teacher-related activities and information</p>
          </div>
          <div className="flex flex-wrap gap-3 mt-4 lg:mt-0">
            <Link
              to="/students"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Coach & Students
            </Link>
            <Link
              to="/teachers/new"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Teacher
            </Link>
            <button
              onClick={handleExportToExcel}
              className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-teal-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              title="Export Excel"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              title="Import Excel"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleImportFromExcel}
              className="hidden"
            />
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Total Teachers</p>
                <p className="text-3xl font-bold text-white">{totalTeachers}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Active Teachers</p>
                <p className="text-3xl font-bold text-white">{activeTeachers}</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-xl">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Professors</p>
                <p className="text-3xl font-bold text-white">{professors}</p>
                <p className="text-xs text-gray-500 mt-1">{getPercentage(professors)}</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Instructors</p>
                <p className="text-3xl font-bold text-white">{instructors}</p>
                <p className="text-xs text-gray-500 mt-1">{getPercentage(instructors)}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Teacher Type Counts */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Teacher Type Distribution</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Professors */}
            {professors > 0 && (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">Professors</p>
                    <p className="text-2xl font-bold text-white">{professors}</p>
                    <p className="text-xs text-gray-500 mt-1">{getPercentage(professors)}</p>
                  </div>
                  <div className="p-3 bg-purple-500/20 rounded-xl">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* Instructors */}
            {instructors > 0 && (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">Instructors</p>
                    <p className="text-2xl font-bold text-white">{instructors}</p>
                    <p className="text-xs text-gray-500 mt-1">{getPercentage(instructors)}</p>
                  </div>
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* Trainees */}
            {trainees > 0 && (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">Trainees</p>
                    <p className="text-2xl font-bold text-white">{trainees}</p>
                    <p className="text-xs text-gray-500 mt-1">{getPercentage(trainees)}</p>
                  </div>
                  <div className="p-3 bg-green-500/20 rounded-xl">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modern Filter Bar */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search teachers by name, email, document, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap gap-3">
              <select
                value={teacherTypeFilter}
                onChange={(e) => setTeacherTypeFilter(e.target.value)}
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="professor">Professors</option>
                <option value="instructor">Instructors</option>
                <option value="trainee">Trainees</option>
              </select>

              <select
                value={beltFilter}
                onChange={(e) => setBeltFilter(e.target.value)}
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Belts</option>
                <option value="white">White Belt</option>
                <option value="blue">Blue Belt</option>
                <option value="purple">Purple Belt</option>
                <option value="brown">Brown Belt</option>
                <option value="black">Black Belt</option>
              </select>

              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Branches</option>
                {branches.map(branch => (
                  <option key={branch.branchId} value={branch.branchId}>
                    {branch.name}
                  </option>
                ))}
              </select>

              <select
                value={modalityFilter}
                onChange={(e) => setModalityFilter(e.target.value)}
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Modalities</option>
                {modalities.map(modality => (
                  <option key={modality.modalityId} value={modality.modalityId}>
                    {modality.name}
                  </option>
                ))}
              </select>

              <select
                value={weightDivisionFilter}
                onChange={(e) => setWeightDivisionFilter(e.target.value)}
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Divisions</option>
                <option value="assigned">Assigned</option>
                <option value="unassigned">Unassigned</option>
                {weightDivisions.map(division => (
                  <option key={division.divisionId} value={division.divisionId}>
                    {division.name}
                  </option>
                ))}
              </select>

              {hasActiveFilters && (
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setBeltFilter('all')
                    setGenderFilter('all')
                    setStatusFilter('all')
                    setBranchFilter('all')
                    setTeacherTypeFilter('all')
                    setModalityFilter('all')
                    setWeightDivisionFilter('all')
                  }}
                  className="px-4 py-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 hover:bg-red-500/30 transition-all duration-300"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Teachers Table */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Teacher</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Belt Level</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Branch</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Modalities</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Experience</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Weight Division</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredTeachers.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-4 text-center text-gray-400">
                      {hasActiveFilters ? 'No teachers match the current filters.' : 'No teachers registered yet.'}
                    </td>
                  </tr>
                ) : (
                  filteredTeachers.map((teacher) => (
                    <tr key={teacher.teacherId} className="hover:bg-white/5 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            {teacher.photoUrl ? (
                              <img
                                className="h-12 w-12 rounded-full object-cover"
                                src={teacher.photoUrl}
                                alt={teacher.displayName}
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <span className="text-white font-semibold text-lg">
                                  {teacher.firstName.charAt(0)}{teacher.lastName.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{teacher.displayName}</div>
                            <div className="text-sm text-gray-400">{teacher.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTeacherTypeColor(teacher.teacherType)}`}>
                          {getTeacherTypeDisplayName(teacher.teacherType)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getBeltColor(teacher.beltLevel)}`}>
                          {getBeltDisplayName(teacher.beltLevel)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {getBranchName(teacher.branchId)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <div className="max-w-xs">
                          <div className="text-xs text-gray-400 mb-1">
                            {teacher.fightModalities.length} modalit{teacher.fightModalities.length !== 1 ? 'ies' : 'y'}
                          </div>
                          <div className="text-xs text-gray-300 truncate">
                            {getModalityNames(teacher.fightModalities)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {teacher.experience} years
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {getWeightDivisionName(teacher.weightDivisionId || '')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {teacher.active ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-500/20 text-green-400">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-500/20 text-red-400">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            to={`/teachers/registration/view/${teacher.teacherId}`}
                            className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                            title="View Teacher"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Link>
                          <Link
                            to={`/teachers/registration/edit/${teacher.teacherId}`}
                            className="text-yellow-400 hover:text-yellow-300 transition-colors duration-200"
                            title="Edit Teacher"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          <button
                            onClick={() => handleDeleteTeacher(teacher.teacherId)}
                            className="text-red-400 hover:text-red-300 transition-colors duration-200"
                            title="Delete Teacher"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
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
      </div>
    </div>
  )
}

export default TeacherRegistration
