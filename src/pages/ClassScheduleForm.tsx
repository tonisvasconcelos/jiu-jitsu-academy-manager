import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useClassSchedules, ClassSchedule } from '../contexts/ClassScheduleContext'
import { useBranches } from '../contexts/BranchContext'
import { useBranchFacilities } from '../contexts/BranchFacilityContext'
import { useTeachers } from '../contexts/TeacherContext'
import { useFightModalities } from '../contexts/FightModalityContext'
import ShareIcon from '../components/ShareIcon'

const ClassScheduleForm: React.FC = () => {
  const { action, id } = useParams<{ action: string; id?: string }>()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { classes, addClass, updateClass, getClass } = useClassSchedules()
  const { branches = [] } = useBranches()
  const { facilities = [] } = useBranchFacilities()
  const { teachers = [] } = useTeachers()
  const { modalities: fightModalities = [] } = useFightModalities()

  const [formData, setFormData] = useState<Partial<ClassSchedule>>({
    className: '',
    classDescription: '',
    branchId: '',
    facilityId: '',
    teacherId: '',
    modalityIds: [],
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    daysOfWeek: ['monday'],
    duration: 60,
    maxCapacity: 20,
    currentEnrollment: 0,
    status: 'active',
    classType: 'regular',
    genderCategory: 'unisex',
    ageCategory: 'adult',
    price: 0,
    recurring: true,
    recurringPattern: 'weekly',
    requirements: [],
    equipment: [],
    notes: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (action === 'edit' && id) {
      const existingClass = getClass(id)
      if (existingClass) {
        setFormData(existingClass)
      }
    } else if (action === 'view' && id) {
      const existingClass = getClass(id)
      if (existingClass) {
        setFormData(existingClass)
      }
    }
  }, [action, id, getClass])

  const generateClassId = () => {
    const existingIds = classes.map(c => parseInt(c.classId.replace('CLS', '')))
    const maxId = Math.max(...existingIds, 0)
    return `CLS${String(maxId + 1).padStart(3, '0')}`
  }

  const handleModalityToggle = (modalityId: string) => {
    const currentModalities = formData.modalityIds || []
    if (currentModalities.includes(modalityId)) {
      setFormData({ ...formData, modalityIds: currentModalities.filter(id => id !== modalityId) })
    } else {
      setFormData({ ...formData, modalityIds: [...currentModalities, modalityId] })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.className?.trim()) newErrors.className = 'Class name is required'
    if (!formData.branchId) newErrors.branchId = 'Branch is required'
    if (!formData.facilityId) newErrors.facilityId = 'Facility is required'
    if (!formData.teacherId) newErrors.teacherId = 'Teacher is required'
    if (!formData.modalityIds || formData.modalityIds.length === 0) newErrors.modalityIds = 'At least one modality is required'
    if (!formData.startDate) newErrors.startDate = 'Start date is required'
    if (!formData.endDate) newErrors.endDate = 'End date is required'
    if (!formData.startTime) newErrors.startTime = 'Start time is required'
    if (!formData.endTime) newErrors.endTime = 'End time is required'
    if (!formData.maxCapacity || formData.maxCapacity < 1) newErrors.maxCapacity = 'Max capacity must be at least 1'
    if (!formData.daysOfWeek || formData.daysOfWeek.length === 0) newErrors.daysOfWeek = 'Please select at least one day'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const classData: ClassSchedule = {
        classId: action === 'edit' && id ? id : generateClassId(),
        className: formData.className!,
        classDescription: formData.classDescription,
        branchId: formData.branchId!,
        facilityId: formData.facilityId!,
        teacherId: formData.teacherId!,
        modalityIds: formData.modalityIds!,
        startDate: formData.startDate!,
        endDate: formData.endDate!,
        startTime: formData.startTime!,
        endTime: formData.endTime!,
        daysOfWeek: formData.daysOfWeek!,
        duration: formData.duration!,
        maxCapacity: formData.maxCapacity!,
        currentEnrollment: formData.currentEnrollment || 0,
        status: formData.status!,
        classType: formData.classType!,
        genderCategory: formData.genderCategory!,
        ageCategory: formData.ageCategory!,
        price: formData.price || 0,
        recurring: formData.recurring!,
        recurringPattern: formData.recurringPattern,
        recurringEndDate: formData.recurringEndDate,
        requirements: formData.requirements || [],
        equipment: formData.equipment || [],
        notes: formData.notes,
        createdDate: action === 'edit' && id ? getClass(id)?.createdDate || new Date().toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0]
      }

      if (action === 'edit' && id) {
        updateClass(classData)
      } else {
        addClass(classData)
      }

      navigate('/classes/registration')
    } catch (error) {
      console.error('Error saving class:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isViewMode = action === 'view'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Link
                to="/classes/registration"
                className="mr-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                {action === 'new' ? 'Add New Class' : action === 'edit' ? 'Edit Class' : 'View Class'}
              </h1>
            </div>
            {/* Share Button - Only show for existing classes */}
            {(action === 'edit' || action === 'view') && formData.classId && (
              <ShareIcon 
                classData={formData as ClassSchedule} 
                className="ml-4"
              />
            )}
          </div>
          <p className="text-lg text-gray-300">
            {action === 'new' ? 'Create a new class schedule' : action === 'edit' ? 'Update class information' : 'View class details'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Class Name *
                </label>
                <input
                  type="text"
                  value={formData.className || ''}
                  onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                  disabled={isViewMode}
                  className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.className ? 'border-red-500' : 'border-white/10'
                  }`}
                  placeholder="Enter class name"
                />
                {errors.className && <p className="text-red-400 text-sm mt-1">{errors.className}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Class Type *
                </label>
                <select
                  value={formData.classType || 'regular'}
                  onChange={(e) => setFormData({ ...formData, classType: e.target.value as any })}
                  disabled={isViewMode}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="regular">Regular</option>
                  <option value="private">Private</option>
                  <option value="seminar">Seminar</option>
                  <option value="workshop">Workshop</option>
                  <option value="competition">Competition</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Gender Category *
                </label>
                <select
                  value={formData.genderCategory || 'unisex'}
                  onChange={(e) => setFormData({ ...formData, genderCategory: e.target.value as any })}
                  disabled={isViewMode}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="unisex">Unisex</option>
                  <option value="womens">Women's Only</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Age Category *
                </label>
                <select
                  value={formData.ageCategory || 'adult'}
                  onChange={(e) => setFormData({ ...formData, ageCategory: e.target.value as any })}
                  disabled={isViewMode}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="adult">Adult</option>
                  <option value="master">Master</option>
                  <option value="kids1">Kids 1</option>
                  <option value="kids2">Kids 2</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.classDescription || ''}
                  onChange={(e) => setFormData({ ...formData, classDescription: e.target.value })}
                  disabled={isViewMode}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter class description"
                />
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-6">Schedule & Location</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Branch *
                </label>
                <select
                  value={formData.branchId || ''}
                  onChange={(e) => setFormData({ ...formData, branchId: e.target.value, facilityId: '' })}
                  disabled={isViewMode}
                  className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.branchId ? 'border-red-500' : 'border-white/10'
                  }`}
                >
                  <option value="">Select Branch</option>
                  {branches.map(branch => (
                    <option key={branch.branchId} value={branch.branchId}>
                      {branch.name}
                    </option>
                  ))}
                </select>
                {errors.branchId && <p className="text-red-400 text-sm mt-1">{errors.branchId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Facility *
                </label>
                <select
                  value={formData.facilityId || ''}
                  onChange={(e) => setFormData({ ...formData, facilityId: e.target.value })}
                  disabled={isViewMode || !formData.branchId}
                  className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.facilityId ? 'border-red-500' : 'border-white/10'
                  }`}
                >
                  <option value="">Select Facility</option>
                  {facilities
                    .filter(facility => facility.branchId === formData.branchId)
                    .map(facility => (
                      <option key={facility.facilityId} value={facility.facilityId}>
                        {facility.facilityName}
                      </option>
                    ))}
                </select>
                {errors.facilityId && <p className="text-red-400 text-sm mt-1">{errors.facilityId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Teacher *
                </label>
                <select
                  value={formData.teacherId || ''}
                  onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                  disabled={isViewMode}
                  className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.teacherId ? 'border-red-500' : 'border-white/10'
                  }`}
                >
                  <option value="">Select Teacher</option>
                  {teachers.map(teacher => (
                    <option key={teacher.teacherId} value={teacher.teacherId}>
                      {teacher.firstName} {teacher.lastName}
                    </option>
                  ))}
                </select>
                {errors.teacherId && <p className="text-red-400 text-sm mt-1">{errors.teacherId}</p>}
              </div>

            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-6">Fight Modalities</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fightModalities.map(modality => (
                <div
                  key={modality.modalityId}
                  className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                    formData.modalityIds?.includes(modality.modalityId)
                      ? 'bg-blue-500/20 border-blue-400 text-blue-400'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                  } ${isViewMode ? 'cursor-not-allowed' : ''}`}
                  onClick={() => !isViewMode && handleModalityToggle(modality.modalityId)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{modality.name}</div>
                      <div className="text-xs text-gray-400 mt-1">{modality.description}</div>
                      <div className="flex items-center mt-2 space-x-2">
                        <span className="px-2 py-1 bg-white/10 rounded text-xs">
                          {modality.level}
                        </span>
                      </div>
                    </div>
                    <div className="text-2xl">
                      {formData.modalityIds?.includes(modality.modalityId) ? '✅' : '⬜'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {formData.modalityIds?.length === 0 && (
              <p className="text-sm text-gray-400 mt-2">Please select at least one modality</p>
            )}
            
            {formData.modalityIds && formData.modalityIds.length > 0 && (
              <div className="mt-3 p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-sm font-medium text-white mb-2">Selected Modalities:</div>
                <div className="flex flex-wrap gap-2">
                  {formData.modalityIds.map(modalityId => {
                    const modality = fightModalities.find(m => m.modalityId === modalityId)
                    return modality ? (
                      <span key={modalityId} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm">
                        {modality.name}
                      </span>
                    ) : null
                  })}
                </div>
              </div>
            )}
            
            {errors.modalityIds && <p className="text-red-400 text-sm mt-1">{errors.modalityIds}</p>}
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-6">Timing & Capacity</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Days of Week *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'monday', label: 'Monday' },
                    { value: 'tuesday', label: 'Tuesday' },
                    { value: 'wednesday', label: 'Wednesday' },
                    { value: 'thursday', label: 'Thursday' },
                    { value: 'friday', label: 'Friday' },
                    { value: 'saturday', label: 'Saturday' },
                    { value: 'sunday', label: 'Sunday' }
                  ].map(day => (
                    <label key={day.value} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.daysOfWeek?.includes(day.value as any) || false}
                        onChange={(e) => {
                          const currentDays = formData.daysOfWeek || []
                          if (e.target.checked) {
                            setFormData({ ...formData, daysOfWeek: [...currentDays, day.value as any] })
                          } else {
                            setFormData({ ...formData, daysOfWeek: currentDays.filter(d => d !== day.value) })
                          }
                        }}
                        disabled={isViewMode}
                        className="w-4 h-4 text-blue-600 bg-white/5 border-white/10 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-sm text-gray-300">{day.label}</span>
                    </label>
                  ))}
                </div>
                {formData.daysOfWeek?.length === 0 && (
                  <p className="text-red-400 text-sm mt-1">Please select at least one day</p>
                )}
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Start Time *
                </label>
                <input
                  type="time"
                  value={formData.startTime || ''}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  disabled={isViewMode}
                  className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.startTime ? 'border-red-500' : 'border-white/10'
                  }`}
                />
                {errors.startTime && <p className="text-red-400 text-sm mt-1">{errors.startTime}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  End Time *
                </label>
                <input
                  type="time"
                  value={formData.endTime || ''}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  disabled={isViewMode}
                  className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.endTime ? 'border-red-500' : 'border-white/10'
                  }`}
                />
                {errors.endTime && <p className="text-red-400 text-sm mt-1">{errors.endTime}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.startDate || ''}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  disabled={isViewMode}
                  className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.startDate ? 'border-red-500' : 'border-white/10'
                  }`}
                />
                {errors.startDate && <p className="text-red-400 text-sm mt-1">{errors.startDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  value={formData.endDate || ''}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  disabled={isViewMode}
                  className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.endDate ? 'border-red-500' : 'border-white/10'
                  }`}
                />
                {errors.endDate && <p className="text-red-400 text-sm mt-1">{errors.endDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Max Capacity *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.maxCapacity || ''}
                  onChange={(e) => setFormData({ ...formData, maxCapacity: parseInt(e.target.value) || 0 })}
                  disabled={isViewMode}
                  className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.maxCapacity ? 'border-red-500' : 'border-white/10'
                  }`}
                />
                {errors.maxCapacity && <p className="text-red-400 text-sm mt-1">{errors.maxCapacity}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Price
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  disabled={isViewMode}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {!isViewMode && (
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none"
              >
                {isSubmitting ? 'Saving...' : action === 'edit' ? 'Update Class' : 'Create Class'}
              </button>
              <Link
                to="/classes/registration"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-300"
              >
                Cancel
              </Link>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default ClassScheduleForm
