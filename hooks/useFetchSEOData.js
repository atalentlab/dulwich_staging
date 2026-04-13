import { useState, useEffect } from 'react';

/**
 * Custom hook to fetch SEO/OG data from API
 *
 * @param {string} apiUrl - API endpoint URL
 * @param {Object} options - Fetch options
 * @returns {Object} { data, loading, error }
 *
 * Example API response structure:
 * {
 *   "success": true,
 *   "data": {
 *     "title": "招生报名",
 *     "description": "西安曲江德闳学校...",
 *     "image": "https://example.com/image.jpg",
 *     "url": "https://xian.dehong.cn",
 *     "type": "website"
 *   }
 * }
 */
const useFetchSEOData = (apiUrl, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!apiUrl) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          ...options,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // Handle different API response formats
        if (result.success && result.data) {
          setData(result.data);
        } else if (result.data) {
          setData(result.data);
        } else {
          setData(result);
        }
      } catch (err) {
        console.error('Error fetching SEO data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl]);

  return { data, loading, error };
};

export default useFetchSEOData;
