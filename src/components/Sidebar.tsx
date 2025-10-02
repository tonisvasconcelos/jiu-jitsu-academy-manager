import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const location = useLocation()
  const [isMobile, setIsMobile] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const menuItems = [
    { id: 'students', title: t('students'), icon: '🥋', path: '/students' },
    { id: 'teachers', title: t('teachers'), icon: '🧑‍🏫', path: '/teachers' },
    { id: 'championships', title: t('championships'), icon: '🏟️', path: '/championships' },
    { id: 'classes', title: t('classes'), icon: '📘', path: '/classes' },
    { id: 'fight-plans', title: t('fight-plans'), icon: '🗂️', path: '/fight-plans' },
    { id: 'quality-evaluation', title: t('quality-evaluation'), icon: '🧪', path: '/quality' },
    { id: 'branches', title: t('branches'), icon: '🌍', path: '/branches' },
    { id: 'schedules-checkins', title: t('schedules-checkins'), icon: '📅', path: '/schedules' },
    { id: 'administration', title: t('administration'), icon: '⚙️', path: '/admin' }
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && !collapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-white/5 backdrop-blur-md border-r border-white/10 transition-all duration-300 z-50 ${
        isMobile 
          ? (collapsed ? '-translate-x-full w-64' : 'translate-x-0 w-64')
          : (collapsed ? 'w-16' : 'w-64')
      }`}>
        {/* Logo */}
        <div className="p-3 border-b border-white/10">
          <div className="flex items-center justify-center">
            <div className={`${collapsed ? 'text-sm p-1' : 'text-lg p-1.5'} bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg`}>🥋</div>
            {(!collapsed || isMobile) && (
              <div className="ml-2">
                <span className="text-sm font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  {t('academy-manager')}
                </span>
                <p className="text-xs text-gray-400">{t('management-system')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Dashboard Link - First Item */}
        <div className="mt-3 px-3 mb-2">
          <Link
            to="/"
            className={`flex items-center rounded-lg hover:bg-white/10 transition-colors ${
              location.pathname === '/' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-300'
            } ${(collapsed && !isMobile) ? 'justify-center px-0 py-4 h-14' : 'px-3 py-3'}`}
          >
            <span className="text-lg">📊</span>
            {(!collapsed || isMobile) && (
              <span className="ml-2 text-sm text-white font-medium">{t('dashboard')}</span>
            )}
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="mt-3 overflow-y-auto flex-1">
          {menuItems.map((menu) => (
            <div key={menu.id} className="mb-2">
              <Link
                to={menu.path}
                className={`w-full flex items-center text-left hover:bg-white/10 transition-all duration-300 rounded-lg group ${
                  (collapsed && !isMobile) ? 'justify-center px-0 py-4 h-14' : 'px-3 mx-2 py-3'
                } ${location.pathname.startsWith(menu.path) ? 'bg-white/10' : ''}`}
              >
                <div className="flex items-center">
                  <span className="text-lg group-hover:scale-110 transition-transform">{menu.icon}</span>
                  {(!collapsed || isMobile) && (
                    <span className="ml-2 text-sm text-white font-medium group-hover:text-blue-400 transition-colors">{menu.title}</span>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </nav>
      </div>
    </>
  )
}

export default Sidebar