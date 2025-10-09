import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import { asyncHandler } from '../middlewares/errorHandler';
import { UserRole } from '../types';

const router = Router();

/**
 * @route GET /api/enrollments
 * @desc Get all enrollments
 * @access Private (Coach, Branch Manager, System Manager)
 */
router.get('/', 
  authenticate, 
  authorize(UserRole.COACH),
  asyncHandler(async (req: any, res: any) => {
    res.json({
      success: true,
      message: 'Enrollment management endpoints - to be implemented'
    });
  })
);

export default router;
