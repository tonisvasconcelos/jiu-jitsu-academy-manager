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
      id: 'contacts',
      title: 'Contacts',
      icon: '👥',
      subItems: [
        { id: 'students', title: 'Students', path: '/students', icon: '🎓' },
        { id: 'instructors', title: 'Instructors', path: '/instructors', icon: '👨‍🏫' }
      ]
    },
    {
      id: 'martial-arts',
      title: 'Martial Arts Setup',
      icon: '🥋',
      subItems: [
        { id: 'martial-art-types', title: 'Martial Art Types', path: '/martial-art-types', icon: '🏆' }
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
