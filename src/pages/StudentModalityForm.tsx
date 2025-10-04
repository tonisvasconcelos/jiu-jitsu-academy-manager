import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useStudents } from '../contexts/StudentContext'
import { useFightModalities } from '../contexts/FightModalityContext'
import { useStudentModalities, StudentModalityConnection } from '../contexts/StudentModalityContext'
import { useClassCheckIns } from '../contexts/ClassCheckInContext'

const StudentModalityForm: React.FC = () => {
  const { action, id, studentId } = useParams<{ action: string; id?: string; studentId?: string }>()
  const navigate = useNavigate()
  const { students } = useStudents()
  const { modalities } = useFightModalities()
  const { addConnection, updateConnection, getConnection } = useStudentModalities()
  const { getCheckInsByStudent } = useClassCheckIns()
  
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
      case 'view': return 'FIGHT TRAINING PLAN'
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
                {action === 'view' && 'View modality assignment details'}
              </p>
            </div>
            <Link
              to="/students/modality"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center"
            >
              ← Back to Assignments
            </Link>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Assignment Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Connection ID */}
              <div>
                <label htmlFor="connectionId" className="block text-sm font-medium text-gray-300 mb-2">Connection ID</label>
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
                <label htmlFor="assignmentDate" className="block text-sm font-medium text-gray-300 mb-2">Assignment Date *</label>
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
                  Closing Date {!connection.active ? '*' : ''}
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
                <label htmlFor="beltLevelAtStart" className="block text-sm font-medium text-gray-300 mb-2">Belt Level at Start *</label>
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
                <p className="text-xs text-gray-400 mt-1">The student's belt level when starting this modality</p>
              </div>

              {/* Total of Stripes/Degrees at Start */}
              <div>
                <label htmlFor="stripesAtStart" className="block text-sm font-medium text-gray-300 mb-2">Total of Stripes/Degrees at Start</label>
                <input
                  id="stripesAtStart"
                  name="stripesAtStart"
                  type="number"
                  min="0"
                  max="4"
                  value={connection.stripesAtStart || ''}
                  onChange={(e) => handleInputChange('stripesAtStart', parseInt(e.target.value) || 0)}
                  readOnly={isViewMode}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter stripes/degrees at start"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Number of stripes or degrees the student had when starting this modality
                </p>
              </div>

              {/* Expected Closing Date */}
              <div>
                <label htmlFor="expectedClosingDate" className="block text-sm font-medium text-gray-300 mb-2">Expected Closing Date</label>
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
                  Planned end date for this modality assignment
                </p>
              </div>

              {/* Check-in Counter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Check-ins Count</label>
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
                        <span className="text-sm text-gray-400 ml-2">check-ins</span>
                        <p className="text-xs text-gray-400 mt-1">
                          From {new Date(startDate).toLocaleDateString()} to {new Date(endDate).toLocaleDateString()}
                        </p>
                      </div>
                    );
                  })()}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Total archived check-ins for this student in selected modalities within the defined time range
                </p>
              </div>

              {/* Expected Check-in Count */}
              <div>
                <label htmlFor="expectedCheckInCount" className="block text-sm font-medium text-gray-300 mb-2">Expected Count of Check-in</label>
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
                  Minimum number of check-ins required to conclude this training plan
                </p>
              </div>

              {/* Expected Stripes/Degrees at Conclusions */}
              <div>
                <label htmlFor="expectedStripesAtConclusion" className="block text-sm font-medium text-gray-300 mb-2">Expected Stripes/Degrees at Conclusions</label>
                <input
                  id="expectedStripesAtConclusion"
                  name="expectedStripesAtConclusion"
                  type="number"
                  min="0"
                  max="4"
                  value={connection.expectedStripesAtConclusion || ''}
                  onChange={(e) => handleInputChange('expectedStripesAtConclusion', parseInt(e.target.value) || 0)}
                  readOnly={isViewMode}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter expected stripes/degrees at conclusion"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Expected number of stripes or degrees the student should have when concluding this training plan
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
