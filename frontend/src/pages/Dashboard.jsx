import { Link } from 'react-router-dom';
import {
  HiOutlineCurrencyDollar,
  HiOutlineShoppingCart,
  HiOutlineCube,
  HiOutlineExclamationTriangle,
} from 'react-icons/hi2';
import { StatCard } from '../components/StatCard';
import { StatCardSkeleton } from '../components/Skeleton';
import { LowStockAlert } from '../components/LowStockAlert';
import { TopProductsList } from '../components/TopProductsList';
import { ErrorState } from '../components/ErrorState';
import { RevenueLineChart, CategoryDoughnutChart } from '../charts';
import { useAnalytics } from '../hooks/useAnalytics';
import { LOW_STOCK_THRESHOLD } from '../utils/constants';

export default function Dashboard() {
  const { data, loading, error, refetch } = useAnalytics();

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <ErrorState
        message={error || 'Failed to load dashboard. Ensure backend is running on port 5000.'}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Revenue" value={data.totalRevenue} icon={HiOutlineCurrencyDollar} isCurrency trend={data.revenueGrowth} color="brand" />
        <StatCard title="Total Orders" value={data.totalOrders} icon={HiOutlineShoppingCart} color="emerald" />
        <StatCard title="Products" value={data.totalProducts} icon={HiOutlineCube} color="brand" />
        <StatCard title="Low Stock Alerts" value={data.lowStockCount} icon={HiOutlineExclamationTriangle} color="amber" />
      </div>

      <LowStockAlert products={data.lowStockProducts} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass-card-light p-6 lg:col-span-2 dark:glass-card">
          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Revenue Trend</h3>
          <RevenueLineChart monthlyData={data.monthlyData} />
        </div>
        <div className="glass-card-light p-6 dark:glass-card">
          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Category Revenue</h3>
          <CategoryDoughnutChart categoryBreakdown={data.categoryBreakdown} />
        </div>
      </div>

      <div className="glass-card-light p-6 dark:glass-card">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Top Selling Products</h3>
          <Link to="/products" className="text-sm text-brand-600 hover:underline">View products</Link>
        </div>
        <TopProductsList products={data.topProducts} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="stat-card text-center">
          <p className="text-2xl font-bold text-emerald-600">{data.inventoryStatus?.inStock}</p>
          <p className="text-sm text-slate-500">In Stock</p>
        </div>
        <div className="stat-card text-center">
          <p className="text-2xl font-bold text-amber-600">{data.inventoryStatus?.lowStock}</p>
          <p className="text-sm text-slate-500">Low Stock (≤{data.threshold || LOW_STOCK_THRESHOLD})</p>
        </div>
        <div className="stat-card text-center">
          <p className="text-2xl font-bold text-rose-600">{data.inventoryStatus?.outOfStock}</p>
          <p className="text-sm text-slate-500">Out of Stock</p>
        </div>
      </div>
    </div>
  );
}
