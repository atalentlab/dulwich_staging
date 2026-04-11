import { useQuery } from '@tanstack/react-query';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://cms.dulwich.org';

/**
 * Fetch dynamic menu from CMS API
 * @param {string} locale - Language locale (en or zh)
 * @param {string} school - School identifier (e.g., 'singapore-cms', optional)
 * @returns {Promise<Object>} Menu data
 */
const fetchDynamicMenu = async (locale = 'en', school = null) => {
  const params = new URLSearchParams({ locale });
  if (school) {
    params.append('school', school);
  }
  const response = await fetch(`${API_BASE_URL}/api/dynamic_menu?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch dynamic menu');
  }
  const data = await response.json();
  return data;
};

/**
 * Custom hook to fetch and cache dynamic menu data
 * @param {string} locale - Language locale (en or zh)
 * @param {string} school - School identifier (e.g., 'singapore-cms', optional)
 */
export const useDynamicMenu = (locale = 'en', school = null) => {
  return useQuery({
    queryKey: ['dynamicMenu', locale, school],
    queryFn: () => fetchDynamicMenu(locale, school),
    staleTime: 1000 * 60 * 30, // Cache for 30 minutes
    cacheTime: 1000 * 60 * 60, // Keep in cache for 1 hour
    refetchOnWindowFocus: false,
    retry: 2,
  });
};
