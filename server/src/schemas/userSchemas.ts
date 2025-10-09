import Joi from 'joi';
import { UserRole, UserStatus } from '../types';

// Common validation patterns
const emailSchema = Joi.string().email().lowercase().trim().required();
const passwordSchema = Joi.string().min(8).max(128).required();
const nameSchema = Joi.string().min(2).max(100).trim().required();
const phoneSchema = Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).optional();
const uuidSchema = Joi.string().uuid().required();

// User creation schema
export const userCreateSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema,
  first_name: nameSchema,
  last_name: nameSchema,
  phone: phoneSchema,
  role: Joi.string().valid(...Object.values(UserRole)).required(),
  status: Joi.string().valid(...Object.values(UserStatus)).default(UserStatus.ACTIVE),
  branch_id: uuidSchema.optional(),
  avatar_url: Joi.string().uri().optional()
});

// User update schema
export const userUpdateSchema = Joi.object({
  first_name: nameSchema.optional(),
  last_name: nameSchema.optional(),
  phone: phoneSchema,
  status: Joi.string().valid(...Object.values(UserStatus)).optional(),
  branch_id: uuidSchema.optional(),
  avatar_url: Joi.string().uri().optional()
});

// User query schema
export const userQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().max(100).optional(),
  status: Joi.string().valid(...Object.values(UserStatus)).optional(),
  role: Joi.string().valid(...Object.values(UserRole)).optional(),
  branch_id: uuidSchema.optional(),
  sortBy: Joi.string().valid('first_name', 'last_name', 'email', 'created_at', 'last_login').default('created_at'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc')
});

// User params schema
export const userParamsSchema = Joi.object({
  id: uuidSchema
});
