import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HiOutlinePlus } from 'react-icons/hi2';
import { HiOutlineCube } from 'react-icons/hi';
import { productService } from '../services/productService';
import { ProductTable } from '../components/ProductTable';
import { ProductForm } from '../components/ProductForm';
import { ProductFilters } from '../components/ProductFilters';
import { Modal } from '../components/Modal';
import { EmptyState } from '../components/EmptyState';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { Pagination } from '../components/Pagination';
import { Button } from '../components/Button';
import { useToast } from '../context/ToastContext';
import { useDebounce } from '../hooks/useDebounce';
import { DEFAULT_PAGE_SIZE, LOW_STOCK_THRESHOLD } from '../utils/constants';

export default function Products() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [lowStock, setLowStock] = useState(searchParams.get('lowStock') === 'true');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('-createdAt');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const debouncedSearch = useDebounce(search);
  const toast = useToast();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await productService.getAll({
        search: debouncedSearch,
        category,
        status,
        lowStock: lowStock ? 'true' : undefined,
        page,
        limit: DEFAULT_PAGE_SIZE,
        sort,
      });
      setProducts(data.data);
      setCategories(data.categories || []);
      setPagination(data.pagination);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [debouncedSearch, category, status, lowStock, page, sort]);

  const handleSave = async (formData) => {
    setSaving(true);
    try {
      if (editing?._id) {
        await productService.update(editing._id, formData);
        toast.success('Product updated');
      } else {
        await productService.create(formData);
        toast.success('Product created');
      }
      setModalOpen(false);
      setEditing(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await productService.delete(deleteTarget._id);
      toast.success('Product deleted');
      setDeleteTarget(null);
      fetchProducts();
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  const resetFilters = () => {
    setSearch('');
    setCategory('');
    setStatus('');
    setLowStock(false);
    setPage(1);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Product Management</h2>
          <p className="text-sm text-slate-500">{pagination.total || 0} products total</p>
        </div>
        <Button onClick={() => { setEditing(null); setModalOpen(true); }}>
          <HiOutlinePlus className="h-5 w-5" />
          Add Product
        </Button>
      </div>

      <ProductFilters
        search={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        category={category}
        onCategoryChange={(v) => { setCategory(v); setPage(1); }}
        categories={categories}
        status={status}
        onStatusChange={(v) => { setStatus(v); setPage(1); }}
        sort={sort}
        onSortChange={setSort}
        lowStock={lowStock}
        onLowStockChange={(v) => { setLowStock(v); setPage(1); }}
      />

      <div className="glass-card-light overflow-hidden dark:glass-card">
        {!loading && products.length === 0 ? (
          <EmptyState
            icon={HiOutlineCube}
            title="No products found"
            description="Add your first product or adjust filters"
            action={
              <>
                <Button onClick={() => setModalOpen(true)} className="mr-2">Add Product</Button>
                <Button variant="secondary" onClick={resetFilters}>Clear Filters</Button>
              </>
            }
          />
        ) : (
          <>
            <ProductTable
              products={products}
              threshold={LOW_STOCK_THRESHOLD}
              onEdit={(p) => {
                setEditing({ ...p, tags: p.tags?.join(', ') || '' });
                setModalOpen(true);
              }}
              onDelete={setDeleteTarget}
              loading={loading}
            />
            <Pagination page={page} pages={pagination.pages} onPageChange={setPage} />
          </>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        title={editing ? 'Edit Product' : 'Add Product'}
        size="lg"
      >
        <ProductForm
          initial={editing}
          onSubmit={handleSave}
          onCancel={() => { setModalOpen(false); setEditing(null); }}
          loading={saving}
        />
      </Modal>

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemName={deleteTarget?.name}
        loading={deleting}
      />
    </div>
  );
}
