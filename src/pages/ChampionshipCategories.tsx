import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useChampionshipCategories } from '../contexts/ChampionshipCategoryContext'
import { useFightAssociations } from '../contexts/FightAssociationContext'
import { useLanguage } from '../contexts/LanguageContext'

const ChampionshipCategories: React.FC = () => {
  const { t } = useLanguage()
  const { categories, deleteCategory } = useChampionshipCategories()
  const { fightAssociations: associations = [] } = useFightAssociations()
  const [searchTerm, setSearchTerm] = useState('')
  const [ageGroupFilter, setAgeGroupFilter] = useState<string>('all')
  const [beltFilter, setBeltFilter] = useState<string>('all')

  const filteredCategories = categories.filter(category => {
    const association = associations.find(a => a.associationId === category.fightAssociation)
    
    const matchesSearch = 
      category.categoryId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.weightCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      association?.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesAgeGroup = ageGroupFilter === 'all' || category.ageGroups.includes(ageGroupFilter as any)
    const matchesBelt = beltFilter === 'all' || category.belts.includes(beltFilter as any)
    
    return matchesSearch && matchesAgeGroup && matchesBelt
  })


  const getAssociationName = (associationId: string) => {
    const association = associations.find(a => a.associationId === associationId)
    return association ? association.name : 'Unknown Association'
  }

  const getBeltColor = (belt: string) => {
    switch (belt) {
      case 'white': return 'bg-white text-gray-800 border-gray-300'
      case 'blue': return 'bg-blue-500 text-white border-blue-600'
      case 'purple': return 'bg-purple-500 text-white border-purple-600'
      case 'brown': return 'bg-yellow-600 text-white border-yellow-700'
      case 'black': return 'bg-gray-800 text-white border-gray-900'
      case 'all-belts': return 'bg-gradient-to-r from-white via-blue-500 to-gray-800 text-white border-gray-300'
      default: return 'bg-gray-500 text-white border-gray-600'
    }
  }

  const getAgeGroupColor = (ageGroup: string) => {
    switch (ageGroup) {
      case 'kids': return 'bg-green-500/20 text-green-400 border-green-400/30'
      case 'adult': return 'bg-blue-500/20 text-blue-400 border-blue-400/30'
      case 'master': return 'bg-purple-500/20 text-purple-400 border-purple-400/30'
      case 'senior': return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30'
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
                <span className="mr-3 text-5xl">📋</span>
                {t('championship-categories')}
              </h1>
              <p className="text-gray-400 text-lg">{t('manage-championship-categories')}</p>
            </div>
            <Link
              to="/championships/categories/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center"
            >
              <span className="mr-2">+</span>
              {t('new-category')}
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
                placeholder={t('search-categories')}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('age-group')}</label>
              <select
                value={ageGroupFilter}
                onChange={(e) => setAgeGroupFilter(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">{t('all-age-groups')}</option>
                <option value="kids">{t('kids')}</option>
                <option value="adult">{t('adult')}</option>
                <option value="master">{t('master')}</option>
                <option value="senior">{t('senior')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('belt')}</label>
              <select
                value={beltFilter}
                onChange={(e) => setBeltFilter(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">{t('all-belts')}</option>
                <option value="white">{t('white-belt')}</option>
                <option value="blue">{t('blue-belt')}</option>
                <option value="purple">{t('purple-belt')}</option>
                <option value="brown">{t('brown-belt')}</option>
                <option value="black">{t('black-belt')}</option>
                <option value="all-belts">{t('all-belts')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Categories List */}
        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('category-id')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('age-group')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('belt')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('weight-category')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('weight-limit')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('gender')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('association')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredCategories.map((category) => (
                  <tr key={category.categoryId} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-sm text-white font-mono">{category.categoryId}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {category.ageGroups.map(ageGroup => (
                          <span key={ageGroup} className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getAgeGroupColor(ageGroup)}`}>
                            {t(ageGroup)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {category.belts.map(belt => (
                          <span key={belt} className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBeltColor(belt)}`}>
                            {belt === 'all-belts' ? t('all-belts') : t(`${belt}-belt`)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-white">{category.weightCategory}</td>
                    <td className="px-6 py-4 text-sm text-white">
                      {category.weightLimit ? `${category.weightLimit} kg` : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-white">{t(category.gender)}</td>
                    <td className="px-6 py-4 text-sm text-white">{getAssociationName(category.fightAssociation)}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Link
                          to={`/championships/categories/view/${category.categoryId}`}
                          className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 px-3 py-1 rounded-lg transition-colors text-sm"
                        >
                          {t('view')}
                        </Link>
                        <Link
                          to={`/championships/categories/edit/${category.categoryId}`}
                          className="bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 px-3 py-1 rounded-lg transition-colors text-sm"
                        >
                          {t('edit')}
                        </Link>
                        <button
                          onClick={() => {
                            if (window.confirm(t('confirm-delete-category'))) {
                              deleteCategory(category.categoryId)
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
          
          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">{t('no-categories-found')}</h3>
              <p className="text-gray-400 mb-6">{t('no-categories-found-description')}</p>
              <Link
                to="/championships/categories/new"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-300 inline-flex items-center"
              >
                <span className="mr-2">+</span>
                {t('create-first-category')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChampionshipCategories
