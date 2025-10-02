import { z } from 'zod';

export const UserRole = z.enum([
  'System Administrator',
  'Academy Manager', 
  'Teacher / Coach',
  'Student / Fighter',
  'Fight Team Admin'
]);

export const UserStatus = z.enum(['active', 'inactive', 'suspended']);

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: UserRole,
  status: UserStatus.default('active'),
  lastLogin: z.string().optional(),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export type User = z.infer<typeof UserSchema>;
export type UserRoleType = z.infer<typeof UserRole>;
export type UserStatusType = z.infer<typeof UserStatus>;

// Mock users data
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Antonio Vasconcelos',
    email: 'tonisvasconcelos@hotmail.com',
    password: 'password123',
    role: 'System Administrator',
    status: 'active',
    lastLogin: '01/10/2025',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'Parioca',
    email: 'parioca@gfteam.com.br',
    password: 'password123',
    role: 'Fight Team Admin',
    status: 'active',
    lastLogin: undefined,
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
  },
  {
    id: '3',
    name: 'Maria Silva',
    email: 'maria@academy.com',
    password: 'password123',
    role: 'Academy Manager',
    status: 'active',
    lastLogin: undefined,
    createdAt: '2024-01-03T00:00:00.000Z',
    updatedAt: '2024-01-03T00:00:00.000Z',
  },
  {
    id: '4',
    name: 'Carlos Mendes',
    email: 'carlos@academy.com',
    password: 'password123',
    role: 'Teacher / Coach',
    status: 'active',
    lastLogin: undefined,
    createdAt: '2024-01-04T00:00:00.000Z',
    updatedAt: '2024-01-04T00:00:00.000Z',
  },
  {
    id: '5',
    name: 'João Santos',
    email: 'joao@academy.com',
    password: 'password123',
    role: 'Student / Fighter',
    status: 'active',
    lastLogin: undefined,
    createdAt: '2024-01-05T00:00:00.000Z',
    updatedAt: '2024-01-05T00:00:00.000Z',
  },
];
