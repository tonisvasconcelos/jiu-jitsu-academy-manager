import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Button, 
  Input, 
  Select, 
  Option,
  Spinner,
  Field
} from '@fluentui/react-components';
import { ArrowLeftRegular, SaveRegular } from '@fluentui/react-icons';
import { UserSchema, UserRole, UserStatus } from '../model/user';
import { useCreateUser, useUpdateUser, useUsersList } from '../api/users.api';
import type { User } from '../model/user';

type UserFormData = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'lastLogin'>;

export default function UserForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  
  const { data: users = [] } = useUsersList();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  
  const existingUser = isEditMode ? users.find(user => user.id === id) : null;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
    setValue
  } = useForm<UserFormData>({
    resolver: zodResolver(UserSchema.omit({ 
      id: true, 
      createdAt: true, 
      updatedAt: true, 
      lastLogin: true 
    })),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'Student / Fighter',
      status: 'active',
    },
  });

  // Load existing user data for editing
  useEffect(() => {
    if (isEditMode && existingUser) {
      reset({
        name: existingUser.name,
        email: existingUser.email,
        password: existingUser.password,
        role: existingUser.role,
        status: existingUser.status,
      });
    }
  }, [isEditMode, existingUser, reset]);

  const onSubmit = async (data: UserFormData) => {
    try {
      if (isEditMode && id) {
        await updateUserMutation.mutateAsync({ id, data });
      } else {
        await createUserMutation.mutateAsync(data);
      }
      
      // Show success message with login credentials for new users
      if (!isEditMode) {
        alert(`User created successfully!\n\nLogin Credentials:\nEmail: ${data.email}\nPassword: ${data.password}`);
      }
      
      navigate('/users');
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Failed to save user. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/users');
  };

  const roleOptions = [
    'System Administrator',
    'Academy Manager',
    'Teacher / Coach',
    'Student / Fighter',
    'Fight Team Admin'
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button
            appearance="subtle"
            icon={<ArrowLeftRegular />}
            onClick={handleCancel}
          >
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? 'Edit User' : 'Add New User'}
          </h1>
        </div>
        <p className="text-gray-600">
          {isEditMode ? 'Update user information and permissions' : 'Create a new user account with role and permissions'}
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border p-6 max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Field */}
          <Field
            label="Full Name"
            required
            error={errors.name?.message}
          >
            <Input
              {...register('name')}
              placeholder="Enter full name"
              className="w-full"
            />
          </Field>

          {/* Email Field */}
          <Field
            label="Email Address"
            required
            error={errors.email?.message}
          >
            <Input
              {...register('email')}
              type="email"
              placeholder="Enter email address"
              className="w-full"
            />
          </Field>

          {/* Password Field */}
          <Field
            label="Password"
            required
            error={errors.password?.message}
            hint={!isEditMode ? "Default password will be 'password123' if left empty" : "Leave empty to keep current password"}
          >
            <Input
              {...register('password')}
              type="password"
              placeholder={isEditMode ? "Enter new password (optional)" : "Enter password"}
              className="w-full"
            />
          </Field>

          {/* Role Field */}
          <Field
            label="Role"
            required
            error={errors.role?.message}
          >
            <Select
              value={watch('role')}
              onChange={(_, data) => setValue('role', data.value as any)}
            >
              {roleOptions.map((role) => (
                <Option key={role} value={role}>
                  {role}
                </Option>
              ))}
            </Select>
          </Field>

          {/* Status Field */}
          <Field
            label="Status"
            required
            error={errors.status?.message}
          >
            <Select
              value={watch('status')}
              onChange={(_, data) => setValue('status', data.value as any)}
            >
              {statusOptions.map((status) => (
                <Option key={status.value} value={status.value}>
                  {status.label}
                </Option>
              ))}
            </Select>
          </Field>

          {/* Form Actions */}
          <div className="flex gap-4 pt-6">
            <Button
              type="submit"
              appearance="primary"
              icon={<SaveRegular />}
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Spinner size="tiny" />
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditMode ? 'Update User' : 'Create User'
              )}
            </Button>
            
            <Button
              type="button"
              appearance="secondary"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

