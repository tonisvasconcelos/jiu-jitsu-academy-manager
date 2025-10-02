import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, UserSchema, mockUsers } from '../model/user';

const STORAGE_KEY = 'jiu-jitsu-users';

// Helper functions for localStorage
const getUsersFromStorage = (): User[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const users = JSON.parse(stored);
      console.log('📖 Loaded users from storage:', users.length);
      return users;
    }
    // Initialize with mock data if no stored data
    console.log('📝 Initializing mock users in storage...');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUsers));
    return mockUsers;
  } catch (error) {
    console.error('Error loading users from storage:', error);
    // Fallback: always ensure mock users are available
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUsers));
    return mockUsers;
  }
};

const saveUsersToStorage = (users: User[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users to storage:', error);
  }
};

// API functions
export const fetchUsers = async (): Promise<User[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return getUsersFromStorage();
};

export const createUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const users = getUsersFromStorage();
  const newUser: User = {
    ...userData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  // Validate the new user
  const validatedUser = UserSchema.parse(newUser);
  
  const updatedUsers = [...users, validatedUser];
  saveUsersToStorage(updatedUsers);
  
  return validatedUser;
};

export const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const users = getUsersFromStorage();
  const userIndex = users.findIndex(user => user.id === id);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  const updatedUser = {
    ...users[userIndex],
    ...userData,
    id, // Ensure ID doesn't change
    updatedAt: new Date().toISOString(),
  };
  
  // Validate the updated user
  const validatedUser = UserSchema.parse(updatedUser);
  
  users[userIndex] = validatedUser;
  saveUsersToStorage(users);
  
  return validatedUser;
};

export const deleteUser = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const users = getUsersFromStorage();
  const filteredUsers = users.filter(user => user.id !== id);
  
  if (filteredUsers.length === users.length) {
    throw new Error('User not found');
  }
  
  saveUsersToStorage(filteredUsers);
};

export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
  console.log('🔐 Authenticating user:', email);
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const users = getUsersFromStorage();
  console.log('👥 Available users for authentication:', users.map(u => ({ email: u.email, role: u.role, status: u.status })));
  
  const user = users.find(u => {
    const emailMatch = u.email === email;
    const passwordMatch = u.password === password;
    const statusActive = u.status === 'active';
    console.log(`🔍 User ${u.email}: email=${emailMatch}, password=${passwordMatch}, status=${statusActive}`);
    return emailMatch && passwordMatch && statusActive;
  });
  
  if (user) {
    // Update last login
    const updatedUser = {
      ...user,
      lastLogin: new Date().toLocaleDateString('pt-BR'),
      updatedAt: new Date().toISOString(),
    };
    
    const users = getUsersFromStorage();
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      saveUsersToStorage(users);
    }
    
    return updatedUser;
  }
  
  return null;
};

// React Query hooks
export const useUsersList = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 0, // Always fetch fresh data
    cacheTime: 0, // Don't cache
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useAuthenticateUser = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => 
      authenticateUser(email, password),
  });
};

