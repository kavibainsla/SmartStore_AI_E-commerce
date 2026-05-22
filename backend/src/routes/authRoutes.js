import { Router } from 'express';
import { signup, login, getMe, updateSettings, getCustomers } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/errorHandler.js';
import { signupValidation, loginValidation } from '../utils/validators.js';

const router = Router();

router.post('/signup', validate(signupValidation), signup);
router.post('/login', validate(loginValidation), login);
router.get('/me', protect, getMe);
router.put('/settings', protect, updateSettings);
router.get('/customers', protect, getCustomers);

export default router;
