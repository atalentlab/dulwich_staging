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

      // Add International as first option (if not already in list)
      const hasInternational = schoolsList.some(s => s.slug === 'international');
      if (!hasInternational) {
        processedSchools.push({
          id: -1,
          title: 'International',
          slug: 'international',
          url: 'https://www.dulwich.org'
        });
      }

      // Add all other schools
      schoolsList.forEach(school => {
        if (school.slug === 'international') {
          processedSchools.push({
            ...school,
            title: 'International'
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
