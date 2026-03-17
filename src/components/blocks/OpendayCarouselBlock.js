import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const COLOR_MAP = {
  red:    '#D30013',
  yellow: '#FFB909',
  blue:   '#009ED0',
  green:  '#00A651',
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
      className="hidden min-[775px]:block w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center border-2 border-[#F2EDE9] text-[#D30013] hover:border-red-600 hover:text-red-600 bg-[#FAF7F5] hover:bg-red-50 transition-all duration-300 absolute bottom-0 max-[800px]:-bottom-16 right-4 sm:right-8 md:right-12 lg:right-16 z-10"
      aria-label="Next slide"
    >
      <ChevronRight className="w-5 h-5" />
    </button>
  );

  const PrevArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="hidden min-[775px]:block w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center border-2 border-[#F2EDE9] text-[#D30013] hover:border-red-600 hover:text-red-600 bg-[#FAF7F5] hover:bg-red-50 transition-all duration-300 absolute bottom-0 max-[800px]:-bottom-16 right-[4.5rem] sm:right-[5.5rem] md:right-[6.5rem] lg:right-[7.5rem] z-10"
      aria-label="Previous slide"
    >
      <ChevronLeft className="w-5 h-5" />
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
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: (current, next) => setCurrentSlide(next),
    appendDots: dots => (
      <div className="pl-4 sm:pl-8 md:pl-12 lg:pl-[calc((100vw-1120px)/2)]">
        <ul style={{ margin: "0px", display: "flex", gap: "8px" }}>{dots}</ul>
      </div>
    ),
    customPaging: (i) => (
      <button>
        <div className={`h-2 rounded-full transition-all duration-300 ${
          currentSlide === i ? 'w-[72px] bg-red-600' : 'w-8 bg-[#F2EDE9] hover:bg-gray-400'
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
          centerMode: true,
          centerPadding: '20px',
        }
      }
    ]
  };

  if (events.length === 0) return null;

  return (
    <section className="bg-white py-16 mt-12 openday-carousel">
      <div className="w-full relative">
        {/* Slider Container */}
        <div
          className="w-full pb-8 mb-12"
          style={{
            paddingLeft: 'max(1rem, calc((100vw - 1120px) / 2))',
            paddingRight: '0'
          }}
        >
          <Slider ref={sliderRef} {...settings}>
            {events.map((item, idx) => {
              const CardWrapper = item.cta ? 'a' : 'div';
              const wrapperProps = item.cta ? {
                href: item.cta.href,
                target: item.cta.external ? '_blank' : '_self',
                rel: item.cta.external ? 'noopener noreferrer' : undefined,
              } : {};
              return (
                <div key={`${item.id}-${idx}`} className="px-3">
                  <CardWrapper
                    {...wrapperProps}
                    className="flex flex-col bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.10)] hover:shadow-[0_6px_28px_rgba(0,0,0,0.16)] transition-all duration-300 no-underline h-fit overflow-visible"
                  >
                  {/* Image with Badge */}
                  <div className="relative h-52 w-full flex-shrink-0 overflow-visible pb-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover rounded-t-lg"
                      onError={(e) => { e.target.src = 'https://assets.dulwich.org/thumbs/articles/fit/600x324/weixin-image-2025-09-16-140743-825.jpg'; }}
                    />
                    <div className="absolute -bottom-0 left-6 z-10 overflow-visible">
                      <span
                        className="text-white px-4 py-3.5 my-1 rounded-full z-10 text-[14px] font-medium shadow-l"
                        style={{ backgroundColor: item.color }}
                      >
                        {item.badge}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="w-full p-6 text-left flex flex-col pb-4 mb-2 bg-white rounded-b-2xl">
                    <h3
                      className="text-xl sm:text-2xl font-extrabold mb-2 leading-tight"
                      style={{ color: item.color }}
                    >
                      {item.title}
                    </h3>

                    <div className="mb-4">
                      <p className="text-[#3C3737] font-bold text-[16px] leading-none">{item.dateTime}</p>
                      <p className="text-[#3C3737] text-[16px]">{item.subtitle}</p>
                    </div>

                    <ul className="mb-4">
                      {item.details.map((detail, index) => (
                        <li key={index} className="flex items-start gap-2 text-[#3C3737] text-sm">
                          {item.details.length > 1 && (
                            <Check
                              className="rounded-full text-white mt-1.5 flex-shrink-0 w-2.5 h-2.5 p-0.2"
                              style={{ backgroundColor: item.color }}
                            />
                          )}
                          <span className='text-[14px] text-[#3C3737] font-normal leading-[24px]'>{detail}</span>
                        </li>
                      ))}
                    </ul>

                    {item.cta && item.ctaText && (
                      <div className="mt-auto">
                        <span
                          className="border px-6 py-2.5 rounded-lg font-semibold text-[16px] hover:bg-gray-50 transition-all duration-300 inline-block"
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
          <div className="max-[800px]:flex hidden items-center justify-between mt-4 px-4">
            {/* Left: Prev / Next buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => sliderRef.current?.slickPrev()}
                className="w-10 h-10 rounded-lg flex items-center justify-center border-2 border-[#F2EDE9] text-[#D30013] hover:border-[#D30013] bg-[#FAF7F5] hover:bg-red-50 transition-all duration-300"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => sliderRef.current?.slickNext()}
                className="w-10 h-10 rounded-lg flex items-center justify-center border-2 border-[#F2EDE9] text-[#D30013] hover:border-[#D30013] bg-[#FAF7F5] hover:bg-red-50 transition-all duration-300"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            {/* Right: Counter */}
            <span className="text-[#3C3737] text-sm font-medium border-2 border-[#F2EDE9] bg-[#FAF7F5] rounded-lg px-4 py-2">
              {currentSlide + 1} / {events.length}
            </span>
          </div>
        </div>
      </div>

      <style>{`
        .openday-carousel .slick-slide {
          height: auto;
        }
        .openday-carousel .slick-slide > div {
          height: 100%;
        }
        .openday-carousel .slick-track {
          display: flex !important;
          align-items: stretch;
          margin-left: 14% !important;
          margin-bottom: 20px;
        }
        .openday-carousel .slick-list {
          margin-left: 0;
          padding-left: 0 !important;
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
            margin-bottom: 60px;
          }
          .openday-carousel .slick-slide {
            padding: 0;
            width: 365px !important;
          }
          .openday-carousel .slick-slide > div {
            width: 365px;
            margin: 0 auto;
          }
          .openday-carousel .slick-slide > div > div {
            max-width: 365px;
            margin: 0 auto;
          }
          .openday-carousel .slick-list {
            padding-left: 0 !important;
            padding-right: 0 !important;
            overflow: visible;
          }
        }
      `}</style>
    </section>
  );
}

export default OpendayCarouselBlock;
