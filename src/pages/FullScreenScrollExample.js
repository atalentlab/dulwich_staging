import React, { useState, useEffect, useRef } from 'react';

/**
 * Full-Screen Scroll Example
 *
 * This is a simplified example showing how to implement
 * Apple-style full-screen scrolling with React.
 *
 * Features:
 * - CSS scroll-snap for smooth section snapping
 * - Intersection Observer to track active section
 * - Navigation dots for direct section access
 * - Fully responsive design
 */

function FullScreenScrollExample() {
  const [activeSection, setActiveSection] = useState(0);
  const sectionsRef = useRef([]);
  const observerRef = useRef(null);
  const containerRef = useRef(null);

  const totalSections = 5; // Number of sections

  // Scroll to specific section
  const scrollToSection = (index) => {
    if (index < 0 || index >= totalSections) return;
    const section = sectionsRef.current[index];
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Track active section with Intersection Observer
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5, // Section is "active" when 50% visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = sectionsRef.current.findIndex(
            (section) => section === entry.target
          );
          if (index !== -1) {
            setActiveSection(index);
          }
        }
      });
    }, options);

    // Observe all sections
    sectionsRef.current.forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-white">
      {/* Navigation Dots */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-40 hidden md:flex flex-col gap-3">
        {Array.from({ length: totalSections }).map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToSection(index)}
            className="group relative"
            aria-label={`Go to section ${index + 1}`}
          >
            <div
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeSection === index
                  ? 'bg-blue-600 scale-150'
                  : 'bg-gray-400 hover:bg-gray-600'
              }`}
            />
          </button>
        ))}
      </div>

      {/* Main Scroll Container */}
      <div
        ref={containerRef}
        className="w-full h-screen overflow-y-scroll overflow-x-hidden"
        style={{
          scrollSnapType: 'y proximity',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'none',
        }}
      >
        {/* Section 1 */}
        <section
          ref={(el) => (sectionsRef.current[0] = el)}
          className="w-full h-screen flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600"
          style={{
            scrollSnapAlign: 'start',
            scrollSnapStop: 'always',
          }}
        >
          <div className="text-center text-white">
            <h1 className="text-6xl font-bold mb-4">Welcome</h1>
            <p className="text-xl">Scroll down to explore</p>
          </div>
        </section>

        {/* Section 2 */}
        <section
          ref={(el) => (sectionsRef.current[1] = el)}
          className="w-full h-screen flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-green-500 to-teal-600"
          style={{
            scrollSnapAlign: 'start',
            scrollSnapStop: 'always',
          }}
        >
          <div className="text-center text-white">
            <h2 className="text-5xl font-bold mb-4">Feature One</h2>
            <p className="text-lg max-w-md mx-auto">
              This is a full-screen section with smooth scrolling
            </p>
          </div>
        </section>

        {/* Section 3 */}
        <section
          ref={(el) => (sectionsRef.current[2] = el)}
          className="w-full h-screen flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-orange-500 to-red-600"
          style={{
            scrollSnapAlign: 'start',
            scrollSnapStop: 'always',
          }}
        >
          <div className="text-center text-white">
            <h2 className="text-5xl font-bold mb-4">Feature Two</h2>
            <p className="text-lg max-w-md mx-auto">
              Each section snaps perfectly into view
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section
          ref={(el) => (sectionsRef.current[3] = el)}
          className="w-full h-screen flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-pink-500 to-purple-600"
          style={{
            scrollSnapAlign: 'start',
            scrollSnapStop: 'always',
          }}
        >
          <div className="text-center text-white">
            <h2 className="text-5xl font-bold mb-4">Feature Three</h2>
            <p className="text-lg max-w-md mx-auto">
              Works perfectly on all devices
            </p>
          </div>
        </section>

        {/* Section 5 */}
        <section
          ref={(el) => (sectionsRef.current[4] = el)}
          className="w-full h-screen flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-blue-600"
          style={{
            scrollSnapAlign: 'start',
            scrollSnapStop: 'always',
          }}
        >
          <div className="text-center text-white">
            <h2 className="text-5xl font-bold mb-4">Get Started</h2>
            <button className="mt-4 px-8 py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              Learn More
            </button>
          </div>
        </section>
      </div>

      {/* Mobile Navigation */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 md:hidden flex gap-2 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-full">
        {Array.from({ length: totalSections }).map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToSection(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              activeSection === index
                ? 'bg-blue-600 w-8'
                : 'bg-gray-400'
            }`}
            aria-label={`Go to section ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default FullScreenScrollExample;
