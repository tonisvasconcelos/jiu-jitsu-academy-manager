import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

const FightPlans: React.FC = () => {
  const { t } = useLanguage()

  const fightPlanMenuItems = [
    { id: 'modalities', title: t('fight-modalities'), description: t('modality-management'), icon: '🥋', path: '/fight-plans/modalities' },
    { id: 'weight-divisions', title: 'Weight Divisions', description: 'Manage weight divisions for competitions', icon: '⚖️', path: '/fight-plans/weight-divisions' },
    { id: 'modality-by-student', title: t('modality-by-student'), description: t('student-modality-management'), icon: '🥊', path: '/students/modality' },
    { id: 'training-phases', title: t('training-phases'), description: 'Manage training phases and milestones.', icon: '📈', path: '/fight-plans/training-phases' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent mb-8">
          {t('fight-plans')}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fightPlanMenuItems.map(item => (
            <Link
              key={item.id}
              to={item.path}
              className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-4 group-hover:scale-110 transition-transform">{item.icon}</span>
                  <h2 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors">{item.title}</h2>
                </div>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
              <div className="mt-4 text-right text-purple-400 group-hover:text-purple-300 transition-colors">
                <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FightPlans
