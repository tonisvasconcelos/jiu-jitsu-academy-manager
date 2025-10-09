import React, { useState } from 'react'

interface BulkUserCreationProps {
  tenantId: string
  tenantName: string
  onClose: () => void
  onUsersCreated: (users: any[]) => void
  tenants?: Array<{ id: string; name: string }>
}

const BulkUserCreation: React.FC<BulkUserCreationProps> = ({
  tenantId,
  tenantName,
  onClose,
  onUsersCreated,
  tenants = []
}) => {
  const [userCounts, setUserCounts] = useState({
    systemManagers: 1,
    branchManagers: 3,
    coaches: 10,
    students: 20
  })

  const [basePassword, setBasePassword] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [selectedTenantId, setSelectedTenantId] = useState(tenantId)
  const [selectedTenantName, setSelectedTenantName] = useState(tenantName)

  const generatePassword = () => {
    const domainPrefix = selectedTenantName.toLowerCase().replace(/\s+/g, '')
    const generatedPassword = `${domainPrefix}2024!`
    setBasePassword(generatedPassword)
  }

  const handleTenantChange = (tenantId: string) => {
    const tenant = tenants.find(t => t.id === tenantId)
    if (tenant) {
      setSelectedTenantId(tenantId)
      setSelectedTenantName(tenant.name)
    }
  }

  const createBulkUsers = async () => {
    if (!basePassword) {
      alert('Please generate or enter a base password')
      return
    }

    setIsCreating(true)

    try {
      const users = []
      const domain = selectedTenantName.toLowerCase().replace(/\s+/g, '') + '.com'

      // Create system managers
      for (let i = 1; i <= userCounts.systemManagers; i++) {
        users.push({
          email: `admin${i}@${domain}`,
          firstName: 'System',
          lastName: `Manager ${i}`,
          role: 'SYSTEM_MANAGER',
          password: basePassword,
          tenantId: selectedTenantId
        })
      }

      // Create branch managers
      for (let i = 1; i <= userCounts.branchManagers; i++) {
        users.push({
          email: `manager${i}@${domain}`,
          firstName: 'Branch',
          lastName: `Manager ${i}`,
          role: 'BRANCH_MANAGER',
          password: basePassword,
          tenantId: selectedTenantId
        })
      }

      // Create coaches
      for (let i = 1; i <= userCounts.coaches; i++) {
        users.push({
          email: `coach${i}@${domain}`,
          firstName: 'Coach',
          lastName: `${i}`,
          role: 'COACH',
          password: basePassword,
          tenantId: selectedTenantId
        })
      }

      // Create students
      for (let i = 1; i <= userCounts.students; i++) {
        users.push({
          email: `student${i}@${domain}`,
          firstName: 'Student',
          lastName: `${i}`,
          role: 'STUDENT',
          password: basePassword,
          tenantId: selectedTenantId
        })
      }

      // Create users via API
      const response = await fetch('https://oss365.app/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          users: users,
          tenantId: selectedTenantId
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create users')
      }

      const result = await response.json()
      const newUsers = result.data.created || []

      onUsersCreated(newUsers)
      alert(`Successfully created ${users.length} users for ${selectedTenantName}!`)
      onClose()
    } catch (error) {
      console.error('Error creating bulk users:', error)
      alert('Error creating users. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  const totalUsers = userCounts.systemManagers + userCounts.branchManagers + 
                    userCounts.coaches + userCounts.students

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-gray-800">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-medium text-white">
              Bulk User Creation - {tenantName}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Tenant Selection */}
            {tenants.length > 1 && (
              <div className="bg-gray-700 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-4">Select Tenant</h4>
                <select
                  value={selectedTenantId}
                  onChange={(e) => handleTenantChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-600 text-white"
                >
                  {tenants.map(tenant => (
                    <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* User Count Configuration */}
            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-white mb-4">User Count Configuration</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    System Managers
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={userCounts.systemManagers}
                    onChange={(e) => setUserCounts({
                      ...userCounts,
                      systemManagers: parseInt(e.target.value) || 0
                    })}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-600 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Branch Managers
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={userCounts.branchManagers}
                    onChange={(e) => setUserCounts({
                      ...userCounts,
                      branchManagers: parseInt(e.target.value) || 0
                    })}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-600 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Coaches
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={userCounts.coaches}
                    onChange={(e) => setUserCounts({
                      ...userCounts,
                      coaches: parseInt(e.target.value) || 0
                    })}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-600 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Students
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={userCounts.students}
                    onChange={(e) => setUserCounts({
                      ...userCounts,
                      students: parseInt(e.target.value) || 0
                    })}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-600 text-white"
                  />
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-900 bg-opacity-50 rounded-md">
                <p className="text-blue-200 text-sm">
                  <strong>Total Users to Create:</strong> {totalUsers}
                </p>
              </div>
            </div>

            {/* Password Configuration */}
            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-white mb-4">Password Configuration</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Base Password
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={basePassword}
                      onChange={(e) => setBasePassword(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-600 text-white"
                      placeholder="Enter base password or generate one"
                    />
                    <button
                      onClick={generatePassword}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Generate
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  <p>All users will use this password. In production, consider using unique passwords or implementing a password reset flow.</p>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-white mb-4">Preview</h4>
              <div className="space-y-2 text-sm">
                <div className="text-gray-300">
                  <strong>Tenant:</strong> {selectedTenantName}
                </div>
                <div className="text-gray-300">
                  <strong>Domain:</strong> {selectedTenantName.toLowerCase().replace(/\s+/g, '')}.com
                </div>
                <div className="text-gray-300">
                  <strong>Email Pattern:</strong> role{'{number}'}@{selectedTenantName.toLowerCase().replace(/\s+/g, '')}.com
                </div>
                <div className="text-gray-300">
                  <strong>Password:</strong> {basePassword || 'Not set'}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                disabled={isCreating}
              >
                Cancel
              </button>
              <button
                onClick={createBulkUsers}
                disabled={isCreating || totalUsers === 0 || !basePassword}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
              >
                {isCreating ? 'Creating...' : `Create ${totalUsers} Users`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BulkUserCreation
