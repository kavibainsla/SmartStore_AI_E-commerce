import { useEffect, useState } from 'react';
import {
  HiOutlineUsers,
  HiOutlineShoppingCart,
  HiOutlineBanknotes,
  HiOutlineMagnifyingGlass,
  HiOutlineXMark,
  HiOutlineClipboardDocument,
  HiOutlineEnvelope,
  HiOutlineCalendarDays,
  HiOutlineTruck,
  HiOutlineMapPin,
  HiOutlineArrowRight,
  HiOutlineShoppingBag,
} from 'react-icons/hi2';
import { authService } from '../services/authService';
import { TableSkeleton } from '../components/Skeleton';
import { ErrorState } from '../components/ErrorState';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/formatters';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toast = useToast();

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await authService.getCustomers();
      setCustomers(data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load customers list.');
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const getInitials = (name) => {
    if (!name) return 'C';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getAvatarGradient = (name) => {
    const colors = [
      'from-indigo-500 to-purple-600',
      'from-pink-500 to-rose-600',
      'from-cyan-500 to-blue-600',
      'from-emerald-500 to-teal-600',
      'from-amber-500 to-orange-600',
    ];
    if (!name) return colors[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Tracking number copied!');
  };

  const filteredCustomers = customers.filter((customer) => {
    const query = search.toLowerCase();
    return (
      customer.name?.toLowerCase().includes(query) ||
      customer.email?.toLowerCase().includes(query) ||
      customer.role?.toLowerCase().includes(query)
    );
  });

  // Calculate totals for summary cards
  const totalCustomersCount = customers.length;
  const totalOrdersCount = customers.reduce((sum, c) => sum + (c.orderCount || 0), 0);
  const totalSpendINR = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);

  if (error) {
    return <ErrorState message={error} onRetry={fetchCustomers} />;
  }

  return (
    <div className="space-y-6 animate-fade-in relative min-h-[calc(100vh-10rem)]">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Customer Directory & Orders</h2>
        <p className="text-sm text-slate-500">Monitor active accounts, profiles, and live invoice histories.</p>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid gap-4 sm:grid-cols-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl bg-white p-6 border border-slate-100 dark:bg-slate-900 dark:border-slate-800 h-28" />
          ))
        ) : (
          <>
            {/* Total Customers */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-400">Total Customers</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalCustomersCount}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                <HiOutlineUsers className="h-6 w-6" />
              </div>
            </div>

            {/* Total Orders */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-400">Total Customer Orders</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalOrdersCount}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                <HiOutlineShoppingCart className="h-6 w-6" />
              </div>
            </div>

            {/* Total Spend */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-400">Cumulative Sales (LTV)</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(totalSpendINR)}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                <HiOutlineBanknotes className="h-6 w-6" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main Customers List Panel */}
      <div className="glass-card-light dark:glass-card overflow-hidden">
        {/* Filters */}
        <div className="border-b border-slate-200 p-4 dark:border-slate-800 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
              <HiOutlineMagnifyingGlass className="h-5 w-5" />
            </span>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950/50 text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all duration-200"
            />
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Showing {filteredCustomers.length} of {customers.length} registered customers
          </p>
        </div>

        {/* Loading / Table View */}
        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={5} />
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 mb-4">
              <HiOutlineUsers className="h-6 w-6" />
            </div>
            <h3 className="text-md font-semibold text-slate-950 dark:text-white">No customers found</h3>
            <p className="text-sm text-slate-500 mt-1">Try refining your search keyword.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900/30">
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4 text-center">Orders Placed</th>
                  <th className="px-6 py-4 text-right">Lifetime Spent</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 dark:divide-slate-800/50">
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer._id}
                    className="hover:bg-slate-50/30 dark:hover:bg-slate-900/10 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${getAvatarGradient(customer.name)} text-white font-bold shadow-md`}>
                          {getInitials(customer.name)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{customer.name}</p>
                            <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                              customer.role === 'admin'
                                ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/30'
                                : customer.role === 'manager'
                                ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200/30'
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            }`}>
                              {customer.role || 'customer'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">ID: {customer._id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600 dark:text-slate-300">{customer.email}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-500">
                        {new Date(customer.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${customer.orderCount > 0 ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}>
                        {customer.orderCount} {customer.orderCount === 1 ? 'order' : 'orders'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {formatCurrency(customer.totalSpent)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setDrawerOpen(true);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/30 dark:hover:bg-indigo-900/30 px-3 py-1.5 rounded-lg transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
                      >
                        View Orders
                        <HiOutlineArrowRight className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Sliding Drawer Panel */}
      {drawerOpen && selectedCustomer && (
        <>
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => {
              setDrawerOpen(false);
              setSelectedCustomer(null);
            }}
          />

          {/* Drawer container */}
          <aside className="fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-xl flex-col border-l border-slate-200 bg-white/95 dark:border-slate-800 dark:bg-slate-900/95 shadow-2xl backdrop-blur-md transform transition-transform duration-300 ease-out translate-x-0 sm:max-w-2xl">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-200 p-6 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${getAvatarGradient(selectedCustomer.name)} text-white font-extrabold shadow-md text-lg`}>
                  {getInitials(selectedCustomer.name)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedCustomer.name}</h3>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold uppercase tracking-wider ${
                      selectedCustomer.role === 'admin'
                        ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
                        : selectedCustomer.role === 'manager'
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-450'
                        : 'bg-slate-100 text-slate-650 dark:bg-slate-800 dark:text-slate-405'
                    }`}>
                      {selectedCustomer.role || 'customer'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-0.5 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <HiOutlineEnvelope className="h-3.5 w-3.5" />
                      {selectedCustomer.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <HiOutlineCalendarDays className="h-3.5 w-3.5" />
                      Joined: {new Date(selectedCustomer.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  setSelectedCustomer(null);
                }}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
              >
                <HiOutlineXMark className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Body - Scrollable content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
                  Purchase History & Invoices ({selectedCustomer.orders?.length || 0})
                </h4>

                {(!selectedCustomer.orders || selectedCustomer.orders.length === 0) ? (
                  <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 mb-4">
                      <HiOutlineShoppingBag className="h-6 w-6" />
                    </div>
                    <h5 className="text-sm font-semibold text-slate-900 dark:text-white">No orders found</h5>
                    <p className="text-xs text-slate-500 mt-1">This user hasn't completed any transaction checkouts yet.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {selectedCustomer.orders.map((order) => (
                      <div
                        key={order._id}
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 flex flex-col space-y-4 hover:border-slate-350 dark:hover:border-slate-700 transition-all duration-200"
                      >
                        {/* Order Header info */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                          <div>
                            <span className="text-xs font-bold uppercase text-slate-400">Order ID</span>
                            <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{order.orderId}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-bold uppercase text-slate-400">Order Date</span>
                            <p className="text-xs text-slate-500">
                              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                          <div>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              order.status === 'Delivered'
                                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                                : order.status === 'In Transit'
                                ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400'
                                : 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
                            }`}>
                              {order.status || 'AI Processing'}
                            </span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Items Ordered</span>
                          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-900/30 space-y-2.5">
                            {order.items?.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center text-sm">
                                <div className="space-y-0.5">
                                  <p className="font-semibold text-slate-800 dark:text-slate-200">{item.name}</p>
                                  <p className="text-xs text-slate-450">
                                    {formatCurrency(item.price)} × {item.quantity}
                                  </p>
                                </div>
                                <span className="font-semibold text-slate-900 dark:text-white">
                                  {formatCurrency(item.price * item.quantity)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Address & Logistics */}
                        <div className="grid gap-4 sm:grid-cols-2 text-xs">
                          {/* Shipping address */}
                          <div className="space-y-1 rounded-xl bg-slate-50/40 p-3 border border-slate-100 dark:bg-slate-900/10 dark:border-slate-800/80">
                            <span className="flex items-center gap-1 font-bold uppercase text-slate-400">
                              <HiOutlineMapPin className="h-3.5 w-3.5" />
                              Shipping Address
                            </span>
                            <p className="text-slate-600 dark:text-slate-350 leading-relaxed">{order.address}</p>
                          </div>

                          {/* Logistics & tracking */}
                          <div className="space-y-1 rounded-xl bg-slate-50/40 p-3 border border-slate-100 dark:bg-slate-900/10 dark:border-slate-800/80">
                            <span className="flex items-center gap-1 font-bold uppercase text-slate-400">
                              <HiOutlineTruck className="h-3.5 w-3.5" />
                              Logistics Tracking
                            </span>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-slate-700 dark:text-slate-300 font-mono text-xs">{order.trackingNumber}</p>
                              <button
                                onClick={() => copyToClipboard(order.trackingNumber)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-all"
                                title="Copy tracking code"
                              >
                                <HiOutlineClipboardDocument className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <p className="text-[10px] text-slate-450 italic">AI Auto-Invoiced tracking pipeline</p>
                          </div>
                        </div>

                        {/* Order Invoice Math Breakdown */}
                        <div className="border-t border-slate-100 pt-3 dark:border-slate-800 flex justify-between items-end">
                          <div className="text-[11px] text-slate-400 space-y-0.5">
                            <p>Subtotal: {formatCurrency(order.subtotal)}</p>
                            <p>Shipping & Handling: {formatCurrency(order.shipping)}</p>
                            <p>GST & Customs Tax: {formatCurrency(order.tax)}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-bold uppercase text-slate-400">Grand Total</span>
                            <p className="text-lg font-black text-slate-900 dark:text-white">
                              {formatCurrency(order.total)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="border-t border-slate-200 p-6 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/20 flex justify-between items-center text-xs">
              <span className="text-slate-500">Lifetime Spent: <strong className="text-sm font-bold text-slate-800 dark:text-white">{formatCurrency(selectedCustomer.totalSpent)}</strong></span>
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  setSelectedCustomer(null);
                }}
                className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 text-white font-bold px-4 py-2 rounded-xl transition-all duration-200"
              >
                Close Profile
              </button>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
