import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Button, 
  Input, 
  Select, 
  Option,
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Badge,
  Spinner
} from '@fluentui/react-components';
import { AddRegular, EditRegular, DeleteRegular, ArrowClockwiseRegular } from '@fluentui/react-icons';
import { useUsersList, useDeleteUser } from '../api/users.api';
import { User, UserRoleType } from '../model/user';

export default function UsersList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All Roles');
  
  const { data: users = [], isLoading, error, refetch } = useUsersList();
  const deleteUserMutation = useDeleteUser();

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      try {
        await deleteUserMutation.mutateAsync(userId);
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again.');
      }
    }
  };

  const handleEditUser = (userId: string) => {
    navigate(`/users/${userId}`);
  };

  const handleAddUser = () => {
    navigate('/users/new');
  };

  const handleRefresh = () => {
    refetch();
  };

  // Role-based access control
  const canManageUsers = currentUser?.role === 'System Administrator';
  const canAddUsers = currentUser?.role === 'System Administrator';
  const canEditUsers = currentUser?.role === 'System Administrator';
  const canDeleteUsers = currentUser?.role === 'System Administrator';

  // Filter users based on search term and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All Roles' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // If user doesn't have permission to manage users, show access denied
  if (!canManageUsers) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            You don't have permission to access User Management.
          </p>
          <p className="text-sm text-gray-500">
            Only System Administrators can manage users.
          </p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusColors = {
      active: 'success',
      inactive: 'warning', 
      suspended: 'danger'
    } as const;
    
    return (
      <Badge appearance="filled" color={statusColors[status as keyof typeof statusColors] || 'neutral'}>
        {status}
      </Badge>
    );
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-600">Error loading users: {error.message}</div>
        <Button onClick={handleRefresh} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
        <p className="text-gray-600">Manage user accounts, roles, and permissions</p>
      </div>

      {/* Add User Button */}
      {canAddUsers && (
        <div className="mb-6">
          <Button 
            appearance="primary" 
            icon={<AddRegular />}
            onClick={handleAddUser}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Add User
          </Button>
        </div>
      )}

      {/* User Accounts Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">User Accounts</h2>
        
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search users by name, email"
              value={searchTerm}
              onChange={(_, data) => setSearchTerm(data.value)}
              className="w-full"
            />
          </div>
          
          <div className="w-full sm:w-48">
            <Select
              value={roleFilter}
              onChange={(_, data) => setRoleFilter(data.value || 'All Roles')}
            >
              <Option value="All Roles">All Roles</Option>
              <Option value="System Administrator">System Administrator</Option>
              <Option value="Academy Manager">Academy Manager</Option>
              <Option value="Teacher / Coach">Teacher / Coach</Option>
              <Option value="Student / Fighter">Student / Fighter</Option>
              <Option value="Fight Team Admin">Fight Team Admin</Option>
            </Select>
          </div>
          
          <Button 
            appearance="secondary"
            icon={<ArrowClockwiseRegular />}
            onClick={handleRefresh}
            disabled={isLoading}
          >
            Refresh
          </Button>
        </div>

        {/* Users Table */}
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Spinner size="large" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>Name</TableHeaderCell>
                  <TableHeaderCell>Email</TableHeaderCell>
                  <TableHeaderCell>Role</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Last Login</TableHeaderCell>
                  <TableHeaderCell>Actions</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>{user.lastLogin || 'Never'}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {canEditUsers && (
                            <Button
                              appearance="subtle"
                              icon={<EditRegular />}
                              onClick={() => handleEditUser(user.id)}
                              size="small"
                            >
                              Edit
                            </Button>
                          )}
                          {canDeleteUsers && (
                            <Button
                              appearance="subtle"
                              icon={<DeleteRegular />}
                              onClick={() => handleDeleteUser(user.id, user.name)}
                              size="small"
                              className="text-red-600 hover:text-red-700"
                            >
                              Delete
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
