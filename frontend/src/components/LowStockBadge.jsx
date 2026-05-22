export const LowStockBadge = ({ stock, threshold = 10, showCount = true }) => {
  if (stock > threshold) return null;

  const isOut = stock === 0;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
        isOut
          ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
      }`}
    >
      {isOut ? 'Out of Stock' : 'Low Stock'}
      {showCount && !isOut && ` (${stock})`}
    </span>
  );
};
