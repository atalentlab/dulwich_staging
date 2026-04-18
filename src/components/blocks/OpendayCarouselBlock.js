import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const COLOR_MAP = {
  red: '#D30013',
  yellow: '#FFB909',
  blue: '#009ED0',
  green: '#00A651',
};

// Extract <li> text items from HTML, or fall back to plain text
function parseContent(html) {
  if (!html) return [];
  const listItems = html.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];
  if (listItems.length > 0) {
    return listItems
      .map(item => item.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\uFEFF/g, '').trim())
      .filter(Boolean);
  }
  const text = html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
  return text ? [text] : [];
}

// Build href from CTA type:
// "page"  → use contextual-link-data.url (falls back to cta-link)
// "link"  → use cta-link directly
// "none"  → null (no button rendered)
function buildCta(type, link, contextualData) {
  if (type === 'none' || !type) return null;
  if (type === 'page') {
    const url = contextualData?.url || link || null;
    return url ? { href: url, external: false } : null;
  }
  if (type === 'link' && link) return { href: link, external: true };
  return null;
}

function OpendayCarouselBlock({ items = [], content = [] }) {
  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const isDraggingRef = useRef(false);

  // Suppress ResizeObserver loop error (benign warning)
  React.useEffect(() => {
    const handler = (e) => {
      if (e.message === 'ResizeObserver loop completed with undelivered notifications.') {
        e.stopImmediatePropagation();
      }
    };
    window.addEventListener('error', handler);
    return () => window.removeEventListener('error', handler);
  }, []);

  // Map grouped block items to event objects
  const events = items.map((item, idx) => {
    const c = item.content || content[idx] || {};
    const color = COLOR_MAP[c.school_type_color] || COLOR_MAP.red;
    return {
      id: item.id || idx,
      badge: c.odc_school_type || '',
      color,
      title: c.odc_title || '',
      dateTime: c.odc_datetime || '',
      subtitle: c.odc_subtitle || '',
      image: c.odc_image || '',
      details: parseContent(c.odc_content),
      ctaText: c['cta-text'] || '',
      cta: buildCta(c['cta-type'], c['cta-link'], c['contextual-link-data']),
    };
  });


  const NextArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="hidden min-[775px]:flex w-12 h-12 lg:w-14 lg:h-14 rounded-lg items-center justify-center border-2 border-[#F2EDE9] text-[#D30013] hover:border-[#D30013] hover:text-white hover:bg-[#D30013] bg-[#FAF7F5] transition-all duration-300 absolute bottom-0 max-[800px]:-bottom-16 right-4 sm:right-8 md:right-12 lg:right-16 z-10 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
      aria-label="Next slide"
    >
      <ChevronRight className="w-6 h-6 lg:w-7 lg:h-7" strokeWidth={2.5} />
    </button>
  );

  const PrevArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="hidden min-[775px]:flex w-12 h-12 lg:w-14 lg:h-14 rounded-lg items-center justify-center border-2 mr-2 border-[#F2EDE9] text-[#D30013] hover:border-[#D30013] hover:text-white hover:bg-[#D30013] bg-[#FAF7F5] transition-all duration-300 absolute bottom-0 max-[800px]:-bottom-16 right-[4.5rem] sm:right-[5.5rem] md:right-[6.5rem] lg:right-[7.5rem] z-10 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
      aria-label="Previous slide"
    >
      <ChevronLeft className="w-6 h-6 lg:w-7 lg:h-7" strokeWidth={2.5} />
    </button>
  );

  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3.5,
    slidesToScroll: 1,
    centerMode: false,
    variableWidth: false,
    swipeToSlide: true,
    touchThreshold: 5,
    swipe: true,
    touchMove: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: (current, next) => {
      isDraggingRef.current = true;
      setCurrentSlide(next);
    },
    afterChange: () => {
      // Reset dragging flag after animation completes
      setTimeout(() => {
        isDraggingRef.current = false;
      }, 100);
    },
    appendDots: dots => (
      <div className="pl-4 sm:pl-8 md:pl-12 lg:pl-[calc((100vw-1120px)/2)]">
        <ul style={{ margin: "0px", display: "flex", gap: "8px" }}>{dots}</ul>
      </div>
    ),
    customPaging: (i) => (
      <button>
        <div className={`h-2 rounded-full transition-all duration-300 ${currentSlide === i ? 'w-[72px] bg-red-600' : 'w-8 bg-[#F2EDE9] hover:bg-gray-400'
          }`}></div>
      </button>
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2.5,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
          arrows: false,
          variableWidth: false,
          centerMode: false,
          centerPadding: '0px',
          infinite: true,
          swipeToSlide: true,
          swipe: true,
          touchMove: true,
          touchThreshold: 5,
          speed: 400,
          draggable: true,
        }
      }
    ]
  };

  if (events.length === 0) return null;

  return (
    <section className="bg-white py-4 md:py-6 lg:py-8 mt-3 md:mt-4 openday-carousel overflow-hidden">
      <div className="w-full relative overflow-hidden">
        {/* Slider Container */}
        <div className="w-full pb-4 md:pb-8 mb-8 md:mb-12 slider-container-padding">
          <Slider ref={sliderRef} {...settings}>
            {events.map((item, idx) => {
              const CardWrapper = item.cta ? 'a' : 'div';
              const wrapperProps = item.cta ? {
                href: item.cta.href,
                target: item.cta.external ? '_blank' : '_self',
                rel: item.cta.external ? 'noopener noreferrer' : undefined,
                onClick: (e) => {
                  // Prevent navigation if slider just changed (user was swiping)
                  if (isDraggingRef.current) {
                    e.preventDefault();
                  }
                },
              } : {};
              return (
                <div key={`${item.id}-${idx}`} className="max-[800px]:px-0 px-2 md:px-3">
                  <CardWrapper
                    {...wrapperProps}
                    className="flex flex-col bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.10)] hover:shadow-[0_6px_28px_rgba(0,0,0,0.16)] transition-all duration-300 transform hover:-translate-y-1 no-underline h-fit overflow-visible w-full"
                  >
                    {/* Image with Badge */}
                    <div className="relative h-44 md:h-52 w-full flex-shrink-0 overflow-visible pb-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover rounded-t-lg"
                        onError={(e) => { e.target.src = 'https://assets.dulwich.org/thumbs/articles/fit/600x324/weixin-image-2025-09-16-140743-825.jpg'; }}
                      />
                      <div className="absolute -bottom-0 left-4 md:left-6 z-10 overflow-visible">
                        <span
                          className="text-white px-3 md:px-4 py-2.5 md:py-3.5 my-1 rounded-full z-10 text-xs md:text-sm font-medium shadow-lg"
                          style={{ backgroundColor: item.color }}
                        >
                          {item.badge}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="w-full p-4 md:p-6 text-left flex flex-col pb-3 md:pb-4 mb-2 bg-white rounded-b-2xl">
                      <h3
                        className="text-lg md:text-xl lg:text-2xl font-extrabold mb-2 leading-tight"
                        style={{ color: item.color }}
                      >
                        {item.title}
                      </h3>

                      <div className="mb-3 md:mb-4">
                        <p className="text-[#3C3737] font-bold text-sm md:text-base leading-tight mb-1">{item.dateTime}</p>
                        <p className="text-[#3C3737] text-sm md:text-base">{item.subtitle}</p>
                      </div>

                      <ul className="mb-3 md:mb-4 space-y-1">
                        {item.details.map((detail, index) => (
                          <li key={index} className="flex items-start gap-2 text-[#3C3737]">
                            {item.details.length > 1 && (
                              <Check
                                className="rounded-full text-white mt-1 md:mt-1.5 flex-shrink-0 w-2.5 h-2.5 p-0.2"
                                style={{ backgroundColor: item.color }}
                              />
                            )}
                            <span className='text-xs md:text-sm text-[#3C3737] font-normal leading-relaxed'>{detail}</span>
                          </li>
                        ))}
                      </ul>

                      {item.cta && item.ctaText && (
                        <div className="mt-auto">
                          <span
                            className="border-2 px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-semibold text-sm md:text-base hover:bg-gray-50 transition-all duration-300 inline-block"
                            style={{ borderColor: item.color, color: item.color }}
                          >
                            {item.ctaText}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardWrapper>
                </div>
              );
            })}
          </Slider>

          {/* Mobile Nav Bar - Only visible on mobile (below 800px) */}
          <div className="max-[800px]:flex hidden items-center justify-between mt-8 px-6">
            {/* Left: Prev / Next buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => sliderRef.current?.slickPrev()}
                className="w-12 h-12 rounded-lg flex items-center justify-center border-2 border-[#F2EDE9] text-[#D30013] hover:border-[#D30013] hover:bg-[#D30013] hover:text-white bg-[#FAF7F5] transition-all duration-300 active:scale-95 shadow-sm"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6" strokeWidth={2} />
              </button>
              <button
                onClick={() => sliderRef.current?.slickNext()}
                className="w-12 h-12 rounded-lg flex items-center justify-center border-2 border-[#F2EDE9] text-[#D30013] hover:border-[#D30013] hover:bg-[#D30013] hover:text-white bg-[#FAF7F5] transition-all duration-300 active:scale-95 shadow-sm"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6" strokeWidth={2} />
              </button>
            </div>
            {/* Right: Counter */}
            <span className="text-[#3C3737] text-base font-semibold border-2 border-[#F2EDE9] bg-[#FAF7F5] rounded-lg px-6 py-3 shadow-sm">
              {currentSlide + 1} / {events.length}
            </span>
          </div>
        </div>
      </div>

      <style>{`
        /* Container padding - responsive */
        .slider-container-padding {
          padding-left: max(1rem, calc((100vw - 1120px) / 2));
          padding-right: 0;
        }

        @media (max-width: 800px) {
          .slider-container-padding {
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
        }

        .openday-carousel .slick-slide {
          height: auto;
          transition: transform 0.3s ease;
        }
        .openday-carousel .slick-slide > div {
          height: 100%;
        }
        .openday-carousel .slick-track {
          display: flex !important;
          align-items: stretch;
      
          margin-bottom: 20px;
          transition: transform 0.5s ease;
        }
        .openday-carousel .slick-list {
          margin-left: 0;
          padding-left: 0 !important;
          overflow-x: hidden;
        }

        /* Smooth card transitions */
        .openday-carousel .slick-slide > div > div {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .openday-carousel .slick-current {
          z-index: 1;
        }

        .openday-carousel .slick-dots {
          position: relative;
          bottom: auto;
          margin-top: 40px;
        }
        .openday-carousel .slick-dots li {
          margin: 0;
          width: auto;
          height: auto;
        }
        .openday-carousel .slick-dots li button {
          width: auto;
          height: auto;
          padding: 0;
        }
        .openday-carousel .slick-dots li button:before {
          display: none;
        }
        @media (max-width: 800px) {
          .openday-carousel .slick-dots {
            display: none !important;
          }
          .openday-carousel .slick-track {
            margin-left: 0 !important;
            margin-bottom: 40px !important;
            display: flex !important;
          }
          .openday-carousel .slick-slide {
            padding: 0 16px !important;
            width: 100vw !important;
            display: flex !important;
            justify-content: center !important;
            flex-shrink: 0 !important;
            box-sizing: border-box !important;
          }
          .openday-carousel .slick-slide > div {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 auto !important;
            padding: 0 !important;
            box-sizing: border-box !important;
          }
          .openday-carousel .slick-slide > div > div {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 auto !important;
            padding: 0 !important;
          }
          .openday-carousel .slick-list {
            padding-left: 0 !important;
            padding-right: 0 !important;
            overflow: hidden !important;
            width: 100% !important;
            margin: 0 !important;
          }
          .openday-carousel {
            overflow: hidden !important;
            width: 100% !important;
          }
        }

        /* Tablet improvements */
        @media (min-width: 801px) and (max-width: 1024px) {
          .openday-carousel .slick-track {
            margin-left: 8% !important;
          }
        }

        /* Touch device improvements */
        @media (hover: none) and (pointer: coarse) {
          .openday-carousel .slick-slide {
            cursor: grab;
          }
          .openday-carousel .slick-slide:active {
            cursor: grabbing;
          }
        }

        /* Improve touch responsiveness */
        .openday-carousel .slick-list {
          -webkit-overflow-scrolling: touch;
        }

        .openday-carousel a {
          -webkit-tap-highlight-color: transparent;
          pointer-events: auto;
        }

        /* Mobile touch optimization - allow horizontal swipe */
        @media (max-width: 800px) {
          .openday-carousel .slick-list {
            touch-action: pan-x pan-y pinch-zoom !important;
          }
          .openday-carousel .slick-track {
            touch-action: pan-x pan-y !important;
          }
          .openday-carousel .slick-slide {
            touch-action: pan-x pan-y !important;
          }
          .openday-carousel a {
            touch-action: pan-x pan-y !important;
          }
        }
      `}</style>
    </section>
  );
}

export default OpendayCarouselBlock;
