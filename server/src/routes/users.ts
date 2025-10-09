import { Router } from 'express';
import { UserRepository } from '../repositories/UserRepository';
import { authenticate, authorize, validateTenant, validateSelfAccess } from '../middlewares/auth';
import { validateRequest, validateQuery, validateParams } from '../middlewares/validation';
import { userCreateSchema, userUpdateSchema, userQuerySchema, userParamsSchema } from '../schemas/userSchemas';
import { asyncHandler } from '../middlewares/errorHandler';
import { UserRole } from '../types';

const router = Router();
const userRepository = new UserRepository();

/**
 * @route GET /api/users
 * @desc Get all users (with pagination and filtering)
 * @access Private (Coach, Branch Manager, System Manager)
 */
router.get('/', 
  authenticate, 
  authorize(UserRole.COACH), 
  validateQuery(userQuerySchema),
  asyncHandler(async (req: any, res: any) => {
    const tenantId = req.user!.tenantId;
    const { page = 1, limit = 10, search, status, role, branch_id } = req.query;

    const pagination = { page: parseInt(page as string), limit: parseInt(limit as string) };
    const filters = { search, status, role, branch_id };

    const result = await userRepository.findAll(tenantId, pagination, filters);

    res.json({
      success: true,
      data: result.data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / pagination.limit)
      }
    });
  })
);

/**
 * @route GET /api/users/:id
 * @desc Get user by ID
 * @access Private (Self, Coach, Branch Manager, System Manager)
 */
router.get('/:id',
  authenticate,
  validateParams(userParamsSchema),
  validateSelfAccess,
  asyncHandler(async (req: any, res: any) => {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;

    const user = await userRepository.findById(id, tenantId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Remove password hash from response
    const { password_hash, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: userWithoutPassword
    });
  })
);

/**
 * @route POST /api/users
 * @desc Create new user
 * @access Private (Branch Manager, System Manager)
 */
router.post('/',
  authenticate,
  authorize(UserRole.BRANCH_MANAGER),
  validateRequest(userCreateSchema),
  asyncHandler(async (req: any, res: any) => {
    const tenantId = req.user!.tenantId;
    const userData = { ...req.body, tenant_id: tenantId };

    const user = await userRepository.create(userData);

    // Remove password hash from response
    const { password_hash, ...userWithoutPassword } = user;

    res.status(201).json({
      success: true,
      data: userWithoutPassword,
      message: 'User created successfully'
    });
  })
);

/**
 * @route PUT /api/users/:id
 * @desc Update user
 * @access Private (Self, Branch Manager, System Manager)
 */
router.put('/:id',
  authenticate,
  validateParams(userParamsSchema),
  validateRequest(userUpdateSchema),
  validateSelfAccess,
  asyncHandler(async (req: any, res: any) => {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;
    const updateData = req.body;

    const user = await userRepository.update(id, tenantId, updateData);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Remove password hash from response
    const { password_hash, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: userWithoutPassword,
      message: 'User updated successfully'
    });
  })
);

/**
 * @route DELETE /api/users/:id
 * @desc Delete user
 * @access Private (System Manager only)
 */
router.delete('/:id',
  authenticate,
  authorize(UserRole.SYSTEM_MANAGER),
  validateParams(userParamsSchema),
  asyncHandler(async (req: any, res: any) => {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;

    const deleted = await userRepository.delete(id, tenantId);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  })
);

/**
 * @route GET /api/users/stats
 * @desc Get user statistics
 * @access Private (Coach, Branch Manager, System Manager)
 */
router.get('/stats',
  authenticate,
  authorize(UserRole.COACH),
  asyncHandler(async (req: any, res: any) => {
    const tenantId = req.user!.tenantId;

    const stats = await userRepository.getStats(tenantId);

    res.json({
      success: true,
      data: stats
    });
  })
);

/**
 * @route GET /api/users/role/:role
 * @desc Get users by role
 * @access Private (Coach, Branch Manager, System Manager)
 */
router.get('/role/:role',
  authenticate,
  authorize(UserRole.COACH),
  asyncHandler(async (req: any, res: any) => {
    const { role } = req.params;
    const tenantId = req.user!.tenantId;

    if (!Object.values(UserRole).includes(role as UserRole)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid role'
      });
    }

    const users = await userRepository.findByRole(role as UserRole, tenantId);

    // Remove password hashes from response
    const usersWithoutPasswords = users.map(user => {
      const { password_hash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    res.json({
      success: true,
      data: usersWithoutPasswords
    });
  })
);

export default router;
