import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useStudents } from '../contexts/StudentContext'
import { useFightModalities } from '../contexts/FightModalityContext'
import { useStudentModalities, StudentModalityConnection } from '../contexts/StudentModalityContext'

const StudentModalityForm: React.FC = () => {
  const { t } = useLanguage()
  const { action, id } = useParams<{ action: string; id?: string }>()
  const navigate = useNavigate()
  const { students } = useStudents()
  const { modalities } = useFightModalities()
  const { addConnection, updateConnection, getConnection } = useStudentModalities()
  
  const [connection, setConnection] = useState<StudentModalityConnection>({
    connectionId: '',
    studentId: '',
    modalityIds: [],
    assignmentDate: new Date().toISOString().split('T')[0],
    active: true,
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
      setConnection(prev => ({
        ...prev,
        connectionId: `CONN${String(Date.now()).slice(-6)}`,
        assignmentDate: new Date().toISOString().split('T')[0]
      }))
    }
  }, [action, id, getConnection, navigate])

  const handleInputChange = (field: keyof StudentModalityConnection, value: string | string[] | boolean) => {
    setConnection(prev => ({
      ...prev,
      [field]: value
    }))
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
      case 'view': return 'View Assignment'
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
