"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ClassRepository_1 = require("../repositories/ClassRepository");
const TenantRepository_1 = require("../repositories/TenantRepository");
const validation_1 = require("../middlewares/validation");
const publicSchemas_1 = require("../schemas/publicSchemas");
const errorHandler_1 = require("../middlewares/errorHandler");
const database_1 = __importDefault(require("../config/database"));
const router = (0, express_1.Router)();
const classRepository = new ClassRepository_1.ClassRepository();
const tenantRepository = new TenantRepository_1.TenantRepository();
router.get('/classes', (0, validation_1.validateQuery)(publicSchemas_1.publicClassesQuerySchema), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { tenantDomain, branchId } = req.query;
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
    const classes = await classRepository.getPublicClasses(tenant.id, branchId);
    res.json({
        success: true,
        data: classes,
        message: 'Classes retrieved successfully'
    });
}));
router.get('/classes/:id', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { tenantDomain } = req.query;
    if (!tenantDomain) {
        return res.status(400).json({
            success: false,
            error: 'Tenant domain is required'
        });
    }
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
    const classDetails = await database_1.default.oneOrNone(`
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
router.post('/bookings', (0, validation_1.validateRequest)(publicSchemas_1.bookingSchema), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { firstName, lastName, email, phone, classId, branchId, tenantDomain, notes, preferredContactMethod } = req.body;
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
    const existingBooking = await database_1.default.oneOrNone(`
    SELECT id FROM bookings 
    WHERE email = $1 AND class_id = $2 AND tenant_id = $3 AND status != 'cancelled'
  `, [email, classId, tenant.id]);
    if (existingBooking) {
        return res.status(400).json({
            success: false,
            error: 'You already have a booking for this class'
        });
    }
    const booking = await database_1.default.one(`
    INSERT INTO bookings (
      tenant_id, first_name, last_name, email, phone, 
      class_id, branch_id, notes, preferred_contact_method, status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending')
    RETURNING *
  `, [
        tenant.id, firstName, lastName, email, phone,
        classId, branchId, notes, preferredContactMethod
    ]);
    res.status(201).json({
        success: true,
        data: booking,
        message: 'Booking request submitted successfully. You will be contacted soon.'
    });
}));
router.get('/branches', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { tenantDomain } = req.query;
    if (!tenantDomain) {
        return res.status(400).json({
            success: false,
            error: 'Tenant domain is required'
        });
    }
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
    const branches = await database_1.default.any(`
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
router.get('/tenant-info', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { tenantDomain } = req.query;
    if (!tenantDomain) {
        return res.status(400).json({
            success: false,
            error: 'Tenant domain is required'
        });
    }
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
exports.default = router;
//# sourceMappingURL=public.js.map