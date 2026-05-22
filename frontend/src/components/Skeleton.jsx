export const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700 ${className}`} />
);

export const StatCardSkeleton = () => (
  <div className="stat-card space-y-3">
    <Skeleton className="h-4 w-24" />
    <Skeleton className="h-8 w-32" />
    <Skeleton className="h-3 w-20" />
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <Skeleton key={i} className="h-14 w-full" />
    ))}
  </div>
);
