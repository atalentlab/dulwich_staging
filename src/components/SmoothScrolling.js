import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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

    // Integrate Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Tell GSAP to use Lenis for scrolling via ticker
    const tickerFunc = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerFunc);

    gsap.ticker.lagSmoothing(0);

    // Cleanup
    return () => {
      gsap.ticker.remove(tickerFunc);
      lenis.destroy();
      window.lenis = null;
      document.documentElement.classList.remove('lenis', 'lenis-smooth');
    };
  }, [location.pathname]);

  return <>{children}</>;
}

export default SmoothScrolling;
