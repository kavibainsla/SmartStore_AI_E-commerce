import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });

import Product from '../models/Product.js';
import User from '../models/User.js';
import Analytics from '../models/Analytics.js';
import { buildDashboardAnalytics } from '../services/analyticsService.js';

const BASE_IMAGE_URL = 'http://localhost:5173/products';

// Full product catalog with local images
const fullProductCatalog = [
  {
    name: 'Wireless Pro Headphones',
    description: 'Premium noise-cancelling wireless headphones with 40-hour battery life, Bluetooth 5.2, and crystal-clear sound for audiophiles.',
    category: 'Electronics',
    image: `${BASE_IMAGE_URL}/headphones.png`,
    price: 249.99,
    stock: 45,
    tags: ['audio', 'wireless', 'premium', 'bestseller', 'noise-cancelling'],
    sales: 320,
    revenue: 79996.8,
    status: 'active',
  },
  {
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracking with heart rate, GPS, SpO2, and sleep monitoring. Swim-proof with 7-day battery life.',
    category: 'Electronics',
    image: `${BASE_IMAGE_URL}/smartwatch.png`,
    price: 199.99,
    stock: 8,
    tags: ['fitness', 'wearable', 'smart', 'health', 'gps'],
    sales: 280,
    revenue: 55997.2,
    status: 'active',
  },
  {
    name: 'Organic Cotton T-Shirt',
    description: 'Sustainable, soft organic cotton tee certified by GOTS. Available in 12 colors, breathable and eco-friendly.',
    category: 'Apparel',
    image: `${BASE_IMAGE_URL}/tshirt.png`,
    price: 34.99,
    stock: 120,
    tags: ['organic', 'cotton', 'sustainable', 'casual', 'eco-friendly'],
    sales: 450,
    revenue: 15745.5,
    status: 'active',
  },
  {
    name: 'Leather Messenger Bag',
    description: 'Handcrafted genuine full-grain leather bag for professionals. Fits 15" laptops with padded compartment and antique brass hardware.',
    category: 'Accessories',
    image: `${BASE_IMAGE_URL}/leather_bag.png`,
    price: 159.99,
    stock: 5,
    tags: ['leather', 'bag', 'professional', 'luxury', 'laptop'],
    sales: 95,
    revenue: 15199.05,
    status: 'active',
  },
  {
    name: 'Ceramic Coffee Mug Set',
    description: 'Set of 4 handcrafted artisan ceramic mugs in earth tones. Microwave and dishwasher safe. Perfect gift set.',
    category: 'Home',
    image: `${BASE_IMAGE_URL}/coffee_mugs.png`,
    price: 42.99,
    stock: 65,
    tags: ['home', 'kitchen', 'ceramic', 'gift', 'coffee'],
    sales: 210,
    revenue: 9027.9,
    status: 'active',
  },
  {
    name: 'Bluetooth Portable Speaker',
    description: 'Waterproof IPX7 portable speaker with immersive 360° surround sound, 12-hour battery, and built-in voice assistant.',
    category: 'Electronics',
    image: `${BASE_IMAGE_URL}/bluetooth_speaker.png`,
    price: 79.99,
    stock: 32,
    tags: ['speaker', 'bluetooth', 'portable', 'waterproof', '360-sound'],
    sales: 175,
    revenue: 13998.25,
    status: 'active',
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Extra thick 6mm non-slip eco-friendly TPE yoga mat with alignment lines, carrying strap, and moisture-resistant surface.',
    category: 'Sports',
    image: `${BASE_IMAGE_URL}/yoga_mat.png`,
    price: 49.99,
    stock: 88,
    tags: ['yoga', 'fitness', 'mat', 'wellness', 'eco'],
    sales: 165,
    revenue: 8248.35,
    status: 'active',
  },
  {
    name: 'Vintage Desk Lamp',
    description: 'Industrial-style adjustable LED desk lamp with 5 brightness levels, USB charging port, and 360° flexible arm.',
    category: 'Home',
    image: `${BASE_IMAGE_URL}/desk_lamp.png`,
    price: 89.99,
    stock: 22,
    tags: ['lamp', 'desk', 'vintage', 'led', 'industrial'],
    sales: 72,
    revenue: 6479.28,
    status: 'active',
  },
  // New products
  {
    name: 'Ultralight Running Shoes',
    description: 'Performance running shoes with responsive foam midsole, engineered mesh upper, and carbon-fiber plate for max speed.',
    category: 'Sports',
    image: `${BASE_IMAGE_URL}/running_shoes.png`,
    price: 139.99,
    stock: 55,
    tags: ['running', 'shoes', 'athletic', 'performance', 'lightweight'],
    sales: 210,
    revenue: 29397.9,
    status: 'active',
  },
  {
    name: 'Aluminum Laptop Stand',
    description: 'Premium adjustable aluminum laptop stand with 6 height settings, cable management, and heat dissipation vents. Fits 10-16" laptops.',
    category: 'Electronics',
    image: `${BASE_IMAGE_URL}/laptop_stand.png`,
    price: 59.99,
    stock: 40,
    tags: ['laptop', 'stand', 'ergonomic', 'aluminum', 'workspace'],
    sales: 130,
    revenue: 7798.7,
    status: 'active',
  },
  {
    name: 'Polarized Aviator Sunglasses',
    description: 'UV400 polarized aviator sunglasses with gold titanium frame and gradient brown lenses. Includes leather case and cleaning cloth.',
    category: 'Accessories',
    image: `${BASE_IMAGE_URL}/sunglasses.png`,
    price: 89.99,
    stock: 30,
    tags: ['sunglasses', 'polarized', 'uv400', 'luxury', 'aviator'],
    sales: 95,
    revenue: 8549.05,
    status: 'active',
  },
  {
    name: 'Insulated Water Bottle',
    description: 'Triple-wall vacuum insulated stainless steel bottle keeps drinks cold 48h or hot 24h. BPA-free, leakproof lid, 32 oz.',
    category: 'Sports',
    image: `${BASE_IMAGE_URL}/water_bottle.png`,
    price: 39.99,
    stock: 75,
    tags: ['water bottle', 'insulated', 'stainless steel', 'eco', 'bpa-free'],
    sales: 320,
    revenue: 12796.8,
    status: 'active',
  },
  {
    name: 'RGB Mechanical Keyboard',
    description: 'Compact 75% mechanical keyboard with Cherry MX switches, per-key RGB lighting, aluminum chassis, and detachable USB-C cable.',
    category: 'Electronics',
    image: `${BASE_IMAGE_URL}/mechanical_keyboard.png`,
    price: 129.99,
    stock: 18,
    tags: ['keyboard', 'mechanical', 'rgb', 'gaming', 'compact'],
    sales: 145,
    revenue: 18848.55,
    status: 'active',
  },
  {
    name: 'Luxury Skincare Set',
    description: 'Complete 3-piece skincare routine with hyaluronic acid serum, peptide moisturizer, and retinol eye cream. Dermatologist tested.',
    category: 'Beauty',
    image: `${BASE_IMAGE_URL}/skincare_set.png`,
    price: 119.99,
    stock: 25,
    tags: ['skincare', 'luxury', 'serum', 'moisturizer', 'anti-aging'],
    sales: 88,
    revenue: 10559.12,
    status: 'active',
  },
];

const run = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smartstore_ai';
  await mongoose.connect(uri);
  console.log('Connected to MongoDB\n');

  // Find or create the admin user to link products
  let adminUser = await User.findOne({ role: 'admin' });
  if (!adminUser) {
    adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@smartstore.ai',
      password: 'admin123',
      role: 'admin',
    });
    console.log('Created admin user: admin@smartstore.ai');
  } else {
    console.log(`Using existing admin: ${adminUser.email}`);
  }

  // Drop all existing products and replace with full catalog
  const deleted = await Product.deleteMany({});
  console.log(`Cleared ${deleted.deletedCount} existing products.`);

  const productsToInsert = fullProductCatalog.map((p) => ({
    ...p,
    createdBy: adminUser._id,
  }));

  const inserted = await Product.insertMany(productsToInsert);
  console.log(`\n✅ Inserted ${inserted.length} products successfully!\n`);

  inserted.forEach((p) => console.log(`  - [${p.category}] ${p.name} ($${p.price})`));

  // Rebuild analytics
  console.log('\nRebuilding analytics...');
  await Analytics.deleteMany({ userId: adminUser._id });
  const dashboard = await buildDashboardAnalytics(adminUser._id);
  await Analytics.create({
    userId: adminUser._id,
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

  console.log('\n✅ Analytics rebuilt!');
  console.log('==================================================');
  console.log(`Total products in DB: ${inserted.length}`);
  console.log(`Admin login: admin@smartstore.ai / admin123`);
  console.log('==================================================\n');

  await mongoose.disconnect();
};

run().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
