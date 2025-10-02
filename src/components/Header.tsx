import React from 'react'

interface HeaderProps {
  onToggleSidebar: () => void
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  return (
    <header className="bg-white/5 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl hover:bg-white/10 transition-all duration-300 hover:scale-105 group"
            aria-label="Toggle sidebar"
          >
            <svg
              className="w-6 h-6 text-white group-hover:text-blue-400 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div className="ml-4">
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Academy Manager
            </h1>
            <p className="text-xs text-gray-400 hidden sm:block">Jiu-Jitsu Management System</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="hidden sm:block text-sm text-gray-300">
            Welcome back, <span className="text-blue-400 font-medium">Admin</span>
          </div>
          <div className="relative group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 cursor-pointer">
              <span className="text-white text-sm sm:text-base font-semibold">A</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
