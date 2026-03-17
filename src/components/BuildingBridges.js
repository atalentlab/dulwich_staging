import React from 'react';

function BuildingBridges({ sectionRefs, isVisible }) {
  return (
    <section
      id="building-bridges"
      ref={(el) => (sectionRefs.current['building-bridges'] = el)}
      className={`py-12 xs:py-16 sm:py-20 md:py-24 lg:py-32 px-4 xs:px-6 sm:px-8 xl:px-10 bg-gray-100 transition-all duration-1000 ${
        isVisible['building-bridges']
          ? 'opacity-100'
          : 'opacity-0'
      }`}
    >
      <div className="max-w-5xl mx-auto text-center">
        {/* Animated Heading */}
        <div
          className={`relative mb-6 xs:mb-8 sm:mb-10 transition-all duration-1000 ${
            isVisible['building-bridges']
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-3xl xs:text-4xl sm:text-4xl md:text-5xl xl:text-6xl font-light text-gray-900 leading-tight">
            {['Building bridges to the world'].map((word, index) => (
              <span
                key={index}
                className="inline-block animate-fadeIn"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: 'both'
                }}
              >
                {word}
              </span>
            ))}
          </h2>
        </div>

        {/* Vision Statement */}
        <div
          className={`transition-all duration-1000 delay-500 ${
            isVisible['building-bridges']
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}
        >
          <p className="text-base xs:text-lg sm:text-lg md:text-xl xl:text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto px-4 xs:px-6">
            We envision a world where our students are intrinsically motivated and passionate young people who make a positive impact in the world.
          </p>
        </div>
      </div>
    </section>
  );
}

export default BuildingBridges;
