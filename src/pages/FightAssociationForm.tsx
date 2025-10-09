import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useFightAssociations, FightAssociation } from '../contexts/FightAssociationContext'
import { useFightModalities } from '../contexts/FightModalityContext'

const FightAssociationForm: React.FC = () => {
  const { action, id } = useParams<{ action: string; id?: string }>()
  const navigate = useNavigate()
  const { addFightAssociation, updateFightAssociation, getFightAssociation } = useFightAssociations()
  const { fightModalities } = useFightModalities()
  
  const [association, setAssociation] = useState<FightAssociation>({
    associationId: '',
    name: '',
    acronym: '',
    type: 'national',
    fightModalities: [],
    country: '',
    region: '',
    website: '',
    description: '',
    establishedYear: undefined,
    headquarters: '',
    contactEmail: '',
    contactPhone: '',
    active: true,
    isMainAssociation: false
  })

  const [isLoading, setIsLoading] = useState(false)
  const isReadOnly = action === 'view'

  useEffect(() => {
    if (action === 'edit' || action === 'view') {
      if (id) {
        const existingAssociation = getFightAssociation(id)
        if (existingAssociation) {
          setAssociation(existingAssociation)
        } else {
          console.error('FightAssociation not found:', id)
          navigate('/championships/fight-associations')
        }
      }
    } else if (action === 'new') {
      // Generate new association ID
      const newId = `ASSOC_${Date.now()}`
      setAssociation(prev => ({ ...prev, associationId: newId }))
    }
  }, [action, id, getFightAssociation, navigate])

  const handleInputChange = (field: keyof FightAssociation, value: string | number | boolean) => {
    setAssociation(prev => ({ ...prev, [field]: value }))
  }

  const handleModalityToggle = (modalityId: string) => {
    setAssociation(prev => {
      const currentModalities = prev.fightModalities || []
      const isSelected = currentModalities.includes(modalityId)
      
      if (isSelected) {
        // Remove modality
        return {
          ...prev,
          fightModalities: currentModalities.filter(id => id !== modalityId)
        }
      } else {
        // Add modality
        return {
          ...prev,
          fightModalities: [...currentModalities, modalityId]
        }
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate that at least one modality is selected
    if (!association.fightModalities || association.fightModalities.length === 0) {
      alert('Please select at least one fight modality')
      return
    }
    
    setIsLoading(true)

    try {
      if (action === 'new') {
        addFightAssociation(association)
        console.log('FightAssociation created:', association)
      } else if (action === 'edit' && id) {
        updateFightAssociation(id, association)
        console.log('FightAssociation updated:', association)
      }
      
      navigate('/championships/fight-associations')
    } catch (error) {
      console.error('Error saving fight association:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/championships/fight-associations')
  }

  const getPageTitle = () => {
    switch (action) {
      case 'new': return 'New Fight Association'
      case 'edit': return 'Edit Fight Association'
      case 'view': return 'View Fight Association'
      default: return 'Fight Association'
    }
  }

  const activeFightModalities = (fightModalities || []).filter((modality: any) => modality.active)
  
  // Debug logging
  console.log('FightAssociationForm: fightModalities:', fightModalities)
  console.log('FightAssociationForm: fightModalities length:', fightModalities?.length || 0)
  console.log('FightAssociationForm: activeFightModalities:', activeFightModalities)
  console.log('FightAssociationForm: activeFightModalities length:', activeFightModalities.length)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-3">
            {getPageTitle()}
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            {action === 'view' ? 'View fight association details' : 
             action === 'edit' ? 'Update fight association information' : 
             'Create a new fight association for competitions and tournaments'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Association ID */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Association ID</label>
                <input
                  value={association.associationId}
                  readOnly
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Association Name *</label>
                <input
                  type="text"
                  value={association.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:opacity-50"
                  placeholder="e.g., International Brazilian Jiu-Jitsu Federation"
                />
              </div>

              {/* Acronym */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Acronym *</label>
                <input
                  type="text"
                  value={association.acronym}
                  onChange={(e) => handleInputChange('acronym', e.target.value)}
                  required
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:opacity-50"
                  placeholder="e.g., IBJJF"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Type *</label>
                <select
                  value={association.type}
                  onChange={(e) => handleInputChange('type', e.target.value as 'international' | 'national' | 'regional' | 'affiliate_network')}
                  required
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:opacity-50"
                >
                  <option value="international">International</option>
                  <option value="national">National</option>
                  <option value="regional">Regional</option>
                  <option value="affiliate_network">Affiliate Network</option>
                </select>
              </div>

              {/* Fight Modalities */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Fight Modalities *</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeFightModalities.map((modality: any) => {
                    const isSelected = association.fightModalities?.includes(modality.modalityId) || false
                    return (
                      <div
                        key={modality.modalityId}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                          isSelected
                            ? 'border-purple-500 bg-purple-500/20'
                            : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
                        } ${isReadOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => !isReadOnly && handleModalityToggle(modality.modalityId)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
                            isSelected
                              ? 'border-purple-500 bg-purple-500'
                              : 'border-white/40'
                          }`}>
                            {isSelected && (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white font-medium text-sm mb-1">{modality.name}</h3>
                            <p className="text-gray-400 text-xs mb-2">{modality.description}</p>
                            <div className="flex flex-wrap gap-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                modality.type === 'striking' 
                                  ? 'bg-red-500/20 text-red-300' 
                                  : modality.type === 'grappling'
                                  ? 'bg-blue-500/20 text-blue-300'
                                  : 'bg-gray-500/20 text-gray-300'
                              }`}>
                                {modality.type}
                              </span>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                modality.level === 'beginner' 
                                  ? 'bg-green-500/20 text-green-300'
                                  : modality.level === 'intermediate'
                                  ? 'bg-orange-500/20 text-orange-300'
                                  : modality.level === 'advanced'
                                  ? 'bg-red-500/20 text-red-300'
                                  : 'bg-purple-500/20 text-purple-300'
                              }`}>
                                {modality.level}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                {association.fightModalities?.length === 0 && (
                  <p className="text-red-400 text-sm mt-2">Please select at least one fight modality</p>
                )}
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
                <input
                  type="text"
                  value={association.country || ''}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:opacity-50"
                  placeholder="e.g., Brazil"
                />
              </div>

              {/* Region */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Region/State</label>
                <input
                  type="text"
                  value={association.region || ''}
                  onChange={(e) => handleInputChange('region', e.target.value)}
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:opacity-50"
                  placeholder="e.g., São Paulo"
                />
              </div>

              {/* Established Year */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Established Year</label>
                <input
                  type="number"
                  min="1800"
                  max="2024"
                  value={association.establishedYear || ''}
                  onChange={(e) => handleInputChange('establishedYear', parseInt(e.target.value) || 0)}
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:opacity-50"
                  placeholder="1994"
                />
              </div>

              {/* Headquarters */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Headquarters</label>
                <input
                  type="text"
                  value={association.headquarters || ''}
                  onChange={(e) => handleInputChange('headquarters', e.target.value)}
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:opacity-50"
                  placeholder="e.g., Rio de Janeiro, Brazil"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
                <input
                  type="url"
                  value={association.website || ''}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:opacity-50"
                  placeholder="https://example.com"
                />
              </div>

              {/* Contact Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Contact Email</label>
                <input
                  type="email"
                  value={association.contactEmail || ''}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:opacity-50"
                  placeholder="info@example.com"
                />
              </div>

              {/* Contact Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Contact Phone</label>
                <input
                  type="tel"
                  value={association.contactPhone || ''}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:opacity-50"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={association.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  disabled={isReadOnly}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:opacity-50"
                  placeholder="Brief description of the association's purpose and activities"
                />
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Status & Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  checked={association.active}
                  onChange={(e) => handleInputChange('active', e.target.checked)}
                  disabled={isReadOnly}
                  className="w-5 h-5 text-yellow-600 bg-white/10 border-white/20 rounded focus:ring-yellow-500 focus:ring-2 disabled:opacity-50"
                />
                <label htmlFor="active" className="ml-3 text-sm font-medium text-gray-300">
                  Active Association
                </label>
              </div>
              <p className="text-xs text-gray-400">
                Only active associations will be available for selection
              </p>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isMainAssociation"
                  checked={association.isMainAssociation}
                  onChange={(e) => handleInputChange('isMainAssociation', e.target.checked)}
                  disabled={isReadOnly}
                  className="w-5 h-5 text-yellow-600 bg-white/10 border-white/20 rounded focus:ring-yellow-500 focus:ring-2 disabled:opacity-50"
                />
                <label htmlFor="isMainAssociation" className="ml-3 text-sm font-medium text-gray-300">
                  Main Association
                </label>
              </div>
              <p className="text-xs text-gray-400">
                Mark as main association for this fight modality (e.g., IBJJF for BJJ)
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          {!isReadOnly && (
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : action === 'new' ? 'Create Association' : 'Update Association'}
              </button>
            </div>
          )}

          {isReadOnly && (
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-colors duration-300"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => navigate(`/championships/fight-associations/edit/${id}`)}
                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/25"
              >
                Edit Association
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default FightAssociationForm
