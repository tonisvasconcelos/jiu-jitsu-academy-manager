import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

const Students: React.FC = () => {
  const { t } = useLanguage()

  const subMenuItems = [
    // Student-related items
    { id: 'student-registration', title: t('student-registration'), path: '/students/registration', icon: '📝', description: t('register-new-students') },
    { id: 'modality', title: t('modality-by-student'), path: '/students/modality', icon: '🥊', description: t('student-modality-management') },
    { id: 'student-attendance', title: t('student-attendance'), path: '/students/attendance', icon: '✅', description: t('track-student-attendance') },
    // Coach/Teacher-related items
    { id: 'teacher-registration', title: t('teacher-registration'), path: '/teachers/registration', icon: '📝', description: t('register-new-teachers') },
    { id: 'teacher-profiles', title: t('teacher-profiles'), path: '/teachers/profiles', icon: '👤', description: t('view-manage-teacher-profiles') },
    { id: 'assign-teachers', title: t('assign-teachers'), path: '/teachers/assign', icon: '🔗', description: t('assign-teachers-to-classes-desc') },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-3">
            {t('coach-students')}
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            {t('manage-coach-students-data')}
          </p>
        </div>

        {/* Sub-menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
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
      </div>
    </div>
  )
}

export default Students