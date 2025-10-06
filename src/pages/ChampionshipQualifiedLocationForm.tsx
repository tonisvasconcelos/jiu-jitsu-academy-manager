import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useChampionshipQualifiedLocations } from '../contexts/ChampionshipQualifiedLocationContext'
import { useLanguage } from '../contexts/LanguageContext'

const ChampionshipQualifiedLocationForm: React.FC = () => {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { id } = useParams()
  const { addQualifiedLocation, updateQualifiedLocation, getQualifiedLocation } = useChampionshipQualifiedLocations()

  const [location, setLocation] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    capacity: '',
    facilities: [] as string[],
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    imageUrl: '',
    isActive: true,
    certificationLevel: 'basic' as 'basic' | 'intermediate' | 'advanced' | 'premium',
    certificationDate: '',
    certificationExpiry: '',
    notes: ''
  })

  const [isLoading, setIsLoading] = useState(false)
  const [facilityInput, setFacilityInput] = useState('')

  useEffect(() => {
    if (id && id !== 'new') {
      const existingLocation = getQualifiedLocation(id)
      if (existingLocation) {
        setLocation({
          name: existingLocation.name,
          address: existingLocation.address,
          city: existingLocation.city,
          state: existingLocation.state,
          country: existingLocation.country,
          postalCode: existingLocation.postalCode || '',
          capacity: existingLocation.capacity.toString(),
          facilities: existingLocation.facilities,
          contactPerson: existingLocation.contactPerson,
          contactEmail: existingLocation.contactEmail,
          contactPhone: existingLocation.contactPhone,
          imageUrl: existingLocation.imageUrl || '',
          isActive: existingLocation.isActive,
          certificationLevel: existingLocation.certificationLevel,
          certificationDate: existingLocation.certificationDate,
          certificationExpiry: existingLocation.certificationExpiry,
          notes: existingLocation.notes || ''
        })
      }
    }
  }, [id, getQualifiedLocation])

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setLocation(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddFacility = () => {
    if (facilityInput.trim() && !location.facilities.includes(facilityInput.trim())) {
      setLocation(prev => ({
        ...prev,
        facilities: [...prev.facilities, facilityInput.trim()]
      }))
      setFacilityInput('')
    }
  }

  const handleRemoveFacility = (facility: string) => {
    setLocation(prev => ({
      ...prev,
      facilities: prev.facilities.filter(f => f !== facility)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const locationData = {
        ...location,
        capacity: parseInt(location.capacity),
        postalCode: location.postalCode || undefined,
        notes: location.notes || undefined
      }

      if (id && id !== 'new') {
        updateQualifiedLocation(id, locationData)
      } else {
        addQualifiedLocation(locationData)
      }
      navigate('/championships/qualified-locations')
    } catch (error) {
      console.error('Error saving qualified location:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
                <span className="mr-3 text-5xl">🏢</span>
                {id && id !== 'new' ? t('edit-qualified-location') : t('new-qualified-location')}
              </h1>
              <p className="text-gray-400 text-lg">
                {id && id !== 'new' ? t('edit-location-description') : t('new-location-description')}
              </p>
            </div>
            <button
              onClick={() => navigate('/championships/qualified-locations')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center"
            >
              <span className="mr-2">←</span>
              {t('back-to-locations')}
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-6">{t('basic-information')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('location-name')} *
                </label>
                <input
                  type="text"
                  id="name"
                  value={location.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder={t('location-name-placeholder')}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('address')} *
                </label>
                <input
                  type="text"
                  id="address"
                  value={location.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder={t('address-placeholder')}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('city')} *
                </label>
                <input
                  type="text"
                  id="city"
                  value={location.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder={t('city-placeholder')}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('state')} *
                </label>
                <input
                  type="text"
                  id="state"
                  value={location.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder={t('state-placeholder')}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('country')} *
                </label>
                <input
                  type="text"
                  id="country"
                  value={location.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  placeholder={t('country-placeholder')}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('postal-code')}
                </label>
                <input
                  type="text"
                  id="postalCode"
                  value={location.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  placeholder={t('postal-code-placeholder')}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('capacity')} *
                </label>
                <input
                  type="number"
                  id="capacity"
                  value={location.capacity}
                  onChange={(e) => handleInputChange('capacity', e.target.value)}
                  placeholder={t('capacity-placeholder')}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  min="1"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('location-image')}
                </label>
                <div className="space-y-4">
                  <input
                    type="url"
                    id="imageUrl"
                    value={location.imageUrl}
                    onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                    placeholder={t('image-url-placeholder')}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {location.imageUrl && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-300 mb-2">{t('image-preview')}:</p>
                      <div className="relative w-full max-w-md">
                        <img
                          src={location.imageUrl}
                          alt={t('location-image-alt')}
                          className="w-full h-48 object-cover rounded-xl border border-white/20"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleInputChange('imageUrl', '')}
                          className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Facilities */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-6">{t('facilities')}</h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={facilityInput}
                  onChange={(e) => setFacilityInput(e.target.value)}
                  placeholder={t('add-facility-placeholder')}
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFacility())}
                />
                <button
                  type="button"
                  onClick={handleAddFacility}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-300"
                >
                  {t('add')}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {location.facilities.map((facility, index) => (
                  <span
                    key={index}
                    className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg text-sm flex items-center gap-2"
                  >
                    {facility}
                    <button
                      type="button"
                      onClick={() => handleRemoveFacility(facility)}
                      className="text-blue-300 hover:text-blue-200"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-6">{t('contact-information')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('contact-person')} *
                </label>
                <input
                  type="text"
                  id="contactPerson"
                  value={location.contactPerson}
                  onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                  placeholder={t('contact-person-placeholder')}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('contact-email')} *
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  value={location.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  placeholder={t('contact-email-placeholder')}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('contact-phone')} *
                </label>
                <input
                  type="tel"
                  id="contactPhone"
                  value={location.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  placeholder={t('contact-phone-placeholder')}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Certification Information */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-6">{t('certification-information')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="certificationLevel" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('certification-level')} *
                </label>
                <select
                  id="certificationLevel"
                  value={location.certificationLevel}
                  onChange={(e) => handleInputChange('certificationLevel', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="basic">{t('basic')}</option>
                  <option value="intermediate">{t('intermediate')}</option>
                  <option value="advanced">{t('advanced')}</option>
                  <option value="premium">{t('premium')}</option>
                </select>
              </div>

              <div>
                <label htmlFor="isActive" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('status')} *
                </label>
                <select
                  id="isActive"
                  value={location.isActive ? 'active' : 'inactive'}
                  onChange={(e) => handleInputChange('isActive', e.target.value === 'active')}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="active">{t('active')}</option>
                  <option value="inactive">{t('inactive')}</option>
                </select>
              </div>

              <div>
                <label htmlFor="certificationDate" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('certification-date')} *
                </label>
                <input
                  type="date"
                  id="certificationDate"
                  value={location.certificationDate}
                  onChange={(e) => handleInputChange('certificationDate', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="certificationExpiry" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('certification-expiry')} *
                </label>
                <input
                  type="date"
                  id="certificationExpiry"
                  value={location.certificationExpiry}
                  onChange={(e) => handleInputChange('certificationExpiry', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-6">{t('additional-information')}</h2>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-2">
                {t('notes')}
              </label>
              <textarea
                id="notes"
                value={location.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder={t('notes-placeholder')}
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white px-8 py-3 rounded-xl transition-all duration-300 flex items-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t('saving')}
                </>
              ) : (
                <>
                  <span className="mr-2">💾</span>
                  {t('save-location')}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChampionshipQualifiedLocationForm
