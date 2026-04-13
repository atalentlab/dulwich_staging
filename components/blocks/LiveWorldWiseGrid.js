import React, { useState, useEffect, useRef } from 'react';
import { Maximize2, MoveDiagonal } from 'lucide-react';
import Icon from '../Icon';

// Icon and color mapping based on level/title
const LEVEL_CONFIG = {
  'Ducks': {
    tag: '#FFB909',
    overlay: 'bg-[#FFB909]/60',
    gradient: 'bg-gradient-to-t from-[#D4831A]/90 via-[#FFB909]/70 to-[#FFB909]/50',
    activeText: 'text-[#FFB909]',
    iconName: 'dock1',
  },
  'Junior': {
    tag: '#009ED0',
    overlay: 'bg-[#009ED0]/60',
    gradient: 'bg-gradient-to-t from-[#009ed0]/90 via-[#009ed0]/70 to-[#009ed0]/50',
    activeText: 'text-[#009ED0]',
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
  const drag = useRef({ active: false, direction: null, startY: 0 });
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
    console.log('🔄 Sync effect triggered - expandedIndex:', expandedIndex, 'skipEffect:', skipEffect.current);

    if (!trackRef.current || !sliderRef.current || expandedIndex === null) {
      console.log('🔄 Sync effect skipped - missing refs or null index');
      return;
    }

    if (skipEffect.current) {
      console.log('🔄 Sync effect skipped by skipEffect flag');
      skipEffect.current = false;
      return;
    }

    const W = sliderRef.current.offsetWidth;
    const idx = Math.max(0, expandedIndex);
    const transform = `translateX(${-idx * W}px)`;
    console.log('🔄 Sync effect applying - idx:', idx, 'W:', W, 'transform:', transform);
    trackRef.current.style.transition = EASE;
    trackRef.current.style.transform = transform;
  }, [expandedIndex]);

  // Snap to index
  const snapTo = (idx) => {
    const W = sliderRef.current?.offsetWidth || 0;
    if (!trackRef.current) return;
    const transform = `translateX(${-idx * W}px)`;
    console.log('📍 snapTo - index:', idx, 'W:', W, 'transform:', transform);
    trackRef.current.style.transition = EASE;
    trackRef.current.style.transform = transform;
  };

  // Drag functionality
  const beginDrag = (clientX, clientY) => {
    console.log('🎯 beginDrag called - expandedIndex:', expandedIndex, 'clientX:', clientX);

    if (expandedIndex === null) {
      console.log('❌ beginDrag blocked - expandedIndex is null');
      return;
    }
    if (!sliderRef.current) {
      console.log('❌ beginDrag blocked - sliderRef is null');
      return;
    }
    if (!trackRef.current) {
      console.log('❌ beginDrag blocked - trackRef is null');
      return;
    }

    const W = sliderRef.current.offsetWidth;
    const idx = Math.max(0, expandedIndex);
    const currentTransform = trackRef.current.style.transform;

    console.log('🎯 beginDrag - idx:', idx, 'W:', W, 'currentTransform:', currentTransform);

    trackRef.current.style.transition = 'none';
    drag.current = {
      active: true,
      startX: clientX,
      startY: clientY || 0,
      startIndex: idx,
      baseOffset: -idx * W,
      W,
      offsetPx: 0,
      velX: 0,
      lastX: clientX,
      lastT: Date.now(),
    };
    console.log('🎯 beginDrag - drag state:', {
      startIndex: idx,
      baseOffset: -idx * W,
      W: W,
      startX: clientX
    });
    setIsDragging(true);
  };

  const moveDrag = (clientX, clientY) => {
    if (!drag.current.active || !trackRef.current) {
      console.log('❌ moveDrag blocked - active:', drag.current.active, 'trackRef:', !!trackRef.current);
      return false;
    }

    const now = Date.now();
    const dt = now - drag.current.lastT || 1;

    drag.current.velX = (clientX - drag.current.lastX) / dt;
    drag.current.lastX = clientX;
    drag.current.lastT = now;
    drag.current.offsetPx = clientX - drag.current.startX;

    const newTransform = `translateX(${drag.current.baseOffset + drag.current.offsetPx}px)`;
    trackRef.current.style.transform = newTransform;
    console.log('🎯 Move drag - offsetPx:', drag.current.offsetPx, 'transform:', newTransform);

    return true;
  };

  const endDrag = () => {
    if (!drag.current.active) return;
    const { W, startIndex, offsetPx, velX } = drag.current;

    console.log('endDrag - startIndex:', startIndex, 'offsetPx:', offsetPx, 'velX:', velX);

    drag.current.active = false;
    setIsDragging(false);

    const threshold = W * 0.2;
    const momentum = velX * 150;
    const total = offsetPx + momentum;

    let newIndex = startIndex;
    if (total < -threshold) newIndex = Math.min(startIndex + 1, itemsRef.current.length - 1);
    else if (total > threshold) newIndex = Math.max(startIndex - 1, 0);

    console.log('endDrag - snapping to index:', newIndex, 'total:', total, 'threshold:', threshold);
    snapTo(newIndex);
    skipEffect.current = true;
    setExpandedIndex(newIndex);
  };

  // Global mouse and touch listeners while dragging
  useEffect(() => {
    if (!isDragging) return;

    console.log('🔄 Setting up global drag listeners');

    const onMouseMove = (e) => {
      e.preventDefault();
      moveDrag(e.clientX, e.clientY);
    };

    const onMouseUp = (e) => {
      e.preventDefault();
      endDrag();
    };

    const onTouchMove = (e) => {
      if (e.touches[0]) {
        console.log('📱 Global touch move:', e.touches[0].clientX);
        moveDrag(e.touches[0].clientX, e.touches[0].clientY);
        e.preventDefault();
      }
    };

    const onTouchEnd = (e) => {
      console.log('📱 Global touch end');
      e.preventDefault();
      endDrag();
    };

    // Mouse events
    document.addEventListener('mousemove', onMouseMove, { passive: false });
    document.addEventListener('mouseup', onMouseUp, { passive: false });

    // Touch events - use passive: false to allow preventDefault
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd, { passive: false });
    document.addEventListener('touchcancel', onTouchEnd, { passive: false });

    return () => {
      console.log('🔄 Cleaning up global drag listeners');
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
      document.removeEventListener('touchcancel', onTouchEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]);

  const handleExpandView = (index) => {
    console.log('🎬 handleExpandView called with index:', index);
    skipEffect.current = true;
    setExpandedIndex(index);

    // Immediately set position (may not have correct width yet, but prevents flash)
    requestAnimationFrame(() => {
      if (trackRef.current && sliderRef.current) {
        const W = sliderRef.current.offsetWidth;
        const idx = Math.max(0, index);
        console.log('🎬 Immediate position - index:', idx, 'W:', W);
        trackRef.current.style.transition = 'none';
        trackRef.current.style.transform = `translateX(${-idx * W}px)`;
      }
    });

    // Wait for the expanded view transition to complete (0.6s), then reposition with final width
    setTimeout(() => {
      if (trackRef.current && sliderRef.current) {
        const W = sliderRef.current.offsetWidth;
        const idx = Math.max(0, index);
        const transform = `translateX(${-idx * W}px)`;
        console.log('🎬 Final position (after transition) - index:', idx, 'W:', W, 'transform:', transform);
        trackRef.current.style.transition = 'none';
        trackRef.current.style.transform = transform;

        // Force a reflow to ensure the transform is applied
        void trackRef.current.offsetHeight;
      }
    }, 650); // Wait for 0.6s transition + 50ms buffer
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
                  className="relative group overflow-hidden rounded-lg shadow border border-[#F2EDE9] bg-white transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer h-full touch-manipulation"
                  onClick={() => handleExpandView(index)}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    handleExpandView(index);
                  }}
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

                  <button
                    className="relative flex-shrink-0 rounded-full w-12 h-12 border border-[#D30013] text-[#D30013] transition-all duration-500 ease-in-out group-hover:w-[4.2rem] group-hover:bg-[#D30013] group-hover:text-white group-hover:border-transparent touch-manipulation"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExpandView(index);
                    }}
                    onTouchEnd={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleExpandView(index);
                    }}
                  >
                    <MoveDiagonal className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5" />
                  </button>
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
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCloseExpandView();
                  }}
                  onTouchEnd={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleCloseExpandView();
                  }}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 z-10 inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-white/80 hover:text-white hover:bg-white/15 transition-all duration-300 border border-white/20 bg-black/10 touch-manipulation"
                >
                  <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm font-semibold">Close</span>
                </button>

                {/* Swipeable Slider Area */}
                <div
                  ref={sliderRef}
                  className="flex-1 overflow-hidden select-none"
                  style={{
                    cursor: isDragging ? 'grabbing' : 'grab',
                    WebkitUserSelect: 'none',
                    userSelect: 'none',
                    WebkitTouchCallout: 'none'
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    beginDrag(e.clientX, e.clientY);
                  }}
                  onTouchStart={(e) => {
                    const touch = e.touches[0];
                    if (touch) {
                      console.log('✅ Touch start on slider at x:', touch.clientX);
                      beginDrag(touch.clientX, touch.clientY);
                    }
                  }}
                  onTouchMove={(e) => {
                    if (drag.current.active && e.touches[0]) {
                      console.log('✅ Touch move to x:', e.touches[0].clientX);
                      moveDrag(e.touches[0].clientX, e.touches[0].clientY);
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }}
                  onTouchEnd={(e) => {
                    if (drag.current.active) {
                      console.log('✅ Touch end');
                      e.preventDefault();
                      e.stopPropagation();
                      endDrag();
                    }
                  }}
                  onTouchCancel={(e) => {
                    if (drag.current.active) {
                      console.log('⚠️ Touch cancelled');
                      endDrag();
                    }
                  }}
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
                        className="flex-shrink-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-10 w-full"
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
                          <div
                            className="text-white prose prose-lg max-w-2xl mx-auto
                              prose-headings:text-white prose-headings:font-bold
                              prose-h1:text-3xl prose-h1:mb-4
                              prose-h2:text-2xl prose-h2:mb-3
                              prose-h3:text-xl prose-h3:mb-2
                              prose-p:!text-white prose-p:text-sm sm:prose-p:text-base md:prose-p:text-lg prose-p:leading-relaxed prose-p:mb-2
                              prose-strong:text-white prose-strong:font-bold
                              prose-em:text-white/90 prose-em:italic
                              prose-a:text-white prose-a:underline hover:prose-a:text-white/80
                              prose-ul:list-disc prose-ul:text-white/80 prose-ul:ml-6 prose-ul:pl-6 prose-ul:space-y-2
                              prose-ol:list-decimal prose-ol:text-white/80 prose-ol:ml-6 prose-ol:pl-6 prose-ol:space-y-2
                              prose-li:text-white/80 prose-li:leading-relaxed prose-li:marker:text-white
                              prose-blockquote:border-l-4 prose-blockquote:border-white/40 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-white/70
                              [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:text-white/80
                              [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:pl-6 [&_ol]:space-y-2 [&_ol]:text-white/80
                              [&_li]:text-white/80 [&_li]:leading-relaxed [&_li]:mb-2
                              [&_li::marker]:text-white [&_li::marker]:font-bold
                              [&_p]:!text-white"
                            dangerouslySetInnerHTML={{ __html: item.content }}
                          />
                          {item['cta-text'] && getCtaUrl(item) && (
                            <div className="pt-1 sm:pt-2">
                              <a
                                href={getCtaUrl(item)}
                                className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-full border border-white/40 text-white font-semibold text-xs sm:text-sm hover:bg-white/15 transition-all duration-300 pointer-events-auto touch-manipulation"
                                onClick={(e) => e.stopPropagation()}
                                onTouchEnd={(e) => e.stopPropagation()}
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
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedIndex(index);
                            }}
                            onTouchEnd={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              setExpandedIndex(index);
                            }}
                            className={`flex items-center gap-1.5 sm:gap-2 p-2 sm:px-5 sm:py-2.5 rounded-full transition-all duration-300 text-xs sm:text-sm md:text-base touch-manipulation ${
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