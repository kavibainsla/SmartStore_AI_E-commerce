import { useState } from 'react';
import { aiService } from '../services/aiService';
import { AIGenerateButton } from './AIGenerateButton';
import { ProductAIFullInfo } from './ProductAIFullInfo';

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
};

export const ProductForm = ({ initial, onSubmit, onCancel, loading }) => {
  const [form, setForm] = useState(initial || emptyForm);

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const aiPayload = () => ({
    name: form.name,
    category: form.category,
    price: parseFloat(form.price) || 0,
    stock: parseInt(form.stock, 10) || 0,
    description: form.description,
    productId: form._id,
  });

  const applyFullInfo = (info) => {
    if (!info) return;
    if (info.description) update('description', info.description);
    if (info.tags?.length) update('tags', info.tags.join(', '));
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

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <ProductAIFullInfo payload={aiPayload()} onApplyAll={applyFullInfo} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Product Name</label>
          <input className="input-field" value={form.name} onChange={(e) => update('name', e.target.value)} required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
          <input className="input-field" value={form.category} onChange={(e) => update('category', e.target.value)} required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
          <select className="input-field" value={form.status} onChange={(e) => update('status', e.target.value)}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Price ($)</label>
          <input type="number" step="0.01" className="input-field" value={form.price} onChange={(e) => update('price', e.target.value)} required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Stock</label>
          <input type="number" className="input-field" value={form.stock} onChange={(e) => update('stock', e.target.value)} required />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Image URL</label>
          <input className="input-field" value={form.image} onChange={(e) => update('image', e.target.value)} placeholder="https://..." />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
          <textarea
            className="input-field min-h-[100px]"
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
          />
          <div className="mt-2">
            <AIGenerateButton
              label="AI Generate Description"
              onGenerate={async () => {
                const { data } = await aiService.generateDescription(aiPayload());
                return data.data.description;
              }}
              onApply={(text) => update('description', text)}
            />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Tags (comma-separated)</label>
          <input
            className="input-field"
            value={Array.isArray(form.tags) ? form.tags.join(', ') : form.tags}
            onChange={(e) => update('tags', e.target.value)}
          />
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <AIGenerateButton
              label="AI Generate SEO Tags"
              compact
              onGenerate={async () => {
                const { data } = await aiService.generateTags(aiPayload());
                return data.data.tags?.join(', ') || '';
              }}
              onApply={(text) => update('tags', text)}
            />
            <AIGenerateButton
              label="AI Marketing Caption"
              compact
              onGenerate={async () => {
                const { data } = await aiService.generateCaption(aiPayload());
                return data.data.caption;
              }}
            />
            <AIGenerateButton
              label="AI Ad Copy"
              compact
              onGenerate={async () => {
                const { data } = await aiService.generateAdCopy(aiPayload());
                return data.data.adCopy;
              }}
            />
            <AIGenerateButton
              label="AI Social Promo"
              compact
              onGenerate={async () => {
                const { data } = await aiService.generateSocial(aiPayload());
                return data.data.socialPromo;
              }}
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Sales Count</label>
          <input type="number" className="input-field" value={form.sales} onChange={(e) => update('sales', e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Revenue ($)</label>
          <input type="number" step="0.01" className="input-field" value={form.revenue} onChange={(e) => update('revenue', e.target.value)} />
        </div>
      </div>
      <div className="flex justify-end gap-3 border-t border-slate-200 pt-4 dark:border-slate-700">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Saving...' : initial?._id ? 'Update Product' : 'Add Product'}
        </button>
      </div>
    </form>
  );
};
