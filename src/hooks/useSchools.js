import { useQuery } from '@tanstack/react-query';
import { fetchSchools } from '../api/schoolPageService';

/**
 * React Query hook for fetching list of schools
 *
 * @param {string} locale - The locale/language code (default: 'en')
 * @returns {Object} { schools, isLoading, error, refetch }
 */
export const useSchools = (locale = 'en') => {
  const query = useQuery({
    queryKey: ['schools', locale],
    queryFn: () => fetchSchools(locale),
    staleTime: 10 * 60 * 1000, // 10 minutes - schools list doesn't change often
    cacheTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  });

  return {
    schools: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

export default useSchools;
