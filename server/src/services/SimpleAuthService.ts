import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/sqlite-database';
import { UserRole, UserStatus, LicensePlan } from '../types';

export interface LoginCredentials {
  domain: string;
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
    tenantId: string;
    firstName: string;
    lastName: string;
  };
}

export class SimpleAuthService {
  /**
   * Authenticate user login
   */
  async login(credentials: LoginCredentials): Promise<AuthResult> {
    const { domain, email, password } = credentials;

    // Find tenant by domain
    const tenantResult = await query(
      'SELECT * FROM tenants WHERE domain = ? AND is_active = 1',
      [domain]
    );
    
    if (tenantResult.rows.length === 0) {
      throw new Error('Invalid tenant domain');
    }

    const tenant = tenantResult.rows[0];

    // Check if license is still valid
    if (tenant.license_end && new Date(tenant.license_end) < new Date()) {
      throw new Error('Tenant license has expired');
    }

    // Find user by email within tenant
    const userResult = await query(
      'SELECT * FROM users WHERE email = ? AND tenant_id = ? AND status = ?',
      [email, tenant.id, 'active']
    );

    if (userResult.rows.length === 0) {
      throw new Error('Invalid credentials');
    }

    const user = userResult.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate simple token (in production, use proper JWT)
    const token = Buffer.from(JSON.stringify({
      userId: user.id,
      tenantId: tenant.id,
      role: user.role,
      email: user.email
    })).toString('base64');

    return {
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        tenantId: tenant.id,
        firstName: user.first_name,
        lastName: user.last_name
      }
    };
  }

  /**
   * Register new user (simplified)
   */
  async register(data: {
    domain: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: UserRole;
  }): Promise<AuthResult> {
    const { domain, email, password, firstName, lastName, role = UserRole.STUDENT } = data;

    // Find tenant by domain
    const tenantResult = await query(
      'SELECT * FROM tenants WHERE domain = ? AND is_active = 1',
      [domain]
    );
    
    if (tenantResult.rows.length === 0) {
      throw new Error('Invalid tenant domain');
    }

    const tenant = tenantResult.rows[0];

    // Check if user already exists
    const existingUserResult = await query(
      'SELECT * FROM users WHERE email = ? AND tenant_id = ?',
      [email, tenant.id]
    );

    if (existingUserResult.rows.length > 0) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const userId = uuidv4();
    await query(
      `INSERT INTO users (
        id, tenant_id, email, password_hash, first_name, last_name,
        role, status, email_verified
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, tenant.id, email, passwordHash, firstName, lastName, role, 'active', 1]
    );

    // Generate token
    const token = Buffer.from(JSON.stringify({
      userId,
      tenantId: tenant.id,
      role,
      email
    })).toString('base64');

    return {
      success: true,
      token,
      user: {
        id: userId,
        email,
        role,
        tenantId: tenant.id,
        firstName,
        lastName
      }
    };
  }
}
