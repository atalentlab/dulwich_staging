import { useQuery } from '@tanstack/react-query';
import { fetchPageBySlug } from '../api/pageService';

/**
 * React Query hook for fetching page data by slug
 *
 * @param {string} slug - The page slug (e.g., 'about-dulwich/vision-and-values')
 * @param {string|null} locale - The locale/language code (optional, e.g., 'zh', 'en')
 * @returns {Object} { data, isLoading, error, refetch }
 */
export const usePageBySlug = (slug, locale = null) => {
  const query = useQuery({
    queryKey: ['page', slug, locale],
    queryFn: () => fetchPageBySlug(slug, locale),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    enabled: !!slug, // Only fetch if slug exists
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
};

export default usePageBySlug;
