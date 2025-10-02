import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

interface SidebarProps {
  collapsed: boolean
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const location = useLocation()
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])
  const { t } = useLanguage()

  const menuItems = [
    {
      id: 'students',
      title: t('students'),
      icon: '🥋',
      subItems: [
        { id: 'student-registration', title: t('student-registration'), path: '/students/registration', icon: '📝' },
        { id: 'student-profiles', title: t('student-profiles'), path: '/students/profiles', icon: '👤' },
        { id: 'fight-plans', title: t('fight-plans-by-student'), path: '/students/fight-plans', icon: '🥊' },
        { id: 'student-evaluation', title: t('student-evaluation'), path: '/students/evaluation', icon: '📊' },
        { id: 'student-attendance', title: t('student-attendance'), path: '/students/attendance', icon: '✅' },
      ]
    },
    {
      id: 'teachers',
      title: t('teachers'),
      icon: '🧑‍🏫',
      subItems: [
        { id: 'teacher-registration', title: t('teacher-registration'), path: '/teachers/registration', icon: '📝' },
        { id: 'teacher-profiles', title: t('teacher-profiles'), path: '/teachers/profiles', icon: '👤' },
        { id: 'assign-teachers', title: t('assign-teachers'), path: '/teachers/assign', icon: '🔗' },
        { id: 'teacher-evaluations', title: t('teacher-evaluations'), path: '/teachers/evaluations', icon: '📊' },
      ]
    },
    {
      id: 'championships',
      title: t('championships'),
      icon: '🏟️',
      subItems: [
        { id: 'championship-registration', title: t('championship-registration'), path: '/championships/registration', icon: '📝' },
        { id: 'student-enrollment', title: t('student-enrollment'), path: '/championships/enrollment', icon: '📋' },
        { id: 'championship-results', title: t('championship-results'), path: '/championships/results', icon: '🏆' },
        { id: 'ranking-statistics', title: t('ranking-statistics'), path: '/championships/ranking', icon: '📈' },
      ]
    },
    {
      id: 'classes',
      title: t('classes'),
      icon: '📘',
      subItems: [
        { id: 'class-setup', title: t('class-setup'), path: '/classes/setup', icon: '⚙️' },
        { id: 'schedule-management', title: t('schedule-management'), path: '/classes/schedule', icon: '📅' },
        { id: 'check-in-attendance', title: t('check-in-attendance'), path: '/classes/attendance', icon: '✅' },
        { id: 'class-capacity', title: t('class-capacity'), path: '/classes/capacity', icon: '👥' },
      ]
    },
    {
      id: 'fight-plans',
      title: t('fight-plans'),
      icon: '🗂️',
      subItems: [
        { id: 'plan-templates', title: t('plan-templates'), path: '/fight-plans/templates', icon: '📋' },
        { id: 'assign-plans', title: t('assign-plans'), path: '/fight-plans/assign', icon: '🔗' },
        { id: 'training-phases', title: t('training-phases'), path: '/fight-plans/phases', icon: '🎯' },
      ]
    },
    {
      id: 'quality-evaluation',
      title: t('quality-evaluation'),
      icon: '🧪',
      subItems: [
        { id: 'progress-reports', title: t('progress-reports'), path: '/quality/progress', icon: '📊' },
        { id: 'teacher-feedback', title: t('teacher-feedback'), path: '/quality/feedback', icon: '💬' },
        { id: 'fitness-tests', title: t('fitness-tests'), path: '/quality/fitness', icon: '💪' },
      ]
    },
    {
      id: 'branches',
      title: t('branches'),
      icon: '🌍',
      subItems: [
        { id: 'branch-registration', title: t('branch-registration'), path: '/branches/registration', icon: '📝' },
        { id: 'branch-details', title: t('branch-details'), path: '/branches/details', icon: '📍' },
        { id: 'assign-branch', title: t('assign-branch'), path: '/branches/assign', icon: '🔗' },
      ]
    },
    {
      id: 'schedules-checkins',
      title: t('schedules-checkins'),
      icon: '📅',
      subItems: [
        { id: 'weekly-timetable', title: t('weekly-timetable'), path: '/schedules/timetable', icon: '📅' },
        { id: 'booking-system', title: t('booking-system'), path: '/schedules/booking', icon: '📋' },
        { id: 'attendance-log', title: t('attendance-log'), path: '/schedules/attendance', icon: '📊' },
      ]
    },
    {
      id: 'administration',
      title: t('administration'),
      icon: '⚙️',
      subItems: [
        { id: 'user-profiles', title: t('user-profiles'), path: '/admin/profiles', icon: '👤' },
        { id: 'language-selector', title: t('language-selector'), path: '/admin/language', icon: '🌐' },
        { id: 'app-settings', title: t('app-settings'), path: '/admin/settings', icon: '⚙️' },
      ]
    }
  ]

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    )
  }

  const isMenuExpanded = (menuId: string) => expandedMenus.includes(menuId)

  return (
    <div className={`fixed left-0 top-0 h-full bg-white/5 backdrop-blur-md border-r border-white/10 transition-all duration-300 z-50 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Logo */}
      <div className="p-3 border-b border-white/10">
        <div className="flex items-center justify-center">
          <div className={`${collapsed ? 'text-sm p-1' : 'text-lg p-1.5'} bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg`}>🥋</div>
          {!collapsed && (
            <div className="ml-2">
              <span className="text-sm font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                {t('academy-manager')}
              </span>
              <p className="text-xs text-gray-400">{t('management-system')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <nav className="mt-3 overflow-y-auto flex-1 pb-4">
        {menuItems.map((menu) => (
          <div key={menu.id}>
            {/* Main Menu Item */}
            <button
              onClick={() => toggleMenu(menu.id)}
              className={`w-full flex items-center px-3 py-2 text-left hover:bg-white/10 transition-all duration-300 rounded-lg mx-2 group ${
                collapsed ? 'justify-center px-0' : 'justify-between'
              } ${isMenuExpanded(menu.id) ? 'bg-white/10' : ''}`}
            >
              <div className="flex items-center">
                <span className="text-lg group-hover:scale-110 transition-transform">{menu.icon}</span>
                {!collapsed && (
                  <span className="ml-2 text-sm text-white font-medium group-hover:text-blue-400 transition-colors">{menu.title}</span>
                )}
              </div>
              {!collapsed && (
                <span className={`transform transition-all duration-300 group-hover:text-blue-400 text-xs ${
                  isMenuExpanded(menu.id) ? 'rotate-180' : ''
                }`}>
                  ▼
                </span>
              )}
            </button>

            {/* Sub Menu Items */}
            {!collapsed && isMenuExpanded(menu.id) && (
              <div className="bg-white/5 mx-2 rounded-lg mt-1 overflow-hidden">
                {menu.subItems.map((subItem) => (
                  <Link
                    key={subItem.id}
                    to={subItem.path}
                    className={`flex items-center px-4 py-2 text-xs hover:bg-white/10 transition-all duration-300 group ${
                      location.pathname === subItem.path 
                        ? 'bg-blue-500/20 text-blue-400 border-l-2 border-blue-400' 
                        : 'text-gray-300 hover:text-blue-400'
                    }`}
                  >
                    <span className="text-sm mr-2 group-hover:scale-110 transition-transform">{subItem.icon}</span>
                    {subItem.title}
                  </Link>
                ))}
              </div>
            )}

            {/* Collapsed Sub Items */}
            {collapsed && (
              <div className="flex justify-center">
                {menu.subItems.map((subItem) => (
                  <Link
                    key={subItem.id}
                    to={subItem.path}
                    className={`block p-1.5 text-center hover:bg-white/10 transition-colors rounded-lg ${
                      location.pathname === subItem.path 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : 'text-gray-400'
                    }`}
                    title={subItem.title}
                  >
                    <span className="text-sm">{subItem.icon}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Dashboard Link */}
      <div className="absolute bottom-2 left-0 right-0 px-3">
        <Link
          to="/"
          className={`flex items-center p-2 rounded-lg hover:bg-white/10 transition-colors ${
            location.pathname === '/' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-300'
          } ${collapsed ? 'justify-center px-0' : ''}`}
        >
          <span className="text-lg">📊</span>
          {!collapsed && (
            <span className="ml-2 text-sm text-white font-medium">{t('dashboard')}</span>
          )}
        </Link>
      </div>
    </div>
  )
}

export default Sidebar
