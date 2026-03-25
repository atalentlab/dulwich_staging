/**
 * API Service for fetching teacher/people data
 * Handles teacher list with filters
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://cms.dulwich.org';

/**
 * Fetches teacher list with optional filters
 * @param {Object} params - Query parameters
 * @param {string} params.school - School parameter (e.g., 'beijing-cms')
 * @param {string} params.locale - The locale/language code
 * @param {number} params.page_no - Page number for pagination
 * @param {number} params.limit - Number of items per page
 * @param {string} params.department - Filter by department ID
 * @param {string} params.search - Search query
 * @returns {Promise<Object>} Teachers list with pagination
 */
export const fetchTeacherList = async ({
  school = null,
  locale = 'en',
  page_no = 1,
  limit = 20,
  department = null,
  search = null,
} = {}) => {
  try {
    let url = `${API_BASE_URL}/api/teacher_list?`;

    const params = new URLSearchParams();

    if (school) params.append('school', school);
    if (locale && locale !== 'en') params.append('locale', locale);
    params.append('page_no', page_no.toString());
    params.append('limit', limit.toString());
    if (department) params.append('department', department);
    if (search) params.append('search', search);

    url += params.toString();

    console.log('Fetching teachers from:', url);

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

    console.log('Teacher API Response:', rawData);

    if (rawData.success && rawData.data) {
      return {
        teachers: rawData.data || [],
        total: rawData.total || rawData.data.length,
        pagination: rawData.pagination || null,
      };
    }

    throw new Error('Invalid API response format');
  } catch (error) {
    console.error('Error fetching teachers:', error);
    throw error;
  }
};

export default {
  fetchTeacherList,
};
