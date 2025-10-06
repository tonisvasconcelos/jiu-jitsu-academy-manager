import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useFightPhases } from '../contexts/FightPhaseContext'
import { useChampionships } from '../contexts/ChampionshipContext'
import { useLanguage } from '../contexts/LanguageContext'

const FightPhaseForm: React.FC = () => {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { id } = useParams()
  const { addPhase, updatePhase, getPhase } = useFightPhases()
  const { championships } = useChampionships()

  const [phase, setPhase] = useState({
    championshipId: '',
    phaseName: '',
    phaseType: 'elimination' as 'elimination' | 'round-robin' | 'bracket' | 'pool',
    phaseOrder: 1,
    startDate: '',
    endDate: '',
    status: 'scheduled' as 'scheduled' | 'active' | 'completed' | 'cancelled',
    description: '',
    maxParticipants: '',
    rules: '',
    isActive: true
  })

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (id && id !== 'new') {
      const existingPhase = getPhase(id)
      if (existingPhase) {
        setPhase({
          championshipId: existingPhase.championshipId,
          phaseName: existingPhase.phaseName,
          phaseType: existingPhase.phaseType,
          phaseOrder: existingPhase.phaseOrder,
          startDate: existingPhase.startDate,
          endDate: existingPhase.endDate,
          status: existingPhase.status,
          description: existingPhase.description || '',
          maxParticipants: existingPhase.maxParticipants?.toString() || '',
          rules: existingPhase.rules || '',
          isActive: existingPhase.isActive
        })
      }
    }
  }, [id, getPhase])

  const handleInputChange = (field: keyof typeof phase, value: string | number | boolean) => {
    setPhase(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const phaseData = {
        ...phase,
        maxParticipants: phase.maxParticipants ? parseInt(phase.maxParticipants) : undefined
      }

      if (id && id !== 'new') {
        updatePhase(id, phaseData)
      } else {
        addPhase(phaseData)
      }
      navigate('/championships/fight-phases')
    } catch (error) {
      console.error('Error saving phase:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getActionTitle = () => {
    if (id === 'new') return t('new-fight-phase')
    if (id?.startsWith('edit')) return t('edit-fight-phase')
    return t('view-fight-phase')
  }

  const getActionDescription = () => {
    if (id === 'new') return t('new-phase-description')
    if (id?.startsWith('edit')) return t('edit-phase-description')
    return t('view-phase-description')
  }

  const isReadOnly = id?.startsWith('view')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
                <span className="mr-3 text-5xl">🥊</span>
                {getActionTitle()}
              </h1>
              <p className="text-gray-400 text-lg">
                {getActionDescription()}
              </p>
            </div>
            <button
              onClick={() => navigate('/championships/fight-phases')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center"
            >
              <span className="mr-2">←</span>
              {t('back-to-phases')}
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/5 rounded-xl border border-white/10 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white border-b border-white/20 pb-2">
                {t('basic-information')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Championship Selection */}
                <div>
                  <label htmlFor="championshipId" className="block text-sm font-medium text-gray-300 mb-2">
                    Championship *
                  </label>
                  <select
                    id="championshipId"
                    value={phase.championshipId}
                    onChange={(e) => handleInputChange('championshipId', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={isReadOnly}
                  >
                    <option value="">Select Championship</option>
                    {championships.map((championship) => (
                      <option key={championship.championshipId} value={championship.championshipId}>
                        {championship.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Phase Name */}
                <div>
                  <label htmlFor="phaseName" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('phase-name')} *
                  </label>
                  <input
                    type="text"
                    id="phaseName"
                    value={phase.phaseName}
                    onChange={(e) => handleInputChange('phaseName', e.target.value)}
                    placeholder={t('phase-name-placeholder')}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={isReadOnly}
                  />
                </div>

                {/* Phase Type */}
                <div>
                  <label htmlFor="phaseType" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('phase-type')} *
                  </label>
                  <select
                    id="phaseType"
                    value={phase.phaseType}
                    onChange={(e) => handleInputChange('phaseType', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={isReadOnly}
                  >
                    <option value="elimination">{t('elimination')}</option>
                    <option value="round-robin">{t('round-robin')}</option>
                    <option value="bracket">{t('bracket')}</option>
                    <option value="pool">{t('pool')}</option>
                  </select>
                </div>

                {/* Phase Order */}
                <div>
                  <label htmlFor="phaseOrder" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('phase-order')} *
                  </label>
                  <input
                    type="number"
                    id="phaseOrder"
                    value={phase.phaseOrder}
                    onChange={(e) => handleInputChange('phaseOrder', parseInt(e.target.value))}
                    placeholder={t('phase-order-placeholder')}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={isReadOnly}
                  />
                </div>

                {/* Start Date */}
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('phase-start-date')} *
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    value={phase.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={isReadOnly}
                  />
                </div>

                {/* End Date */}
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('phase-end-date')} *
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    value={phase.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={isReadOnly}
                  />
                </div>

                {/* Status */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('phase-status')} *
                  </label>
                  <select
                    id="status"
                    value={phase.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={isReadOnly}
                  >
                    <option value="scheduled">{t('scheduled')}</option>
                    <option value="active">{t('active')}</option>
                    <option value="completed">{t('completed')}</option>
                    <option value="cancelled">{t('cancelled')}</option>
                  </select>
                </div>

                {/* Max Participants */}
                <div>
                  <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('max-participants')}
                  </label>
                  <input
                    type="number"
                    id="maxParticipants"
                    value={phase.maxParticipants}
                    onChange={(e) => handleInputChange('maxParticipants', e.target.value)}
                    placeholder={t('max-participants-placeholder')}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isReadOnly}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('phase-description')}
                </label>
                <textarea
                  id="description"
                  value={phase.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder={t('phase-description-placeholder')}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isReadOnly}
                />
              </div>

              {/* Rules */}
              <div>
                <label htmlFor="rules" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('phase-rules')}
                </label>
                <textarea
                  id="rules"
                  value={phase.rules}
                  onChange={(e) => handleInputChange('rules', e.target.value)}
                  placeholder={t('phase-rules-placeholder')}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isReadOnly}
                />
              </div>
            </div>

            {/* Submit Button */}
            {!isReadOnly && (
              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate('/championships/fight-phases')}
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
                      {t('save-phase')}
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default FightPhaseForm
