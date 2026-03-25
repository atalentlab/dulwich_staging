import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../utils/analytics';

/**
 * Custom hook to track page views with Google Tag Manager
 * Automatically tracks when the route changes
 */
const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Get page title from document or use pathname
    const pageTitle = document.title || location.pathname;

    // Track page view
    trackPageView(location.pathname + location.search, pageTitle);

    // Scroll to top on route change (optional)
    window.scrollTo(0, 0);
  }, [location]);
};

export default usePageTracking;
