import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { LanguageProvider, Language } from './contexts/LanguageContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import WelcomeLanguage from './pages/WelcomeLanguage'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import Login from './pages/Login'
import AdminPortal from './pages/admin/AdminPortal'

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('ENU')

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

  useEffect(() => {
    // Initialize language from localStorage
    const savedLanguage = localStorage.getItem('selectedLanguage') as Language
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage)
    }
  }, [])

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language)
  }

  return (
    <ErrorBoundary>
      <LanguageProvider initialLanguage={selectedLanguage}>
        <AuthProvider>
          <Router basename="/">
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
              <LanguageRouter
                sidebarCollapsed={sidebarCollapsed}
                onToggleSidebar={toggleSidebar}
                isMobile={isMobile}
                onLanguageSelect={handleLanguageSelect}
              />
            </div>
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  )
}

export default App