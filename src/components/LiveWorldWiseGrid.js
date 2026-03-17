import React from 'react';
import { Maximize2 } from 'lucide-react';
import Icon from './Icon';
import DucksGirlsImage from '../assets/images/sg/DCSG_DUCKS_2 Girls.jpg';
import FoundingFamiliesImage from '../assets/images/sg/240605DCSGFoundingFamilies(Full)-65.jpg';
import StudentLaptopImage from '../assets/images/sg/EiMAdshootforThailandatDCSG-Sun-138.jpg';
import JuniorSchoolImage from '../assets/images/DCSZ/CORE/JS.jpg';

function LiveWorldWiseGrid({
  expandedView,
  handleExpandView,
  handleCloseExpandView
}) {
  return (
  <div
      className="flex items-center justify-center"
    >
      <div className="max-w-[1400px] mx-auto px-4 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* DUCKS Card */}
          <div className="relative group overflow-hidden rounded-2xl shadow-lg bg-white transition-all duration-300 hover:shadow-2xl">
            {/* Image */}
            <div className="relative h-[612px] overflow-hidden rounded-t-2xl">
              <img
                src={DucksGirlsImage}
                alt="DUCKS"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Age Tag */}
              <div className="absolute bottom-20 z-10 left-6 bg-[#FFB909] text-white px-4 py-4 rounded-md font-semibold text-[18px]">
                Ages 2 – 7
              </div>
            </div>

            {/* Content Footer */}
            <div className="absolute bottom-0 left-0 right-0 bg-white p-6 flex items-center justify-between">
              <h3 className="text-3xl font-bold text-gray-900">DUCKS</h3>
              <button
                onClick={() => handleExpandView('live')}
                className="w-12 h-12 rounded-full border border-[#D30013] text-[#D30013] hover:bg-[#D30013] hover:text-white transition-all duration-300 flex items-center justify-center"
                aria-label="Learn more about DUCKS"
              >
              
              </button>
            </div>
          </div>

          {/* Junior School Card */}
          <div className="relative group overflow-hidden rounded-2xl shadow-lg bg-white transition-all duration-300 hover:shadow-2xl">
            {/* Image */}
            <div className="relative h-[612px] overflow-hidden">
              <img
                src={JuniorSchoolImage}
                alt="Junior School"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Age Tag */}
              <div className="absolute bottom-20 z-10 left-6 bg-[#009ED0] text-white px-4 py-4 rounded-md font-semibold text-[18px]">
                Ages 7 – 11
              </div>
            </div>

            {/* Content Footer */}
            <div className="absolute bottom-0 left-0 right-0 bg-white p-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Junior School</h3>
              <button
                onClick={() => handleExpandView('world')}
                className="w-12 h-12 rounded-full border border-[#D30013] text-[#D30013] hover:bg-[#D30013] hover:text-white transition-all duration-300 flex items-center justify-center"
                aria-label="Learn more about Junior School"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Senior School Card */}
          <div className="relative group overflow-hidden rounded-2xl shadow-lg bg-white transition-all duration-300 hover:shadow-2xl">
            {/* Image */}
            <div className="relative h-[612px] overflow-hidden">
              <img
                src={FoundingFamiliesImage}
                alt="Senior School"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Age Tag */}
              <div className="absolute bottom-20 z-10 left-6 bg-[#D30013] text-white px-4 py-4 rounded-md font-semibold text-[18px]">
                Ages 11 – 18
              </div>
            </div>

            {/* Content Footer */}
            <div className="absolute bottom-0 left-0 right-0 bg-white p-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Senior School</h3>
              <button
                onClick={() => handleExpandView('wise')}
                className="w-12 h-12 rounded-full border border-[#D30013] text-[#D30013] hover:bg-[#D30013] hover:text-white transition-all duration-300 flex items-center justify-center"
                aria-label="Learn more about Senior School"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Full Screen Expanded Views */}
      {expandedView && (
        <div className="fixed inset-0 z-[100] flex flex-col transition-all duration-500 ease-in-out animate-in fade-in duration-500">
          {/* Background Image with Color Overlay */}
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-700 scale-105"
              style={{
                backgroundImage: expandedView === 'live'
                  ? `url(${DucksGirlsImage})`
                  : expandedView === 'world'
                    ? `url(${JuniorSchoolImage})`
                    : `url(${FoundingFamiliesImage})`,
                filter: 'brightness(0.7)'
              }}
            >
              {/* Dynamic Overlay based on expanded view */}
              {expandedView === 'live' && (
                <>
                  <div className="absolute inset-0 bg-[#FFB909]/60 mix-blend-multiply"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#D4831A]/90 via-[#FFB909]/70 to-[#FFB909]/50"></div>
                </>
              )}
              {expandedView === 'world' && (
                <>
                  <div className="absolute inset-0 bg-[#009ED0]/60 mix-blend-multiply"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2E5C8A]/90 via-[#009ED0]/70 to-[#009ED0]/50"></div>
                </>
              )}
              {expandedView === 'wise' && (
                <>
                  <div className="absolute inset-0 bg-[#D30013]/60 mix-blend-multiply"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#9E1422]/90 via-[#D30013]/70 to-[#D30013]/50"></div>
                </>
              )}
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={handleCloseExpandView}
            className="absolute top-8 right-8 z-50 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors backdrop-blur-md border border-white/30"
          >
            <span className="text-sm font-semibold">Close</span>
            <Maximize2 className="w-4 h-4 rotate-180" />
          </button>

          {/* Main Content */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
            {/* Dynamic Content */}
            {expandedView === 'live' && (
              <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-7xl md:text-9xl font-black text-white tracking-tight drop-shadow-2xl">
                  DUCKS
                </h1>
                <p className="text-white text-2xl md:text-3xl font-bold tracking-wide uppercase drop-shadow-lg">
                  Ages 2–7
                </p>
                <p className="text-white text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto font-normal drop-shadow-lg">
                  Nurturing young minds in a safe and inspiring environment where every day is an adventure in learning.
                </p>
                <button className="mt-8 px-8 py-4 bg-white text-[#FFB909] rounded-full font-bold text-lg hover:bg-white/90 transition-all duration-300 shadow-xl">
                  Learn More
                </button>
              </div>
            )}

            {expandedView === 'world' && (
              <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-7xl md:text-9xl font-black text-white tracking-tight drop-shadow-2xl">
                  Junior School
                </h1>
                <p className="text-white text-2xl md:text-3xl font-bold tracking-wide uppercase drop-shadow-lg">
                  Ages 7–11
                </p>
                <p className="text-white text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto font-normal drop-shadow-lg">
                  Primary years where curiosity meets confidence through projects, reading, and collaborative exploration.
                </p>
                <button className="mt-8 px-8 py-4 bg-white text-[#009ED0] rounded-full font-bold text-lg hover:bg-white/90 transition-all duration-300 shadow-xl">
                  Learn More
                </button>
              </div>
            )}

            {expandedView === 'wise' && (
              <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-7xl md:text-9xl font-black text-white tracking-tight drop-shadow-2xl">
                  Senior School
                </h1>
                <p className="text-white text-2xl md:text-3xl font-bold tracking-wide uppercase drop-shadow-lg">
                  Ages 11–18
                </p>
                <p className="text-white text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto font-normal drop-shadow-lg">
                  Preparing students for university and beyond with academic excellence and holistic development.
                </p>
                <button className="mt-8 px-8 py-4 bg-white text-[#D30013] rounded-full font-bold text-lg hover:bg-white/90 transition-all duration-300 shadow-xl">
                  Learn More
                </button>
              </div>
            )}
          </div>

          {/* Bottom Navigation */}
          <div className="relative z-20 pb-16">
            <div className="flex justify-center items-center gap-4">
              <div className="flex items-center bg-white/10 backdrop-blur-lg rounded-full p-2 border border-white/20 shadow-2xl">
                <button
                  onClick={() => handleExpandView('live')}
                  className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-300 ${expandedView === 'live'
                    ? 'bg-white text-[#FFB909] shadow-lg font-bold'
                    : 'text-white hover:text-white hover:bg-white/20 font-semibold'
                    }`}
                >
                  <Icon icon="plant" size={20} color="currentColor" />
                  <span className="tracking-wide">DUCKS</span>
                </button>

                <button
                  onClick={() => handleExpandView('world')}
                  className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-300 ${expandedView === 'world'
                    ? 'bg-white text-[#009ED0] shadow-lg font-bold'
                    : 'text-white hover:text-white hover:bg-white/20 font-semibold'
                    }`}
                >
                  <Icon icon="bag" size={20} color="currentColor" />
                  <span className="tracking-wide">Junior School</span>
                </button>

                <button
                  onClick={() => handleExpandView('wise')}
                  className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-300 ${expandedView === 'wise'
                    ? 'bg-white text-[#D30013] shadow-lg font-bold'
                    : 'text-white hover:text-white hover:bg-white/20 font-semibold'
                    }`}
                >
                  <Icon icon="graduation-cap" size={20} color="currentColor" />
                  <span className="tracking-wide">Senior School</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LiveWorldWiseGrid;
