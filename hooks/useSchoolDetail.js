/**
 * React Query hook for fetching detailed information about a specific school
 * Uses the school slug to retrieve comprehensive school data
 */

import { useQuery } from '@tanstack/react-query';
import { fetchSchoolInfo } from '../api/schoolPageService';

/**
 * Hook to fetch school detail data by slug
 * @param {string} slug - School slug (e.g., 'beijing', 'singapore', 'shanghai-pudong')
 * @param {string} locale - Locale code (e.g., 'en', 'zh')
 * @returns {Object} React Query result with school data
 */
export const useSchoolDetail = (slug, locale) => {
  return useQuery({
    queryKey: ['schoolDetail', slug, locale],
    queryFn: () => fetchSchoolInfo(slug, locale),
    enabled: !!slug, // Only run query if slug is provided
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
    retry: 1,
    onError: (error) => {
      console.error('Error fetching school detail:', error);
    },
  });
};

export default useSchoolDetail;
