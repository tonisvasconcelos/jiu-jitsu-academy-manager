import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useChampionshipCategories } from '../contexts/ChampionshipCategoryContext'
import { useChampionships } from '../contexts/ChampionshipContext'
import { useFightAssociations } from '../contexts/FightAssociationContext'
import { useLanguage } from '../contexts/LanguageContext'
import { ChampionshipCategory } from '../contexts/ChampionshipCategoryContext'

const ChampionshipCategoryForm: React.FC = () => {
  const { t } = useLanguage()
  const { action, id } = useParams<{ action: string; id: string }>()
  const navigate = useNavigate()
  const { addCategory, updateCategory, getCategory } = useChampionshipCategories()
  const { championships } = useChampionships()
  const { fightAssociations: associations = [] } = useFightAssociations()

  const [category, setCategory] = useState<Omit<ChampionshipCategory, 'categoryId'>>({
    ageGroup: 'adult',
    belt: 'white',
    weightCategory: '',
    weightLimit: undefined,
    gender: 'mixed',
    fightAssociation: ''
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
        ageGroup: 'adult',
        belt: 'white',
        weightCategory: '',
        weightLimit: undefined,
        gender: 'mixed',
        fightAssociation: ''
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link
            to="/championships/categories"
            className="mr-4 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-105"
            title="Back to Championship Categories"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
              <span className="mr-3 text-5xl">🏆</span>
              {isNew ? t('new-category') : isEdit ? t('edit-category') : t('view-category')}
            </h1>
            <p className="text-gray-400 text-lg">
              {isNew ? t('new-category-description') : isEdit ? t('edit-category-description') : t('view-category-description')}
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">{t('basic-information')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fight Association */}
              <div>
                <label htmlFor="fightAssociation" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('fight-association')} <span className="text-red-400">*</span>
                </label>
                <select
                  id="fightAssociation"
                  value={category.fightAssociation}
                  onChange={(e) => handleInputChange('fightAssociation', e.target.value)}
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                >
                  <option value="">{t('select-association')}</option>
                  {associations.map(association => (
                    <option key={association.associationId} value={association.associationId}>
                      {association.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Age Group */}
              <div>
                <label htmlFor="ageGroup" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('age-group')} <span className="text-red-400">*</span>
                </label>
                <select
                  id="ageGroup"
                  value={category.ageGroup}
                  onChange={(e) => handleInputChange('ageGroup', e.target.value as 'kids' | 'adult' | 'master' | 'senior')}
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                >
                  <option value="kids">{t('kids')}</option>
                  <option value="adult">{t('adult')}</option>
                  <option value="master">{t('master')}</option>
                  <option value="senior">{t('senior')}</option>
                </select>
              </div>

              {/* Belt */}
              <div>
                <label htmlFor="belt" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('belt')} <span className="text-red-400">*</span>
                </label>
                <select
                  id="belt"
                  value={category.belt}
                  onChange={(e) => handleInputChange('belt', e.target.value as 'white' | 'blue' | 'purple' | 'brown' | 'black' | 'all-belts')}
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                >
                  <option value="white">{t('white-belt')}</option>
                  <option value="blue">{t('blue-belt')}</option>
                  <option value="purple">{t('purple-belt')}</option>
                  <option value="brown">{t('brown-belt')}</option>
                  <option value="black">{t('black-belt')}</option>
                  <option value="all-belts">{t('all-belts')}</option>
                </select>
              </div>

              {/* Weight Category */}
              <div>
                <label htmlFor="weightCategory" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('weight-category')} <span className="text-red-400">*</span>
                </label>
                <input
                  id="weightCategory"
                  type="text"
                  value={category.weightCategory}
                  onChange={(e) => handleInputChange('weightCategory', e.target.value)}
                  disabled={isReadOnly}
                  placeholder={t('weight-category-placeholder')}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                />
              </div>

              {/* Weight Limit */}
              <div>
                <label htmlFor="weightLimit" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('weight-limit')} <span className="text-gray-500">(kg)</span>
                </label>
                <input
                  id="weightLimit"
                  type="number"
                  min="0"
                  step="0.1"
                  value={category.weightLimit || ''}
                  onChange={(e) => handleInputChange('weightLimit', e.target.value ? parseFloat(e.target.value) : undefined)}
                  disabled={isReadOnly}
                  placeholder={t('weight-limit-placeholder')}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                />
                <p className="text-xs text-gray-500 mt-1">{t('weight-limit-help')}</p>
              </div>

              {/* Gender */}
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('gender')} <span className="text-red-400">*</span>
                </label>
                <select
                  id="gender"
                  value={category.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value as 'male' | 'female' | 'mixed')}
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                >
                  <option value="male">{t('male')}</option>
                  <option value="female">{t('female')}</option>
                  <option value="mixed">{t('mixed')}</option>
                </select>
              </div>
            </div>
          </div>


          {/* Action Buttons */}
          {!isReadOnly && (
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button
                type="button"
                onClick={handleReset}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center justify-center"
              >
                <span className="mr-2">🔄</span>
                {t('reset')}
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <span className="animate-spin h-5 w-5 border-b-2 border-white rounded-full mr-3"></span>
                ) : (
                  <span className="mr-2">💾</span>
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
