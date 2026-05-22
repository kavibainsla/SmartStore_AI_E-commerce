import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name is required'], trim: true },
    description: { type: String, default: '' },
    category: { type: String, required: true, trim: true, index: true },
    image: { type: String, default: 'https://placehold.co/400x400?text=Product' },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    tags: [{ type: String, trim: true }],
    sales: { type: Number, default: 0, min: 0 },
    revenue: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    aiContent: {
      seoKeywords: [String],
      marketingCaption: String,
      adCopy: String,
      socialPromo: String,
      seoTitle: String,
      metaDescription: String,
      keyFeatures: [String],
      targetAudience: String,
      pricingStrategy: String,
      fullDetails: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', tags: 'text' });

productSchema.virtual('isLowStock').get(function () {
  const threshold = parseInt(process.env.LOW_STOCK_THRESHOLD, 10) || 10;
  return this.stock <= threshold;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

export default mongoose.model('Product', productSchema);
