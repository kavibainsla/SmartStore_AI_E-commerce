import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { CustomerHeader } from '../components/CustomerHeader';
import { CustomerCart } from '../components/CustomerCart';
import { useAuth } from '../context/AuthContext';
import { HiOutlineSparkles, HiOutlineTruck, HiOutlineArrowLeft, HiOutlineCheckCircle, HiOutlineClock, HiOutlineChevronDown, HiOutlineChevronUp } from 'react-icons/hi2';

export default function CustomerOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  
  if (user && user.role !== 'customer') {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Cart State for Header bindings
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  });
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(storedOrders);
    if (storedOrders.length > 0) {
      setExpandedOrder(storedOrders[0].orderId); // Auto-expand first order
    }
  }, []);

  const handleUpdateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item._id !== id));
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item._id === id ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Custom AI Timeline step checking
  const steps = [
    { title: 'Order Placed', desc: 'Secure authorization completed.', icon: HiOutlineCheckCircle, status: 'complete' },
    { title: 'AI Logistics Plan', desc: 'Robotic warehouse sorting path generated.', icon: HiOutlineSparkles, status: 'complete' },
    { title: 'In Transit', desc: 'En route via priority autonomous drone carrier.', icon: HiOutlineTruck, status: 'active' },
    { title: 'Delivered', desc: 'Expected delivery by smart courier.', icon: HiOutlineClock, status: 'upcoming' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 pb-20">
      <CustomerHeader
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
        searchVal=""
        onSearchChange={() => {}}
      />

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Breadcrumb Back Link */}
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-extrabold text-brand-600 hover:text-brand-500 dark:text-brand-400 mb-6">
          <HiOutlineArrowLeft className="h-4 w-4" />
          Back to Store Catalog
        </Link>

        <div className="space-y-4 mb-6">
          <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white">
            📦 My Order History
          </h2>
          <p className="text-xs text-slate-500 max-w-md leading-relaxed">
            Review detailed invoices, transaction records, and autonomous shipping timelines optimized by our smart fulfillment engine.
          </p>
        </div>

        {orders.length === 0 ? (
          /* Empty Order List */
          <div className="glass-card-light dark:glass-card p-12 text-center flex flex-col items-center justify-center">
            <span className="text-4xl">📦</span>
            <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">No orders placed yet</h3>
            <p className="mt-2 text-xs text-slate-500 max-w-[280px]">
              You haven&apos;t completed any transaction checkouts. Head over to the store catalog to add premium products!
            </p>
            <Link to="/" className="btn-primary mt-6 text-xs">
              Start Shopping Now
            </Link>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-4">
            {orders.map((order) => {
              const isExpanded = expandedOrder === order.orderId;

              return (
                <div
                  key={order.orderId}
                  className="glass-card-light dark:glass-card border border-slate-200/60 dark:border-slate-800/80 overflow-hidden transition-all duration-300"
                >
                  {/* Summary Bar */}
                  <div
                    onClick={() => setExpandedOrder(isExpanded ? null : order.orderId)}
                    className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-4 p-5 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900 dark:text-white">
                          Order {order.orderId}
                        </span>
                        <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-[8px] font-black uppercase text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">
                          🤖 {order.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500">Placed on {order.date}</p>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right sm:text-left">
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Paid Total</p>
                        <p className="text-xs font-black text-brand-600 dark:text-brand-400">
                          ₹{order.total.toFixed(2)}
                        </p>
                      </div>
                      {isExpanded ? (
                        <HiOutlineChevronUp className="h-5 w-5 text-slate-400" />
                      ) : (
                        <HiOutlineChevronDown className="h-5 w-5 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Timeline & Invoices */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 p-5 dark:border-slate-800 space-y-6 bg-slate-50/20 dark:bg-slate-900/10">
                      
                      {/* AI TRACKING TIMELINE */}
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <HiOutlineSparkles className="h-4 w-4 text-brand-500" />
                          Autonomous Dispatch Logistics Timeline
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                          {steps.map((step, idx) => {
                            const StepIcon = step.icon;

                            return (
                              <div
                                key={idx}
                                className={`relative flex gap-3 md:flex-col md:items-start p-3 rounded-xl border transition-colors ${
                                  step.status === 'complete'
                                    ? 'border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-950/10'
                                    : step.status === 'active'
                                    ? 'border-brand-500/30 bg-brand-500/5 dark:bg-brand-950/20 animate-pulse'
                                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 opacity-60'
                                }`}
                              >
                                <div
                                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                                    step.status === 'complete'
                                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                                      : step.status === 'active'
                                      ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                                      : 'bg-slate-100 dark:bg-slate-900 text-slate-400'
                                  }`}
                                >
                                  <StepIcon className="h-4 w-4" />
                                </div>
                                <div className="space-y-0.5">
                                  <p className="text-[11px] font-black text-slate-900 dark:text-white">
                                    {step.title}
                                  </p>
                                  <p className="text-[9px] leading-snug text-slate-500">
                                    {step.desc}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Items Purchased & Billing details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                        {/* Items Column */}
                        <div className="md:col-span-7 space-y-3">
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Purchased Items ({order.items.length})
                          </h4>
                          <div className="space-y-2">
                            {order.items.map((item) => (
                              <div
                                key={item._id}
                                className="flex gap-3 justify-between items-center rounded-xl bg-white border border-slate-100 p-2.5 dark:bg-slate-950 dark:border-slate-800"
                              >
                                <div className="flex gap-3 items-center">
                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500 dark:bg-slate-900">
                                    {item.name.charAt(0)}
                                  </div>
                                  <div>
                                    <h5 className="text-[11px] font-bold text-slate-900 dark:text-white truncate max-w-[180px]">
                                      {item.name}
                                    </h5>
                                    <p className="text-[9px] text-slate-500 capitalize">
                                      Qty: {item.quantity} × ₹{item.price}
                                    </p>
                                  </div>
                                </div>
                                <span className="text-[11px] font-extrabold text-slate-950 dark:text-white">
                                  ₹{item.price * item.quantity}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Invoice/Receipt summary Column */}
                        <div className="md:col-span-5 space-y-3 bg-white border border-slate-100 p-4 rounded-2xl dark:bg-slate-950 dark:border-slate-800">
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Transaction Summary
                          </h4>
                          <div className="space-y-1.5 text-[10px] text-slate-500">
                            <div className="flex justify-between">
                              <span>Subtotal</span>
                              <span className="font-bold text-slate-900 dark:text-white">₹{order.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Autonomous Shipping</span>
                              <span className="font-bold text-slate-900 dark:text-white">
                                {order.shipping === 0 ? 'FREE' : `₹${order.shipping.toFixed(2)}`}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Tax (8%)</span>
                              <span className="font-bold text-slate-900 dark:text-white">₹{order.tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between border-t border-slate-100 pt-2 text-[11px] font-black dark:border-slate-800">
                              <span className="text-slate-900 dark:text-white">Invoice Total</span>
                              <span className="text-brand-600 dark:text-brand-400">₹{order.total.toFixed(2)}</span>
                            </div>
                          </div>
                          <div className="mt-3 border-t border-slate-100 pt-3 text-[9px] text-slate-400 dark:border-slate-800 space-y-1">
                            <div>
                              <span className="font-bold">Shipping To:</span> {order.address}
                            </div>
                            <div>
                              <span className="font-bold">Carrier Code:</span> {order.trackingNumber}
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </main>

      <CustomerCart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setCart([])}
      />
    </div>
  );
}
