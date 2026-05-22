import { Link } from 'react-router-dom';
import { HiOutlineExclamationTriangle } from 'react-icons/hi2';

export const LowStockAlert = ({ products = [], maxShow = 5 }) => {
  if (!products.length) return null;

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800/50 dark:bg-amber-900/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HiOutlineExclamationTriangle className="h-5 w-5 text-amber-600" />
          <h3 className="font-semibold text-amber-800 dark:text-amber-300">Low Stock Alerts</h3>
        </div>
        <Link to="/products?lowStock=true" className="text-sm text-amber-700 hover:underline dark:text-amber-400">
          View all
        </Link>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {products.slice(0, maxShow).map((p) => (
          <span
            key={p._id}
            className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-amber-800 shadow-sm dark:bg-slate-800 dark:text-amber-300"
          >
            {p.name} ({p.stock} left)
          </span>
        ))}
      </div>
    </div>
  );
};
