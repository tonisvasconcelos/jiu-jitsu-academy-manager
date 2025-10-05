import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAffiliations } from '../contexts/AffiliationContext'
import { useStudents } from '../contexts/StudentContext'
import { useFightAssociations } from '../contexts/FightAssociationContext'
import { useLanguage } from '../contexts/LanguageContext'

const AffiliationForm: React.FC = () => {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { id } = useParams()
  const { addAffiliation, updateAffiliation, getAffiliation } = useAffiliations()
  const { students } = useStudents()
  const { associations } = useFightAssociations()

  const [affiliation, setAffiliation] = useState({
    studentId: '',
    associationId: '',
    affiliationDate: new Date().toISOString().split('T')[0],
    status: 'active' as 'active' | 'inactive' | 'suspended',
    membershipNumber: '',
    notes: ''
  })

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (id && id !== 'new') {
      const existingAffiliation = getAffiliation(id)
      if (existingAffiliation) {
        setAffiliation({
          studentId: existingAffiliation.studentId,
          associationId: existingAffiliation.associationId,
          affiliationDate: existingAffiliation.affiliationDate,
          status: existingAffiliation.status,
          membershipNumber: existingAffiliation.membershipNumber || '',
          notes: existingAffiliation.notes || ''
        })
      }
    }
  }, [id, getAffiliation])

  const handleInputChange = (field: keyof typeof affiliation, value: string) => {
    setAffiliation(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (id && id !== 'new') {
        updateAffiliation(id, affiliation)
      } else {
        addAffiliation(affiliation)
      }
      navigate('/championships/affiliations')
    } catch (error) {
      console.error('Error saving affiliation:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.studentId === studentId)
    return student ? `${student.firstName} ${student.lastName}` : 'Unknown Student'
  }

  const getAssociationName = (associationId: string) => {
    const association = associations.find(a => a.associationId === associationId)
    return association ? association.name : 'Unknown Association'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
                <span className="mr-3 text-5xl">🤝</span>
                {id && id !== 'new' ? t('edit-affiliation') : t('new-affiliation')}
              </h1>
              <p className="text-gray-400 text-lg">
                {id && id !== 'new' ? t('edit-affiliation-description') : t('new-affiliation-description')}
              </p>
            </div>
            <button
              onClick={() => navigate('/championships/affiliations')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center"
            >
              <span className="mr-2">←</span>
              {t('back-to-affiliations')}
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/5 rounded-xl border border-white/10 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student Selection */}
              <div>
                <label htmlFor="studentId" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('student')} *
                </label>
                <select
                  id="studentId"
                  value={affiliation.studentId}
                  onChange={(e) => handleInputChange('studentId', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">{t('select-student')}</option>
                  {students.map((student) => (
                    <option key={student.studentId} value={student.studentId}>
                      {student.firstName} {student.lastName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Association Selection */}
              <div>
                <label htmlFor="associationId" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('association')} *
                </label>
                <select
                  id="associationId"
                  value={affiliation.associationId}
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

              {/* Affiliation Date */}
              <div>
                <label htmlFor="affiliationDate" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('affiliation-date')} *
                </label>
                <input
                  type="date"
                  id="affiliationDate"
                  value={affiliation.affiliationDate}
                  onChange={(e) => handleInputChange('affiliationDate', e.target.value)}
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
                  value={affiliation.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="active">{t('active')}</option>
                  <option value="inactive">{t('inactive')}</option>
                  <option value="suspended">{t('suspended')}</option>
                </select>
              </div>

              {/* Membership Number */}
              <div>
                <label htmlFor="membershipNumber" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('membership-number')}
                </label>
                <input
                  type="text"
                  id="membershipNumber"
                  value={affiliation.membershipNumber}
                  onChange={(e) => handleInputChange('membershipNumber', e.target.value)}
                  placeholder={t('membership-number-placeholder')}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-2">
                {t('notes')}
              </label>
              <textarea
                id="notes"
                value={affiliation.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder={t('notes-placeholder')}
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/championships/affiliations')}
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
                    {t('save-affiliation')}
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

export default AffiliationForm
