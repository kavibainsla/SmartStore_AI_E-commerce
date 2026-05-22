import { asyncHandler } from '../utils/asyncHandler.js';
import { buildDashboardAnalytics } from '../services/analyticsService.js';
import { saveAnalyticsSnapshot, getAnalyticsHistory } from '../services/analyticsSnapshotService.js';
import Product from '../models/Product.js';

export const getDashboard = asyncHandler(async (req, res) => {
  const data = await buildDashboardAnalytics(req.user._id);
  res.json({ success: true, data });
});

export const getTopProducts = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 5;
  const products = await Product.find({ createdBy: req.user._id })
    .sort({ sales: -1 })
    .limit(limit)
    .select('name sales revenue image category stock price');
  res.json({ success: true, data: products });
});

export const exportAnalytics = asyncHandler(async (req, res) => {
  const data = await buildDashboardAnalytics(req.user._id);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename=smartstore-analytics.json');
  res.json({ success: true, exportedAt: new Date().toISOString(), data });
});

export const createSnapshot = asyncHandler(async (req, res) => {
  const snapshot = await saveAnalyticsSnapshot(req.user._id);
  res.status(201).json({ success: true, data: snapshot });
});

export const getHistory = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const history = await getAnalyticsHistory(req.user._id, limit);
  res.json({ success: true, data: history });
});
