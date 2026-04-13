import React, { useState, useEffect, useRef } from 'react';

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2000, suffix = '', prefix = '', decimals = 0 }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => {
      if (countRef.current) {
        observer.unobserve(countRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * end);

      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isVisible, end, duration]);

  const formatNumber = (num) => {
    if (decimals > 0) {
      return num.toFixed(decimals);
    }
    return num.toLocaleString();
  };

  return (
    <span ref={countRef}>
      {prefix}
      {formatNumber(count)}
      {suffix}
    </span>
  );
};

// Stats Card Component
const StatsCard = ({ icon, value, label, prefix = '', suffix = '', decimals = 0, isNumber = true }) => {
  return (
    <div className="bg-[#faf7f5] h-full max-w-[1440px] border border-gray-200 rounded-lg p-2 sm:p-4  flex flex-col items-center justify-center text-center hover:bg-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      {icon && (
        <div className="mb-3">
          {icon}
        </div>
      )}
      <div className="text-3xl
  sm:text-[18px]
  md:text-[22px]
  lg:text-[26px]
  xl:text-[30px] font-bold text-[#8B1538] mb-2 sm:mb-3">
        {isNumber ? (
          <AnimatedCounter end={value} prefix={prefix} suffix={suffix} decimals={decimals} duration={2500} />
        ) : (
          <span>{value}</span>
        )}
      </div>
      <div className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider leading-tight">
        {label}
      </div>
    </div>
  );
};

// Star Rating Component
const StarRating = () => {
  return (
    <div className="flex gap-2 sm:gap-2">
      {[...Array(5)].map((_, index) => (
        <svg
          key={index}
          className="w-6 h-6 sm:w-8 sm:h-8 fill-[#8B1538] transform hover:scale-110 transition-transform duration-200"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
};

function DataGrid() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-transparent">
      {/* Stats Grid - Centered Container */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile: First item full width */}
        <div className="block max-[800px]:block min-[800px]:hidden">
          <div className="mb-4">
            <StatsCard
              icon={<StarRating />}
              value="5.0"
              label="iSCHOOLADVISOR.COM"
              isNumber={false}
            />
          </div>
          {/* Other items in 2-column grid */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <StatsCard
              value={1600}
              label="STUDENTS"
              prefix="+"
            />
            <StatsCard
              value={43}
              label="NATIONALITIES"
            />
            <StatsCard
              value={18}
              label="AVG CLASS SIZE"
            />
            <StatsCard
              value={86}
              label="A*-A IGCSE"
              suffix="%"
            />
            <StatsCard
              value={24}
              label="VS GLOBAL IB AVG"
              prefix="+"
              suffix="%"
            />
            <StatsCard
              value={100}
              label="IB PASS RATE"
              suffix="%"
            />
          </div>
        </div>

        {/* Tablet/Desktop: Flex wrap layout */}
        <div className="max-w-[1440px] m-auto hidden min-[800px]:flex flex-wrap gap-4 lg:gap-6">
          <div className="flex-shrink-0 w-auto ">
            <StatsCard
              icon={<StarRating />}
              value="5.0"
              label="iSCHOOLADVISOR.COM"
              isNumber={false}
            />
          </div>
          <div className="flex-1 min-w-[140px]">
            <StatsCard
              value={1600}
              label="STUDENTS"
              prefix="+"
            />
          </div>
          <div className="flex-1 min-w-[140px]">
            <StatsCard
              value={43}
              label="NATIONALITIES"
            />
          </div>
          <div className="flex-1 min-w-[140px]">
            <StatsCard
              value={18}
              label="AVG CLASS SIZE"
            />
          </div>
          <div className="flex-1 min-w-[140px]">
            <StatsCard
              value={86}
              label="A*-A IGCSE"
              suffix="%"
            />
          </div>
          <div className="flex-1 min-w-[140px]">
            <StatsCard
              value={24}
              label="VS GLOBAL IB AVG"
              prefix="+"
              suffix="%"
            />
          </div>
          <div className="flex-1 min-w-[140px]">
            <StatsCard
              value={100}
              label="IB PASS RATE"
              suffix="%"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataGrid;
