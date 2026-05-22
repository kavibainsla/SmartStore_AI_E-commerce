import api from './api';

export const aiService = {
  getStatus: () => api.get('/ai/status'),
  generateDescription: (data) => api.post('/ai/generate-description', data),
  generateTags: (data) => api.post('/ai/generate-tags', data),
  generateCaption: (data) => api.post('/ai/generate-caption', data),
  generateAdCopy: (data) => api.post('/ai/generate-ad-copy', data),
  generateSocial: (data) => api.post('/ai/generate-social', data),
  generateFullInfo: (data) => api.post('/ai/generate-full-info', data),
  fetchRealProduct: (query) => api.post('/ai/fetch-real-product', { query }),
  salesInsights: () => api.post('/ai/sales-insights'),
  detectCategory: (data) => api.post('/ai/detect-category', data),
};
