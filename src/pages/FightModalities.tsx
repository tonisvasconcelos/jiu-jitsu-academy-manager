import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useFightModalities, FightModality } from '../contexts/FightModalityContext'

const FightModalities: React.FC = () => {
  const { t } = useLanguage()
  const { modalities, deleteModality } = useFightModalities()
  
  console.log('=== FIGHT MODALITIES: RENDER ===')
  console.log('FightModalities: Current modalities:', modalities)
  console.log('FightModalities: Modalities count:', modalities.length)

  const getTypeColor = (type: string) => {
    const colors = {
      striking: 'bg-red-500/20 text-red-400',
      grappling: 'bg-blue-500/20 text-blue-400',
      mixed: 'bg-purple-500/20 text-purple-400',
      other: 'bg-gray-500/20 text-gray-400'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-500/20 text-gray-400'
  }

  const getLevelColor = (level: string) => {
    const colors = {
      beginner: 'bg-green-500/20 text-green-400',
      intermediate: 'bg-yellow-500/20 text-yellow-400',
      advanced: 'bg-orange-500/20 text-orange-400',
      expert: 'bg-red-500/20 text-red-400'
    }
    return colors[level as keyof typeof colors] || 'bg-gray-500/20 text-gray-400'
  }

  const handleDeleteModality = (modalityId: string) => {
    if (window.confirm('Are you sure you want to delete this modality?')) {
      deleteModality(modalityId)
    }
  }

  const totalModalities = modalities.length
  const activeModalities = modalities.filter(m => m.active).length
  const strikingModalities = modalities.filter(m => m.type === 'striking').length
  const grapplingModalities = modalities.filter(m => m.type === 'grappling').length
  const mixedModalities = modalities.filter(m => m.type === 'mixed').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent mb-3">
                {t('fight-modalities')}
              </h1>
              <p className="text-lg text-gray-300 max-w-2xl">
                {t('modality-management')}
              </p>
            </div>
            <div className="flex space-x-3">
              <Link
                to="/fight-plans/modalities/new"
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 flex items-center"
              >
                <span className="mr-2">➕</span>
                New Modality
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Total Modalities</p>
                <p className="text-3xl font-bold text-white">{totalModalities}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                <span className="text-2xl">🥋</span>
              </div>
            </div>
          </div>

          <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Active Modalities</p>
                <p className="text-3xl font-bold text-white">{activeModalities}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Striking</p>
                <p className="text-3xl font-bold text-white">{strikingModalities}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg">
                <span className="text-2xl">👊</span>
              </div>
            </div>
          </div>

          <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Grappling</p>
                <p className="text-3xl font-bold text-white">{grapplingModalities}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <span className="text-2xl">🤼</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modalities Table */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-semibold text-white">Modalities List</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    {t('modality-name')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    {t('modality-type')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    {t('modality-level')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    {t('modality-duration')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {modalities.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-400">
                      No modalities registered yet.
                    </td>
                  </tr>
                ) : (
                  modalities.map((modality) => (
                    <tr key={modality.modalityId} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">{modality.name}</div>
                          <div className="text-xs text-gray-400">ID: {modality.modalityId}</div>
                          <div className="text-xs text-gray-500 mt-1">{modality.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(modality.type)}`}>
                          {modality.type.charAt(0).toUpperCase() + modality.type.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getLevelColor(modality.level)}`}>
                          {modality.level.charAt(0).toUpperCase() + modality.level.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {modality.duration} min
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {modality.active ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-500/20 text-green-400">
                            {t('modality-active')}
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
                            to={`/fight-plans/modalities/view/${modality.modalityId}`}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            👁️ View
                          </Link>
                          <Link
                            to={`/fight-plans/modalities/edit/${modality.modalityId}`}
                            className="text-green-400 hover:text-green-300 transition-colors"
                          >
                            ✏️ Edit
                          </Link>
                          <button 
                            onClick={() => handleDeleteModality(modality.modalityId)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            🗑️ Delete
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

export default FightModalities

