import Joi from 'joi';

// Public classes query schema
export const publicClassesQuerySchema = Joi.object({
  tenantDomain: Joi.string().domain().required(),
  branchId: Joi.string().uuid().optional()
});

// Booking schema
export const bookingSchema = Joi.object({
  firstName: Joi.string().min(2).max(100).trim().required(),
  lastName: Joi.string().min(2).max(100).trim().required(),
  email: Joi.string().email().lowercase().trim().required(),
  phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).required(),
  classId: Joi.string().uuid().required(),
  branchId: Joi.string().uuid().required(),
  tenantDomain: Joi.string().domain().required(),
  notes: Joi.string().max(500).optional(),
  preferredContactMethod: Joi.string().valid('email', 'phone').default('email')
});
