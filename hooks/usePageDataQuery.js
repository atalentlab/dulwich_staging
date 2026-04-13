import { useQuery } from '@tanstack/react-query';
import { fetchPageData } from '../api/pageService';

/**
 * React Query hook for fetching page data
 * Provides automatic caching, refetching, and loading/error states
 *
 * @param {string} pageSlug - The page identifier (e.g., 'home', 'about')
 * @param {string} locale - The locale/language code (e.g., 'zh', 'en')
 * @returns {Object} { data, isLoading, error, refetch, isError, isFetching }
 */
export const usePageDataQuery = (pageSlug = 'home', locale = 'zh') => {
  const query = useQuery({
    queryKey: ['pageData', pageSlug, locale], // Unique key for this query
    queryFn: () => fetchPageData(pageSlug, locale), // Function to fetch data
    staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
    cacheTime: 10 * 60 * 1000, // Cache persists for 10 minutes
    retry: 2, // Retry failed requests twice
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnReconnect: true, // Refetch when internet reconnects
  });

  return {
    pageData: query.data,
    loading: query.isLoading,
    error: query.error?.message,
    refetch: query.refetch,
    isError: query.isError,
    isFetching: query.isFetching,
  };
};

export default usePageDataQuery;
