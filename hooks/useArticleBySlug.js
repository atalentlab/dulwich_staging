import { useQuery } from '@tanstack/react-query';
import { fetchArticleBySlug } from '../api/articleService';

/**
 * React Query hook for fetching article data by slug
 *
 * @param {string} slug - The article slug (e.g., 'dulwich-life')
 * @param {string} locale - The locale/language code (default: 'en')
 * @param {string} school - The school slug (e.g., 'singapore', 'beijing')
 * @returns {Object} { data, isLoading, error, refetch, isFetching }
 *
 * @example
 * const { data, isLoading, error } = useArticleBySlug('dulwich-life', 'en', 'singapore');
 */
export const useArticleBySlug = (slug, locale = 'en', school = null) => {
  const query = useQuery({
    queryKey: ['article', slug, locale, school],
    queryFn: () => fetchArticleBySlug(slug, locale, school),
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

export default useArticleBySlug;
