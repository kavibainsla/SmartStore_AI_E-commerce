import { useState, useEffect, useCallback } from 'react';
import { analyticsService } from '../services/analyticsService';

export const useAnalytics = (autoFetch = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await analyticsService.getDashboard();
      setData(res.data.data);
      return res.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load analytics');
      setData(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) fetchDashboard();
  }, [autoFetch, fetchDashboard]);

  return { data, loading, error, refetch: fetchDashboard };
};
