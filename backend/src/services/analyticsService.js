import Product from '../models/Product.js';
import { config } from '../config/env.js';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const buildDashboardAnalytics = async (userId) => {
  const products = await Product.find({ createdBy: userId }).lean();
  const allProducts = products.length ? products : await Product.find().lean();

  const totalRevenue = allProducts.reduce((sum, p) => sum + (p.revenue || 0), 0);
  const totalSales = allProducts.reduce((sum, p) => sum + (p.sales || 0), 0);
  const totalProducts = allProducts.length;
  const totalOrders = totalSales;
  const threshold = config.lowStockThreshold;

  const lowStockProducts = allProducts.filter((p) => p.stock <= threshold);
  const activeProducts = allProducts.filter((p) => p.status === 'active');

  const topProducts = [...allProducts]
    .sort((a, b) => (b.sales || 0) - (a.sales || 0))
    .slice(0, 5)
    .map((p) => ({
      _id: p._id,
      name: p.name,
      sales: p.sales,
      revenue: p.revenue,
      image: p.image,
      category: p.category,
    }));

  const categoryMap = {};
  allProducts.forEach((p) => {
    if (!categoryMap[p.category]) {
      categoryMap[p.category] = { category: p.category, count: 0, revenue: 0 };
    }
    categoryMap[p.category].count += 1;
    categoryMap[p.category].revenue += p.revenue || 0;
  });
  const categoryBreakdown = Object.values(categoryMap);

  const monthlyData = generateMonthlyAnalytics(allProducts);
  const revenueGrowth = calculateGrowth(monthlyData);

  const inventoryStatus = {
    inStock: allProducts.filter((p) => p.stock > threshold).length,
    lowStock: lowStockProducts.length,
    outOfStock: allProducts.filter((p) => p.stock === 0).length,
    totalUnits: allProducts.reduce((sum, p) => sum + p.stock, 0),
  };

  return {
    totalRevenue,
    totalSales,
    totalProducts,
    totalOrders,
    activeProducts: activeProducts.length,
    lowStockCount: lowStockProducts.length,
    lowStockProducts: lowStockProducts.map((p) => ({
      _id: p._id,
      name: p.name,
      stock: p.stock,
      category: p.category,
      image: p.image,
    })),
    topProducts,
    categoryBreakdown,
    monthlyData,
    revenueGrowth,
    inventoryStatus,
    threshold,
  };
};

function generateMonthlyAnalytics(products) {
  const now = new Date();
  const data = [];

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = MONTHS[d.getMonth()];
    const year = d.getFullYear();
    const factor = 0.7 + Math.random() * 0.6;
    const baseSales = products.reduce((s, p) => s + (p.sales || 0), 0) / 12;
    const baseRevenue = products.reduce((s, p) => s + (p.revenue || 0), 0) / 12;
    data.push({
      month,
      year,
      sales: Math.round(baseSales * factor * (1 + i * 0.05)),
      revenue: Math.round(baseRevenue * factor * (1 + i * 0.05) * 100) / 100,
      orders: Math.round(baseSales * factor * 0.9),
    });
  }
  return data;
}

function calculateGrowth(monthlyData) {
  if (monthlyData.length < 2) return 0;
  const current = monthlyData[monthlyData.length - 1].revenue;
  const previous = monthlyData[monthlyData.length - 2].revenue;
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 10000) / 100;
}

export const getBusinessSummaryForAI = async (userId) => {
  const dashboard = await buildDashboardAnalytics(userId);
  const products = await Product.find(userId ? { createdBy: userId } : {}).lean();

  return {
    summary: {
      totalRevenue: dashboard.totalRevenue,
      totalSales: dashboard.totalSales,
      totalProducts: dashboard.totalProducts,
      lowStockCount: dashboard.lowStockCount,
      revenueGrowth: dashboard.revenueGrowth,
    },
    topProducts: dashboard.topProducts,
    lowStockProducts: dashboard.lowStockProducts,
    categoryBreakdown: dashboard.categoryBreakdown,
    products: products.map((p) => ({
      name: p.name,
      category: p.category,
      price: p.price,
      stock: p.stock,
      sales: p.sales,
      revenue: p.revenue,
      status: p.status,
    })),
  };
};
