import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './YearsAnniversaryBlock.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://www.dulwich.atalent.xyz';

/**
 * Custom Arrow Components
 */
const NextArrow = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="anniversary-arrow anniversary-arrow-next"
      aria-label="Next slide"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
};

const PrevArrow = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="anniversary-arrow anniversary-arrow-prev"
      aria-label="Previous slide"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  );
};

/**
 * YearsAnniversaryBlock Component
 * Displays anniversary milestones and celebrations in a slider
 *
 * API Response:
 * {
 *   "type": "years_anniversary",
 *   "content": {
 *     "years_anniversary": ["4"],
 *     "anchor-id": null
 *   }
 * }
 */
const YearsAnniversaryBlock = ({ content }) => {
  const { years_anniversary = [], 'anchor-id': anchorId } = content;
  const [anniversaryData, setAnniversaryData] = useState([]);
  const [anniversaryName, setAnniversaryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1280
  );
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (years_anniversary.length > 0) {
      fetchAnniversaryData();
    } else {
      setLoading(false);
    }
  }, [years_anniversary]);

  const fetchAnniversaryData = async () => {
    try {
      setLoading(true);
      const eventId = years_anniversary[0];

      // Fetch anniversary name from the anniversary list
      const nameRes = await fetch(`${API_BASE_URL}/api/anniversary`);
      const nameData = await nameRes.json();
      if (nameData.success && Array.isArray(nameData.data)) {
        const match = nameData.data.find(
          (a) => String(a.id) === String(eventId) && a.published === 1
        );
        if (match) {
          setAnniversaryName(match.name);
        }
      }

      // Fetch anniversary events
      const promises = years_anniversary.map(id =>
        fetch(`${API_BASE_URL}/api/anniversary_event_by_id?event_id=${id}`)
          .then(res => res.json())
          .then(data => {
            console.log(`Fetched anniversary event ${id}:`, data);
            if (data.success && Array.isArray(data.data)) {
              return data.data.filter(item => item.published === 1);
            }

            return [];
          })
          .catch(err => {
            console.error(`Error fetching anniversary event ${id}:`, err);
            return [];
          })
      );

      const results = await Promise.all(promises);
      const allEvents = results.flat();
      setAnniversaryData(allEvents);
    } catch (error) {
      console.error('Error fetching anniversaries:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D30013]"></div>
      </div>
    );
  }

  if (anniversaryData.length === 0) {
    return null;
  }

  // Compute slidesToShow based on actual window width
  const getSlidesToShow = () => {
    const max = anniversaryData.length;
    if (windowWidth < 640) return 1;
    if (windowWidth < 768) return Math.min(2, max);
    if (windowWidth < 1024) return Math.min(3, max);
    if (windowWidth < 1280) return Math.min(4, max);
    return Math.min(5, max);
  };

  const slidesToShow = getSlidesToShow();
  const isMobile = windowWidth < 768;

  // Slider settings
  const sliderSettings = {
    dots: !isMobile,
    infinite: anniversaryData.length > slidesToShow,
    speed: 500,
    slidesToShow,
    slidesToScroll: 1,
    arrows: !isMobile,
    autoplay: false,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    dotsClass: "slick-dots anniversary-dots",
    afterChange: (index) => setCurrentSlide(index),
  };

  return (
    <section data-id={anchorId} className="py-8 md:py-16 px-4 bg-white">
      <div className="max-w-[1490px] mx-auto">
        {/* Header */}
        <div className="mb-8 md:mb-12 flex justify-between items-start">
          <div>
            {anniversaryName && (
              <h2 className="text-2xl md:text-4xl lg:text-5xl text-left font-bold text-gray-900 mb-2">
                {anniversaryName}
              </h2>
            )}
          </div>

        </div>

        {/* Slider */}
        <div className="anniversary-slider">
          <Slider ref={sliderRef} key={slidesToShow} {...sliderSettings}>
            {anniversaryData.map((item, index) => (
              <div key={item.id || index} className="px-2 h-full">
                <div className="bg-[#fff] overflow-hidden h-full flex flex-col items-start">
                  {/* Image */}
                  <div className="w-full h-[220px] sm:h-[280px] md:h-[340px] lg:h-[400px] bg-[#E8E4DD] rounded-lg flex items-start justify-center flex-shrink-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.sub_title || `Anniversary ${item.year || '20XX'}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400 text-6xl font-bold">
                        {item.year || '20XX'}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-3 sm:p-4 md:p-6 flex flex-col flex-grow">
                    <h3 className="text-xl md:text-2xl text-left font-bold text-gray-900 mb-3 md:mb-4">
                      {item.year || '20XX'}
                    </h3>
                    {item.sub_title && (
                      <h4 className="text-base md:text-lg text-left font-semibold text-gray-800 mb-2">
                        {item.sub_title}
                      </h4>
                    )}
                    <p className="text-left text-gray-700 text-sm mb-6 line-clamp-5">
                      {item.introducty_text || ''}
                    </p>

                    {/* CTA button: cta_type "1" = external (cta_link), "0" = internal (page/cta_page) */}
                    {item.cta && (() => {
                      const isExternal = String(item.cta_type) === '1';
                      const href = isExternal
                        ? (item.cta_link || '#')
                        : (item.cta_page ? `/page/${item.cta_page}` : '#');
                      return (
                        <div className="mt-auto flex justify-start">
                          <a
                            href={href}
                            target={isExternal ? '_blank' : '_self'}
                            rel={isExternal ? 'noopener noreferrer' : undefined}
                            className="inline-flex items-center gap-3 text-[#D30013] font-semibold text-sm"
                          >
                            <span className="h-10 border-2 border-[#D30013] rounded flex items-center justify-center px-4 gap-2">
                              <span>{item.cta}</span>
                              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                              </svg>
                            </span>
                          </a>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            ))}
          </Slider>

          {/* Custom navigation: arrows + counter — mobile only */}
          <div className="flex md:hidden items-center gap-2 mt-6">
            <button
              onClick={() => sliderRef.current?.slickPrev()}
              aria-label="Previous slide"
              className="w-11 h-11 flex items-center justify-center rounded border border-[#E0E0E0] bg-white text-gray-500 hover:border-gray-400 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => sliderRef.current?.slickNext()}
              aria-label="Next slide"
              className="w-11 h-11 flex items-center justify-center rounded border border-[#E0E0E0] bg-white text-[#D30013] hover:border-gray-400 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="ml-auto px-4 h-11 flex items-center justify-center rounded border border-[#E0E0E0] bg-white text-sm text-gray-700 font-medium min-w-[72px]">
              {currentSlide + 1} / {anniversaryData.length}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default YearsAnniversaryBlock;
