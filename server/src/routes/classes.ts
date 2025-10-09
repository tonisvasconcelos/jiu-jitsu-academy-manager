import { Router } from 'express';
import { ClassRepository } from '../repositories/ClassRepository';
import { authenticate, authorize } from '../middlewares/auth';
import { asyncHandler } from '../middlewares/errorHandler';
import { UserRole } from '../types';

const router = Router();
const classRepository = new ClassRepository();

/**
 * @route GET /api/classes
 * @desc Get all classes
 * @access Private (Coach, Branch Manager, System Manager)
 */
router.get('/', 
  authenticate, 
  authorize(UserRole.COACH),
  asyncHandler(async (req: any, res: any) => {
    const tenantId = req.user!.tenantId;
    const { page = 1, limit = 10 } = req.query;

    const result = await classRepository.findAll(tenantId, {
      page: parseInt(page as string),
      limit: parseInt(limit as string)
    });

    res.json({
      success: true,
      data: result.data,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: result.total,
        totalPages: Math.ceil(result.total / parseInt(limit as string))
      }
    });
  })
);

export default router;
