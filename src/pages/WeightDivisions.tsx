import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useWeightDivisions, WeightDivision } from '../contexts/WeightDivisionContext'

const WeightDivisions: React.FC = () => {
  const { t } = useLanguage()
  const { weightDivisions, deleteWeightDivision } = useWeightDivisions()
  const [searchTerm, setSearchTerm] = useState('')
  const [genderFilter, setGenderFilter] = useState('all')
  const [ageGroupFilter, setAgeGroupFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const handleDeleteWeightDivision = (divisionId: string) => {
    if (window.confirm('Are you sure you want to delete this weight division?')) {
      deleteWeightDivision(divisionId)
    }
  }

  const filteredDivisions = weightDivisions.filter(division => {
    const matchesSearch = searchTerm === '' || 
      division.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      division.description?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesGender = genderFilter === 'all' || division.gender === genderFilter
    const matchesAgeGroup = ageGroupFilter === 'all' || division.ageGroup === ageGroupFilter
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && division.active) ||
      (statusFilter === 'inactive' && !division.active)

    return matchesSearch && matchesGender && matchesAgeGroup && matchesStatus
  })

  const getGenderIcon = (gender: string) => {
    return gender === 'male' ? '👨' : gender === 'female' ? '👩' : '👥'
  }

  const getAgeGroupIcon = (ageGroup: string) => {
    return ageGroup === 'adult' ? '👨‍💼' : ageGroup === 'kids' ? '👶' : '👥'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-3">
            Weight Divisions
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Manage weight divisions for competitions and training
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Link
            to="/fight-plans/weight-divisions/new"
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center"
          >
            <span className="mr-2">➕</span>
            <span className="font-medium">New Weight Division</span>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Total Divisions</p>
                <p className="text-3xl font-bold text-white">{weightDivisions.length}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <span className="text-2xl">⚖️</span>
              </div>
            </div>
          </div>

          <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Active Divisions</p>
                <p className="text-3xl font-bold text-white">{weightDivisions.filter(d => d.active).length}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Adult Divisions</p>
                <p className="text-3xl font-bold text-white">{weightDivisions.filter(d => d.ageGroup === 'adult').length}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                <span className="text-2xl">👨‍💼</span>
              </div>
            </div>
          </div>

          <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Kids Divisions</p>
                <p className="text-3xl font-bold text-white">{weightDivisions.filter(d => d.ageGroup === 'kids').length}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
                <span className="text-2xl">👶</span>
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
                  placeholder="Search weight divisions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap gap-3">
              {/* Gender Filter */}
              <div className="relative">
                <select
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                  className="appearance-none bg-white/10 border border-white/20 rounded-xl text-white px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 min-w-[140px]"
                >
                  <option value="all" className="bg-gray-800">All Genders</option>
                  <option value="male" className="bg-gray-800">Male</option>
                  <option value="female" className="bg-gray-800">Female</option>
                  <option value="both" className="bg-gray-800">Both</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-400">👤</span>
                </div>
              </div>

              {/* Age Group Filter */}
              <div className="relative">
                <select
                  value={ageGroupFilter}
                  onChange={(e) => setAgeGroupFilter(e.target.value)}
                  className="appearance-none bg-white/10 border border-white/20 rounded-xl text-white px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 min-w-[140px]"
                >
                  <option value="all" className="bg-gray-800">All Ages</option>
                  <option value="adult" className="bg-gray-800">Adult</option>
                  <option value="kids" className="bg-gray-800">Kids</option>
                  <option value="both" className="bg-gray-800">Both</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-400">👥</span>
                </div>
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none bg-white/10 border border-white/20 rounded-xl text-white px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 min-w-[140px]"
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

        {/* Weight Divisions Table */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10">
            <h2 className="text-xl font-semibold text-white">Weight Divisions List</h2>
          </div>
          
          {filteredDivisions.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">⚖️</div>
              <h3 className="text-xl font-semibold text-white mb-2">No Weight Divisions Found</h3>
              <p className="text-gray-400 mb-6">
                {searchTerm || genderFilter !== 'all' || ageGroupFilter !== 'all' || statusFilter !== 'all'
                  ? 'No weight divisions match your current filters.'
                  : 'Get started by creating your first weight division.'}
              </p>
              <Link
                to="/fight-plans/weight-divisions/new"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 inline-flex items-center"
              >
                <span className="mr-2">➕</span>
                <span className="font-medium">Create Weight Division</span>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Division</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Weight Range</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Gender</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Age Group</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredDivisions.map((division) => (
                    <tr key={division.divisionId} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">{division.name}</div>
                          {division.description && (
                            <div className="text-sm text-gray-400">{division.description}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">
                          {division.minWeight} - {division.maxWeight === 999 ? '∞' : division.maxWeight} kg
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="mr-2">{getGenderIcon(division.gender)}</span>
                          <span className="text-sm text-white capitalize">{division.gender}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="mr-2">{getAgeGroupIcon(division.ageGroup)}</span>
                          <span className="text-sm text-white capitalize">{division.ageGroup}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          division.active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {division.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            to={`/fight-plans/weight-divisions/view/${division.divisionId}`}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                            title="View"
                          >
                            👁️
                          </Link>
                          <Link
                            to={`/fight-plans/weight-divisions/edit/${division.divisionId}`}
                            className="text-yellow-400 hover:text-yellow-300 transition-colors"
                            title="Edit"
                          >
                            ✏️
                          </Link>
                          <button
                            onClick={() => handleDeleteWeightDivision(division.divisionId)}
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

export default WeightDivisions


