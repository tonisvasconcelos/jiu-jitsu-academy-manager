import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react'
import { apiClient } from '../services/api'
import type { LoginCredentials, RegisterData, AuthResult, User, Tenant, UserRole } from '../types/api'
import { seedSampleDataIfNeeded } from '../utils/seed'

type AuthState = {
  isLoading: boolean;
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  tenant: Tenant | null;
  error: string | null;
};

interface AuthContextType extends AuthState {
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;

  // Utilities
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  canAccess: (requiredRole: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  console.log('AuthProvider: Component rendered');
  
  const [auth, setAuth] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    token: null,
    user: null,
    tenant: null,
    error: null
  });
  
  // Inactivity timeout (5 minutes)
  const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  // Initialize auth state on mount
  useEffect(() => {
    console.log('AuthProvider: useEffect called - initializing auth');
    initializeAuth();
    setupInactivityTracking();
    
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, []);

  // Cleanup inactivity tracking on unmount
  useEffect(() => {
    return () => {
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
      events.forEach(event => {
        document.removeEventListener(event, () => {}, true);
      });
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, []);

  const initializeAuth = async (): Promise<void> => {
    console.log('AuthContext: initializeAuth called');
    try {
      const raw = localStorage.getItem('oss365-auth');
      if (!raw) throw new Error('No saved auth');
      
      const parsed = JSON.parse(raw);
      if (!parsed?.token || !parsed?.tenant?.id) throw new Error('Invalid saved auth');
      
      setAuth({ 
        isLoading: false, 
        isAuthenticated: true, 
        token: parsed.token,
        user: parsed.user,
        tenant: parsed.tenant,
        error: null
      });
      console.log('AuthContext: restored auth for tenant', parsed.tenant.id);
    } catch {
      setAuth({ 
        isLoading: false, 
        isAuthenticated: false, 
        token: null, 
        user: null, 
        tenant: null,
        error: null
      });
      console.log('AuthContext: No valid saved auth, setting unauthenticated');
    }
  };

  const login = async (credentials: LoginCredentials): Promise<void> => {
    console.log('AuthContext.login: start', credentials.tenantDomain);
    
    try {
      setAuth(prev => ({ ...prev, isLoading: true, error: null }));

      const result: AuthResult = await apiClient.login(credentials);
      
      const next = { 
        isLoading: false, 
        isAuthenticated: true, 
        token: result.accessToken,
        user: result.user,
        tenant: result.tenant,
        error: null
      };
      
      // Save to localStorage before setting state
      localStorage.setItem('oss365-auth', JSON.stringify(next));
      setAuth(next);
      console.log('AuthContext.login: success - tenant', result.tenant.id);

      // Seed sample data if needed
      await seedSampleDataIfNeeded(result.tenant.id);
      
      // Reset inactivity timer
      resetInactivityTimer();
      
    } catch (error: any) {
      console.error('Login failed:', error);
      setAuth(prev => ({ 
        ...prev, 
        isLoading: false, 
        isAuthenticated: false, 
        token: null,
        user: null, 
        tenant: null,
        error: error.message || 'Login failed'
      }));
    }
  };

  const logout = async (): Promise<void> => {
    console.log('AuthContext: Logout called');
    
    // Clear localStorage
    localStorage.removeItem('oss365-auth');
    
    // Clear all tenant-specific data
    if (auth.tenant?.id) {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.includes(auth.tenant!.id) || key.startsWith('oss365:')) {
          localStorage.removeItem(key);
        }
      });
    }
    
    setAuth({
      isLoading: false,
      isAuthenticated: false,
      token: null,
      user: null,
      tenant: null,
      error: null
    });
    
    // Clear inactivity timer
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    try {
      setAuth(prev => ({ ...prev, isLoading: true, error: null }));
      
      const result: AuthResult = await apiClient.register(data);
      
      const next = { 
        isLoading: false, 
        isAuthenticated: true, 
        token: result.accessToken,
        user: result.user,
        tenant: result.tenant,
        error: null
      };
      
      localStorage.setItem('oss365-auth', JSON.stringify(next));
      setAuth(next);
      
      // Seed sample data for new tenant
      await seedSampleDataIfNeeded(result.tenant.id);
      
    } catch (error: any) {
      console.error('Registration failed:', error);
      setAuth(prev => ({ 
        ...prev, 
        isLoading: false, 
        isAuthenticated: false, 
        token: null,
        user: null, 
        tenant: null,
        error: error.message || 'Registration failed'
      }));
    }
  };

  const refreshUser = async (): Promise<void> => {
    // Implementation for refreshing user data
    console.log('AuthContext: refreshUser called');
  };

  const clearError = (): void => {
    setAuth(prev => ({ ...prev, error: null }));
  };

  // Utility functions
  const hasRole = (role: UserRole): boolean => {
    return auth.user?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return roles.includes(auth.user?.role as UserRole);
  };

  const canAccess = (requiredRole: UserRole): boolean => {
    if (!auth.user) return false;
    
    const roleHierarchy: Record<UserRole, number> = {
      [UserRole.STUDENT]: 1,
      [UserRole.COACH]: 2,
      [UserRole.BRANCH_MANAGER]: 3,
      [UserRole.SYSTEM_MANAGER]: 4
    };
    
    const userRoleLevel = roleHierarchy[auth.user.role as UserRole] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0;
    
    return userRoleLevel >= requiredRoleLevel;
  };

  // Inactivity tracking
  const resetInactivityTimer = (): void => {
    lastActivityRef.current = Date.now();
    
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    
    inactivityTimerRef.current = setTimeout(() => {
      console.log('AuthContext: Inactivity timeout - logging out');
      logout();
    }, INACTIVITY_TIMEOUT);
  };

  const setupInactivityTracking = (): void => {
    // Track user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, resetInactivityTimer, true);
    });

    // Initial timer setup
    resetInactivityTimer();
  };

  const contextValue: AuthContextType = {
    ...auth,
    login,
    register,
    logout,
    refreshUser,
    clearError,
    hasRole,
    hasAnyRole,
    canAccess
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};