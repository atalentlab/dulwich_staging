import React from 'react';
import { Maximize2 } from 'lucide-react';
import dulPrimeIcon from '../assets/images/dul-prime.png';

function LiveWorldView({
  sectionRefs,
  isVisible,
  handleExpandView
}) {
  return (
    <section
      id="live-world-wise"
      ref={(el) => (sectionRefs.current['live-world-wise'] = el)}
      className={`bg-white h-screen flex items-center justify-center transition-all duration-1000 ${isVisible['live-world-wise']
        ? 'opacity-100 translate-y-0'
        : 'opacity-0 translate-y-10'
        }`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-full">

          {/* Live Column */}
          <div className="flex flex-col items-center justify-center p-8 rounded-lg bg-white border border-gray-100 shadow-lg hover:shadow-md transition-shadow duration-300 min-h-[60vh]">
            <div className="mb-6">
              <img src={dulPrimeIcon} alt="" className="w-14 h-12 text-[#A41034]" />
            </div>
            <h2 className="text-4xl font-bold text-[#A41034] mb-8 tracking-wide">Live</h2>
            <button
              onClick={() => handleExpandView('live')}
              className="w-12 h-12 rounded-full border border-[#A41034] text-[#A41034] flex items-center justify-center hover:bg-[#A41034] hover:text-white transition-all duration-300 transform hover:scale-110"
              aria-label="Expand Live"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>

          {/* World Column */}
          <div className="flex flex-col items-center justify-center p-8  rounded-lg bg-white border border-gray-100 shadow-lg hover:shadow-md transition-shadow duration-300 min-h-[60vh]">
            <div className="mb-6">
              <img src={dulPrimeIcon} alt="" className="w-14 h-12 text-[#A41034]" />
            </div>
            <h2 className="text-4xl font-bold text-[#A41034] mb-8 tracking-wide">World</h2>
            <button
              onClick={() => handleExpandView('world')}
              className="w-12 h-12 rounded-full border border-[#A41034] text-[#A41034] flex items-center justify-center hover:bg-[#A41034] hover:text-white transition-all duration-300 transform hover:scale-110"
              aria-label="Expand World"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>

          {/* Wise Column */}
          <div className="flex flex-col items-center justify-center p-8 rounded-lg bg-white border border-gray-100 shadow-lg hover:shadow-md transition-shadow duration-300 min-h-[60vh]">
            <div className="mb-6">
              <img src={dulPrimeIcon} alt="" className="w-14 h-12 text-[#A41034]" />
            </div>
            <h2 className="text-4xl font-bold text-[#A41034] mb-8 tracking-wide">Wise</h2>
            <button
              onClick={() => handleExpandView('wise')}
              className="w-12 h-12 rounded-full border border-[#A41034] text-[#A41034] flex items-center justify-center hover:bg-[#A41034] hover:text-white transition-all duration-300 transform hover:scale-110"
              aria-label="Expand Wise"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}

export default LiveWorldView;
