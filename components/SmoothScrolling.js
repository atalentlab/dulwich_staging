import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import '../styles/smoothScroll.css';

function SmoothScrolling({ children }) {
  const lenisRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    // Add lenis class to HTML element
    document.documentElement.classList.add('lenis', 'lenis-smooth');

    // Initialize Lenis for all pages
    const lenis = new Lenis({
      wrapper: window,
      content: document.documentElement,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // Expose lenis globally for use in other components
    window.lenis = lenis;

    // Animation loop
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      lenis.destroy();
      window.lenis = null;
      document.documentElement.classList.remove('lenis', 'lenis-smooth');
    };
  }, [location.pathname]);

  return <>{children}</>;
}

export default SmoothScrolling;
