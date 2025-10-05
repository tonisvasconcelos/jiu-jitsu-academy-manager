import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useChampionshipResults } from '../contexts/ChampionshipResultContext'
import { useStudents } from '../contexts/StudentContext'
import { useChampionships } from '../contexts/ChampionshipContext'
import { useChampionshipCategories } from '../contexts/ChampionshipCategoryContext'
import { useChampionshipRegistrations } from '../contexts/ChampionshipRegistrationContext'
import { useLanguage } from '../contexts/LanguageContext'

const ChampionshipResults: React.FC = () => {
  const { t } = useLanguage()
  const { results, deleteResult } = useChampionshipResults()
  const { students } = useStudents()
  const { championships } = useChampionships()
  const { categories } = useChampionshipCategories()
  const { registrations } = useChampionshipRegistrations()
  const [searchTerm, setSearchTerm] = useState('')
  const [positionFilter, setPositionFilter] = useState<string>('all')
  const [championshipFilter, setChampionshipFilter] = useState<string>('all')

  const filteredResults = results.filter(result => {
    const student = students.find(s => s.studentId === result.studentId)
    const championship = championships.find(c => c.championshipId === result.championshipId)
    const category = categories.find(cat => cat.categoryId === result.categoryId)
    const registration = registrations.find(r => r.registrationId === result.registrationId)
    
    const matchesSearch = 
      result.resultId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      championship?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category?.weightCategory.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesPosition = positionFilter === 'all' || result.position === positionFilter
    const matchesChampionship = championshipFilter === 'all' || result.championshipId === championshipFilter
    
    return matchesSearch && matchesPosition && matchesChampionship
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

  const getPositionColor = (position: string) => {
    switch (position) {
      case '1st': return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30'
      case '2nd': return 'bg-gray-400/20 text-gray-300 border-gray-400/30'
      case '3rd': return 'bg-orange-500/20 text-orange-400 border-orange-400/30'
      case '4th': return 'bg-blue-500/20 text-blue-400 border-blue-400/30'
      case '5th': return 'bg-purple-500/20 text-purple-400 border-purple-400/30'
      case 'participation': return 'bg-green-500/20 text-green-400 border-green-400/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-400/30'
    }
  }

  const getMedalColor = (medalType: string) => {
    switch (medalType) {
      case 'gold': return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30'
      case 'silver': return 'bg-gray-400/20 text-gray-300 border-gray-400/30'
      case 'bronze': return 'bg-orange-500/20 text-orange-400 border-orange-400/30'
      case 'none': return 'bg-gray-500/20 text-gray-400 border-gray-400/30'
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
                <span className="mr-3 text-5xl">🏆</span>
                {t('championship-results')}
              </h1>
              <p className="text-gray-400 text-lg">{t('manage-championship-results')}</p>
            </div>
            <Link
              to="/championships/results/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center"
            >
              <span className="mr-2">+</span>
              {t('new-result')}
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
                placeholder={t('search-results')}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('position')}</label>
              <select
                value={positionFilter}
                onChange={(e) => setPositionFilter(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">{t('all-positions')}</option>
                <option value="1st">{t('1st')}</option>
                <option value="2nd">{t('2nd')}</option>
                <option value="3rd">{t('3rd')}</option>
                <option value="4th">{t('4th')}</option>
                <option value="5th">{t('5th')}</option>
                <option value="participation">{t('participation')}</option>
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

        {/* Results List */}
        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('result-id')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('student')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('championship')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('category')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('position')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('points')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('medal-type')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('result-date')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredResults.map((result) => (
                  <tr key={result.resultId} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-sm text-white font-mono">{result.resultId}</td>
                    <td className="px-6 py-4 text-sm text-white">{getStudentName(result.studentId)}</td>
                    <td className="px-6 py-4 text-sm text-white">{getChampionshipName(result.championshipId)}</td>
                    <td className="px-6 py-4 text-sm text-white">{getCategoryInfo(result.categoryId)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPositionColor(result.position)}`}>
                        {t(result.position)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-white font-medium">{result.points}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getMedalColor(result.medalType)}`}>
                        {t(result.medalType)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-white">{formatDate(result.resultDate)}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Link
                          to={`/championships/results/view/${result.resultId}`}
                          className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 px-3 py-1 rounded-lg transition-colors text-sm"
                        >
                          {t('view')}
                        </Link>
                        <Link
                          to={`/championships/results/edit/${result.resultId}`}
                          className="bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 px-3 py-1 rounded-lg transition-colors text-sm"
                        >
                          {t('edit')}
                        </Link>
                        <button
                          onClick={() => {
                            if (window.confirm(t('confirm-delete-result'))) {
                              deleteResult(result.resultId)
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
          
          {filteredResults.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">{t('no-results-found')}</h3>
              <p className="text-gray-400 mb-6">{t('no-results-found-description')}</p>
              <Link
                to="/championships/results/new"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-300 inline-flex items-center"
              >
                <span className="mr-2">+</span>
                {t('create-first-result')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChampionshipResults
