import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useBranchFacilities, BranchFacility } from '../contexts/BranchFacilityContext'
import { useBranches } from '../contexts/BranchContext'

const BranchFacilityForm: React.FC = () => {
  const { action, id } = useParams<{ action: string; id?: string }>()
  const navigate = useNavigate()
  const { addFacility, updateFacility, getFacility } = useBranchFacilities()
  const { branches } = useBranches()
  
  const [facility, setFacility] = useState<BranchFacility>({
    facilityId: '',
    facilityName: '',
    facilityType: 'training-room',
    capacity: 0,
    areaSize: 0,
    status: 'active',
    branchId: '',
    description: '',
    equipment: [],
    lastMaintenanceDate: '',
    nextMaintenanceDate: '',
    notes: ''
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [isReadOnly, setIsReadOnly] = useState(false)
  const [equipmentInput, setEquipmentInput] = useState('')

  useEffect(() => {
    if (action === 'edit' || action === 'view') {
      const existingFacility = getFacility(id || '')
      if (existingFacility) {
        setFacility(existingFacility)
        setIsReadOnly(action === 'view')
      } else {
        navigate('/branches/facilities')
      }
    } else if (action === 'new') {
      // Generate new facility ID
      setFacility(prev => ({
        ...prev,
        facilityId: `FAC${String(Date.now()).slice(-6)}`
      }))
    }
  }, [action, id, getFacility, navigate])

  const handleInputChange = (field: string, value: any) => {
    setFacility(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleEquipmentAdd = () => {
    if (equipmentInput.trim() && !facility.equipment?.includes(equipmentInput.trim())) {
      setFacility(prev => ({
        ...prev,
        equipment: [...(prev.equipment || []), equipmentInput.trim()]
      }))
      setEquipmentInput('')
    }
  }

  const handleEquipmentRemove = (equipment: string) => {
    setFacility(prev => ({
      ...prev,
      equipment: prev.equipment?.filter(e => e !== equipment) || []
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (action === 'new') {
        addFacility(facility)
        alert('Facility created successfully!')
      } else if (action === 'edit') {
        updateFacility(facility)
        alert('Facility updated successfully!')
      }
      navigate('/branches/facilities')
    } catch (error) {
      console.error('Error saving facility:', error)
      alert('Error saving facility. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getFacilityTypeDisplayName = (type: string) => {
    const typeNames = {
      'training-room': 'Training Room',
      'tatami-dojo': 'Tatami / Dojo',
      'weights-room': 'Weights Room',
      'office': 'Office',
      'reception': 'Reception',
      'locker-room': 'Locker Room',
      'parking': 'Parking',
      'other': 'Other'
    }
    return typeNames[type as keyof typeof typeNames] || type
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {action === 'new' ? 'New Facility' : action === 'edit' ? 'Edit Facility' : 'View Facility'}
            </h1>
            <p className="text-gray-400">
              {action === 'new' ? 'Register a new facility' : action === 'edit' ? 'Update facility information' : 'View facility details'}
            </p>
          </div>
          <Link
            to="/branches/facilities"
            className="inline-flex items-center px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Facilities
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="facilityName" className="block text-sm font-medium text-gray-300 mb-2">
                  Facility Name *
                </label>
                <input
                  type="text"
                  id="facilityName"
                  name="facilityName"
                  value={facility.facilityName}
                  onChange={(e) => handleInputChange('facilityName', e.target.value)}
                  disabled={isReadOnly}
                  required
                  maxLength={100}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter facility name"
                />
              </div>

              <div>
                <label htmlFor="facilityType" className="block text-sm font-medium text-gray-300 mb-2">
                  Facility Type *
                </label>
                <select
                  id="facilityType"
                  name="facilityType"
                  value={facility.facilityType}
                  onChange={(e) => handleInputChange('facilityType', e.target.value)}
                  disabled={isReadOnly}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="training-room">Training Room</option>
                  <option value="tatami-dojo">Tatami / Dojo</option>
                  <option value="weights-room">Weights Room</option>
                  <option value="office">Office</option>
                  <option value="reception">Reception</option>
                  <option value="locker-room">Locker Room</option>
                  <option value="parking">Parking</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="branchId" className="block text-sm font-medium text-gray-300 mb-2">
                  Branch *
                </label>
                <select
                  id="branchId"
                  name="branchId"
                  value={facility.branchId}
                  onChange={(e) => handleInputChange('branchId', e.target.value)}
                  disabled={isReadOnly}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select a branch</option>
                  {branches.map(branch => (
                    <option key={branch.branchId} value={branch.branchId}>{branch.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-2">
                  Status *
                </label>
                <select
                  id="status"
                  name="status"
                  value={facility.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  disabled={isReadOnly}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="under-maintenance">Under Maintenance</option>
                </select>
              </div>
            </div>
          </div>

          {/* Capacity and Size */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Capacity & Size</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-gray-300 mb-2">
                  Capacity (Number of People) *
                </label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  value={facility.capacity}
                  onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 0)}
                  disabled={isReadOnly}
                  required
                  min="1"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter maximum capacity"
                />
              </div>

              <div>
                <label htmlFor="areaSize" className="block text-sm font-medium text-gray-300 mb-2">
                  Area Size (m²) *
                </label>
                <input
                  type="number"
                  id="areaSize"
                  name="areaSize"
                  value={facility.areaSize}
                  onChange={(e) => handleInputChange('areaSize', parseFloat(e.target.value) || 0)}
                  disabled={isReadOnly}
                  required
                  min="0"
                  step="0.1"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter area size in square meters"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Description</h2>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={facility.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                disabled={isReadOnly}
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter facility description"
              />
            </div>
          </div>

          {/* Equipment */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Equipment</h2>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={equipmentInput}
                  onChange={(e) => setEquipmentInput(e.target.value)}
                  disabled={isReadOnly}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleEquipmentAdd())}
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Add equipment item"
                />
                <button
                  type="button"
                  onClick={handleEquipmentAdd}
                  disabled={isReadOnly || !equipmentInput.trim()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
              
              {facility.equipment && facility.equipment.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {facility.equipment.map((equipment, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm"
                    >
                      {equipment}
                      {!isReadOnly && (
                        <button
                          type="button"
                          onClick={() => handleEquipmentRemove(equipment)}
                          className="ml-2 text-blue-300 hover:text-blue-200"
                        >
                          ×
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Maintenance */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Maintenance</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="lastMaintenanceDate" className="block text-sm font-medium text-gray-300 mb-2">
                  Last Maintenance Date
                </label>
                <input
                  type="date"
                  id="lastMaintenanceDate"
                  name="lastMaintenanceDate"
                  value={facility.lastMaintenanceDate || ''}
                  onChange={(e) => handleInputChange('lastMaintenanceDate', e.target.value)}
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label htmlFor="nextMaintenanceDate" className="block text-sm font-medium text-gray-300 mb-2">
                  Next Maintenance Date
                </label>
                <input
                  type="date"
                  id="nextMaintenanceDate"
                  name="nextMaintenanceDate"
                  value={facility.nextMaintenanceDate || ''}
                  onChange={(e) => handleInputChange('nextMaintenanceDate', e.target.value)}
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Notes</h2>
            
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-2">
                Additional Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={facility.notes || ''}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                disabled={isReadOnly}
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter any additional notes"
              />
            </div>
          </div>

          {/* Submit Button */}
          {!isReadOnly && (
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : action === 'new' ? 'Create Facility' : 'Update Facility'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default BranchFacilityForm


