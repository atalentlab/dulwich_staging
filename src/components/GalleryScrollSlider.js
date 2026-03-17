import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';


function GalleryScrollSlider({ sectionRefs, isVisible }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollContainerRef = useRef(null);

  // Suppress ResizeObserver loop error (benign warning)
  React.useEffect(() => {
    const resizeObserverErrHandler = (e) => {
      if (e.message === 'ResizeObserver loop completed with undelivered notifications.') {
        const resizeObserverErr = e;
        resizeObserverErr.stopImmediatePropagation();
      }
    };
    window.addEventListener('error', resizeObserverErrHandler);
    return () => window.removeEventListener('error', resizeObserverErrHandler);
  }, []);

  const events = [
    {
      id: 1,
      badge: 'Senior School (Ages 11–18)',
      badgeColor: 'bg-red-600',
      title: 'IGCSE & IB Q&A and Group Tour',
      titleColor: 'text-red-600',
      dateTime: '09:30–12:00, 27 Nov 2025',
      subtitle: 'Bilingual',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
      details: [
        'Bilingual analysis of IGCSE+IB curricula strengths',
        'Personalised consultation on how international curriculum choices impact university applications',
        'Small-group campus tours and meeting with the Head of Senior School'
      ]
    },
    {
      id: 2,
      badge: 'DUCKS (Ages 0–3)',
      badgeColor: 'bg-yellow-500',
      title: 'Ducklings Playgroup',
      titleColor: 'text-yellow-600',
      dateTime: 'Every Friday 08:30–10:00, Sep 5 onwards',
      subtitle: 'For all families meeting eligibility criteria',
      image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80',
      details: [
        'Weekly playgroup featuring story time, sensory play and music session',
        'Free, but limited to 20 attendees',
        'Up to two accompanying guardians welcome (One must be a family member)'
      ]
    },
    {
      id: 3,
      badge: 'Junior School (Ages 7–11)',
      badgeColor: 'bg-cyan-600',
      title: 'Ages 7–11 Immersion Day',
      titleColor: 'text-cyan-600',
      dateTime: '13:00–16:00',
      subtitle: 'Friday 20 March 2026',
      image: 'https://images.unsplash.com/photo-1551927336-575d95f7b02f?w=800&q=80',
      details: [
        'Our Junior School Immersion Day welcomes prospective students aged between 7-11 years old.'
      ]
    },
    {
      id: 4,
      badge: 'Senior School (Ages 11–18)',
      badgeColor: 'bg-red-600',
      title: 'IGCSE & IB Q&A and Group Tour',
      titleColor: 'text-red-600',
      dateTime: '09:30–12:00, 27 Nov 2025',
      subtitle: 'Bilingual',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
      details: [
        'Bilingual analysis of IGCSE+IB curricula strengths',
        'Personalised consultation on how international curriculum choices impact university applications',
        'Small-group campus tours and meeting with the Head of Senior School'
      ]
    },
    {
      id: 5,
      badge: 'DUCKS (Ages 0–3)',
      badgeColor: 'bg-yellow-500',
      title: 'Ducklings Playgroup',
      titleColor: 'text-yellow-600',
      dateTime: 'Every Friday 08:30–10:00, Sep 5 onwards',
      subtitle: 'For all families meeting eligibility criteria',
      image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80',
      details: [
        'Weekly playgroup featuring story time, sensory play and music session',
        'Free, but limited to 20 attendees',
        'Up to two accompanying guardians welcome (One must be a family member)'
      ]
    },
    {
      id: 1,
      badge: 'Senior School (Ages 11–18)',
      badgeColor: 'bg-red-600',
      title: 'IGCSE & IB Q&A and Group Tour',
      titleColor: 'text-red-600',
      dateTime: '09:30–12:00, 27 Nov 2025',
      subtitle: 'Bilingual',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
      details: [
        'Bilingual analysis of IGCSE+IB curricula strengths',
        'Personalised consultation on how international curriculum choices impact university applications',
        'Small-group campus tours and meeting with the Head of Senior School'
      ]
    },
    {
      id: 2,
      badge: 'DUCKS (Ages 0–3)',
      badgeColor: 'bg-yellow-500',
      title: 'Ducklings Playgroup',
      titleColor: 'text-yellow-600',
      dateTime: 'Every Friday 08:30–10:00, Sep 5 onwards',
      subtitle: 'For all families meeting eligibility criteria',
      image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80',
      details: [
        'Weekly playgroup featuring story time, sensory play and music session',
        'Free, but limited to 20 attendees',
        'Up to two accompanying guardians welcome (One must be a family member)'
      ]
    },
    {
      id: 3,
      badge: 'Junior School (Ages 7–11)',
      badgeColor: 'bg-cyan-600',
      title: 'Ages 7–11 Immersion Day',
      titleColor: 'text-cyan-600',
      dateTime: '13:00–16:00',
      subtitle: 'Friday 20 March 2026',
      image: 'https://images.unsplash.com/photo-1551927336-575d95f7b02f?w=800&q=80',
      details: [
        'Our Junior School Immersion Day welcomes prospective students aged between 7-11 years old.'
      ]
    },
    {
      id: 1,
      badge: 'Senior School (Ages 11–18)',
      badgeColor: 'bg-red-600',
      title: 'IGCSE & IB Q&A and Group Tour',
      titleColor: 'text-red-600',
      dateTime: '09:30–12:00, 27 Nov 2025',
      subtitle: 'Bilingual',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
      details: [
        'Bilingual analysis of IGCSE+IB curricula strengths',
        'Personalised consultation on how international curriculum choices impact university applications',
        'Small-group campus tours and meeting with the Head of Senior School'
      ]
    },
    {
      id: 2,
      badge: 'DUCKS (Ages 0–3)',
      badgeColor: 'bg-yellow-500',
      title: 'Ducklings Playgroup',
      titleColor: 'text-yellow-600',
      dateTime: 'Every Friday 08:30–10:00, Sep 5 onwards',
      subtitle: 'For all families meeting eligibility criteria',
      image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80',
      details: [
        'Weekly playgroup featuring story time, sensory play and music session',
        'Free, but limited to 20 attendees',
        'Up to two accompanying guardians welcome (One must be a family member)'
      ]
    },
    {
      id: 3,
      badge: 'Junior School (Ages 7–11)',
      badgeColor: 'bg-cyan-600',
      title: 'Ages 7–11 Immersion Day',
      titleColor: 'text-cyan-600',
      dateTime: '13:00–16:00',
      subtitle: 'Friday 20 March 2026',
      image: 'https://images.unsplash.com/photo-1551927336-575d95f7b02f?w=800&q=80',
      details: [
        'Our Junior School Immersion Day welcomes prospective students aged between 7-11 years old.'
      ]
    },
    {
      id: 1,
      badge: 'Senior School (Ages 11–18)',
      badgeColor: 'bg-red-600',
      title: 'IGCSE & IB Q&A and Group Tour',
      titleColor: 'text-red-600',
      dateTime: '09:30–12:00, 27 Nov 2025',
      subtitle: 'Bilingual',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
      details: [
        'Bilingual analysis of IGCSE+IB curricula strengths',
        'Personalised consultation on how international curriculum choices impact university applications',
        'Small-group campus tours and meeting with the Head of Senior School'
      ]
    },
    {
      id: 2,
      badge: 'DUCKS (Ages 0–3)',
      badgeColor: 'bg-yellow-500',
      title: 'Ducklings Playgroup',
      titleColor: 'text-yellow-600',
      dateTime: 'Every Friday 08:30–10:00, Sep 5 onwards',
      subtitle: 'For all families meeting eligibility criteria',
      image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80',
      details: [
        'Weekly playgroup featuring story time, sensory play and music session',
        'Free, but limited to 20 attendees',
        'Up to two accompanying guardians welcome (One must be a family member)'
      ]
    },
    {
      id: 3,
      badge: 'Junior School (Ages 7–11)',
      badgeColor: 'bg-cyan-600',
      title: 'Ages 7–11 Immersion Day',
      titleColor: 'text-cyan-600',
      dateTime: '13:00–16:00',
      subtitle: 'Friday 20 March 2026',
      image: 'https://images.unsplash.com/photo-1551927336-575d95f7b02f?w=800&q=80',
      details: [
        'Our Junior School Immersion Day welcomes prospective students aged between 7-11 years old.'
      ]
    },
  ];

  // Get slides per view based on screen size
  const getSlidesPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 1; // Mobile: 1 slide
      if (window.innerWidth < 1024) return 2; // Tablet: 2 slides
      return 3; // Desktop: 3 slides
    }
    return 3;
  };

  const [slidesPerView, setSlidesPerView] = React.useState(getSlidesPerView());

  React.useEffect(() => {
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        window.requestAnimationFrame(() => {
          setSlidesPerView(getSlidesPerView());
        });
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handlePrevious = () => {
    // Infinite loop: go to last slide if at beginning
    const newSlide = currentSlide === 0 ? events.length - 1 : currentSlide - 1;
    setCurrentSlide(newSlide);
    scrollToSlide(newSlide);
  };

  const handleNext = () => {
    // Infinite loop: go to first slide if at end
    const newSlide = currentSlide === events.length - 1 ? 0 : currentSlide + 1;
    setCurrentSlide(newSlide);
    scrollToSlide(newSlide);
  };

  const scrollToSlide = (index) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const slides = container.children[0].children;
      if (slides[index]) {
        const slideWidth = slides[index].offsetWidth;
        const gap = 24; // gap-6 = 24px
        const scrollPosition = index * (slideWidth + gap);

        container.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  const handleDotClick = (index) => {
    setCurrentSlide(index);
    scrollToSlide(index);
  };

  // Auto-update current slide based on scroll position
  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let scrollTimer;
    const handleScroll = () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        window.requestAnimationFrame(() => {
          const slides = container.children[0]?.children;
          if (!slides || slides.length === 0) return;

          const slideWidth = slides[0].offsetWidth;
          const gap = 24;
          const scrollLeft = container.scrollLeft;
          const newSlide = Math.round(scrollLeft / (slideWidth + gap));

          if (newSlide !== currentSlide && newSlide >= 0 && newSlide < events.length) {
            setCurrentSlide(newSlide);
          }
        });
      }, 100);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearTimeout(scrollTimer);
      container.removeEventListener('scroll', handleScroll);
    };
  }, [currentSlide, events.length]);

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  return (
    <section
      id="gallery"
      ref={(el) => {
        sectionRefs.current['gallery'] = el;
      }}
      className={`bg-white py-16 mt-12 transition-all duration-1000 ${isVisible['gallery']
          ? 'opacity-100'
          : 'opacity-0'
        }`}
    >
      <div className="max-w-[1400px] m-auto pl-4 sm:pl-8 md:pl-12 lg:pl-16">
        {/* Slider Container */}
        <div
          ref={scrollContainerRef}
          className="w-full overflow-x-auto overflow-y-hidden scroll-smooth hide-scrollbar pb-8 mb-12 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="flex flex-row flex-nowrap gap-6 pr-4 sm:pr-8 md:pr-12 lg:pr-16">
            {events.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="flex flex-col flex-shrink-0 w-[calc(100%-2rem)] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-white rounded-2xl   shadow-[0_0_16px_rgba(0,0,0,0.08)]
  hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 overflow-hidden h-fit snap-start"
              >
                {/* Image with Badge */}
                <div className="relative h-48 w-full flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://assets.dulwich.org/thumbs/articles/fit/600x324/weixin-image-2025-09-16-140743-825.jpg'; }}
                  />
                  {/* Badge overlaid on image */}
                  <div className="absolute -bottom-3 left-4">
                    <span className={`${item.badgeColor} text-white px-4 py-2 rounded-full text-xs font-medium shadow-lg`}>
                      {item.badge}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="w-full p-8 text-left flex flex-col flex-grow">
                  {/* Title */}
                  <h3 className={`${item.titleColor} text-xl sm:text-2xl font-bold mb-2 leading-tight`}>
                    {item.title}
                  </h3>

                  {/* Date/Time */}
                  <div className="mb-4">
                    <p className="text-gray-900 font-semibold text-sm">{item.dateTime}</p>
                    <p className="text-gray-600 text-sm">{item.subtitle}</p>
                  </div>

                  {/* Details */}
                  <ul className="flex-grow">
                    {item.details.map((detail, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700 text-sm mt-1">
                        <Check className={`rounded-full ${item.badgeColor} text-white mt-1.5 flex-shrink-0 w-3 h-3 p-0`} />

                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Register Button */}
                  <div className="mt-4">
                    <button className={`border-2 ${item.titleColor.replace('text-', 'border-')} ${item.titleColor} px-6 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300 inline-block`}>
                      Register
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination and Navigation Controls */}
        <div className="flex items-center justify-between pr-4 sm:pr-8 md:pr-12 lg:pr-16">
          {/* Pagination Dots - Hidden on Mobile */}
          <div className="hidden sm:flex items-center gap-2">
            {events.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`h-2 rounded-full transition-all duration-300 ${currentSlide === index
                    ? 'w-[72px] bg-red-600'
                    : 'w-8 bg-[#F2EDE9] hover:bg-gray-400'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Spacer on Mobile (replaces pagination dots) */}
          <div className="sm:hidden"></div>

          {/* Previous/Next Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrevious}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center border-2 border-gray-300 text-gray-700 hover:border-red-600 hover:text-red-600 hover:bg-red-50 transition-all duration-300"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center border-1 border-[#F2EDE9] text-[#D30013] hover:border-red-600 hover:text-red-600 bg-[#FAF7F5] hover:bg-red-50 transition-all duration-300"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}

export default GalleryScrollSlider;