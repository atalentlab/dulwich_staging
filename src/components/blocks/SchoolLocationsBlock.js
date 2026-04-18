import React, { useEffect, useRef, useState, useMemo } from "react";
import createGlobe from "cobe";
import {
  MapPin,
  Users,
  GraduationCap,
  ChevronDown,
  Globe as GlobeIcon
} from "lucide-react";
import Icon from '../Icon';

import schoolsData from "../../data/schoolsData.json";

// --- Constants & Data ---

const SCHOOLS_DATA = schoolsData.carousel?.items || [];

const INDIA_PHI = 0.52; // Rotation for India center
const INDIA_THETA = 0.36; // Angle for India center

const locationToAngles = (lat, lon) => [
  Math.PI - ((lon * Math.PI) / 180 - Math.PI / 2),
  (lat * Math.PI) / 180,
];

// Custom Dropdown Component (from PageFooter)
const CustomDropdown = ({ value, options, onChange, isOpen, setIsOpen, placeholder }) => {
  const [isClosing, setIsClosing] = useState(false);
  const dropdownRef = React.useRef(null);

  const handleClose = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 180);
  };

  const handleSelect = (option) => {
    setIsClosing(true);
    setTimeout(() => {
      onChange(option);
      setIsOpen(false);
      setIsClosing(false);
    }, 180);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative" style={{ isolation: 'isolate' }}>
      <button
        onClick={() => !isClosing && setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 bg-[#FFFFFF] border border-[#EBE4DD] rounded-lg text-left flex items-center justify-between hover:border-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-[#D30013] focus:border-transparent"
        style={{ willChange: 'auto' }}
      >
        <span className="text-[#3C3C3B]">{value}</span>
        <Icon icon="Icon-Chevron-small" size={20} color="#3C3737" className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {(isOpen || isClosing) && (
        <>
          {/* Backdrop overlay with fade animations */}
          <div
            className={`fixed inset-0 bg-black z-[100] transition-opacity duration-150 ${
              isClosing ? 'opacity-0' : 'opacity-30'
            }`}
            onClick={handleClose}
            style={{ willChange: 'opacity' }}
          ></div>

          {/* Dropdown Menu with slide animations and smooth scroll */}
          <div
            className={`absolute z-[101] w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-2xl max-h-60 overflow-y-auto overflow-x-hidden transition-all duration-150 ease-out ${
              isClosing ? 'opacity-0 scale-95 translate-y-[-4px]' : 'opacity-100 scale-100 translate-y-0'
            }`}
            onClick={(e) => e.stopPropagation()}
            style={{
              scrollBehavior: 'smooth',
              scrollbarWidth: 'thin',
              scrollbarColor: '#D30013 #f3f4f6',
              pointerEvents: 'auto',
              willChange: 'transform, opacity',
              transformOrigin: 'top'
            }}
            onWheel={(e) => e.stopPropagation()}
          >
            {options.map((option, index) => (
              <div
                key={index}
                onClick={() => handleSelect(option)}
                className={`px-4 py-3 cursor-pointer transition-all duration-150 text-left ${
                  value === option
                    ? 'text-[#fff] font-semibold bg-gradient-to-r from-[#D30013] to-[#FF4D5A]/10 rounded-lg'
                    : 'text-[#3C3C3B] hover:text-[#fff] hover:bg-gradient-to-r from-[#D30013] to-[#FF4D5A]/60 rounded-lg'
                } ${index === 0 ? 'rounded-t-lg' : ''} ${index === options.length - 1 ? 'rounded-lg' : ''}`}
              >
                <div className="flex items-center justify-between">
                  {option}
                  {value === option && (
                    <span className="mr-2 text-[#fff] font-bold rotate-3">✓</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

function SchoolLocationsBlock({ content, block }) {
  const [activeSchoolId, setActiveSchoolId] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const activeSchool = useMemo(() =>
    SCHOOLS_DATA[activeSchoolId] || SCHOOLS_DATA[0] || null,
    [activeSchoolId]
  );

  const canvasRef = useRef(null);
  const globeRef = useRef(null);
  const pointerRef = useRef(null);

  const phiRef = useRef(0);
  const thetaRef = useRef(0);
  const targetPhiRef = useRef(0);
  const targetThetaRef = useRef(0);
  const autoRotateRef = useRef(false);
  const lastInteractionRef = useRef(Date.now());

  // Debug: Check if component is rendering
  console.log('SchoolLocationsBlock rendering', {
    schoolsCount: SCHOOLS_DATA.length,
    activeSchool,
    content,
    block
  });

  // Initialize globe rotation based on default school
  useEffect(() => {
    if (SCHOOLS_DATA[0] && SCHOOLS_DATA[0].location_coords) {
      const [p, t] = locationToAngles(
        SCHOOLS_DATA[0].location_coords[0],
        SCHOOLS_DATA[0].location_coords[1]
      );
      phiRef.current = p;
      thetaRef.current = t;
      targetPhiRef.current = p;
      targetThetaRef.current = t;
    } else {
      phiRef.current = INDIA_PHI;
      thetaRef.current = INDIA_THETA;
      targetPhiRef.current = INDIA_PHI;
      targetThetaRef.current = INDIA_THETA;
    }
  }, []);

  // Smooth rotation on active school change
  useEffect(() => {
    if (activeSchool && activeSchool.location_coords) {
      const [p, t] = locationToAngles(
        activeSchool.location_coords[0],
        activeSchool.location_coords[1]
      );
      targetPhiRef.current = p;
      targetThetaRef.current = t;
    }
  }, [activeSchoolId, activeSchool]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const getMarkers = () => SCHOOLS_DATA
      .filter(s => s.location_coords)
      .map((s, idx) => ({
        location: s.location_coords,
        size: idx === activeSchoolId ? 0.05 : 0.025,
      }));

    globeRef.current = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 1000,
      height: 1000,
      phi: phiRef.current,
      theta: thetaRef.current,
      dark: 0.3,
      diffuse: 1.8,
      mapSamples: 20000,
      mapBrightness: 2.5,
      baseColor: [0.95, 0.95, 0.95],
      markerColor: [0.83, 0.0, 0.08],
      glowColor: [0.85, 0.85, 0.95],
      markers: getMarkers(),
      opacity: 1,
      scale: 1.05,
      offset: [0, 0],
    });

    const animate = () => {
      if (globeRef.current) {
        // Auto-rotate when idle (after 3 seconds of no interaction)
        const timeSinceInteraction = Date.now() - lastInteractionRef.current;
        if (timeSinceInteraction > 3000 && autoRotateRef.current) {
          targetPhiRef.current += 0.003;
        }

        // Smooth interpolation with adaptive easing for stability
        const distance = Math.abs(targetPhiRef.current - phiRef.current) +
                        Math.abs(targetThetaRef.current - thetaRef.current);
        const easingFactor = distance > 0.5 ? 0.08 : 0.05;

        phiRef.current += (targetPhiRef.current - phiRef.current) * easingFactor;
        thetaRef.current += (targetThetaRef.current - thetaRef.current) * easingFactor;

        globeRef.current.update({
          phi: phiRef.current,
          theta: thetaRef.current,
          markers: getMarkers(),
        });
      }
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      globeRef.current?.destroy();
      globeRef.current = null;
    };
  }, [activeSchoolId]);

  const onPointerDown = (e) => {
    pointerRef.current = [e.clientX, e.clientY];
    autoRotateRef.current = false;
    lastInteractionRef.current = Date.now();
  };

  const onMouseMove = (e) => {
    if (!pointerRef.current) return;
    const [prevX, prevY] = pointerRef.current;
    const deltaX = e.clientX - prevX;
    const deltaY = e.clientY - prevY;

    // Smooth, stable rotation with damping
    targetPhiRef.current += deltaX * 0.004;
    targetThetaRef.current = Math.max(
      -Math.PI / 2.2,
      Math.min(Math.PI / 2.2, targetThetaRef.current + deltaY * 0.004)
    );

    pointerRef.current = [e.clientX, e.clientY];
    lastInteractionRef.current = Date.now();
  };

  const onPointerUp = () => {
    pointerRef.current = null;
    lastInteractionRef.current = Date.now();
    // Re-enable auto-rotate after 3 seconds of inactivity
    setTimeout(() => {
      if (Date.now() - lastInteractionRef.current >= 1000) {
        autoRotateRef.current = false;
      }
    }, 1000);
  };

  // If no schools data, show error message
  if (!SCHOOLS_DATA || SCHOOLS_DATA.length === 0) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-[#2a2a2a] to-[#000000] flex items-center justify-center p-4">
        <div className="text-white text-center">
          <p className="text-xl font-bold mb-2">No Schools Data Available</p>
          <p className="text-gray-400">Please check your schools data configuration.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#2a2a2a] to-[#000000] flex items-center justify-center p-4 md:p-10 font-sans overflow-hidden">
      <div className="max-w-7xl w-full flex flex-col lg:flex-row items-center justify-between relative gap-10 py-10">

        {/* Top left buttons */}
        <div className="absolute top-0 left-0 flex space-x-3 z-50">
          <button className="bg-[#D30013] text-white text-sm px-5 py-2.5 rounded-lg font-semibold shadow-md hover:bg-[#B00010] hover:shadow-lg transition-all duration-200">
            School Locations
          </button>
          <button className="bg-[#3C3C3C] text-gray-200 text-sm px-5 py-2.5 rounded-lg font-semibold hover:bg-[#2A2A2A] transition-all duration-200 shadow-md">
            University Destinations
          </button>
        </div>

        {/* Globe (Left) */}
        <div className="flex-1 w-full flex justify-center items-center relative min-h-[400px] lg:min-h-[600px] z-10">
          <div className="relative w-[400px] h-[400px] lg:w-[600px] lg:h-[600px] flex items-center justify-center">
            <canvas
              ref={canvasRef}
              className="w-full h-full cursor-grab active:cursor-grabbing transition-transform duration-150 ease-out"
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
              onMouseMove={onMouseMove}
              style={{
                filter: 'drop-shadow(0 30px 80px rgba(0, 0, 0, 0.4))',
                transform: pointerRef.current ? 'scale(1.02)' : 'scale(1)',
              }}
            />
          </div>

          {/* Recenter Button */}
          <button
            className="absolute bottom-8 left-1/2 -translate-x-1/2 lg:left-8 lg:translate-x-0 lg:bottom-8 border border-gray-300 rounded-lg px-6 py-2.5 text-sm bg-white hover:bg-gray-50 text-gray-700 font-medium transition z-20 shadow-md hover:shadow-lg"
            onClick={() => {
              if (activeSchool && activeSchool.location_coords) {
                const [p, t] = locationToAngles(
                  activeSchool.location_coords[0],
                  activeSchool.location_coords[1]
                );
                targetPhiRef.current = p;
                targetThetaRef.current = t;
              }
            }}
          >
            Re-Center
          </button>
        </div>

        {/* Premium Card (Right) */}
        <div className="w-full max-w-[420px] z-20">
          <div className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.16)] transition-shadow duration-300 flex flex-col border border-gray-100">

            {/* School Hero Image */}
            <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-100">
              {activeSchool ? (
                <img
                  src={activeSchool.image_url}
                  alt={activeSchool.name || activeSchool.full_title || 'School'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <GlobeIcon className="w-12 h-12" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Content Section */}
            <div className="p-6 md:p-8 flex flex-col gap-6">

              {/* School Selector Dropdown */}
              <div className="relative">
                {/* <label className="block text-xs text-left font-semibold mb-2 text-gray-600 tracking-wide">
                  Our Schools
                </label> */}
                <CustomDropdown
                  value={activeSchool?.name || activeSchool?.full_title || "Select a School"}
                  options={SCHOOLS_DATA.map(school => school.name || school.full_title)}
                  onChange={(selectedName) => {
                    const index = SCHOOLS_DATA.findIndex(
                      school => (school.name || school.full_title) === selectedName
                    );
                    if (index !== -1) {
                      setActiveSchoolId(index);
                    }
                  }}
                  isOpen={isDropdownOpen}
                  setIsOpen={setIsDropdownOpen}
                  placeholder="Select a School"
                />
              </div>

              {/* Info Grid */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium">{activeSchool?.district || activeSchool?.location || 'N/A'}</span>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <Users className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium">{activeSchool?.students || 0} Students</span>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <GraduationCap className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium">Ages {activeSchool?.ages || 'N/A'}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {activeSchool?.tags?.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-gray-100 text-gray-500 text-xs font-bold rounded-lg uppercase tracking-wider"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Description */}
              <p className="text-gray-500 text-left text-sm leading-relaxed">
                {activeSchool?.content || ''}
              </p>

              {/* CTA */}
              {activeSchool?.url && (
                <a
                  href={activeSchool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full py-4 bg-[#D30013] hover:bg-[#B8000F] text-white font-bold rounded-2xl transition-all shadow-lg"
                >
                  Visit Website
                </a>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Dropdown Styles */}
      <style>{`
        /* Custom scrollbar for dropdown */
        .overflow-y-auto::-webkit-scrollbar {
          width: 8px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 4px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #D30013;
          border-radius: 4px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #B8000F;
        }

        /* Ensure dropdown is scrollable and receives mouse events */
        .overflow-y-auto {
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
        }

        /* Prevent layout shift during dropdown animations */
        .relative {
          contain: layout;
        }
      `}</style>
    </section>
  );
}

export default SchoolLocationsBlock;
