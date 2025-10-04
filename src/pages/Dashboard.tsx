import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useStudents } from '../contexts/StudentContext'
import { useTeachers } from '../contexts/TeacherContext'
import { useBranches } from '../contexts/BranchContext'
import { useBranchFacilities } from '../contexts/BranchFacilityContext'
import { useFightModalities } from '../contexts/FightModalityContext'
import { useClassSchedules } from '../contexts/ClassScheduleContext'
import { useClassCheckIns } from '../contexts/ClassCheckInContext'
import { useStudentModalities } from '../contexts/StudentModalityContext'

const Dashboard: React.FC = () => {
  const { t } = useLanguage()
  const { students } = useStudents()
  const { teachers } = useTeachers()
  const { branches } = useBranches()
  const { facilities } = useBranchFacilities()
  const { modalities } = useFightModalities()
  const { classes } = useClassSchedules()
  const { checkIns, getCheckInsThisWeek, getCheckInsThisMonth } = useClassCheckIns()
  const { connections } = useStudentModalities()
  
  // Calculate real statistics
  const totalStudents = students.length
  const activeStudents = students.filter(s => s.active).length
  const totalTeachers = teachers.length
  const totalBranches = branches.length
  const totalFacilities = facilities.length
  const totalModalities = modalities.length
  const totalClasses = classes.length
  const activeClasses = classes.filter(c => c.status === 'active').length
  const totalCheckIns = checkIns.length
  const thisWeekCheckIns = getCheckInsThisWeek()
  const thisMonthCheckIns = getCheckInsThisMonth()
  const totalConnections = connections.length
  const activeConnections = connections.filter(c => c.active).length
  
  // Calculate classes for today
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
  const classesToday = classes.filter(c => 
    c.status === 'active' && c.daysOfWeek.includes(today as any)
  ).length
  
  // Calculate recent activity (last 7 days)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const recentCheckIns = checkIns.filter(c => 
    new Date(c.createdAt) >= sevenDaysAgo
  ).length
  
  console.log('Dashboard: Real statistics calculated:', {
    totalStudents, totalTeachers, totalBranches, totalFacilities,
    totalModalities, totalClasses, totalCheckIns, classesToday
  })
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2 sm:mb-3">
            {t('dashboard')}
          </h1>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl">
            {t('welcome-message')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Total Students */}
          <Link
            to="/students"
            className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Total Students</p>
                <p className="text-3xl font-bold text-white">{totalStudents}</p>
                <p className="text-xs text-blue-400 mt-1">{activeStudents} active</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <span className="text-2xl">🎓</span>
              </div>
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>

          {/* Total Teachers */}
          <Link
            to="/teachers"
            className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Instructors</p>
                <p className="text-3xl font-bold text-white">{totalTeachers}</p>
                <p className="text-xs text-green-400 mt-1">Active teachers</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                <span className="text-2xl">👨‍🏫</span>
              </div>
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/0 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>

          {/* Fight Modalities */}
          <Link
            to="/fight-modalities"
            className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Fight Modalities</p>
                <p className="text-3xl font-bold text-white">{totalModalities}</p>
                <p className="text-xs text-purple-400 mt-1">Available styles</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                <span className="text-2xl">🥋</span>
              </div>
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>

          {/* Classes Today */}
          <Link
            to="/classes/registration"
            className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Classes Today</p>
                <p className="text-3xl font-bold text-white">{classesToday}</p>
                <p className="text-xs text-orange-400 mt-1">{activeClasses} total active</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
                <span className="text-2xl">📅</span>
              </div>
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/0 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
        </div>

        {/* Additional Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Total Check-ins */}
          <Link
            to="/classes/check-in/archived"
            className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Total Check-ins</p>
                <p className="text-3xl font-bold text-white">{totalCheckIns}</p>
                <p className="text-xs text-cyan-400 mt-1">{thisWeekCheckIns} this week</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl shadow-lg">
                <span className="text-2xl">📝</span>
              </div>
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/0 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>

          {/* Branches */}
          <Link
            to="/branches"
            className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/20 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Branches</p>
                <p className="text-3xl font-bold text-white">{totalBranches}</p>
                <p className="text-xs text-indigo-400 mt-1">{totalFacilities} facilities</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg">
                <span className="text-2xl">🏢</span>
              </div>
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/0 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>

          {/* Training Plans */}
          <Link
            to="/students/modality"
            className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/20 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Training Plans</p>
                <p className="text-3xl font-bold text-white">{totalConnections}</p>
                <p className="text-xs text-pink-400 mt-1">{activeConnections} active</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl shadow-lg">
                <span className="text-2xl">📋</span>
              </div>
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500/0 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>

          {/* Recent Activity */}
          <Link
            to="/classes/check-in/archived"
            className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Recent Activity</p>
                <p className="text-3xl font-bold text-white">{recentCheckIns}</p>
                <p className="text-xs text-emerald-400 mt-1">Last 7 days</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
                <span className="text-2xl">⚡</span>
              </div>
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/0 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Recent Activity Card */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <span className="text-blue-400">📊</span>
              </div>
            </div>
            <div className="space-y-4">
              {recentCheckIns > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center p-4 bg-white/5 rounded-xl border border-white/5">
                    <div className="p-2 bg-green-500/20 rounded-lg mr-4">
                      <span className="text-green-400">📝</span>
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{recentCheckIns} check-ins this week</p>
                      <p className="text-gray-400 text-xs">Students actively training</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-white/5 rounded-xl border border-white/5">
                    <div className="p-2 bg-blue-500/20 rounded-lg mr-4">
                      <span className="text-blue-400">📅</span>
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{classesToday} classes scheduled today</p>
                      <p className="text-gray-400 text-xs">Active class schedule</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-white/5 rounded-xl border border-white/5">
                    <div className="p-2 bg-purple-500/20 rounded-lg mr-4">
                      <span className="text-purple-400">📋</span>
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{activeConnections} active training plans</p>
                      <p className="text-gray-400 text-xs">Students with ongoing programs</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="p-2 bg-gray-500/20 rounded-lg mr-4">
                    <span className="text-gray-400">📝</span>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">No recent activity</p>
                    <p className="text-gray-500 text-xs">Start by adding students or instructors</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Quick Actions</h3>
              <div className="p-2 bg-green-500/20 rounded-lg">
                <span className="text-green-400">⚡</span>
              </div>
            </div>
            <div className="space-y-4">
              <Link
                to="/students/registration/new"
                className="w-full group relative bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center"
              >
                <span className="mr-2">👤</span>
                <span className="font-medium">Add New Student</span>
              </Link>
              <Link
                to="/teachers/registration"
                className="w-full group relative bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 flex items-center justify-center"
              >
                <span className="mr-2">👨‍🏫</span>
                <span className="font-medium">Add New Instructor</span>
              </Link>
              <Link
                to="/classes/registration/new"
                className="w-full group relative bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 flex items-center justify-center"
              >
                <span className="mr-2">📅</span>
                <span className="font-medium">Create Class Schedule</span>
              </Link>
              <Link
                to="/classes/check-in/new"
                className="w-full group relative bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25 flex items-center justify-center"
              >
                <span className="mr-2">📝</span>
                <span className="font-medium">Check-In Student</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
