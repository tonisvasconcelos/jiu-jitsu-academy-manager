import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

const Branches: React.FC = () => {
  const { t } = useLanguage()

  const branchMenuItems = [
    { 
      id: 'branch-registration', 
      title: t('branch-registration'), 
      description: 'Register new branches and manage branch information.', 
      icon: '🏢', 
      path: '/branches/registration' 
    },
    { 
      id: 'branch-details', 
      title: t('branch-details'), 
      description: 'View and manage detailed branch information including location and contact details.', 
      icon: '📍', 
      path: '/branches/details' 
    },
    { 
      id: 'assign-branch', 
      title: t('assign-branch'), 
      description: 'Assign students and teachers to specific branches.', 
      icon: '🔗', 
      path: '/branches/assign' 
    },
    { 
      id: 'branch-schedules', 
      title: t('branch-schedules'), 
      description: 'Manage working hours and schedules for each branch.', 
      icon: '⏰', 
      path: '/branches/schedules' 
    },
    { 
      id: 'branch-facilities', 
      title: t('branch-facilities'), 
      description: 'Track facilities and equipment available at each branch.', 
      icon: '🏋️', 
      path: '/branches/facilities' 
    },
    { 
      id: 'branch-reports', 
      title: t('branch-reports'), 
      description: 'Generate reports and analytics for branch performance.', 
      icon: '📊', 
      path: '/branches/reports' 
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-400 via-teal-500 to-blue-500 bg-clip-text text-transparent mb-8">
          {t('branches')}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branchMenuItems.map(item => (
            <Link
              key={item.id}
              to={item.path}
              className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-4 group-hover:scale-110 transition-transform">{item.icon}</span>
                  <h2 className="text-xl font-semibold text-white group-hover:text-green-400 transition-colors">{item.title}</h2>
                </div>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
              <div className="mt-4 text-right text-green-400 group-hover:text-green-300 transition-colors">
                <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Branches
