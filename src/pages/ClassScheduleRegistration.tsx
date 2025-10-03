import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useClassSchedules } from '../contexts/ClassScheduleContext'
import { useFightModalities } from '../contexts/FightModalityContext'
import { useBranches } from '../contexts/BranchContext'
import { useBranchFacilities } from '../contexts/BranchFacilityContext'
import { useTeachers } from '../contexts/TeacherContext'

const ClassScheduleRegistration: React.FC = () => {
  const { t } = useLanguage()
  const { classes = [], deleteClass } = useClassSchedules()
  const { modalities: fightModalities = [] } = useFightModalities()
  const { branches = [] } = useBranches()
  const { facilities = [] } = useBranchFacilities()
  const { teachers = [] } = useTeachers()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  const filteredClasses = classes.filter(classItem => {
    const matchesSearch = classItem.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classItem.classDescription?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || classItem.status === statusFilter
    const matchesType = typeFilter === 'all' || classItem.classType === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'inactive': return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'regular': return 'bg-blue-500/20 text-blue-400'
      case 'private': return 'bg-purple-500/20 text-purple-400'
      case 'seminar': return 'bg-orange-500/20 text-orange-400'
      case 'workshop': return 'bg-yellow-500/20 text-yellow-400'
      case 'competition': return 'bg-red-500/20 text-red-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getModalityNames = (modalityIds: string[]) => {
    return modalityIds.map(id => {
      const modality = fightModalities.find(m => m.modalityId === id)
      return modality ? modality.name : id
    }).join(', ')
  }

  const getTeacherName = (teacherId: string) => {
    const teacher = teachers.find(t => t.teacherId === teacherId)
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : teacherId
  }

  const getBranchName = (branchId: string) => {
    const branch = branches.find(b => b.branchId === branchId)
    return branch ? branch.name : branchId
  }

  const getFacilityName = (facilityId: string) => {
    const facility = facilities.find(f => f.facilityId === facilityId)
    return facility ? facility.facilityName : facilityId
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-3">
                Class Schedule Registration
              </h1>
              <p className="text-lg text-gray-300">
                Manage and view all class schedules
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Link
                to="/classes/registration/new"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <span className="mr-2">➕</span>
                Add New Class
              </Link>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="regular">Regular</option>
              <option value="private">Private</option>
              <option value="seminar">Seminar</option>
              <option value="workshop">Workshop</option>
              <option value="competition">Competition</option>
            </select>
          </div>
          <div className="flex items-center text-gray-400">
            <span>Total: {filteredClasses.length} classes</span>
          </div>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredClasses.map((classItem) => (
            <div
              key={classItem.classId}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {classItem.className}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">
                    {classItem.classDescription}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(classItem.status)}`}>
                    {classItem.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(classItem.classType)}`}>
                    {classItem.classType}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-300">
                  <span className="mr-2">📅</span>
                  <span>{classItem.daysOfWeek.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(', ')} • {classItem.startTime} - {classItem.endTime}</span>
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <span className="mr-2">👥</span>
                  <span>{classItem.currentEnrollment}/{classItem.maxCapacity} students</span>
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <span className="mr-2">⏱️</span>
                  <span>{classItem.duration} minutes</span>
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <span className="mr-2">👨‍🏫</span>
                  <span>{getTeacherName(classItem.teacherId)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <span className="mr-2">🏢</span>
                  <span>{getBranchName(classItem.branchId)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <span className="mr-2">🏟️</span>
                  <span>{getFacilityName(classItem.facilityId)}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  to={`/classes/registration/view/${classItem.classId}`}
                  className="flex-1 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-lg text-center text-sm font-medium transition-all duration-300"
                >
                  View
                </Link>
                <Link
                  to={`/classes/registration/edit/${classItem.classId}`}
                  className="flex-1 px-4 py-2 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 border border-yellow-500/30 rounded-lg text-center text-sm font-medium transition-all duration-300"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteClass(classItem.classId)}
                  className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-lg text-sm font-medium transition-all duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredClasses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No classes found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search criteria or add a new class.</p>
            <Link
              to="/classes/registration/new"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <span className="mr-2">➕</span>
              Add New Class
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default ClassScheduleRegistration
