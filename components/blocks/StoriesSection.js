import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * StoriesSection Component
 * Displays student stories/testimonials with a sticky left sidebar navigation
 * Features:
 * - Sticky left sidebar with section navigation
 * - Card-based story layout
 * - Slider/carousel navigation
 * - Responsive design
 */
const StoriesSection = ({ content }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);

  // Parse content
  const stories = Array.isArray(content) ? content : [];
  const title = content?.title || 'Student Stories and Friends of Dulwich';
  const sidebarItems = content?.sidebarItems || [
    'Student Stories',
    'Alumni Success',
    'Parent Testimonials',
    'Community Impact'
  ];

  if (stories.length === 0) return null;

  const itemsPerSlide = 3;
  const totalSlides = Math.ceil(stories.length / itemsPerSlide);

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <>
      <style>{`
        /* Stories Section Layout */
        .stories-section {
          display: flex;
          max-width: 1440px;
          margin: 4rem auto;
          padding: 0 2rem;
          gap: 3rem;
        }

        /* Sticky Left Sidebar */
        .stories-sidebar {
          position: sticky;
          top: 140px;
          width: 280px;
          height: fit-content;
          padding: 2rem 1.5rem;
          background: #FFFFFF;
          border-right: 1px solid #E5E7EB;
          flex-shrink: 0;
        }

        .stories-sidebar-title {
          font-size: 12px;
          font-weight: 700;
          color: #D30013;
          margin-bottom: 1.5rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .stories-sidebar-item {
          display: block;
          padding: 0.75rem 0;
          padding-left: 1rem;
          color: #6B7280;
          text-decoration: none;
          font-size: 15px;
          font-weight: 400;
          border-left: 4px solid transparent;
          transition: all 0.2s ease;
          cursor: pointer;
          line-height: 1.5;
        }

        .stories-sidebar-item:hover {
          color: #374151;
          padding-left: 1.25rem;
        }

        .stories-sidebar-item.active {
          color: #111827;
          font-weight: 600;
          border-left-color: #D30013;
          padding-left: 1.25rem;
        }

        /* Main Content Area */
        .stories-content {
          flex: 1;
          overflow: hidden;
        }

        .stories-header {
          margin-bottom: 3rem;
        }

        .stories-title {
          font-size: 42px;
          font-weight: bold;
          color: #3C3C3B;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        /* Slider Container */
        .stories-slider {
          position: relative;
          overflow: hidden;
        }

        .stories-track {
          display: flex;
          transition: transform 0.5s ease-in-out;
          gap: 1.5rem;
        }

        /* Story Card */
        .story-card {
          flex: 0 0 calc(33.333% - 1rem);
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .story-card:hover {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          transform: translateY(-4px);
        }

        .story-image-container {
          position: relative;
          width: 100%;
          height: 280px;
          overflow: hidden;
        }

        .story-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .story-card:hover .story-image {
          transform: scale(1.05);
        }

        .story-label {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: rgba(255, 255, 255, 0.95);
          color: #D30013;
          padding: 0.5rem 1rem;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-radius: 4px;
        }

        .story-content {
          padding: 2rem;
        }

        .story-title {
          font-size: 20px;
          font-weight: 700;
          color: #3C3C3B;
          margin-bottom: 1rem;
          line-height: 1.3;
        }

        .story-text {
          font-size: 15px;
          color: #6B7280;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .story-quote {
          font-size: 16px;
          color: white;
          line-height: 1.6;
          font-style: italic;
          padding: 2rem;
        }

        .story-author {
          font-size: 14px;
          color: white;
          font-weight: 600;
          padding: 0 2rem 2rem 2rem;
        }

        .story-cta {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          color: #D30013;
          border: 2px solid #D30013;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .story-cta:hover {
          background: #D30013;
          color: white;
        }

        /* Navigation Controls */
        .stories-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid #E5E7EB;
        }

        .stories-dots {
          display: flex;
          gap: 0.75rem;
        }

        .story-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #D1D5DB;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .story-dot.active {
          background: #D30013;
          width: 40px;
          border-radius: 6px;
        }

        .stories-arrows {
          display: flex;
          gap: 1rem;
        }

        .story-arrow {
          width: 48px;
          height: 48px;
          border: 2px solid #D30013;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #D30013;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .story-arrow:hover {
          background: #D30013;
          color: white;
        }

        .story-arrow:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .story-arrow:disabled:hover {
          background: white;
          color: #D30013;
        }

        /* Quote Card - Special styling for quote cards */
        .story-card.quote-card {
          background: #D30013;
        }

        .story-card.quote-card .story-content {
          padding: 0;
        }

        /* Responsive Design */
        @media (max-width: 1280px) {
          .stories-section {
            gap: 2rem;
          }

          .stories-sidebar {
            width: 240px;
          }

          .story-card {
            flex: 0 0 calc(50% - 0.75rem);
          }
        }

        @media (max-width: 768px) {
          .stories-section {
            flex-direction: column;
            padding: 0 1rem;
            margin: 2rem auto;
          }

          .stories-sidebar {
            position: relative;
            top: 0;
            width: 100%;
            border-right: none;
            border-bottom: 1px solid #E5E7EB;
          }

          .stories-title {
            font-size: 32px;
          }

          .story-card {
            flex: 0 0 100%;
          }

          .stories-arrows {
            display: none;
          }
        }
      `}</style>

      <div className="stories-section">
        {/* Sticky Left Sidebar */}
        <aside className="stories-sidebar">
          <div className="stories-sidebar-title">SECTIONS</div>
          <nav>
            {sidebarItems.map((item, index) => (
              <div
                key={index}
                className={`stories-sidebar-item ${index === 0 ? 'active' : ''}`}
              >
                {item}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="stories-content">
          {/* Header */}
          <div className="stories-header">
            <h2 className="stories-title">{title}</h2>
          </div>

          {/* Slider */}
          <div className="stories-slider" ref={sliderRef}>
            <div
              className="stories-track"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`
              }}
            >
              {stories.map((story, index) => (
                <div
                  key={index}
                  className={`story-card ${story.type === 'quote' ? 'quote-card' : ''}`}
                >
                  {story.type === 'quote' ? (
                    // Quote Card
                    <>
                      <div className="story-quote">
                        <span style={{ fontSize: '48px', lineHeight: '1' }}>"</span>
                        <p>{story.quote}</p>
                      </div>
                      <div className="story-author">{story.author}</div>
                    </>
                  ) : (
                    // Regular Story Card
                    <>
                      <div className="story-image-container">
                        <img
                          src={story.image}
                          alt={story.title}
                          className="story-image"
                        />
                        {story.label && (
                          <div className="story-label">{story.label}</div>
                        )}
                      </div>
                      <div className="story-content">
                        <h3 className="story-title">{story.title}</h3>
                        <p className="story-text">{story.excerpt}</p>
                        {story.cta && (
                          <a href={story.link} className="story-cta">
                            {story.cta}
                          </a>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="stories-nav">
            <div className="stories-dots">
              {[...Array(totalSlides)].map((_, index) => (
                <div
                  key={index}
                  className={`story-dot ${currentSlide === index ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
            <div className="stories-arrows">
              <button
                className="story-arrow"
                onClick={prevSlide}
                disabled={currentSlide === 0}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                className="story-arrow"
                onClick={nextSlide}
                disabled={currentSlide === totalSlides - 1}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StoriesSection;
