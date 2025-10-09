import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BulkUserCreation from './BulkUserCreation'

interface Tenant {
  id: string
  name: string
  domain: string
  plan: 'trial' | 'basic' | 'professional' | 'enterprise'
  licenseStart: string
  licenseEnd: string
  isActive: boolean
  contactEmail: string
  contactPhone?: string
  address?: string
  createdAt: string
  userCount: number
}

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'SYSTEM_MANAGER' | 'BRANCH_MANAGER' | 'COACH' | 'STUDENT'
  status: 'active' | 'inactive'
  tenantId: string
  createdAt: string
}

const AdminPortal: React.FC = () => {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [activeTab, setActiveTab] = useState<'tenants' | 'users' | 'analytics'>('tenants')
  
  // Tenant management state
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [showCreateTenant, setShowCreateTenant] = useState(false)
  const [newTenant, setNewTenant] = useState({
    name: '',
    domain: '',
    plan: 'enterprise' as const,
    contactEmail: '',
    contactPhone: '',
    address: '',
    licenseDays: 365
  })

  // User management state
  const [users, setUsers] = useState<User[]>([])
  const [showCreateUser, setShowCreateUser] = useState(false)
  const [showBulkCreate, setShowBulkCreate] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<string>('')
  const [newUser, setNewUser] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'STUDENT' as const,
    password: '',
    confirmPassword: ''
  })

  // Admin authentication
  const handleAdminLogin = () => {
    // Simple admin authentication - in production, use proper auth
    if (adminPassword === 'OSS365Admin2024!') {
      setIsAuthenticated(true)
      loadData()
    } else {
      alert('Invalid admin password')
    }
  }

  const loadData = async () => {
    try {
      // Load tenants from API
      const tenantsResponse = await fetch('https://oss365.app/api/admin/tenants')
      if (tenantsResponse.ok) {
        const tenantsData = await tenantsResponse.json()
        setTenants(tenantsData.data || [])
        console.log('Loaded tenants:', tenantsData.data?.length || 0)
      } else {
        console.error('Failed to load tenants:', tenantsResponse.status)
        alert('Failed to load tenants. Please refresh the page.')
      }

      // Load users from API
      const usersResponse = await fetch('https://oss365.app/api/admin/users')
      if (usersResponse.ok) {
        const usersData = await usersResponse.json()
        setUsers(usersData.data || [])
      } else {
        console.error('Failed to load users:', usersResponse.status)
        alert('Failed to load users. Please refresh the page.')
      }
    } catch (error) {
      console.error('Error loading data:', error)
      alert('Error loading data. Please check your connection and refresh the page.')
    }
  }

  const refreshTenants = async () => {
    try {
      console.log('Refreshing tenant list...')
      const tenantsResponse = await fetch('https://oss365.app/api/admin/tenants')
      if (tenantsResponse.ok) {
        const tenantsData = await tenantsResponse.json()
        setTenants(tenantsData.data || [])
        console.log('Refreshed tenants:', tenantsData.data?.length || 0)
      } else {
        console.error('Failed to refresh tenants:', tenantsResponse.status)
      }
    } catch (error) {
      console.error('Error refreshing tenants:', error)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadData()
    }
  }, [isAuthenticated])

  // Tenant management functions
  const createTenant = async () => {
    if (!newTenant.name || !newTenant.domain || !newTenant.contactEmail) {
      alert('Please fill in all required fields')
      return
    }

    try {
      const response = await fetch('https://oss365.app/api/admin/tenants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTenant)
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Tenant created successfully:', result.data)
        
        // Refresh the tenant list from the API to ensure synchronization
        await refreshTenants()
        
        // Reset form
        setNewTenant({
          name: '',
          domain: '',
          plan: 'enterprise',
          contactEmail: '',
          contactPhone: '',
          address: '',
          licenseDays: 365
        })
        setShowCreateTenant(false)
        
        alert(`Tenant "${result.data.name}" created successfully!`)
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error creating tenant:', error)
      alert('Error creating tenant. Please try again.')
    }
  }

  const toggleTenantStatus = async (tenantId: string) => {
    try {
      const tenant = tenants.find(t => t.id === tenantId)
      if (!tenant) return

      const response = await fetch(`https://oss365.app/api/admin/tenants?id=${tenantId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !tenant.isActive })
      })

      if (response.ok) {
        const result = await response.json()
        const updatedTenants = tenants.map(t => 
          t.id === tenantId ? result.data : t
        )
        setTenants(updatedTenants)
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error updating tenant status:', error)
      alert('Error updating tenant status. Please try again.')
    }
  }

  // User management functions
  const createUser = async () => {
    if (!newUser.email || !newUser.firstName || !newUser.lastName || !newUser.password) {
      alert('Please fill in all required fields')
      return
    }

    if (newUser.password !== newUser.confirmPassword) {
      alert('Passwords do not match')
      return
    }

    if (!selectedTenant) {
      alert('Please select a tenant')
      return
    }

    try {
      console.log('Creating user with tenantId:', selectedTenant);
      console.log('Available tenants:', tenants.map(t => ({ id: t.id, name: t.name })));
      
      const response = await fetch('https://oss365.app/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.role,
          password: newUser.password,
          tenantId: selectedTenant
        })
      })

      if (response.ok) {
        const result = await response.json()
        const updatedUsers = [...users, result.data]
        setUsers(updatedUsers)
        
        // Update tenant user count
        const updatedTenants = tenants.map(tenant => 
          tenant.id === selectedTenant 
            ? { ...tenant, userCount: tenant.userCount + 1 }
            : tenant
        )
        setTenants(updatedTenants)
        
        // Reset form
        setNewUser({
          email: '',
          firstName: '',
          lastName: '',
          role: 'STUDENT',
          password: '',
          confirmPassword: ''
        })
        setShowCreateUser(false)
        
        alert(`User "${result.data.firstName} ${result.data.lastName}" created successfully!`)
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error creating user:', error)
      alert('Error creating user. Please try again.')
    }
  }

  const toggleUserStatus = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId)
      if (!user) return

      const response = await fetch(`https://oss365.app/api/admin/users?id=${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: user.status === 'active' ? 'inactive' : 'active' 
        })
      })

      if (response.ok) {
        const result = await response.json()
        const updatedUsers = users.map(u => 
          u.id === userId ? result.data : u
        )
        setUsers(updatedUsers)
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error updating user status:', error)
      alert('Error updating user status. Please try again.')
    }
  }

  const handleBulkUsersCreated = (newUsers: User[]) => {
    setUsers([...users, ...newUsers])
    loadData() // Reload to get updated tenant user counts
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white">
              OSS365 Admin Portal
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Enter admin password to access
            </p>
          </div>
          <div className="mt-8 space-y-6">
            <div>
              <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-300">
                Admin Password
              </label>
              <input
                id="adminPassword"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter admin password"
                onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
              />
            </div>
            <button
              onClick={handleAdminLogin}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Access Admin Portal
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-white">OSS365 Admin Portal</h1>
              <p className="text-gray-400">Manage tenants and users</p>
            </div>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'tenants', name: 'Tenants', count: tenants.length },
              { id: 'users', name: 'Users', count: users.length },
              { id: 'analytics', name: 'Analytics', count: null }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                {tab.name}
                {tab.count !== null && (
                  <span className="ml-2 bg-gray-700 text-gray-300 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'tenants' && (
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Tenants</h2>
              <button
                onClick={() => setShowCreateTenant(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Create New Tenant
              </button>
            </div>

            {/* Tenants List */}
            <div className="bg-gray-800 shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-700">
                {tenants.map((tenant) => (
                  <li key={tenant.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-white">{tenant.name}</h3>
                          <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            tenant.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {tenant.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="mt-1 text-sm text-gray-400">
                          <p>Domain: {tenant.domain}</p>
                          <p>Plan: {tenant.plan}</p>
                          <p>Users: {tenant.userCount}</p>
                          <p>Contact: {tenant.contactEmail}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleTenantStatus(tenant.id)}
                          className={`px-3 py-1 text-xs font-medium rounded ${
                            tenant.isActive
                              ? 'bg-red-600 hover:bg-red-700 text-white'
                              : 'bg-green-600 hover:bg-green-700 text-white'
                          }`}
                        >
                          {tenant.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Users</h2>
              <div className="flex space-x-3">
                <button
                  onClick={async () => {
                    if (tenants.length === 0) {
                      alert('Please create a tenant first')
                      return
                    }
                    await refreshTenants() // Refresh tenant list before opening bulk user creation form
                    setSelectedTenant(tenants[0].id)
                    setShowBulkCreate(true)
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Bulk Create Users
                </button>
                <button
                  onClick={async () => {
                    await refreshTenants() // Refresh tenant list before opening user creation form
                    setShowCreateUser(true)
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Create New User
                </button>
              </div>
            </div>

            {/* Users List */}
            <div className="bg-gray-800 shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-700">
                {users.map((user) => {
                  const tenant = tenants.find(t => t.id === user.tenantId)
                  return (
                    <li key={user.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h3 className="text-lg font-medium text-white">
                              {user.firstName} {user.lastName}
                            </h3>
                            <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.status}
                            </span>
                          </div>
                          <div className="mt-1 text-sm text-gray-400">
                            <p>Email: {user.email}</p>
                            <p>Role: {user.role}</p>
                            <p>Tenant: {tenant?.name || 'Unknown'}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => toggleUserStatus(user.id)}
                            className={`px-3 py-1 text-xs font-medium rounded ${
                              user.status === 'active'
                                ? 'bg-red-600 hover:bg-red-700 text-white'
                                : 'bg-green-600 hover:bg-green-700 text-white'
                            }`}
                          >
                            {user.status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="px-4 py-6 sm:px-0">
            <h2 className="text-xl font-semibold text-white mb-6">Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-white">Total Tenants</h3>
                <p className="text-3xl font-bold text-blue-400">{tenants.length}</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-white">Total Users</h3>
                <p className="text-3xl font-bold text-green-400">{users.length}</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-white">Active Tenants</h3>
                <p className="text-3xl font-bold text-yellow-400">
                  {tenants.filter(t => t.isActive).length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Tenant Modal */}
      {showCreateTenant && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-white mb-4">Create New Tenant</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">Name *</label>
                  <input
                    type="text"
                    value={newTenant.name}
                    onChange={(e) => setNewTenant({...newTenant, name: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white"
                    placeholder="Academy Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Domain *</label>
                  <input
                    type="text"
                    value={newTenant.domain}
                    onChange={(e) => setNewTenant({...newTenant, domain: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white"
                    placeholder="academy.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Plan</label>
                  <select
                    value={newTenant.plan}
                    onChange={(e) => setNewTenant({...newTenant, plan: e.target.value as any})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white"
                  >
                    <option value="trial">Trial</option>
                    <option value="basic">Basic</option>
                    <option value="professional">Professional</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Contact Email *</label>
                  <input
                    type="email"
                    value={newTenant.contactEmail}
                    onChange={(e) => setNewTenant({...newTenant, contactEmail: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white"
                    placeholder="contact@academy.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Contact Phone</label>
                  <input
                    type="tel"
                    value={newTenant.contactPhone}
                    onChange={(e) => setNewTenant({...newTenant, contactPhone: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white"
                    placeholder="+1 234 567 8900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Address</label>
                  <textarea
                    value={newTenant.address}
                    onChange={(e) => setNewTenant({...newTenant, address: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white"
                    rows={3}
                    placeholder="123 Main St, City, State, Country"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">License Days</label>
                  <input
                    type="number"
                    value={newTenant.licenseDays}
                    onChange={(e) => setNewTenant({...newTenant, licenseDays: parseInt(e.target.value)})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white"
                    min="1"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={async () => {
                    await refreshTenants() // Refresh tenant list when closing form
                    setShowCreateTenant(false)
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={createTenant}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create Tenant
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-white mb-4">Create New User</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">Tenant *</label>
                  <select
                    value={selectedTenant}
                    onChange={(e) => setSelectedTenant(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white"
                  >
                    <option value="">Select Tenant</option>
                    {tenants.map(tenant => (
                      <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Email *</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white"
                    placeholder="user@academy.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">First Name *</label>
                  <input
                    type="text"
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Last Name *</label>
                  <input
                    type="text"
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white"
                    placeholder="Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value as any})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white"
                  >
                    <option value="STUDENT">Student</option>
                    <option value="COACH">Coach</option>
                    <option value="BRANCH_MANAGER">Branch Manager</option>
                    <option value="SYSTEM_MANAGER">System Manager</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Password *</label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white"
                    placeholder="Enter password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Confirm Password *</label>
                  <input
                    type="password"
                    value={newUser.confirmPassword}
                    onChange={(e) => setNewUser({...newUser, confirmPassword: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white"
                    placeholder="Confirm password"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateUser(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={createUser}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk User Creation Modal */}
      {showBulkCreate && (
        <BulkUserCreation
          tenantId={selectedTenant}
          tenantName={tenants.find(t => t.id === selectedTenant)?.name || ''}
          onClose={() => setShowBulkCreate(false)}
          onUsersCreated={handleBulkUsersCreated}
          tenants={tenants}
        />
      )}
    </div>
  )
}

export default AdminPortal
