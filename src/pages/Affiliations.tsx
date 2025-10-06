import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAffiliations } from '../contexts/AffiliationContext'
import { useStudents } from '../contexts/StudentContext'
import { useFightAssociations } from '../contexts/FightAssociationContext'
import { useLanguage } from '../contexts/LanguageContext'

const Affiliations: React.FC = () => {
  const { t } = useLanguage()
  const { affiliations, deleteAffiliation } = useAffiliations()
  const { students } = useStudents()
  const { fightAssociations: associations = [] } = useFightAssociations()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredAffiliations = affiliations.filter(affiliation => {
    const student = students.find(s => s.studentId === affiliation.studentId)
    const association = associations.find(a => a.associationId === affiliation.associationId)
    const matchesSearch = 
      affiliation.affiliationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      affiliation.membershipNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      association?.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || affiliation.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.studentId === studentId)
    return student ? `${student.firstName} ${student.lastName}` : 'Unknown Student'
  }

  const getAssociationName = (associationId: string) => {
    const association = associations.find(a => a.associationId === associationId)
    return association ? association.name : 'Unknown Association'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-400/30'
      case 'inactive': return 'bg-gray-500/20 text-gray-400 border-gray-400/30'
      case 'suspended': return 'bg-red-500/20 text-red-400 border-red-400/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-400/30'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
                <span className="mr-3 text-5xl">🤝</span>
                {t('affiliations')}
              </h1>
              <p className="text-gray-400 text-lg">{t('manage-student-association-affiliations')}</p>
            </div>
            <Link
              to="/championships/affiliations/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center"
            >
              <span className="mr-2">+</span>
              {t('new-affiliation')}
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('search')}</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('search-affiliations')}
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
                <option value="active">{t('active')}</option>
                <option value="inactive">{t('inactive')}</option>
                <option value="suspended">{t('suspended')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Affiliations List */}
        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('affiliation-id')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('student')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('association')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('membership-number')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('affiliation-date')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('status')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredAffiliations.map((affiliation) => (
                  <tr key={affiliation.affiliationId} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-sm text-white font-mono">{affiliation.affiliationId}</td>
                    <td className="px-6 py-4 text-sm text-white">{getStudentName(affiliation.studentId)}</td>
                    <td className="px-6 py-4 text-sm text-white">{getAssociationName(affiliation.associationId)}</td>
                    <td className="px-6 py-4 text-sm text-white">{affiliation.membershipNumber || '-'}</td>
                    <td className="px-6 py-4 text-sm text-white">{affiliation.affiliationDate}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(affiliation.status)}`}>
                        {t(affiliation.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Link
                          to={`/championships/affiliations/view/${affiliation.affiliationId}`}
                          className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 px-3 py-1 rounded-lg transition-colors text-sm"
                        >
                          {t('view')}
                        </Link>
                        <Link
                          to={`/championships/affiliations/edit/${affiliation.affiliationId}`}
                          className="bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 px-3 py-1 rounded-lg transition-colors text-sm"
                        >
                          {t('edit')}
                        </Link>
                        <button
                          onClick={() => {
                            if (window.confirm(t('confirm-delete-affiliation'))) {
                              deleteAffiliation(affiliation.affiliationId)
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
          
          {filteredAffiliations.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">{t('no-affiliations-found')}</h3>
              <p className="text-gray-400 mb-6">{t('no-affiliations-found-description')}</p>
              <Link
                to="/championships/affiliations/new"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-300 inline-flex items-center"
              >
                <span className="mr-2">+</span>
                {t('create-first-affiliation')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Affiliations
