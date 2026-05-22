import { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { CustomerHeader } from '../components/CustomerHeader';
import { CustomerCart } from '../components/CustomerCart';
import { GeminiAssistantWidget } from '../components/GeminiAssistantWidget';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import { HiOutlineShoppingCart, HiOutlineSparkles, HiOutlineTag, HiOutlineCheck, HiOutlineInbox, HiOutlineXMark } from 'react-icons/hi2';

export default function CustomerStore() {
  const { user } = useAuth();
  const toast = useToast();
  
  if (user && user.role !== 'customer') {
    return <Navigate to="/dashboard" replace />;
  }

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter and Search states
  const [searchVal, setSearchVal] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('-createdAt'); // price-asc, price-desc, rating

  // Cart State (Persist in LocalStorage)
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  });
  const [cartOpen, setCartOpen] = useState(false);

  // Detail Modal State
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch Products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await productService.getAll();
      setProducts(data.data || []);
      setCategories(data.categories || []);
    } catch {
      toast.error('Failed to load store products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Save Cart to LocalStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Cart Handlers
  const handleAddToCart = (product, e) => {
    if (e) e.stopPropagation(); // Prevent detail modal triggers

    // Check stock limit
    if (product.stock <= 0) {
      toast.error('Product is out of stock!');
      return;
    }

    setCart((prev) => {
      const exists = prev.find((item) => item._id === product._id);
      if (exists) {
        if (exists.quantity >= product.stock) {
          return prev; // toast shown below
        }
        return prev.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    // Show toast ONCE — outside setCart so React Strict Mode doesn't double-fire it
    const alreadyInCart = cart.find((item) => item._id === product._id);
    if (alreadyInCart) {
      if (alreadyInCart.quantity >= product.stock) {
        toast.error('Cannot add more items than available stock!');
      } else {
        toast.success(`Updated ${product.name} quantity!`);
      }
    } else {
      toast.success(`Added ${product.name} to cart!`);
    }
  };

  const handleUpdateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      handleRemoveItem(id);
      return;
    }
    const product = products.find(p => p._id === id);
    if (product && quantity > product.stock) {
      toast.error(`Only ${product.stock} items are available in stock.`);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item._id === id ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
    toast.success('Removed item from cart.');
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Filter & Sort Calculations
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name?.toLowerCase().includes(searchVal.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchVal.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchVal.toLowerCase()) ||
        (Array.isArray(product.tags) && product.tags.some((t) => t?.toLowerCase().includes(searchVal.toLowerCase())));
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'stock-asc') return a.stock - b.stock;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Static Premium Hero Promos (Uses first 3 products, falls back to placeholders)
  const heroProducts = products.slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 pb-20">
      <CustomerHeader
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
        searchVal={searchVal}
        onSearchChange={setSearchVal}
      />

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* HERO PROMOTIONAL BANNER */}
        {products.length > 0 && !loading && (
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-brand-950 to-slate-950 p-8 sm:p-12 text-white mb-10 shadow-2xl shadow-brand-500/10 border border-white/5">
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-brand-500/15 blur-3xl" />
            <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-indigo-500/15 blur-3xl" />
            
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/20 px-3 py-1 text-xs font-black tracking-wider text-brand-400">
                  <HiOutlineSparkles className="h-4 w-4 animate-spin duration-3000" />
                  AI-POWERED E-COMMERCE
                </span>
                <h2 className="text-3xl sm:text-5xl font-black leading-tight bg-gradient-to-r from-white via-slate-100 to-brand-300 bg-clip-text text-transparent">
                  Smart E-Commerce, Driven by Gemini.
                </h2>
                <p className="text-sm text-slate-300 max-w-md leading-relaxed">
                  Browse standard tech catalog with auto-grounded real pricing, live product analysis assistant, and automated shipping timeline checks!
                </p>
                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      const element = document.getElementById('catalog');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="btn-primary text-xs font-black px-6 py-3"
                  >
                    🛍️ Browse Premium Products
                  </button>
                </div>
              </div>

              {/* Featured Showcase Item */}
              {heroProducts[0] && (
                <div 
                  onClick={() => setSelectedProduct(heroProducts[0])}
                  className="glass-card bg-white/5 border-white/10 p-5 md:max-w-md ml-auto w-full cursor-pointer hover:border-brand-500/50 hover:bg-white/10 transition group"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="rounded-full bg-brand-600 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white">
                      🔥 AI Hot Pick
                    </span>
                    <span className="text-xs font-black text-brand-400 group-hover:underline">View Details →</span>
                  </div>
                  {/* Hero product image */}
                  {heroProducts[0].image && (
                    <div className="mb-3 h-32 w-full overflow-hidden rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center p-2">
                      <img
                        src={heroProducts[0].image}
                        alt={heroProducts[0].name}
                        className="max-h-full max-w-full object-contain opacity-95 group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  )}
                  <h3 className="text-base font-black text-white line-clamp-1">{heroProducts[0].name}</h3>
                  <p className="mt-1 text-xs text-slate-300 line-clamp-2">{heroProducts[0].description}</p>
                  <div className="mt-4 flex justify-between items-center border-t border-white/5 pt-3">
                    <span className="text-2xl font-black text-white">₹{heroProducts[0].price}</span>
                    <button
                      onClick={(e) => handleAddToCart(heroProducts[0], e)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white text-slate-900 px-4 py-2 text-xs font-bold shadow-md hover:bg-slate-100 transition active:scale-95"
                    >
                      <HiOutlineShoppingCart className="h-4 w-4" />
                      Add to Bag
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dynamic Category Navigation pills */}
        <div id="catalog" className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
          <div className="flex flex-wrap gap-2 overflow-x-auto max-w-full py-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`rounded-xl px-4 py-2 text-xs font-extrabold transition-all active:scale-[0.97] ${
                selectedCategory === 'all'
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:border-slate-800'
              }`}
            >
              🏷️ All Products
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-4 py-2 text-xs font-extrabold transition-all uppercase active:scale-[0.97] ${
                  selectedCategory === cat
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex gap-2 shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 focus:border-brand-500"
            >
              <option value="-createdAt">✨ Newest Arrivals</option>
              <option value="price-asc">💵 Price: Low to High</option>
              <option value="price-desc">💵 Price: High to Low</option>
              <option value="stock-asc">⚠️ Low Inventory Alerts</option>
            </select>
          </div>
        </div>

        {/* LOADING INDICATOR */}
        {loading ? (
          <div className="flex h-96 items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Empty Catalog */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-900 dark:text-slate-600 mb-4">
              <HiOutlineInbox className="h-8 w-8" />
            </div>
            <h3 className="text-md font-bold text-slate-950 dark:text-white">No products found</h3>
            <p className="text-xs text-slate-500 max-w-[280px] mt-2 leading-relaxed">
              We couldn&apos;t find any products matching &quot;{searchVal}&quot; or in category &quot;{selectedCategory}&quot;. Try adjusting your filters.
            </p>
          </div>
        ) : (
          /* PRODUCTS GRID */
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => {
              const isLowStock = product.stock > 0 && product.stock <= 10;
              const isOutOfStock = product.stock <= 0;

              return (
                <div
                  key={product._id}
                  onClick={() => setSelectedProduct(product)}
                  className="glass-card-light dark:glass-card cursor-pointer p-5 flex flex-col justify-between hover:border-brand-500/30 transition group duration-300 relative overflow-hidden"
                >
                  <div>
                    {/* Badge row */}
                    <div className="flex justify-between items-center mb-4">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        📁 {product.category}
                      </span>
                      {isOutOfStock ? (
                        <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-[9px] font-black tracking-wider text-rose-700 dark:bg-rose-950/40 dark:text-rose-400">
                          🚨 Out of Stock
                        </span>
                      ) : isLowStock ? (
                        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[9px] font-black tracking-wider text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                          ⚠️ Low Stock: {product.stock} left
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[9px] font-black tracking-wider text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                          ✓ Instock: {product.stock}
                        </span>
                      )}
                    </div>

                    {/* Product Image and Title */}
                    <div className="space-y-3">
                      {/* Product Image */}
                      <div className="relative h-36 w-full overflow-hidden rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center p-3 border border-slate-100 dark:border-slate-800 transition-all duration-300">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div
                          style={{ display: product.image ? 'none' : 'flex' }}
                          className="absolute inset-0 items-center justify-center text-3xl font-black text-brand-600/40 dark:text-brand-400/40"
                        >
                          {product.name.charAt(0)}
                        </div>
                      </div>
                      {/* Title and Rating */}
                      <div className="space-y-1">
                        <h3 className="text-xs font-black leading-snug text-slate-900 dark:text-white line-clamp-2 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors">
                          {product.name}
                        </h3>
                        {/* Rating */}
                        <div className="flex items-center gap-1 text-[10px] text-amber-500">
                          <span>★ ★ ★ ★ ★</span>
                          <span className="text-slate-400 ml-1">(5.0)</span>
                        </div>
                      </div>
                    </div>

                    <p className="mt-4 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {product.description || 'No description details supplied for this premium item.'}
                    </p>
                  </div>

                  {/* Pricing Footer */}
                  <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800/80 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">Store Price</p>
                      <p className="text-lg font-black text-slate-950 dark:text-white">₹{product.price}</p>
                    </div>
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      disabled={isOutOfStock}
                      className="inline-flex items-center justify-center gap-1 rounded-xl bg-brand-600 text-white px-3.5 py-2 text-xs font-bold shadow-md shadow-brand-600/25 hover:bg-brand-500 hover:shadow-brand-500/30 transition active:scale-95 disabled:pointer-events-none disabled:opacity-50"
                    >
                      <HiOutlineShoppingCart className="h-4 w-4" />
                      Add
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* DETAIL VIEW MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setSelectedProduct(null)} />
          
          <div className="relative w-full max-w-4xl rounded-3xl bg-white shadow-2xl dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden animate-slide-in">
            {/* Header close */}
            <div className="absolute right-4 top-4 z-10">
              <button
                onClick={() => setSelectedProduct(null)}
                className="rounded-full bg-slate-100 p-2 text-slate-400 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800"
              >
                <HiOutlineXMark className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[85vh] overflow-y-auto">
              
              {/* Product Details Section */}
              <div className="lg:col-span-7 p-6 sm:p-8 space-y-5 overflow-y-auto">
                {/* Product Image */}
                {selectedProduct.image && (
                  <div className="relative h-72 w-full overflow-hidden rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center p-4 border border-slate-150 dark:border-slate-800">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="max-h-full max-w-full object-contain transition-transform duration-500 hover:scale-110"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-brand-100 px-3 py-1 text-[10px] font-black uppercase text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">
                    📂 {selectedProduct.category}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                    📦 Stock Level: {selectedProduct.stock}
                  </span>
                </div>

                <div className="space-y-2">
                  <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                    {selectedProduct.name}
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs text-amber-500">
                    <span>★ ★ ★ ★ ★</span>
                    <span className="text-slate-400 font-medium">(5.0 Average Customer Rating)</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Product Description</h3>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {selectedProduct.description || 'No description supplied.'}
                  </p>
                </div>

                {/* Keyword Tags */}
                {Array.isArray(selectedProduct.tags) && selectedProduct.tags.length > 0 && (
                  <div>
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Search Keywords</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProduct.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                        >
                          <HiOutlineTag className="h-3 w-3 text-slate-400" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price block */}
                <div className="border-t border-slate-100 pt-6 dark:border-slate-800/80 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Verified Market Value</p>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">₹{selectedProduct.price}</p>
                  </div>
                  <button
                    onClick={() => {
                      handleAddToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    disabled={selectedProduct.stock <= 0}
                    className="btn-primary px-8 py-3 text-xs font-bold"
                  >
                    <HiOutlineShoppingCart className="h-4 w-4" />
                    Add to Shopping Bag
                  </button>
                </div>
              </div>

              {/* Gemini Chat Assistant Panel */}
              <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-slate-200 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-950/50 flex flex-col justify-between overflow-y-auto">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <HiOutlineSparkles className="h-4 w-4 text-brand-500" />
                    Ask SmartStore Assistant
                  </h3>
                  <p className="text-[10px] text-slate-500 leading-normal">
                    This active chat utilizes your database fields alongside Gemini models to compose target social copies, specs list, and meta features.
                  </p>
                </div>
                <div className="mt-4">
                  <GeminiAssistantWidget product={selectedProduct} />
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Cart Slider Draw */}
      <CustomerCart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />
    </div>
  );
}
