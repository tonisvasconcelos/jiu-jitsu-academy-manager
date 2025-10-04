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
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])
  const { t } = useLanguage()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    )
  }

  const isMenuExpanded = (menuId: string) => expandedMenus.includes(menuId)

  const menuItems = [
    { id: 'students', title: t('students'), icon: '🥋', path: '/students' },
    { id: 'teachers', title: t('teachers-instructors'), icon: '🧑‍🏫', path: '/teachers' },
    { id: 'championships', title: t('championships'), icon: '🏟️', path: '/championships' },
    { id: 'classes', title: t('class-schedules'), icon: '📅', path: '/classes' },
    { id: 'fight-plans', title: t('fight-plans'), icon: '🗂️', path: '/fight-plans' },
    { id: 'quality-evaluation', title: t('quality-evaluation'), icon: '🧪', path: '/quality' },
    { id: 'branches', title: t('branches'), icon: '🌍', path: '/branches' },
    { id: 'schedules-checkins', title: t('schedules-checkins'), icon: '📅', path: '/schedules' },
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
      <div className={`fixed left-0 top-0 h-full bg-white/5 backdrop-blur-md border-r border-white/10 transition-all duration-300 z-50 ${
        isMobile 
          ? (collapsed ? '-translate-x-full w-64' : 'translate-x-0 w-64')
          : (collapsed ? 'w-16' : 'w-64')
      }`}>
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
        <nav className="mt-3 overflow-y-auto flex-1">
          {menuItems.map((menu) => (
            <div key={menu.id} className="mb-2">
              {/* Main Menu Item */}
              <div className="relative">
                {menu.subItems ? (
                  <button
                    onClick={() => toggleMenu(menu.id)}
                    className={`w-full flex items-center text-left hover:bg-white/10 transition-all duration-300 rounded-lg group ${
                      (collapsed && !isMobile) ? 'justify-center px-0 py-4 h-14' : 'px-3 mx-2 py-3'
                    } ${location.pathname.startsWith(menu.path) ? 'bg-white/10' : ''}`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <span className="text-lg group-hover:scale-110 transition-transform">{menu.icon}</span>
                        {(!collapsed || isMobile) && (
                          <span className="ml-2 text-sm text-white font-medium group-hover:text-blue-400 transition-colors">{menu.title}</span>
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

              {/* Sub Menu Items */}
              {menu.subItems && (!collapsed || isMobile) && isMenuExpanded(menu.id) && (
                <div className="ml-4 mt-1 space-y-1">
                  {menu.subItems.map((subItem) => (
                    <Link
                      key={subItem.id}
                      to={subItem.path}
                      className={`w-full flex items-center text-left hover:bg-white/5 transition-all duration-300 rounded-lg group px-3 py-2 ${
                        location.pathname === subItem.path ? 'bg-white/5 text-blue-400' : 'text-gray-300'
                      }`}
                    >
                      <span className="text-sm group-hover:scale-110 transition-transform">{subItem.icon}</span>
                      <span className="ml-2 text-xs font-medium group-hover:text-blue-400 transition-colors">{subItem.title}</span>
                    </Link>
                  ))}
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