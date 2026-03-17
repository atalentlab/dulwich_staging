import { useQuery } from '@tanstack/react-query';
import { fetchMainMenu } from '../api/schoolPageService';

/**
 * React Query hook for fetching school main menu navigation data
 *
 * @param {string} school - The school identifier (e.g., 'beijing', 'shanghai')
 * @param {string|null} locale - The locale/language code (optional, e.g., 'zh', 'en')
 * @returns {Object} { data, isLoading, error, refetch, isFetching }
 *
 * @example
 * const { data: menuItems, isLoading, error } = useMainMenu('beijing', 'zh');
 *
 * // menuItems structure:
 * // [
 * //   {
 * //     id: 795,
 * //     menu_name: "招生",
 * //     url: "#",
 * //     items: [
 * //       { id: 1288, title: "招生概览", slug: "admissions/admissions-overview" }
 * //     ]
 * //   }
 * // ]
 */
export const useMainMenu = (school, locale = null) => {
  const query = useQuery({
    queryKey: ['mainMenu', school, locale],
    queryFn: () => fetchMainMenu(school, locale),
    staleTime: 10 * 60 * 1000, // 10 minutes - menu doesn't change often
    cacheTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    enabled: !!school, // Only fetch if school is provided
  });

  return {
    data: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
};

export default useMainMenu;
