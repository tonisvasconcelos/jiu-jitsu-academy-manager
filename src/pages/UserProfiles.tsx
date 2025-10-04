import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

const UserProfiles: React.FC = () => {
  const { t } = useLanguage()
  const [users] = useState([
    {
      id: 'USR001',
      username: 'admin',
      email: 'admin@academy.com',
      role: 'Administrator',
      status: 'active',
      lastLogin: '2024-01-15 10:30:00',
      permissions: ['all']
    },
    {
      id: 'USR002',
      username: 'instructor1',
      email: 'instructor1@academy.com',
      role: 'Instructor',
      status: 'active',
      lastLogin: '2024-01-15 09:15:00',
      permissions: ['students', 'classes', 'checkins']
    },
    {
      id: 'USR003',
      username: 'receptionist1',
      email: 'reception@academy.com',
      role: 'Receptionist',
      status: 'active',
      lastLogin: '2024-01-15 08:45:00',
      permissions: ['students', 'checkins']
    }
  ])

  const roles = [
    { id: 'admin', name: 'Administrator', description: 'Full system access' },
    { id: 'instructor', name: 'Instructor', description: 'Teaching and student management' },
    { id: 'receptionist', name: 'Receptionist', description: 'Student registration and check-ins' },
    { id: 'viewer', name: 'Viewer', description: 'Read-only access' }
  ]

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'administrator': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'instructor': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'receptionist': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'viewer': return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-500/20 text-green-400 border-green-500/30'
      : 'bg-red-500/20 text-red-400 border-red-500/30'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent mb-2 sm:mb-3">
                👤 User Profiles & Roles
              </h1>
              <p className="text-base sm:text-lg text-gray-300">
                Manage user accounts, roles, and permissions
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/admin"
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300 flex items-center justify-center text-sm sm:text-base w-full sm:w-auto"
              >
                ← Back to Admin
              </Link>
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300 flex items-center justify-center text-sm sm:text-base w-full sm:w-auto">
                <span className="mr-2">➕</span>
                Add User
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-white">{users.length}</p>
                <p className="text-xs text-purple-400 mt-1">Active accounts</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Administrators</p>
                <p className="text-3xl font-bold text-white">{users.filter(u => u.role === 'Administrator').length}</p>
                <p className="text-xs text-red-400 mt-1">Full access</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg">
                <span className="text-2xl">👑</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Instructors</p>
                <p className="text-3xl font-bold text-white">{users.filter(u => u.role === 'Instructor').length}</p>
                <p className="text-xs text-blue-400 mt-1">Teaching staff</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <span className="text-2xl">🧑‍🏫</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Active Today</p>
                <p className="text-3xl font-bold text-white">{users.filter(u => u.status === 'active').length}</p>
                <p className="text-xs text-green-400 mt-1">Online users</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                <span className="text-2xl">🟢</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Users List */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">User Accounts</h3>
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <span className="text-purple-400">👥</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="bg-white/5 rounded-xl p-4 border border-white/5 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                        <span className="text-white text-lg font-semibold">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{user.username}</h4>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                        <p className="text-gray-500 text-xs">Last login: {user.lastLogin}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Roles & Permissions */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Roles & Permissions</h3>
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <span className="text-blue-400">🔐</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {roles.map((role) => (
                <div key={role.id} className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-semibold">{role.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(role.name)}`}>
                      {role.name}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{role.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfiles
