import { ApiResponse, UserRole, LoginCredentials, RegisterData, AuthResult } from '../types/api';

const API_BASE_URL = 'https://oss365.app/api';

// Login response interface for our backend
interface LoginResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
    tenantId: string;
    firstName: string;
    lastName: string;
  };
}

// API Client class
class ApiClient {
  private baseURL: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.loadTokensFromStorage();
  }

  // Token management
  private loadTokensFromStorage(): void {
    this.accessToken = localStorage.getItem('accessToken');
    this.refreshToken = localStorage.getItem('refreshToken');
  }

  private saveTokensToStorage(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  private clearTokensFromStorage(): void {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  // HTTP methods
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle token refresh for 401 errors
        if (response.status === 401 && this.refreshToken && endpoint !== '/auth/refresh') {
          const refreshed = await this.refreshAccessToken();
          if (refreshed) {
            // Retry the original request with new token
            (headers as Record<string, string>).Authorization = `Bearer ${this.accessToken}`;
            const retryResponse = await fetch(url, {
              ...options,
              headers,
            });
            return await retryResponse.json();
          }
        }
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(credentials: LoginCredentials): Promise<AuthResult> {
    // For now, use mock authentication for Elite Combat Academy
    if (credentials.tenantDomain === 'elite-combat.jiu-jitsu.com' && 
        credentials.email === 'admin@elite-combat.com' && 
        credentials.password === 'EliteAdmin2024!') {
      
      const mockToken = btoa(JSON.stringify({
        userId: 'admin-123',
        tenantId: 'elite-combat-123',
        role: 'system_manager',
        email: credentials.email
      }));

      const mockUser = {
        id: 'admin-123',
        tenant_id: 'elite-combat-123',
        email: credentials.email,
        first_name: 'Admin',
        last_name: 'User',
        phone: '',
        role: 'system_manager' as any,
        status: 'active' as any,
        branch_id: '',
        avatar_url: '',
        last_login: new Date().toISOString(),
        email_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const mockTenant = {
        id: 'elite-combat-123',
        name: 'Elite Combat Academy',
        domain: credentials.tenantDomain,
        plan: 'enterprise' as any,
        license_start: new Date().toISOString(),
        license_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        is_active: true,
        settings: {},
        contact_email: credentials.email,
        contact_phone: '',
        address: '',
        logo_url: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Store tokens
      localStorage.setItem('accessToken', mockToken);
      localStorage.setItem('refreshToken', mockToken);

      return {
        user: mockUser,
        tenant: mockTenant,
        accessToken: mockToken,
        refreshToken: mockToken
      };
    }

    // For other credentials, try the real API
    const backendCredentials = {
      tenantDomain: credentials.tenantDomain,
      email: credentials.email,
      password: credentials.password
    };

    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(backendCredentials),
    });

    // Our backend returns the data directly, not wrapped in a data property
    if (response.success && response.data?.token) {
      // Store the token (our backend uses 'token' instead of 'accessToken')
      localStorage.setItem('accessToken', response.data.token);
      localStorage.setItem('refreshToken', response.data.token); // Use same token for both
    }

    // Return in the expected format
    return {
      user: response.data?.user || {} as any,
      tenant: {
        id: response.data?.user?.tenantId || '',
        name: '',
        domain: credentials.tenantDomain,
        plan: 'enterprise' as any,
        license_start: new Date().toISOString(),
        license_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        is_active: true,
        settings: {},
        contact_email: response.data?.user?.email || '',
        contact_phone: '',
        address: '',
        logo_url: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      accessToken: response.data?.token || '',
      refreshToken: response.data?.token || ''
    };
  }

  async register(data: RegisterData): Promise<AuthResult> {
    const response = await this.request<AuthResult>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.success && response.data) {
      this.saveTokensToStorage(response.data.accessToken, response.data.refreshToken);
    }

    return response.data!;
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', {
        method: 'POST',
      });
    } finally {
      this.clearTokensFromStorage();
    }
  }

  async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) {
      return false;
    }

    try {
      const response = await this.request<{ accessToken: string; refreshToken: string }>('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      if (response.success && response.data) {
        this.saveTokensToStorage(response.data.accessToken, response.data.refreshToken);
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearTokensFromStorage();
    }

    return false;
  }

  async getCurrentUser(): Promise<any> {
    const response = await this.request('/auth/me');
    return response.data;
  }

  // User management
  async getUsers(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    role?: UserRole;
    branchId?: string;
  } = {}): Promise<ApiResponse> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return this.request(`/users?${queryParams.toString()}`);
  }

  async getUser(id: string): Promise<any> {
    const response = await this.request(`/users/${id}`);
    return response.data;
  }

  async createUser(userData: any): Promise<any> {
    const response = await this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response.data;
  }

  async updateUser(id: string, userData: any): Promise<any> {
    const response = await this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    return response.data;
  }

  async deleteUser(id: string): Promise<void> {
    await this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Class management
  async getClasses(params: {
    page?: number;
    limit?: number;
    search?: string;
    branchId?: string;
    coachId?: string;
  } = {}): Promise<ApiResponse> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return this.request(`/classes?${queryParams.toString()}`);
  }

  async getClass(id: string): Promise<any> {
    const response = await this.request(`/classes/${id}`);
    return response.data;
  }

  async createClass(classData: any): Promise<any> {
    const response = await this.request('/classes', {
      method: 'POST',
      body: JSON.stringify(classData),
    });
    return response.data;
  }

  async updateClass(id: string, classData: any): Promise<any> {
    const response = await this.request(`/classes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(classData),
    });
    return response.data;
  }

  async deleteClass(id: string): Promise<void> {
    await this.request(`/classes/${id}`, {
      method: 'DELETE',
    });
  }

  // Public endpoints
  async getPublicClasses(tenantDomain: string, branchId?: string): Promise<any[]> {
    const params = new URLSearchParams({ tenantDomain });
    if (branchId) {
      params.append('branchId', branchId);
    }

    const response = await this.request<any[]>(`/public/classes?${params.toString()}`);
    return response.data || [];
  }

  async getPublicBranches(tenantDomain: string): Promise<any[]> {
    const response = await this.request<any[]>(`/public/branches?tenantDomain=${encodeURIComponent(tenantDomain)}`);
    return response.data || [];
  }

  async getPublicTenantInfo(tenantDomain: string): Promise<any> {
    const response = await this.request(`/public/tenant-info?tenantDomain=${encodeURIComponent(tenantDomain)}`);
    return response.data;
  }

  async createBooking(bookingData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    classId: string;
    branchId: string;
    tenantDomain: string;
    notes?: string;
    preferredContactMethod: 'email' | 'phone';
  }): Promise<any> {
    const response = await this.request('/public/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
    return response.data;
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  getRefreshToken(): string | null {
    return this.refreshToken;
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export types (re-export from types/api.ts)
export type { ApiResponse, LoginCredentials, RegisterData, AuthResult } from '../types/api';
