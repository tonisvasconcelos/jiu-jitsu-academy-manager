import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { LanguageProvider, Language } from './contexts/LanguageContext'
import { AuthProvider } from './contexts/AuthContext'
import { TenantReady } from './components/TenantReady'
import { AllDataProviders } from './components/AllDataProviders'
import DataBootstrap from './components/DataBootstrap'
import WelcomeLanguage from './pages/WelcomeLanguage'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import Login from './pages/Login'
import AdminPortal from './pages/admin/AdminPortal'
import AdminDebug from './pages/AdminDebug'
import AppWithContexts from './components/AppWithContexts'

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('ENU')

  // Don't initialize from localStorage - force fresh language selection
  // The AuthContext will clear localStorage, so we start fresh every time

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language)
    localStorage.setItem('selectedLanguage', language)
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <LanguageProvider initialLanguage={selectedLanguage}>
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
                
                {/* Admin Debug */}
                <Route 
                  path="/admin/debug" 
                  element={
                    <ErrorBoundary>
                      <ProtectedRoute>
                        <AdminDebug />
                      </ProtectedRoute>
                    </ErrorBoundary>
                  } 
                />
                
                {/* Protected Routes - With Layout */}
                <Route 
                  path="/*" 
                  element={
                    <ErrorBoundary>
                      <ProtectedRoute>
                        <TenantReady>
                          <DataBootstrap>
                            <AllDataProviders>
                              <AppWithContexts />
                            </AllDataProviders>
                          </DataBootstrap>
                        </TenantReady>
                      </ProtectedRoute>
                    </ErrorBoundary>
                  } 
                />
                
                {/* Default redirect - always go to language selection first */}
                <Route 
                  path="/" 
                  element={<Navigate to="/welcome-language" replace />} 
                />
              </Routes>
            </div>
          </Router>
        </LanguageProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App