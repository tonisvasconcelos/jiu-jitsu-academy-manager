import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import LanguageSelector from './components/LanguageSelector'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import Login from './pages/Login'
import AdminPortal from './pages/admin/AdminPortal'

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      // On mobile, always start with collapsed sidebar
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <Router basename="/">
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
              <Routes>
                {/* Language Selection Route */}
                <Route path="/language" element={
                  <ErrorBoundary>
                    <LanguageSelector />
                  </ErrorBoundary>
                } />
                
                {/* Public Routes - No Layout */}
                <Route path="/login" element={
                  <ErrorBoundary>
                    <Login />
                  </ErrorBoundary>
                } />
                <Route path="/admin" element={
                  <ErrorBoundary>
                    <AdminPortal />
                  </ErrorBoundary>
                } />
                
                {/* Default redirect to login */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                
                {/* Protected Routes - With Layout */}
                <Route path="/*" element={
                  <ErrorBoundary>
                    <ProtectedRoute 
                      sidebarCollapsed={sidebarCollapsed}
                      onToggleSidebar={toggleSidebar}
                      isMobile={isMobile}
                    />
                  </ErrorBoundary>
                } />
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  )
}

export default App