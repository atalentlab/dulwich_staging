/**
 * API Service for fetching article data
 * Handles article list and article details
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://www.dulwich.atalent.xyz';

/**
 * Fetches article details by slug
 * @param {string} slug - The article slug (e.g., 'dulwich-life')
 * @param {string} locale - The locale/language code (e.g., 'zh', 'en')
 * @param {string} school - The school slug (e.g., 'singapore', 'beijing')
 * @returns {Promise<Object>} Article data
 */
export const fetchArticleBySlug = async (slug, locale = 'en', school = null) => {
  try {
    // Build URL with slug as query parameter
    let url = `${API_BASE_URL}/api/article?slug=${slug}`;
    if (locale) {
      url += `&locale=${locale}`;
    }
    if (school) {
      url += `&school=${school}`;
    }

    console.log('Fetching article from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const rawData = await response.json();

    console.log('Article API Response:', rawData);

    // Transform API response
    if (rawData.success && rawData.data) {
      return rawData.data;
    }

    throw new Error('Invalid API response format');
  } catch (error) {
    console.error('Error fetching article:', error);
    throw error;
  }
};

/**
 * Fetches list of articles
 * @param {Object} params - Query parameters
 * @param {string} params.locale - The locale/language code
 * @param {number} params.page - Page number for pagination
 * @param {number} params.limit - Number of items per page
 * @param {string} params.category - Filter by category
 * @param {string} params.tag - Filter by tag
 * @returns {Promise<Object>} Articles list with pagination
 */
export const fetchArticles = async ({
  locale = 'en',
  page = 1,
  limit = 10,
  category = null,
  tag = null,
} = {}) => {
  try {
    let url = `${API_BASE_URL}/api/article/list?locale=${locale}&page=${page}&limit=${limit}`;

    if (category) {
      url += `&category=${category}`;
    }

    if (tag) {
      url += `&tag=${tag}`;
    }

    console.log('Fetching articles from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const rawData = await response.json();

    if (rawData.success && rawData.data) {
      return {
        articles: rawData.data.articles || [],
        pagination: rawData.data.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      };
    }

    throw new Error('Invalid API response format');
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
};

/**
 * Fetches article tags for filtering
 * @param {string} locale - The locale/language code
 * @param {string} school - The school slug (e.g., 'singapore', 'beijing')
 * @returns {Promise<Array>} Array of tag objects with id, title, and slug
 */
export const fetchArticleTags = async (locale = 'en', school) => {
  try {
    let url = `${API_BASE_URL}/api/tags?locale=${locale}`;

    if (school) {
      url += `&school=${school}`;
    }

    console.log('Fetching article tags from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const rawData = await response.json();

    console.log('Tags API Response:', rawData);

    if (rawData.success && rawData.data && rawData.data.tags) {
      // Return array of tag objects with id, title, and slug
      return rawData.data.tags;
    }

    return [];
  } catch (error) {
    console.error('Error fetching article tags:', error);
    throw error;
  }
};

/**
 * Fetches all articles by slug (network news)
 * @param {Object} params - Query parameters
 * @param {string} params.slug - The article category slug (e.g., 'dulwich-life')
 * @param {string} params.locale - The locale/language code
 * @param {string} params.school - The school slug (e.g., 'singapore', 'beijing')
 * @returns {Promise<Object>} All articles
 */
export const fetchAllArticles = async ({
  slug = 'dulwich-life',
  locale = 'en',
  school = null,
  limit = 10,
  page_no = 1,
  tags = []
} = {}) => {
  try {
    // Use the article endpoint with slug to get all articles
    let url = `${API_BASE_URL}/api/article?slug=${slug}`;

    if (locale) {
      url += `&locale=${locale}`;
    }

    if (school) {
      url += `&school=${school}`;
    }

    // Add pagination
    url += `&limit=${limit}&page_no=${page_no}`;

    // Add tags if present
    if (tags && tags.length > 0) {
      tags.forEach(tagId => {
        url += `&tags[]=${tagId}`;
      });
    }

    console.log('Fetching all articles from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const rawData = await response.json();

    console.log('Articles API Response:', rawData);

    if (rawData.success && rawData.data) {
      const articles = rawData.data.articles || rawData.data || [];
      const tags = rawData.data.tags || [];
      const main = rawData.data.main || null;

      return {
        articles: articles,
        tags: tags,
        total: articles.length,
        main: main
      };
    }

    throw new Error('Invalid API response format');
  } catch (error) {
    console.error('Error fetching all articles:', error);
    throw error;
  }
};

/**
 * Fetches article details by slug
 * @param {string} slug - The article slug
 * @param {string} locale - The locale/language code
 * @param {string} school - The school slug (e.g., 'singapore', 'beijing')
 * @returns {Promise<Object>} Article details
 */


export const fetchArticleDetails = async (slug, locale = 'en', school) => {
  try {
    let url = `${API_BASE_URL}/api/article_details?slug=${slug}&locale=${locale}`;

    if (school) {
      url += `&school=${school}`;
    }

    console.log('Fetching article details from:', url);
    

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const rawData = await response.json();

    console.log('Article Details API Response:', rawData);

    if (rawData.success && rawData.data) {
      return rawData.data;
    }

    throw new Error('Invalid API response format');
  } catch (error) {
    console.error('Error fetching article details:', error);
    throw error;
  }
};
