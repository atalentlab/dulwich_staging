import React, { useState, useEffect } from 'react';
import './ScrollIndicator.css';

/**
 * ScrollIndicator Component
 * Displays navigation dots for full-screen sections
 *
 * Props:
 * - sections: Array of section IDs to track
 * - activeSection: Currently active section ID
 */
const ScrollIndicator = ({ sections = [], activeSection }) => {
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map(id => document.getElementById(id));
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      sectionElements.forEach((section, index) => {
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionBottom = sectionTop + section.offsetHeight;

          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            setCurrentSection(index);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (index) => {
    const section = document.getElementById(sections[index]);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (sections.length === 0) return null;

  return (
    <div className="scroll-indicator">
      {sections.map((sectionId, index) => (
        <button
          key={sectionId}
          className={`scroll-indicator-dot ${currentSection === index ? 'active' : ''}`}
          onClick={() => scrollToSection(index)}
          aria-label={`Go to section ${index + 1}`}
        >
          <span className="dot-inner"></span>
        </button>
      ))}
    </div>
  );
};

export default ScrollIndicator;
