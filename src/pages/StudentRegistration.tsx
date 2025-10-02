import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useStudents, Student } from '../contexts/StudentContext'
import * as XLSX from 'xlsx'

const StudentRegistration: React.FC = () => {
  const { t } = useLanguage()
  const { students, deleteStudent, clearAllStudents } = useStudents()
  
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

  const handleDeleteStudent = (studentId: string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      deleteStudent(studentId)
    }
  }

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to clear ALL student data? This cannot be undone!')) {
      clearAllStudents()
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
      'Gender': t(student.gender.toLowerCase()),
      'Belt Level': t(student.beltLevel.toLowerCase()),
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

  // Calculate belt counts
  const totalStudents = students.length
  const activeStudents = students.filter(s => s.active).length
  const blackBelts = students.filter(s => s.beltLevel.toLowerCase() === 'black').length
  const whiteBelts = students.filter(s => s.beltLevel.toLowerCase() === 'white').length
  const blueBelts = students.filter(s => s.beltLevel.toLowerCase() === 'blue').length
  const purpleBelts = students.filter(s => s.beltLevel.toLowerCase() === 'purple').length
  const brownBelts = students.filter(s => s.beltLevel.toLowerCase() === 'brown').length

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
            <div className="flex space-x-3">
              <button
                onClick={handleExportToExcel}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 flex items-center"
              >
                <span className="mr-2">📊</span>
                {t('export-to-excel')}
              </button>
              <button
                onClick={handleClearAllData}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 flex items-center"
              >
                <span className="mr-2">🗑️</span>
                Clear All
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
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Belt Level</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {students.map((student) => (
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentRegistration
