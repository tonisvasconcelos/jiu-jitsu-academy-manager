import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useBranches, Branch } from '../contexts/BranchContext'

const BranchForm: React.FC = () => {
  const { t } = useLanguage()
  const { action, id } = useParams<{ action: string; id?: string }>()
  const navigate = useNavigate()
  const { addBranch, updateBranch, getBranch } = useBranches()
  
  const [branch, setBranch] = useState<Branch>({
    branchId: '',
    name: '',
    address: '',
    city: '',
    state: '',
    country: 'Brazil',
    countryCode: 'BR',
    postalCode: '',
    phone: '',
    email: '',
    website: '',
    workingHours: {
      monday: { open: '06:00', close: '22:00', closed: false },
      tuesday: { open: '06:00', close: '22:00', closed: false },
      wednesday: { open: '06:00', close: '22:00', closed: false },
      thursday: { open: '06:00', close: '22:00', closed: false },
      friday: { open: '06:00', close: '22:00', closed: false },
      saturday: { open: '08:00', close: '18:00', closed: false },
      sunday: { open: '08:00', close: '16:00', closed: false }
    },
    facilities: [],
    capacity: 30,
    active: true,
    establishedDate: new Date().toISOString().split('T')[0],
    managerName: '',
    managerPhone: '',
    managerEmail: '',
    notes: ''
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isReadOnly, setIsReadOnly] = useState(action === 'view')

  // Available facilities options
  const facilityOptions = [
    'Mats', 'Weights', 'Shower', 'Parking', 'Locker Room', 
    'Changing Room', 'Reception', 'Storage', 'Office', 'Restroom'
  ]

  // Country options
  const countryOptions = [
    { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
    { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
    { code: 'CL', name: 'Chile', flag: '🇨🇱' },
    { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
    { code: 'PE', name: 'Peru', flag: '🇵🇪' },
    { code: 'UY', name: 'Uruguay', flag: '🇺🇾' },
    { code: 'PY', name: 'Paraguay', flag: '🇵🇾' }
  ]

  useEffect(() => {
    if (action === 'edit' || action === 'view') {
      // Load branch data from context
      const existingBranch = getBranch(id || '')
      if (existingBranch) {
        setBranch(existingBranch)
      }
    } else if (action === 'new') {
      // Generate new branch ID
      setBranch(prev => ({
        ...prev,
        branchId: `BR${String(Date.now()).slice(-6)}`
      }))
    }
  }, [action, id, getBranch])

  const handleInputChange = (field: keyof Branch, value: string | boolean | number | string[]) => {
    setBranch(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleWorkingHoursChange = (day: string, field: 'open' | 'close' | 'closed', value: string | boolean) => {
    setBranch(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day as keyof typeof prev.workingHours],
          [field]: value
        }
      }
    }))
  }

  const handleFacilityToggle = (facility: string) => {
    setBranch(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }))
  }

  const handleCountryChange = (countryCode: string) => {
    const selectedCountry = countryOptions.find(c => c.code === countryCode)
    setBranch(prev => ({
      ...prev,
      countryCode,
      country: selectedCountry?.name || prev.country
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('=== BRANCH FORM SUBMISSION STARTED ===')
    console.log('Action:', action)
    console.log('Branch data before submission:', branch)
    
    // Check if required fields are filled
    if (!branch.name || !branch.address || !branch.city || !branch.country || !branch.managerName) {
      console.error('Missing required fields:', {
        name: branch.name,
        address: branch.address,
        city: branch.city,
        country: branch.country,
        managerName: branch.managerName
      })
      alert('Please fill in all required fields')
      return
    }
    
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Form submitted with action:', action)
    console.log('Branch data:', branch)
    
    if (action === 'new') {
      console.log('Adding new branch...')
      addBranch(branch)
      console.log('Branch added to context')
    } else if (action === 'edit') {
      console.log('Updating branch...')
      updateBranch(branch.branchId, branch)
    }
    
    setIsLoading(false)
    
    // Navigate back to list
    navigate('/branches/registration')
  }

  const getPageTitle = () => {
    switch (action) {
      case 'new': return 'New Branch'
      case 'edit': return 'Edit Branch'
      case 'view': return 'View Branch'
      default: return 'Branch'
    }
  }

  const getPageIcon = () => {
    switch (action) {
      case 'new': return '➕'
      case 'edit': return '✏️'
      case 'view': return '👁️'
      default: return '🏢'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-400 via-teal-500 to-blue-500 bg-clip-text text-transparent mb-3">
                {getPageIcon()} {getPageTitle()}
              </h1>
              <p className="text-lg text-gray-300">
                {action === 'new' && 'Register a new branch'}
                {action === 'edit' && 'Update branch information'}
                {action === 'view' && 'View branch details'}
              </p>
            </div>
            <Link
              to="/branches/registration"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center"
            >
              ← Back to List
            </Link>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Branch ID */}
              <div>
                <label htmlFor="branchId" className="block text-sm font-medium text-gray-300 mb-2">Branch ID</label>
                <input
                  id="branchId"
                  name="branchId"
                  type="text"
                  value={branch.branchId}
                  readOnly
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Branch Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Branch Name *</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={branch.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-2">Address *</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={branch.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  required
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                />
              </div>

              {/* City */}
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-2">City *</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={branch.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  required
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                />
              </div>

              {/* State */}
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-300 mb-2">State/Province</label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  value={branch.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                />
              </div>

              {/* Country */}
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-2">Country *</label>
                <select
                  id="country"
                  name="country"
                  value={branch.countryCode}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  required
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                >
                  {countryOptions.map(country => (
                    <option key={country.code} value={country.code} className="bg-gray-800">
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Postal Code */}
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-300 mb-2">Postal Code</label>
                <input
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  value={branch.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Contact Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={branch.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={branch.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                />
              </div>

              {/* Website */}
              <div className="md:col-span-2">
                <label htmlFor="website" className="block text-sm font-medium text-gray-300 mb-2">Website</label>
                <input
                  id="website"
                  name="website"
                  type="url"
                  value={branch.website || ''}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Working Hours</h2>
            
            <div className="space-y-4">
              {Object.entries(branch.workingHours).map(([day, hours]) => (
                <div key={day} className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl">
                  <div className="w-24">
                    <label className="block text-sm font-medium text-gray-300 capitalize">
                      {day}
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={hours.closed}
                      onChange={(e) => handleWorkingHoursChange(day, 'closed', e.target.checked)}
                      disabled={isReadOnly}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded disabled:opacity-50"
                    />
                    <span className="text-sm text-gray-300">Closed</span>
                  </div>
                  
                  {!hours.closed && (
                    <>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Open</label>
                        <input
                          type="time"
                          value={hours.open}
                          onChange={(e) => handleWorkingHoursChange(day, 'open', e.target.value)}
                          disabled={isReadOnly}
                          className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Close</label>
                        <input
                          type="time"
                          value={hours.close}
                          onChange={(e) => handleWorkingHoursChange(day, 'close', e.target.value)}
                          disabled={isReadOnly}
                          className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                        />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Facilities and Capacity */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Facilities and Capacity</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Capacity */}
              <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-gray-300 mb-2">Capacity (students)</label>
                <input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min="1"
                  value={branch.capacity}
                  onChange={(e) => handleInputChange('capacity', parseInt(e.target.value))}
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                />
              </div>

              {/* Established Date */}
              <div>
                <label htmlFor="establishedDate" className="block text-sm font-medium text-gray-300 mb-2">Established Date</label>
                <input
                  id="establishedDate"
                  name="establishedDate"
                  type="date"
                  value={branch.establishedDate}
                  onChange={(e) => handleInputChange('establishedDate', e.target.value)}
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                />
              </div>
            </div>

            {/* Facilities */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">Facilities</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {facilityOptions.map(facility => (
                  <div
                    key={facility}
                    className={`p-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                      branch.facilities.includes(facility)
                        ? 'bg-green-500/20 border-green-400 text-green-400'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                    } ${isReadOnly ? 'cursor-not-allowed' : ''}`}
                    onClick={() => !isReadOnly && handleFacilityToggle(facility)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{facility}</span>
                      <span className="text-lg">
                        {branch.facilities.includes(facility) ? '✅' : '⬜'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Manager Information */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Manager Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Manager Name */}
              <div>
                <label htmlFor="managerName" className="block text-sm font-medium text-gray-300 mb-2">Manager Name *</label>
                <input
                  id="managerName"
                  name="managerName"
                  type="text"
                  value={branch.managerName}
                  onChange={(e) => handleInputChange('managerName', e.target.value)}
                  required
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                />
              </div>

              {/* Manager Phone */}
              <div>
                <label htmlFor="managerPhone" className="block text-sm font-medium text-gray-300 mb-2">Manager Phone</label>
                <input
                  id="managerPhone"
                  name="managerPhone"
                  type="tel"
                  value={branch.managerPhone}
                  onChange={(e) => handleInputChange('managerPhone', e.target.value)}
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                />
              </div>

              {/* Manager Email */}
              <div className="md:col-span-2">
                <label htmlFor="managerEmail" className="block text-sm font-medium text-gray-300 mb-2">Manager Email</label>
                <input
                  id="managerEmail"
                  name="managerEmail"
                  type="email"
                  value={branch.managerEmail}
                  onChange={(e) => handleInputChange('managerEmail', e.target.value)}
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          {/* Status and Notes */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Status and Notes</h2>
            
            <div className="space-y-6">
              {/* Active Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  checked={branch.active}
                  onChange={(e) => handleInputChange('active', e.target.checked)}
                  disabled={isReadOnly}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded disabled:opacity-50"
                />
                <label htmlFor="active" className="ml-2 block text-sm text-gray-300">
                  Active Branch
                </label>
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  value={branch.notes || ''}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                  placeholder="Add any additional notes about this branch..."
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {!isReadOnly && (
            <div className="flex justify-end space-x-4">
              <Link
                to="/branches/registration"
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition-all duration-300"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : action === 'new' ? 'Create Branch' : 'Update Branch'}
              </button>
            </div>
          )}

          {isReadOnly && (
            <div className="flex justify-end space-x-4">
              <Link
                to="/branches/registration"
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition-all duration-300"
              >
                Back to List
              </Link>
              <Link
                to={`/branches/registration/edit/${branch.branchId}`}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
              >
                Edit Branch
              </Link>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default BranchForm
