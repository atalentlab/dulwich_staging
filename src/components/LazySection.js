import React, { useState, useEffect, useRef } from 'react';
import './LazySection.css';

/**
 * LazySection Component
 * Lazy loads section content only when it comes into viewport
 * Improves performance by deferring render of off-screen content
 *
 * Props:
 * - children: Content to lazy load
 * - threshold: Intersection threshold (0-1, default: 0.1)
 * - rootMargin: Margin around root (default: "200px" - loads 200px before visible)
 * - placeholder: Custom placeholder component while loading
 * - once: Load once and keep loaded (default: true)
 */
const LazySection = ({
  children,
  threshold = 0.1,
  rootMargin = '200px',
  placeholder = null,
  once = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const currentRef = sectionRef.current;
    if (!currentRef) return;

    // Create intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            setHasLoaded(true);

            // If once=true, stop observing after first load
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin, // Load content 200px before it enters viewport
      }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, rootMargin, once]);

  // Decide what to render
  const shouldRender = once ? hasLoaded : isVisible;

  return (
    <div ref={sectionRef} className="lazy-section">
      {shouldRender ? (
        <div className="lazy-section-content fade-in">
          {children}
        </div>
      ) : (
        placeholder || (
          <div className="lazy-section-placeholder">
            <div className="lazy-loader">
              <div className="spinner"></div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default LazySection;
