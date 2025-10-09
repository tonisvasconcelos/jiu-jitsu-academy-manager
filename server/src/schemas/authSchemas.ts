import Joi from 'joi';
import { UserRole } from '../types';

// Common validation patterns
const emailSchema = Joi.string().email().lowercase().trim().required();
const passwordSchema = Joi.string().min(8).max(128).required();
const nameSchema = Joi.string().min(2).max(100).trim().required();
const phoneSchema = Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).optional();
const uuidSchema = Joi.string().uuid().required();
const domainSchema = Joi.string().domain().required();

// Login schema
export const loginSchema = Joi.object({
  email: emailSchema,
  password: Joi.string().required(),
  tenantDomain: domainSchema
});

// Registration schema
export const registerSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: nameSchema,
  lastName: nameSchema,
  phone: phoneSchema,
  role: Joi.string().valid(...Object.values(UserRole)).required(),
  tenantDomain: domainSchema,
  branchId: uuidSchema.optional()
});

// Change password schema
export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: passwordSchema
});

// Reset password schema
export const resetPasswordSchema = Joi.object({
  token: Joi.string().uuid().required(),
  newPassword: passwordSchema
});

// Request password reset schema
export const requestPasswordResetSchema = Joi.object({
  email: emailSchema,
  tenantDomain: domainSchema
});

// Resend verification schema
export const resendVerificationSchema = Joi.object({
  email: emailSchema,
  tenantDomain: domainSchema
});
