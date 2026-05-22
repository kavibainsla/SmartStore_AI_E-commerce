import { useState } from 'react';
import { HiOutlineXMark, HiOutlineMinus, HiOutlinePlus, HiOutlineTrash, HiOutlineCreditCard, HiOutlineCheckCircle, HiOutlineSparkles, HiOutlineTruck } from 'react-icons/hi2';
import { productService } from '../services/productService';

export const CustomerCart = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onClearCart }) => {
  const [checkoutStep, setCheckoutStep] = useState(1); // 1: Cart, 2: Checkout Form, 3: Success
  const [address, setAddress] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [placedOrderInfo, setPlacedOrderInfo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 150 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
      const trackingNumber = 'TRK' + Math.floor(100000000 + Math.random() * 900000000);

      const itemsPayload = cartItems.map((item) => ({
        product: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      await productService.checkout({
        orderId,
        trackingNumber,
        items: itemsPayload,
        subtotal,
        shipping,
        tax,
        total,
        address,
      });

      const newOrder = {
        orderId,
        date: new Date().toLocaleDateString(),
        items: [...cartItems],
        subtotal,
        shipping,
        tax,
        total,
        address,
        status: 'AI Processing',
        trackingNumber,
      };

      const prevOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      localStorage.setItem('orders', JSON.stringify([newOrder, ...prevOrders]));

      setPlacedOrderInfo(newOrder);
      setCheckoutStep(3);
      onClearCart(); // Empty active cart
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Checkout failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetDrawer = () => {
    setCheckoutStep(1);
    setAddress('');
    setCardName('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
    setPlacedOrderInfo(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dimmed Overlay */}
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity"
        onClick={checkoutStep === 2 ? () => setCheckoutStep(1) : resetDrawer}
      />

      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        {/* Drawer Panel */}
        <div className="w-screen max-w-md transform bg-white shadow-2xl transition-transform dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800">
          <div className="flex h-full flex-col justify-between overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 p-6 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                🛒 {checkoutStep === 1 && 'Shopping Bag'}
                {checkoutStep === 2 && 'Secure Checkout'}
                {checkoutStep === 3 && 'Order Placed!'}
              </h2>
              <button
                onClick={checkoutStep === 3 ? resetDrawer : onClose}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                <HiOutlineXMark className="h-5 w-5" />
              </button>
            </div>

            {/* Step 1: Cart Items */}
            {checkoutStep === 1 && (
              <div className="flex flex-1 flex-col justify-between p-6 overflow-y-auto">
                {cartItems.length === 0 ? (
                  <div className="my-auto flex flex-col items-center justify-center text-center">
                    <span className="text-4xl">🛍️</span>
                    <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">Your bag is empty</h3>
                    <p className="mt-2 text-xs text-slate-500 max-w-[200px]">
                      Add some premium products to start shopping!
                    </p>
                    <button
                      onClick={onClose}
                      className="btn-primary mt-6 text-xs"
                    >
                      Browse Store
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Items List */}
                    <div className="space-y-4 overflow-y-auto max-h-[50vh] pr-1">
                      {cartItems.map((item) => (
                        <div
                          key={item._id}
                          className="flex gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-3 dark:border-slate-800/80 dark:bg-slate-900/30"
                        >
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-brand-600/10 text-lg font-bold text-brand-600 dark:bg-brand-500/20">
                            {item.name.charAt(0)}
                          </div>
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <div className="flex justify-between gap-2">
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[160px]">
                                  {item.name}
                                </h4>
                                <button
                                  onClick={() => onRemoveItem(item._id)}
                                  className="text-slate-400 hover:text-rose-500 transition"
                                >
                                  <HiOutlineTrash className="h-4 w-4" />
                                </button>
                              </div>
                              <p className="mt-0.5 text-[10px] text-slate-500 capitalize">{item.category}</p>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-0.5 dark:border-slate-800 dark:bg-slate-900">
                                <button
                                  onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
                                  className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                  <HiOutlineMinus className="h-3 w-3 text-slate-600 dark:text-slate-400" />
                                </button>
                                <span className="text-xs font-semibold px-1 text-slate-800 dark:text-slate-200">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                                  className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                  <HiOutlinePlus className="h-3 w-3 text-slate-600 dark:text-slate-400" />
                                </button>
                              </div>
                              <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                                ₹{item.price * item.quantity}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Summary Footer */}
                    <div className="mt-6 border-t border-slate-200 pt-6 dark:border-slate-800">
                      <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span className="font-semibold text-slate-900 dark:text-white">₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping</span>
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Estimated Tax (8%)</span>
                          <span className="font-semibold text-slate-900 dark:text-white">₹{tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-100 pt-3 text-sm font-extrabold dark:border-slate-800">
                          <span className="text-slate-900 dark:text-white">Total</span>
                          <span className="text-brand-600 dark:text-brand-400">₹{total.toFixed(2)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setCheckoutStep(2)}
                        className="btn-primary mt-6 w-full text-xs font-bold py-3"
                      >
                        Proceed to Checkout 🚀
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Step 2: Shipping & Credit Card Info */}
            {checkoutStep === 2 && (
              <form onSubmit={handleCheckoutSubmit} className="flex flex-1 flex-col justify-between p-6 overflow-y-auto">
                <div className="space-y-4">
                  {/* Shipping Address */}
                  <div>
                    <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Shipping Address
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="123 Smart E-Commerce Blvd, San Francisco, CA"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>

                  {/* Payment Title */}
                  <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                      <HiOutlineCreditCard className="h-4 w-4 text-brand-500" />
                      Mock Secure Card Payment
                    </h3>
                  </div>

                  {/* Sleek Credit Card Showcase */}
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-950 p-6 text-white shadow-xl shadow-brand-500/25">
                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
                    <div className="flex justify-between">
                      <span className="text-xs font-bold tracking-wider">SMARTPAY SECURE</span>
                      <HiOutlineSparkles className="h-5 w-5 text-brand-300 animate-pulse" />
                    </div>
                    <div className="mt-8">
                      <p className="text-md font-mono tracking-widest text-slate-100">
                        {cardNumber ? cardNumber.replace(/(\d{4})/g, '$1 ').trim() : '•••• •••• •••• ••••'}
                      </p>
                    </div>
                    <div className="mt-8 flex justify-between">
                      <div>
                        <p className="text-[8px] font-medium uppercase tracking-wider text-brand-200">Card Holder</p>
                        <p className="text-[10px] font-bold tracking-wider uppercase">{cardName || 'YOUR FULL NAME'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] font-medium uppercase tracking-wider text-brand-200">Expires</p>
                        <p className="text-[10px] font-bold tracking-wider">{cardExpiry || 'MM/YY'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Card Form */}
                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block text-[10px] font-medium text-slate-500 dark:text-slate-400">Cardholder Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="input-field"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] font-medium text-slate-500 dark:text-slate-400">Card Number</label>
                      <input
                        type="text"
                        maxLength="16"
                        pattern="\d{16}"
                        placeholder="4111222233334444"
                        className="input-field"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-[10px] font-medium text-slate-500 dark:text-slate-400">Expiration Date</label>
                        <input
                          type="text"
                          maxLength="5"
                          placeholder="MM/YY"
                          className="input-field"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-medium text-slate-500 dark:text-slate-400">CVV/CVC</label>
                        <input
                          type="password"
                          maxLength="3"
                          pattern="\d{3}"
                          placeholder="123"
                          className="input-field"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subtotal + Pay trigger */}
                <div className="mt-6 border-t border-slate-200 pt-6 dark:border-slate-800">
                  <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200 mb-4">
                    <span>Payable Total:</span>
                    <span className="text-brand-600 dark:text-brand-400 text-sm">₹{total.toFixed(2)}</span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep(1)}
                      className="btn-secondary flex-1 py-3 text-xs"
                    >
                      Back to Bag
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary flex-[2] py-3 text-xs font-bold"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Processing Security...
                        </div>
                      ) : (
                        `🔒 Pay ₹${total.toFixed(2)}`
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Step 3: Success Confirmation Animation */}
            {checkoutStep === 3 && placedOrderInfo && (
              <div className="flex flex-1 flex-col items-center justify-center p-8 text-center my-auto animate-fade-in">
                {/* Custom SVG Checkmark Draw Animation */}
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                  <span className="absolute inset-0 rounded-full border border-emerald-500/30 animate-ping duration-1000" />
                  <HiOutlineCheckCircle className="h-12 w-12" />
                </div>

                <h3 className="mt-6 text-lg font-black text-slate-900 dark:text-white">
                  Payment Authorized!
                </h3>
                <p className="mt-2 text-xs text-slate-500 max-w-[280px]">
                  Thank you for shopping! Your payment was verified securely and routed to our warehouse optimization.
                </p>

                {/* AI Logistics Box */}
                <div className="mt-6 w-full rounded-2xl border border-brand-500/20 bg-brand-500/5 p-4 dark:bg-brand-500/10">
                  <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400">
                    <HiOutlineSparkles className="h-4 w-4 animate-spin duration-3000" />
                    <span className="text-[10px] font-black uppercase tracking-wider">AI Logistics Optimization</span>
                  </div>
                  <p className="mt-2 text-left text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    <span className="font-bold text-slate-800 dark:text-slate-200">Status:</span> Order assigned to nearest robotic sorting terminal. AI optimized dispatch path generated successfully.
                  </p>
                  <div className="mt-3 border-t border-brand-500/10 pt-3 text-left text-[10px] text-slate-500 space-y-1">
                    <div>
                      <span className="font-semibold">Order ID:</span> {placedOrderInfo.orderId}
                    </div>
                    <div>
                      <span className="font-semibold">Tracking #:</span> {placedOrderInfo.trackingNumber}
                    </div>
                    <div>
                      <span className="font-semibold">Shipping to:</span> {placedOrderInfo.address}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex w-full gap-3">
                  <button
                    onClick={() => {
                      resetDrawer();
                      // Redirect to orders
                      window.location.hash = ''; // Clear routes if any
                      window.history.pushState({}, '', '/orders');
                      // Trigger custom window popstate event to let router refresh
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }}
                    className="btn-secondary w-full text-xs"
                  >
                    📦 View Track Order
                  </button>
                  <button
                    onClick={resetDrawer}
                    className="btn-primary w-full text-xs"
                  >
                    🛍️ Keep Shopping
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
