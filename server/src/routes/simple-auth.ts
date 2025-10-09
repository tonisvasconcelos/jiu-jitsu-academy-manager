import { Router } from 'express';
import { SimpleAuthService } from '../services/SimpleAuthService';

const router = Router();
const authService = new SimpleAuthService();

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 */
router.post('/login', async (req, res, next) => {
  try {
    const { domain, email, password } = req.body;
    
    if (!domain || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Domain, email, and password are required'
      });
    }

    const result = await authService.login({
      domain,
      email,
      password
    });

    return res.json(result);
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      error: error.message || 'Login failed'
    });
  }
});

/**
 * @route POST /api/auth/register
 * @desc Register new user
 * @access Public
 */
router.post('/register', async (req, res, next) => {
  try {
    const { domain, email, password, firstName, lastName, role } = req.body;
    
    if (!domain || !email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        error: 'Domain, email, password, firstName, and lastName are required'
      });
    }

    const result = await authService.register({
      domain,
      email,
      password,
      firstName,
      lastName,
      role
    });

    return res.status(201).json(result);
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message || 'Registration failed'
    });
  }
});

export default router;
