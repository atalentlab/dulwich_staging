/**
 * ScrollSpy Utility
 * Provides helper functions for scroll spy functionality
 * Used by ScrollSpyLayout component (page_layout_type = 3)
 */

/**
 * Extract title from a block object
 * Handles different block types and content structures
 * @param {Object} block - The block object to extract title from
 * @param {number} index - The block index (used for fallback)
 * @returns {string} The extracted or generated title
 */
export const extractBlockTitle = (block, index) => {
  // Check for direct title property
  if (block.title) {
    return block.title;
  }

  // Check for heading property
  if (block.heading) {
    return block.heading;
  }

  // Check for label property (used in some block types)
  if (block.label) {
    return block.label;
  }

  // Try to extract from HTML content
  if (block.content && typeof block.content === 'string') {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = block.content;
    const firstHeading = tempDiv.querySelector('h1, h2, h3, h4, h5, h6');
    if (firstHeading && firstHeading.textContent.trim()) {
      return firstHeading.textContent.trim();
    }
  }

  // Check for block_type as fallback
  if (block.block_type) {
    // Convert block_type to readable format (e.g., "2_col_copy" -> "Two Column Copy")
    const readableType = block.block_type
      .split('_')
      .map(word => {
        if (word === '2') return 'Two';
        if (word === '3') return 'Three';
        if (word === '4') return 'Four';
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
    return readableType;
  }

  // Final fallback
  return `Section ${index + 1}`;
};

/**
 * Generate a unique ID for a block
 * @param {number} index - The block index
 * @param {Object} block - The block object (optional, for more specific IDs)
 * @returns {string} Unique block ID
 */
export const generateBlockId = (index, block = null) => {
  if (block && block.id) {
    return `block-${block.id}`;
  }
  return `block-${index}`;
};

/**
 * Extract headings (h2, h3) from content for anchor navigation
 * @param {HTMLElement} contentElement - The content container element
 * @returns {Array} Array of heading objects with id, text, and level
 */
export const extractHeadings = (contentElement) => {
  if (!contentElement) return [];

  const headingElements = contentElement.querySelectorAll('h2, h3');
  const headings = [];

  headingElements.forEach((heading, index) => {
    const id = heading.id || `heading-${index}`;
    if (!heading.id) {
      heading.id = id;
    }

    headings.push({
      id,
      text: heading.textContent.trim(),
      level: heading.tagName.toLowerCase()
    });
  });

  return headings;
};

/**
 * Smooth scroll to a section with offset for fixed header
 * @param {string} id - The element ID to scroll to
 * @param {number} offset - Offset in pixels (default: -100)
 */
export const scrollToSection = (id, offset = -100) => {
  const element = document.getElementById(id);
  if (element) {
    const y = element.getBoundingClientRect().top + window.pageYOffset + offset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
};

/**
 * Create IntersectionObserver for scroll spy
 * @param {Function} callback - Callback function when element intersects
 * @param {Object} options - Observer options
 * @returns {IntersectionObserver} The observer instance
 */
export const createScrollSpyObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observerOptions = { ...defaultOptions, ...options };

  return new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback(entry.target.id);
      }
    });
  }, observerOptions);
};

/**
 * Process blocks to create navigation items
 * @param {Array} blocks - Array of block objects
 * @returns {Array} Array of navigation items with id, title, and index
 */
export const createBlockNavigation = (blocks) => {
  if (!blocks || blocks.length === 0) return [];

  return blocks.map((block, index) => ({
    id: generateBlockId(index, block),
    title: extractBlockTitle(block, index),
    index: index,
    blockType: block.block_type || 'unknown'
  }));
};

/**
 * Get scroll position percentage
 * @returns {number} Scroll percentage (0-100)
 */
export const getScrollPercentage = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  return scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
};

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} True if element is in viewport
 */
export const isInViewport = (element) => {
  if (!element) return false;
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

export default {
  extractBlockTitle,
  generateBlockId,
  extractHeadings,
  scrollToSection,
  createScrollSpyObserver,
  createBlockNavigation,
  getScrollPercentage,
  isInViewport
};
