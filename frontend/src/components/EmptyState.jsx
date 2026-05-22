export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    {Icon && (
      <div className="mb-4 rounded-2xl bg-brand-100 p-4 text-brand-600 dark:bg-brand-600/20 dark:text-brand-400">
        <Icon className="h-10 w-10" />
      </div>
    )}
    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
    <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>
    {action && <div className="mt-6">{action}</div>}
  </div>
);
