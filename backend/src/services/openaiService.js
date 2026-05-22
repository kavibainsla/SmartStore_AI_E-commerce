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
  mockAIResponse,
  safeAI,
  getActiveProvider,
  getAIStatus,
} from './aiProviderService.js';
