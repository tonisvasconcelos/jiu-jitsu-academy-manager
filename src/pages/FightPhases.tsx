import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useFightPhases } from '../contexts/FightPhaseContext'
import { useChampionships } from '../contexts/ChampionshipContext'

const FightPhases: React.FC = () => {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { phases, deletePhase } = useFightPhases()
  const { championships } = useChampionships()

  const [searchTerm, setSearchTerm] = useState('')
  const [championshipFilter, setChampionshipFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const getChampionshipName = (championshipId: string) => {
    const championship = championships.find(c => c.championshipId === championshipId)
    return championship ? championship.name : 'Unknown Championship'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'completed': return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getPhaseTypeColor = (type: string) => {
    switch (type) {
      case 'elimination': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'round-robin': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'bracket': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'pool': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const filteredPhases = phases.filter(phase => {
    const championshipName = getChampionshipName(phase.championshipId).toLowerCase()
    
    const matchesSearch = 
      phase.phaseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phase.phaseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      championshipName.includes(searchTerm.toLowerCase())
    
    const matchesChampionship = championshipFilter === 'all' || phase.championshipId === championshipFilter
    const matchesStatus = statusFilter === 'all' || phase.status === statusFilter
    
    return matchesSearch && matchesChampionship && matchesStatus
  })

  const handleDelete = (phaseId: string) => {
    if (window.confirm(t('confirm-delete-phase'))) {
      deletePhase(phaseId)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center">
            <Link
              to="/championships"
              className="mr-4 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-105"
              title={t('back-to-championships')}
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
                <span className="mr-3 text-5xl">🥊</span>
                {t('fight-phases')}
              </h1>
              <p className="text-gray-400 text-lg">{t('manage-phases')}</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-400 text-sm font-medium mb-1">Total Phases</p>
                <p className="text-3xl font-bold text-white">{phases.length}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <span className="text-2xl">🥊</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 text-sm font-medium mb-1">Active</p>
                <p className="text-3xl font-bold text-white">
                  {phases.filter(phase => phase.status === 'active').length}
                </p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-xl">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-400 text-sm font-medium mb-1">Scheduled</p>
                <p className="text-3xl font-bold text-white">
                  {phases.filter(phase => phase.status === 'scheduled').length}
                </p>
              </div>
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-400 text-sm font-medium mb-1">Completed</p>
                <p className="text-3xl font-bold text-white">
                  {phases.filter(phase => phase.status === 'completed').length}
                </p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <span className="text-2xl">🏆</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <input
                type="text"
                placeholder={t('search-phases')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <select
                value={championshipFilter}
                onChange={(e) => setChampionshipFilter(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Championships</option>
                {championships.map((championship) => (
                  <option key={championship.championshipId} value={championship.championshipId}>
                    {championship.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="scheduled">{t('scheduled')}</option>
                <option value="active">{t('active')}</option>
                <option value="completed">{t('completed')}</option>
                <option value="cancelled">{t('cancelled')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Link
              to="/championships/fight-phases/new"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center"
            >
              <span className="mr-2">➕</span>
              {t('new-fight-phase')}
            </Link>
          </div>
        </div>

        {/* Phases Table */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
          {filteredPhases.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🥊</div>
              <h3 className="text-xl font-semibold text-white mb-2">{t('no-phases-found')}</h3>
              <p className="text-gray-400 mb-6">{t('no-phases-found-description')}</p>
              <Link
                to="/championships/fight-phases/new"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg inline-flex items-center"
              >
                <span className="mr-2">➕</span>
                {t('create-first-phase')}
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('phase-id')}</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('phase-name')}</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Championship</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('phase-type')}</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('phase-order')}</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('phase-status')}</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('phase-start-date')}</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredPhases.map((phase) => (
                    <tr key={phase.phaseId} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-sm text-white font-mono">{phase.phaseId}</td>
                      <td className="px-6 py-4 text-sm text-white font-semibold">{phase.phaseName}</td>
                      <td className="px-6 py-4 text-sm text-white">{getChampionshipName(phase.championshipId)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPhaseTypeColor(phase.phaseType)}`}>
                          {t(phase.phaseType)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-white">{phase.phaseOrder}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(phase.status)}`}>
                          {t(phase.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-white">{new Date(phase.startDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm text-white">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/championships/fight-phases/view/${phase.phaseId}`}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition-colors text-xs"
                          >
                            {t('view')}
                          </Link>
                          <Link
                            to={`/championships/fight-phases/edit/${phase.phaseId}`}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg transition-colors text-xs"
                          >
                            {t('edit')}
                          </Link>
                          <button
                            onClick={() => handleDelete(phase.phaseId)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg transition-colors text-xs"
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
          )}
        </div>
      </div>
    </div>
  )
}

export default FightPhases
