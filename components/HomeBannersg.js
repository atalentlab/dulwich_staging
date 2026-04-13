import React, { useState, useRef } from 'react';
import DCSG_HOME from '../assets/images/sg/P9.JPG';

function HomeBanner({ sectionRefs, isVisible }) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef(null);

  const handlePlayVideo = () => {
    setIsVideoPlaying(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleScrollDown = () => {
    const heroSection = sectionRefs.current['hero'];
    if (heroSection) {
      const nextSection = heroSection.nextElementSibling;
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <section
      id="hero"
      ref={(el) => (sectionRefs.current['hero'] = el)}
      className={`relative mt-[8%] overflow-hidden transition-all duration-1000 min-h-[300px] xs:min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[calc(100svh-8rem)] ${
        isVisible['hero']
          ? 'opacity-100'
          : 'opacity-0'
      }`}
    >
      {/* Background Image/Video */}
      {!isVideoPlaying ? (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${DCSG_HOME})`,
            backgroundPosition: 'center center'
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40"></div>
        </div>
      ) : (
        <div className="absolute inset-0 w-full h-full">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            controls
            autoPlay
            playsInline
            onEnded={() => setIsVideoPlaying(false)}
          >
            <source src="https://assets.dulwich.org/pages/live-worldwide-cut-no-audio.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      <div className="dulwich-full-width  m-auto relative z-10 flex justify-start h-full px-4 xs:px-6 sm:px-8 lg:px-12 min-h-[300px] xs:min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[calc(100svh-8rem)]">
        {/* Left Side Text Content */}
        <div className="max-w-[1120px] m-auto text-left">
          {/* Main Heading */}
          <h1 className="font-black text-white text-[40px] text-left xs:text-[48px] sm:text-[56px] md:text-[64px] lg:text-[72px] leading-tight mb-6 drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
          Welcome to Dulwich College Singapore
          </h1>

          {/* CTA Button */}
          <button
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm xs:text-base md:text-lg font-semibold transition-all duration-300 cursor-pointer text-white hover:shadow-lg transform hover:scale-105 active:scale-95 h-12 xs:h-14 md:h-16 rounded-md px-6 xs:px-8 md:px-10"
            style={{
              backgroundColor: '#D30013'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#B8000F';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#D30013';
            }}
          >
          Explore Our Open Day
          </button>
        </div>

        {/* Action Icons - Scroll Down and Play Video */}
        {!isVideoPlaying && (
          <div className="absolute bottom-4 xs:bottom-6 sm:bottom-8 left-4 xs:left-6 sm:left-8 flex items-center gap-2 xs:gap-3 sm:gap-4 z-20">
            {/* Scroll Down Button */}
            <button
              onClick={handleScrollDown}
              className="
              w-12 h-12 sm:w-14 sm:h-14
              rounded-full
              border border-white/40
              bg-white/20
              backdrop-blur-md
              flex items-center justify-center
              hover:bg-white/30
              transition-all duration-300
              hover:scale-110
            "
              aria-label="Scroll to next section"
            >
              <svg
                className="w-5 h-5 xs:w-5.5 xs:h-5.5 sm:w-6 sm:h-6 text-white transform group-hover:translate-y-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>

            {/* Play Video Button */}
            <button
              onClick={handlePlayVideo}
              className="
              w-12 h-12 sm:w-14 sm:h-14
              rounded-full
              border border-white/40
              bg-white/20
              backdrop-blur-md
              flex items-center justify-center
              hover:bg-white/30
              transition-all duration-300
              hover:scale-110
            "              aria-label="Play video"
            >
              <svg
                className="w-8 h-8 xs:w-8 xs:h-8 sm:w-8 sm:h-8 text-white ml-0.5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default HomeBanner;
