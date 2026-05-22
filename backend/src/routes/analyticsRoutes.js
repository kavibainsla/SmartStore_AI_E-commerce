import { Router } from 'express';
import {
  getDashboard,
  getTopProducts,
  exportAnalytics,
  createSnapshot,
  getHistory,
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/dashboard', getDashboard);
router.get('/top-products', getTopProducts);
router.get('/export', exportAnalytics);
router.post('/snapshot', createSnapshot);
router.get('/history', getHistory);

export default router;
