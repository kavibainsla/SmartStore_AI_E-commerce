import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Analytics from '../models/Analytics.js';
import { buildDashboardAnalytics } from '../services/analyticsService.js';

dotenv.config();

const sampleProducts = [
  {
    name: 'Wireless Pro Headphones',
    description: 'Premium noise-cancelling wireless headphones with 40-hour battery life.',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    price: 249.99,
    stock: 45,
    tags: ['audio', 'wireless', 'premium', 'bestseller'],
    sales: 320,
    revenue: 79996.8,
    status: 'active',
  },
  {
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracking with heart rate, GPS, and sleep monitoring.',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    price: 199.99,
    stock: 8,
    tags: ['fitness', 'wearable', 'smart', 'health'],
    sales: 280,
    revenue: 55997.2,
    status: 'active',
  },
  {
    name: 'Organic Cotton T-Shirt',
    description: 'Sustainable, soft organic cotton tee available in multiple colors.',
    category: 'Apparel',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    price: 34.99,
    stock: 120,
    tags: ['organic', 'cotton', 'sustainable', 'casual'],
    sales: 450,
    revenue: 15745.5,
    status: 'active',
  },
  {
    name: 'Leather Messenger Bag',
    description: 'Handcrafted genuine leather bag for professionals on the go.',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
    price: 159.99,
    stock: 5,
    tags: ['leather', 'bag', 'professional', 'luxury'],
    sales: 95,
    revenue: 15199.05,
    status: 'active',
  },
  {
    name: 'Ceramic Coffee Mug Set',
    description: 'Set of 4 artisan ceramic mugs, microwave and dishwasher safe.',
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca0e?w=400',
    price: 42.99,
    stock: 65,
    tags: ['home', 'kitchen', 'ceramic', 'gift'],
    sales: 210,
    revenue: 9027.9,
    status: 'active',
  },
  {
    name: 'Bluetooth Portable Speaker',
    description: 'Waterproof portable speaker with 360° sound and 12-hour battery.',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
    price: 79.99,
    stock: 3,
    tags: ['speaker', 'bluetooth', 'portable', 'waterproof'],
    sales: 175,
    revenue: 13998.25,
    status: 'active',
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Extra thick non-slip yoga mat with carrying strap included.',
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400',
    price: 49.99,
    stock: 88,
    tags: ['yoga', 'fitness', 'mat', 'wellness'],
    sales: 165,
    revenue: 8248.35,
    status: 'active',
  },
  {
    name: 'Vintage Desk Lamp',
    description: 'Industrial-style LED desk lamp with adjustable brightness.',
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400',
    price: 89.99,
    stock: 22,
    tags: ['lamp', 'desk', 'vintage', 'led'],
    sales: 72,
    revenue: 6479.28,
    status: 'inactive',
  },
];

const seed = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smartstore_ai';
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  await Product.deleteMany({});
  await Analytics.deleteMany({});
  await User.deleteMany({ email: 'admin@smartstore.ai' });

  const user = await User.create({
    name: 'Admin User',
    email: 'admin@smartstore.ai',
    password: 'admin123',
    role: 'admin',
  });

  const products = sampleProducts.map((p) => ({ ...p, createdBy: user._id }));
  await Product.insertMany(products);

  const dashboard = await buildDashboardAnalytics(user._id);
  await Analytics.create({
    userId: user._id,
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

  console.log('Seed complete!');
  console.log('Login: admin@smartstore.ai / admin123');
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
