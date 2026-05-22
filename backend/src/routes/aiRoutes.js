import { Router } from 'express';
import {
  getAiStatus,
  generateDescription,
  generateTagsRoute,
  generateCaptionRoute,
  generateAdCopyRoute,
  generateSocialRoute,
  generateFullInfo,
  salesInsights,
} from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/errorHandler.js';
import { aiProductValidation } from '../utils/aiValidators.js';

const router = Router();

router.use(protect);

router.get('/status', getAiStatus);
router.post('/generate-description', validate(aiProductValidation), generateDescription);
router.post('/generate-tags', validate(aiProductValidation), generateTagsRoute);
router.post('/generate-caption', validate(aiProductValidation), generateCaptionRoute);
router.post('/generate-ad-copy', validate(aiProductValidation), generateAdCopyRoute);
router.post('/generate-social', validate(aiProductValidation), generateSocialRoute);
router.post('/generate-full-info', validate(aiProductValidation), generateFullInfo);
router.post('/sales-insights', salesInsights);

export default router;
