import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'

const Dashboard: React.FC = () => {
  const { t } = useLanguage()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-3">
            {t('dashboard')}
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            {t('welcome-message')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">{t('total-students')}</p>
                <p className="text-3xl font-bold text-white">0</p>
                <p className="text-xs text-green-400 mt-1">+0% from last month</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <span className="text-2xl">🎓</span>
              </div>
            </div>
          </div>

          <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">{t('instructors')}</p>
                <p className="text-3xl font-bold text-white">0</p>
                <p className="text-xs text-green-400 mt-1">+0% from last month</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                <span className="text-2xl">👨‍🏫</span>
              </div>
            </div>
          </div>

          <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Martial Arts</p>
                <p className="text-3xl font-bold text-white">0</p>
                <p className="text-xs text-green-400 mt-1">+0% from last month</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                <span className="text-2xl">🥋</span>
              </div>
            </div>
          </div>

          <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Classes Today</p>
                <p className="text-3xl font-bold text-white">0</p>
                <p className="text-xs text-green-400 mt-1">+0% from last month</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
                <span className="text-2xl">📅</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity Card */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">{t('recent-activity')}</h3>
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <span className="text-blue-400">📊</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="p-2 bg-gray-500/20 rounded-lg mr-4">
                  <span className="text-gray-400">📝</span>
                </div>
                <div>
                  <p className="text-gray-300 text-sm">{t('no-recent-activity')}</p>
                  <p className="text-gray-500 text-xs">{t('start-adding')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">{t('quick-actions')}</h3>
              <div className="p-2 bg-green-500/20 rounded-lg">
                <span className="text-green-400">⚡</span>
              </div>
            </div>
            <div className="space-y-4">
              <button className="w-full group relative bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center">
                <span className="mr-2">👤</span>
                <span className="font-medium">{t('add-new-student')}</span>
              </button>
              <button className="w-full group relative bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 flex items-center justify-center">
                <span className="mr-2">👨‍🏫</span>
                <span className="font-medium">{t('add-new-instructor')}</span>
              </button>
              <button className="w-full group relative bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 flex items-center justify-center">
                <span className="mr-2">🥋</span>
                <span className="font-medium">{t('add-martial-art-type')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
