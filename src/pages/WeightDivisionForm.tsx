import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useWeightDivisions, WeightDivision } from '../contexts/WeightDivisionContext'

const WeightDivisionForm: React.FC = () => {
  const { action, id } = useParams<{ action: string; id?: string }>()
  const navigate = useNavigate()
  const { addWeightDivision, updateWeightDivision, getWeightDivision } = useWeightDivisions()
  
  const [weightDivision, setWeightDivision] = useState<WeightDivision>({
    divisionId: '',
    name: '',
    minWeight: 0,
    maxWeight: 0,
    gender: 'both',
    ageGroup: 'both',
    active: true,
    description: ''
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isReadOnly, setIsReadOnly] = useState(action === 'view')

  useEffect(() => {
    if (action === 'edit' || action === 'view') {
      if (id) {
        const existingDivision = getWeightDivision(id)
        if (existingDivision) {
          setWeightDivision(existingDivision)
        } else {
          console.error('WeightDivision not found:', id)
          navigate('/fight-plans/weight-divisions')
        }
      }
    } else if (action === 'new') {
      // Generate new division ID
      const newId = `DIV_${Date.now()}`
      setWeightDivision(prev => ({ ...prev, divisionId: newId }))
    }
  }, [action, id, getWeightDivision, navigate])

  const handleInputChange = (field: keyof WeightDivision, value: string | number | boolean) => {
    setWeightDivision(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (action === 'new') {
        addWeightDivision(weightDivision)
        console.log('WeightDivision created:', weightDivision)
      } else if (action === 'edit' && id) {
        updateWeightDivision(id, weightDivision)
        console.log('WeightDivision updated:', weightDivision)
      }
      
      navigate('/fight-plans/weight-divisions')
    } catch (error) {
      console.error('Error saving weight division:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/fight-plans/weight-divisions')
  }

  const getPageTitle = () => {
    switch (action) {
      case 'new': return 'New Weight Division'
      case 'edit': return 'Edit Weight Division'
      case 'view': return 'View Weight Division'
      default: return 'Weight Division'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-3">
            {getPageTitle()}
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            {action === 'view' ? 'View weight division details' : 
             action === 'edit' ? 'Update weight division information' : 
             'Create a new weight division for competitions'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Division ID */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Division ID</label>
                <input
                  value={weightDivision.divisionId}
                  readOnly
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Division Name *</label>
                <input
                  type="text"
                  value={weightDivision.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                  placeholder="e.g., Light, Middle, Heavy"
                />
              </div>

              {/* Min Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Minimum Weight (kg) *</label>
                <input
                  type="number"
                  step="0.1"
                  value={weightDivision.minWeight}
                  onChange={(e) => handleInputChange('minWeight', parseFloat(e.target.value) || 0)}
                  required
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                  placeholder="0.0"
                />
              </div>

              {/* Max Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Maximum Weight (kg) *</label>
                <input
                  type="number"
                  step="0.1"
                  value={weightDivision.maxWeight}
                  onChange={(e) => handleInputChange('maxWeight', parseFloat(e.target.value) || 0)}
                  required
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                  placeholder="100.0"
                />
                <p className="text-xs text-gray-400 mt-1">Use 999 for unlimited weight</p>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Gender *</label>
                <select
                  value={weightDivision.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value as 'male' | 'female' | 'both')}
                  required
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="both">Both</option>
                </select>
              </div>

              {/* Age Group */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Age Group *</label>
                <select
                  value={weightDivision.ageGroup}
                  onChange={(e) => handleInputChange('ageGroup', e.target.value as 'adult' | 'kids' | 'both')}
                  required
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                >
                  <option value="adult">Adult</option>
                  <option value="kids">Kids</option>
                  <option value="both">Both</option>
                </select>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={weightDivision.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  disabled={isReadOnly}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                  placeholder="Optional description for this weight division"
                />
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Status</h2>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="active"
                checked={weightDivision.active}
                onChange={(e) => handleInputChange('active', e.target.checked)}
                disabled={isReadOnly}
                className="w-5 h-5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2 disabled:opacity-50"
              />
              <label htmlFor="active" className="ml-3 text-sm font-medium text-gray-300">
                Active Division
              </label>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Only active divisions will be available for student assignment
            </p>
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
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : action === 'new' ? 'Create Division' : 'Update Division'}
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
                onClick={() => navigate(`/fight-plans/weight-divisions/edit/${id}`)}
                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/25"
              >
                Edit Division
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default WeightDivisionForm


