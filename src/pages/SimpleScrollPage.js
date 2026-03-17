import React, { useState, useEffect, useRef } from 'react';

/**
 * Simple Full-Screen Scrolling - NO LENIS
 * Pure CSS scroll-snap for maximum Mac trackpad compatibility
 */

function SimpleScrollPage() {
  const [activeSection, setActiveSection] = useState(0);
  const sectionsRef = useRef([]);
  const containerRef = useRef(null);

  const sections = [
    { bg: 'bg-gradient-to-br from-blue-500 to-purple-600', title: 'Section 1', subtitle: 'Welcome' },
    { bg: 'bg-gradient-to-br from-green-500 to-teal-600', title: 'Section 2', subtitle: 'About Us' },
    { bg: 'bg-gradient-to-br from-orange-500 to-red-600', title: 'Section 3', subtitle: 'Services' },
    { bg: 'bg-gradient-to-br from-pink-500 to-purple-600', title: 'Section 4', subtitle: 'Portfolio' },
    { bg: 'bg-gradient-to-br from-indigo-500 to-blue-600', title: 'Section 5', subtitle: 'Contact' },
  ];

  // Track active section
  useEffect(() => {
    const options = {
      root: containerRef.current,
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = sectionsRef.current.indexOf(entry.target);
          if (index !== -1) {
            setActiveSection(index);
          }
        }
      });
    }, options);

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  // Scroll to section
  const scrollToSection = (index) => {
    const section = sectionsRef.current[index];
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative w-full h-screen">
      {/* Navigation Dots */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 hidden md:flex flex-col gap-3">
        {sections.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToSection(index)}
            className="group relative"
            aria-label={`Go to section ${index + 1}`}
          >
            <div
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeSection === index
                  ? 'bg-white scale-150 shadow-lg'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          </button>
        ))}
      </div>

      {/* Mobile Navigation */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 md:hidden flex gap-2 bg-white/20 backdrop-blur-md px-4 py-3 rounded-full">
        {sections.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToSection(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              activeSection === index
                ? 'bg-white w-8'
                : 'bg-white/50 w-2'
            }`}
            aria-label={`Go to section ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Container - PURE CSS */}
      <div
        ref={containerRef}
        className="w-full h-screen overflow-y-auto overflow-x-hidden"
        style={{
          scrollSnapType: 'y mandatory',
          scrollBehavior: 'smooth',
        }}
      >
        {sections.map((section, index) => (
          <section
            key={index}
            ref={(el) => (sectionsRef.current[index] = el)}
            className={`w-full h-screen flex flex-col items-center justify-center ${section.bg}`}
            style={{
              scrollSnapAlign: 'start',
              scrollSnapStop: 'always',
            }}
          >
            <div className="text-center text-white">
              <h1 className="text-7xl md:text-8xl font-bold mb-4 animate-fade-in">
                {section.title}
              </h1>
              <p className="text-2xl md:text-3xl opacity-90">
                {section.subtitle}
              </p>
              <div className="mt-8 text-sm opacity-70">
                Scroll with trackpad ↓
              </div>
            </div>
          </section>
        ))}
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}

export default SimpleScrollPage;
