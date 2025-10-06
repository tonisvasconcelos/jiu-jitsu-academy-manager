import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useChampionships } from '../contexts/ChampionshipContext'
import { useFightAssociations } from '../contexts/FightAssociationContext'
import { useFightModalities } from '../contexts/FightModalityContext'
import { useLanguage } from '../contexts/LanguageContext'

const ChampionshipRegistration: React.FC = () => {
  const { t } = useLanguage()
  const { championships = [], deleteChampionship } = useChampionships()
  const { fightAssociations: associations = [] } = useFightAssociations()
  const { modalities = [] } = useFightModalities()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [associationFilter, setAssociationFilter] = useState<string>('all')

  const filteredChampionships = championships.filter(championship => {
    const association = associations.find(a => a.associationId === championship.associationId)
    const modality = modalities.find(m => m.modalityId === championship.fightModality)
    
    const matchesSearch = 
      championship.championshipId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      championship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      championship.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      association?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      modality?.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || championship.status === statusFilter
    const matchesAssociation = associationFilter === 'all' || championship.associationId === associationFilter
    
    return matchesSearch && matchesStatus && matchesAssociation
  })

  const getAssociationName = (associationId: string) => {
    const association = associations.find(a => a.associationId === associationId)
    return association ? association.name : 'Unknown Association'
  }

  const getModalityName = (modalityId: string) => {
    const modality = modalities.find(m => m.modalityId === modalityId)
    return modality ? modality.name : 'Unknown Modality'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-500/20 text-blue-400 border-blue-400/30'
      case 'ongoing': return 'bg-green-500/20 text-green-400 border-green-400/30'
      case 'completed': return 'bg-gray-500/20 text-gray-400 border-gray-400/30'
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-400/30'
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
                <span className="mr-3 text-5xl">🥇</span>
                {t('championship-registration')}
              </h1>
              <p className="text-gray-400 text-lg">{t('manage-championship-registrations')}</p>
            </div>
            <Link
              to="/championships/registration/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center"
            >
              <span className="mr-2">+</span>
              {t('new-championship')}
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
                placeholder={t('search-championships')}
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
                <option value="upcoming">{t('upcoming')}</option>
                <option value="ongoing">{t('ongoing')}</option>
                <option value="completed">{t('completed')}</option>
                <option value="cancelled">{t('cancelled')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('association')}</label>
              <select
                value={associationFilter}
                onChange={(e) => setAssociationFilter(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">{t('all-associations')}</option>
                {associations.map((association) => (
                  <option key={association.associationId} value={association.associationId}>
                    {association.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Championships List */}
        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('championship-id')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('championship-name')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('association')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('championship-location')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('start-date')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('fight-modality')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('status')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredChampionships.map((championship) => (
                  <tr key={championship.championshipId} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-sm text-white font-mono">{championship.championshipId}</td>
                    <td className="px-6 py-4 text-sm text-white font-medium">{championship.name}</td>
                    <td className="px-6 py-4 text-sm text-white">{getAssociationName(championship.associationId)}</td>
                    <td className="px-6 py-4 text-sm text-white">{championship.location}</td>
                    <td className="px-6 py-4 text-sm text-white">{formatDate(championship.startDate)}</td>
                    <td className="px-6 py-4 text-sm text-white">{getModalityName(championship.fightModality)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(championship.status)}`}>
                        {t(championship.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Link
                          to={`/championships/registration/view/${championship.championshipId}`}
                          className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 px-3 py-1 rounded-lg transition-colors text-sm"
                        >
                          {t('view')}
                        </Link>
                        <Link
                          to={`/championships/registration/edit/${championship.championshipId}`}
                          className="bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 px-3 py-1 rounded-lg transition-colors text-sm"
                        >
                          {t('edit')}
                        </Link>
                        <button
                          onClick={() => {
                            if (window.confirm(t('confirm-delete-championship'))) {
                              deleteChampionship(championship.championshipId)
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
          
          {filteredChampionships.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🥇</div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">{t('no-championships-found')}</h3>
              <p className="text-gray-400 mb-6">{t('no-championships-found-description')}</p>
              <Link
                to="/championships/registration/new"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-300 inline-flex items-center"
              >
                <span className="mr-2">+</span>
                {t('create-first-championship')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChampionshipRegistration
