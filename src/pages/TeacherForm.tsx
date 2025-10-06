import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTeachers, Teacher } from '../contexts/TeacherContext'
import { useBranches } from '../contexts/BranchContext'
import { useFightModalities } from '../contexts/FightModalityContext'
import { useWeightDivisions } from '../contexts/WeightDivisionContext'

const TeacherForm: React.FC = () => {
  const { action, id } = useParams<{ action: string; id?: string }>()
  const navigate = useNavigate()
  const { addTeacher, updateTeacher, getTeacher } = useTeachers()
  const { branches } = useBranches()
  const { modalities } = useFightModalities()
  const { weightDivisions } = useWeightDivisions()
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [teacher, setTeacher] = useState<Teacher>({
    teacherId: '',
    firstName: '',
    lastName: '',
    displayName: '',
    birthDate: '',
    gender: 'male',
    teacherType: 'instructor',
    beltLevel: 'white',
    documentId: '',
    email: '',
    phone: '',
    branchId: '',
    active: true,
    isKidsStudent: false,
    weight: undefined,
    weightDivisionId: undefined,
    photoUrl: '',
    fightModalities: [],
    experience: 0,
    certifications: [],
    bio: '',
    hireDate: new Date().toISOString().split('T')[0],
    salary: undefined,
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [isReadOnly, setIsReadOnly] = useState(false)
  const [certificationInput, setCertificationInput] = useState('')

  useEffect(() => {
    if (action === 'edit' || action === 'view') {
      const existingTeacher = getTeacher(id || '')
      if (existingTeacher) {
        setTeacher(existingTeacher)
        setIsReadOnly(action === 'view')
      } else {
        navigate('/teachers/registration')
      }
    } else if (action === 'new') {
      // Generate new teacher ID
      setTeacher(prev => ({
        ...prev,
        teacherId: `TCH${String(Date.now()).slice(-6)}`
      }))
    }
  }, [action, id, getTeacher, navigate])

  const handleInputChange = (field: string, value: any) => {
    setTeacher(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleEmergencyContactChange = (field: string, value: string) => {
    setTeacher(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [field]: value
      }
    }))
  }

  const handleModalityToggle = (modalityId: string) => {
    setTeacher(prev => ({
      ...prev,
      fightModalities: prev.fightModalities.includes(modalityId)
        ? prev.fightModalities.filter(id => id !== modalityId)
        : [...prev.fightModalities, modalityId]
    }))
  }

  const handleAddCertification = () => {
    if (certificationInput.trim()) {
      setTeacher(prev => ({
        ...prev,
        certifications: [...prev.certifications, certificationInput.trim()]
      }))
      setCertificationInput('')
    }
  }

  const handleRemoveCertification = (index: number) => {
    setTeacher(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }))
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setTeacher(prev => ({
          ...prev,
          photoUrl: result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if required fields are filled
    if (!teacher.firstName || !teacher.lastName || !teacher.email || !teacher.branchId || teacher.fightModalities.length === 0) {
      alert('Please fill in all required fields and select at least one fight modality')
      return
    }

    // Generate display name
    const displayName = `${teacher.firstName} ${teacher.lastName}`
    const teacherWithDisplayName = { ...teacher, displayName }

    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    try {
      if (action === 'new') {
        addTeacher(teacherWithDisplayName)
        alert('Teacher created successfully!')
      } else if (action === 'edit') {
        updateTeacher(teacher.teacherId, teacherWithDisplayName)
        alert('Teacher updated successfully!')
      }
      
      navigate('/teachers')
    } catch (error) {
      console.error('Error saving teacher:', error)
      alert('Error saving teacher. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }


  const activeFightModalities = modalities.filter(modality => modality.active)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {action === 'new' ? 'New Teacher' : action === 'edit' ? 'Edit Teacher' : 'View Teacher'}
            </h1>
            <p className="text-gray-400">
              {action === 'new' ? 'Register a new teacher' : action === 'edit' ? 'Update teacher information' : 'View teacher details'}
            </p>
          </div>
          <Link
            to="/students"
            className="inline-flex items-center px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Coach & Students
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Teacher ID */}
              <div>
                <label htmlFor="teacherId" className="block text-sm font-medium text-gray-300 mb-2">Teacher ID</label>
                <input
                  id="teacherId"
                  name="teacherId"
                  type="text"
                  value={teacher.teacherId}
                  readOnly
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-not-allowed"
                />
              </div>

              {/* Teacher Type */}
              <div>
                <label htmlFor="teacherType" className="block text-sm font-medium text-gray-300 mb-2">Teacher Type *</label>
                <select
                  id="teacherType"
                  name="teacherType"
                  value={teacher.teacherType}
                  onChange={(e) => handleInputChange('teacherType', e.target.value)}
                  required
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="professor">Professor</option>
                  <option value="instructor">Instructor</option>
                  <option value="trainee">Trainee</option>
                </select>
              </div>

              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">First Name *</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={teacher.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                  readOnly={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">Last Name *</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={teacher.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                  readOnly={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Birth Date */}
              <div>
                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-300 mb-2">Birth Date *</label>
                <input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  value={teacher.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  required
                  readOnly={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Gender */}
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-300 mb-2">Gender *</label>
                <select
                  id="gender"
                  name="gender"
                  value={teacher.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  required
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Document ID */}
              <div>
                <label htmlFor="documentId" className="block text-sm font-medium text-gray-300 mb-2">Document ID *</label>
                <input
                  id="documentId"
                  name="documentId"
                  type="text"
                  value={teacher.documentId}
                  onChange={(e) => handleInputChange('documentId', e.target.value)}
                  required
                  readOnly={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={teacher.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  readOnly={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">Phone *</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={teacher.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                  readOnly={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Branch */}
              <div>
                <label htmlFor="branchId" className="block text-sm font-medium text-gray-300 mb-2">Branch *</label>
                <select
                  id="branchId"
                  name="branchId"
                  value={teacher.branchId}
                  onChange={(e) => handleInputChange('branchId', e.target.value)}
                  required
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a branch</option>
                  {branches.map(branch => (
                    <option key={branch.branchId} value={branch.branchId}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Martial Arts Information */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Martial Arts Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Belt Level */}
              <div>
                <label htmlFor="beltLevel" className="block text-sm font-medium text-gray-300 mb-2">Belt Level *</label>
                <select
                  id="beltLevel"
                  name="beltLevel"
                  value={teacher.beltLevel}
                  onChange={(e) => handleInputChange('beltLevel', e.target.value)}
                  required
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {/* Adult Belts */}
                  <optgroup label="Adult Belts">
                    <option value="white">White Belt</option>
                    <option value="blue">Blue Belt</option>
                    <option value="purple">Purple Belt</option>
                    <option value="brown">Brown Belt</option>
                    <option value="black">Black Belt</option>
                  </optgroup>
                  
                  {/* BJJ Kids Belts */}
                  <optgroup label="BJJ Kids Belts">
                    <option value="kids-white">White</option>
                    <option value="kids-gray-white">Gray/White</option>
                    <option value="kids-gray">Gray</option>
                    <option value="kids-gray-black">Gray/Black</option>
                    <option value="kids-yellow-white">Yellow/White</option>
                    <option value="kids-yellow">Yellow</option>
                    <option value="kids-yellow-black">Yellow/Black</option>
                    <option value="kids-orange-white">Orange/White</option>
                    <option value="kids-orange">Orange</option>
                    <option value="kids-orange-black">Orange/Black</option>
                    <option value="kids-green-white">Green/White</option>
                    <option value="kids-green">Green</option>
                    <option value="kids-green-black">Green/Black</option>
                  </optgroup>
                  
                  {/* Judo Kids Belts */}
                  <optgroup label="Judo Kids Belts">
                    <option value="judo-kids-white">White</option>
                    <option value="judo-kids-white-yellow">White/Yellow</option>
                    <option value="judo-kids-yellow">Yellow</option>
                    <option value="judo-kids-yellow-orange">Yellow/Orange</option>
                    <option value="judo-kids-orange">Orange</option>
                    <option value="judo-kids-orange-green">Orange/Green</option>
                    <option value="judo-kids-green">Green</option>
                  </optgroup>
                </select>
              </div>

              {/* Experience */}
              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-300 mb-2">Experience (Years) *</label>
                <input
                  id="experience"
                  name="experience"
                  type="number"
                  min="0"
                  value={teacher.experience}
                  onChange={(e) => handleInputChange('experience', parseInt(e.target.value) || 0)}
                  required
                  readOnly={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Weight */}
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-300 mb-2">Weight (kg)</label>
                <input
                  id="weight"
                  name="weight"
                  type="number"
                  step="0.1"
                  min="0"
                  value={teacher.weight || ''}
                  onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || undefined)}
                  readOnly={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Weight Division */}
              <div>
                <label htmlFor="weightDivisionId" className="block text-sm font-medium text-gray-300 mb-2">Weight Division</label>
                <select
                  id="weightDivisionId"
                  name="weightDivisionId"
                  value={teacher.weightDivisionId || ''}
                  onChange={(e) => handleInputChange('weightDivisionId', e.target.value || undefined)}
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select weight division</option>
                  {weightDivisions.map(division => (
                    <option key={division.divisionId} value={division.divisionId}>
                      {division.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Fight Modalities */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Fight Modalities *</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeFightModalities.map((modality) => {
                  const isSelected = teacher.fightModalities.includes(modality.modalityId)
                  return (
                    <div
                      key={modality.modalityId}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
                      } ${isReadOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => !isReadOnly && handleModalityToggle(modality.modalityId)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
                          isSelected
                            ? 'border-purple-500 bg-purple-500'
                            : 'border-white/40'
                        }`}>
                          {isSelected && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-medium text-sm mb-1">{modality.name}</h3>
                          <p className="text-gray-400 text-xs mb-2">{modality.description}</p>
                          <div className="flex flex-wrap gap-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              modality.type === 'striking' 
                                ? 'bg-red-500/20 text-red-300' 
                                : modality.type === 'grappling'
                                ? 'bg-blue-500/20 text-blue-300'
                                : 'bg-gray-500/20 text-gray-300'
                            }`}>
                              {modality.type}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              modality.level === 'beginner' 
                                ? 'bg-green-500/20 text-green-300'
                                : modality.level === 'intermediate'
                                ? 'bg-orange-500/20 text-orange-300'
                                : modality.level === 'advanced'
                                ? 'bg-red-500/20 text-red-300'
                                : 'bg-purple-500/20 text-purple-300'
                            }`}>
                              {modality.level}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              {teacher.fightModalities.length === 0 && (
                <p className="text-red-400 text-sm mt-2">Please select at least one fight modality</p>
              )}
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Professional Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hire Date */}
              <div>
                <label htmlFor="hireDate" className="block text-sm font-medium text-gray-300 mb-2">Hire Date *</label>
                <input
                  id="hireDate"
                  name="hireDate"
                  type="date"
                  value={teacher.hireDate}
                  onChange={(e) => handleInputChange('hireDate', e.target.value)}
                  required
                  readOnly={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Salary */}
              <div>
                <label htmlFor="salary" className="block text-sm font-medium text-gray-300 mb-2">Salary</label>
                <input
                  id="salary"
                  name="salary"
                  type="number"
                  min="0"
                  step="0.01"
                  value={teacher.salary || ''}
                  onChange={(e) => handleInputChange('salary', parseFloat(e.target.value) || undefined)}
                  readOnly={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Active Status */}
              <div className="md:col-span-2">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={teacher.active}
                    onChange={(e) => handleInputChange('active', e.target.checked)}
                    disabled={isReadOnly}
                    className="w-5 h-5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-gray-300">Active Teacher</span>
                </label>
              </div>
            </div>

            {/* Certifications */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Certifications</label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={certificationInput}
                    onChange={(e) => setCertificationInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCertification())}
                    placeholder="Add certification..."
                    disabled={isReadOnly}
                    className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleAddCertification}
                    disabled={isReadOnly || !certificationInput.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {teacher.certifications.map((cert, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-500/20 text-blue-300"
                    >
                      {cert}
                      {!isReadOnly && (
                        <button
                          type="button"
                          onClick={() => handleRemoveCertification(index)}
                          className="ml-2 text-blue-400 hover:text-blue-300"
                        >
                          ×
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="mt-6">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                value={teacher.bio || ''}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                readOnly={isReadOnly}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tell us about the teacher's background and experience..."
              />
            </div>
          </div>

          {/* Photo Upload */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Photo</h2>
            
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                {teacher.photoUrl ? (
                  <img
                    src={teacher.photoUrl}
                    alt="Teacher photo"
                    className="h-24 w-24 rounded-full object-cover border-2 border-white/20"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-2 border-white/20">
                    <span className="text-white font-semibold text-2xl">
                      {teacher.firstName.charAt(0)}{teacher.lastName.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isReadOnly}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {teacher.photoUrl ? 'Change Photo' : 'Upload Photo'}
                </button>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG or GIF (max 5MB)</p>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Emergency Contact</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="emergencyName" className="block text-sm font-medium text-gray-300 mb-2">Contact Name *</label>
                <input
                  id="emergencyName"
                  name="emergencyName"
                  type="text"
                  value={teacher.emergencyContact.name}
                  onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
                  required
                  readOnly={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="emergencyPhone" className="block text-sm font-medium text-gray-300 mb-2">Contact Phone *</label>
                <input
                  id="emergencyPhone"
                  name="emergencyPhone"
                  type="tel"
                  value={teacher.emergencyContact.phone}
                  onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
                  required
                  readOnly={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="emergencyRelationship" className="block text-sm font-medium text-gray-300 mb-2">Relationship *</label>
                <input
                  id="emergencyRelationship"
                  name="emergencyRelationship"
                  type="text"
                  value={teacher.emergencyContact.relationship}
                  onChange={(e) => handleEmergencyContactChange('relationship', e.target.value)}
                  required
                  readOnly={isReadOnly}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          {!isReadOnly && (
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                {isLoading ? 'Saving...' : action === 'new' ? 'Create Teacher' : 'Update Teacher'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default TeacherForm
