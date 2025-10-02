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
    <div className={`fixed left-0 top-0 h-full bg-gray-800 transition-all duration-300 z-50 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Logo */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center">
          <div className="text-2xl">🥋</div>
          {!collapsed && (
            <span className="ml-3 text-xl font-bold text-white">
              Academy Manager
            </span>
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
              className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-700 transition-colors ${
                collapsed ? 'justify-center' : 'justify-between'
              }`}
            >
              <div className="flex items-center">
                <span className="text-xl">{menu.icon}</span>
                {!collapsed && (
                  <span className="ml-3 text-white font-medium">{menu.title}</span>
                )}
              </div>
              {!collapsed && (
                <span className={`transform transition-transform ${
                  isMenuExpanded(menu.id) ? 'rotate-180' : ''
                }`}>
                  ▼
                </span>
              )}
            </button>

            {/* Sub Menu Items */}
            {!collapsed && isMenuExpanded(menu.id) && (
              <div className="bg-gray-750">
                {menu.subItems.map((subItem) => (
                  <Link
                    key={subItem.id}
                    to={subItem.path}
                    className={`flex items-center px-8 py-2 text-sm hover:bg-gray-700 transition-colors ${
                      location.pathname === subItem.path 
                        ? 'bg-gray-700 text-blue-400' 
                        : 'text-gray-300'
                    }`}
                  >
                    <span className="text-lg mr-3">{subItem.icon}</span>
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
