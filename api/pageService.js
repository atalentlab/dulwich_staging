/**
 * API Service for fetching page data
 * Centralized API logic for all page-related requests
 */

const API_BASE_URL = process.env.REACT_APP_API_URL;

/**
 * Static header configuration - used across all pages
 */
const STATIC_HEADER = {
  logo: 'Dulwich College International',
  navigation: [],
  banner: {},
}; REACT_APP_SCHOOL_CMS_SUFFIX = -cms

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
      const { banner, meta, blocks, schools, articles, redirects } = rawData.data;

      // Check for redirect data - handle both formats
      let redirectsData = null;
      if (redirects) {
        // Format 1: { redirects: { redirect: true, target: "...", status: "301" } }
        redirectsData = redirects;
      } else if (rawData.data.redirect === true && rawData.data.target) {
        // Format 2: { redirect: true, target: "...", status: "301" } (fields at root level)
        redirectsData = {
          redirect: rawData.data.redirect,
          target: rawData.data.target,
          status: rawData.data.status || '301'
        };
        console.log('🔄 Redirect detected in API response:', redirectsData);
      }

      return {
        banner: banner || {},
        meta: meta || null,
        blocks: blocks || [],
        redirects: redirectsData,
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

/**
 * Fetches preview page data for Group pages
 * @param {string} slug - The preview slug (e.g., 'mkjrrn5lf51775126879')
 * @param {string} locale - The locale/language code (e.g., 'zh', 'en') - optional
 * @returns {Promise<Object>} Preview page data with header, footer, and blocks
 *
 * API Format: /api/preview/page?slug={slug}&locale={locale}
 */
// In-flight request cache — prevents duplicate API calls from StrictMode / multiple instances
const _pendingPreviewPageRequests = {};

export const fetchPreviewPage = async (slug, locale) => {
  if (!slug) {
    throw new Error('Preview slug is required');
  }

  // Build URL with required slug parameter
  const params = new URLSearchParams();
  params.append('slug', slug);

  // Add optional locale parameter
  if (locale) {
    params.append('locale', locale);
  }

  const url = `${API_BASE_URL}/api/preview/page?${params.toString()}`;

  // Return existing in-flight promise if same request is already pending
  if (_pendingPreviewPageRequests[url]) {
    return _pendingPreviewPageRequests[url];
  }

  const promise = (async () => {
    try {
      console.log('🔍 Fetching preview page from:', url);

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

      console.log('✅ Preview Page API Response:', rawData);

      // Transform API response
      if (rawData.success && rawData.data) {
        const { banner, meta, blocks, schools, articles } = rawData.data;

        return {
          banner: banner || {},
          meta: meta || null,
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
      console.error('❌ Error fetching preview page data:', error);
      throw error;
    } finally {
      // Remove from cache once resolved or rejected
      delete _pendingPreviewPageRequests[url];
    }
  })();

  _pendingPreviewPageRequests[url] = promise;
  return promise;
};

