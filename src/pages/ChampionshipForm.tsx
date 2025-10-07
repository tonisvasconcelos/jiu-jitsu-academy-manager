import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useChampionships } from '../contexts/ChampionshipContext'
import { useFightAssociations } from '../contexts/FightAssociationContext'
import { useFightModalities } from '../contexts/FightModalityContext'
import { useChampionshipQualifiedLocations } from '../contexts/ChampionshipQualifiedLocationContext'
import { useChampionshipRegistrations } from '../contexts/ChampionshipRegistrationContext'
import { useLanguage } from '../contexts/LanguageContext'

const ChampionshipForm: React.FC = () => {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { id } = useParams()
  const { addChampionship, updateChampionship, getChampionship } = useChampionships()
  const { fightAssociations: associations = [] } = useFightAssociations()
  const { modalities = [] } = useFightModalities()
  const { qualifiedLocations = [] } = useChampionshipQualifiedLocations()
  const { registrations = [] } = useChampionshipRegistrations()

  const [championship, setChampionship] = useState({
    associationId: '',
    name: '',
    qualifiedLocationId: '',
    startDate: '',
    endDate: '',
    fightModality: '',
    status: 'upcoming' as 'upcoming' | 'ongoing' | 'completed' | 'cancelled',
    registrationDeadline: '',
    description: '',
    maxParticipants: '',
    entryFee: '',
    organizer: '',
    contactEmail: '',
    contactPhone: ''
  })

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (id && id !== 'new') {
      const existingChampionship = getChampionship(id)
      if (existingChampionship) {
        setChampionship({
          associationId: existingChampionship.associationId,
          name: existingChampionship.name,
          qualifiedLocationId: existingChampionship.qualifiedLocationId,
          startDate: existingChampionship.startDate,
          endDate: existingChampionship.endDate,
          fightModality: existingChampionship.fightModality,
          status: existingChampionship.status,
          registrationDeadline: existingChampionship.registrationDeadline,
          description: existingChampionship.description || '',
          maxParticipants: existingChampionship.maxParticipants?.toString() || '',
          entryFee: existingChampionship.entryFee?.toString() || '',
          organizer: existingChampionship.organizer || '',
          contactEmail: existingChampionship.contactEmail || '',
          contactPhone: existingChampionship.contactPhone || ''
        })
      }
    }
  }, [id, getChampionship])

  const handleInputChange = (field: keyof typeof championship, value: string) => {
    setChampionship(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const championshipData = {
        ...championship,
        maxParticipants: championship.maxParticipants ? parseInt(championship.maxParticipants) : undefined,
        entryFee: championship.entryFee ? parseFloat(championship.entryFee) : undefined
      }

      if (id && id !== 'new') {
        updateChampionship(id, championshipData)
      } else {
        addChampionship(championshipData)
      }
      navigate('/championships/registration')
    } catch (error) {
      console.error('Error saving championship:', error)
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
                <span className="mr-3 text-5xl">🥇</span>
                {id && id !== 'new' ? t('edit-championship') : t('new-championship')}
              </h1>
              <p className="text-gray-400 text-lg">
                {id && id !== 'new' ? t('edit-championship-description') : t('new-championship-description')}
              </p>
            </div>
            <button
              onClick={() => navigate('/championships')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center"
            >
              <span className="mr-2">←</span>
              Back to Championships
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/5 rounded-xl border border-white/10 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Registration Statistics - Only show for existing championships */}
            {id && id !== 'new' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white border-b border-white/20 pb-2">
                  Registration Statistics
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Total Registrations */}
                  <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-400 text-sm font-medium mb-1">Total Registrations</p>
                        <p className="text-3xl font-bold text-white">
                          {registrations.filter(reg => reg.championshipId === id).length}
                        </p>
                      </div>
                      <div className="p-3 bg-blue-500/20 rounded-xl">
                        <span className="text-2xl">📝</span>
                      </div>
                    </div>
                  </div>

                  {/* Confirmed Registrations */}
                  <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-400 text-sm font-medium mb-1">Confirmed</p>
                        <p className="text-3xl font-bold text-white">
                          {registrations.filter(reg => reg.championshipId === id && reg.status === 'confirmed').length}
                        </p>
                      </div>
                      <div className="p-3 bg-green-500/20 rounded-xl">
                        <span className="text-2xl">✅</span>
                      </div>
                    </div>
                  </div>

                  {/* Pending Registrations */}
                  <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-400 text-sm font-medium mb-1">Pending</p>
                        <p className="text-3xl font-bold text-white">
                          {registrations.filter(reg => reg.championshipId === id && reg.status === 'pending').length}
                        </p>
                      </div>
                      <div className="p-3 bg-yellow-500/20 rounded-xl">
                        <span className="text-2xl">⏳</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Weighed In */}
                  <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-400 text-sm font-medium mb-1">Weighed In</p>
                        <p className="text-2xl font-bold text-white">
                          {registrations.filter(reg => reg.championshipId === id && reg.status === 'weighed-in').length}
                        </p>
                      </div>
                      <div className="p-3 bg-purple-500/20 rounded-xl">
                        <span className="text-2xl">⚖️</span>
                      </div>
                    </div>
                  </div>

                  {/* Completed */}
                  <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-emerald-400 text-sm font-medium mb-1">Completed</p>
                        <p className="text-2xl font-bold text-white">
                          {registrations.filter(reg => reg.championshipId === id && reg.status === 'completed').length}
                        </p>
                      </div>
                      <div className="p-3 bg-emerald-500/20 rounded-xl">
                        <span className="text-2xl">🏆</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Registration Progress Bar */}
                {championship.maxParticipants && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-white">Registration Progress</h4>
                      <span className="text-sm text-gray-400">
                        {registrations.filter(reg => reg.championshipId === id).length} / {championship.maxParticipants}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min(
                            (registrations.filter(reg => reg.championshipId === id).length / parseInt(championship.maxParticipants)) * 100, 
                            100
                          )}%` 
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      {Math.round((registrations.filter(reg => reg.championshipId === id).length / parseInt(championship.maxParticipants)) * 100)}% of capacity filled
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Basic Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white border-b border-white/20 pb-2">
                {t('basic-information')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Association */}
                <div>
                  <label htmlFor="associationId" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('association')} *
                  </label>
                  <select
                    id="associationId"
                    value={championship.associationId}
                    onChange={(e) => handleInputChange('associationId', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">{t('select-association')}</option>
                    {associations.map((association) => (
                      <option key={association.associationId} value={association.associationId}>
                        {association.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Championship Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('championship-name')} *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={championship.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder={t('championship-name-placeholder')}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Qualified Location */}
                <div>
                  <label htmlFor="qualifiedLocationId" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('championship-location')} *
                  </label>
                  <select
                    id="qualifiedLocationId"
                    value={championship.qualifiedLocationId}
                    onChange={(e) => handleInputChange('qualifiedLocationId', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">{t('select-qualified-location')}</option>
                    {qualifiedLocations.filter(location => location.isActive).map((location) => (
                      <option key={location.locationId} value={location.locationId}>
                        {location.name} - {location.city}, {location.country}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Fight Modality */}
                <div>
                  <label htmlFor="fightModality" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('fight-modality')} *
                  </label>
                  <select
                    id="fightModality"
                    value={championship.fightModality}
                    onChange={(e) => handleInputChange('fightModality', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">{t('select-modality')}</option>
                    {modalities.map((modality) => (
                      <option key={modality.modalityId} value={modality.modalityId}>
                        {modality.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Start Date */}
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('start-date')} *
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    value={championship.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* End Date */}
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('end-date')} *
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    value={championship.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Registration Deadline */}
                <div>
                  <label htmlFor="registrationDeadline" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('registration-deadline')} *
                  </label>
                  <input
                    type="date"
                    id="registrationDeadline"
                    value={championship.registrationDeadline}
                    onChange={(e) => handleInputChange('registrationDeadline', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Status */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('status')} *
                  </label>
                  <select
                    id="status"
                    value={championship.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="upcoming">{t('upcoming')}</option>
                    <option value="ongoing">{t('ongoing')}</option>
                    <option value="completed">{t('completed')}</option>
                    <option value="cancelled">{t('cancelled')}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white border-b border-white/20 pb-2">
                {t('additional-information')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Max Participants */}
                <div>
                  <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('max-participants')}
                  </label>
                  <input
                    type="number"
                    id="maxParticipants"
                    value={championship.maxParticipants}
                    onChange={(e) => handleInputChange('maxParticipants', e.target.value)}
                    placeholder={t('max-participants-placeholder')}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Entry Fee */}
                <div>
                  <label htmlFor="entryFee" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('entry-fee')}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="entryFee"
                    value={championship.entryFee}
                    onChange={(e) => handleInputChange('entryFee', e.target.value)}
                    placeholder={t('entry-fee-placeholder')}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Organizer */}
                <div>
                  <label htmlFor="organizer" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('organizer')}
                  </label>
                  <input
                    type="text"
                    id="organizer"
                    value={championship.organizer}
                    onChange={(e) => handleInputChange('organizer', e.target.value)}
                    placeholder={t('organizer-placeholder')}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Contact Email */}
                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('contact-email')}
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    value={championship.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    placeholder={t('contact-email-placeholder')}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Contact Phone */}
                <div>
                  <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('contact-phone')}
                  </label>
                  <input
                    type="tel"
                    id="contactPhone"
                    value={championship.contactPhone}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    placeholder={t('contact-phone-placeholder')}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('championship-description')}
                </label>
                <textarea
                  id="description"
                  value={championship.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder={t('championship-description-placeholder')}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/championships/registration')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-xl transition-all duration-300"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white px-8 py-3 rounded-xl transition-all duration-300 flex items-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {t('saving')}...
                  </>
                ) : (
                  <>
                    <span className="mr-2">💾</span>
                    {t('save-championship')}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ChampionshipForm
