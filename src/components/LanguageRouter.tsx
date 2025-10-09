import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Language } from '../contexts/LanguageContext';
import WelcomeLanguage from '../pages/WelcomeLanguage';
import Login from '../pages/Login';
import AdminPortal from '../pages/admin/AdminPortal';
import ProtectedRoute from './ProtectedRoute';
import ErrorBoundary from './ErrorBoundary';

interface LanguageRouterProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  isMobile: boolean;
  onLanguageSelect: (language: Language) => void;
}

const LanguageRouter: React.FC<LanguageRouterProps> = ({
  sidebarCollapsed,
  onToggleSidebar,
  isMobile,
  onLanguageSelect
}) => {
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user has previously selected a language
    const savedLanguage = localStorage.getItem('selectedLanguage');
    setHasSelectedLanguage(!!savedLanguage);
  }, []);

  // Show loading while checking language preference
  if (hasSelectedLanguage === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Welcome Language Page - Always in English */}
      <Route 
        path="/welcome-language" 
        element={
          <ErrorBoundary>
            <WelcomeLanguage onLanguageSelect={onLanguageSelect} />
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
            <ProtectedRoute 
              sidebarCollapsed={sidebarCollapsed}
              onToggleSidebar={onToggleSidebar}
              isMobile={isMobile}
            />
          </ErrorBoundary>
        } 
      />
      
      {/* Default redirect based on language selection */}
      <Route 
        path="/" 
        element={
          hasSelectedLanguage ? 
            <Navigate to="/login" replace /> : 
            <Navigate to="/welcome-language" replace />
        } 
      />
    </Routes>
  );
};

export default LanguageRouter;
