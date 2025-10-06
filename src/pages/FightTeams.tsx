import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useFightTeams } from '../contexts/FightTeamContext'
import { useLanguage } from '../contexts/LanguageContext'

const FightTeams: React.FC = () => {
  const { t } = useLanguage()
  const { fightTeams = [], deleteFightTeam } = useFightTeams()
  const [searchTerm, setSearchTerm] = useState('')
  const [branchFilter, setBranchFilter] = useState<string>('all')
  const [modalityFilter, setModalityFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredTeams = fightTeams.filter(team => {
    const matchesSearch = 
      team.teamId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.coachName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.branchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.modality.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesBranch = branchFilter === 'all' || team.branchId === branchFilter
    const matchesModality = modalityFilter === 'all' || team.modality === modalityFilter
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? team.isActive : !team.isActive)
    
    return matchesSearch && matchesBranch && matchesModality && matchesStatus
  })

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-500/20 text-green-400 border-green-400/30'
      : 'bg-red-500/20 text-red-400 border-red-400/30'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  // Get unique branches and modalities for filters
  const branches = Array.from(new Set(fightTeams.map(team => team.branchName))).sort()
  const modalities = Array.from(new Set(fightTeams.map(team => team.modality))).sort()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
                <span className="mr-3 text-5xl">🥊</span>
                {t('fight-teams')}
              </h1>
              <p className="text-gray-400 text-lg">{t('manage-fight-teams')}</p>
            </div>
            <Link
              to="/championships/fight-teams/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center"
            >
              <span className="mr-2">+</span>
              {t('new-fight-team')}
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('search')}</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('search-teams')}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('branch')}</label>
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">{t('all-branches')}</option>
                {branches.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('modality')}</label>
              <select
                value={modalityFilter}
                onChange={(e) => setModalityFilter(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">{t('all-modalities')}</option>
                {modalities.map((modality) => (
                  <option key={modality} value={modality}>
                    {modality}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('status')}</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">{t('all-status')}</option>
                <option value="active">{t('active')}</option>
                <option value="inactive">{t('inactive')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Teams List */}
        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('team-id')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('team-name')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('coach')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('branch')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('modality')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('team-size')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('established')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('status')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredTeams.map((team) => (
                  <tr key={team.teamId} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-sm text-white font-mono">{team.teamId}</td>
                    <td className="px-6 py-4 text-sm text-white font-medium">{team.teamName}</td>
                    <td className="px-6 py-4 text-sm text-white">{team.coachName}</td>
                    <td className="px-6 py-4 text-sm text-white">{team.branchName}</td>
                    <td className="px-6 py-4 text-sm text-white">{team.modality}</td>
                    <td className="px-6 py-4 text-sm text-white">{team.teamSize}/{team.maxTeamSize}</td>
                    <td className="px-6 py-4 text-sm text-white">{formatDate(team.establishedDate)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(team.isActive)}`}>
                        {team.isActive ? t('active') : t('inactive')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Link
                          to={`/championships/fight-teams/view/${team.teamId}`}
                          className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 px-3 py-1 rounded-lg transition-colors text-sm"
                        >
                          {t('view')}
                        </Link>
                        <Link
                          to={`/championships/fight-teams/edit/${team.teamId}`}
                          className="bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 px-3 py-1 rounded-lg transition-colors text-sm"
                        >
                          {t('edit')}
                        </Link>
                        <button
                          onClick={() => {
                            if (window.confirm(t('confirm-delete-team'))) {
                              deleteFightTeam(team.teamId)
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
          
          {filteredTeams.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🥊</div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">{t('no-teams-found')}</h3>
              <p className="text-gray-400 mb-6">{t('no-teams-found-description')}</p>
              <Link
                to="/championships/fight-teams/new"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-300 inline-flex items-center"
              >
                <span className="mr-2">+</span>
                {t('create-first-team')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FightTeams
