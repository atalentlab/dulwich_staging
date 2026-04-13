import React from 'react';

function StatisticsSection({ sectionRefs, isVisible, counters }) {
  return (
    <section
      ref={(el) => (sectionRefs.current['statistics'] = el)}
      className={`py-12 xs:py-16 sm:py-20 md:py-24 px-4 xs:px-6 sm:px-8 xl:px-10 bg-white transition-all duration-1000 ${
        isVisible['statistics']
          ? 'opacity-100'
          : 'opacity-0'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div
          id="stats"
          ref={(el) => (sectionRefs.current['stats'] = el)}
          className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 xs:gap-8 sm:gap-10 md:gap-12 transition-all duration-1000 ${
            isVisible['stats']
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="text-center transform transition-all duration-500 hover:scale-110">
            <div className="text-3xl xs:text-4xl sm:text-5xl md:text-5xl xl:text-6xl font-light text-gray-900 mb-2">
              {counters['37.5']}
            </div>
            <div className="text-sm text-gray-600">Average points out of 45</div>
          </div>
          <div className="text-center transform transition-all duration-500 hover:scale-110" style={{ transitionDelay: '0.1s' }}>
            <div className="text-3xl xs:text-4xl sm:text-5xl md:text-5xl xl:text-6xl font-light text-gray-900 mb-2">
              {counters['7']}
            </div>
            <div className="text-sm text-gray-600">School Locations</div>
          </div>
          <div className="text-center transform transition-all duration-500 hover:scale-110" style={{ transitionDelay: '0.2s' }}>
            <div className="text-3xl xs:text-4xl sm:text-5xl md:text-5xl xl:text-6xl font-light text-gray-900 mb-2">
              {counters['100']}%
            </div>
            <div className="text-sm text-gray-600">Student Satisfaction</div>
          </div>
          <div className="text-center transform transition-all duration-500 hover:scale-110" style={{ transitionDelay: '0.3s' }}>
            <div className="text-3xl xs:text-4xl sm:text-5xl md:text-5xl xl:text-6xl font-light text-gray-900 mb-2">
              {counters['2025']}
            </div>
            <div className="text-sm text-gray-600">IB Results</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StatisticsSection;
