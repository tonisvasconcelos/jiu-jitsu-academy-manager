import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface TenantReadyProps {
  children: React.ReactNode;
}

export function TenantReady({ children }: TenantReadyProps) {
  const { isLoading, isAuthenticated, tenant } = useAuth();
  
  console.log('TenantReady: Auth state', { isLoading, isAuthenticated, tenantId: tenant?.id });
  
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
  
  if (!isAuthenticated || !tenant?.id) {
    console.log('TenantReady: Redirecting to login - not authenticated or no tenant');
    return <Navigate to="/login" replace />;
  }
  
  console.log('TenantReady: Rendering children for tenant', tenant.id);
  return <>{children}</>;
}
