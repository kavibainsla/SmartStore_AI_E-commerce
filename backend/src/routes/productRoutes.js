import { Router } from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  checkoutProducts,
} from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/errorHandler.js';
import {
  productValidation,
  productUpdateValidation,
  productIdValidation,
  productQueryValidation,
} from '../utils/validators.js';

const router = Router();

router.use(protect);

router.post('/checkout', checkoutProducts);
router.get('/', validate(productQueryValidation), getProducts);
router.get('/:id', validate(productIdValidation), getProduct);
router.post('/', validate(productValidation), createProduct);
router.put('/:id', validate([...productIdValidation, ...productUpdateValidation]), updateProduct);
router.delete('/:id', validate(productIdValidation), deleteProduct);

export default router;
