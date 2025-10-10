import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react'
import { apiClient } from '../services/api'
import type { LoginCredentials, RegisterData, AuthResult, User, Tenant, UserRole } from '../types/api'

interface AuthContextType {
  // State
  user: User | null;
  tenant: Tenant | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

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
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Inactivity timeout (5 minutes)
  const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  // Initialize auth state on mount
  useEffect(() => {
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
    try {
      setIsLoading(true);
      
      // Clear ALL localStorage data to ensure fresh start
      // This prevents issues with stale authentication and language data
      localStorage.removeItem('auth_data');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('selectedLanguage');
      localStorage.removeItem('language');
      
      // Clear any existing authentication state
      setUser(null);
      setTenant(null);
      setIsAuthenticated(false);
      
    } catch (error) {
      console.error('Auth initialization failed:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const saveAuthToStorage = (user: User, tenant: Tenant): void => {
    const authData = {
      user,
      tenant,
      timestamp: Date.now()
    };
    localStorage.setItem('auth_data', JSON.stringify(authData));
  };

  const clearAuthFromStorage = (): void => {
    localStorage.removeItem('auth_data');
  };

  const setupInactivityTracking = (): void => {
    const resetInactivityTimer = () => {
      lastActivityRef.current = Date.now();
      
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      
      if (isAuthenticated) {
        inactivityTimerRef.current = setTimeout(() => {
          console.log('User inactive for 5 minutes, logging out...');
          logout();
        }, INACTIVITY_TIMEOUT);
      }
    };

    // Track user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, resetInactivityTimer, true);
    });

    // Initial timer setup
    resetInactivityTimer();
  };

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const result: AuthResult = await apiClient.login(credentials);
      
      setUser(result.user);
      setTenant(result.tenant);
      setIsAuthenticated(true);
      
      // Save to localStorage for persistence
      saveAuthToStorage(result.user, result.tenant);
      
      // Store test data for all tenants
      if (result.tenant) {
        const testData = {
          students: [{
            id: 'student_1',
            tenantId: result.tenant.id,
            studentId: 'STU001',
            firstName: 'John',
            lastName: 'Doe',
            displayName: 'John Doe',
            birthDate: '1990-01-01',
            gender: 'male',
            beltLevel: 'blue',
            documentId: '12345678901',
            email: 'john.doe@example.com',
            phone: '1234567890',
            branchId: 'main-branch',
            active: true,
            isKidsStudent: false,
            weight: 80,
            weightDivisionId: 'middleweight',
            photoUrl: '',
            preferredLanguage: 'ENU',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }, {
            id: 'student_2',
            tenantId: result.tenant.id,
            studentId: 'STU002',
            firstName: 'Jane',
            lastName: 'Smith',
            displayName: 'Jane Smith',
            birthDate: '1992-05-15',
            gender: 'female',
            beltLevel: 'purple',
            documentId: '98765432109',
            email: 'jane.smith@example.com',
            phone: '0987654321',
            branchId: 'main-branch',
            active: true,
            isKidsStudent: false,
            weight: 65,
            weightDivisionId: 'lightweight',
            photoUrl: '',
            preferredLanguage: 'ENU',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }],
          teachers: [{
            id: 'teacher_1',
            tenantId: result.tenant.id,
            firstName: 'Master',
            lastName: 'Instructor',
            displayName: 'Master Instructor',
            email: 'master@example.com',
            phone: '1111111111',
            branchId: 'main-branch',
            active: true,
            beltLevel: 'black',
            specialization: 'Brazilian Jiu-Jitsu',
            experience: 10,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }],
          branches: [{
            id: 'main-branch',
            tenantId: result.tenant.id,
            name: 'Main Branch',
            address: '123 Main Street',
            phone: '555-0123',
            email: 'main@example.com',
            active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }],
          modalities: [{
            id: 'modality_1',
            tenantId: result.tenant.id,
            name: 'Brazilian Jiu-Jitsu',
            description: 'Traditional Brazilian Jiu-Jitsu training',
            active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }],
          classes: [{
            id: 'class_1',
            tenantId: result.tenant.id,
            name: 'Morning BJJ',
            modalityId: 'modality_1',
            teacherId: 'teacher_1',
            branchId: 'main-branch',
            daysOfWeek: ['monday', 'wednesday', 'friday'],
            startTime: '09:00',
            endTime: '10:30',
            maxStudents: 20,
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }],
          checkIns: [{
            id: 'checkin_1',
            tenantId: result.tenant.id,
            studentId: 'student_1',
            classId: 'class_1',
            checkInTime: new Date().toISOString(),
            status: 'present',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }]
        };
        localStorage.setItem('testData', JSON.stringify(testData));
      }
      
      // Reset inactivity timer
      lastActivityRef.current = Date.now();
    } catch (error: any) {
      setError(error.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const result: AuthResult = await apiClient.register(data);
      
      setUser(result.user);
      setTenant(result.tenant);
      setIsAuthenticated(true);
    } catch (error: any) {
      setError(error.message || 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setTenant(null);
      setIsAuthenticated(false);
      setError(null);
      
      // Clear from localStorage
      clearAuthFromStorage();
      
      // Clear inactivity timer
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      if (apiClient.isAuthenticated()) {
        const userData = await apiClient.getCurrentUser();
        if (userData) {
          setUser(userData.user);
          setTenant(userData.tenant);
        }
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      await logout();
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  // Role checking utilities
  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  const canAccess = (requiredRole: UserRole): boolean => {
    if (!user) return false;

    const roleHierarchy: Record<UserRole, number> = {
      [UserRole.STUDENT]: 1,
      [UserRole.COACH]: 2,
      [UserRole.BRANCH_MANAGER]: 3,
      [UserRole.SYSTEM_MANAGER]: 4
    };

    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  };

  const value: AuthContextType = {
    // State
    user,
    tenant,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    login,
    register,
    logout,
    refreshUser,
    clearError,

    // Utilities
    hasRole,
    hasAnyRole,
    canAccess
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
