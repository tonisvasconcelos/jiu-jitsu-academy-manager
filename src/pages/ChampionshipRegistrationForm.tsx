import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useChampionshipRegistrations } from '../contexts/ChampionshipRegistrationContext'
import { useStudents } from '../contexts/StudentContext'
import { useChampionships } from '../contexts/ChampionshipContext'
import { useChampionshipCategories } from '../contexts/ChampionshipCategoryContext'
import { useTeachers } from '../contexts/TeacherContext'
import { useLanguage } from '../contexts/LanguageContext'

const ChampionshipRegistrationForm: React.FC = () => {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { id } = useParams()
  const { addRegistration, updateRegistration, getRegistration } = useChampionshipRegistrations()
  const { students } = useStudents()
  const { championships } = useChampionships()
  const { categories } = useChampionshipCategories()
  const { teachers } = useTeachers()

  const [registration, setRegistration] = useState({
    studentId: '',
    championshipId: '',
    categoryId: '',
    teacherId: '',
    status: 'pending' as 'pending' | 'confirmed' | 'weighed-in' | 'disqualified' | 'withdrawn' | 'completed',
    registrationDate: new Date().toISOString().split('T')[0],
    weight: '',
    notes: '',
    paymentStatus: 'pending' as 'pending' | 'paid' | 'refunded',
    paymentDate: '',
    medicalCertificate: '',
    insuranceNumber: ''
  })

  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    if (id && id !== 'new') {
      const existingRegistration = getRegistration(id)
      if (existingRegistration) {
        setRegistration({
          studentId: existingRegistration.studentId,
          championshipId: existingRegistration.championshipId,
          categoryId: existingRegistration.categoryId,
          teacherId: existingRegistration.teacherId,
          status: existingRegistration.status,
          registrationDate: existingRegistration.registrationDate,
          weight: existingRegistration.weight?.toString() || '',
          notes: existingRegistration.notes || '',
          paymentStatus: existingRegistration.paymentStatus || 'pending',
          paymentDate: existingRegistration.paymentDate || '',
          medicalCertificate: existingRegistration.medicalCertificate || '',
          insuranceNumber: existingRegistration.insuranceNumber || ''
        })
      }
    }
  }, [id, getRegistration])

  const handleInputChange = (field: keyof typeof registration, value: string) => {
    setRegistration(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const registrationData = {
        ...registration,
        weight: registration.weight ? parseFloat(registration.weight) : undefined
      }

      if (id && id !== 'new') {
        updateRegistration(id, registrationData)
      } else {
        addRegistration(registrationData)
      }
      navigate('/championships/registrations')
    } catch (error) {
      console.error('Error saving registration:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.studentId === studentId)
    return student ? `${student.firstName} ${student.lastName}` : 'Unknown Student'
  }

  const getChampionshipName = (championshipId: string) => {
    const championship = championships.find(c => c.championshipId === championshipId)
    return championship ? championship.name : 'Unknown Championship'
  }

  const getCategoryInfo = (categoryId: string) => {
    const category = categories.find(cat => cat.categoryId === categoryId)
    return category ? `${category.ageGroups.join(', ')} - ${category.belts.join(', ')} - ${category.weightCategory}` : 'Unknown Category'
  }

  const getTeacherName = (teacherId: string) => {
    const teacher = teachers.find(t => t.teacherId === teacherId)
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unknown Teacher'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
                <span className="mr-3 text-5xl">📝</span>
                {id && id !== 'new' ? t('edit-registration') : t('new-registration')}
              </h1>
              <p className="text-gray-400 text-lg">
                {id && id !== 'new' ? t('edit-registration-description') : t('new-registration-description')}
              </p>
            </div>
            <button
              onClick={() => navigate('/championships/registrations')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center"
            >
              <span className="mr-2">←</span>
              {t('back-to-registrations')}
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
                {/* Student Selection */}
                <div>
                  <label htmlFor="studentId" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('student')} *
                  </label>
                  <select
                    id="studentId"
                    value={registration.studentId}
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

                {/* Championship Selection */}
                <div>
                  <label htmlFor="championshipId" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('championship')} *
                  </label>
                  <select
                    id="championshipId"
                    value={registration.championshipId}
                    onChange={(e) => handleInputChange('championshipId', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">{t('select-championship')}</option>
                    {championships.map((championship) => (
                      <option key={championship.championshipId} value={championship.championshipId}>
                        {championship.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category Selection */}
                <div>
                  <label htmlFor="categoryId" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('category')} *
                  </label>
                  <select
                    id="categoryId"
                    value={registration.categoryId}
                    onChange={(e) => handleInputChange('categoryId', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">{t('select-category')}</option>
                    {categories.map((category) => (
                      <option key={category.categoryId} value={category.categoryId}>
                        {category.ageGroups.join(', ')} - {category.belts.join(', ')} - {category.weightCategory} - {t(category.gender)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Teacher Selection */}
                <div>
                  <label htmlFor="teacherId" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('teacher')} *
                  </label>
                  <select
                    id="teacherId"
                    value={registration.teacherId}
                    onChange={(e) => handleInputChange('teacherId', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">{t('select-teacher')}</option>
                    {teachers.map((teacher) => (
                      <option key={teacher.teacherId} value={teacher.teacherId}>
                        {teacher.firstName} {teacher.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Registration Date */}
                <div>
                  <label htmlFor="registrationDate" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('registration-date')} *
                  </label>
                  <input
                    type="date"
                    id="registrationDate"
                    value={registration.registrationDate}
                    onChange={(e) => handleInputChange('registrationDate', e.target.value)}
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
                    value={registration.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="pending">{t('pending')}</option>
                    <option value="confirmed">{t('confirmed')}</option>
                    <option value="weighed-in">{t('weighed-in')}</option>
                    <option value="disqualified">{t('disqualified')}</option>
                    <option value="withdrawn">{t('withdrawn')}</option>
                    <option value="completed">{t('completed')}</option>
                  </select>
                </div>

                {/* Weight */}
                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('weight')}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    id="weight"
                    value={registration.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    placeholder={t('weight-placeholder')}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Payment Status */}
                <div>
                  <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('payment-status')}
                  </label>
                  <select
                    id="paymentStatus"
                    value={registration.paymentStatus}
                    onChange={(e) => handleInputChange('paymentStatus', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pending">{t('pending')}</option>
                    <option value="paid">{t('paid')}</option>
                    <option value="refunded">{t('refunded')}</option>
                  </select>
                </div>

                {/* Payment Date */}
                <div>
                  <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('payment-date')}
                  </label>
                  <input
                    type="date"
                    id="paymentDate"
                    value={registration.paymentDate}
                    onChange={(e) => handleInputChange('paymentDate', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Medical Certificate */}
                <div>
                  <label htmlFor="medicalCertificate" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('medical-certificate')}
                  </label>
                  <input
                    type="text"
                    id="medicalCertificate"
                    value={registration.medicalCertificate}
                    onChange={(e) => handleInputChange('medicalCertificate', e.target.value)}
                    placeholder={t('medical-certificate-placeholder')}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Insurance Number */}
                <div>
                  <label htmlFor="insuranceNumber" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('insurance-number')}
                  </label>
                  <input
                    type="text"
                    id="insuranceNumber"
                    value={registration.insuranceNumber}
                    onChange={(e) => handleInputChange('insuranceNumber', e.target.value)}
                    placeholder={t('insurance-number-placeholder')}
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
                  value={registration.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder={t('notes-placeholder')}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/championships/registrations')}
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
                    {t('save-registration')}
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

export default ChampionshipRegistrationForm
