import { useState, useCallback } from 'react';
import { productService } from '../services/productService';

export const useProducts = (initialParams = {}) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const merged = { ...initialParams, ...params };
      const { data } = await productService.getAll(merged);
      setProducts(data.data);
      setCategories(data.categories || []);
      setPagination(data.pagination);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
      return null;
    } finally {
      setLoading(false);
    }
  }, [initialParams]);

  return { products, categories, pagination, loading, error, fetchProducts, setProducts };
};
