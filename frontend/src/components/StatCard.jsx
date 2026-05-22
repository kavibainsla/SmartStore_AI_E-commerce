import { formatCurrency, formatNumber, formatPercent } from '../utils/formatters';

export const StatCard = ({ title, value, icon: Icon, trend, isCurrency, color = 'brand' }) => {
  const colors = {
    brand: 'bg-brand-600/10 text-brand-600 dark:text-brand-400',
    emerald: 'bg-emerald-500/10 text-emerald-600',
    amber: 'bg-amber-500/10 text-amber-600',
    rose: 'bg-rose-500/10 text-rose-600',
  };

  const displayValue = isCurrency ? formatCurrency(value) : formatNumber(value);

  return (
    <div className="stat-card group hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{displayValue}</p>
          {trend !== undefined && (
            <p
              className={`mt-1 text-xs font-medium ${
                trend >= 0 ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {formatPercent(trend)} vs last month
            </p>
          )}
        </div>
        {Icon && (
          <div className={`rounded-xl p-3 ${colors[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </div>
  );
};
