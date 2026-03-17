import { useState, useEffect, useRef } from 'react';

// Parse score string like "+1600", "100%", "+28%", "86+", "5.0" into { prefix, number, suffix, isRating }
const parseScore = (score) => {
  if (!score) return { prefix: '', number: 0, suffix: '', raw: '0', isRating: false };
  const str = String(score).trim();
  const match = str.match(/^([+\-]?)(\d+(?:[.,]\d+)?)(.*)$/);
  if (!match) return { prefix: '', number: 0, suffix: '', raw: str, isRating: false };
  const num = parseFloat(match[2].replace(',', ''));
  const hasDecimal = match[2].includes('.');
  // Treat as star rating if it's a decimal value <= 5 with no prefix/suffix (e.g. "5.0", "4.5")
  const isRating = hasDecimal && num <= 5 && !match[1] && !match[3];
  return {
    prefix: match[1],
    number: num,
    suffix: match[3],
    raw: str,
    decimals: hasDecimal ? (match[2].split('.')[1]?.length || 0) : 0,
    isRating,
  };
};

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2000, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = countRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (node) observer.observe(node);
    return () => { if (node) observer.unobserve(node); };
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let startTime;
    let frame;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * end));
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };
    frame = requestAnimationFrame(animate);
    return () => { if (frame) cancelAnimationFrame(frame); };
  }, [isVisible, end, duration]);

  return (
    <span ref={countRef}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

// Star Rating Component
const StarRating = ({ rating = 5 }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const totalStars = 5;

  return (
    <div className="flex gap-1 sm:gap-2">
      {[...Array(totalStars)].map((_, index) => (
        <svg
          key={index}
          className={`w-5 h-5 sm:w-7 sm:h-7 transform hover:scale-110 transition-transform duration-200 ${
            index < fullStars
              ? 'fill-[#8B1538]'
              : index === fullStars && hasHalf
              ? 'fill-[#8B1538] opacity-50'
              : 'fill-gray-300'
          }`}
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ value, label, prefix, suffix, isRating, decimals, aosAnimation, aosDelay }) => (
  <div
    className="bg-[#FAF7F5] h-full border border-[#F2EDE9] rounded-lg py-6 px-3 sm:py-8 sm:px-4 flex flex-col items-center justify-center text-center hover:bg-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
    {...(aosAnimation && {
      'data-aos': aosAnimation,
      'data-aos-duration': '700',
      'data-aos-delay': aosDelay || '0',
      'data-aos-easing': 'ease-out-back'
    })}
  >
    {isRating && (
      <div className="mb-3">
        <StarRating rating={value} />
      </div>
    )}
    <div className="text-2xl sm:text-[22px] md:text-[26px] lg:text-[30px] xl:text-[34px] font-bold text-[#8B1538] mb-2 sm:mb-3">
      {isRating ? (
        <span>{value.toFixed(decimals || 1)}</span>
      ) : (
        <AnimatedCounter end={value} prefix={prefix} suffix={suffix} duration={2500} />
      )}
    </div>
    <div className="text-[10px] sm:text-xs font-semibold text-gray-700 uppercase tracking-wider leading-tight">
      {label}
    </div>
  </div>
);

// Main StatisticBlock Component
const StatisticBlock = ({ content }) => {
  const items = content?.['nested-blocks'] || [];
  const pageLayoutType = content?.page_layout_type || content?.pageLayoutType;
  const isType5 = pageLayoutType === 5 || pageLayoutType === "5";

  const sortedItems = [...items].sort(
    (a, b) => (parseInt(a.weight) || 0) - (parseInt(b.weight) || 0)
  );

  if (sortedItems.length === 0) return null;

  return (
    <section className="py-6 sm:py-5 md:py-6 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-[1120px] mx-auto">
        {/* Mobile: first rating card full-width, rest in 2-col grid */}
        <div className="block min-[800px]:hidden">
          {sortedItems.some(item => parseScore(item.score).isRating) && (
            <div className="mb-3 sm:mb-4">
              {sortedItems.filter(item => parseScore(item.score).isRating).map((item, index) => {
                const parsed = parseScore(item.score);
                const globalIndex = sortedItems.indexOf(item);
                const aosAnimation = isType5 ? (globalIndex < 3 ? 'zoom-in-right' : 'zoom-in-left') : null;
                return (
                  <StatsCard
                    key={`rating-${index}`}
                    value={parsed.number}
                    label={item.content}
                    prefix={parsed.prefix}
                    suffix={parsed.suffix}
                    isRating={parsed.isRating}
                    decimals={parsed.decimals}
                    aosAnimation={aosAnimation}
                    aosDelay={globalIndex * 100}
                  />
                );
              })}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {sortedItems.filter(item => !parseScore(item.score).isRating).map((item, index) => {
              const parsed = parseScore(item.score);
              const globalIndex = sortedItems.indexOf(item);
              const aosAnimation = isType5 ? (globalIndex < 3 ? 'zoom-in-right' : 'zoom-in-left') : null;
              return (
                <StatsCard
                  key={index}
                  value={parsed.number}
                  label={item.content}
                  prefix={parsed.prefix}
                  suffix={parsed.suffix}
                  isRating={false}
                  decimals={parsed.decimals}
                  aosAnimation={aosAnimation}
                  aosDelay={globalIndex * 100}
                />
              );
            })}
          </div>
        </div>

        {/* Desktop: flex row */}
        <div className="hidden min-[800px]:flex gap-4 lg:gap-5">
          {sortedItems.map((item, index) => {
            const parsed = parseScore(item.score);
            const aosAnimation = isType5 ? (index < 3 ? 'zoom-in-right' : 'zoom-in-left') : null;
            return (
              <div key={index} className={parsed.isRating ? 'flex-shrink-0 w-auto' : 'min-w-[120px]'}>
                <StatsCard
                  value={parsed.number}
                  label={item.content}
                  prefix={parsed.prefix}
                  suffix={parsed.suffix}
                  isRating={parsed.isRating}
                  decimals={parsed.decimals}
                  aosAnimation={aosAnimation}
                  aosDelay={index * 100}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatisticBlock;
