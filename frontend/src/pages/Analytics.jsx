import { HiOutlineArrowDownTray } from 'react-icons/hi2';
import {
  HiOutlineCurrencyDollar,
  HiOutlineShoppingCart,
  HiOutlineCube,
  HiOutlineChartBar,
} from 'react-icons/hi2';
import { StatCard } from '../components/StatCard';
import { StatCardSkeleton } from '../components/Skeleton';
import { ErrorState } from '../components/ErrorState';
import { InventoryOverview } from '../components/InventoryOverview';
import { RevenueLineChart, SalesBarChart, CategoryDoughnutChart } from '../charts';
import { Button } from '../components/Button';
import { useAnalytics } from '../hooks/useAnalytics';
import { analyticsService } from '../services/analyticsService';
import { useToast } from '../context/ToastContext';

export default function Analytics() {
  const { data, loading, error, refetch } = useAnalytics();
  const toast = useToast();

  const handleExport = async () => {
    try {
      const { data: res } = await analyticsService.exportData();
      const blob = new Blob([JSON.stringify(res, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `smartstore-analytics-${Date.now()}.json`;
      a.click();
      toast.success('Analytics exported');
    } catch {
      toast.error('Export failed');
    }
  };

  const handleSnapshot = async () => {
    try {
      await analyticsService.createSnapshot();
      toast.success('Analytics snapshot saved');
    } catch {
      toast.error('Failed to save snapshot');
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error || !data) {
    return <ErrorState message={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Sales Analytics</h2>
          <p className="text-sm text-slate-500">Comprehensive store performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleSnapshot}>Save Snapshot</Button>
          <Button variant="secondary" onClick={handleExport}>
            <HiOutlineArrowDownTray className="h-5 w-5" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Revenue" value={data.totalRevenue} icon={HiOutlineCurrencyDollar} isCurrency trend={data.revenueGrowth} />
        <StatCard title="Total Sales" value={data.totalSales} icon={HiOutlineShoppingCart} color="emerald" />
        <StatCard title="Products" value={data.totalProducts} icon={HiOutlineCube} />
        <StatCard title="Growth %" value={data.revenueGrowth} icon={HiOutlineChartBar} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card-light p-6 dark:glass-card">
          <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">Revenue Trend (Line Chart)</h3>
          <RevenueLineChart monthlyData={data.monthlyData} />
        </div>
        <div className="glass-card-light p-6 dark:glass-card">
          <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">Monthly Orders (Bar Chart)</h3>
          <SalesBarChart monthlyData={data.monthlyData} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card-light p-6 dark:glass-card">
          <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">Category Distribution (Doughnut)</h3>
          <CategoryDoughnutChart categoryBreakdown={data.categoryBreakdown} />
        </div>
        <div className="glass-card-light p-6 dark:glass-card">
          <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">Inventory Overview</h3>
          <InventoryOverview inventoryStatus={data.inventoryStatus} totalProducts={data.totalProducts} />
        </div>
      </div>
    </div>
  );
}
