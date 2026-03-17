import { useQuery } from '@tanstack/react-query';
import { fetchArticles } from '../api/articleService';

/**
 * React Query hook for fetching articles list
 *
 * @param {Object} params - Query parameters
 * @param {string} params.locale - The locale/language code
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.category - Filter by category
 * @param {string} params.tag - Filter by tag
 * @returns {Object} { articles, pagination, isLoading, error, refetch }
 */
export const useArticles = ({
  locale = 'en',
  page = 1,
  limit = 10,
  category = null,
  tag = null,
} = {}) => {
  const query = useQuery({
    queryKey: ['articles', locale, page, limit, category, tag],
    queryFn: () => fetchArticles({ locale, page, limit, category, tag }),
    staleTime: 3 * 60 * 1000, // 3 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    keepPreviousData: true, // Keep showing old data while fetching new page
  });

  return {
    articles: query.data?.articles || [],
    pagination: query.data?.pagination || {},
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
};

export default useArticles;
