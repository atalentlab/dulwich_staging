import { useQuery } from '@tanstack/react-query';
import { fetchArticleDetails } from '../api/articleService';

/**
 * React Query hook for fetching article details by slug
 * Uses the /api/article_details endpoint
 *
 * @param {string} slug - The article slug (e.g., 'dulwich-students-earn-top-in-world-laurels')
 * @param {string} locale - The locale/language code (default: 'en')
 * @param {string} school - The school slug (optional, e.g., 'singapore', 'beijing')
 * @returns {Object} { data, isLoading, error, refetch, isFetching }
 *
 * @example
 * const { data, isLoading, error } = useArticleDetailsBySlug(
 *   'dulwich-students-earn-top-in-world-laurels',
 *   'en'
 * );
 */
export const useArticleDetailsBySlug = (slug, locale = 'en', school = null) => {
  const query = useQuery({
    queryKey: ['articleDetails', slug, locale, school],
    queryFn: () => fetchArticleDetails(slug, locale, school),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    enabled: !!slug, // Only fetch if slug exists
  });

  console.log('useArticleDetailsBySlug - Query State:', {
    slug,
    locale,
    school,
    isLoading: query.isLoading,
    error: query.error,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
};

export default useArticleDetailsBySlug;
