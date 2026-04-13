import React from 'react';

function Testimonials({ sectionRefs, isVisible }) {
  return (
    <section
      id="testimonials"
      ref={(el) => (sectionRefs.current['testimonials'] = el)}
      className="py-12 xs:py-16 sm:py-20 md:py-24 px-4 xs:px-6 sm:px-8 xl:px-10 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto">
        <h2
          className={`text-3xl xs:text-4xl sm:text-4xl md:text-5xl xl:text-5xl font-light text-gray-900 mb-10 xs:mb-12 sm:mb-14 md:mb-16 text-center transition-all duration-1000 ${
            isVisible['testimonials']
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}
        >
          What People Say
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 xs:gap-6 sm:gap-8">
          <div
            className={`bg-white p-5 xs:p-6 sm:p-8 rounded-lg shadow-sm transform transition-all duration-700 hover:scale-105 hover:shadow-xl ${
              isVisible['testimonials']
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '0.1s' }}
          >
            <div className="text-xs xs:text-sm text-gray-500 mb-3 xs:mb-4">Parent</div>
            <p className="text-sm xs:text-base text-gray-700 mb-4 xs:mb-6 italic">"Dulwich helped our daughter find her voice. The community and teachers have been outstanding."</p>
            <div className="text-xs xs:text-sm font-medium text-gray-900">Alexandra Chen</div>
          </div>
          <div
            className={`bg-white p-5 xs:p-6 sm:p-8 rounded-lg shadow-sm transform transition-all duration-700 hover:scale-105 hover:shadow-xl ${
              isVisible['testimonials']
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '0.2s' }}
          >
            <div className="text-xs xs:text-sm text-gray-500 mb-3 xs:mb-4">Student</div>
            <p className="text-sm xs:text-base text-gray-700 mb-4 xs:mb-6 italic">"The IB support was world-class. I felt pushed to do my best, never overwhelmed."</p>
            <div className="text-xs xs:text-sm font-medium text-gray-900">Rafael Turner</div>
          </div>
          <div
            className={`bg-white p-5 xs:p-6 sm:p-8 rounded-lg shadow-sm transform transition-all duration-700 hover:scale-105 hover:shadow-xl ${
              isVisible['testimonials']
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '0.3s' }}
          >
            <div className="text-xs xs:text-sm text-gray-500 mb-3 xs:mb-4">Teacher</div>
            <p className="text-sm xs:text-base text-gray-700 mb-4 xs:mb-6 italic">"I see students grow in confidence and character every term. It's a privilege to guide them."</p>
            <div className="text-xs xs:text-sm font-medium text-gray-900">Ms. Harper</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
