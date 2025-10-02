import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useFightModalities, FightModality } from '../contexts/FightModalityContext'

const FightModalityForm: React.FC = () => {
  const { t } = useLanguage()
  const { action, id } = useParams<{ action: string; id?: string }>()
  const navigate = useNavigate()
  const { addModality, updateModality, getModality } = useFightModalities()
  
  const [modality, setModality] = useState<FightModality>({
    modalityId: '',
    name: '',
    description: '',
    type: 'mixed',
    level: 'beginner',
    duration: 60,
    active: true,
    createdAt: new Date().toISOString()
  })
  const [isLoading, setIsLoading] = useState(false)
  const isViewMode = action === 'view'

  const modalityTypes = [
    { value: 'striking', label: 'Striking' },
    { value: 'grappling', label: 'Grappling' },
    { value: 'mixed', label: 'Mixed' },
    { value: 'other', label: 'Other' }
  ]

  const modalityLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' }
  ]

  useEffect(() => {
    if (action === 'edit' || action === 'view') {
      // Load modality data from context
      const existingModality = getModality(id || '')
      if (existingModality) {
        setModality(existingModality)
      } else {
        // If modality not found, navigate back to list
        navigate('/fight-plans/modalities')
      }
    } else if (action === 'new') {
      // Generate new modality ID
      setModality(prev => ({
        ...prev,
        modalityId: `MOD${String(Date.now()).slice(-6)}`,
        createdAt: new Date().toISOString()
      }))
    }
  }, [action, id, getModality, navigate])

  const handleInputChange = (field: keyof FightModality, value: string | number | boolean) => {
    setModality(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('=== MODALITY FORM SUBMISSION STARTED ===')
    console.log('Action:', action)
    console.log('Modality data before submission:', modality)
    
    // Check if required fields are filled
    if (!modality.name || !modality.description) {
      console.error('Missing required fields:', {
        name: modality.name,
        description: modality.description
      })
      alert('Please fill in all required fields')
      return
    }
    
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Form submitted with action:', action)
    console.log('Modality data:', modality)
    
    if (action === 'new') {
      console.log('Adding new modality...')
      addModality(modality)
      console.log('Modality added to context')
    } else if (action === 'edit') {
      console.log('Updating modality...')
      updateModality(modality.modalityId, modality)
    }
    
    setIsLoading(false)
    
    // Navigate back to list
    navigate('/fight-plans/modalities')
  }

  const getPageTitle = () => {
    switch (action) {
      case 'new': return 'New Modality'
      case 'edit': return 'Edit Modality'
      case 'view': return 'View Modality'
      default: return 'Modality Form'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent mb-3">
                {getPageTitle()}
              </h1>
              <p className="text-lg text-gray-300">
                {action === 'new' && 'Register a new fight modality'}
                {action === 'edit' && 'Update modality information'}
                {action === 'view' && 'View modality details'}
              </p>
            </div>
            <Link
              to="/fight-plans/modalities"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center"
            >
              ← Back to Modalities
            </Link>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Modality Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Modality ID */}
              <div>
                <label htmlFor="modalityId" className="block text-sm font-medium text-gray-300 mb-2">Modality ID</label>
                <input
                  id="modalityId"
                  name="modalityId"
                  type="text"
                  value={modality.modalityId}
                  readOnly
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-not-allowed"
                />
              </div>

              {/* Modality Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Modality Name *</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={modality.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  readOnly={isViewMode}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Modality Type */}
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-2">Modality Type *</label>
                <select
                  id="type"
                  name="type"
                  value={modality.type}
                  onChange={(e) => handleInputChange('type', e.target.value as 'striking' | 'grappling' | 'mixed' | 'other')}
                  required
                  disabled={isViewMode}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {modalityTypes.map(type => (
                    <option key={type.value} value={type.value} className="bg-gray-800">
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Modality Level */}
              <div>
                <label htmlFor="level" className="block text-sm font-medium text-gray-300 mb-2">Level *</label>
                <select
                  id="level"
                  name="level"
                  value={modality.level}
                  onChange={(e) => handleInputChange('level', e.target.value as 'beginner' | 'intermediate' | 'advanced' | 'expert')}
                  required
                  disabled={isViewMode}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {modalityLevels.map(level => (
                    <option key={level.value} value={level.value} className="bg-gray-800">
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration */}
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-300 mb-2">Duration (minutes) *</label>
                <input
                  id="duration"
                  name="duration"
                  type="number"
                  min="15"
                  max="180"
                  value={modality.duration}
                  onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                  readOnly={isViewMode}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center">
                <input
                  id="active"
                  name="active"
                  type="checkbox"
                  checked={modality.active}
                  onChange={(e) => handleInputChange('active', e.target.checked)}
                  disabled={isViewMode}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="active" className="ml-2 block text-sm text-gray-300">
                  Active Modality
                </label>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={modality.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                readOnly={isViewMode}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Describe the modality, its techniques, and training focus..."
              />
            </div>
          </div>

          {/* Form Actions */}
          {!isViewMode && (
            <div className="flex justify-end space-x-4">
              <Link
                to="/fight-plans/modalities"
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition-all duration-300"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : action === 'new' ? 'Create Modality' : 'Update Modality'}
              </button>
            </div>
          )}

          {isViewMode && (
            <div className="flex justify-end space-x-4">
              <Link
                to="/fight-plans/modalities"
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition-all duration-300"
              >
                Back to List
              </Link>
              <Link
                to={`/fight-plans/modalities/edit/${modality.modalityId}`}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
              >
                Edit Modality
              </Link>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default FightModalityForm
