import { useQuery } from '@tanstack/react-query';
import { fetchSchoolInfo } from '../api/schoolPageService';

/**
 * React Query hook for fetching school information
 *
 * @param {string} school - The school identifier (e.g., 'singapore', 'beijing')
 * @param {string} locale - The locale/language code (default: 'en')
 * @returns {Object} { schoolInfo, isLoading, error, refetch }
 */
export const useSchoolInfo = (school, locale = 'en') => {
  const query = useQuery({
    queryKey: ['schoolInfo', school, locale],
    queryFn: () => fetchSchoolInfo(school, locale),
    enabled: !!school, // Only fetch if school is provided
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  });

  return {
    schoolInfo: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

export default useSchoolInfo;
