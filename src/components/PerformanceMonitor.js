import React, { useState, useEffect } from 'react';
import './PerformanceMonitor.css';

/**
 * PerformanceMonitor Component
 * Debug tool to visualize which sections are loaded
 * Shows in development mode only
 *
 * Usage: Add to Home.js for debugging
 * <PerformanceMonitor enabled={process.env.NODE_ENV === 'development'} />
 */
const PerformanceMonitor = ({ enabled = false }) => {
  const [loadedSections, setLoadedSections] = useState([]);
  const [isMinimized, setIsMinimized] = useState(true);

  useEffect(() => {
    if (!enabled) return;

    // Observe all lazy sections
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const sections = document.querySelectorAll('.lazy-section-content');
          const loaded = Array.from(sections).map((section) => {
            const parent = section.closest('.fullscreen-section');
            return parent?.id || 'unknown';
          });
          setLoadedSections(loaded);
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, [enabled]);

  if (!enabled) return null;

  const allSections = [
    'hero',
    'stats',
    'academic-results',
    'curriculum',
    'accordion',
    'eligibility-1',
    'eligibility-2',
    'promo-2col',
    'promo-3col',
    'promo-4col',
    'promo-micro',
    'join-dulwich',
    'gallery',
    'live-world-wise',
    'testimonials',
    'three-grid',
    'accordion-small',
    'school-locations',
    'admissions'
  ];

  return (
    <div className={`performance-monitor ${isMinimized ? 'minimized' : ''}`}>
      <div className="monitor-header" onClick={() => setIsMinimized(!isMinimized)}>
        <span className="monitor-title">
          🚀 Performance Monitor
        </span>
        <span className="monitor-toggle">
          {isMinimized ? '▼' : '▲'}
        </span>
      </div>

      {!isMinimized && (
        <div className="monitor-content">
          <div className="monitor-stats">
            <div className="stat">
              <span className="stat-label">Loaded:</span>
              <span className="stat-value">{loadedSections.length}/{allSections.length}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Percentage:</span>
              <span className="stat-value">
                {Math.round((loadedSections.length / allSections.length) * 100)}%
              </span>
            </div>
          </div>

          <div className="monitor-sections">
            {allSections.map((sectionId) => {
              const isLoaded = loadedSections.includes(sectionId);
              return (
                <div
                  key={sectionId}
                  className={`section-status ${isLoaded ? 'loaded' : 'pending'}`}
                >
                  <span className="status-indicator">
                    {isLoaded ? '✅' : '⏳'}
                  </span>
                  <span className="section-name">{sectionId}</span>
                </div>
              );
            })}
          </div>

          <div className="monitor-info">
            <p className="info-text">
              Sections load when you scroll to them.
              Green = Loaded, Gray = Waiting
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceMonitor;
