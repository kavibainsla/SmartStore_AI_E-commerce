import { HiOutlineMagnifyingGlass } from 'react-icons/hi2';
import { SORT_OPTIONS } from '../utils/constants';

export const ProductFilters = ({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categories,
  status,
  onStatusChange,
  sort,
  onSortChange,
  lowStock,
  onLowStockChange,
}) => (
  <div className="glass-card-light flex flex-wrap gap-3 p-4 dark:glass-card">
    <div className="relative min-w-[200px] flex-1">
      <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
      <input
        className="input-field pl-10"
        placeholder="Search products..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
    <select className="input-field w-auto" value={category} onChange={(e) => onCategoryChange(e.target.value)}>
      <option value="">All Categories</option>
      {categories.map((c) => (
        <option key={c} value={c}>{c}</option>
      ))}
    </select>
    <select className="input-field w-auto" value={status} onChange={(e) => onStatusChange(e.target.value)}>
      <option value="">All Status</option>
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </select>
    <select className="input-field w-auto" value={sort} onChange={(e) => onSortChange(e.target.value)}>
      {SORT_OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
    <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
      <input type="checkbox" checked={lowStock} onChange={(e) => onLowStockChange(e.target.checked)} />
      Low stock only
    </label>
  </div>
);
