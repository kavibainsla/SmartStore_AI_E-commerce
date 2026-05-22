import { useState } from 'react';
import { HiOutlineSparkles, HiOutlineTag } from 'react-icons/hi2';
import { aiService } from '../services/aiService';
import { LoadingSpinner } from './LoadingSpinner';
import { useToast } from '../context/ToastContext';

const emptyForm = {
  name: '',
  description: '',
  category: '',
  image: '',
  price: '',
  stock: '',
  tags: '',
  sales: 0,
  revenue: 0,
  status: 'active',
  aiContent: {
    marketingCaption: '',
    adCopy: '',
    socialPromo: '',
  }
};

// ─── AI Section Component ──────────────────────────────────────────────────────
const AISection = ({ label, icon, content, onApply, onGenerate, onRegenerate, loading }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(Array.isArray(content) ? content.join(', ') : content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayText = Array.isArray(content) ? content.join(', ') : content;

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 dark:border-slate-700 dark:bg-slate-800/40">
      <div className="flex items-center justify-between mb-2">
        <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
          {icon}
          {label}
        </p>
        <div className="flex items-center gap-2">
          {onApply && displayText && (
            <button
              type="button"
              onClick={() => onApply(content)}
              className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 hover:underline"
            >
              ✓ Apply
            </button>
          )}
          {displayText && (
            <button
              type="button"
              onClick={handleCopy}
              className="text-[10px] font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 hover:underline"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          )}
          {displayText && onRegenerate && (
            <button
              type="button"
              onClick={onRegenerate}
              disabled={loading}
              className="text-[10px] font-medium text-brand-500 hover:text-brand-600 hover:underline disabled:opacity-50"
            >
              {loading ? '...' : '↺ Retry'}
            </button>
          )}
        </div>
      </div>
      {loading ? (
        <div className="flex items-center gap-2 py-2 text-xs text-slate-500">
          <LoadingSpinner size="sm" /> <span>Generating with Gemini AI...</span>
        </div>
      ) : displayText ? (
        <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{displayText}</p>
      ) : (
        <div className="flex flex-col items-start gap-2 py-1">
          <p className="text-xs text-slate-400 italic">Not generated yet.</p>
          <button
            type="button"
            onClick={onGenerate}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-3 py-1.5 text-[10px] font-bold text-white shadow-sm hover:shadow-purple-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          >
            <HiOutlineSparkles className="h-3 w-3 animate-pulse text-purple-200" />
            <span>Generate {label.replace('AI ', '')}</span>
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Main ProductForm ──────────────────────────────────────────────────────────
export const ProductForm = ({ initial, onSubmit, onCancel, loading }) => {
  const [form, setForm] = useState(() => {
    const f = initial || emptyForm;
    return {
      ...emptyForm,
      ...f,
      aiContent: {
        marketingCaption: '',
        adCopy: '',
        socialPromo: '',
        ...(f.aiContent || {}),
      }
    };
  });

  const [aiContent, setAiContent] = useState(() => {
    if (initial) {
      return {
        description: initial.description || '',
        tags: initial.tags || [],
        marketingCaption: initial.aiContent?.marketingCaption || '',
        adCopy: initial.aiContent?.adCopy || '',
        socialPromo: initial.aiContent?.socialPromo || '',
      };
    }
    return null;
  });

  const [aiLoading, setAiLoading] = useState(false);
  const [sectionLoading, setSectionLoading] = useState({});
  const [detectingCategory, setDetectingCategory] = useState(false);
  const toast = useToast();

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const updateAiContent = (field, value) => {
    setForm((f) => ({
      ...f,
      aiContent: {
        ...(f.aiContent || {}),
        [field]: value,
      },
    }));
  };

  const aiPayload = () => ({
    name: form.name,
    category: form.category,
    price: parseFloat(form.price) || 0,
    stock: parseInt(form.stock, 10) || 0,
    description: form.description,
    productId: form._id,
  });

  // ── AI Category Auto-Detection ──
  const handleDetectCategory = async () => {
    if (!form.name) {
      toast.error('Enter a product name first.');
      return;
    }
    setDetectingCategory(true);
    try {
      const { data } = await aiService.detectCategory({
        name: form.name,
        description: form.description || '',
      });
      const detected = data.data.category;
      if (detected) {
        update('category', detected);
        toast.success(`🪄 AI Detected Category: "${detected}" applied successfully!`);
      } else {
        toast.error('Could not detect category.');
      }
    } catch (err) {
      toast.error('Category detection failed. Standard category "Electronics" assigned.');
      update('category', 'Electronics');
    } finally {
      setDetectingCategory(false);
    }
  };

  // ── Generate All AI Content ──
  const handleGenerateAll = async () => {
    if (!form.name) {
      toast.error('Enter a product name first.');
      return;
    }
    setAiLoading(true);
    try {
      const { data } = await aiService.generateFullInfo(aiPayload());
      const info = data.data.fullInfo;
      setAiContent({
        description: info.description,
        tags: info.tags,
        marketingCaption: info.marketingCaption,
        adCopy: info.adCopy,
        socialPromo: info.socialPromo,
      });
      toast.success('✨ AI content generated for all sections!');
    } catch (err) {
      toast.error('AI generation failed. Check your Gemini API key.');
    } finally {
      setAiLoading(false);
    }
  };

  // ── Regenerate a single section ──
  const regenerateSection = async (section) => {
    if (!form.name) {
      toast.error('Enter a product name first.');
      return;
    }
    setSectionLoading((s) => ({ ...s, [section]: true }));
    try {
      let text = '';
      const payload = aiPayload();
      if (section === 'description') {
        const { data } = await aiService.generateDescription(payload);
        text = data.data.description;
      } else if (section === 'tags') {
        const { data } = await aiService.generateTags(payload);
        text = data.data.tags;
      } else if (section === 'marketingCaption') {
        const { data } = await aiService.generateCaption(payload);
        text = data.data.caption;
      } else if (section === 'adCopy') {
        const { data } = await aiService.generateAdCopy(payload);
        text = data.data.adCopy;
      } else if (section === 'socialPromo') {
        const { data } = await aiService.generateSocial(payload);
        text = data.data.socialPromo;
      }
      setAiContent((prev) => ({ ...prev, [section]: text }));
      toast.success(`✨ Generated AI ${section === 'marketingCaption' ? 'Marketing Caption' : section === 'adCopy' ? 'Ad Copy' : section === 'socialPromo' ? 'Social Promo' : section}!`);
    } catch {
      toast.error('Generation failed.');
    } finally {
      setSectionLoading((s) => ({ ...s, [section]: false }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock, 10),
      sales: parseInt(form.sales, 10) || 0,
      revenue: parseFloat(form.revenue) || 0,
      tags: typeof form.tags === 'string' ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : form.tags,
    });
  };

  const standardCategories = ['Electronics', 'Apparel', 'Accessories', 'Home & Kitchen', 'Sports & Outdoors', 'Beauty', 'Books'];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* ── PRODUCT FIELDS ── */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Product Name *</label>
          <input
            className="input-field"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            required
            placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
          />
        </div>

        {/* Category & Status Selection */}
        <div className="sm:col-span-2 grid gap-4 sm:grid-cols-3 items-end">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Category *</label>
            <div className="flex gap-2">
              <select
                className="input-field"
                value={
                  standardCategories.includes(form.category)
                    ? form.category
                    : form.category === ''
                    ? ''
                    : 'Other'
                }
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'Other') {
                    update('category', '');
                  } else {
                    update('category', val);
                  }
                }}
                required
              >
                <option value="" disabled>Select Category...</option>
                {standardCategories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value="Other">Other (Type custom category below)</option>
              </select>

              <button
                type="button"
                onClick={handleDetectCategory}
                disabled={detectingCategory || !form.name}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none hover:shadow-purple-500/20"
                title="AI Auto-Detect Category"
              >
                {detectingCategory ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <HiOutlineSparkles className="h-4 w-4 animate-pulse text-purple-200" />
                )}
                <span>{detectingCategory ? 'Detecting...' : 'AI Category'}</span>
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
            <select className="input-field" value={form.status} onChange={(e) => update('status', e.target.value)}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Conditional custom category input */}
          {(!standardCategories.includes(form.category) || form.category === '') && (
            <div className="sm:col-span-3 mt-1 animate-fadeIn">
              <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Custom Category *</label>
              <input
                className="input-field"
                value={form.category}
                onChange={(e) => update('category', e.target.value)}
                required
                placeholder="Type custom category name e.g. Office Supplies"
              />
            </div>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Price (₹) *</label>
          <input
            type="number"
            step="0.01"
            className="input-field"
            value={form.price}
            onChange={(e) => update('price', e.target.value)}
            required
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Stock *</label>
          <input
            type="number"
            className="input-field"
            value={form.stock}
            onChange={(e) => update('stock', e.target.value)}
            required
            placeholder="0"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Image URL</label>
          <input
            className="input-field"
            value={form.image}
            onChange={(e) => update('image', e.target.value)}
            placeholder="https://..."
          />
        </div>

        {/* Description field */}
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
          <textarea
            className="input-field min-h-[90px]"
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="Enter product description or use AI to generate..."
          />
        </div>

        {/* Tags field */}
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Tags <span className="text-slate-400 font-normal">(comma-separated)</span>
          </label>
          <input
            className="input-field"
            value={Array.isArray(form.tags) ? form.tags.join(', ') : form.tags}
            onChange={(e) => update('tags', e.target.value)}
            placeholder="wireless, premium, bestseller..."
          />
        </div>

        {/* Sales & Revenue */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Sales Count</label>
          <input
            type="number"
            className="input-field"
            value={form.sales}
            onChange={(e) => update('sales', e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Revenue (₹)</label>
          <input
            type="number"
            step="0.01"
            className="input-field"
            value={form.revenue}
            onChange={(e) => update('revenue', e.target.value)}
          />
        </div>

        {/* ── AI MARKETING & PROMOTION FIELDS ── */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/40 p-4 dark:border-slate-700 dark:bg-slate-800/20 sm:col-span-2">
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            AI Marketing & Promotions (Optional)
          </h4>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">Marketing Caption</label>
              <textarea
                className="input-field min-h-[60px] text-xs"
                value={form.aiContent?.marketingCaption || ''}
                onChange={(e) => updateAiContent('marketingCaption', e.target.value)}
                placeholder="Catchy caption applied from AI or written manually..."
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">Digital Ad Copy</label>
                <textarea
                  className="input-field min-h-[60px] text-xs"
                  value={form.aiContent?.adCopy || ''}
                  onChange={(e) => updateAiContent('adCopy', e.target.value)}
                  placeholder="Short ad copy..."
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">Social Media Promo</label>
                <textarea
                  className="input-field min-h-[60px] text-xs"
                  value={form.aiContent?.socialPromo || ''}
                  onChange={(e) => updateAiContent('socialPromo', e.target.value)}
                  placeholder="Instagram/Twitter post with hashtags..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── AI CONTENT GENERATOR ── */}
      <div className="rounded-2xl border border-brand-200 bg-brand-50/40 p-4 dark:border-brand-800/50 dark:bg-brand-950/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="flex items-center gap-2 text-sm font-bold text-brand-800 dark:text-brand-300">
              <HiOutlineSparkles className="h-4 w-4 text-brand-500" />
              AI Content Generator
            </h4>
            <p className="mt-0.5 text-[11px] text-slate-500">Generates description, SEO tags, marketing caption, ad copy & social promo via Gemini AI</p>
          </div>
          <button
            type="button"
            onClick={handleGenerateAll}
            disabled={aiLoading || !form.name}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none hover:shadow-brand-500/20"
          >
            {aiLoading ? <LoadingSpinner size="sm" /> : <HiOutlineSparkles className="h-3.5 w-3.5" />}
            {aiLoading ? 'Generating...' : 'Generate AI Content'}
          </button>
        </div>

        <div className="space-y-3">
          <AISection
            label="AI Description"
            icon={<HiOutlineSparkles className="h-3.5 w-3.5" />}
            content={aiContent?.description}
            loading={sectionLoading.description}
            onApply={(val) => {
              update('description', val);
              toast.success('✓ AI Description applied to form!');
            }}
            onGenerate={() => regenerateSection('description')}
            onRegenerate={() => regenerateSection('description')}
          />
          <AISection
            label="AI SEO Tags"
            icon={<HiOutlineTag className="h-3.5 w-3.5" />}
            content={aiContent?.tags}
            loading={sectionLoading.tags}
            onApply={(val) => {
              update('tags', Array.isArray(val) ? val.join(', ') : val);
              toast.success('✓ AI SEO Tags applied to form!');
            }}
            onGenerate={() => regenerateSection('tags')}
            onRegenerate={() => regenerateSection('tags')}
          />
          <AISection
            label="AI Marketing Caption"
            icon={<HiOutlineSparkles className="h-3.5 w-3.5" />}
            content={aiContent?.marketingCaption}
            loading={sectionLoading.marketingCaption}
            onApply={(val) => {
              updateAiContent('marketingCaption', val);
              toast.success('✓ AI Marketing Caption applied to form!');
            }}
            onGenerate={() => regenerateSection('marketingCaption')}
            onRegenerate={() => regenerateSection('marketingCaption')}
          />
          <AISection
            label="AI Ad Copy"
            icon={<HiOutlineSparkles className="h-3.5 w-3.5" />}
            content={aiContent?.adCopy}
            loading={sectionLoading.adCopy}
            onApply={(val) => {
              updateAiContent('adCopy', val);
              toast.success('✓ AI Ad Copy applied to form!');
            }}
            onGenerate={() => regenerateSection('adCopy')}
            onRegenerate={() => regenerateSection('adCopy')}
          />
          <AISection
            label="AI Social Promo"
            icon={<HiOutlineSparkles className="h-3.5 w-3.5" />}
            content={aiContent?.socialPromo}
            loading={sectionLoading.socialPromo}
            onApply={(val) => {
              updateAiContent('socialPromo', val);
              toast.success('✓ AI Social Promo applied to form!');
            }}
            onGenerate={() => regenerateSection('socialPromo')}
            onRegenerate={() => regenerateSection('socialPromo')}
          />
        </div>
      </div>

      {/* ── FORM ACTIONS ── */}
      <div className="flex justify-end gap-3 border-t border-slate-200 pt-4 dark:border-slate-700">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-all hover:scale-[1.02] active:scale-[0.98] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg hover:shadow-brand-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? 'Saving...' : initial?._id ? 'Update Product' : 'Add Product'}
        </button>
      </div>
    </form>
  );
};
