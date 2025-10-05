import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useStudents } from '../contexts/StudentContext'
import { useFightModalities } from '../contexts/FightModalityContext'
import { useStudentModalities, StudentModalityConnection } from '../contexts/StudentModalityContext'
import { useClassCheckIns } from '../contexts/ClassCheckInContext'

const StudentModalityForm: React.FC = () => {
  const { action, id, studentId } = useParams<{ action: string; id?: string; studentId?: string }>()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { students } = useStudents()
  const { modalities } = useFightModalities()
  const { addConnection, updateConnection, getConnection } = useStudentModalities()
  const { getCheckInsByStudent } = useClassCheckIns()

  // Helper function to render belt icon
  const renderBeltIcon = (beltLevel: string) => {
    const beltColors: { [key: string]: string } = {
      'white': '#FFFFFF',
      'blue': '#0066CC',
      'purple': '#6633CC',
      'brown': '#8B4513',
      'black': '#000000',
      'kids-white': '#FFFFFF',
      'kids-gray-white': '#C0C0C0',
      'kids-gray': '#808080',
      'kids-gray-black': '#404040',
      'kids-yellow-white': '#FFD700',
      'kids-yellow': '#FFA500',
      'kids-yellow-black': '#FF8C00',
      'kids-orange-white': '#FFA500',
      'kids-orange': '#FF8C00',
      'kids-orange-black': '#FF4500',
      'kids-green-white': '#90EE90',
      'kids-green': '#32CD32',
      'kids-green-black': '#228B22',
      'judo-kids-white': '#FFFFFF',
      'judo-kids-white-yellow': '#FFD700',
      'judo-kids-yellow': '#FFA500',
      'judo-kids-yellow-orange': '#FF8C00',
      'judo-kids-orange': '#FF4500',
      'judo-kids-orange-green': '#32CD32',
      'judo-kids-green': '#228B22'
    };

    const color = beltColors[beltLevel] || '#FFFFFF';
    
    return (
      <div className="flex items-center">
        {/* Simple Belt Bar */}
        <div className="relative w-8 h-4 border border-gray-600" style={{ backgroundColor: color }}>
          {/* White line across center */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white transform -translate-y-1/2" />
        </div>
        <span className="ml-2 text-sm text-gray-300">
          {beltLevel.includes('kids') ? beltLevel.replace('kids-', '').replace('judo-kids-', '') : beltLevel}
        </span>
      </div>
    );
  };

  // Helper function to render stripe icons
  const renderStripeIcons = (count: number) => {
    const maxStripes = 4;
    const stripes = [];
    
    for (let i = 0; i < maxStripes; i++) {
      stripes.push(
        <div
          key={i}
          className={`w-3 h-1 rounded ${
            i < count ? 'bg-yellow-400' : 'bg-gray-600'
          }`}
        />
      );
    }
    
    return (
      <div className="flex items-center space-x-1">
        <div className="flex space-x-1">
          {stripes}
        </div>
        <span className="ml-2 text-sm text-gray-300">
          {count}/{maxStripes}
        </span>
      </div>
    );
  };
  
  const [connection, setConnection] = useState<StudentModalityConnection>({
    connectionId: '',
    studentId: '',
    modalityIds: [],
    assignmentDate: new Date().toISOString().split('T')[0],
    beltLevelAtStart: 'white',
    active: true,
    closingDate: '',
    expectedClosingDate: '',
    expectedCheckInCount: 0,
    stripesAtStart: 0,
    expectedStripesAtConclusion: 0,
    expectedBeltAtClosing: undefined,
    notes: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const isViewMode = action === 'view'

  useEffect(() => {
    if (action === 'edit' || action === 'view') {
      // Load connection data from context
      const existingConnection = getConnection(id || '')
      if (existingConnection) {
        setConnection(existingConnection)
      } else {
        // If connection not found, navigate back to list
        navigate('/students/modality')
      }
    } else if (action === 'new') {
      // Generate new connection ID
      setConnection(prev => {
        const selectedStudent = students.find(s => s.studentId === (studentId || prev.studentId))
        return {
          ...prev,
          connectionId: `CONN${String(Date.now()).slice(-6)}`,
          assignmentDate: new Date().toISOString().split('T')[0],
          // Pre-select student if studentId is provided (coming from student creation)
          studentId: studentId || prev.studentId,
          // Set belt level to student's current belt level
          beltLevelAtStart: selectedStudent?.beltLevel || 'white'
        }
      })
    }
  }, [action, id, studentId, getConnection, navigate, students])

  const handleInputChange = (field: keyof StudentModalityConnection, value: string | string[] | boolean | number) => {
    setConnection(prev => {
      const updated = { ...prev, [field]: value }
      
      // If student changes, update belt level to student's current belt level
      if (field === 'studentId' && typeof value === 'string') {
        const selectedStudent = students.find(s => s.studentId === value)
        updated.beltLevelAtStart = selectedStudent?.beltLevel || 'white'
      }
      
      return updated
    })
  }

  const handleModalityToggle = (modalityId: string) => {
    setConnection(prev => ({
      ...prev,
      modalityIds: prev.modalityIds.includes(modalityId)
        ? prev.modalityIds.filter(id => id !== modalityId)
        : [...prev.modalityIds, modalityId]
    }))
  }

  const handleShareProgress = () => {
    if (!connection.studentId || connection.modalityIds.length === 0 || !connection.assignmentDate || !connection.expectedCheckInCount) {
      return;
    }

    const startDate = connection.assignmentDate;
    const endDate = connection.closingDate || connection.expectedClosingDate || new Date().toISOString().split('T')[0];
    
    // Get all check-ins for the student
    const allStudentCheckIns = getCheckInsByStudent(connection.studentId);
    
    // Filter by date range
    const checkInsInDateRange = allStudentCheckIns.filter(checkIn => 
      checkIn.checkInDate >= startDate && checkIn.checkInDate <= endDate
    );
    
    // Filter by selected modalities
    const selectedModalityNames = modalities
      .filter(m => connection.modalityIds.includes(m.modalityId))
      .map(m => m.name);
    
    const relevantCheckIns = checkInsInDateRange.filter(checkIn => 
      checkIn.fightModalities.some(modality => selectedModalityNames.includes(modality))
    );
    
    const actualCheckIns = relevantCheckIns.length;
    const expectedCheckIns = connection.expectedCheckInCount || 0;
    const progressPercentage = expectedCheckIns > 0 ? Math.min((actualCheckIns / expectedCheckIns) * 100, 100) : 0;
    
    // Get student name
    const student = students.find(s => s.studentId === connection.studentId);
    const studentName = student ? `${student.firstName} ${student.lastName}` : 'Student';
    
    // Create share text
    const shareText = t('share-progress-text')
      .replace('{studentName}', studentName)
      .replace('{actualCheckIns}', actualCheckIns.toString())
      .replace('{expectedCheckIns}', expectedCheckIns.toString())
      .replace('{progressPercentage}', Math.round(progressPercentage).toString());
    
    // Try to use Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: t('training-progress'),
        text: shareText,
        url: window.location.href
      }).catch(console.error);
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText).then(() => {
        alert(t('progress-copied-to-clipboard'));
      }).catch(() => {
        // Final fallback: show in alert
        alert(shareText);
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('=== STUDENT MODALITY FORM SUBMISSION STARTED ===')
    console.log('Action:', action)
    console.log('Connection data before submission:', connection)
    
    // Check if required fields are filled
    if (!connection.studentId || connection.modalityIds.length === 0) {
      console.error('Missing required fields:', {
        studentId: connection.studentId,
        modalityIds: connection.modalityIds
      })
      alert('Please select a student and at least one modality')
      return
    }

    // Check if closing date is required when status is not active
    if (!connection.active && !connection.closingDate) {
      alert('Closing Date is required when assignment status is not Active')
      return
    }
    
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Form submitted with action:', action)
    console.log('Connection data:', connection)
    
    if (action === 'new') {
      console.log('Adding new connection...')
      addConnection(connection)
      console.log('Connection added to context')
    } else if (action === 'edit') {
      console.log('Updating connection...')
      updateConnection(connection.connectionId, connection)
    }
    
    setIsLoading(false)
    
    // Navigate back to list
    navigate('/students/modality')
  }

  const getPageTitle = () => {
    switch (action) {
      case 'new': return 'New Assignment'
      case 'edit': return 'Edit Assignment'
      case 'view': return t('fight-training-plan')
      default: return 'Assignment Form'
    }
  }

  const getSelectedStudent = () => {
    return students.find(s => s.studentId === connection.studentId)
  }

  const getSelectedModalities = () => {
    return modalities.filter(m => connection.modalityIds.includes(m.modalityId))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-3">
                {getPageTitle()}
              </h1>
              <p className="text-lg text-gray-300">
                {action === 'new' && 'Assign modalities to a student'}
                {action === 'edit' && 'Update modality assignment'}
                {action === 'view' && t('view-modality-assignment-details')}
              </p>
            </div>
            <Link
              to="/students/modality"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center"
            >
              ← {t('back-to-assignments')}
            </Link>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Training Progress - Prominent Section */}
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-400/20 rounded-2xl p-6 shadow-lg shadow-blue-500/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="mr-3 text-3xl">📊</span>
                {t('training-progress')}
              </h2>
              <button
                onClick={handleShareProgress}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200 border border-white/20 hover:border-white/30"
                title={t('share-progress')}
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </button>
            </div>
            
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              {(() => {
                if (!connection.studentId || connection.modalityIds.length === 0 || !connection.assignmentDate || !connection.expectedCheckInCount) {
                  return (
                    <div className="text-center py-8">
                      <div className="text-6xl mb-4">📋</div>
                      <p className="text-gray-400 text-lg">Complete the form to see training progress</p>
                    </div>
                  );
                }
                
                const startDate = connection.assignmentDate;
                const endDate = connection.closingDate || connection.expectedClosingDate || new Date().toISOString().split('T')[0];
                
                // Get all check-ins for the student
                const allStudentCheckIns = getCheckInsByStudent(connection.studentId);
                
                // Filter by date range
                const checkInsInDateRange = allStudentCheckIns.filter(checkIn => 
                  checkIn.checkInDate >= startDate && checkIn.checkInDate <= endDate
                );
                
                // Filter by selected modalities
                const selectedModalityNames = modalities
                  .filter(m => connection.modalityIds.includes(m.modalityId))
                  .map(m => m.name);
                
                const relevantCheckIns = checkInsInDateRange.filter(checkIn => 
                  checkIn.fightModalities.some(modality => selectedModalityNames.includes(modality))
                );
                
                const actualCheckIns = relevantCheckIns.length;
                const expectedCheckIns = connection.expectedCheckInCount || 0;
                const progressPercentage = expectedCheckIns > 0 ? Math.min((actualCheckIns / expectedCheckIns) * 100, 100) : 0;
                const remainingCheckIns = Math.max(expectedCheckIns - actualCheckIns, 0);
                
                return (
                  <div className="space-y-6">
                    {/* Progress Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-blue-400 mb-2">{actualCheckIns}</div>
                        <div className="text-sm text-gray-400">{t('completed')}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-orange-400 mb-2">{remainingCheckIns}</div>
                        <div className="text-sm text-gray-400">{t('remaining')}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-green-400 mb-2">{expectedCheckIns}</div>
                        <div className="text-sm text-gray-400">{t('target')}</div>
                      </div>
                    </div>

                    {/* Modern Progress Bar */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-white">{t('check-ins-progress')}</span>
                        <span className="text-lg font-bold text-white">{actualCheckIns} / {expectedCheckIns}</span>
                      </div>
                      
                      {/* Modern Progress Bar Container */}
                      <div className="relative">
                        <div className="w-full bg-gray-700/50 rounded-full h-6 overflow-hidden shadow-inner">
                          <div 
                            className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                            style={{ width: `${progressPercentage}%` }}
                          >
                            {/* Animated gradient background */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 animate-pulse"></div>
                            {/* Shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-pulse"></div>
                          </div>
                        </div>
                        
                        {/* Progress percentage overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm font-bold text-white drop-shadow-lg">
                            {Math.round(progressPercentage)}%
                          </span>
                        </div>
                      </div>

                      {/* Status Message */}
                      <div className="text-center">
                        {progressPercentage >= 100 ? (
                          <div className="inline-flex items-center px-4 py-2 bg-green-500/20 text-green-400 rounded-full border border-green-400/30">
                            <span className="mr-2">🎉</span>
                            <span className="font-semibold">Training Plan Complete!</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full border border-blue-400/30">
                            <span className="mr-2">📈</span>
                            <span className="font-semibold">{remainingCheckIns} {t('check-ins-remaining')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Training Plan Details - New Section */}
          <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm border border-purple-400/20 rounded-2xl p-6 shadow-lg shadow-purple-500/10">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="mr-3 text-3xl">📋</span>
              {t('training-plan-overview')}
            </h2>
            
            {(() => {
              // Calculate check-ins for this section
              let currentCheckIns = 0;
              if (connection.studentId && connection.modalityIds.length > 0 && connection.assignmentDate) {
                const allStudentCheckIns = getCheckInsByStudent(connection.studentId);
                const startDate = new Date(connection.assignmentDate);
                const endDate = connection.expectedClosingDate ? new Date(connection.expectedClosingDate) : new Date();
                
                const modalities = useFightModalities().modalities;
                const selectedModalityNames = modalities
                  .filter(m => connection.modalityIds.includes(m.modalityId))
                  .map(m => m.name);
                
                const relevantCheckIns = allStudentCheckIns.filter(checkIn => {
                  const checkInDate = new Date(checkIn.checkInDate);
                  const isInDateRange = checkInDate >= startDate && checkInDate <= endDate;
                  const hasRelevantModality = checkIn.fightModalities.some(modality => 
                    selectedModalityNames.includes(modality)
                  );
                  return isInDateRange && hasRelevantModality;
                });
                
                currentCheckIns = relevantCheckIns.length;
              }
              
              return (
                <div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Plan Information */}
              <div className="space-y-6">
                {/* Plan Duration */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <span className="mr-2">⏱️</span>
                    {t('plan-duration')}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">{t('assignment-date')}:</span>
                      <span className="text-white font-medium">{connection.assignmentDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">{t('expected-closing-date')}:</span>
                      <span className="text-white font-medium">{connection.expectedClosingDate || 'Not set'}</span>
                    </div>
                    {connection.assignmentDate && connection.expectedClosingDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">{t('plan-duration')}:</span>
                        <span className="text-white font-medium">
                          {Math.ceil((new Date(connection.expectedClosingDate).getTime() - new Date(connection.assignmentDate).getTime()) / (1000 * 60 * 60 * 24))} days
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Target Progression */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <span className="mr-2">🥋</span>
                    {t('target-progression')}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">{t('current-belt')}:</span>
                      <div className="flex items-center">
                        {connection.beltLevelAtStart ? 
                          renderBeltIcon(connection.beltLevelAtStart) : 
                          <span className="text-gray-400 text-sm">Not set</span>
                        }
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">{t('target-belt')}:</span>
                      <div className="flex items-center">
                        {connection.expectedBeltAtClosing ? 
                          renderBeltIcon(connection.expectedBeltAtClosing) : 
                          <span className="text-gray-400 text-sm">Not set</span>
                        }
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">{t('total-stripes-degrees-start')}:</span>
                      <div className="flex items-center">
                        {renderStripeIcons(connection.stripesAtStart || 0)}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">{t('expected-stripes-degrees-conclusions')}:</span>
                      <div className="flex items-center">
                        {renderStripeIcons(connection.expectedStripesAtConclusion || 0)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Training Objectives */}
              <div className="space-y-6">
                {/* Training Frequency */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <span className="mr-2">📅</span>
                    {t('training-frequency')}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">{t('recommended-sessions')}:</span>
                      <span className="text-white font-medium">3-4 sessions</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">{t('expected-count-check-in')}:</span>
                      <span className="text-white font-medium">{connection.expectedCheckInCount || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">{t('attendance-rate')}:</span>
                      <span className="text-white font-medium">
                        {connection.expectedCheckInCount ? Math.round((currentCheckIns / connection.expectedCheckInCount) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Performance Metrics Row */}
            <div className="mt-6 bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <span className="mr-2">📊</span>
                {t('performance-metrics')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">
                    {connection.expectedCheckInCount ? Math.round((currentCheckIns / connection.expectedCheckInCount) * 100) : 0}%
                  </div>
                  <div className="text-sm text-gray-400">{t('attendance-rate')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    {connection.modalityIds.length}
                  </div>
                  <div className="text-sm text-gray-400">Modalities</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400 mb-1">
                    {connection.expectedCheckInCount ? Math.ceil(connection.expectedCheckInCount / 4) : 0}
                  </div>
                  <div className="text-sm text-gray-400">Weeks</div>
                </div>
              </div>
            </div>
                </div>
              );
            })()}
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">{t('assignment-information')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Connection ID */}
              <div>
                <label htmlFor="connectionId" className="block text-sm font-medium text-gray-300 mb-2">{t('connection-id')}</label>
                <input
                  id="connectionId"
                  name="connectionId"
                  type="text"
                  value={connection.connectionId}
                  readOnly
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-not-allowed"
                />
              </div>

              {/* Assignment Date */}
              <div>
                <label htmlFor="assignmentDate" className="block text-sm font-medium text-gray-300 mb-2">{t('assignment-date')} *</label>
                <input
                  id="assignmentDate"
                  name="assignmentDate"
                  type="date"
                  value={connection.assignmentDate}
                  onChange={(e) => handleInputChange('assignmentDate', e.target.value)}
                  readOnly={isViewMode}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Closing Date */}
              <div>
                <label htmlFor="closingDate" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('closing-date')} {!connection.active ? '*' : ''}
                </label>
                <input
                  id="closingDate"
                  name="closingDate"
                  type="date"
                  value={connection.closingDate || ''}
                  onChange={(e) => handleInputChange('closingDate', e.target.value)}
                  readOnly={isViewMode}
                  required={!connection.active}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {!connection.active && (
                  <p className="text-xs text-gray-400 mt-1">
                    Required when assignment status is not Active
                  </p>
                )}
              </div>

              {/* Belt Level at Start */}
              <div>
                <label htmlFor="beltLevelAtStart" className="block text-sm font-medium text-gray-300 mb-2">{t('belt-level-at-start')} *</label>
                <select
                  id="beltLevelAtStart"
                  name="beltLevelAtStart"
                  value={connection.beltLevelAtStart}
                  onChange={(e) => handleInputChange('beltLevelAtStart', e.target.value)}
                  required
                  disabled={isViewMode}
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
                <p className="text-xs text-gray-400 mt-1">{t('belt-level-start-description')}</p>
              </div>


              {/* Expected Closing Date */}
              <div>
                <label htmlFor="expectedClosingDate" className="block text-sm font-medium text-gray-300 mb-2">{t('expected-closing-date')}</label>
                <input
                  id="expectedClosingDate"
                  name="expectedClosingDate"
                  type="date"
                  value={connection.expectedClosingDate || ''}
                  onChange={(e) => handleInputChange('expectedClosingDate', e.target.value)}
                  readOnly={isViewMode}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-400 mt-1">
                  {t('expected-closing-date-description')}
                </p>
              </div>

              {/* Check-in Counter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{t('check-ins-count')}</label>
                <div className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white">
                  {(() => {
                    if (!connection.studentId || connection.modalityIds.length === 0 || !connection.assignmentDate) {
                      return <span className="text-gray-400">Select student and modalities to see check-in count</span>;
                    }
                    
                    const startDate = connection.assignmentDate;
                    const endDate = connection.closingDate || connection.expectedClosingDate || new Date().toISOString().split('T')[0];
                    
                    // Get all check-ins for the student
                    const allStudentCheckIns = getCheckInsByStudent(connection.studentId);
                    
                    // Filter by date range
                    const checkInsInDateRange = allStudentCheckIns.filter(checkIn => 
                      checkIn.checkInDate >= startDate && checkIn.checkInDate <= endDate
                    );
                    
                    // Filter by selected modalities - only count check-ins that have at least one of the selected modalities
                    const selectedModalityNames = modalities
                      .filter(m => connection.modalityIds.includes(m.modalityId))
                      .map(m => m.name);
                    
                    const relevantCheckIns = checkInsInDateRange.filter(checkIn => 
                      checkIn.fightModalities.some(modality => selectedModalityNames.includes(modality))
                    );
                    
                    const totalCheckIns = relevantCheckIns.length;
                    
                    return (
                      <div>
                        <span className="text-2xl font-bold text-blue-400">{totalCheckIns}</span>
                        <span className="text-sm text-gray-400 ml-2">{t('check-ins')}</span>
                        <p className="text-xs text-gray-400 mt-1">
                          {t('from-to').replace('{startDate}', new Date(startDate).toLocaleDateString()).replace('{endDate}', new Date(endDate).toLocaleDateString())}
                        </p>
                      </div>
                    );
                  })()}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {t('check-ins-count-description')}
                </p>
              </div>

              {/* Expected Check-in Count */}
              <div>
                <label htmlFor="expectedCheckInCount" className="block text-sm font-medium text-gray-300 mb-2">{t('expected-count-check-in')}</label>
                <input
                  id="expectedCheckInCount"
                  name="expectedCheckInCount"
                  type="number"
                  min="0"
                  value={connection.expectedCheckInCount || ''}
                  onChange={(e) => handleInputChange('expectedCheckInCount', parseInt(e.target.value) || 0)}
                  readOnly={isViewMode}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter minimum check-ins required"
                />
                <p className="text-xs text-gray-400 mt-1">
                  {t('expected-check-in-description')}
                </p>
              </div>

              {/* Expected Belt at Closing */}
              <div>
                <label htmlFor="expectedBeltAtClosing" className="block text-sm font-medium text-gray-300 mb-2">{t('expected-belt-at-closing')}</label>
                <select
                  id="expectedBeltAtClosing"
                  name="expectedBeltAtClosing"
                  value={connection.expectedBeltAtClosing || ''}
                  onChange={(e) => handleInputChange('expectedBeltAtClosing', e.target.value)}
                  disabled={isViewMode}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                >
                  <option value="">Select expected belt</option>
                  <optgroup label={t('adult-belts')}>
                    <option value="white">{t('white-belt')}</option>
                    <option value="blue">{t('blue-belt')}</option>
                    <option value="purple">{t('purple-belt')}</option>
                    <option value="brown">{t('brown-belt')}</option>
                    <option value="black">{t('black-belt')}</option>
                  </optgroup>
                  <optgroup label={t('kids-belts-bjj')}>
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
                  <optgroup label={t('kids-belts-judo')}>
                    <option value="judo-kids-white">White</option>
                    <option value="judo-kids-white-yellow">White/Yellow</option>
                    <option value="judo-kids-yellow">Yellow</option>
                    <option value="judo-kids-yellow-orange">Yellow/Orange</option>
                    <option value="judo-kids-orange">Orange</option>
                    <option value="judo-kids-orange-green">Orange/Green</option>
                    <option value="judo-kids-green">Green</option>
                  </optgroup>
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  {t('expected-belt-closing-description')}
                </p>
              </div>


            </div>

            {/* Student Selection */}
            <div className="mt-6">
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-300 mb-2">Select Student *</label>
              <select
                id="studentId"
                name="studentId"
                value={connection.studentId}
                onChange={(e) => handleInputChange('studentId', e.target.value)}
                required
                disabled={isViewMode}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="" className="bg-gray-800">Choose a student...</option>
                {students.map(student => (
                  <option key={student.studentId} value={student.studentId} className="bg-gray-800">
                    {student.displayName} ({student.beltLevel} belt)
                  </option>
                ))}
              </select>
              
              {/* Selected Student Info */}
              {connection.studentId && (
                <div className="mt-3 p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      {getSelectedStudent()?.photoUrl ? (
                        <img className="h-12 w-12 rounded-full object-cover" src={getSelectedStudent()?.photoUrl} alt={getSelectedStudent()?.displayName} />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white text-lg font-semibold">
                            {getSelectedStudent()?.firstName.charAt(0)}{getSelectedStudent()?.lastName.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-white">{getSelectedStudent()?.displayName}</div>
                      <div className="text-xs text-gray-400">ID: {connection.studentId}</div>
                      <div className="text-xs text-gray-400">Belt: {getSelectedStudent()?.beltLevel}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modality Selection */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Select Modalities *</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {modalities.map(modality => (
                  <div
                    key={modality.modalityId}
                    className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                      connection.modalityIds.includes(modality.modalityId)
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
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            modality.type === 'striking' ? 'bg-red-500/20 text-red-400' :
                            modality.type === 'grappling' ? 'bg-blue-500/20 text-blue-400' :
                            modality.type === 'mixed' ? 'bg-purple-500/20 text-purple-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {modality.type}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            modality.level === 'beginner' ? 'bg-green-500/20 text-green-400' :
                            modality.level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                            modality.level === 'advanced' ? 'bg-orange-500/20 text-orange-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {modality.level}
                          </span>
                        </div>
                      </div>
                      <div className="text-2xl">
                        {connection.modalityIds.includes(modality.modalityId) ? '✅' : '⬜'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {connection.modalityIds.length === 0 && (
                <p className="text-sm text-gray-400 mt-2">Please select at least one modality</p>
              )}
              
              {connection.modalityIds.length > 0 && (
                <div className="mt-3 p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-sm font-medium text-white mb-2">Selected Modalities:</div>
                  <div className="flex flex-wrap gap-2">
                    {getSelectedModalities().map(modality => (
                      <span key={modality.modalityId} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm">
                        {modality.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Active Status */}
            <div className="mt-6 flex items-center">
              <input
                id="active"
                name="active"
                type="checkbox"
                checked={connection.active}
                onChange={(e) => handleInputChange('active', e.target.checked)}
                disabled={isViewMode}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="active" className="ml-2 block text-sm text-gray-300">
                Active Assignment
              </label>
            </div>

            {/* Notes */}
            <div className="mt-6">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-2">Notes (Optional)</label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                value={connection.notes || ''}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                readOnly={isViewMode}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add any additional notes about this assignment..."
              />
            </div>
          </div>

          {/* Form Actions */}
          {!isViewMode && (
            <div className="flex justify-end space-x-4">
              <Link
                to="/students/modality"
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition-all duration-300"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : action === 'new' ? 'Create Assignment' : 'Update Assignment'}
              </button>
            </div>
          )}

          {isViewMode && (
            <div className="flex justify-end space-x-4">
              <Link
                to="/students/modality"
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition-all duration-300"
              >
                Back to List
              </Link>
              <Link
                to={`/students/modality/edit/${connection.connectionId}`}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
              >
                Edit Assignment
              </Link>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default StudentModalityForm
