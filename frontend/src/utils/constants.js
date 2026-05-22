export const APP_NAME = 'SmartStore AI';
export const DEFAULT_PAGE_SIZE = 10;
export const LOW_STOCK_THRESHOLD = 10;

export const PRODUCT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

export const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest' },
  { value: 'name', label: 'Name A-Z' },
  { value: '-sales', label: 'Top Sales' },
  { value: 'stock', label: 'Stock Low-High' },
  { value: '-price', label: 'Price High-Low' },
];

export const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/products', label: 'Products' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/ai-insights', label: 'AI Insights' },
  { to: '/settings', label: 'Settings' },
];
