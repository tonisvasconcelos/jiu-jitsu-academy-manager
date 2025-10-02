import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Instructors from './pages/Instructors'
import MartialArtTypes from './pages/MartialArtTypes'

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <Router basename="/jiu-jitsu-academy-manager">
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <Sidebar collapsed={sidebarCollapsed} />
        <div className={`transition-all duration-300 ${
          isMobile 
            ? 'ml-0' 
            : sidebarCollapsed 
              ? 'ml-16' 
              : 'ml-64'
        } min-h-screen`}>
          <Header onToggleSidebar={toggleSidebar} />
          <main className="relative">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/students" element={<Students />} />
              <Route path="/instructors" element={<Instructors />} />
              <Route path="/martial-art-types" element={<MartialArtTypes />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App