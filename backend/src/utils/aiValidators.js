import { body } from 'express-validator';

export const aiProductValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required for AI generation'),
  body('category').optional().trim(),
  body('price').optional().isFloat({ min: 0 }),
  body('description').optional().trim(),
  body('productId').optional().isMongoId(),
];
