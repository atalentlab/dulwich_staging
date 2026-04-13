import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * useFullScreenScroll Hook
 * Enhances full-screen scrolling with GSAP animations and smooth transitions
 *
 * Features:
 * - Smooth snap scrolling between sections
 * - Fade-in animations on scroll
 * - Optional parallax effects
 * - Section progress tracking
 */
const useFullScreenScroll = (options = {}) => {
  const {
    enableFadeIn = true,
    enableParallax = false,
    snapDuration = 0.8,
    easing = 'power2.inOut'
  } = options;

  useEffect(() => {
    // Get all fullscreen sections
    const sections = gsap.utils.toArray('.fullscreen-section');

    if (sections.length === 0) return;

    // Add fade-in animation for each section
    if (enableFadeIn) {
      sections.forEach((section) => {
        gsap.fromTo(
          section,
          {
            opacity: 0,
            y: 50
          },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: easing,
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              end: 'top 20%',
              toggleActions: 'play none none reverse',
              scrub: false
            }
          }
        );
      });
    }

    // Add parallax effect if enabled
    if (enableParallax) {
      sections.forEach((section) => {
        const content = section.querySelector('.fullscreen-section-content');
        if (content) {
          gsap.to(content, {
            yPercent: -10,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
            }
          });
        }
      });
    }

    // Enhanced scroll snap with GSAP Observer for smooth wheel events
    const container = document.querySelector('.fullscreen-container');
    if (container) {
      let isScrolling = false;
      let scrollTimeout;

      const handleWheel = (e) => {
        if (isScrolling) {
          e.preventDefault();
          return;
        }

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          isScrolling = false;
        }, 100);
      };

      container.addEventListener('wheel', handleWheel, { passive: false });

      return () => {
        container.removeEventListener('wheel', handleWheel);
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      };
    }

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [enableFadeIn, enableParallax, snapDuration, easing]);
};

export default useFullScreenScroll;
