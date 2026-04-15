import { useQuery } from '@tanstack/react-query';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://cms.dulwich.atalent.xyz';

/**
 * Fetch dynamic menu from CMS API
 * @param {string} locale - Language locale (en or zh)
 * @param {string} school - School identifier (e.g., 'singapore', optional)
 * @returns {Promise<Object>} Menu data
 */
const fetchDynamicMenu = async (locale = 'en', school = null) => {
  const params = new URLSearchParams({ locale });
  if (school) {
    // Add -cms suffix for dynamic_menu API
    params.append('school', `${school}-cms`);
  }
  const url = `${API_BASE_URL}/api/dynamic_menu?${params.toString()}`;
  console.log('[useDynamicMenu] Fetching:', url);

  const response = await fetch(url);
  if (!response.ok) {
    console.error('[useDynamicMenu] Fetch failed:', response.status, response.statusText);
    throw new Error(`Failed to fetch dynamic menu: ${response.status}`);
  }
  const data = await response.json();
  console.log('[useDynamicMenu] Received data:', data);
  return data;
};

/**
 * Custom hook to fetch and cache dynamic menu data
 * @param {string} locale - Language locale (en or zh)
 * @param {string} school - School identifier (e.g., 'singapore', optional)
 */
export const useDynamicMenu = (locale = 'en', school = null) => {
  return useQuery({
    queryKey: ['dynamicMenu', locale, school],
    queryFn: () => fetchDynamicMenu(locale, school),
    staleTime: 1000 * 60 * 10, // Data stays fresh for 10 minutes
    cacheTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Don't refetch on component mount if data exists
    retry: 2,
    placeholderData: (previousData) => previousData, // Use previous data while loading
  });
};
