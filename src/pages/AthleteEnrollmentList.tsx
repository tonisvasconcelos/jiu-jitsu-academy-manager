import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useChampionshipRegistrations } from '../contexts/ChampionshipRegistrationContext'
import { useChampionships } from '../contexts/ChampionshipContext'
import { useChampionshipCategories } from '../contexts/ChampionshipCategoryContext'
import { useStudents } from '../contexts/StudentContext'
import { useTeachers } from '../contexts/TeacherContext'

const AthleteEnrollmentList: React.FC = () => {
  const { t } = useLanguage()
  const { registrations, deleteRegistration } = useChampionshipRegistrations()
  const { championships } = useChampionships()
  const { categories } = useChampionshipCategories()
  const { students } = useStudents()
  const { teachers } = useTeachers()

  const [searchTerm, setSearchTerm] = useState('')
  const [championshipFilter, setChampionshipFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  // Get championship name
  const getChampionshipName = (championshipId: string) => {
    const championship = championships.find(c => c.championshipId === championshipId)
    return championship?.name || 'Unknown Championship'
  }

  // Get category name
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.categoryId === categoryId)
    return category ? `${category.weightCategory} - ${category.gender}` : 'Unknown Category'
  }

  // Get student name
  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.studentId === studentId)
    return student ? `${student.firstName} ${student.lastName}` : 'Unknown Student'
  }

  // Get teacher name
  const getTeacherName = (teacherId: string) => {
    const teacher = teachers.find(t => t.teacherId === teacherId)
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unknown Teacher'
  }

  // Filter registrations
  const filteredRegistrations = registrations.filter(registration => {
    const matchesSearch = 
      getStudentName(registration.studentId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getChampionshipName(registration.championshipId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCategoryName(registration.categoryId).toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesChampionship = championshipFilter === 'all' || registration.championshipId === championshipFilter
    const matchesStatus = statusFilter === 'all' || registration.status === statusFilter

    return matchesSearch && matchesChampionship && matchesStatus
  })

  const handleDelete = (registrationId: string) => {
    if (window.confirm(t('confirm-delete-registration'))) {
      deleteRegistration(registrationId)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'weighed-in': return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      case 'disqualified': return 'bg-red-500/20 text-red-300 border-red-500/30'
      case 'withdrawn': return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <Link
              to="/championships"
              className="group mr-6 p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all duration-300 hover:scale-105 border border-white/10 hover:border-white/20"
              title="Back to Championships"
            >
              <svg className="w-6 h-6 text-white group-hover:text-purple-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div className="flex items-center">
              <div className="p-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl mr-4 shadow-lg">
                <span className="text-3xl">👥</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-2">
                  {t('athlete-enrollment-list')}
                </h1>
                <p className="text-gray-300 text-lg font-medium">
                  {t('view-enrolled-athletes')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Total Enrollments</p>
                <p className="text-3xl font-bold text-white">{registrations.length}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <span className="text-2xl">📋</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Confirmed</p>
                <p className="text-3xl font-bold text-green-400">
                  {registrations.filter(r => r.status === 'confirmed').length}
                </p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-xl">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-400">
                  {registrations.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Active Championships</p>
                <p className="text-3xl font-bold text-purple-400">
                  {new Set(registrations.map(r => r.championshipId)).size}
                </p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <span className="text-2xl">🏆</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by student, championship, or category..."
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Championship</label>
              <select
                value={championshipFilter}
                onChange={(e) => setChampionshipFilter(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Championships</option>
                {championships.map(championship => (
                  <option key={championship.championshipId} value={championship.championshipId}>
                    {championship.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="weighed-in">Weighed In</option>
                <option value="disqualified">Disqualified</option>
                <option value="withdrawn">Withdrawn</option>
              </select>
            </div>

            <div className="flex items-end">
              <Link
                to="/championships/registrations/new"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center font-semibold"
              >
                <span className="mr-2">➕</span>
                New Enrollment
              </Link>
            </div>
          </div>
        </div>

        {/* Registrations Table */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Student</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Championship</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Teacher</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Registration Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredRegistrations.map((registration) => (
                  <tr key={registration.registrationId} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-sm text-white font-medium">
                      {getStudentName(registration.studentId)}
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {getChampionshipName(registration.championshipId)}
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {getCategoryName(registration.categoryId)}
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {getTeacherName(registration.teacherId)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(registration.status)}`}>
                        {registration.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {new Date(registration.registrationDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/championships/registrations/view/${registration.registrationId}`}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          View
                        </Link>
                        <Link
                          to={`/championships/registrations/edit/${registration.registrationId}`}
                          className="text-yellow-400 hover:text-yellow-300 transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(registration.registrationId)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRegistrations.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-400 text-lg mb-2">No athlete enrollments found</p>
              <p className="text-gray-500 text-sm">Create the first enrollment to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AthleteEnrollmentList
