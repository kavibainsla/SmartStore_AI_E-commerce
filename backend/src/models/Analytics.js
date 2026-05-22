import mongoose from 'mongoose';

const monthlyDataSchema = new mongoose.Schema(
  {
    month: { type: String, required: true },
    year: { type: Number, required: true },
    sales: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    orders: { type: Number, default: 0 },
  },
  { _id: false }
);

const analyticsSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    snapshotDate: { type: Date, default: Date.now },
    totalRevenue: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
    totalProducts: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    monthlyData: [monthlyDataSchema],
    categoryBreakdown: [
      {
        category: String,
        count: Number,
        revenue: Number,
      },
    ],
    topProducts: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        sales: Number,
        revenue: Number,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Analytics', analyticsSchema);
