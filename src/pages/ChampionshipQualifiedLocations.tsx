import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useChampionshipQualifiedLocations } from '../contexts/ChampionshipQualifiedLocationContext'
import { useLanguage } from '../contexts/LanguageContext'

const ChampionshipQualifiedLocations: React.FC = () => {
  const { t } = useLanguage()
  const { qualifiedLocations = [], deleteQualifiedLocation } = useChampionshipQualifiedLocations()
  const [searchTerm, setSearchTerm] = useState('')
  const [countryFilter, setCountryFilter] = useState<string>('all')
  const [certificationFilter, setCertificationFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredLocations = qualifiedLocations.filter(location => {
    const matchesSearch = 
      location.locationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCountry = countryFilter === 'all' || location.country === countryFilter
    const matchesCertification = certificationFilter === 'all' || location.certificationLevel === certificationFilter
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? location.isActive : !location.isActive)
    
    return matchesSearch && matchesCountry && matchesCertification && matchesStatus
  })

  const getCertificationColor = (level: string) => {
    switch (level) {
      case 'basic': return 'bg-gray-500/20 text-gray-400 border-gray-400/30'
      case 'intermediate': return 'bg-blue-500/20 text-blue-400 border-blue-400/30'
      case 'advanced': return 'bg-purple-500/20 text-purple-400 border-purple-400/30'
      case 'premium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-400/30'
    }
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-500/20 text-green-400 border-green-400/30'
      : 'bg-red-500/20 text-red-400 border-red-400/30'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  // Get unique countries for filter
  const countries = Array.from(new Set(qualifiedLocations.map(location => location.country))).sort()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
                <span className="mr-3 text-5xl">🏢</span>
                {t('championship-qualified-locations')}
              </h1>
              <p className="text-gray-400 text-lg">{t('manage-qualified-locations')}</p>
            </div>
            <Link
              to="/championships/qualified-locations/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center"
            >
              <span className="mr-2">+</span>
              {t('new-qualified-location')}
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
                placeholder={t('search-locations')}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('country')}</label>
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">{t('all-countries')}</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('certification-level')}</label>
              <select
                value={certificationFilter}
                onChange={(e) => setCertificationFilter(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">{t('all-levels')}</option>
                <option value="basic">{t('basic')}</option>
                <option value="intermediate">{t('intermediate')}</option>
                <option value="advanced">{t('advanced')}</option>
                <option value="premium">{t('premium')}</option>
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

        {/* Locations List */}
        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('location-id')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('name')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('city')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('country')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('capacity')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('certification-level')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('status')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredLocations.map((location) => (
                  <tr key={location.locationId} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-sm text-white font-mono">{location.locationId}</td>
                    <td className="px-6 py-4 text-sm text-white font-medium">{location.name}</td>
                    <td className="px-6 py-4 text-sm text-white">{location.city}</td>
                    <td className="px-6 py-4 text-sm text-white">{location.country}</td>
                    <td className="px-6 py-4 text-sm text-white">{location.capacity.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCertificationColor(location.certificationLevel)}`}>
                        {t(location.certificationLevel)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(location.isActive)}`}>
                        {location.isActive ? t('active') : t('inactive')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Link
                          to={`/championships/qualified-locations/view/${location.locationId}`}
                          className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 px-3 py-1 rounded-lg transition-colors text-sm"
                        >
                          {t('view')}
                        </Link>
                        <Link
                          to={`/championships/qualified-locations/edit/${location.locationId}`}
                          className="bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 px-3 py-1 rounded-lg transition-colors text-sm"
                        >
                          {t('edit')}
                        </Link>
                        <button
                          onClick={() => {
                            if (window.confirm(t('confirm-delete-location'))) {
                              deleteQualifiedLocation(location.locationId)
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
          
          {filteredLocations.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏢</div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">{t('no-locations-found')}</h3>
              <p className="text-gray-400 mb-6">{t('no-locations-found-description')}</p>
              <Link
                to="/championships/qualified-locations/new"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-300 inline-flex items-center"
              >
                <span className="mr-2">+</span>
                {t('create-first-location')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChampionshipQualifiedLocations
