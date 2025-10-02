import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface SidebarProps {
  collapsed: boolean
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const location = useLocation()
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])

  const menuItems = [
    {
      id: 'students',
      title: 'Students / Alunos',
      icon: '🥋',
      subItems: [
        { id: 'student-registration', title: 'Student Registration', path: '/students/registration', icon: '📝' },
        { id: 'student-profiles', title: 'Student Profiles', path: '/students/profiles', icon: '👤' },
        { id: 'fight-plans', title: 'Fight Plans by Student', path: '/students/fight-plans', icon: '🥊' },
        { id: 'student-evaluation', title: 'Student Evaluation & Grades', path: '/students/evaluation', icon: '📊' },
        { id: 'student-attendance', title: 'Student Attendance', path: '/students/attendance', icon: '✅' },
      ]
    },
    {
      id: 'teachers',
      title: 'Teachers / Professores',
      icon: '🧑‍🏫',
      subItems: [
        { id: 'teacher-registration', title: 'Teacher Registration', path: '/teachers/registration', icon: '📝' },
        { id: 'teacher-profiles', title: 'Teacher Profiles', path: '/teachers/profiles', icon: '👤' },
        { id: 'assign-teachers', title: 'Assign Teachers to Classes', path: '/teachers/assign', icon: '🔗' },
        { id: 'teacher-evaluations', title: 'Teacher Evaluations', path: '/teachers/evaluations', icon: '📊' },
      ]
    },
    {
      id: 'championships',
      title: 'Championships / Campeonatos',
      icon: '🏟️',
      subItems: [
        { id: 'championship-registration', title: 'Championship Registration', path: '/championships/registration', icon: '📝' },
        { id: 'student-enrollment', title: 'Student Enrollment in Championships', path: '/championships/enrollment', icon: '📋' },
        { id: 'championship-results', title: 'Championship Results', path: '/championships/results', icon: '🏆' },
        { id: 'ranking-statistics', title: 'Ranking & Statistics', path: '/championships/ranking', icon: '📈' },
      ]
    },
    {
      id: 'classes',
      title: 'Classes / Turmas',
      icon: '📘',
      subItems: [
        { id: 'class-setup', title: 'Class Setup by Modality', path: '/classes/setup', icon: '⚙️' },
        { id: 'schedule-management', title: 'Schedule Management', path: '/classes/schedule', icon: '📅' },
        { id: 'check-in-attendance', title: 'Check-In / Attendance Tracking', path: '/classes/attendance', icon: '✅' },
        { id: 'class-capacity', title: 'Class Capacity & Limits', path: '/classes/capacity', icon: '👥' },
      ]
    },
    {
      id: 'fight-plans',
      title: 'Fight Plans / Planos de Luta',
      icon: '🗂️',
      subItems: [
        { id: 'plan-templates', title: 'Plan Templates', path: '/fight-plans/templates', icon: '📋' },
        { id: 'assign-plans', title: 'Assign Plans to Students', path: '/fight-plans/assign', icon: '🔗' },
        { id: 'training-phases', title: 'Training Phases & Milestones', path: '/fight-plans/phases', icon: '🎯' },
      ]
    },
    {
      id: 'quality-evaluation',
      title: 'Quality & Evaluation / Qualidade & Avaliação',
      icon: '🧪',
      subItems: [
        { id: 'progress-reports', title: 'Student Progress Reports', path: '/quality/progress', icon: '📊' },
        { id: 'teacher-feedback', title: 'Teacher Feedback', path: '/quality/feedback', icon: '💬' },
        { id: 'fitness-tests', title: 'Fitness Tests & Metrics', path: '/quality/fitness', icon: '💪' },
      ]
    },
    {
      id: 'branches',
      title: 'Branches / Filiais',
      icon: '🌍',
      subItems: [
        { id: 'branch-registration', title: 'Branch Registration', path: '/branches/registration', icon: '📝' },
        { id: 'branch-details', title: 'Branch Details (location, contact)', path: '/branches/details', icon: '📍' },
        { id: 'assign-branch', title: 'Assign Students/Teachers per Branch', path: '/branches/assign', icon: '🔗' },
      ]
    },
    {
      id: 'schedules-checkins',
      title: 'Schedules & Check-Ins / Agenda & Check-Ins',
      icon: '📅',
      subItems: [
        { id: 'weekly-timetable', title: 'Weekly Timetable', path: '/schedules/timetable', icon: '📅' },
        { id: 'booking-system', title: 'Student Booking System', path: '/schedules/booking', icon: '📋' },
        { id: 'attendance-log', title: 'Real-Time Attendance Log', path: '/schedules/attendance', icon: '📊' },
      ]
    },
    {
      id: 'administration',
      title: 'Administration',
      icon: '⚙️',
      subItems: [
        { id: 'user-profiles', title: 'User Profiles & Roles', path: '/admin/profiles', icon: '👤' },
        { id: 'language-selector', title: 'Language Selector (🇧🇷 Portuguese / 🇺🇸 English)', path: '/admin/language', icon: '🌐' },
        { id: 'app-settings', title: 'App Settings', path: '/admin/settings', icon: '⚙️' },
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
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-center">
          <div className={`${collapsed ? 'text-lg p-1' : 'text-2xl p-2'} bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg`}>🥋</div>
          {!collapsed && (
            <div className="ml-3">
              <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Academy Manager
              </span>
              <p className="text-xs text-gray-400">Management System</p>
            </div>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <nav className="mt-6">
        {menuItems.map((menu) => (
          <div key={menu.id}>
            {/* Main Menu Item */}
            <button
              onClick={() => toggleMenu(menu.id)}
              className={`w-full flex items-center px-4 py-3 text-left hover:bg-white/10 transition-all duration-300 rounded-xl mx-2 group ${
                collapsed ? 'justify-center' : 'justify-between'
              } ${isMenuExpanded(menu.id) ? 'bg-white/10' : ''}`}
            >
              <div className="flex items-center">
                <span className="text-xl group-hover:scale-110 transition-transform">{menu.icon}</span>
                {!collapsed && (
                  <span className="ml-3 text-white font-medium group-hover:text-blue-400 transition-colors">{menu.title}</span>
                )}
              </div>
              {!collapsed && (
                <span className={`transform transition-all duration-300 group-hover:text-blue-400 ${
                  isMenuExpanded(menu.id) ? 'rotate-180' : ''
                }`}>
                  ▼
                </span>
              )}
            </button>

            {/* Sub Menu Items */}
            {!collapsed && isMenuExpanded(menu.id) && (
              <div className="bg-white/5 mx-2 rounded-xl mt-1 overflow-hidden">
                {menu.subItems.map((subItem) => (
                  <Link
                    key={subItem.id}
                    to={subItem.path}
                    className={`flex items-center px-6 py-3 text-sm hover:bg-white/10 transition-all duration-300 group ${
                      location.pathname === subItem.path 
                        ? 'bg-blue-500/20 text-blue-400 border-l-2 border-blue-400' 
                        : 'text-gray-300 hover:text-blue-400'
                    }`}
                  >
                    <span className="text-lg mr-3 group-hover:scale-110 transition-transform">{subItem.icon}</span>
                    {subItem.title}
                  </Link>
                ))}
              </div>
            )}

            {/* Collapsed Sub Items */}
            {collapsed && (
              <div className="ml-2">
                {menu.subItems.map((subItem) => (
                  <Link
                    key={subItem.id}
                    to={subItem.path}
                    className={`block p-2 text-center hover:bg-gray-700 transition-colors rounded ${
                      location.pathname === subItem.path 
                        ? 'bg-gray-700' 
                        : ''
                    }`}
                    title={subItem.title}
                  >
                    <span className="text-lg">{subItem.icon}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Dashboard Link */}
      <div className="absolute bottom-4 left-0 right-0 px-4">
        <Link
          to="/"
          className={`flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors ${
            location.pathname === '/' ? 'bg-gray-700' : ''
          } ${collapsed ? 'justify-center' : ''}`}
        >
          <span className="text-xl">📊</span>
          {!collapsed && (
            <span className="ml-3 text-white font-medium">Dashboard</span>
          )}
        </Link>
      </div>
    </div>
  )
}

export default Sidebar
