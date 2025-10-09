import { Router } from 'express';
import { AuthService } from '../services/AuthService';
import { validateRequest } from '../middlewares/validation';
import { loginSchema, registerSchema, changePasswordSchema, resetPasswordSchema } from '../schemas/authSchemas';
import { authenticate } from '../middlewares/auth';
import { AuthenticatedRequest } from '../types';

const router = Router();
const authService = new AuthService();

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 */
router.post('/login', validateRequest(loginSchema), async (req, res, next) => {
  try {
    const { email, password, tenantDomain } = req.body;
    
    const result = await authService.login({
      email,
      password,
      tenantDomain
    });

    res.json({
      success: true,
      data: result,
      message: 'Login successful'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/auth/register
 * @desc Register new user
 * @access Public
 */
router.post('/register', validateRequest(registerSchema), async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone, role, tenantDomain, branchId } = req.body;
    
    const result = await authService.register({
      email,
      password,
      firstName,
      lastName,
      phone,
      role,
      tenantDomain,
      branchId
    });

    res.status(201).json({
      success: true,
      data: result,
      message: 'Registration successful. Please check your email for verification.'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/auth/refresh
 * @desc Refresh access token
 * @access Public
 */
router.post('/refresh', async (req: any, res: any, next: any) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token is required'
      });
    }

    const result = await authService.refreshToken(refreshToken);

    return res.json({
      success: true,
      data: result,
      message: 'Token refreshed successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/auth/change-password
 * @desc Change user password
 * @access Private
 */
router.post('/change-password', authenticate, validateRequest(changePasswordSchema), async (req: AuthenticatedRequest, res: any, next: any) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user!.userId;
    const tenantId = req.user!.tenantId;

    await authService.changePassword(userId, tenantId, currentPassword, newPassword);

    return res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/auth/request-password-reset
 * @desc Request password reset
 * @access Public
 */
router.post('/request-password-reset', async (req: any, res: any, next: any) => {
  try {
    const { email, tenantDomain } = req.body;
    
    if (!email || !tenantDomain) {
      return res.status(400).json({
        success: false,
        error: 'Email and tenant domain are required'
      });
    }

    await authService.requestPasswordReset(email, tenantDomain);

    return res.json({
      success: true,
      message: 'Password reset email sent (if account exists)'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/auth/reset-password
 * @desc Reset password with token
 * @access Public
 */
router.post('/reset-password', validateRequest(resetPasswordSchema), async (req: any, res: any, next: any) => {
  try {
    const { token, newPassword } = req.body;

    await authService.resetPassword(token, newPassword);

    return res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/auth/verify-email/:token
 * @desc Verify email address
 * @access Public
 */
router.get('/verify-email/:token', async (req, res, next) => {
  try {
    const { token } = req.params;

    await authService.verifyEmail(token);

    res.json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/auth/resend-verification
 * @desc Resend email verification
 * @access Public
 */
router.post('/resend-verification', async (req: any, res: any, next: any) => {
  try {
    const { email, tenantDomain } = req.body;
    
    if (!email || !tenantDomain) {
      return res.status(400).json({
        success: false,
        error: 'Email and tenant domain are required'
      });
    }

    await authService.resendEmailVerification(email, tenantDomain);

    return res.json({
      success: true,
      message: 'Verification email sent'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/auth/logout
 * @desc Logout user (client-side token removal)
 * @access Private
 */
router.post('/logout', authenticate, async (req: any, res: any, next: any) => {
  try {
    // In a stateless JWT system, logout is handled client-side
    // by removing the token from storage
    // We could implement a token blacklist here if needed
    
    return res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/auth/me
 * @desc Get current user info
 * @access Private
 */
router.get('/me', authenticate, async (req: AuthenticatedRequest, res: any, next: any) => {
  try {
    const { UserRepository } = await import('../repositories/UserRepository');
    const { TenantRepository } = await import('../repositories/TenantRepository');
    
    const userRepository = new UserRepository();
    const tenantRepository = new TenantRepository();
    
    const userId = req.user!.userId;
    const tenantId = req.user!.tenantId;
    
    const [user, tenant] = await Promise.all([
      userRepository.findById(userId, tenantId),
      tenantRepository.findById(tenantId, tenantId) // Tenant can access itself
    ]);

    if (!user || !tenant) {
      return res.status(404).json({
        success: false,
        error: 'User or tenant not found'
      });
    }

    // Remove password hash from response
    const { password_hash, ...userWithoutPassword } = user;

    return res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        tenant
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
