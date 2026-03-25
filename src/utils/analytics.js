/**
 * Google Analytics and Google Tag Manager utilities
 * Provides helper functions for tracking events, page views, and conversions
 */

/**
 * Initialize Google Tag Manager dataLayer
 */
export const initializeGTM = () => {
  window.dataLayer = window.dataLayer || [];
};

/**
 * Push event to GTM dataLayer
 * @param {Object} eventData - Event data object
 */
export const pushToDataLayer = (eventData) => {
  if (window.dataLayer) {
    window.dataLayer.push(eventData);
  }
};

/**
 * Track page view
 * @param {string} path - Page path
 * @param {string} title - Page title
 */
export const trackPageView = (path, title) => {
  pushToDataLayer({
    event: 'pageview',
    page: {
      path: path,
      title: title,
      url: window.location.href
    }
  });
};

/**
 * Track custom event
 * @param {string} category - Event category
 * @param {string} action - Event action
 * @param {string} label - Event label (optional)
 * @param {number} value - Event value (optional)
 */
export const trackEvent = (category, action, label = null, value = null) => {
  const eventData = {
    event: 'customEvent',
    eventCategory: category,
    eventAction: action
  };

  if (label) eventData.eventLabel = label;
  if (value) eventData.eventValue = value;

  pushToDataLayer(eventData);
};

/**
 * Track school selection
 * @param {string} schoolName - Name of selected school
 * @param {string} schoolSlug - Slug of selected school
 */
export const trackSchoolSelection = (schoolName, schoolSlug) => {
  trackEvent('School Selection', 'Select', schoolName);
  pushToDataLayer({
    event: 'schoolSelected',
    schoolName: schoolName,
    schoolSlug: schoolSlug
  });
};

/**
 * Track search query
 * @param {string} query - Search query
 * @param {number} resultsCount - Number of results
 */
export const trackSearch = (query, resultsCount) => {
  pushToDataLayer({
    event: 'search',
    searchTerm: query,
    searchResults: resultsCount
  });
};

/**
 * Track form submission
 * @param {string} formName - Name of the form
 * @param {string} formType - Type of form (e.g., 'contact', 'admissions')
 */
export const trackFormSubmission = (formName, formType) => {
  pushToDataLayer({
    event: 'formSubmission',
    formName: formName,
    formType: formType
  });
};

/**
 * Track article view
 * @param {string} articleTitle - Title of the article
 * @param {string} articleSlug - Slug of the article
 * @param {string} category - Article category
 */
export const trackArticleView = (articleTitle, articleSlug, category = null) => {
  pushToDataLayer({
    event: 'articleView',
    articleTitle: articleTitle,
    articleSlug: articleSlug,
    articleCategory: category
  });
};

/**
 * Track video play
 * @param {string} videoTitle - Title of the video
 * @param {string} videoUrl - URL of the video
 */
export const trackVideoPlay = (videoTitle, videoUrl) => {
  trackEvent('Video', 'Play', videoTitle);
  pushToDataLayer({
    event: 'videoPlay',
    videoTitle: videoTitle,
    videoUrl: videoUrl
  });
};

/**
 * Track download
 * @param {string} fileName - Name of downloaded file
 * @param {string} fileUrl - URL of the file
 * @param {string} fileType - Type of file (e.g., 'PDF', 'Image')
 */
export const trackDownload = (fileName, fileUrl, fileType) => {
  pushToDataLayer({
    event: 'fileDownload',
    fileName: fileName,
    fileUrl: fileUrl,
    fileType: fileType
  });
};

/**
 * Track external link click
 * @param {string} url - External URL
 * @param {string} linkText - Link text
 */
export const trackExternalLink = (url, linkText) => {
  pushToDataLayer({
    event: 'externalLinkClick',
    linkUrl: url,
    linkText: linkText
  });
};

/**
 * Track navigation interaction
 * @param {string} menuItem - Menu item name
 * @param {string} action - Action (e.g., 'open', 'click')
 */
export const trackNavigation = (menuItem, action) => {
  trackEvent('Navigation', action, menuItem);
};

/**
 * Track user interaction
 * @param {string} element - Element type
 * @param {string} action - Action performed
 * @param {string} label - Additional label
 */
export const trackInteraction = (element, action, label = null) => {
  trackEvent('User Interaction', `${element} - ${action}`, label);
};

// Initialize GTM on load
if (typeof window !== 'undefined') {
  initializeGTM();
}

const analytics = {
  initializeGTM,
  pushToDataLayer,
  trackPageView,
  trackEvent,
  trackSchoolSelection,
  trackSearch,
  trackFormSubmission,
  trackArticleView,
  trackVideoPlay,
  trackDownload,
  trackExternalLink,
  trackNavigation,
  trackInteraction
};

export default analytics;
