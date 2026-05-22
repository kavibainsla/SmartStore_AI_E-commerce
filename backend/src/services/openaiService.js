/**
 * Re-exports unified AI service (Gemini primary, OpenAI fallback, mock demo)
 */
export {
  generateProductDescription,
  generateTags,
  generateCaption,
  generateAdCopy,
  generateSocialPromo,
  generateSalesInsights,
  generateFullProductInfo,
  fetchRealProductData,
  mockAIResponse,
  safeAI,
  getActiveProvider,
  getAIStatus,
  detectCategory,
} from './aiProviderService.js';
