import { useState, useEffect, useCallback } from 'react';
import { fetchPageData, fetchMockPageData } from '../api/pageService';

/**
 * Custom hook for fetching and managing page data
 * Handles loading state, errors, and data caching
 *
 * @param {string} pageSlug - The page identifier
 * @param {boolean} useMockData - Whether to use mock data (for development)
 * @param {string} locale - The locale/language code (e.g., 'zh', 'en')
 * @returns {Object} { pageData, loading, error, refetch }
 */
const usePageData = (pageSlug = 'home', useMockData = true, locale = 'zh') => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Use mock data or real API based on flag
      const data = useMockData
        ? await fetchMockPageData()
        : await fetchPageData(pageSlug, locale);

      setPageData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch page data');
      console.error('Error in usePageData:', err);
    } finally {
      setLoading(false);
    }
  }, [pageSlug, useMockData, locale]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Expose refetch function for manual refresh
  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    pageData,
    loading,
    error,
    refetch,
  };
};

export default usePageData;
