import { useState } from 'react';
import { HiOutlineSparkles } from 'react-icons/hi2';
import { IoCopy, IoCheckmark } from 'react-icons/io5';
import { aiService } from '../services/aiService';
import { LoadingSpinner } from './LoadingSpinner';
import { Button } from './Button';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';

const INFO_SECTIONS = [
  { key: 'description', label: 'Product Description' },
  { key: 'tags', label: 'SEO Tags', isArray: true },
  { key: 'marketingCaption', label: 'Marketing Caption' },
  { key: 'adCopy', label: 'Ad Copy' },
  { key: 'socialPromo', label: 'Social Media Promo' },
  { key: 'seoTitle', label: 'SEO Title' },
  { key: 'metaDescription', label: 'Meta Description' },
  { key: 'keyFeatures', label: 'Key Features', isArray: true },
  { key: 'targetAudience', label: 'Target Audience' },
  { key: 'pricingStrategy', label: 'Pricing Strategy' },
  { key: 'competitorTips', label: 'Competitor Tips' },
  { key: 'imageSuggestions', label: 'Image Suggestions' },
  { key: 'seasonalPromotion', label: 'Promotion Ideas' },
];

export const ProductAIFullInfo = ({ payload, onApplyAll }) => {
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState(null);
  const [provider, setProvider] = useState('');
  const [isMock, setIsMock] = useState(false);
  const { copy, copied } = useCopyToClipboard();

  const handleGenerate = async () => {
    if (!payload.name || !payload.category) return;
    setLoading(true);
    try {
      const { data } = await aiService.generateFullInfo(payload);
      setInfo(data.data.fullInfo);
      setProvider(data.data.provider);
      setIsMock(data.data.mock);
    } catch {
      setInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const formatValue = (key, value) => {
    if (key === 'tags' || key === 'keyFeatures') {
      return Array.isArray(value) ? value.join(', ') : value;
    }
    return value;
  };

  const copyAll = () => {
    if (!info) return;
    const text = INFO_SECTIONS.map(({ key, label }) => {
      const val = formatValue(key, info[key]);
      return val ? `## ${label}\n${val}\n` : '';
    }).join('\n');
    copy(text);
  };

  return (
    <div className="rounded-2xl border border-brand-200 bg-brand-50/50 p-4 dark:border-brand-800 dark:bg-brand-900/20">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="flex items-center gap-2 font-semibold text-brand-800 dark:text-brand-300">
            <HiOutlineSparkles className="h-5 w-5" />
            Generate Complete Product Info (Gemini / AI)
          </h4>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Gets description, SEO, marketing, audience, features, pricing tips & more in one click
          </p>
        </div>
        <Button type="button" onClick={handleGenerate} disabled={loading || !payload.name}>
          {loading ? <LoadingSpinner size="sm" /> : null}
          {loading ? 'Generating...' : 'Generate All Info'}
        </Button>
      </div>

      {provider && (
        <p className="mt-2 text-xs text-slate-500">
          Provider: <span className="font-semibold capitalize">{provider}</span>
          {isMock && ' (demo mode — add GEMINI_API_KEY in backend/.env)'}
        </p>
      )}

      {info && (
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={copyAll} className="flex items-center gap-1 text-xs text-brand-600 hover:underline">
              {copied ? <IoCheckmark /> : <IoCopy />}
              Copy all
            </button>
            {onApplyAll && (
              <button type="button" onClick={() => onApplyAll(info)} className="text-xs text-emerald-600 hover:underline">
                Apply all to form
              </button>
            )}
            <button type="button" onClick={handleGenerate} className="text-xs text-slate-500 hover:underline">
              Regenerate
            </button>
          </div>
          <div className="max-h-80 space-y-3 overflow-y-auto rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
            {INFO_SECTIONS.map(({ key, label, isArray }) =>
              info[key] ? (
                <div key={key}>
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{label}</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">
                    {isArray && Array.isArray(info[key])
                      ? info[key].map((item, i) => (
                          <span key={i} className="mr-2 inline-block rounded bg-slate-100 px-2 py-0.5 dark:bg-slate-800">
                            {item}
                          </span>
                        ))
                      : info[key]}
                  </p>
                </div>
              ) : null
            )}
          </div>
        </div>
      )}
    </div>
  );
};
