import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

const ClassSchedules: React.FC = () => {
  const { t } = useLanguage()

  const subMenuItems = [
    { id: 'class-registration', title: 'Class Registration', path: '/classes/registration', icon: '📅', description: 'Register and manage class schedules' },
    { id: 'class-calendar', title: 'Class Calendar', path: '/classes/calendar', icon: '🗓️', description: 'View class schedules in calendar format' },
    { id: 'class-checkin', title: 'Class Check-In', path: '/classes/check-in', icon: '📝', description: 'Record class check-ins and track attendance' },
    { id: 'class-attendance', title: 'Class Attendance', path: '/classes/attendance', icon: '✅', description: 'Track student attendance in classes' },
    { id: 'class-evaluation', title: 'Class Evaluation', path: '/classes/evaluation', icon: '📊', description: 'Evaluate class performance and feedback' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-3">
            Class Schedules
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Manage class schedules, attendance, and evaluations
          </p>
        </div>

        {/* Sub-menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subMenuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg mr-4">
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h3>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                {item.description}
              </p>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Classes</p>
                <p className="text-2xl font-bold text-white">24</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <span className="text-2xl">📅</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Classes</p>
                <p className="text-2xl font-bold text-green-400">18</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-xl">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">This Week</p>
                <p className="text-2xl font-bold text-purple-400">12</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg. Attendance</p>
                <p className="text-2xl font-bold text-yellow-400">85%</p>
              </div>
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClassSchedules
