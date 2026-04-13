import { useState, useEffect, useRef } from 'react';
import { Maximize2, ArrowRight } from 'lucide-react';
import dulPrimeIconWhite from '../../assets/images/ico-star.svg';

const KEYS = ['live', 'world', 'wise'];
const EXPAND_BG = '#9E1422';
const EASE = 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

function stripHtml(html) {
  if (!html) return '';
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

function LiveWorldView({ content }) {
  const sectionRef  = useRef(null);
  const sliderRef   = useRef(null);
  const trackRef    = useRef(null);
  const drag        = useRef({ active: false });
  const skipEffect  = useRef(false);

  const [visible,     setVisible]     = useState(false);
  const [hoveredKey,  setHoveredKey]  = useState(null);
  const [expandedKey, setExpandedKey] = useState(null);
  const [isDragging,  setIsDragging]  = useState(false);

  const items = KEYS.filter((key) => content?.[key]).map((key) => ({
    key,
    ...content[key],
  }));
  const itemsRef = useRef(items);
  useEffect(() => { itemsRef.current = items; }, [items]);

  // ── Entrance animation ────────────────────────────────────────────────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // ── Sync track when tab is clicked ───────────────────────────────────────
  useEffect(() => {
    if (!trackRef.current || !sliderRef.current || !expandedKey) return;
    if (skipEffect.current) { skipEffect.current = false; return; }
    const W   = sliderRef.current.offsetWidth;
    const idx = Math.max(0, itemsRef.current.findIndex((i) => i.key === expandedKey));
    trackRef.current.style.transition = EASE;
    trackRef.current.style.transform  = `translateX(${-idx * W}px)`;
  }, [expandedKey]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const snapTo = (idx) => {
    const W = sliderRef.current?.offsetWidth || 0;
    if (!trackRef.current) return;
    trackRef.current.style.transition = EASE;
    trackRef.current.style.transform  = `translateX(${-idx * W}px)`;
  };

  // ── Drag core (direct DOM — zero React re-renders during drag) ────────────
  const beginDrag = (clientX) => {
    if (!expandedKey || !sliderRef.current || !trackRef.current) return;
    const W   = sliderRef.current.offsetWidth;
    const idx = Math.max(0, itemsRef.current.findIndex((i) => i.key === expandedKey));
    trackRef.current.style.transition = 'none';
    drag.current = {
      active:     true,
      startX:     clientX,
      startIndex: idx,
      baseOffset: -idx * W,
      W,
      offsetPx:   0,
      velX:       0,
      lastX:      clientX,
      lastT:      Date.now(),
    };
    setIsDragging(true);
  };

  const moveDrag = (clientX) => {
    if (!drag.current.active || !trackRef.current) return;
    const now = Date.now();
    const dt  = now - drag.current.lastT || 1;
    drag.current.velX     = (clientX - drag.current.lastX) / dt;
    drag.current.lastX    = clientX;
    drag.current.lastT    = now;
    drag.current.offsetPx = clientX - drag.current.startX;
    trackRef.current.style.transform =
      `translateX(${drag.current.baseOffset + drag.current.offsetPx}px)`;
  };

  const endDrag = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    setIsDragging(false);

    const { W, startIndex, offsetPx, velX } = drag.current;
    const threshold = W * 0.2;
    const momentum  = velX * 150;
    const total     = offsetPx + momentum;

    let newIndex = startIndex;
    if (total < -threshold) newIndex = Math.min(startIndex + 1, itemsRef.current.length - 1);
    else if (total > threshold) newIndex = Math.max(startIndex - 1, 0);

    snapTo(newIndex);
    skipEffect.current = true;
    setExpandedKey(itemsRef.current[newIndex].key);
  };

  // ── Global mouse listeners while dragging ────────────────────────────────
  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e) => moveDrag(e.clientX);
    const onUp   = () => endDrag();
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup',   onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup',   onUp);
    };
  }, [isDragging]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Expand card ───────────────────────────────────────────────────────────
  const onExpand = (key) => {
    if (trackRef.current && sliderRef.current) {
      const W   = sliderRef.current.offsetWidth;
      const idx = Math.max(0, items.findIndex((i) => i.key === key));
      trackRef.current.style.transition = 'none';
      trackRef.current.style.transform  = `translateX(${-idx * W}px)`;
    }
    skipEffect.current = true;
    setExpandedKey(key);
  };
  const onClose = () => setExpandedKey(null);

  // ── Keyboard navigation (arrow keys) ──────────────────────────────────────
  useEffect(() => {
    if (!expandedKey) return;
    const onKeyPress = (e) => {
      const currentIdx = itemsRef.current.findIndex((i) => i.key === expandedKey);
      if (e.key === 'ArrowLeft' && currentIdx < itemsRef.current.length - 1) {
        setExpandedKey(itemsRef.current[currentIdx + 1].key);
      } else if (e.key === 'ArrowRight' && currentIdx > 0) {
        setExpandedKey(itemsRef.current[currentIdx - 1].key);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', onKeyPress);
    return () => document.removeEventListener('keydown', onKeyPress);
  }, [expandedKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Mouse wheel scroll navigation ─────────────────────────────────────────
  const wheelThrottleRef = useRef(0);
  useEffect(() => {
    if (!expandedKey || !sliderRef.current || !trackRef.current) return;
    const onWheel = (e) => {
      e.preventDefault();
      const now = Date.now();
      if (now - wheelThrottleRef.current < 600) return;

      const currentIdx = itemsRef.current.findIndex((i) => i.key === expandedKey);
      let newIndex = currentIdx;

      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (delta > 0) {
        newIndex = Math.min(currentIdx + 1, itemsRef.current.length - 1);
      } else if (delta < 0) {
        newIndex = Math.max(currentIdx - 1, 0);
      }

      if (newIndex !== currentIdx) {
        wheelThrottleRef.current = now;
        snapTo(newIndex);
        skipEffect.current = true;
        setExpandedKey(itemsRef.current[newIndex].key);
      }
    };

    sliderRef.current.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      sliderRef.current?.removeEventListener('wheel', onWheel);
    };
  }, [expandedKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const getCtaHref = (item) => {
    if (!item) return null;
    if (item['cta-type'] === 'link' && item['cta-link']) return item['cta-link'];
    if (item['cta-type'] === 'page' && item['contextual-link-data']?.url) return item['contextual-link-data'].url;
    return null;
  };

  if (items.length === 0) return null;

  return (
    <section
      id="live-world-wise"
      ref={sectionRef}
      className={`bg-white py-3 transition-all duration-1000 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="w-full max-w-[1330px] mx-auto px-4 sm:px-6 lg:px-9">

        <div className="relative overflow-hidden h-[520px] sm:h-[580px] md:h-[600px] lg:h-[784px]">

          {/* Cards Grid */}
          <div
            className="absolute inset-0 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-5"
            style={{
              transform: expandedKey ? 'translateX(100%)' : 'translateX(0)',
              transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {items.map((item) => {
              const isHovered = hoveredKey === item.key;
              return (
                <div
                  key={item.key}
                  className={`relative flex flex-col items-center justify-center cursor-pointer transition-all duration-500 ease-in-out py-4 rounded-lg border shadow-[0px_0px_12px_rgba(0,0,0,0.08)] h-full ${
                    isHovered ? 'border-[#9E1422]' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: isHovered ? EXPAND_BG : '#ffffff' }}
                  onMouseEnter={() => setHoveredKey(item.key)}
                  onMouseLeave={() => setHoveredKey(null)}
                  onClick={() => onExpand(item.key)}
                >
                  <div className="flex flex-col items-center px-2">
                    <div className="mb-3 sm:mb-4 md:mb-6">
                      <img
                        src={dulPrimeIconWhite}
                        alt=""
                        className="w-8 h-7 sm:w-10 sm:h-9 md:w-14 md:h-12 transition-all duration-300"
                        style={{
                          filter: isHovered
                            ? 'brightness(0) invert(1)'
                            : 'brightness(0) saturate(100%) invert(12%) sepia(62%) saturate(4810%) hue-rotate(330deg) brightness(72%) contrast(101%)',
                        }}
                      />
                    </div>
                    <h2
                      className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 md:mb-8 tracking-wide origin-center text-center"
                      style={{
                        color: isHovered ? '#ffffff' : '#9E1422',
                        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                        willChange: 'transform, color',
                        transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), color 0.3s ease',
                      }}
                    >
                      {item.title}
                    </h2>
                    <button
                      onClick={(e) => { e.stopPropagation(); onExpand(item.key); }}
                      className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                      style={{
                        borderColor: isHovered ? 'rgba(255,255,255,0.6)' : '#9E1422',
                        color: isHovered ? '#ffffff' : '#9E1422',
                      }}
                      aria-label={`Expand ${item.title}`}
                    >
                      <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
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
              backgroundColor: EXPAND_BG,
              transform: expandedKey ? 'translateX(0)' : 'translateX(-100%)',
              transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 z-10 inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-white/80 hover:text-white hover:bg-white/15 transition-all duration-300 border border-white/20 bg-black/10"
            >
              <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-semibold">Close</span>
            </button>

            {/* Swipeable area */}
            <div
              ref={sliderRef}
              className="flex-1 overflow-hidden select-none"
              style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
              onMouseDown={(e) => beginDrag(e.clientX)}
              onTouchStart={(e) => beginDrag(e.touches[0].clientX)}
              onTouchMove={(e) => { e.preventDefault(); moveDrag(e.touches[0].clientX); }}
              onTouchEnd={endDrag}
            >
              {/* Track — controlled entirely by trackRef DOM, not React state */}
              <div
                ref={trackRef}
                className="flex h-full"
                style={{ willChange: 'transform' }}
              >
                {items.map((item) => (
                  <div
                    key={item.key}
                    className="flex-shrink-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-10 pointer-events-none"
                    style={{ width: sliderRef.current?.offsetWidth || '100vw' }}
                  >
                    <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4 md:space-y-5">
                      <div className="mb-1 sm:mb-2">
                        <img
                          src={dulPrimeIconWhite}
                          alt=""
                          className="w-10 h-9 sm:w-14 sm:h-12 md:w-20 md:h-[72px] mx-auto"
                          style={{ filter: 'brightness(0) invert(1)' }}
                        />
                      </div>
                      <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white">
                        {item.title}
                      </h2>
                      <p className="text-white/80 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                        {stripHtml(item.content)}
                      </p>
                      {getCtaHref(item) && item['cta-text'] && (
                        <div className="pt-1 sm:pt-2">
                          <a
                            href={getCtaHref(item)}
                            className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-full border border-white/40 text-white font-semibold text-xs sm:text-sm hover:bg-white/15 transition-all duration-300 pointer-events-auto"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {item['cta-text']}
                            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
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
                <div className="inline-flex items-center rounded-full p-1 sm:p-1.5 bg-black/10 flex-wrap justify-center gap-1">
                  {items.map((item) => {
                    const isActive = expandedKey === item.key;
                    return (
                      <button
                        key={item.key}
                        onClick={() => setExpandedKey(item.key)}
                        className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-full transition-all duration-300 text-xs sm:text-sm md:text-base ${
                          isActive
                            ? 'text-white font-bold'
                            : 'text-white/50 hover:text-white/80 font-medium'
                        }`}
                      >
                        <img
                          src={dulPrimeIconWhite}
                          alt=""
                          className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5"
                          style={{
                            filter: 'brightness(0) invert(1)',
                            opacity: isActive ? 1 : 0.5,
                          }}
                        />
                        <span className="tracking-wide">{item.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default LiveWorldView;
