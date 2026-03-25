import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getCurrentSchool } from '../utils/schoolDetection';

/**
 * School PopCard Component
 * Loads the Access Platform popcard widget for Seoul and Singapore schools on specific pages
 */
const SeoulPopCard = () => {
  const location = useLocation();
  const currentSchoolSlug = getCurrentSchool();

  useEffect(() => {
    // School-specific configurations
    const schoolConfigs = {
      seoul: {
        universityID: 684,
        title: "Chat to Our Parents & Staff",
        baseUrl: "https://seoul.dulwich.org"
      },
      singapore: {
        universityID: 335,
        title: "Chat with our Parents",
        baseUrl: "https://singapore.dulwich.org"
      }
    };

    // Debug logging
    console.log('🎯 PopCard Debug:', {
      currentSchoolSlug,
      pathname: location.pathname,
      hasConfig: !!schoolConfigs[currentSchoolSlug]
    });

    // Only load for Seoul or Singapore schools
    if (!schoolConfigs[currentSchoolSlug]) {
      console.log('⚠️ PopCard not loading: School not Seoul or Singapore');
      return;
    }

    const config = schoolConfigs[currentSchoolSlug];

    // Determine which page we're on and set appropriate UTM source
    let utmSource = null;
    const pathname = location.pathname;

    // Check if homepage
    if (pathname === '/' || pathname === '/zh' || pathname === '/zh/') {
      utmSource = 'homepage';
    }
    // Check if admissions overview page
    else if (pathname.includes('admissions-overview') || pathname.includes('/admissions/overview')) {
      utmSource = 'admissionsoverview';
    }
    // Check if friends of dulwich page
    else if (pathname.includes('friends-of-dulwich')) {
      utmSource = 'fod';
    }

    // If not a matching page, don't load the script
    if (!utmSource) {
      console.log('⚠️ PopCard not loading: Page path not matched. Current path:', pathname);
      return;
    }

    console.log('✅ PopCard loading for:', { school: currentSchoolSlug, page: utmSource });

    // Load popcard script
    const loadPopCard = () => {
      // Define the popCard initialization function
      window.popCard = 'mw';
      window.mw = window.mw || function() {
        (window.mw.q = window.mw.q || []).push(arguments);
      };

      // Create and inject the script
      const script = document.createElement('script');
      script.id = 'mw';
      script.src = 'https://cdn.theaccessplatform.com/popcard.js';
      script.async = true;

      script.onload = () => {
        console.log('✅ PopCard script loaded successfully');
        // Initialize popcard with school-specific configuration
        window.mw('init', {
          universityID: config.universityID,
          terms: [],
          title: config.title,
          popcardButtonText: "",
          alignment: "right",
          viewType: "common",
          backgroundColor: "#4f4c4c",
          titleColor: "#efefef",
          buttonTextColor: "#ffffff",
          href: `${config.baseUrl}/chat-with-our-parents?tap-dashboard=true&utm_medium=popcard&utm_source=${utmSource}&leadType=tap_feed`
        });
        console.log('✅ PopCard initialized');
      };

      script.onerror = (error) => {
        console.error('❌ PopCard script failed to load:', error);
        console.error('Script URL:', script.src);
      };

      // Insert script into DOM
      const firstScript = document.getElementsByTagName('script')[0];
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
      } else {
        document.head.appendChild(script);
      }
    };

    // Load the script
    loadPopCard();

    // Cleanup function to remove script when component unmounts or dependencies change
    return () => {
      const script = document.getElementById('mw');
      if (script) {
        script.remove();
      }
      // Clean up global objects
      if (window.mw) {
        delete window.mw;
      }
      if (window.popCard) {
        delete window.popCard;
      }
    };
  }, [currentSchoolSlug, location.pathname]);

  // This component doesn't render anything
  return null;
};

export default SeoulPopCard;
