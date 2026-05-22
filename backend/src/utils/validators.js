import { body, param, query } from 'express-validator';

export const signupValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const productValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
  body('stock').isInt({ min: 0 }).withMessage('Valid stock is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('description').optional().trim(),
  body('image').optional().trim(),
  body('tags').optional().isArray(),
  body('sales').optional().isInt({ min: 0 }),
  body('revenue').optional().isFloat({ min: 0 }),
  body('status').optional().isIn(['active', 'inactive']),
];

export const productUpdateValidation = [
  body('name').optional().trim().notEmpty(),
  body('price').optional().isFloat({ min: 0 }),
  body('stock').optional().isInt({ min: 0 }),
  body('category').optional().trim().notEmpty(),
  body('description').optional().trim(),
  body('image').optional().trim(),
  body('tags').optional().isArray(),
  body('sales').optional().isInt({ min: 0 }),
  body('revenue').optional().isFloat({ min: 0 }),
  body('status').optional().isIn(['active', 'inactive']),
];

export const productIdValidation = [param('id').isMongoId().withMessage('Invalid product ID')];

export const productQueryValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('sort').optional().isIn(['name', 'price', 'sales', 'stock', 'createdAt', '-name', '-price', '-sales', '-stock', '-createdAt']),
];
