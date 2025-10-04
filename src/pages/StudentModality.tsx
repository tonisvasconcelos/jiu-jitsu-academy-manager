import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useStudents } from '../contexts/StudentContext'
import { useFightModalities } from '../contexts/FightModalityContext'
import { useStudentModalities, StudentModalityConnection } from '../contexts/StudentModalityContext'
import * as XLSX from 'xlsx'

const StudentModality: React.FC = () => {
  const { t } = useLanguage()
  const { students } = useStudents()
  const { modalities } = useFightModalities()
  const { connections, addConnection } = useStudentModalities()
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [studentFilter, setStudentFilter] = useState('all')
  const [modalityFilter, setModalityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  
  console.log('=== STUDENT MODALITY: RENDER ===')
  console.log('StudentModality: Current connections:', connections)
  console.log('StudentModality: Connections count:', connections.length)

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.studentId === studentId)
    return student ? student.displayName : 'Unknown Student'
  }

  const getModalityNames = (modalityIds: string[]) => {
    return modalityIds.map(id => {
      const modality = modalities.find(m => m.modalityId === id)
      return modality ? modality.name : 'Unknown Modality'
    }).join(', ')
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


  // Filter functions
  const clearAllFilters = () => {
    setSearchTerm('')
    setStudentFilter('all')
    setModalityFilter('all')
    setStatusFilter('all')
  }

  const filteredConnections = connections.filter(connection => {
    const student = students.find(s => s.studentId === connection.studentId)
    const modalityNames = getModalityNames(connection.modalityIds)
    
    // Search filter
    const matchesSearch = searchTerm === '' || 
      (student && (
        (student.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.lastName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.displayName || '').toLowerCase().includes(searchTerm.toLowerCase())
      )) ||
      (modalityNames || '').toLowerCase().includes(searchTerm.toLowerCase())

    // Student filter
    const matchesStudent = studentFilter === 'all' || connection.studentId === studentFilter

    // Modality filter
    const matchesModality = modalityFilter === 'all' || connection.modalityIds.includes(modalityFilter)

    // Status filter
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && connection.active) ||
      (statusFilter === 'inactive' && !connection.active)

    return matchesSearch && matchesStudent && matchesModality && matchesStatus
  })

  const hasActiveFilters = searchTerm !== '' || studentFilter !== 'all' || modalityFilter !== 'all' || statusFilter !== 'all'

  // Calculate statistics
  const totalConnections = connections.length
  const activeConnections = connections.filter(c => c.active).length
  const uniqueStudents = new Set(connections.map(c => c.studentId)).size
  const uniqueModalities = new Set(connections.flatMap(c => c.modalityIds)).size

  const handleExportToExcel = () => {
    if (connections.length === 0) {
      alert('No connections to export!')
      return
    }

    // Prepare data for Excel export
    const exportData = connections.map(connection => {
      const student = students.find(s => s.studentId === connection.studentId)
      const modalityNames = getModalityNames(connection.modalityIds)
      
      return {
        'Connection ID': connection.connectionId,
        'Student Name': student ? student.displayName : 'Unknown',
        'Student ID': connection.studentId,
        'Modalities': modalityNames,
        'Belt Level at Start': getBeltDisplayName(connection.beltLevelAtStart),
        'Assignment Date': connection.assignmentDate,
        'Closing Date': connection.closingDate || '',
        'Expected Closing Date': connection.expectedClosingDate || '',
        'Active': connection.active ? 'Yes' : 'No',
        'Notes': connection.notes || ''
      }
    })

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(exportData)

    // Set column widths
    const colWidths = [
      { wch: 15 }, // Connection ID
      { wch: 20 }, // Student Name
      { wch: 12 }, // Student ID
      { wch: 30 }, // Modalities
      { wch: 18 }, // Belt Level at Start
      { wch: 15 }, // Assignment Date
      { wch: 15 }, // Closing Date
      { wch: 20 }, // Expected Closing Date
      { wch: 10 }, // Active
      { wch: 30 }  // Notes
    ]
    ws['!cols'] = colWidths

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Student Modalities')

    // Generate filename with current date
    const currentDate = new Date().toISOString().split('T')[0]
    const filename = `student_modalities_export_${currentDate}.xlsx`

    // Save file
    XLSX.writeFile(wb, filename)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-3">
                {t('modality-by-student')}
              </h1>
              <p className="text-lg text-gray-300 max-w-2xl">
                {t('student-modality-management')}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleExportToExcel}
                title={t('export-to-excel')}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 flex items-center justify-center"
              >
                <span className="text-lg">📊</span>
              </button>
              <Link
                to="/students/modality/new"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 flex items-center"
              >
                <span className="mr-2">➕</span>
                New Assignment
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Total Connections</p>
                <p className="text-3xl font-bold text-white">{totalConnections}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <span className="text-2xl">🔗</span>
              </div>
            </div>
          </div>

          <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Active Connections</p>
                <p className="text-3xl font-bold text-white">{activeConnections}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Students with Modalities</p>
                <p className="text-3xl font-bold text-white">{uniqueStudents}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>

          <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Modalities in Use</p>
                <p className="text-3xl font-bold text-white">{uniqueModalities}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
                <span className="text-2xl">🥋</span>
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
                  placeholder="Search connections..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap gap-3">
              {/* Student Filter */}
              <div className="relative">
                <select
                  value={studentFilter}
                  onChange={(e) => setStudentFilter(e.target.value)}
                  className="appearance-none bg-white/10 border border-white/20 rounded-xl text-white px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 min-w-[140px]"
                >
                  <option value="all" className="bg-gray-800">All Students</option>
                  {students.map(student => (
                    <option key={student.studentId} value={student.studentId} className="bg-gray-800">
                      {student.displayName}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-400">👤</span>
                </div>
              </div>

              {/* Modality Filter */}
              <div className="relative">
                <select
                  value={modalityFilter}
                  onChange={(e) => setModalityFilter(e.target.value)}
                  className="appearance-none bg-white/10 border border-white/20 rounded-xl text-white px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 min-w-[140px]"
                >
                  <option value="all" className="bg-gray-800">All Modalities</option>
                  {modalities.map(modality => (
                    <option key={modality.modalityId} value={modality.modalityId} className="bg-gray-800">
                      {modality.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-400">🥋</span>
                </div>
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none bg-white/10 border border-white/20 rounded-xl text-white px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 min-w-[140px]"
                >
                  <option value="all" className="bg-gray-800">All Status</option>
                  <option value="active" className="bg-gray-800">Active Only</option>
                  <option value="inactive" className="bg-gray-800">Inactive Only</option>
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
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Filter Results Summary */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-300">
                  Showing {filteredConnections.length} of {connections.length} connections
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchTerm && (
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs">
                      Search: "{searchTerm}"
                    </span>
                  )}
                  {studentFilter !== 'all' && (
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-xs">
                      Student: {getStudentName(studentFilter)}
                    </span>
                  )}
                  {modalityFilter !== 'all' && (
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs">
                      Modality: {modalities.find(m => m.modalityId === modalityFilter)?.name}
                    </span>
                  )}
                  {statusFilter !== 'all' && (
                    <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-lg text-xs">
                      Status: {statusFilter}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Connections Table */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-semibold text-white">Student Modality Connections</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Modalities</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Belt at Start</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Assignment Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Expected Closing</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredConnections.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-400">
                      {hasActiveFilters ? 'No connections match the current filters.' : 'No student modality connections yet.'}
                    </td>
                  </tr>
                ) : (
                  filteredConnections.map((connection) => {
                    const student = students.find(s => s.studentId === connection.studentId)
                    return (
                      <tr key={connection.connectionId} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {student?.photoUrl ? (
                                <img className="h-10 w-10 rounded-full object-cover" src={student.photoUrl} alt={student.displayName} />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                  <span className="text-white text-sm font-semibold">
                                    {student ? student.firstName.charAt(0) + student.lastName.charAt(0) : '??'}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">
                                {student ? student.displayName : 'Unknown Student'}
                              </div>
                              <div className="text-xs text-gray-400">ID: {connection.studentId}</div>
                              {student && student.beltLevel && (
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBeltColor(student.beltLevel)}`}>
                                  {t(student.beltLevel.toLowerCase())}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-white">
                            {getModalityNames(connection.modalityIds)}
                          </div>
                          <div className="text-xs text-gray-400">
                            {connection.modalityIds.length} modality{connection.modalityIds.length !== 1 ? 'ies' : 'y'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getBeltColor(connection.beltLevelAtStart)}`}>
                            {getBeltDisplayName(connection.beltLevelAtStart)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {new Date(connection.assignmentDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {connection.expectedClosingDate ? new Date(connection.expectedClosingDate).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {connection.active ? (
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
                          <div className="flex items-center justify-end space-x-4">
                            <Link
                              to={`/students/modality/view/${connection.connectionId}`}
                              className="text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              👁️ View
                            </Link>
                            <Link
                              to={`/students/modality/edit/${connection.connectionId}`}
                              className="text-green-400 hover:text-green-300 transition-colors"
                            >
                              ✏️ Edit
                            </Link>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentModality
