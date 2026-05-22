export const InventoryOverview = ({ inventoryStatus, totalProducts }) => {
  const items = [
    { label: 'In Stock', value: inventoryStatus?.inStock, color: 'bg-emerald-500' },
    { label: 'Low Stock', value: inventoryStatus?.lowStock, color: 'bg-amber-500' },
    { label: 'Out of Stock', value: inventoryStatus?.outOfStock, color: 'bg-rose-500' },
  ];

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.label}>
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
            <span className="font-semibold text-slate-900 dark:text-white">{item.value ?? 0}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className={`h-full rounded-full transition-all ${item.color}`}
              style={{
                width: `${Math.min(100, ((item.value || 0) / (totalProducts || 1)) * 100)}%`,
              }}
            />
          </div>
        </div>
      ))}
      <p className="border-t border-slate-200 pt-3 text-sm text-slate-500 dark:border-slate-700">
        Total units in inventory:{' '}
        <strong className="text-slate-900 dark:text-white">{inventoryStatus?.totalUnits ?? 0}</strong>
      </p>
    </div>
  );
};
