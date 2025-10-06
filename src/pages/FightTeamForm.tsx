import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useFightTeams } from '../contexts/FightTeamContext'
import { useStudents } from '../contexts/StudentContext'
import { useLanguage } from '../contexts/LanguageContext'

const FightTeamForm: React.FC = () => {
  const { t } = useLanguage()
  const { action, id } = useParams<{ action: string; id?: string }>()
  const navigate = useNavigate()
  
  const { fightTeams = [], addFightTeam, updateFightTeam, getFightTeam } = useFightTeams()
  const { students = [] } = useStudents()

  const [team, setTeam] = useState({
    teamName: '',
    description: '',
    establishedDate: '',
    isActive: true,
    achievements: [] as string[],
    teamMembers: [] as string[],
    teamLogo: '',
    contactEmail: '',
    contactPhone: '',
    notes: ''
  })

  const [newAchievement, setNewAchievement] = useState('')
  const [newMember, setNewMember] = useState('')

  useEffect(() => {
    if (id && id !== 'new') {
      const existingTeam = getFightTeam(id)
      if (existingTeam) {
        setTeam({
          teamName: existingTeam.teamName,
          description: existingTeam.description || '',
          establishedDate: existingTeam.establishedDate,
          isActive: existingTeam.isActive,
          achievements: existingTeam.achievements || [],
          teamMembers: existingTeam.teamMembers || [],
          teamLogo: existingTeam.teamLogo || '',
          contactEmail: existingTeam.contactEmail || '',
          contactPhone: existingTeam.contactPhone || '',
          notes: existingTeam.notes || ''
        })
      }
    }
  }, [id, getFightTeam])

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setTeam(prev => ({ ...prev, [field]: value }))
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (max 2MB for icons)
      if (file.size > 2 * 1024 * 1024) {
        alert(t('file-too-large'))
        return
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert(t('invalid-file-type'))
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        handleInputChange('teamLogo', result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddAchievement = () => {
    if (newAchievement.trim()) {
      handleInputChange('achievements', [...team.achievements, newAchievement.trim()])
      setNewAchievement('')
    }
  }

  const handleRemoveAchievement = (index: number) => {
    const updatedAchievements = team.achievements.filter((_, i) => i !== index)
    handleInputChange('achievements', updatedAchievements)
  }

  const handleAddMember = () => {
    if (newMember && !team.teamMembers.includes(newMember)) {
      handleInputChange('teamMembers', [...team.teamMembers, newMember])
      setNewMember('')
    }
  }

  const handleRemoveMember = (memberId: string) => {
    const updatedMembers = team.teamMembers.filter(id => id !== memberId)
    handleInputChange('teamMembers', updatedMembers)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!team.teamName || !team.establishedDate) {
      alert(t('fill-required-fields'))
      return
    }

    const teamData = {
      ...team,
      teamSize: team.teamMembers.length
    }

    if (id && id !== 'new') {
      updateFightTeam(id, teamData)
    } else {
      addFightTeam(teamData)
    }

    navigate('/championships/fight-teams')
  }

  const isEdit = action === 'edit'
  const isView = action === 'view'
  const isNew = action === 'new'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
                <span className="mr-3 text-5xl">🥊</span>
                {isEdit ? t('edit-fight-team') : isView ? t('view-fight-team') : t('new-fight-team')}
              </h1>
              <p className="text-gray-400 text-lg">
                {isEdit ? t('edit-fight-team-description') : isView ? t('view-fight-team-description') : t('new-fight-team-description')}
              </p>
            </div>
            <button
              onClick={() => navigate('/championships/fight-teams')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition-all duration-300"
            >
              {t('back-to-teams')}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6">{t('basic-information')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="teamName" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('team-name')} *
                </label>
                <input
                  type="text"
                  id="teamName"
                  value={team.teamName}
                  onChange={(e) => handleInputChange('teamName', e.target.value)}
                  placeholder={t('team-name-placeholder')}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={isView}
                />
              </div>




              <div>
                <label htmlFor="establishedDate" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('established-date')} *
                </label>
                <input
                  type="date"
                  id="establishedDate"
                  value={team.establishedDate}
                  onChange={(e) => handleInputChange('establishedDate', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={isView}
                />
              </div>


              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('description')}
                </label>
                <textarea
                  id="description"
                  value={team.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder={t('team-description-placeholder')}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isView}
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="teamLogo" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('team-logo')}
                </label>
                <div className="space-y-4">
                  {!isView && (
                    <div className="flex items-center justify-center w-full">
                      <label htmlFor="logo-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-white/20 border-dashed rounded-xl cursor-pointer bg-white/5 hover:bg-white/10 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                          </svg>
                          <p className="mb-2 text-sm text-gray-400">
                            <span className="font-semibold">{t('click-to-upload')}</span> {t('or-drag-and-drop')}
                          </p>
                          <p className="text-xs text-gray-500">{t('logo-upload-formats')}</p>
                        </div>
                        <input
                          id="logo-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoUpload}
                        />
                      </label>
                    </div>
                  )}
                  {team.teamLogo && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-300 mb-2">{t('logo-preview')}:</p>
                      <div className="relative w-full max-w-md">
                        <img
                          src={team.teamLogo}
                          alt={t('team-logo-alt')}
                          className="w-full h-48 object-cover rounded-xl border border-white/20"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                        {!isView && (
                          <button
                            type="button"
                            onClick={() => handleInputChange('teamLogo', '')}
                            className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6">{t('team-members')}</h2>
            
            <div className="mb-4">
              <div className="flex gap-2">
                <select
                  value={newMember}
                  onChange={(e) => setNewMember(e.target.value)}
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isView}
                >
                  <option value="">{t('select-student')}</option>
                  {students.filter(student => student.active && !team.teamMembers.includes(student.studentId)).map((student) => (
                    <option key={student.studentId} value={student.studentId}>
                      {student.firstName} {student.lastName}
                    </option>
                  ))}
                </select>
                {!isView && (
                  <button
                    type="button"
                    onClick={handleAddMember}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl transition-colors"
                  >
                    {t('add')}
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              {team.teamMembers.map((memberId) => {
                const student = students.find(s => s.studentId === memberId)
                return (
                  <div key={memberId} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                    <span className="text-white">
                      {student ? `${student.firstName} ${student.lastName}` : `Student ${memberId}`}
                    </span>
                    {!isView && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(memberId)}
                        className="text-red-400 hover:text-red-300"
                      >
                        {t('remove')}
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6">{t('achievements')}</h2>
            
            <div className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newAchievement}
                  onChange={(e) => setNewAchievement(e.target.value)}
                  placeholder={t('achievement-placeholder')}
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isView}
                />
                {!isView && (
                  <button
                    type="button"
                    onClick={handleAddAchievement}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl transition-colors"
                  >
                    {t('add')}
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              {team.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                  <span className="text-white">{achievement}</span>
                  {!isView && (
                    <button
                      type="button"
                      onClick={() => handleRemoveAchievement(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      {t('remove')}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6">{t('contact-information')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('contact-email')}
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  value={team.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  placeholder={t('contact-email-placeholder')}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isView}
                />
              </div>

              <div>
                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('contact-phone')}
                </label>
                <input
                  type="tel"
                  id="contactPhone"
                  value={team.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  placeholder={t('contact-phone-placeholder')}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isView}
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('notes')}
                </label>
                <textarea
                  id="notes"
                  value={team.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder={t('notes-placeholder')}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isView}
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6">{t('status')}</h2>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={team.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                disabled={isView}
              />
              <label htmlFor="isActive" className="ml-2 text-sm text-gray-300">
                {t('active-team')}
              </label>
            </div>
          </div>

          {/* Submit Button */}
          {!isView && (
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl transition-all duration-300"
              >
                {isEdit ? t('update-team') : t('create-team')}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default FightTeamForm
