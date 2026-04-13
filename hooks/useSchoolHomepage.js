import { useQuery } from '@tanstack/react-query';
import { fetchSchoolHomepage } from '../api/schoolPageService';

/**
 * React Query hook for fetching school homepage data
 *
 * @param {string} school - The school identifier (e.g., 'beijing', 'shanghai')
 * @param {string} locale - The locale/language code (default: 'en')
 * @returns {Object} { data, isLoading, error, refetch, isFetching }
 */
export const useSchoolHomepage = (school, locale = 'en') => {
  const query = useQuery({
    queryKey: ['schoolHomepage', school, locale],
    queryFn: () => fetchSchoolHomepage(school, locale),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    enabled: !!school, // Only fetch if school exists
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
};

export default useSchoolHomepage;
