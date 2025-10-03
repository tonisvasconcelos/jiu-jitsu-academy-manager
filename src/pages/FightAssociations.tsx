import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useFightAssociations, FightAssociation } from '../contexts/FightAssociationContext'
import { useFightModalities } from '../contexts/FightModalityContext'

const FightAssociations: React.FC = () => {
  const { t } = useLanguage()
  const { fightAssociations, deleteFightAssociation } = useFightAssociations()
  const { modalities: fightModalities, getModality } = useFightModalities()
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [countryFilter, setCountryFilter] = useState('all')

  // Add safety checks to prevent undefined errors
  const safeFightAssociations = fightAssociations || []
  const safeFightModalities = fightModalities || []

  const handleDeleteFightAssociation = (associationId: string) => {
    if (window.confirm('Are you sure you want to delete this fight association?')) {
      deleteFightAssociation(associationId)
    }
  }

  const filteredAssociations = safeFightAssociations.filter(association => {
    const matchesSearch = searchTerm === '' || 
      association.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      association.acronym.toLowerCase().includes(searchTerm.toLowerCase()) ||
      association.description?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === 'all' || association.type === typeFilter
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && association.active) ||
      (statusFilter === 'inactive' && !association.active)
    const matchesCountry = countryFilter === 'all' || association.country === countryFilter

    return matchesSearch && matchesType && matchesStatus && matchesCountry
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'international': return '🌍'
      case 'national': return '🏛️'
      case 'regional': return '🏘️'
      case 'affiliate_network': return '🔗'
      default: return '🏢'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'international': return 'bg-blue-100 text-blue-800'
      case 'national': return 'bg-green-100 text-green-800'
      case 'regional': return 'bg-yellow-100 text-yellow-800'
      case 'affiliate_network': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getFightModalityName = (modalityId: string) => {
    const modality = safeFightModalities.find(m => m.modalityId === modalityId)
    return modality ? modality.name : 'Unknown Modality'
  }

  const getFightModalityIcon = (modalityId: string) => {
    const modality = safeFightModalities.find(m => m.modalityId === modalityId)
    if (!modality) return '🥋'
    
    // Return appropriate icon based on modality type
    switch (modality.type) {
      case 'striking': return '👊'
      case 'grappling': return '🥋'
      case 'mixed': return '⚔️'
      default: return '🥋'
    }
  }

  // Get unique countries for filter
  const countries = Array.from(new Set(safeFightAssociations.map(a => a.country).filter(Boolean)))

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-3">
            Fight Associations
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Manage fight associations and federations by fight modality
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Link
            to="/championships/fight-associations/new"
            className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/25 flex items-center justify-center"
          >
            <span className="mr-2">➕</span>
            <span className="font-medium">New Fight Association</span>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Total Associations</p>
                <p className="text-3xl font-bold text-white">{safeFightAssociations.length}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl shadow-lg">
                <span className="text-2xl">🏆</span>
              </div>
            </div>
          </div>

          <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Active Associations</p>
                <p className="text-3xl font-bold text-white">{safeFightAssociations.filter(a => a.active).length}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">International</p>
                <p className="text-3xl font-bold text-white">{safeFightAssociations.filter(a => a.type === 'international').length}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <span className="text-2xl">🌍</span>
              </div>
            </div>
          </div>

          <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Main Associations</p>
                <p className="text-3xl font-bold text-white">{safeFightAssociations.filter(a => a.isMainAssociation).length}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                <span className="text-2xl">⭐</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
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
                  placeholder="Search fight associations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap gap-3">
              {/* Type Filter */}
              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="appearance-none bg-white/10 border border-white/20 rounded-xl text-white px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 min-w-[140px]"
                >
                  <option value="all" className="bg-gray-800">All Types</option>
                  <option value="international" className="bg-gray-800">International</option>
                  <option value="national" className="bg-gray-800">National</option>
                  <option value="regional" className="bg-gray-800">Regional</option>
                  <option value="affiliate_network" className="bg-gray-800">Affiliate Network</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-400">🏢</span>
                </div>
              </div>

              {/* Country Filter */}
              <div className="relative">
                <select
                  value={countryFilter}
                  onChange={(e) => setCountryFilter(e.target.value)}
                  className="appearance-none bg-white/10 border border-white/20 rounded-xl text-white px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 min-w-[140px]"
                >
                  <option value="all" className="bg-gray-800">All Countries</option>
                  {countries.map(country => (
                    <option key={country} value={country} className="bg-gray-800">
                      {country}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-400">🌍</span>
                </div>
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none bg-white/10 border border-white/20 rounded-xl text-white px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 min-w-[140px]"
                >
                  <option value="all" className="bg-gray-800">All Status</option>
                  <option value="active" className="bg-gray-800">Active Only</option>
                  <option value="inactive" className="bg-gray-800">Inactive Only</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-400">✅</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fight Associations Table */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10">
            <h2 className="text-xl font-semibold text-white">Fight Associations List</h2>
          </div>
          
          {filteredAssociations.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold text-white mb-2">No Fight Associations Found</h3>
              <p className="text-gray-400 mb-6">
                {searchTerm || typeFilter !== 'all' || statusFilter !== 'all' || countryFilter !== 'all'
                  ? 'No fight associations match your current filters.'
                  : 'Get started by creating your first fight association.'}
              </p>
              <Link
                to="/championships/fight-associations/new"
                className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/25 inline-flex items-center"
              >
                <span className="mr-2">➕</span>
                <span className="font-medium">Create Fight Association</span>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Association</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Country</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredAssociations.map((association) => (
                    <tr key={association.associationId} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-white">{association.name}</span>
                            {association.isMainAssociation && (
                              <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">⭐ Main</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-400">{association.acronym}</div>
                          {association.description && (
                            <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">{association.description}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="mr-2">{getTypeIcon(association.type)}</span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(association.type)}`}>
                            {association.type.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{association.country || 'N/A'}</div>
                        {association.region && (
                          <div className="text-xs text-gray-400">{association.region}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          association.active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {association.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            to={`/championships/fight-associations/view/${association.associationId}`}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                            title="View"
                          >
                            👁️
                          </Link>
                          <Link
                            to={`/championships/fight-associations/edit/${association.associationId}`}
                            className="text-yellow-400 hover:text-yellow-300 transition-colors"
                            title="Edit"
                          >
                            ✏️
                          </Link>
                          <button
                            onClick={() => handleDeleteFightAssociation(association.associationId)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                            title="Delete"
                          >
                            🗑️
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

export default FightAssociations
