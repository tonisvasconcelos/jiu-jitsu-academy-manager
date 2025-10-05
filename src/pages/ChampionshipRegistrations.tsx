import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useChampionshipRegistrations } from '../contexts/ChampionshipRegistrationContext'
import { useStudents } from '../contexts/StudentContext'
import { useChampionships } from '../contexts/ChampionshipContext'
import { useChampionshipCategories } from '../contexts/ChampionshipCategoryContext'
import { useTeachers } from '../contexts/TeacherContext'
import { useLanguage } from '../contexts/LanguageContext'

const ChampionshipRegistrations: React.FC = () => {
  const { t } = useLanguage()
  const { registrations, deleteRegistration } = useChampionshipRegistrations()
  const { students } = useStudents()
  const { championships } = useChampionships()
  const { categories } = useChampionshipCategories()
  const { teachers } = useTeachers()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [championshipFilter, setChampionshipFilter] = useState<string>('all')

  const filteredRegistrations = registrations.filter(registration => {
    const student = students.find(s => s.studentId === registration.studentId)
    const championship = championships.find(c => c.championshipId === registration.championshipId)
    const category = categories.find(cat => cat.categoryId === registration.categoryId)
    const teacher = teachers.find(t => t.teacherId === registration.teacherId)
    
    const matchesSearch = 
      registration.registrationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      championship?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category?.weightCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher?.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || registration.status === statusFilter
    const matchesChampionship = championshipFilter === 'all' || registration.championshipId === championshipFilter
    
    return matchesSearch && matchesStatus && matchesChampionship
  })

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.studentId === studentId)
    return student ? `${student.firstName} ${student.lastName}` : 'Unknown Student'
  }

  const getChampionshipName = (championshipId: string) => {
    const championship = championships.find(c => c.championshipId === championshipId)
    return championship ? championship.name : 'Unknown Championship'
  }

  const getCategoryInfo = (categoryId: string) => {
    const category = categories.find(cat => cat.categoryId === categoryId)
    return category ? `${category.ageGroup} - ${category.belt} - ${category.weightCategory}` : 'Unknown Category'
  }

  const getTeacherName = (teacherId: string) => {
    const teacher = teachers.find(t => t.teacherId === teacherId)
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unknown Teacher'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30'
      case 'confirmed': return 'bg-green-500/20 text-green-400 border-green-400/30'
      case 'weighed-in': return 'bg-blue-500/20 text-blue-400 border-blue-400/30'
      case 'disqualified': return 'bg-red-500/20 text-red-400 border-red-400/30'
      case 'withdrawn': return 'bg-gray-500/20 text-gray-400 border-gray-400/30'
      case 'completed': return 'bg-purple-500/20 text-purple-400 border-purple-400/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-400/30'
    }
  }

  const getPaymentStatusColor = (status?: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500/20 text-green-400 border-green-400/30'
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30'
      case 'refunded': return 'bg-blue-500/20 text-blue-400 border-blue-400/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-400/30'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
                <span className="mr-3 text-5xl">📝</span>
                {t('registrations')}
              </h1>
              <p className="text-gray-400 text-lg">{t('manage-student-championship-registrations')}</p>
            </div>
            <Link
              to="/championships/registrations/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center"
            >
              <span className="mr-2">+</span>
              {t('new-registration')}
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('search')}</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('search-registrations')}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('status')}</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">{t('all-statuses')}</option>
                <option value="pending">{t('pending')}</option>
                <option value="confirmed">{t('confirmed')}</option>
                <option value="weighed-in">{t('weighed-in')}</option>
                <option value="disqualified">{t('disqualified')}</option>
                <option value="withdrawn">{t('withdrawn')}</option>
                <option value="completed">{t('completed')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('championship')}</label>
              <select
                value={championshipFilter}
                onChange={(e) => setChampionshipFilter(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">{t('all-championships')}</option>
                {championships.map((championship) => (
                  <option key={championship.championshipId} value={championship.championshipId}>
                    {championship.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Registrations List */}
        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('registration-id')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('student')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('championship')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('category')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('teacher')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('registration-date')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('status')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('payment-status')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredRegistrations.map((registration) => (
                  <tr key={registration.registrationId} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-sm text-white font-mono">{registration.registrationId}</td>
                    <td className="px-6 py-4 text-sm text-white">{getStudentName(registration.studentId)}</td>
                    <td className="px-6 py-4 text-sm text-white">{getChampionshipName(registration.championshipId)}</td>
                    <td className="px-6 py-4 text-sm text-white">{getCategoryInfo(registration.categoryId)}</td>
                    <td className="px-6 py-4 text-sm text-white">{getTeacherName(registration.teacherId)}</td>
                    <td className="px-6 py-4 text-sm text-white">{formatDate(registration.registrationDate)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(registration.status)}`}>
                        {t(registration.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {registration.paymentStatus && (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPaymentStatusColor(registration.paymentStatus)}`}>
                          {t(registration.paymentStatus)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Link
                          to={`/championships/registrations/view/${registration.registrationId}`}
                          className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 px-3 py-1 rounded-lg transition-colors text-sm"
                        >
                          {t('view')}
                        </Link>
                        <Link
                          to={`/championships/registrations/edit/${registration.registrationId}`}
                          className="bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 px-3 py-1 rounded-lg transition-colors text-sm"
                        >
                          {t('edit')}
                        </Link>
                        <button
                          onClick={() => {
                            if (window.confirm(t('confirm-delete-registration'))) {
                              deleteRegistration(registration.registrationId)
                            }
                          }}
                          className="bg-red-600/20 hover:bg-red-600/30 text-red-400 px-3 py-1 rounded-lg transition-colors text-sm"
                        >
                          {t('delete')}
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
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">{t('no-registrations-found')}</h3>
              <p className="text-gray-400 mb-6">{t('no-registrations-found-description')}</p>
              <Link
                to="/championships/registrations/new"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-300 inline-flex items-center"
              >
                <span className="mr-2">+</span>
                {t('create-first-registration')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChampionshipRegistrations
