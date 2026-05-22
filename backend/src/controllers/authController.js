import User from '../models/User.js';
import Order from '../models/Order.js';
import { generateToken } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ success: false, message: 'Email already registered' });
  }

  const user = await User.create({ name, email, password, role: role || 'customer' });
  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    data: {
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, settings: user.settings },
      token,
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const token = generateToken(user._id);

  res.json({
    success: true,
    data: {
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, settings: user.settings },
      token,
    },
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user });
});

export const updateSettings = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { settings: { ...req.user.settings, ...req.body } },
    { new: true, runValidators: true }
  );
  res.json({ success: true, data: user });
});

export const getCustomers = asyncHandler(async (req, res) => {
  if (req.user.role === 'customer') {
    return res.status(403).json({ success: false, message: 'Forbidden. Admin access required.' });
  }

  const customers = await User.find({}).select('name email role createdAt avatar settings').lean();

  const customersWithOrders = await Promise.all(
    customers.map(async (customer) => {
      const orders = await Order.find({ customer: customer._id }).sort({ createdAt: -1 }).lean();
      const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);
      return {
        ...customer,
        orders,
        orderCount: orders.length,
        totalSpent,
      };
    })
  );

  res.json({ success: true, data: customersWithOrders });
});
