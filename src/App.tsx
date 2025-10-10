import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { LanguageProvider, Language } from './contexts/LanguageContext'
import { AuthProvider } from './contexts/AuthContext'
import WelcomeLanguage from './pages/WelcomeLanguage'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import Login from './pages/Login'
import AdminPortal from './pages/admin/AdminPortal'

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('ENU')

  useEffect(() => {
    // Initialize language from localStorage
    const savedLanguage = localStorage.getItem('selectedLanguage') as Language
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage)
    }
  }, [])

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language)
    localStorage.setItem('selectedLanguage', language)
  }

  return (
    <ErrorBoundary>
      <LanguageProvider initialLanguage={selectedLanguage}>
        <AuthProvider>
          <Router basename="/">
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
              <Routes>
                {/* Welcome Language Page - Always in English */}
                <Route 
                  path="/welcome-language" 
                  element={
                    <ErrorBoundary>
                      <WelcomeLanguage onLanguageSelect={handleLanguageSelect} />
                    </ErrorBoundary>
                  } 
                />
                
                {/* Login Page - Translated based on selected language */}
                <Route 
                  path="/login" 
                  element={
                    <ErrorBoundary>
                      <Login />
                    </ErrorBoundary>
                  } 
                />
                
                {/* Admin Portal */}
                <Route 
                  path="/admin" 
                  element={
                    <ErrorBoundary>
                      <AdminPortal />
                    </ErrorBoundary>
                  } 
                />
                
                {/* Protected Routes - With Layout */}
                <Route 
                  path="/*" 
                  element={
                    <ErrorBoundary>
                      <ProtectedRoute />
                    </ErrorBoundary>
                  } 
                />
                
                {/* Default redirect based on language selection */}
                <Route 
                  path="/" 
                  element={
                    localStorage.getItem('selectedLanguage') ? 
                      <Navigate to="/dashboard" replace /> : 
                      <Navigate to="/welcome-language" replace />
                  } 
                />
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  )
}

export default App