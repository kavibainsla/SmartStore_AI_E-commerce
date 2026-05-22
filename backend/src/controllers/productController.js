import Product from '../models/Product.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { config } from '../config/env.js';

export const getProducts = asyncHandler(async (req, res) => {
  const {
    search,
    category,
    status,
    page = 1,
    limit = 10,
    sort = '-createdAt',
    lowStock,
  } = req.query;

  const query = { createdBy: req.user._id };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } },
    ];
  }
  if (category) query.category = category;
  if (status) query.status = status;
  if (lowStock === 'true') query.stock = { $lte: config.lowStockThreshold };

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const total = await Product.countDocuments(query);

  const products = await Product.find(query)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit, 10));

  const categories = await Product.distinct('category', { createdBy: req.user._id });

  res.json({
    success: true,
    data: products,
    pagination: {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total,
      pages: Math.ceil(total / parseInt(limit, 10)),
    },
    categories,
  });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, createdBy: req.user._id });
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, data: product });
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json({ success: true, data: product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, createdBy: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, data: product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, message: 'Product deleted' });
});
