import { formatCurrency } from '../utils/formatters';

export const TopProductsList = ({ products = [], limit = 5 }) => {
  const list = products.slice(0, limit);

  if (!list.length) {
    return <p className="py-8 text-center text-sm text-slate-500">No sales data yet</p>;
  }

  return (
    <div className="space-y-3">
      {list.map((p, i) => (
        <div
          key={p._id}
          className="flex items-center gap-4 rounded-xl p-3 transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-sm font-bold text-brand-600 dark:bg-brand-600/20">
            {i + 1}
          </span>
          <img
            src={p.image}
            alt={p.name}
            className="h-10 w-10 shrink-0 rounded-lg object-cover"
            onError={(e) => { e.target.src = 'https://placehold.co/40x40?text=P'; }}
          />
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-slate-900 dark:text-white">{p.name}</p>
            <p className="text-xs text-slate-500">{p.category}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-slate-900 dark:text-white">{p.sales} sold</p>
            <p className="text-sm text-brand-600">{formatCurrency(p.revenue)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
