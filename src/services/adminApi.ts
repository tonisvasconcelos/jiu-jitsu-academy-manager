import { ApiResponse } from '../types/api'

// Admin API service for managing tenants and users
class AdminApiService {
  private baseURL: string

  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'https://oss365.app/api'
  }

  // Admin authentication
  async authenticateAdmin(password: string): Promise<boolean> {
    // Simple admin authentication - in production, use proper JWT auth
    return password === 'OSS365Admin2024!'
  }

  // Tenant management
  async createTenant(tenantData: {
    name: string
    domain: string
    plan: 'trial' | 'basic' | 'professional' | 'enterprise'
    contactEmail: string
    contactPhone?: string
    address?: string
    licenseDays: number
  }): Promise<ApiResponse<any>> {
    try {
      // In production, this would call the backend API
      // For now, we'll simulate the API call
      const tenant = {
        id: `tenant_${Date.now()}`,
        name: tenantData.name,
        domain: tenantData.domain,
        plan: tenantData.plan,
        licenseStart: new Date().toISOString(),
        licenseEnd: new Date(Date.now() + tenantData.licenseDays * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
        contactEmail: tenantData.contactEmail,
        contactPhone: tenantData.contactPhone,
        address: tenantData.address,
        createdAt: new Date().toISOString(),
        userCount: 0
      }

      // Store in localStorage (in production, this would be handled by the backend)
      const existingTenants = JSON.parse(localStorage.getItem('admin_tenants') || '[]')
      existingTenants.push(tenant)
      localStorage.setItem('admin_tenants', JSON.stringify(existingTenants))

      return {
        success: true,
        data: tenant,
        message: 'Tenant created successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to create tenant'
      }
    }
  }

  async getTenants(): Promise<ApiResponse<any[]>> {
    try {
      const tenants = JSON.parse(localStorage.getItem('admin_tenants') || '[]')
      return {
        success: true,
        data: tenants
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch tenants'
      }
    }
  }

  async updateTenantStatus(tenantId: string, isActive: boolean): Promise<ApiResponse<any>> {
    try {
      const tenants = JSON.parse(localStorage.getItem('admin_tenants') || '[]')
      const updatedTenants = tenants.map((tenant: any) => 
        tenant.id === tenantId ? { ...tenant, isActive } : tenant
      )
      localStorage.setItem('admin_tenants', JSON.stringify(updatedTenants))

      return {
        success: true,
        data: updatedTenants.find((t: any) => t.id === tenantId),
        message: `Tenant ${isActive ? 'activated' : 'deactivated'} successfully`
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update tenant status'
      }
    }
  }

  // User management
  async createUser(userData: {
    email: string
    firstName: string
    lastName: string
    role: 'SYSTEM_MANAGER' | 'BRANCH_MANAGER' | 'COACH' | 'STUDENT'
    password: string
    tenantId: string
  }): Promise<ApiResponse<any>> {
    try {
      const user = {
        id: `user_${Date.now()}`,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        status: 'active',
        tenantId: userData.tenantId,
        password: userData.password, // In production, this should be hashed
        createdAt: new Date().toISOString()
      }

      // Store in localStorage (in production, this would be handled by the backend)
      const existingUsers = JSON.parse(localStorage.getItem('admin_users') || '[]')
      existingUsers.push(user)
      localStorage.setItem('admin_users', JSON.stringify(existingUsers))

      // Update tenant user count
      const tenants = JSON.parse(localStorage.getItem('admin_tenants') || '[]')
      const updatedTenants = tenants.map((tenant: any) => 
        tenant.id === userData.tenantId 
          ? { ...tenant, userCount: (tenant.userCount || 0) + 1 }
          : tenant
      )
      localStorage.setItem('admin_tenants', JSON.stringify(updatedTenants))

      return {
        success: true,
        data: user,
        message: 'User created successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to create user'
      }
    }
  }

  async getUsers(): Promise<ApiResponse<any[]>> {
    try {
      const users = JSON.parse(localStorage.getItem('admin_users') || '[]')
      return {
        success: true,
        data: users
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch users'
      }
    }
  }

  async updateUserStatus(userId: string, status: 'active' | 'inactive'): Promise<ApiResponse<any>> {
    try {
      const users = JSON.parse(localStorage.getItem('admin_users') || '[]')
      const updatedUsers = users.map((user: any) => 
        user.id === userId ? { ...user, status } : user
      )
      localStorage.setItem('admin_users', JSON.stringify(updatedUsers))

      return {
        success: true,
        data: updatedUsers.find((u: any) => u.id === userId),
        message: `User ${status === 'active' ? 'activated' : 'deactivated'} successfully`
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update user status'
      }
    }
  }

  // Analytics
  async getAnalytics(): Promise<ApiResponse<any>> {
    try {
      const tenants = JSON.parse(localStorage.getItem('admin_tenants') || '[]')
      const users = JSON.parse(localStorage.getItem('admin_users') || '[]')

      const analytics = {
        totalTenants: tenants.length,
        activeTenants: tenants.filter((t: any) => t.isActive).length,
        totalUsers: users.length,
        activeUsers: users.filter((u: any) => u.status === 'active').length,
        usersByRole: {
          SYSTEM_MANAGER: users.filter((u: any) => u.role === 'SYSTEM_MANAGER').length,
          BRANCH_MANAGER: users.filter((u: any) => u.role === 'BRANCH_MANAGER').length,
          COACH: users.filter((u: any) => u.role === 'COACH').length,
          STUDENT: users.filter((u: any) => u.role === 'STUDENT').length,
        },
        tenantsByPlan: {
          trial: tenants.filter((t: any) => t.plan === 'trial').length,
          basic: tenants.filter((t: any) => t.plan === 'basic').length,
          professional: tenants.filter((t: any) => t.plan === 'professional').length,
          enterprise: tenants.filter((t: any) => t.plan === 'enterprise').length,
        }
      }

      return {
        success: true,
        data: analytics
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch analytics'
      }
    }
  }

  // Bulk operations
  async createBulkUsers(usersData: Array<{
    email: string
    firstName: string
    lastName: string
    role: 'SYSTEM_MANAGER' | 'BRANCH_MANAGER' | 'COACH' | 'STUDENT'
    password: string
    tenantId: string
  }>): Promise<ApiResponse<any[]>> {
    try {
      const createdUsers = []
      
      for (const userData of usersData) {
        const result = await this.createUser(userData)
        if (result.success) {
          createdUsers.push(result.data)
        }
      }

      return {
        success: true,
        data: createdUsers,
        message: `${createdUsers.length} users created successfully`
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to create bulk users'
      }
    }
  }

  // Export data
  async exportTenants(): Promise<ApiResponse<any>> {
    try {
      const tenants = JSON.parse(localStorage.getItem('admin_tenants') || '[]')
      const csvData = this.convertToCSV(tenants, [
        'id', 'name', 'domain', 'plan', 'isActive', 'contactEmail', 'contactPhone', 'userCount', 'createdAt'
      ])

      return {
        success: true,
        data: csvData,
        message: 'Tenants exported successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to export tenants'
      }
    }
  }

  async exportUsers(): Promise<ApiResponse<any>> {
    try {
      const users = JSON.parse(localStorage.getItem('admin_users') || '[]')
      const csvData = this.convertToCSV(users, [
        'id', 'email', 'firstName', 'lastName', 'role', 'status', 'tenantId', 'createdAt'
      ])

      return {
        success: true,
        data: csvData,
        message: 'Users exported successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to export users'
      }
    }
  }

  // Utility functions
  private convertToCSV(data: any[], fields: string[]): string {
    const headers = fields.join(',')
    const rows = data.map(item => 
      fields.map(field => {
        const value = item[field] || ''
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value
      }).join(',')
    )
    
    return [headers, ...rows].join('\n')
  }

  // Generate credentials for new tenant setup
  async generateTenantCredentials(tenantId: string, userCounts: {
    systemManagers: number
    branchManagers: number
    coaches: number
    students: number
  }): Promise<ApiResponse<any>> {
    try {
      const tenant = JSON.parse(localStorage.getItem('admin_tenants') || '[]')
        .find((t: any) => t.id === tenantId)

      if (!tenant) {
        return {
          success: false,
          error: 'Tenant not found'
        }
      }

      const credentials = []
      const basePassword = `${tenant.domain.split('.')[0]}2024!`

      // Generate system managers
      for (let i = 1; i <= userCounts.systemManagers; i++) {
        credentials.push({
          email: `admin${i}@${tenant.domain}`,
          password: basePassword,
          role: 'SYSTEM_MANAGER',
          firstName: `Admin`,
          lastName: `${i}`
        })
      }

      // Generate branch managers
      for (let i = 1; i <= userCounts.branchManagers; i++) {
        credentials.push({
          email: `manager${i}@${tenant.domain}`,
          password: basePassword,
          role: 'BRANCH_MANAGER',
          firstName: `Manager`,
          lastName: `${i}`
        })
      }

      // Generate coaches
      for (let i = 1; i <= userCounts.coaches; i++) {
        credentials.push({
          email: `coach${i}@${tenant.domain}`,
          password: basePassword,
          role: 'COACH',
          firstName: `Coach`,
          lastName: `${i}`
        })
      }

      // Generate students
      for (let i = 1; i <= userCounts.students; i++) {
        credentials.push({
          email: `student${i}@${tenant.domain}`,
          password: basePassword,
          role: 'STUDENT',
          firstName: `Student`,
          lastName: `${i}`
        })
      }

      return {
        success: true,
        data: {
          tenant,
          credentials,
          totalUsers: credentials.length
        },
        message: `Generated ${credentials.length} user credentials for ${tenant.name}`
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to generate tenant credentials'
      }
    }
  }
}

// Create and export singleton instance
export const adminApiService = new AdminApiService()
export default adminApiService

