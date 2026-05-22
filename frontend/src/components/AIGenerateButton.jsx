import { useState } from 'react';
import { HiSparkles } from 'react-icons/hi2';
import { IoCopy, IoCheckmark } from 'react-icons/io5';
import { LoadingSpinner } from './LoadingSpinner';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';

export const AIGenerateButton = ({ label, onGenerate, resultKey, onApply, compact }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const { copy, copied } = useCopyToClipboard();

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await onGenerate();
      const text = typeof data === 'string' ? data : Array.isArray(data) ? data.join(', ') : JSON.stringify(data);
      setResult(text);
    } catch {
      setResult('');
    } finally {
      setLoading(false);
    }
  };

  const displayResult = result || (resultKey ? '' : '');

  return (
    <div className={compact ? '' : 'space-y-3'}>
      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading}
        className="btn-secondary w-full border-brand-300 text-brand-700 dark:border-brand-600 dark:text-brand-300"
      >
        {loading ? <LoadingSpinner size="sm" /> : <HiSparkles className="h-4 w-4 text-brand-500" />}
        {label}
      </button>
      {displayResult && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
          <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{displayResult}</p>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => copy(displayResult)}
              className="flex items-center gap-1 text-xs text-brand-600 hover:underline"
            >
              {copied ? <IoCheckmark /> : <IoCopy />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            {onApply && (
              <button
                type="button"
                onClick={() => onApply(displayResult)}
                className="text-xs text-emerald-600 hover:underline"
              >
                Apply to form
              </button>
            )}
            <button
              type="button"
              onClick={handleGenerate}
              className="text-xs text-slate-500 hover:underline"
            >
              Regenerate
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
