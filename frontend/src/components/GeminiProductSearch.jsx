import { useState } from 'react';
import { HiOutlineSparkles, HiOutlineMagnifyingGlass, HiOutlineTag } from 'react-icons/hi2';
import { IoCheckmark, IoCartOutline } from 'react-icons/io5';
import { aiService } from '../services/aiService';
import { LoadingSpinner } from './LoadingSpinner';
import { useToast } from '../context/ToastContext';

export const GeminiProductSearch = ({ onAutofill }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState(null);
  const [provider, setProvider] = useState('');
  const [isMock, setIsMock] = useState(false);
  const [applied, setApplied] = useState(false);
  const toast = useToast();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setProductData(null);
    setApplied(false);

    try {
      const { data } = await aiService.fetchRealProduct(query);
      if (data.success && data.data.product) {
        setProductData(data.data.product);
        setProvider(data.data.provider);
        setIsMock(data.data.mock);
        toast.success('Successfully retrieved real product details!');
      } else {
        toast.error('Could not retrieve product information.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error communicating with AI services.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!productData) return;
    onAutofill(productData);
    setApplied(true);
    toast.success('Autofilled form with real product details!');
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50/70 to-indigo-50/40 p-5 shadow-sm transition-all duration-300 hover:shadow-md dark:border-brand-900/40 dark:from-brand-950/20 dark:to-indigo-950/10">
      {/* Decorative gradient orb */}
      <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-brand-400/10 blur-2xl dark:bg-brand-500/5"></div>
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h4 className="flex items-center gap-2 font-bold tracking-tight text-brand-800 dark:text-brand-300">
            <HiOutlineSparkles className="h-5 w-5 text-brand-600 animate-pulse" />
            Gemini Web Search Grounding Auto-Fill
          </h4>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Enter a real product name to retrieve actual market price, standard category, specs & tags from the web.
          </p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="mt-4 flex gap-2">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <HiOutlineMagnifyingGlass className="h-4 w-4" />
          </span>
          <input
            type="text"
            className="input-field pl-9 pr-4 text-sm shadow-inner transition-all duration-200 focus:ring-brand-500 focus:border-brand-500"
            placeholder="e.g. Apple iPhone 15 Pro Max 256GB or Sony WH-1000XM5"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:from-brand-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? <LoadingSpinner size="sm" /> : <HiOutlineSparkles className="h-4 w-4" />}
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {provider && (
        <div className="mt-3 flex items-center justify-between text-[10px] font-semibold tracking-wide text-slate-500 dark:text-slate-400">
          <span>AI ENGINE: <span className="text-brand-600 dark:text-brand-400 uppercase">{provider}</span></span>
          {isMock && (
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400">
              Demo Mode (Offline)
            </span>
          )}
          {!isMock && (
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              Live Google Search Grounded
            </span>
          )}
        </div>
      )}

      {productData && (
        <div className="mt-4 space-y-4 rounded-xl border border-slate-150 bg-white/80 p-4 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80 animate-fade-in">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
            <div className="space-y-1">
              <h5 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <IoCartOutline className="h-4 w-4 text-brand-600" />
                {productData.name}
              </h5>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <HiOutlineTag className="h-3.5 w-3.5" />
                  {productData.category}
                </span>
                {productData.price && (
                  <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                    Average Price: ${productData.price.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
            
            <button
              type="button"
              onClick={handleApply}
              disabled={applied}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                applied
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30'
                  : 'bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500'
              }`}
            >
              {applied ? <IoCheckmark className="h-3.5 w-3.5" /> : <HiOutlineSparkles className="h-3.5 w-3.5" />}
              {applied ? 'Applied to Form' : 'Auto-Fill Entire Form'}
            </button>
          </div>

          <div className="space-y-3 border-t border-slate-100 pt-3 dark:border-slate-800">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-brand-600">Product Description</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-3">
                {productData.description}
              </p>
            </div>

            {productData.keyFeatures && productData.keyFeatures.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-brand-600">Specs & Grounded Features</p>
                <ul className="mt-1 grid gap-1 text-[11px] text-slate-600 dark:text-slate-400 sm:grid-cols-2">
                  {productData.keyFeatures.map((feat, index) => (
                    <li key={index} className="flex items-center gap-1">
                      <span className="h-1 w-1 rounded-full bg-brand-500"></span>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {productData.tags && productData.tags.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-brand-600">Grounded SEO Tags</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {productData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="rounded bg-brand-50 px-1.5 py-0.5 text-[10px] font-medium text-brand-700 dark:bg-brand-950/20 dark:text-brand-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
