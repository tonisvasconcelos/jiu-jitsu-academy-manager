export declare enum UserRole {
    STUDENT = "student",
    COACH = "coach",
    BRANCH_MANAGER = "branch_manager",
    SYSTEM_MANAGER = "system_manager"
}
export declare enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    SUSPENDED = "suspended",
    PENDING = "pending"
}
export declare enum LicensePlan {
    TRIAL = "trial",
    BASIC = "basic",
    PROFESSIONAL = "professional",
    ENTERPRISE = "enterprise"
}
export declare enum ClassStatus {
    SCHEDULED = "scheduled",
    ONGOING = "ongoing",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare enum EnrollmentStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    CANCELLED = "cancelled",
    COMPLETED = "completed"
}
export declare enum CheckInStatus {
    PRESENT = "present",
    ABSENT = "absent",
    LATE = "late",
    EXCUSED = "excused"
}
export interface BaseEntity {
    id: string;
    tenant_id: string;
    created_at: Date;
    updated_at: Date;
}
export interface Tenant extends BaseEntity {
    name: string;
    domain: string;
    plan: LicensePlan;
    license_start: Date;
    license_end: Date;
    is_active: boolean;
    settings: Record<string, any>;
    contact_email: string;
    contact_phone?: string;
    address?: string;
    logo_url?: string;
}
export interface User extends BaseEntity {
    email: string;
    password_hash: string;
    first_name: string;
    last_name: string;
    phone?: string;
    role: UserRole;
    status: UserStatus;
    branch_id?: string;
    avatar_url?: string;
    last_login?: Date;
    email_verified: boolean;
    email_verification_token?: string;
    password_reset_token?: string;
    password_reset_expires?: Date;
}
export interface Branch extends BaseEntity {
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
}
export interface Student extends BaseEntity {
    user_id: string;
    student_id: string;
    birth_date: Date;
    gender: 'male' | 'female' | 'other';
    emergency_contact_name: string;
    emergency_contact_phone: string;
    medical_notes?: string;
    belt_level: string;
    is_kids_student: boolean;
    weight?: number;
    weight_division_id?: string;
    is_active: boolean;
}
export interface Class extends BaseEntity {
    name: string;
    description?: string;
    branch_id: string;
    coach_id: string;
    modality: string;
    start_time: Date;
    end_time: Date;
    max_capacity: number;
    current_enrollment: number;
    status: ClassStatus;
    recurring_pattern?: string;
    price?: number;
    requirements?: string[];
}
export interface Enrollment extends BaseEntity {
    student_id: string;
    class_id: string;
    status: EnrollmentStatus;
    enrolled_at: Date;
    notes?: string;
}
export interface CheckIn extends BaseEntity {
    student_id: string;
    class_id: string;
    check_in_time: Date;
    status: CheckInStatus;
    notes?: string;
}
export interface StudentModality extends BaseEntity {
    student_id: string;
    modality: string;
    belt_level: string;
    start_date: Date;
    end_date?: Date;
    is_active: boolean;
    progress_notes?: string;
}
export interface Booking extends BaseEntity {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    class_id: string;
    branch_id: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    notes?: string;
    preferred_contact_method: 'email' | 'phone';
}
export interface JWTPayload {
    userId: string;
    tenantId: string;
    role: UserRole;
    email: string;
    branchId?: string;
    iat?: number;
    exp?: number;
}
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
export interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export interface FilterParams {
    search?: string;
    status?: string;
    role?: UserRole;
    branch_id?: string;
    date_from?: string;
    date_to?: string;
}
export interface QueryResult<T> {
    rows: T[];
    rowCount: number;
}
export interface AuthenticatedRequest {
    user?: JWTPayload;
    tenantId?: string;
    headers: any;
    params: any;
    body: any;
    query: any;
}
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
export interface EmailTemplate {
    to: string;
    subject: string;
    template: string;
    data: Record<string, any>;
}
export interface Subscription {
    tenant_id: string;
    plan: LicensePlan;
    status: 'active' | 'cancelled' | 'past_due' | 'unpaid';
    current_period_start: Date;
    current_period_end: Date;
    stripe_subscription_id?: string;
    mercado_pago_subscription_id?: string;
    created_at: Date;
    updated_at: Date;
}
//# sourceMappingURL=index.d.ts.map