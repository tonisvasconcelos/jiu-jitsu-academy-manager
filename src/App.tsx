import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Instructors from './pages/Instructors'
import MartialArtTypes from './pages/MartialArtTypes'

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Sidebar collapsed={sidebarCollapsed} />
        <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
          <Header onToggleSidebar={toggleSidebar} />
          <main className="p-6">
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