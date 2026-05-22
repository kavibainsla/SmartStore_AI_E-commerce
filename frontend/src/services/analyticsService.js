import api from './api';

export const analyticsService = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getTopProducts: (limit = 5) => api.get('/analytics/top-products', { params: { limit } }),
  exportData: () => api.get('/analytics/export'),
  createSnapshot: () => api.post('/analytics/snapshot'),
  getHistory: (limit = 10) => api.get('/analytics/history', { params: { limit } }),
};
