import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi2';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { LowStockBadge } from './LowStockBadge';
import { TableSkeleton } from './Skeleton';

export const ProductTable = ({ products, threshold, onEdit, onDelete, loading }) => {
  if (loading) {
    return <div className="p-4"><TableSkeleton rows={5} /></div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 dark:border-slate-700">
            <th className="px-4 py-3">Product</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3">Sales</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const isLowStock = product.stock <= threshold;
            return (
              <tr
                key={product._id}
                className={`border-b border-slate-100 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50 ${
                  isLowStock ? 'bg-amber-50/50 dark:bg-amber-900/10' : ''
                }`}
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-10 w-10 rounded-lg object-cover"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/40x40?text=P';
                      }}
                    />
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{product.name}</p>
                      <div className="mt-0.5">
                        <LowStockBadge stock={product.stock} threshold={threshold} />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-slate-600 dark:text-slate-400">{product.category}</td>
                <td className="px-4 py-4 font-medium">{formatCurrency(product.price)}</td>
                <td className={`px-4 py-4 font-medium ${isLowStock ? 'text-amber-600' : ''}`}>
                  {formatNumber(product.stock)}
                </td>
                <td className="px-4 py-4">{formatNumber(product.sales)}</td>
                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      product.status === 'active'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="rounded-lg p-2 text-slate-500 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-900/20"
                    >
                      <HiOutlinePencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(product)}
                      className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20"
                    >
                      <HiOutlineTrash className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
