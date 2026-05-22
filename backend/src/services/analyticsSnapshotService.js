import Analytics from '../models/Analytics.js';
import { buildDashboardAnalytics } from './analyticsService.js';

/**
 * Persists dashboard snapshot to analytics collection for historical tracking
 */
export const saveAnalyticsSnapshot = async (userId) => {
  const dashboard = await buildDashboardAnalytics(userId);

  const snapshot = await Analytics.create({
    userId,
    snapshotDate: new Date(),
    totalRevenue: dashboard.totalRevenue,
    totalSales: dashboard.totalSales,
    totalProducts: dashboard.totalProducts,
    totalOrders: dashboard.totalOrders,
    monthlyData: dashboard.monthlyData,
    categoryBreakdown: dashboard.categoryBreakdown,
    topProducts: dashboard.topProducts.map((p) => ({
      productId: p._id,
      name: p.name,
      sales: p.sales,
      revenue: p.revenue,
    })),
  });

  return snapshot;
};

export const getAnalyticsHistory = async (userId, limit = 10) => {
  return Analytics.find({ userId }).sort({ createdAt: -1 }).limit(limit).lean();
};
