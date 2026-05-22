import { useState, useEffect } from 'react';
import { HiOutlineSparkles, HiOutlineArrowPath } from 'react-icons/hi2';
import { IoCopy, IoCheckmark } from 'react-icons/io5';
import { aiService } from '../services/aiService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { useToast } from '../context/ToastContext';

export default function AIInsights() {
  const [insights, setInsights] = useState('');
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isMock, setIsMock] = useState(false);
  const [provider, setProvider] = useState('');
  const { copy, copied } = useCopyToClipboard();
  const toast = useToast();

  const generateInsights = async () => {
    setLoading(true);
    try {
      const { data } = await aiService.salesInsights();
      setInsights(data.data.insights);
      setSummary(data.data.businessData);
      setIsMock(data.data.mock);
      setProvider(data.data.provider || '');
      toast.success(
        data.data.mock
          ? `Insights generated (demo — add GEMINI_API_KEY)`
          : `AI insights generated via ${data.data.provider}`
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate insights');
    } finally {
      setLoading(false);
    }
  };

  const renderMarkdown = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('## ')) {
        return (
          <h3 key={i} className="mt-6 mb-2 text-lg font-semibold text-brand-600 dark:text-brand-400">
            {line.replace('## ', '')}
          </h3>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <h4 key={i} className="mt-4 mb-1 font-medium text-slate-800 dark:text-slate-200">
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.trim()) {
        return (
          <p key={i} className="mb-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {line}
          </p>
        );
      }
      return null;
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">AI Sales Insights</h2>
          <p className="text-sm text-slate-500">
            Gemini / AI-powered business recommendations based on your store data
          </p>
        </div>
        <button onClick={generateInsights} disabled={loading} className="btn-primary">
          {loading ? <LoadingSpinner size="sm" /> : <HiOutlineSparkles className="h-5 w-5" />}
          Generate Insights
        </button>
      </div>

      {summary && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Revenue', value: `₹${summary.totalRevenue?.toLocaleString('en-IN')}` },
            { label: 'Sales', value: summary.totalSales },
            { label: 'Products', value: summary.totalProducts },
            { label: 'Low Stock', value: summary.lowStockCount },
          ].map((s) => (
            <div key={s.label} className="stat-card text-center">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{s.value}</p>
              <p className="text-sm text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="glass-card-light p-6 dark:glass-card">
        {!insights && !loading && (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="mb-4 rounded-2xl bg-brand-100 p-4 dark:bg-brand-600/20">
              <HiOutlineSparkles className="h-12 w-12 text-brand-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Ready for AI Analysis</h3>
            <p className="mt-2 max-w-md text-sm text-slate-500">
              Click Generate Insights for full analysis — pricing, inventory, trends, growth & more.
            </p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center py-16">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-sm text-slate-500">Analyzing your store data with AI...</p>
          </div>
        )}

        {insights && !loading && (
          <>
            {(isMock || provider) && (
              <div className="mb-4 rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                {isMock
                  ? 'Demo mode: Add GEMINI_API_KEY (recommended) or OPENAI_API_KEY in backend/.env'
                  : `Powered by ${provider} — comprehensive store analysis`}
              </div>
            )}
            <div className="mb-4 flex gap-2">
              <button onClick={() => copy(insights)} className="btn-secondary text-sm">
                {copied ? <IoCheckmark /> : <IoCopy />}
                {copied ? 'Copied' : 'Copy All'}
              </button>
              <button onClick={generateInsights} className="btn-secondary text-sm">
                <HiOutlineArrowPath className="h-4 w-4" />
                Regenerate
              </button>
            </div>
            <div className="prose-sm max-w-none">{renderMarkdown(insights)}</div>
          </>
        )}
      </div>
    </div>
  );
}
