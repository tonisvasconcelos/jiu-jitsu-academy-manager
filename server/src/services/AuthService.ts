import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { UserRepository } from '../repositories/UserRepository';
import { TenantRepository } from '../repositories/TenantRepository';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { User, UserRole, UserStatus, Tenant } from '../types';
import db from '../config/database';

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
  user: Omit<User, 'password_hash'>;
  tenant: Tenant;
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  private userRepository: UserRepository;
  private tenantRepository: TenantRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.tenantRepository = new TenantRepository();
  }

  /**
   * Authenticate user login
   */
  async login(credentials: LoginCredentials): Promise<AuthResult> {
    const { email, password, tenantDomain } = credentials;

    // Find tenant by domain
    const tenant = await this.tenantRepository.findByDomain(tenantDomain);
    if (!tenant) {
      throw new Error('Invalid tenant domain');
    }

    if (!tenant.is_active) {
      throw new Error('Tenant account is inactive');
    }

    // Check if license is still valid
    if (tenant.license_end < new Date()) {
      throw new Error('Tenant license has expired');
    }

    // Find user by email within tenant
    const user = await this.userRepository.findByEmail(email, tenant.id);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Check user status
    if (user.status === UserStatus.SUSPENDED) {
      throw new Error('Account is suspended');
    }

    if (user.status === UserStatus.INACTIVE) {
      throw new Error('Account is inactive');
    }

    // Update last login
    await this.userRepository.updateLastLogin(user.id, tenant.id);

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      tenantId: tenant.id,
      role: user.role,
      email: user.email
    });

    const refreshToken = generateRefreshToken(user.id, tenant.id);

    // Return user without password hash
    const { password_hash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      tenant,
      accessToken,
      refreshToken
    };
  }

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<AuthResult> {
    const { email, password, firstName, lastName, phone, role, tenantDomain, branchId } = data;

    // Find tenant by domain
    const tenant = await this.tenantRepository.findByDomain(tenantDomain);
    if (!tenant) {
      throw new Error('Invalid tenant domain');
    }

    if (!tenant.is_active) {
      throw new Error('Tenant account is inactive');
    }

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email, tenant.id);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const userData: Omit<User, 'id' | 'created_at' | 'updated_at'> = {
      tenant_id: tenant.id,
      email,
      password_hash: passwordHash,
      first_name: firstName,
      last_name: lastName,
      phone,
      role,
      status: UserStatus.PENDING, // Requires email verification
      branch_id: branchId,
      email_verified: false,
      email_verification_token: uuidv4()
    };

    const user = await this.userRepository.create(userData);

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      tenantId: tenant.id,
      role: user.role,
      email: user.email
    });

    const refreshToken = generateRefreshToken(user.id, tenant.id);

    // Return user without password hash
    const { password_hash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      tenant,
      accessToken,
      refreshToken
    };
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    // Verify refresh token
    const { verifyRefreshToken } = await import('../utils/jwt');
    const { userId, tenantId } = verifyRefreshToken(refreshToken);

    // Find user
    const user = await this.userRepository.findById(userId, tenantId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check user status
    if (user.status === UserStatus.SUSPENDED || user.status === UserStatus.INACTIVE) {
      throw new Error('Account is suspended or inactive');
    }

    // Generate new tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      tenantId: user.tenant_id,
      role: user.role,
      email: user.email
    });

    const newRefreshToken = generateRefreshToken(user.id, user.tenant_id);

    return {
      accessToken,
      refreshToken: newRefreshToken
    };
  }

  /**
   * Change password
   */
  async changePassword(
    userId: string,
    tenantId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    // Find user
    const user = await this.userRepository.findById(userId, tenantId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await this.userRepository.updatePassword(userId, tenantId, newPasswordHash);
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string, tenantDomain: string): Promise<void> {
    // Find tenant
    const tenant = await this.tenantRepository.findByDomain(tenantDomain);
    if (!tenant) {
      throw new Error('Invalid tenant domain');
    }

    // Find user
    const user = await this.userRepository.findByEmail(email, tenant.id);
    if (!user) {
      // Don't reveal if user exists or not
      return;
    }

    // Generate reset token
    const resetToken = uuidv4();
    const expires = new Date(Date.now() + 3600000); // 1 hour

    // Set reset token
    await this.userRepository.setPasswordResetToken(user.id, tenant.id, resetToken, expires);

    // TODO: Send email with reset link
    console.log(`Password reset token for ${email}: ${resetToken}`);
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    // Find user by reset token
    const user = await this.userRepository.findByPasswordResetToken(token);
    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    // Hash new password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password and clear reset token
    await this.userRepository.updatePassword(user.id, user.tenant_id, newPasswordHash);
  }

  /**
   * Verify email address
   */
  async verifyEmail(token: string): Promise<void> {
    // Find user by verification token
    const user = await this.userRepository.findByEmailVerificationToken(token);

    if (!user) {
      throw new Error('Invalid verification token');
    }

    // Verify email
    await this.userRepository.verifyEmail(user.id, user.tenant_id);

    // Activate user if they were pending
    if (user.status === UserStatus.PENDING) {
      await this.userRepository.updateStatus(user.id, user.tenant_id, UserStatus.ACTIVE);
    }
  }

  /**
   * Resend email verification
   */
  async resendEmailVerification(email: string, tenantDomain: string): Promise<void> {
    // Find tenant
    const tenant = await this.tenantRepository.findByDomain(tenantDomain);
    if (!tenant) {
      throw new Error('Invalid tenant domain');
    }

    // Find user
    const user = await this.userRepository.findByEmail(email, tenant.id);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.email_verified) {
      throw new Error('Email is already verified');
    }

    // Generate new verification token
    const verificationToken = uuidv4();
    await this.userRepository.setEmailVerificationToken(user.id, tenant.id, verificationToken);

    // TODO: Send verification email
    console.log(`Email verification token for ${email}: ${verificationToken}`);
  }
}
