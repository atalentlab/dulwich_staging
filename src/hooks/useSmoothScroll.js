import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook to enable smooth scrolling to anchor links
 * @param {boolean} isReady - Whether the page content is ready (data loaded)
 */
const useSmoothScroll = (isReady = true) => {
  const location = useLocation();

  useEffect(() => {
    if (!isReady) return;

    // Check if there's a hash in the URL
    const hash = location.hash;

    if (hash) {
      // Remove the # symbol
      const id = hash.replace('#', '');

      // Wait a bit for the page to render
      const timer = setTimeout(() => {
        const element = document.getElementById(id);

        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [location.hash, isReady]);

  // Handle click events on anchor links
  useEffect(() => {
    if (!isReady) return;

    const handleAnchorClick = (e) => {
      const target = e.target.closest('a');

      if (target && target.hash) {
        const id = target.hash.replace('#', '');
        const element = document.getElementById(id);

        if (element) {
          e.preventDefault();
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });

          // Update URL without causing a page reload
          window.history.pushState(null, '', target.hash);
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, [isReady]);
};

export default useSmoothScroll;
