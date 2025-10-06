import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useChampionshipCategories } from '../contexts/ChampionshipCategoryContext'
import { useChampionships } from '../contexts/ChampionshipContext'
import { useFightAssociations } from '../contexts/FightAssociationContext'
import { useFightModalities } from '../contexts/FightModalityContext'
import { useLanguage } from '../contexts/LanguageContext'
import { ChampionshipCategory } from '../contexts/ChampionshipCategoryContext'

const ChampionshipCategoryForm: React.FC = () => {
  const { t } = useLanguage()
  const { action, id } = useParams<{ action: string; id: string }>()
  const navigate = useNavigate()
  const { addCategory, updateCategory, getCategory } = useChampionshipCategories()
  const { championships } = useChampionships()
  const { fightAssociations: associations = [] } = useFightAssociations()
  const { fightModalities: modalities = [] } = useFightModalities()

  const [category, setCategory] = useState<Omit<ChampionshipCategory, 'categoryId'>>({
    ageGroups: ['adult'],
    belts: ['white'],
    weightCategory: '',
    weightLimit: undefined,
    gender: 'mixed',
    fightAssociation: '',
    fightModalities: []
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isReadOnly = action === 'view'
  const isEdit = action === 'edit'
  const isNew = action === 'new'

  useEffect(() => {
    if (isEdit && id) {
      const existingCategory = getCategory(id)
      if (existingCategory) {
        const { categoryId, ...categoryData } = existingCategory
        setCategory(categoryData)
      }
    }
  }, [isEdit, id, getCategory])

  const handleInputChange = (field: keyof Omit<ChampionshipCategory, 'categoryId'>, value: string | number | undefined) => {
    setCategory(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleMultiSelectChange = (field: 'ageGroups' | 'belts' | 'fightModalities', value: string, checked: boolean) => {
    setCategory(prev => ({
      ...prev,
      [field]: checked 
        ? [...(prev[field] as string[]), value]
        : (prev[field] as string[]).filter(item => item !== value)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Validation
      if (!category.weightCategory || !category.fightAssociation) {
        setError(t('fill-required-fields'))
        setIsLoading(false)
        return
      }

      if (isEdit && id) {
        updateCategory(id, category)
      } else {
        addCategory(category)
      }

      navigate('/championships/categories')
    } catch (err) {
      setError(t('error-saving-category'))
      console.error('Error saving category:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    if (isEdit && id) {
      const existingCategory = getCategory(id)
      if (existingCategory) {
        const { categoryId, ...categoryData } = existingCategory
        setCategory(categoryData)
      }
    } else {
      setCategory({
        ageGroups: ['adult'],
        belts: ['white'],
        weightCategory: '',
        weightLimit: undefined,
        gender: 'mixed',
        fightAssociation: '',
        fightModalities: []
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Modern Header */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <Link
              to="/championships/categories"
              className="group mr-6 p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all duration-300 hover:scale-105 border border-white/10 hover:border-white/20"
              title="Back to Championship Categories"
            >
              <svg className="w-6 h-6 text-white group-hover:text-purple-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div className="flex items-center">
              <div className="p-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl mr-4 shadow-lg">
                <span className="text-3xl">🏆</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-2">
                  {isNew ? t('new-category') : isEdit ? t('edit-category') : t('view-category')}
                </h1>
                <p className="text-gray-300 text-lg font-medium">
                  {isNew ? t('new-category-description') : isEdit ? t('edit-category-description') : t('view-category-description')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Modern Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center mb-8">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">{t('basic-information')}</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Fight Association */}
              <div className="space-y-3">
                <label htmlFor="fightAssociation" className="block text-sm font-semibold text-white mb-3">
                  {t('fight-association')} <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    id="fightAssociation"
                    value={category.fightAssociation}
                    onChange={(e) => handleInputChange('fightAssociation', e.target.value)}
                    disabled={isReadOnly}
                    className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 transition-all duration-300 hover:bg-white/15 appearance-none cursor-pointer"
                  >
                    <option value="">{t('select-association')}</option>
                    {associations.map(association => (
                      <option key={association.associationId} value={association.associationId}>
                        {association.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Age Groups */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-white mb-3">
                  {t('age-groups')} <span className="text-red-400">*</span>
                </label>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="grid grid-cols-2 gap-3">
                    {['kids', 'adult', 'master', 'senior'].map(ageGroup => (
                      <label key={ageGroup} className="flex items-center p-3 rounded-xl hover:bg-white/5 transition-all duration-200 cursor-pointer group">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={category.ageGroups.includes(ageGroup as any)}
                            onChange={(e) => handleMultiSelectChange('ageGroups', ageGroup, e.target.checked)}
                            disabled={isReadOnly}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center ${
                            category.ageGroups.includes(ageGroup as any)
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-transparent'
                              : 'border-white/30 group-hover:border-white/50'
                          }`}>
                            {category.ageGroups.includes(ageGroup as any) && (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <span className="ml-3 text-white font-medium">{t(ageGroup)}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-400">{t('select-multiple-age-groups')}</p>
              </div>

              {/* Belts */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-white mb-3">
                  {t('belts')} <span className="text-red-400">*</span>
                </label>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="grid grid-cols-2 gap-3">
                    {['white', 'blue', 'purple', 'brown', 'black', 'all-belts'].map(belt => (
                      <label key={belt} className="flex items-center p-3 rounded-xl hover:bg-white/5 transition-all duration-200 cursor-pointer group">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={category.belts.includes(belt as any)}
                            onChange={(e) => handleMultiSelectChange('belts', belt, e.target.checked)}
                            disabled={isReadOnly}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center ${
                            category.belts.includes(belt as any)
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-transparent'
                              : 'border-white/30 group-hover:border-white/50'
                          }`}>
                            {category.belts.includes(belt as any) && (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <span className="ml-3 text-white font-medium">
                          {belt === 'all-belts' ? t('all-belts') : t(`${belt}-belt`)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-400">{t('select-multiple-belts')}</p>
              </div>

              {/* Weight Category */}
              <div className="space-y-3">
                <label htmlFor="weightCategory" className="block text-sm font-semibold text-white mb-3">
                  {t('weight-category')} <span className="text-red-400">*</span>
                </label>
                <input
                  id="weightCategory"
                  type="text"
                  value={category.weightCategory}
                  onChange={(e) => handleInputChange('weightCategory', e.target.value)}
                  disabled={isReadOnly}
                  placeholder={t('weight-category-placeholder')}
                  className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 transition-all duration-300 hover:bg-white/15"
                />
              </div>

              {/* Weight Limit */}
              <div className="space-y-3">
                <label htmlFor="weightLimit" className="block text-sm font-semibold text-white mb-3">
                  {t('weight-limit')} <span className="text-gray-400 text-sm font-normal">(kg)</span>
                </label>
                <div className="relative">
                  <input
                    id="weightLimit"
                    type="number"
                    min="0"
                    step="0.1"
                    value={category.weightLimit || ''}
                    onChange={(e) => handleInputChange('weightLimit', e.target.value ? parseFloat(e.target.value) : undefined)}
                    disabled={isReadOnly}
                    placeholder={t('weight-limit-placeholder')}
                    className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 transition-all duration-300 hover:bg-white/15"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <span className="text-gray-400 text-sm font-medium">kg</span>
                  </div>
                </div>
                <p className="text-sm text-gray-400">{t('weight-limit-help')}</p>
              </div>

              {/* Fight Modalities */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-white mb-3">
                  {t('fight-modalities')}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {modalities.map(modality => (
                    <div
                      key={modality.modalityId}
                      className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                        category.fightModalities.includes(modality.modalityId)
                          ? 'bg-purple-500/20 border-purple-400 text-purple-400'
                          : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                      } ${isReadOnly ? 'cursor-not-allowed' : ''}`}
                      onClick={() => !isReadOnly && handleMultiSelectChange('fightModalities', modality.modalityId, !category.fightModalities.includes(modality.modalityId))}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{modality.name}</div>
                          <div className="text-xs text-gray-400 mt-1">{modality.description}</div>
                          <div className="flex items-center mt-2 space-x-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              modality.type === 'striking' ? 'bg-red-500/20 text-red-400' :
                              modality.type === 'grappling' ? 'bg-blue-500/20 text-blue-400' :
                              modality.type === 'mixed' ? 'bg-purple-500/20 text-purple-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {modality.type}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              modality.level === 'beginner' ? 'bg-green-500/20 text-green-400' :
                              modality.level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                              modality.level === 'advanced' ? 'bg-orange-500/20 text-orange-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {modality.level}
                            </span>
                          </div>
                        </div>
                        <div className="text-2xl">
                          {category.fightModalities.includes(modality.modalityId) ? '✅' : '⬜'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {category.fightModalities.length === 0 && (
                  <p className="text-sm text-gray-400 mt-2">Please select at least one modality</p>
                )}
                
                <p className="text-sm text-gray-400">{t('select-multiple-fight-modalities')}</p>
              </div>

              {/* Gender */}
              <div className="space-y-3">
                <label htmlFor="gender" className="block text-sm font-semibold text-white mb-3">
                  {t('gender')} <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    id="gender"
                    value={category.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value as 'male' | 'female' | 'mixed')}
                    disabled={isReadOnly}
                    className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 transition-all duration-300 hover:bg-white/15 appearance-none cursor-pointer"
                  >
                    <option value="male">{t('male')}</option>
                    <option value="female">{t('female')}</option>
                    <option value="mixed">{t('mixed')}</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modern Action Buttons */}
          {!isReadOnly && (
            <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6">
              <button
                type="button"
                onClick={handleReset}
                className="group px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white rounded-2xl transition-all duration-300 flex items-center justify-center font-semibold hover:scale-105"
              >
                <svg className="w-5 h-5 mr-3 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {t('reset')}
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-semibold shadow-lg"
              >
                {isLoading ? (
                  <span className="animate-spin h-5 w-5 border-b-2 border-white rounded-full mr-3"></span>
                ) : (
                  <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {isEdit ? t('update-category') : t('create-category')}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default ChampionshipCategoryForm
