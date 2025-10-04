import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useClassSchedules } from '../contexts/ClassScheduleContext'
import { useBranches } from '../contexts/BranchContext'
import { useBranchFacilities } from '../contexts/BranchFacilityContext'
import { useTeachers } from '../contexts/TeacherContext'
import { useFightModalities } from '../contexts/FightModalityContext'

const ClassCalendar: React.FC = () => {
  const { t } = useLanguage()
  const { classes = [] } = useClassSchedules()
  const { branches = [] } = useBranches()
  const { facilities = [] } = useBranchFacilities()
  const { teachers = [] } = useTeachers()
  const { modalities: fightModalities = [] } = useFightModalities()

  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [weekStart, setWeekStart] = useState<Date>(new Date())
  
  // Filter states
  const [teacherFilter, setTeacherFilter] = useState('all')
  const [branchFilter, setBranchFilter] = useState('all')
  const [facilityFilter, setFacilityFilter] = useState('all')
  const [modalityFilter, setModalityFilter] = useState('all')
  const [genderFilter, setGenderFilter] = useState('all')
  const [ageCategoryFilter, setAgeCategoryFilter] = useState('all')

  // Calculate the start of the current week (Monday)
  useEffect(() => {
    const today = new Date(currentWeek)
    const dayOfWeek = today.getDay()
    const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek // Sunday = 0, Monday = 1
    const monday = new Date(today)
    monday.setDate(today.getDate() + daysToMonday)
    setWeekStart(monday)
  }, [currentWeek])

  // Get classes for the current week with filters applied
  const getClassesForWeek = () => {
    const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    const weekClasses: { [key: string]: any[] } = {}
    
    // Initialize empty arrays for each day
    weekDays.forEach(day => {
      weekClasses[day] = []
    })

    // Filter classes that occur during this week and match filter criteria
    classes.forEach(classItem => {
      if (classItem.status === 'active') {
        // Apply filters
        const matchesTeacher = teacherFilter === 'all' || classItem.teacherId === teacherFilter
        const matchesBranch = branchFilter === 'all' || classItem.branchId === branchFilter
        const matchesFacility = facilityFilter === 'all' || classItem.facilityId === facilityFilter
        const matchesModality = modalityFilter === 'all' || classItem.modalityIds.includes(modalityFilter)
        const matchesGender = genderFilter === 'all' || classItem.genderCategory === genderFilter
        const matchesAgeCategory = ageCategoryFilter === 'all' || classItem.ageCategory === ageCategoryFilter

        if (matchesTeacher && matchesBranch && matchesFacility && matchesModality && matchesGender && matchesAgeCategory) {
          classItem.daysOfWeek.forEach(day => {
            if (weekClasses[day]) {
              weekClasses[day].push(classItem)
            }
          })
        }
      }
    })

    return weekClasses
  }

  const weekClasses = getClassesForWeek()

  // Helper functions
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

  const getClassTypeColor = (classType: string) => {
    switch (classType) {
      case 'regular': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'private': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'seminar': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'workshop': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'competition': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getGenderIcon = (genderCategory: string) => {
    return genderCategory === 'womens' ? '👩' : '👥'
  }

  const getAgeCategoryColor = (ageCategory: string) => {
    switch (ageCategory) {
      case 'adult': return 'text-blue-400'
      case 'master': return 'text-purple-400'
      case 'kids1': return 'text-green-400'
      case 'kids2': return 'text-yellow-400'
      default: return 'text-gray-400'
    }
  }

  const clearAllFilters = () => {
    setTeacherFilter('all')
    setBranchFilter('all')
    setFacilityFilter('all')
    setModalityFilter('all')
    setGenderFilter('all')
    setAgeCategoryFilter('all')
  }

  const hasActiveFilters = () => {
    return teacherFilter !== 'all' || branchFilter !== 'all' || facilityFilter !== 'all' || 
           modalityFilter !== 'all' || genderFilter !== 'all' || ageCategoryFilter !== 'all'
  }

  // Navigation functions
  const goToPreviousWeek = () => {
    const newWeek = new Date(currentWeek)
    newWeek.setDate(currentWeek.getDate() - 7)
    setCurrentWeek(newWeek)
  }

  const goToNextWeek = () => {
    const newWeek = new Date(currentWeek)
    newWeek.setDate(currentWeek.getDate() + 7)
    setCurrentWeek(newWeek)
  }

  const goToCurrentWeek = () => {
    setCurrentWeek(new Date())
  }

  // Get week dates
  const getWeekDates = () => {
    const dates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart)
      date.setDate(weekStart.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const weekDates = getWeekDates()
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2 sm:mb-3">
                📅 Class Calendar
              </h1>
              <p className="text-base sm:text-lg text-gray-300">
                View and manage class schedules in calendar format
              </p>
            </div>
            <div>
              <Link
                to="/classes/registration"
                className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-sm sm:text-base w-full sm:w-auto"
              >
                <span className="mr-2">➕</span>
                Add New Class
              </Link>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
            <h3 className="text-lg font-semibold text-white">Filters</h3>
            {hasActiveFilters() && (
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-lg text-sm transition-all duration-300 w-full sm:w-auto"
              >
                Clear All Filters
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
            {/* Teacher Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Teacher</label>
              <select
                value={teacherFilter}
                onChange={(e) => setTeacherFilter(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Teachers</option>
                {teachers.map(teacher => (
                  <option key={teacher.teacherId} value={teacher.teacherId}>
                    {teacher.firstName} {teacher.lastName}
                  </option>
                ))}
              </select>
            </div>

            {/* Branch Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Branch</label>
              <select
                value={branchFilter}
                onChange={(e) => {
                  setBranchFilter(e.target.value)
                  setFacilityFilter('all') // Reset facility when branch changes
                }}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Branches</option>
                {branches.map(branch => (
                  <option key={branch.branchId} value={branch.branchId}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Facility Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Facility</label>
              <select
                value={facilityFilter}
                onChange={(e) => setFacilityFilter(e.target.value)}
                disabled={branchFilter === 'all'}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="all">All Facilities</option>
                {facilities
                  .filter(facility => branchFilter === 'all' || facility.branchId === branchFilter)
                  .map(facility => (
                    <option key={facility.facilityId} value={facility.facilityId}>
                      {facility.facilityName}
                    </option>
                  ))}
              </select>
            </div>

            {/* Modality Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Fight Modality</label>
              <select
                value={modalityFilter}
                onChange={(e) => setModalityFilter(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Modalities</option>
                {fightModalities.map(modality => (
                  <option key={modality.modalityId} value={modality.modalityId}>
                    {modality.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Gender Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Genders</option>
                <option value="unisex">Unisex</option>
                <option value="womens">Women's Only</option>
              </select>
            </div>

            {/* Age Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Age Category</label>
              <select
                value={ageCategoryFilter}
                onChange={(e) => setAgeCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Ages</option>
                <option value="adult">Adult</option>
                <option value="master">Master</option>
                <option value="kids1">Kids 1</option>
                <option value="kids2">Kids 2</option>
              </select>
            </div>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="mb-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
            <button
              onClick={goToPreviousWeek}
              className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous Week
            </button>

            <div className="text-center">
              <h2 className="text-2xl font-semibold text-white">
                {weekStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <p className="text-gray-400">
                {weekStart.toLocaleDateString('en-US', { day: 'numeric' })} - {weekDates[6].toLocaleDateString('en-US', { day: 'numeric' })}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                onClick={goToCurrentWeek}
                className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-lg transition-all duration-300"
              >
                Today
              </button>
              <button
                onClick={goToNextWeek}
                className="flex items-center justify-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300"
              >
                Next Week
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-3 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-7 gap-2 sm:gap-4">
            {/* Day Headers */}
            {dayNames.map((dayName, index) => (
              <div key={dayName} className="text-center">
                <div className="text-sm font-medium text-gray-400 mb-2">{dayName}</div>
                <div className="text-lg font-semibold text-white">
                  {weekDates[index].getDate()}
                </div>
              </div>
            ))}

            {/* Day Columns */}
            {dayKeys.map((dayKey, dayIndex) => (
              <div key={dayKey} className="min-h-[200px] sm:min-h-[400px] border border-white/10 rounded-lg p-2 sm:p-3">
                <div className="space-y-2">
                  {weekClasses[dayKey]?.map((classItem) => (
                    <Link
                      key={classItem.classId}
                      to={`/classes/registration/view/${classItem.classId}`}
                      className={`block p-3 rounded-lg border transition-all duration-300 hover:scale-105 hover:shadow-lg ${getClassTypeColor(classItem.classType)}`}
                    >
                      <div className="text-xs font-medium mb-1">
                        {classItem.startTime} - {classItem.endTime}
                      </div>
                      <div className="text-sm font-semibold mb-1">
                        {classItem.className}
                      </div>
                      <div className="text-xs opacity-80 mb-2">
                        {getTeacherName(classItem.teacherId)}
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-1">
                          <span>{getGenderIcon(classItem.genderCategory)}</span>
                          <span className={getAgeCategoryColor(classItem.ageCategory)}>
                            {classItem.ageCategory}
                          </span>
                        </div>
                        <div className="text-xs opacity-60">
                          {classItem.currentEnrollment}/{classItem.maxCapacity}
                        </div>
                      </div>
                    </Link>
                  ))}
                  
                  {(!weekClasses[dayKey] || weekClasses[dayKey].length === 0) && (
                    <div className="text-center text-gray-500 text-sm py-8">
                      No classes scheduled
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Class Type Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500/20 border border-blue-500/30 rounded"></div>
              <span className="text-sm text-gray-300">Regular</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-purple-500/20 border border-purple-500/30 rounded"></div>
              <span className="text-sm text-gray-300">Private</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-500/20 border border-orange-500/30 rounded"></div>
              <span className="text-sm text-gray-300">Seminar</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500/20 border border-yellow-500/30 rounded"></div>
              <span className="text-sm text-gray-300">Workshop</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500/20 border border-red-500/30 rounded"></div>
              <span className="text-sm text-gray-300">Competition</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClassCalendar
