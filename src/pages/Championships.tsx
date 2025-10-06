import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

const Championships: React.FC = () => {
  const { t } = useLanguage()

  const subMenuItems = [
    { id: 'championship-registration', title: t('championship-registration'), path: '/championships/registration', icon: '📝', description: 'Register new championships' },
    { id: 'student-enrollment', title: t('student-enrollment'), path: '/championships/athlete-enrollment', icon: '📋', description: 'Enroll students in championships' },
    { id: 'championship-results', title: t('championship-results'), path: '/championships/results', icon: '🏆', description: 'Record and view championship results' },
    { id: 'ranking-statistics', title: t('ranking-statistics'), path: '/championships/ranking', icon: '📈', description: 'View rankings and statistics' },
    { id: 'fight-associations', title: t('fight-associations'), path: '/championships/fight-associations', icon: '🏛️', description: 'Manage fight associations and federations' },
    { id: 'affiliations', title: t('affiliations'), path: '/championships/affiliations', icon: '🤝', description: 'Manage student-fight association affiliations' },
    { id: 'championship-categories', title: t('championship-categories'), path: '/championships/categories', icon: '📋', description: 'Manage championship categories and divisions' },
    { id: 'registrations', title: t('registrations'), path: '/championships/registrations', icon: '📝', description: 'Manage student championship registrations' },
    { id: 'referees-officials', title: t('referees-officials'), path: '/championships/officials', icon: '👨‍⚖️', description: 'Manage referees and officials' },
    { id: 'championship-sponsors', title: t('championship-sponsors'), path: '/championships/sponsors', icon: '💰', description: 'Manage championship sponsors' },
    { id: 'championship-qualified-locations', title: t('championship-qualified-locations'), path: '/championships/qualified-locations', icon: '🏢', description: 'Manage championship qualified locations' },
    { id: 'fight-teams', title: t('fight-teams'), path: '/championships/fight-teams', icon: '🥊', description: 'Manage fight teams' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-3">
            {t('championships')}
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Manage championships, enrollments, and track results
          </p>
        </div>

        {/* Sub-menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {subMenuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl shadow-lg mr-4">
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-yellow-400 transition-colors">
                    {item.title}
                  </h3>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                {item.description}
              </p>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

export default Championships
