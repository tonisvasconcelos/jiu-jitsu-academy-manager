// API Response interface
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// User roles enum
export enum UserRole {
  STUDENT = 'student',
  COACH = 'coach',
  BRANCH_MANAGER = 'branch_manager',
  SYSTEM_MANAGER = 'system_manager'
}

// User status enum
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending'
}

// License plan enum
export enum LicensePlan {
  TRIAL = 'trial',
  BASIC = 'basic',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise'
}

// Class status enum
export enum ClassStatus {
  SCHEDULED = 'scheduled',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// Enrollment status enum
export enum EnrollmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

// Check-in status enum
export enum CheckInStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late',
  EXCUSED = 'excused'
}

// Base interface for all entities
export interface BaseEntity {
  id: string;
  tenant_id: string;
  created_at: string;
  updated_at: string;
}

// Tenant interface
export interface Tenant {
  id: string;
  name: string;
  domain: string;
  plan: LicensePlan;
  license_start: string;
  license_end: string;
  is_active: boolean;
  settings: Record<string, any>;
  contact_email: string;
  contact_phone?: string;
  address?: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
}

// User interface
export interface User {
  id: string;
  tenant_id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  branch_id?: string;
  avatar_url?: string;
  last_login?: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

// Branch interface
export interface Branch {
  id: string;
  tenant_id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  phone?: string;
  email?: string;
  manager_id: string;
  is_active: boolean;
  capacity: number;
  facilities: string[];
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  created_at: string;
  updated_at: string;
}

// Student interface
export interface Student {
  id: string;
  tenant_id: string;
  user_id: string;
  student_id: string;
  birth_date: string;
  gender: 'male' | 'female' | 'other';
  emergency_contact_name: string;
  emergency_contact_phone: string;
  medical_notes?: string;
  belt_level: string;
  is_kids_student: boolean;
  weight?: number;
  weight_division_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Class interface
export interface Class {
  id: string;
  tenant_id: string;
  name: string;
  description?: string;
  branch_id: string;
  coach_id: string;
  modality: string;
  start_time: string;
  end_time: string;
  max_capacity: number;
  current_enrollment: number;
  status: ClassStatus;
  recurring_pattern?: string;
  price?: number;
  requirements?: string[];
  created_at: string;
  updated_at: string;
}

// Enrollment interface
export interface Enrollment {
  id: string;
  tenant_id: string;
  student_id: string;
  class_id: string;
  status: EnrollmentStatus;
  enrolled_at: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Check-in interface
export interface CheckIn {
  id: string;
  tenant_id: string;
  student_id: string;
  class_id: string;
  check_in_time: string;
  status: CheckInStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Student modality interface
export interface StudentModality {
  id: string;
  tenant_id: string;
  student_id: string;
  modality: string;
  belt_level: string;
  start_date: string;
  end_date?: string;
  is_active: boolean;
  progress_notes?: string;
  created_at: string;
  updated_at: string;
}

// Booking interface (for public bookings)
export interface Booking {
  id: string;
  tenant_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  class_id: string;
  branch_id: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
  preferred_contact_method: 'email' | 'phone';
  created_at: string;
  updated_at: string;
}

// JWT payload interface
export interface JWTPayload {
  userId: string;
  tenantId: string;
  role: UserRole;
  email: string;
  iat?: number;
  exp?: number;
}

// Pagination parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Filter parameters
export interface FilterParams {
  search?: string;
  status?: string;
  role?: UserRole;
  branch_id?: string;
  date_from?: string;
  date_to?: string;
}

// Auth interfaces
export interface LoginCredentials {
  email: string;
  password: string;
  tenantDomain: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  tenantDomain: string;
  branchId?: string;
}

export interface AuthResult {
  user: User;
  tenant: Tenant;
  accessToken: string;
  refreshToken: string;
}

// File upload interface
export interface FileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
}

// Email template interface
export interface EmailTemplate {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

// Subscription interface
export interface Subscription {
  tenant_id: string;
  plan: LicensePlan;
  status: 'active' | 'cancelled' | 'past_due' | 'unpaid';
  current_period_start: string;
  current_period_end: string;
  stripe_subscription_id?: string;
  mercado_pago_subscription_id?: string;
  created_at: string;
  updated_at: string;
}
