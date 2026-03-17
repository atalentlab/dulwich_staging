import React, { useState, useEffect, useRef } from 'react';
import { Maximize2, MoveDiagonal } from 'lucide-react';
import Icon from '../Icon';

// Icon and color mapping based on level/title
const LEVEL_CONFIG = {
  'Ducks': {
    tag: '#009ED0',
    overlay: 'bg-[#009ED0]/60',
    gradient: 'bg-gradient-to-t from-[#009ed0]/90 via-[#009ed0]/70 to-[#009ed0]/50',
    activeText: 'text-[#009ED0]',
    iconName: 'dock1',
  },
  'Junior': {
    tag: '#FFB909',
    overlay: 'bg-[#FFB909]/60',
    gradient: 'bg-gradient-to-t from-[#D4831A]/90 via-[#FFB909]/70 to-[#FFB909]/50',
    activeText: 'text-[#FFB909]',
    iconName: 'plants',
  },
  'Senior': {
    tag: '#D30013',
    overlay: 'bg-[#D30013]/60',
    gradient: 'bg-gradient-to-t from-[#9E1422] via-[#D30013]/70 to-[#D30013]/50',
    activeText: 'text-[#D30013]',
    iconName: 'bucket',
  },
  'IGCSE': {
    tag: '#D30013',
    overlay: 'bg-[#D30013]/60',
    gradient: 'bg-gradient-to-t from-[#9E1422] via-[#D30013]/70 to-[#D30013]/50',
    activeText: 'text-[#D30013]',
    iconName: 'DCI-Icon_Curriculum-IGCSE',
  },
  'A-level': {
    tag: '#D30013',
    overlay: 'bg-[#D30013]/60',
    gradient: 'bg-gradient-to-t from-[#9E1422] via-[#D30013]/70 to-[#D30013]/50',
    activeText: 'text-[#D30013]',
    iconName: 'DCI-Icon_Curriculum-ALevel',
  },
  'Pre A Level': {
    tag: '#D30013',
    overlay: 'bg-[#D30013]/60',
    gradient: 'bg-gradient-to-t from-[#9E1422] via-[#D30013]/70 to-[#D30013]/50',
    activeText: 'text-[#D30013]',
    iconName: 'DCI-Icon_Curriculum-Pre_ALevel',
  },
  'Boarding-A': {
    tag: '#D30013',
    overlay: 'bg-[#D30013]/60',
    gradient: 'bg-gradient-to-t from-[#9E1422] via-[#D30013]/70 to-[#D30013]/50',
    activeText: 'text-[#D30013]',
    iconName: 'DCI-Icon_Curriculum-BoardingA',
  },
  'Boarding-B': {
    tag: '#D30013',
    overlay: 'bg-[#D30013]/60',
    gradient: 'bg-gradient-to-t from-[#9E1422] via-[#D30013]/70 to-[#D30013]/50',
    activeText: 'text-[#D30013]',
    iconName: 'DCI-Icon_Curriculum-BoardingB',
  },
};

// Default color scheme for unmatched levels
const DEFAULT_COLOR = {
  tag: '#D30013',
  overlay: 'bg-[#D30013]/60',
  gradient: 'bg-gradient-to-t from-[#9E1422] via-[#D30013]/70 to-[#D30013]/50',
  activeText: 'text-[#D30013]',
  iconName: 'bucket',
};

// Helper function to get color config based on level/title
function getColorConfig(item) {
  // Check multiple possible fields for level/curriculum information
  const searchText = [
    item.age_limit,
    item.title,
    item.curriculum,
    item.level,
    item.levels,  // Added: Check 'levels' field (plural)
    item.category,
    item.name
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ') // Remove special characters
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();

  console.log('LiveWorldWiseGrid - Matching text:', searchText, 'for item:', item.title || item.age_limit || item.levels);

  // Check for exact matches or partial matches - order matters (most specific first)
  // Handle Ducks/Dock variations
  if (searchText.includes('duck') || searchText.includes('dock')) {
    console.log('  → Matched: Ducks (Blue)');
    return LEVEL_CONFIG['Ducks'];
  }

  // Handle Junior variations
  if (searchText.includes('junior')) {
    console.log('  → Matched: Junior (Yellow)');
    return LEVEL_CONFIG['Junior'];
  }

  // Handle Pre A Level (check before A Level to avoid false match)
  if (searchText.includes('pre a level') || searchText.includes('prea level') || searchText.includes('pre alevel')) {
    console.log('  → Matched: Pre A Level (Red)');
    return LEVEL_CONFIG['Pre A Level'];
  }

  // Handle A Level / A Lelels
  if (searchText.includes('a level') || searchText.includes('alevel') || searchText.includes('a lelels') || searchText.includes('alelels')) {
    console.log('  → Matched: A-level (Red)');
    return LEVEL_CONFIG['A-level'];
  }

  // Handle IGCSE
  if (searchText.includes('igcse')) {
    console.log('  → Matched: IGCSE (Red)');
    return LEVEL_CONFIG['IGCSE'];
  }

  // Handle Boarding variations
  if (searchText.includes('boarding a') || searchText.includes('boardinga')) {
    console.log('  → Matched: Boarding-A (Red)');
    return LEVEL_CONFIG['Boarding-A'];
  }

  if (searchText.includes('boarding b') || searchText.includes('boardingb')) {
    console.log('  → Matched: Boarding-B (Red)');
    return LEVEL_CONFIG['Boarding-B'];
  }

  // Handle Senior
  if (searchText.includes('senior') || searchText.includes('selvas senior')) {
    console.log('  → Matched: Senior (Red)');
    return LEVEL_CONFIG['Senior'];
  }

  console.log('  → No match, using default (Red)');
  return DEFAULT_COLOR;
}

function stripHtml(html) {
  if (!html) return '';
  // Use DOMParser instead of createElement to avoid React DOM conflicts
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}

function getCtaUrl(item) {
  const ctaLink = item['cta-link'];
  if (ctaLink) {
    if (ctaLink.startsWith('http')) return ctaLink;
    return ctaLink.startsWith('/') ? ctaLink : `/${ctaLink}`;
  }
  return item['contextual-link-data']?.url || null;
}

const EASE = 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

function LiveWorldWiseGrid({ content }) {
  const sliderRef = useRef(null);
  const trackRef = useRef(null);
  const drag = useRef({ active: false });
  const skipEffect = useRef(false);

  const [expandedIndex, setExpandedIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const items = Array.isArray(content) ? content : [];
  const itemsRef = useRef(items);

  // Update items ref
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  // Sync track when tab is clicked
  useEffect(() => {
    if (!trackRef.current || !sliderRef.current || expandedIndex === null) return;
    if (skipEffect.current) { skipEffect.current = false; return; }
    const W = sliderRef.current.offsetWidth;
    const idx = Math.max(0, expandedIndex);
    trackRef.current.style.transition = EASE;
    trackRef.current.style.transform = `translateX(${-idx * W}px)`;
  }, [expandedIndex]);

  // Snap to index
  const snapTo = (idx) => {
    const W = sliderRef.current?.offsetWidth || 0;
    if (!trackRef.current) return;
    trackRef.current.style.transition = EASE;
    trackRef.current.style.transform = `translateX(${-idx * W}px)`;
  };

  // Drag functionality
  const beginDrag = (clientX) => {
    if (expandedIndex === null || !sliderRef.current || !trackRef.current) return;
    const W = sliderRef.current.offsetWidth;
    const idx = Math.max(0, expandedIndex);
    trackRef.current.style.transition = 'none';
    drag.current = {
      active: true,
      startX: clientX,
      startIndex: idx,
      baseOffset: -idx * W,
      W,
      offsetPx: 0,
      velX: 0,
      lastX: clientX,
      lastT: Date.now(),
    };
    setIsDragging(true);
  };

  const moveDrag = (clientX) => {
    if (!drag.current.active || !trackRef.current) return;
    const now = Date.now();
    const dt = now - drag.current.lastT || 1;
    drag.current.velX = (clientX - drag.current.lastX) / dt;
    drag.current.lastX = clientX;
    drag.current.lastT = now;
    drag.current.offsetPx = clientX - drag.current.startX;
    trackRef.current.style.transform = `translateX(${drag.current.baseOffset + drag.current.offsetPx}px)`;
  };

  const endDrag = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    setIsDragging(false);

    const { W, startIndex, offsetPx, velX } = drag.current;
    const threshold = W * 0.2;
    const momentum = velX * 150;
    const total = offsetPx + momentum;

    let newIndex = startIndex;
    if (total < -threshold) newIndex = Math.min(startIndex + 1, itemsRef.current.length - 1);
    else if (total > threshold) newIndex = Math.max(startIndex - 1, 0);

    snapTo(newIndex);
    skipEffect.current = true;
    setExpandedIndex(newIndex);
  };

  // Global mouse listeners while dragging
  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e) => moveDrag(e.clientX);
    const onUp = () => endDrag();
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]);

  const handleExpandView = (index) => {
    skipEffect.current = true;
    setExpandedIndex(index);

    // Use double requestAnimationFrame to ensure DOM has fully rendered and layout calculated
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (trackRef.current && sliderRef.current) {
          const W = sliderRef.current.offsetWidth;
          const idx = Math.max(0, index);
          trackRef.current.style.transition = 'none';
          trackRef.current.style.transform = `translateX(${-idx * W}px)`;
        }
      });
    });
  };

  const handleCloseExpandView = () => {
    setExpandedIndex(null);
  };

  // Keyboard navigation
  useEffect(() => {
    if (expandedIndex === null) return;
    const onKeyPress = (e) => {
      const currentIdx = expandedIndex;
      if (e.key === 'ArrowLeft' && currentIdx < itemsRef.current.length - 1) {
        setExpandedIndex(currentIdx + 1);
      } else if (e.key === 'ArrowRight' && currentIdx > 0) {
        setExpandedIndex(currentIdx - 1);
      } else if (e.key === 'Escape') {
        handleCloseExpandView();
      }
    };
    document.addEventListener('keydown', onKeyPress);
    return () => document.removeEventListener('keydown', onKeyPress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expandedIndex]);

  // Early return after all hooks
  if (items.length === 0) return null;

  const activeItem = expandedIndex !== null ? items[expandedIndex] : null;
  const activeColor = expandedIndex !== null ? getColorConfig(items[expandedIndex]) : null;

  return (
    <section className="bg-white py-3">
      <div className="w-full max-w-[1390px] mx-auto px-4 sm:px-6 lg:px-9">
        <div className="relative overflow-hidden h-[610px] sm:h-[580px] md:h-[600px] lg:h-[784px]">

          {/* Cards Grid */}
          <div
            className="absolute inset-0 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-5"
            style={{
              transform: expandedIndex !== null ? 'translateX(100%)' : 'translateX(0)',
              transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {items.map((item, index) => {
              const color = getColorConfig(item);
              return (
                <div
                  key={index}
                  className="relative group overflow-hidden rounded-lg shadow border border-[#F2EDE9] bg-white transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer h-full"
                  onClick={() => handleExpandView(index)}
                >
                <div className="hidden min-[775px]:block relative h-[220px] sm:h-[480px] md:h-[780px] overflow-hidden rounded-lg">
                  <img
                    src={item.thumbnail_image}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-center transition-all duration-500 ease-in-out group-hover:scale-105 group-hover:brightness-105 will-change-transform"
                  />
                </div>
                {/* for mob */}
                <div className="block min-[775px]:hidden relative sm:h-[480px] md:h-[780px] overflow-visible rounded-lg">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-auto object-fit overflow-visible transition-all duration-500 ease-in-out group-hover:scale-105 group-hover:brightness-105 will-change-transform"
                  />
                </div>

                {/* Age tag - moved outside image container */}
                <div
                  className="absolute bottom-[30%] md:bottom-[11%] z-20 left-4 md:left-6 text-[#fff] px-3 py-2 md:px-4 md:py-3 rounded font-semibold text-[14px] md:text-[16px]"
                  style={{ backgroundColor: color.tag }}
                >
                  {item.age_limit}
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-white z-10 p-4 md:p-6 md:py-8 flex items-center justify-between">
                  <h3 className="text-lg md:text-2xl font-bold text-[#3C3737]">{item.title}</h3>

                  <div
                    className="relative flex-shrink-0 rounded-full w-12 h-12 border border-[#D30013] text-[#D30013] transition-all duration-500 ease-in-out group-hover:w-[4.2rem] group-hover:bg-[#D30013] group-hover:text-white group-hover:border-transparent"
                    onClick={e => { e.stopPropagation(); handleExpandView(index); }}
                  >
                    <MoveDiagonal className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5" />
                  </div>
                </div>
              </div>
              );
            })}
          </div>

          {/* Expanded View */}
          <div
            className="absolute inset-0 flex flex-col overflow-hidden rounded-lg"
            style={{
              transform: expandedIndex !== null ? 'translateX(0)' : 'translateX(-100%)',
              transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {activeItem && activeColor && (
              <>
                {/* Background Image with Color Overlay */}
                <div className="absolute inset-0 z-0">
          <div className="block min-[775px]:hidden absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${activeItem.thumbnail_image})`,
              filter: "brightness(0.7)",
            }}
          >
                    <div className={`absolute inset-0 ${activeColor.overlay} mix-blend-multiply`}></div>
                    <div className={`absolute inset-0 ${activeColor.gradient}`}></div>
                  </div>

                  {/* Desktop background (>=775px) */}
                  <div className="hidden min-[775px]:block absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${activeItem.image})`,
                      filter: "brightness(0.7)",
                    }}
                  >
                    <div className={`absolute inset-0 ${activeColor.overlay} mix-blend-multiply`}></div>
                    <div className={`absolute inset-0 ${activeColor.gradient}`}></div>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={handleCloseExpandView}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 z-10 inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-white/80 hover:text-white hover:bg-white/15 transition-all duration-300 border border-white/20 bg-black/10"
                >
                  <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm font-semibold">Close</span>
                </button>

                {/* Swipeable Slider Area */}
                <div
                  ref={sliderRef}
                  className="flex-1 overflow-hidden select-none"
                  style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                  onMouseDown={(e) => beginDrag(e.clientX)}
                  onTouchStart={(e) => beginDrag(e.touches[0].clientX)}
                  onTouchMove={(e) => { e.preventDefault(); moveDrag(e.touches[0].clientX); }}
                  onTouchEnd={endDrag}
                >
                  {/* Track */}
                  <div
                    ref={trackRef}
                    className="flex h-full"
                    style={{ willChange: 'transform' }}
                  >
                    {items.map((item, index) => (
                      <div
                        key={index}
                        className="flex-shrink-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-10 pointer-events-none w-full"
                      >
                        <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4 md:space-y-5">
                          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold text-white">
                            {item.title}
                          </h2>
                          {item.age_limit && (
                            <p className="text-white/90 text-base sm:text-lg md:text-xl font-semibold">
                              {item.age_limit}
                            </p>
                          )}
                          <p className="text-white/80 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                            {stripHtml(item.content)}
                          </p>
                          {item['cta-text'] && getCtaUrl(item) && (
                            <div className="pt-1 sm:pt-2">
                              <a
                                href={getCtaUrl(item)}
                                className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-full border border-white/40 text-white font-semibold text-xs sm:text-sm hover:bg-white/15 transition-all duration-300 pointer-events-auto"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {item['cta-text']}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Navigation Pill */}
                <div className="pb-4 sm:pb-8 md:pb-14">
                  <div className="flex justify-center px-2">
                    <div className="inline-flex items-center rounded-full p-1 sm:p-1.5 bg-black/20 backdrop-blur-sm flex-wrap justify-center gap-1">
                      {items.map((item, index) => {
                        const color = getColorConfig(item);
                        const isActive = expandedIndex === index;
                        return (
                          <button
                            key={index}
                            onClick={() => setExpandedIndex(index)}
                            className={`flex items-center gap-1.5 sm:gap-2 p-2 sm:px-5 sm:py-2.5 rounded-full transition-all duration-300 text-xs sm:text-sm md:text-base ${
                              isActive
                                ? 'bg-black/30 text-white font-bold shadow-lg'
                                : 'bg-transparent text-white/60 hover:text-white/90 hover:bg-black/10 font-medium'
                            }`}
                          >
                            <Icon
                              icon={color.iconName}
                              size={20}
                              color="currentColor"
                              className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5"
                              style={{
                                filter: 'brightness(0) invert(1)',
                                opacity: isActive ? 1 : 0.6,
                              }}
                            />
                            <span className="hidden sm:inline tracking-wide">{item.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}

export default LiveWorldWiseGrid;