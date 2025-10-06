import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const location = useLocation()
  const [isMobile, setIsMobile] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])
  const [menuPositions, setMenuPositions] = useState<Record<string, number>>({})
  const { t } = useLanguage()
  const sidebarRef = useRef<HTMLDivElement>(null)
  const menuRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close sub-menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setExpandedMenus([])
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => {
      // If the menu is already expanded, close it
      if (prev.includes(menuId)) {
        return prev.filter(id => id !== menuId)
      }
      
      // If the menu is not expanded, close all others and open this one
      const newExpanded = [menuId]
      
      // Update menu positions when expanding
      const menuElement = menuRefs.current[menuId]
      if (menuElement) {
        const rect = menuElement.getBoundingClientRect()
        setMenuPositions(prev => ({
          ...prev,
          [menuId]: rect.top
        }))
      }
      
      return newExpanded
    })
  }

  const isMenuExpanded = (menuId: string) => expandedMenus.includes(menuId)

  const menuItems = [
    { id: 'students', title: t('coach-students'), icon: '🥋', path: '/students' },
    { 
      id: 'championships', 
      title: t('championships'), 
      icon: '🥇', 
      path: '/championships',
      subItems: [
        { id: 'championship-registration', title: t('championship-registration'), path: '/championships/registration', icon: '📝' },
        { id: 'student-enrollment', title: t('student-enrollment'), path: '/championships/enrollment', icon: '👥' },
        { id: 'championship-results', title: t('championship-results'), path: '/championships/results', icon: '🏆' },
        { id: 'ranking-statistics', title: t('ranking-statistics'), path: '/championships/ranking', icon: '📊' },
        { id: 'fight-associations', title: t('fight-associations'), path: '/championships/fight-associations', icon: '🏛️' },
        { id: 'affiliations', title: t('affiliations'), path: '/championships/affiliations', icon: '🤝' },
        { id: 'championship-categories', title: t('championship-categories'), path: '/championships/categories', icon: '📋' },
        { id: 'registrations', title: t('registrations'), path: '/championships/registrations', icon: '📝' },
        { id: 'referees-officials', title: t('referees-officials'), path: '/championships/officials', icon: '👨‍⚖️' },
        { id: 'championship-sponsors', title: t('championship-sponsors'), path: '/championships/sponsors', icon: '💰' },
        { id: 'championship-qualified-locations', title: t('championship-qualified-locations'), path: '/championships/qualified-locations', icon: '🏢' },
        { id: 'fight-teams', title: t('fight-teams'), path: '/championships/fight-teams', icon: '🥊' }
      ]
    },
    { id: 'classes', title: t('class-schedules'), icon: '📅', path: '/classes' },
    { id: 'fight-plans', title: t('fight-plans'), icon: '🗂️', path: '/fight-plans' },
    { 
      id: 'quality-evaluation', 
      title: t('quality-evaluation'), 
      icon: '🧪', 
      path: '/quality',
      subItems: [
        { id: 'student-evaluation', title: t('student-evaluation'), path: '/quality/student-evaluation', icon: '📊' },
        { id: 'teacher-evaluations', title: t('teacher-evaluations'), path: '/quality/teacher-evaluations', icon: '📊' }
      ]
    },
    { id: 'branches', title: t('branches'), icon: '🌍', path: '/branches' },
    { 
      id: 'administration', 
      title: t('administration'), 
      icon: '⚙️', 
      path: '/admin',
      subItems: [
        { id: 'user-profiles', title: t('user-profiles'), path: '/admin/profiles', icon: '👤' },
        { id: 'company-info', title: t('company-info-settings'), path: '/admin/company', icon: '🏢' },
        { id: 'language-settings', title: t('language-settings'), path: '/admin/language', icon: '🌐' },
        { id: 'app-settings', title: t('app-settings'), path: '/admin/settings', icon: '⚙️' }
      ]
    }
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
      <div 
        ref={sidebarRef}
        className={`fixed left-0 top-0 h-full bg-white/5 backdrop-blur-md border-r border-white/10 transition-all duration-300 z-50 ${
          isMobile 
            ? (collapsed ? '-translate-x-full w-64' : 'translate-x-0 w-64')
            : (collapsed ? 'w-16' : 'w-64')
        }`}
      >
        {/* Logo */}
        <div className="p-3 border-b border-white/10">
          <div className="flex items-center justify-center">
            {(!collapsed || isMobile) ? (
              <div className="text-center">
                <div className="relative">
                  <div className="text-white font-bold text-lg leading-tight">
                    <div className="relative">
                      <span className="text-2xl font-black tracking-wide">OSS</span>
                      {/* Belt graphic */}
                      <div className="absolute -bottom-1 left-0 right-0 h-2 bg-white rounded-sm transform -skew-x-12">
                        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white border border-gray-800 rounded-full"></div>
                        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-gray-800 rounded-full"></div>
                      </div>
                    </div>
                    <div className="text-2xl font-black tracking-wide mt-1">365</div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1">Fight Academy Manager</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-white font-bold text-sm leading-tight">
                  <div className="relative">
                    <span className="text-lg font-black tracking-wide">OSS</span>
                    {/* Belt graphic */}
                    <div className="absolute -bottom-0.5 left-0 right-0 h-1.5 bg-white rounded-sm transform -skew-x-12">
                      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white border border-gray-800 rounded-full"></div>
                      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-0.5 bg-gray-800 rounded-full"></div>
                    </div>
                  </div>
                  <div className="text-lg font-black tracking-wide mt-0.5">365</div>
                </div>
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
        <nav className="mt-3 overflow-y-auto flex-1 relative">
          {menuItems.map((menu) => (
            <div 
              key={menu.id} 
              className="mb-2 relative"
              ref={(el) => { menuRefs.current[menu.id] = el }}
            >
              {/* Main Menu Item */}
              <div className="relative">
                {menu.subItems ? (
                  <button
                    onClick={() => toggleMenu(menu.id)}
                    className={`w-full flex items-center text-left hover:bg-white/10 transition-all duration-300 rounded-lg group ${
                      (collapsed && !isMobile) ? 'justify-center px-0 py-4 h-14' : 'px-3 mx-2 py-3'
                    } ${location.pathname.startsWith(menu.path) ? 'bg-white/10' : ''}`}
                  >
                    <div className={`flex items-center w-full ${(collapsed && !isMobile) ? 'justify-center' : 'justify-between'}`}>
                      <div className="flex items-center relative">
                        <span className="text-lg group-hover:scale-110 transition-transform">{menu.icon}</span>
                        {(!collapsed || isMobile) && (
                          <span className="ml-2 text-sm text-white font-medium group-hover:text-blue-400 transition-colors">{menu.title}</span>
                        )}
                        {/* Sub-menu indicator for collapsed sidebar */}
                        {(collapsed && !isMobile) && menu.subItems && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full"></div>
                        )}
                      </div>
                      {(!collapsed || isMobile) && menu.subItems && (
                        <svg 
                          className={`w-4 h-4 text-gray-400 transition-transform ${isMenuExpanded(menu.id) ? 'rotate-90' : ''}`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </div>
                  </button>
                ) : (
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
                )}
              </div>

              {/* Sub Menu Items - Horizontal Layout */}
              {menu.subItems && isMenuExpanded(menu.id) && (
                <div className={`fixed ${
                  isMobile 
                    ? 'left-0 top-full mt-1 w-full' 
                    : collapsed 
                      ? 'left-16 ml-1 min-w-max'
                      : 'left-64 ml-2 min-w-max'
                } bg-gray-800/95 backdrop-blur-md border border-white/20 rounded-lg shadow-xl z-[60]`}
                style={{
                  top: isMobile ? 'auto' : `${menuPositions[menu.id] || 0}px`
                }}>
                  <div className="p-2 space-y-1">
                    {menu.subItems.map((subItem) => (
                      <Link
                        key={subItem.id}
                        to={subItem.path}
                        className={`w-full flex items-center text-left hover:bg-white/10 transition-all duration-300 rounded-lg group px-3 py-2 ${
                          isMobile ? '' : 'whitespace-nowrap'
                        } ${
                          location.pathname === subItem.path ? 'bg-white/10 text-blue-400' : 'text-gray-300'
                        }`}
                      >
                        <span className="text-sm group-hover:scale-110 transition-transform">{subItem.icon}</span>
                        <span className="ml-2 text-xs font-medium group-hover:text-blue-400 transition-colors">{subItem.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </>
  )
}

export default Sidebar