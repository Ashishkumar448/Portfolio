import { Request, Response, NextFunction } from 'express';
import { validationResult, body, param, query } from 'express-validator';
import { AppError } from '../utils/AppError';
import DOMPurify from 'isomorphic-dompurify';
import validator from 'validator';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return next(new AppError(errorMessages.join(', '), 400));
  }
  next();
};

// Auth validations
export const validateRegister = [
  body('email')
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail()
    .isLength({ max: 254 }).withMessage('Email too long'),
  body('password')
    .isLength({ min: 8, max: 128 }).withMessage('Password must be 8-128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).withMessage('Password must contain uppercase, lowercase, number and special character'),
  body('name')
    .trim()
    .escape()
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Name can only contain letters and spaces'),
  handleValidationErrors,
];

export const validateLogin = [
  body('email')
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail()
    .isLength({ max: 254 }).withMessage('Email too long'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ max: 128 }).withMessage('Password too long'),
  handleValidationErrors,
];

// Project validations
export const validateProject = [
  body('title')
    .trim()
    .escape()
    .isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters')
    .matches(/^[a-zA-Z0-9\s\-_\.]+$/).withMessage('Title contains invalid characters'),
  body('description')
    .trim()
    .customSanitizer(value => DOMPurify.sanitize(value))
    .isLength({ min: 10, max: 5000 }).withMessage('Description must be 10-5000 characters'),
  body('shortDescription')
    .trim()
    .escape()
    .isLength({ min: 10, max: 200 }).withMessage('Short description must be 10-200 characters'),
  body('technologies')
    .isArray({ min: 1, max: 20 }).withMessage('1-20 technologies required')
    .custom((technologies) => {
      return technologies.every((tech: string) => 
        typeof tech === 'string' && 
        tech.length >= 1 && 
        tech.length <= 30 &&
        /^[a-zA-Z0-9\s\-_\.\+#]+$/.test(tech)
      );
    }).withMessage('Invalid technology format'),
  body('category').isIn(['web', 'mobile', 'desktop', 'api', 'other']).withMessage('Invalid category'),
  body('liveUrl')
    .optional({ checkFalsy: true })
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .isLength({ max: 500 }).withMessage('Live URL must be valid and under 500 characters'),
  body('githubUrl')
    .optional({ checkFalsy: true })
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .isLength({ max: 500 })
    .custom(value => !value || value.includes('github.com')).withMessage('Must be a valid GitHub URL'),
  body('featured').optional().isBoolean().withMessage('Featured must be boolean'),
  body('status').optional().isIn(['draft', 'published']).withMessage('Invalid status'),
  handleValidationErrors,
];

// Blog validations
export const validateBlog = [
  body('title')
    .trim()
    .escape()
    .isLength({ min: 5, max: 150 }).withMessage('Title must be 5-150 characters')
    .matches(/^[a-zA-Z0-9\s\-_\.\?\!\:]+$/).withMessage('Title contains invalid characters'),
  body('content')
    .trim()
    .customSanitizer(value => DOMPurify.sanitize(value, { 
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'code', 'pre'],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class']
    }))
    .isLength({ min: 100, max: 50000 }).withMessage('Content must be 100-50000 characters'),
  body('excerpt')
    .trim()
    .escape()
    .isLength({ min: 10, max: 300 }).withMessage('Excerpt must be 10-300 characters'),
  body('category').isIn(['technology', 'tutorial', 'personal', 'news', 'other']).withMessage('Invalid category'),
  body('tags')
    .optional()
    .isArray({ max: 10 }).withMessage('Maximum 10 tags allowed')
    .custom((tags) => {
      if (!Array.isArray(tags)) return true;
      return tags.every((tag: string) => 
        typeof tag === 'string' && 
        tag.length >= 2 && 
        tag.length <= 30 &&
        /^[a-zA-Z0-9\-_]+$/.test(tag)
      );
    }).withMessage('Invalid tag format'),
  body('published').optional().isBoolean().withMessage('Published must be boolean'),
  body('seoTitle').optional().trim().escape().isLength({ max: 60 }).withMessage('SEO title max 60 characters'),
  body('seoDescription').optional().trim().escape().isLength({ max: 160 }).withMessage('SEO description max 160 characters'),
  handleValidationErrors,
];

// Skill validations
export const validateSkill = [
  body('name')
    .trim()
    .escape()
    .isLength({ min: 2, max: 50 }).withMessage('Skill name must be 2-50 characters')
    .matches(/^[a-zA-Z0-9\s\-_\.\+#]+$/).withMessage('Invalid skill name format'),
  body('category').isIn(['frontend', 'backend', 'database', 'tools', 'other']).withMessage('Invalid category'),
  body('proficiency').isInt({ min: 1, max: 100 }).withMessage('Proficiency must be between 1-100'),
  body('yearsOfExperience').optional().isFloat({ min: 0, max: 50 }).withMessage('Years of experience must be 0-50'),
  body('description')
    .optional()
    .trim()
    .escape()
    .isLength({ max: 500 }).withMessage('Description max 500 characters'),
  body('featured').optional().isBoolean().withMessage('Featured must be boolean'),
  handleValidationErrors,
];

// Comment validations
export const validateComment = [
  body('content')
    .trim()
    .customSanitizer(value => DOMPurify.sanitize(value, { ALLOWED_TAGS: [] }))
    .isLength({ min: 5, max: 1000 }).withMessage('Comment must be 5-1000 characters')
    .matches(/^[a-zA-Z0-9\s\.,\!\?\-_\(\)\[\]\"\'\/\\]+$/).withMessage('Comment contains invalid characters'),
  body('author.name')
    .trim()
    .escape()
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters')
    .matches(/^[a-zA-Z\s\-\']+$/).withMessage('Name can only contain letters, spaces, hyphens, and apostrophes'),
  body('author.email')
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail()
    .isLength({ max: 254 }).withMessage('Email too long'),
  body('parentComment').optional().isMongoId().withMessage('Invalid parent comment ID'),
  param('blogId').isMongoId().withMessage('Invalid blog ID'),
  handleValidationErrors,
];

// Contact validations
export const validateContact = [
  body('name')
    .trim()
    .escape()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters')
    .matches(/^[a-zA-Z\s\-\']+$/).withMessage('Name can only contain letters, spaces, hyphens, and apostrophes'),
  body('email')
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail()
    .isLength({ max: 254 }).withMessage('Email too long'),
  body('subject')
    .trim()
    .escape()
    .isLength({ min: 5, max: 200 }).withMessage('Subject must be 5-200 characters')
    .matches(/^[a-zA-Z0-9\s\.,\!\?\-_\(\)]+$/).withMessage('Subject contains invalid characters'),
  body('message')
    .trim()
    .customSanitizer(value => DOMPurify.sanitize(value, { ALLOWED_TAGS: [] }))
    .isLength({ min: 10, max: 2000 }).withMessage('Message must be 10-2000 characters')
    .matches(/^[a-zA-Z0-9\s\.,\!\?\-_\(\)\[\]\"\'\/\\\n\r]+$/).withMessage('Message contains invalid characters'),
  handleValidationErrors,
];

// Pagination validations
export const validatePagination = [
  query('page').optional().isInt({ min: 1, max: 1000 }).withMessage('Page must be 1-1000'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
  query('sort')
    .optional()
    .isString()
    .isLength({ max: 50 })
    .matches(/^[a-zA-Z_-]+$/).withMessage('Invalid sort parameter'),
  query('search')
    .optional()
    .trim()
    .escape()
    .isLength({ min: 1, max: 100 }).withMessage('Search must be 1-100 characters'),
  query('category')
    .optional()
    .trim()
    .escape()
    .isLength({ max: 50 })
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Invalid category format'),
  handleValidationErrors,
];

// MongoDB ID validation
export const validateMongoId = (field: string = 'id') => [
  param(field).isMongoId().withMessage(`Invalid ${field}`),
  handleValidationErrors,
];