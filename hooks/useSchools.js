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
    queryFn: async () => {
      const schoolsList = await fetchSchools(locale);
      
      if (!Array.isArray(schoolsList)) {
        return [];
      }

      // Process schools to handle International school (matching SchoolsContext behavior)
      const processedSchools = [];


      // Add all other schools
      schoolsList.forEach(school => {
        if (school.slug === 'ss') {
          processedSchools.push({
            ...school,
            title: '國際學校'
          });
        } else {
          processedSchools.push(school);
        }
      });

      return processedSchools;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  });

  return {
    schools: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

export default useSchools;
