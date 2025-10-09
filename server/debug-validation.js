#!/usr/bin/env node

const Joi = require('joi');

// Test the validation schema
const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().required(),
  tenantDomain: Joi.string().domain().required()
});

const testData = {
  email: 'admin@demo-jiu-jitsu.com',
  password: 'password123',
  tenantDomain: 'demo.jiu-jitsu.com'
};

console.log('🧪 Testing validation schema...');
console.log('Test data:', testData);

const { error, value } = loginSchema.validate(testData, {
  abortEarly: false,
  stripUnknown: true,
  allowUnknown: false
});

if (error) {
  console.log('❌ Validation failed:');
  console.log('Error details:', error.details);
} else {
  console.log('✅ Validation passed:');
  console.log('Validated data:', value);
}
