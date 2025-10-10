import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/api';

// Lazy load the AppWithContexts component to prevent early initialization
const AppWithContexts = lazy(() => import('./AppWithContexts'));

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requiredRole?: UserRole;
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  fallbackPath = '/login'
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // On mobile, always start with collapsed sidebar
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  const { isAuthenticated, isLoading, user, canAccess, tenant } = useAuth();
  const location = useLocation();
  
  console.log('ProtectedRoute: Auth state:', { isAuthenticated, isLoading, user, tenant });

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check role-based access if required role is specified
  if (requiredRole && !canAccess(requiredRole)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-8 max-w-md">
            <div className="text-red-400 text-6xl mb-4">🚫</div>
            <h2 className="text-xl font-semibold text-white mb-2">Access Denied</h2>
            <p className="text-gray-300 mb-4">
              You don't have permission to access this page.
            </p>
            <p className="text-sm text-gray-400">
              Required role: <span className="font-mono bg-gray-700 px-2 py-1 rounded">{requiredRole}</span>
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Your role: <span className="font-mono bg-gray-700 px-2 py-1 rounded">{user?.role}</span>
            </p>
            <button
              onClick={() => window.history.back()}
              className="mt-4 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render AppWithContexts with lazy loading
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading application...</p>
        </div>
      </div>
    }>
      <AppWithContexts
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        isMobile={isMobile}
      />
    </Suspense>
  );
};

export default ProtectedRoute;
