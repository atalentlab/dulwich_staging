import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * useSmoothScroll Hook
 * Handles smooth scrolling to sections based on URL hash or query parameter
 *
 * Usage:
 * - Hash-based: /page#section-name
 * - Query-based: /page?anchor=section-name
 *
 * Searches for elements with data-id matching the anchor value
 */
const useSmoothScroll = (isDataLoaded = true) => {
  const location = useLocation();

  useEffect(() => {
    // Don't run if data isn't loaded yet
    if (!isDataLoaded) {
      return;
    }

    let anchorId = null;

    // Method 1: Check for hash in URL (e.g., #open-day)
    if (location.hash) {
      anchorId = location.hash.substring(1); // Remove the '#'
    }
    // Method 2: Check for anchor query parameter (e.g., ?anchor=open-day)
    else {
      const params = new URLSearchParams(location.search);
      anchorId = params.get('anchor');
    }

    if (!anchorId) {
      return;
    }

    console.log('🔍 Looking for anchor:', anchorId);

    // Try multiple times with increasing delays to ensure DOM is ready
    const attempts = [300, 600, 1000, 1500];
    let attemptCount = 0;

    const tryScroll = () => {
      // First try to find element with data-id attribute
      const elementWithDataId = document.querySelector(`[data-id="${anchorId}"]`);

      if (elementWithDataId) {
        console.log('✅ Found element with data-id:', anchorId);

        // Calculate position with offset for fixed header
        const headerOffset = 120; // Adjust this value based on your header height
        const elementPosition = elementWithDataId.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        // Smooth scroll to position
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        console.log(`📍 Scrolled to section: ${anchorId}`);
        return true;
      } else {
        // Fallback: try standard id attribute
        const elementWithId = document.getElementById(anchorId);
        if (elementWithId) {
          console.log('✅ Found element with id:', anchorId);

          const headerOffset = 120;
          const elementPosition = elementWithId.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

          console.log(`📍 Scrolled to section (fallback): ${anchorId}`);
          return true;
        } else {
          console.warn(`⚠️ Section not found (attempt ${attemptCount + 1}):`, anchorId);
          return false;
        }
      }
    };

    // Initial attempt
    if (tryScroll()) {
      return;
    }

    // Retry with delays if initial attempt failed
    const timers = attempts.map((delay, index) => {
      return setTimeout(() => {
        attemptCount = index + 1;
        if (tryScroll()) {
          // Clear remaining timers if successful
          timers.slice(index + 1).forEach(t => clearTimeout(t));
        }
      }, delay);
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [location.hash, location.search, location.pathname, isDataLoaded]);
};

export default useSmoothScroll;
