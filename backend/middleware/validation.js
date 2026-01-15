// Input validation middleware using Joi
const Joi = require('joi');

// Phone validation schema (legacy)
const phoneSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^\+?[\d\s\-\(\)]+$/)
    .min(6)
    .max(20)
    .required()
    .messages({
      'string.pattern.base': 'Invalid phone number format',
      'string.min': 'Phone number too short',
      'string.max': 'Phone number too long',
      'any.required': 'Phone number is required'
    })
});

// Email validation schema
const emailSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Invalid email address',
      'any.required': 'Email is required'
    })
});

// OTP validation schema (legacy - phone based)
const otpSchema = Joi.object({
  phone: Joi.string().required(),
  otp: Joi.string()
    .pattern(/^\d{6}$/)
    .required()
    .messages({
      'string.pattern.base': 'OTP must be 6 digits',
      'any.required': 'OTP is required'
    })
});

// Email OTP validation schema
const emailOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string()
    .pattern(/^\d{6}$/)
    .required()
    .messages({
      'string.pattern.base': 'OTP must be 6 digits',
      'any.required': 'OTP is required'
    })
});

// Generic validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message
      });
    }
    next();
  };
};

module.exports = {
  validate,
  phoneSchema,
  emailSchema,
  otpSchema,
  emailOtpSchema
};