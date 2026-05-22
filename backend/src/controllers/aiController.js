import { asyncHandler } from '../utils/asyncHandler.js';
import Product from '../models/Product.js';
import {
  generateProductDescription,
  generateTags,
  generateCaption,
  generateAdCopy,
  generateSocialPromo,
  generateSalesInsights,
  generateFullProductInfo,
  safeAI,
  getAIStatus,
} from '../services/openaiService.js';
import { getBusinessSummaryForAI } from '../services/analyticsService.js';

const wrap = (result, payload) => ({
  success: true,
  data: { ...payload, mock: result.mock, provider: result.provider, error: result.error },
});

export const getAiStatus = asyncHandler(async (_req, res) => {
  res.json({ success: true, data: getAIStatus() });
});

export const generateDescription = asyncHandler(async (req, res) => {
  const { name, category, price, features, productId } = req.body;
  const data = { name, category, price: price || 0, features };

  const result = await safeAI(() => generateProductDescription(data), 'description', data);

  if (productId) {
    await Product.findOneAndUpdate(
      { _id: productId, createdBy: req.user._id },
      { description: result.content }
    );
  }

  res.json(wrap(result, { description: result.content }));
});

export const generateTagsRoute = asyncHandler(async (req, res) => {
  const { name, category, description, productId } = req.body;
  const data = { name, category, description };

  const result = await safeAI(() => generateTags(data), 'tags', data);
  const tags = Array.isArray(result.content) ? result.content : [];

  if (productId) {
    await Product.findOneAndUpdate(
      { _id: productId, createdBy: req.user._id },
      { tags, 'aiContent.seoKeywords': tags }
    );
  }

  res.json(wrap(result, { tags }));
});

export const generateCaptionRoute = asyncHandler(async (req, res) => {
  const { name, category, price, productId } = req.body;
  const data = { name, category, price: price || 0 };

  const result = await safeAI(() => generateCaption(data), 'caption', data);

  if (productId) {
    await Product.findOneAndUpdate(
      { _id: productId, createdBy: req.user._id },
      { 'aiContent.marketingCaption': result.content }
    );
  }

  res.json(wrap(result, { caption: result.content }));
});

export const generateAdCopyRoute = asyncHandler(async (req, res) => {
  const { name, category, price, productId } = req.body;
  const data = { name, category, price: price || 0 };

  const result = await safeAI(() => generateAdCopy(data), 'adCopy', data);

  if (productId) {
    await Product.findOneAndUpdate(
      { _id: productId, createdBy: req.user._id },
      { 'aiContent.adCopy': result.content }
    );
  }

  res.json(wrap(result, { adCopy: result.content }));
});

export const generateSocialRoute = asyncHandler(async (req, res) => {
  const { name, category, price, productId } = req.body;
  const data = { name, category, price: price || 0 };

  const result = await safeAI(() => generateSocialPromo(data), 'socialPromo', data);

  if (productId) {
    await Product.findOneAndUpdate(
      { _id: productId, createdBy: req.user._id },
      { 'aiContent.socialPromo': result.content }
    );
  }

  res.json(wrap(result, { socialPromo: result.content }));
});

export const generateFullInfo = asyncHandler(async (req, res) => {
  const { name, category, price, stock, description, productId } = req.body;
  const data = { name, category, price: price || 0, stock, description };

  const result = await safeAI(() => generateFullProductInfo(data), 'fullInfo', data);
  const info = result.content;

  if (productId && info && typeof info === 'object') {
    await Product.findOneAndUpdate(
      { _id: productId, createdBy: req.user._id },
      {
        description: info.description,
        tags: info.tags,
        aiContent: {
          seoKeywords: info.tags,
          marketingCaption: info.marketingCaption,
          adCopy: info.adCopy,
          socialPromo: info.socialPromo,
          seoTitle: info.seoTitle,
          metaDescription: info.metaDescription,
          keyFeatures: info.keyFeatures,
          targetAudience: info.targetAudience,
          pricingStrategy: info.pricingStrategy,
          fullDetails: info,
        },
      }
    );
  }

  res.json(wrap(result, { fullInfo: info }));
});

export const salesInsights = asyncHandler(async (req, res) => {
  const businessData = await getBusinessSummaryForAI(req.user._id);

  const result = await safeAI(
    () => generateSalesInsights(businessData),
    'insights',
    businessData.summary
  );

  res.json(
    wrap(result, {
      insights: result.content,
      businessData: businessData.summary,
    })
  );
});
