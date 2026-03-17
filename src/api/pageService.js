/**
 * API Service for fetching page data
 * Centralized API logic for all page-related requests
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://www.dulwich.atalent.xyz';

/**
 * Static header configuration - used across all pages
 */
const STATIC_HEADER = {
  logo: 'Dulwich College International',
  navigation: [],
  banner: {},
};

/**
 * Static footer configuration - used across all pages
 */
const STATIC_FOOTER = {
  schools: [],
  articles: [],
  copyright: '© 2026 Dulwich College International. All rights reserved.',
  socialLinks: [],
  links: [],
};

/**
 * Fetches page data by slug
 * Supports two API formats:
 * 1. Home page: /api/page/home?locale=zh
 * 2. All other pages: /api/page?slug=all-blocks or /api/page?locale=zh&slug=about-dulwich/vision-and-values
 *
 * @param {string} slug - The page slug (e.g., 'home', 'all-blocks', 'about-dulwich/vision-and-values')
 * @param {string} locale - The locale/language code (e.g., 'zh', 'en')
 * @returns {Promise<Object>} Page data with header, footer, and blocks
 */
export const fetchPageBySlug = async (slug, locale) => {
  try {
    let url;

    if (slug === 'home') {
      // Home page - use path format without slug parameter
      // Format: /api/page/home?locale=zh
      url = `${API_BASE_URL}/api/page/home`;

      if (locale) {
        url += `?locale=${locale}`;
      }
    } else {
      // All other pages - use query parameter format
      // Format: /api/page?slug=all-blocks or /api/page?locale=zh&slug=about-dulwich/vision-and-values
      url = `${API_BASE_URL}/api/page?`;

      if (locale) {
        url += `locale=${locale}&`;
      }

      url += `slug=${slug}`;
    }

    console.log('Fetching page data from:', url);

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

    console.log('API Response:', rawData);

    // Transform API response
    if (rawData.success && rawData.data) {
      const { banner, meta, blocks, schools, articles } = rawData.data;

      return {
        banner: banner || {},
        meta:   meta   || null,
        blocks: blocks || [],
        // Static header and footer for all pages
        header: STATIC_HEADER,
        footer: {
          ...STATIC_FOOTER,
          schools: schools || [],
          articles: articles || []
        },
      };
    }

    throw new Error('Invalid API response format');
  } catch (error) {
    console.error('Error fetching page data:', error);
    throw error;
  }
};

/**
 * Fetches complete page data (header, footer, blocks) in one call
 * @param {string} pageSlug - The page identifier (e.g., 'home', 'about')
 * @param {string} locale - The locale/language code (e.g., 'zh', 'en')
 * @returns {Promise<Object>} Page data with header, footer, and blocks
 */
export const fetchPageData = async (pageSlug = 'home', locale = 'en') => {
  try {
    // Build URL with slug and locale parameters
    let url = `${API_BASE_URL}/api/page/${pageSlug}`;

    // Add locale parameter if provided
    if (locale) {
      url += `?locale=${locale}`;
    }

    console.log('Fetching page data from:', url);

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

    console.log('API Response:', rawData);

    // Transform API response to match our component structure
    if (rawData.success && rawData.data) {
      const { banner, blocks, schools, articles } = rawData.data;

      const transformedData = {
        // Static header for all pages
        header: STATIC_HEADER,

        // Blocks come directly from API
        blocks: blocks || [],

        // Static footer for all pages with schools data
        footer: {
          ...STATIC_FOOTER,
          schools: schools || [],
          articles: articles || []
        },
      };

      console.log('Transformed Data:', transformedData);
      return transformedData;
    }

    // Fallback if response format is unexpected
    console.warn('Unexpected API response format');
    return {
      header: {},
      blocks: [],
      footer: {},
    };
  } catch (error) {
    console.error('Error fetching page data:', error);
    throw error;
  }
};

