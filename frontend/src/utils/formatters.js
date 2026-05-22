export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value || 0);


export const formatNumber = (value) => new Intl.NumberFormat('en-US').format(value || 0);

export const formatPercent = (value) => `${value >= 0 ? '+' : ''}${value}%`;

export const truncate = (str, len = 50) => {
  if (!str) return '';
  return str.length > len ? `${str.slice(0, len)}...` : str;
};
