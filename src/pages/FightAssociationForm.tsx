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
    fightModality: '',
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
  const [isReadOnly, setIsReadOnly] = useState(action === 'view')

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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

  const activeFightModalities = (fightModalities || []).filter(modality => modality.active)

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

              {/* Fight Modality */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Fight Modality *</label>
                <select
                  value={association.fightModality}
                  onChange={(e) => handleInputChange('fightModality', e.target.value)}
                  required
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:opacity-50"
                >
                  <option value="" className="bg-gray-800">Select Fight Modality</option>
                  {activeFightModalities.map(modality => (
                    <option key={modality.modalityId} value={modality.modalityId} className="bg-gray-800">
                      {modality.name}
                    </option>
                  ))}
                </select>
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
                  onChange={(e) => handleInputChange('establishedYear', parseInt(e.target.value) || undefined)}
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
