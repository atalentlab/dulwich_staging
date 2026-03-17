import { useQuery } from '@tanstack/react-query';
import { fetchSchoolPageBySlug } from '../api/schoolPageService';

/**
 * React Query hook for fetching school page data by slug
 *
 * @param {string} slug - The page slug (e.g., 'admissions/admissions-overview')
 * @param {string} school - The school identifier (e.g., 'beijing', 'shanghai')
 * @param {string|null} locale - The locale/language code (optional, e.g., 'zh', 'en')
 * @returns {Object} { data, isLoading, error, refetch, isFetching }
 *
 * @example
 * const { data, isLoading, error } = useSchoolPageBySlug(
 *   'admissions/admissions-overview',
 *   'beijing',
 *   'zh'
 * );
 */
export const useSchoolPageBySlug = (slug, school, locale = null) => {
  const query = useQuery({
    queryKey: ['schoolPage', slug, school, locale],
    queryFn: () => fetchSchoolPageBySlug(slug, school, locale),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    enabled: !!school, // Fetch if school exists (slug can be empty for homepage)
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
};

export default useSchoolPageBySlug;
