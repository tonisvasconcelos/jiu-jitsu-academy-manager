import { Router } from 'express';
import { ClassRepository } from '../repositories/ClassRepository';
import { TenantRepository } from '../repositories/TenantRepository';
import { validateRequest, validateQuery } from '../middlewares/validation';
import { bookingSchema, publicClassesQuerySchema } from '../schemas/publicSchemas';
import { asyncHandler } from '../middlewares/errorHandler';
import db from '../config/database';

const router = Router();
const classRepository = new ClassRepository();
const tenantRepository = new TenantRepository();

/**
 * @route GET /api/public/classes
 * @desc Get public classes for a tenant
 * @access Public
 */
router.get('/classes', validateQuery(publicClassesQuerySchema), asyncHandler(async (req: any, res: any) => {
  const { tenantDomain, branchId } = req.query;

  // Find tenant by domain
  const tenant = await tenantRepository.findByDomain(tenantDomain as string);
  if (!tenant) {
    return res.status(404).json({
      success: false,
      error: 'Tenant not found'
    });
  }

  if (!tenant.is_active) {
    return res.status(403).json({
      success: false,
      error: 'Tenant account is inactive'
    });
  }

  // Get public classes
  const classes = await classRepository.getPublicClasses(tenant.id, branchId as string);

  res.json({
    success: true,
    data: classes,
    message: 'Classes retrieved successfully'
  });
}));

/**
 * @route GET /api/public/classes/:id
 * @desc Get specific public class details
 * @access Public
 */
router.get('/classes/:id', asyncHandler(async (req: any, res: any) => {
  const { id } = req.params;
  const { tenantDomain } = req.query;

  if (!tenantDomain) {
    return res.status(400).json({
      success: false,
      error: 'Tenant domain is required'
    });
  }

  // Find tenant by domain
  const tenant = await tenantRepository.findByDomain(tenantDomain as string);
  if (!tenant) {
    return res.status(404).json({
      success: false,
      error: 'Tenant not found'
    });
  }

  if (!tenant.is_active) {
    return res.status(403).json({
      success: false,
      error: 'Tenant account is inactive'
    });
  }

  // Get class details with branch and coach info
  const classDetails = await db.oneOrNone(`
    SELECT 
      c.*,
      b.name as branch_name,
      b.address as branch_address,
      b.phone as branch_phone,
      u.first_name as coach_first_name,
      u.last_name as coach_last_name
    FROM classes c
    JOIN branches b ON c.branch_id = b.id
    JOIN users u ON c.coach_id = u.id
    WHERE c.id = $1 AND c.tenant_id = $2 AND c.start_time > NOW()
  `, [id, tenant.id]);

  if (!classDetails) {
    return res.status(404).json({
      success: false,
      error: 'Class not found or not available'
    });
  }

  res.json({
    success: true,
    data: classDetails,
    message: 'Class details retrieved successfully'
  });
}));

/**
 * @route POST /api/public/bookings
 * @desc Create a new booking request
 * @access Public
 */
router.post('/bookings', validateRequest(bookingSchema), asyncHandler(async (req: any, res: any) => {
  const { 
    firstName, 
    lastName, 
    email, 
    phone, 
    classId, 
    branchId, 
    tenantDomain,
    notes,
    preferredContactMethod 
  } = req.body;

  // Find tenant by domain
  const tenant = await tenantRepository.findByDomain(tenantDomain);
  if (!tenant) {
    return res.status(404).json({
      success: false,
      error: 'Tenant not found'
    });
  }

  if (!tenant.is_active) {
    return res.status(403).json({
      success: false,
      error: 'Tenant account is inactive'
    });
  }

  // Verify class exists and is available
  const classDetails = await classRepository.findById(classId, tenant.id);
  if (!classDetails) {
    return res.status(404).json({
      success: false,
      error: 'Class not found'
    });
  }

  if (classDetails.start_time <= new Date()) {
    return res.status(400).json({
      success: false,
      error: 'Cannot book past classes'
    });
  }

  if (classDetails.current_enrollment >= classDetails.max_capacity) {
    return res.status(400).json({
      success: false,
      error: 'Class is full'
    });
  }

  // Check if booking already exists for this email and class
  const existingBooking = await db.oneOrNone(`
    SELECT id FROM bookings 
    WHERE email = $1 AND class_id = $2 AND tenant_id = $3 AND status != 'cancelled'
  `, [email, classId, tenant.id]);

  if (existingBooking) {
    return res.status(400).json({
      success: false,
      error: 'You already have a booking for this class'
    });
  }

  // Create booking
  const booking = await db.one(`
    INSERT INTO bookings (
      tenant_id, first_name, last_name, email, phone, 
      class_id, branch_id, notes, preferred_contact_method, status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending')
    RETURNING *
  `, [
    tenant.id, firstName, lastName, email, phone,
    classId, branchId, notes, preferredContactMethod
  ]);

  // TODO: Send notification email to branch manager/coach
  // TODO: Send confirmation email to customer

  res.status(201).json({
    success: true,
    data: booking,
    message: 'Booking request submitted successfully. You will be contacted soon.'
  });
}));

/**
 * @route GET /api/public/branches
 * @desc Get public branches for a tenant
 * @access Public
 */
router.get('/branches', asyncHandler(async (req: any, res: any) => {
  const { tenantDomain } = req.query;

  if (!tenantDomain) {
    return res.status(400).json({
      success: false,
      error: 'Tenant domain is required'
    });
  }

  // Find tenant by domain
  const tenant = await tenantRepository.findByDomain(tenantDomain as string);
  if (!tenant) {
    return res.status(404).json({
      success: false,
      error: 'Tenant not found'
    });
  }

  if (!tenant.is_active) {
    return res.status(403).json({
      success: false,
      error: 'Tenant account is inactive'
    });
  }

  // Get public branch information
  const branches = await db.any(`
    SELECT 
      id, name, address, city, state, country, postal_code,
      phone, email, capacity, facilities, coordinates
    FROM branches 
    WHERE tenant_id = $1 AND is_active = true
    ORDER BY name
  `, [tenant.id]);

  res.json({
    success: true,
    data: branches,
    message: 'Branches retrieved successfully'
  });
}));

/**
 * @route GET /api/public/tenant-info
 * @desc Get public tenant information
 * @access Public
 */
router.get('/tenant-info', asyncHandler(async (req: any, res: any) => {
  const { tenantDomain } = req.query;

  if (!tenantDomain) {
    return res.status(400).json({
      success: false,
      error: 'Tenant domain is required'
    });
  }

  // Find tenant by domain
  const tenant = await tenantRepository.findByDomain(tenantDomain as string);
  if (!tenant) {
    return res.status(404).json({
      success: false,
      error: 'Tenant not found'
    });
  }

  if (!tenant.is_active) {
    return res.status(403).json({
      success: false,
      error: 'Tenant account is inactive'
    });
  }

  // Return public tenant information
  const publicInfo = {
    id: tenant.id,
    name: tenant.name,
    contactEmail: tenant.contact_email,
    contactPhone: tenant.contact_phone,
    address: tenant.address,
    logoUrl: tenant.logo_url,
    settings: tenant.settings
  };

  res.json({
    success: true,
    data: publicInfo,
    message: 'Tenant information retrieved successfully'
  });
}));

export default router;
