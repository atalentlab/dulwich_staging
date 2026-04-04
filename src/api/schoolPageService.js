/**
 * API Service for fetching school-specific page data
 * Each school has its own pages with unique headers and footers
 *
 * School is detected from subdomain (e.g., beijing.dulwich.loc)
 * and passed as query parameter to API
 *
 * Query Parameter Order: locale, slug, school
 * Example: /api/school/page?locale=zh&slug=about-dulwich/vision-and-values&school=beijing
 */

import { getCurrentSchool } from '../utils/schoolDetection';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://www.dulwich.atalent.xyz';

/**
 * Fetches school page data by slug and school identifier
 * @param {string} slug - The page slug (e.g., 'about-dulwich/vision-and-values'). If empty/null/home, fetches homepage
 * @param {string} school - The school identifier (e.g., 'beijing', 'shanghai')
 * @param {string} locale - The locale/language code (e.g., 'zh', 'en')
 * @returns {Promise<Object>} School page data with header, footer, and blocks
 *
 * API Format: /api/school/page?[locale={locale}&]slug={slug}&school={school}
 *
 * Examples:
 * - Homepage: /api/school/home?slug=seoul
 * - Homepage with locale: /api/school/home?locale=en&slug=seoul
 * - Page: /api/school/page?locale=zh&slug=about-dulwich/vision-and-values&school=beijing
 */
export const fetchSchoolPageBySlug = async (slug, school, locale) => {
  try {
    // If school not provided, try to get from subdomain
    const detectedSchool = school || getCurrentSchool();

    if (!detectedSchool) {
      throw new Error('School identifier is required. Expected subdomain format: beijing.dulwich.loc');
    }

    // CMS suffix for school API calls
    const cmsSuffix = process.env.REACT_APP_SCHOOL_CMS_SUFFIX || '-cms';

    // Determine if it's a homepage request
    const normalizedSlug =
      typeof slug === 'string' ? slug.replace(/^\/+|\/+$/g, '') : slug;
    const isHomepage = !normalizedSlug || normalizedSlug === 'home';
    let url; // string URL used for fetch + logging

    // If no slug or home slug provided, use homepage endpoint
    // Base URL depends on whether it's a homepage request or regular page
    // Homepage: /api/school/home
    // Other pages: /api/page

    if (isHomepage) {
      // Homepage - use /api/school/home with slug={schoolName}
      const params = new URLSearchParams();
      if (locale) params.append('locale', locale);
      // For this specific endpoint, 'slug' param holds the school name
      params.append('slug', `${detectedSchool}${cmsSuffix}`);
      url = `${API_BASE_URL}/api/school/home?${params.toString()}`;
    } else {
      // Other pages - use /api/school/page
      // NOTE: Keep query parameter order as locale, slug, school
      const params = new URLSearchParams();
      if (locale) params.append('locale', locale);
      params.append('slug', normalizedSlug);
      params.append('school', `${detectedSchool}${cmsSuffix}`);
      url = `${API_BASE_URL}/api/school/page?${params.toString()}`;
    }

    console.log('🔍 School Page API Call');
    console.log('URL:', url);
    console.log('Query Params:', {
      locale: locale || 'not set',
      slug: isHomepage ? detectedSchool : normalizedSlug,
      school: detectedSchool
    });

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = new Error(`HTTP error! status: ${response.status}`);
      error.status = response.status;
      error.statusText = response.statusText;
      throw error;
    }

    const rawData = await response.json();

    console.log('✅ School Page API Response:', rawData);

    // Transform API response
    if (rawData.success && rawData.data) {
      // Direct access to preserve all fields including page_layout_type
      const apiData = rawData.data;

      // Log for debugging
      console.log('🔍 Service - apiData.banner.page_layout_type:', apiData.banner?.page_layout_type);

      // Check for redirect data - handle both formats
      let redirectsData = null;
      if (apiData.redirects) {
        // Format 1: { redirects: { redirect: true, target: "...", status: "301" } }
        redirectsData = apiData.redirects;
      } else if (apiData.redirect === true && apiData.target) {
        // Format 2: { redirect: true, target: "...", status: "301" } (fields at root level)
        redirectsData = {
          redirect: apiData.redirect,
          target: apiData.target,
          status: apiData.status || '301'
        };
        console.log('🔄 Redirect detected in API response:', redirectsData);
      }

      const transformedData = {
        // School-specific header
        header: apiData.header || {},

        // School-specific footer
        footer: apiData.footer || {},

        // Page content - use direct reference to preserve all properties
        banner: apiData.banner || {},
        meta: apiData.meta || null,
        blocks: apiData.blocks || [],
        redirects: redirectsData,

        // School information
        school: apiData.school || { name: detectedSchool, slug: detectedSchool },
      };

      console.log('🔍 Service - Transformed banner.page_layout_type:', transformedData.banner?.page_layout_type);

      return transformedData;
    }

    throw new Error('Invalid API response format');
  } catch (error) {
    console.error('❌ Error fetching school page data:', error);
    throw error;
  }
};

/**
 * Fetches list of all available schools
 * @param {string} locale - The locale/language code (e.g., 'zh', 'en')
 * @returns {Promise<Array>} List of schools
 */
export const fetchSchools = async (locale) => {
  try {
    let url = `${API_BASE_URL}/api/schools`;

    // Add locale parameter if provided
    if (locale) {
      url += `?locale=${locale}`;
    }

    console.log('🔍 Fetching schools from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = new Error(`HTTP error! status: ${response.status}`);
      error.status = response.status;
      error.statusText = response.statusText;
      throw error;
    }

    const rawData = await response.json();
    console.log('🔍 fetchSchools - Raw API response:', rawData);

    // Handle different response formats
    if (rawData.success && rawData.data) {
      return rawData.data.schools || rawData.data || [];
    }

    // If response is directly an array
    if (Array.isArray(rawData)) {
      return rawData;
    }

    // If response has a schools property directly
    if (rawData.schools) {
      return rawData.schools;
    }

    return [];
  } catch (error) {
    console.error('❌ Error fetching schools:', error);
    throw error;
  }
};

/**
 * Fetches school homepage data
 * @param {string} school - The school identifier (e.g., 'beijing', 'shanghai')
 * @param {string} locale - The locale/language code (e.g., 'zh', 'en')
 * @returns {Promise<Object>} School homepage data
 */
export const fetchSchoolHomepage = async (school, locale) => {
  try {
    // If school not provided, try to get from subdomain
    const detectedSchool = school || getCurrentSchool();

    if (!detectedSchool) {
      throw new Error('School identifier is required');
    }

    // CMS suffix for school API calls
    const cmsSuffix = process.env.REACT_APP_SCHOOL_CMS_SUFFIX || '-cms';

    let url = `${API_BASE_URL}/api/school/homepage?`;

    // Add locale parameter if provided
    if (locale) {
      url += `locale=${locale}&`;
    }

    // Add school parameter with CMS suffix
    url += `school=${detectedSchool}${cmsSuffix}`;

    console.log('🔍 Fetching school homepage from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = new Error(`HTTP error! status: ${response.status}`);
      error.status = response.status;
      error.statusText = response.statusText;
      throw error;
    }

    const rawData = await response.json();

    if (rawData.success && rawData.data) {
      // Check for redirect data - handle both formats
      let redirectsData = null;
      if (rawData.data.redirects) {
        redirectsData = rawData.data.redirects;
      } else if (rawData.data.redirect === true && rawData.data.target) {
        redirectsData = {
          redirect: rawData.data.redirect,
          target: rawData.data.target,
          status: rawData.data.status || '301'
        };
        console.log('🔄 Redirect detected in school homepage:', redirectsData);
      }

      return {
        header: rawData.data.header || {},
        footer: rawData.data.footer || {},
        banner: rawData.data.banner || {},
        blocks: rawData.data.blocks || [],
        redirects: redirectsData,
        school: rawData.data.school || { name: detectedSchool, slug: detectedSchool },
      };
    }

    throw new Error('Invalid API response format');
  } catch (error) {
    console.error('❌ Error fetching school homepage:', error);
    throw error;
  }
};

/**
 * Fetches school information/details
 * @param {string} school - The school identifier (e.g., 'beijing', 'shanghai')
 * @param {string} locale - The locale/language code (e.g., 'zh', 'en')
 * @returns {Promise<Object>} School information
 */
export const fetchSchoolInfo = async (school, locale) => {
  try {
    // If school not provided, try to get from subdomain
    const detectedSchool = school || getCurrentSchool();

    if (!detectedSchool) {
      throw new Error('School identifier is required');
    }

    // CMS suffix for school API calls
    const cmsSuffix = process.env.REACT_APP_SCHOOL_CMS_SUFFIX || '-cms';

    let url = `${API_BASE_URL}/api/school_info?`;

    // Add locale parameter if provided
    if (locale) {
      url += `locale=${locale}&`;
    }

    // Add school parameter with CMS suffix
    url += `school=${detectedSchool}${cmsSuffix}`;

    console.log('🔍 Fetching school info from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = new Error(`HTTP error! status: ${response.status}`);
      error.status = response.status;
      error.statusText = response.statusText;
      throw error;
    }

    const rawData = await response.json();

    if (rawData.success && rawData.data) {
      return rawData.data;
    }

    throw new Error('Invalid API response format');
  } catch (error) {
    console.error('❌ Error fetching school info:', error);
    throw error;
  }
};

/**
 * Fetches main menu navigation data for a specific school
 * @param {string} school - The school identifier (e.g., 'beijing', 'shanghai')
 * @param {string} locale - The locale/language code (e.g., 'zh', 'en')
 * @returns {Promise<Array>} Menu items array
 *
 * API Format: https://{school}.dulwich.atalent.xyz/api/mainmenu?locale={locale}&school={school}
 *
 * Response structure:
 * {
 *   success: true,
 *   data: [
 *     {
 *       id: 795,
 *       menu_name: "招生",
 *       url: "#",
 *       items: [
 *         { id: 1288, title: "招生概览", slug: "admissions/admissions-overview" }
 *       ]
 *     }
 *   ]
 * }
 */
export const fetchMainMenu = async (school, locale) => {
  try {
    // If school not provided, try to get from subdomain
    const detectedSchool = school || getCurrentSchool();

    if (!detectedSchool) {
      throw new Error('School identifier is required for main menu');
    }

    // CMS suffix for school API calls
    const cmsSuffix = process.env.REACT_APP_SCHOOL_CMS_SUFFIX || '-cms';

    // Use the central API domain
    const params = new URLSearchParams();

    if (locale) {
      params.append('locale', locale);
    }
    params.append('school', `${detectedSchool}${cmsSuffix}`);

    const url = `${API_BASE_URL}/api/mainmenu?${params.toString()}`;

    console.log('🔍 Fetching main menu from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = new Error(`HTTP error! status: ${response.status}`);
      error.status = response.status;
      error.statusText = response.statusText;
      throw error;
    }

    const rawData = await response.json();

    console.log('✅ Main Menu API Response:', rawData);

    if (rawData.success && rawData.data) {
      return rawData.data;
    }

    // Return empty array if no data
    return [];
  } catch (error) {
    console.error('❌ Error fetching main menu:', error);
    throw error;
  }
};
