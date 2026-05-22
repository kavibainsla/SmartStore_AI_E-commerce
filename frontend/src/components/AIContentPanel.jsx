import { useState } from 'react';
import { HiOutlineSparkles } from 'react-icons/hi2';
import { IoCopy, IoCheckmark } from 'react-icons/io5';
import { LoadingSpinner } from './LoadingSpinner';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';

/**
 * Reusable panel for displaying AI-generated content with copy & regenerate
 */
export const AIContentPanel = ({ title, onGenerate, onApply, initialContent = '' }) => {
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(false);
  const { copy, copied } = useCopyToClipboard();

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await onGenerate();
      const text = typeof result === 'string' ? result : Array.isArray(result) ? result.join(', ') : String(result);
      setContent(text);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h4>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline"
        >
          {loading ? <LoadingSpinner size="sm" /> : <HiOutlineSparkles className="h-4 w-4" />}
          Generate
        </button>
      </div>
      {content && (
        <div className="mt-3">
          <p className="whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-400">{content}</p>
          <div className="mt-2 flex gap-3">
            <button type="button" onClick={() => copy(content)} className="flex items-center gap-1 text-xs text-brand-600">
              {copied ? <IoCheckmark /> : <IoCopy />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            {onApply && (
              <button type="button" onClick={() => onApply(content)} className="text-xs text-emerald-600 hover:underline">
                Apply
              </button>
            )}
            <button type="button" onClick={handleGenerate} className="text-xs text-slate-500 hover:underline">
              Regenerate
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
