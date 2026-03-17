import React, { useState, useRef, useEffect } from 'react';
import AnimatedBannerText from '../common/AnimatedBannerText';

/**
 * Banner Block Component
 * Displays hero/banner section with title, subtitle, and CTA
 */
const BannerBlock = ({ content, sectionRefs, isVisible }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Map API fields to component variables
  const title = content.title;
  const link = content.link;
  const backgroundImage = content.header_image || content.backgroundImage;
  const ctaText = content.link_copy || content.ctaText;
  const ctaLink = content.link || content.ctaLink;
  const pageLayoutType = content.page_layout_type || content.pageLayoutType;
  const videoUrl = content.media || content.videoUrl;
  const hidePageTitle = content.hide_page_title === 1;

  // Check if background image is valid (not empty and not a placeholder)
  const hasValidImage = backgroundImage &&
    backgroundImage.trim() !== '' &&
    !backgroundImage.includes('no-image.gif') &&
    !backgroundImage.includes('placeholders/no-image');

  // Check if video URL is valid (not empty and not a placeholder)
  const hasValidVideo = videoUrl &&
    videoUrl.trim() !== '' &&
    !videoUrl.includes('no-image.gif') &&
    !videoUrl.includes('placeholders/no-image');

  // Autoplay video if there's no valid image but there's a valid video
  const shouldAutoplayVideo = !hasValidImage && hasValidVideo;

  const [isVideoPlaying, setIsVideoPlaying] = useState(shouldAutoplayVideo);
  const videoRef = useRef(null);

  // Detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Autoplay video if there's no image
  useEffect(() => {
    if (shouldAutoplayVideo && videoRef.current) {
      videoRef.current.play().catch(err => {
        console.log('Autoplay prevented:', err);
      });
    }
  }, [shouldAutoplayVideo]);

  const handlePlayVideo = () => {
    setIsVideoPlaying(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleScrollDown = (e) => {
    // First try to use sectionRefs if available (for type 5)
    if (sectionRefs && sectionRefs.current && sectionRefs.current['hero']) {
      const heroSection = sectionRefs.current['hero'];
      const nextSection = heroSection.nextElementSibling;
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }

    // Fallback: find the current section and scroll to its next sibling
    const currentSection = e.currentTarget.closest('section');
    if (currentSection) {
      const nextSection = currentSection.nextElementSibling;
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Page Layout Type 5 - HomeBanner Design
  if (pageLayoutType === 5 || pageLayoutType === "5") {
    // If no valid image and no valid video, show title only
    if (!hasValidImage && !hasValidVideo) {
      return (
        <section
          id="hero"
          className="hero"
          style={{
            width: '100%',
            display: 'flex',
            maxWidth: '1120px',
            justifyContent: 'left',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <div className="text-left max-w-[1120px] m-0">
            {!hidePageTitle && (
              <h1 className="text-5xl md:text-6xl mt-[180px] text-[#9E1422] font-bold mb-4">{title}</h1>
            )}
          </div>
        </section>
      );
    }

    return (
      <section
        id="hero"

        className={`relative mt-[70px] lg:mt-[8%] overflow-hidden transition-all duration-1000 min-h-[300px] xs:min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[calc(100svh-8rem)]`}
        style={{
          position: 'relative',
          width: '100%'
        }}
      >
        {/* Background Image/Video */}
        {!isVideoPlaying && hasValidImage ? (
          <div
            className="absolute inset-0"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
              width: '100%',
              height: '100%'
            }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40"></div>
          </div>
        ) : isVideoPlaying && hasValidVideo ? (
          <div className="absolute inset-0 w-full h-full">
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              playsInline
              loop
            >
              <source src={videoUrl || "https://assets.dulwich.org/pages/live-worldwide-cut-no-audio.mp4"} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ) : null}

        <div className="dulwich-full-width m-auto relative z-10 flex justify-start h-full px-4 xs:px-6 sm:px-8 lg:px-12 min-h-[500px] xs:min-h-[500px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[calc(100svh-8rem)]">
          {/* Left Side Text Content */}
          <div className="max-w-[1120px] m-auto text-center md:text-left">
            {/* Main Heading with Animated Text */}
            {!hidePageTitle && (
              <AnimatedBannerText
                text={title}
                className="font-black uppercase leading-tight text-white tracking-[-0.03em] text-[48px] xs:text-[56px] sm:text-[64px] md:text-[80px] lg:text-[96px] xl:text-[108px] mb-6"
              />
            )}

            {/* CTA Button */}
            {ctaText && ctaLink && (
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
                onClick={() => window.location.href = ctaLink}
              >
                {ctaText}
              </button>
            )}
          </div>

          {/* Action Icons - Scroll Down and Play Video */}
          {!isVideoPlaying && (
            <div className="absolute bottom-4 md:bottom-5 left-4 xs:left-6 sm:left-8 flex items-center gap-2 xs:gap-3 sm:gap-4 z-0">
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
                  viewBox="0 0 22 22"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>

              {/* Play Video Button - only show if there's an image and video */}
              {hasValidImage && hasValidVideo && (
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
                "
                  aria-label="Play video"
                >
                  <svg
                    className="w-8 h-8 xs:w-8 xs:h-8 sm:w-8 sm:h-8 text-white ml-0.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    );
  }

  // If no valid image and no valid video, show title only (for non-type-5 banners)
  if (!hasValidImage && !hasValidVideo) {
    return (
      <section
        className="hero"
        style={{
          width: '100%',
          display: 'flex',
          maxWidth: '1120px',
          justifyContent: 'left',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <div className="text-left max-w-[1120px] m-0">
          {!hidePageTitle && (
            <h1 className="text-5xl md:text-6xl mt-[180px] text-[#9E1422] font-bold mb-4">{title}</h1>
          )}
        </div>
      </section>
    );
  }

  // Normalize page layout type for consistent comparison
  const normalizedLayoutType = pageLayoutType !== undefined && pageLayoutType !== null
    ? parseInt(pageLayoutType, 10)
    : null;

  return (
    <section
      className={`hero mt-0 ${normalizedLayoutType === 4 ? 'lg:mt-[72px]' : (isScrolled ? 'lg:mt-[72px]' : 'lg:mt-[130px]')} transition-all duration-300 ease-in-out`}
      style={{
        position: 'relative',
        width: '100%',
        height: 'auto',
        aspectRatio: '16/8',
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'block',
      }}
    >
      {/* Background Image/Video */}
      {!isVideoPlaying && hasValidImage ? (
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            background: `#000000 url(${backgroundImage}) no-repeat center center`,
            backgroundSize: 'cover',
            width: '100%',
            height: '100%'
          }}
        >
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/10"></div>
        </div>
      ) : isVideoPlaying && hasValidVideo ? (
        <div className="absolute inset-0 w-full h-full">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            playsInline
            loop
          >
            <source src={videoUrl || "https://assets.dulwich.org/pages/live-worldwide-cut-no-audio.mp4"} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      ) : null}

      {/* <div className="relative z-10 text-center text-white px-4 w-full max-w-[1120px] mx-auto flex flex-col justify-center min-h-[500px] xs:min-h-[500px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[756px]"> */}
      <div className='
  relative z-10 text-center text-white px-4 max-w-[1120px] mx-auto
  flex flex-col justify-center w-full h-full min-h-[500px] md:min-h-[unset]
'>
        {!hidePageTitle && (
          <h1 className="text-[42px] sm:text-4xl md:text-6xl md:text-left font-bold mb-4 [text-shadow:0px_4px_8px_rgba(0,0,0,0.25)] leading-10">{title}</h1>
        )}
        {/* {subtitle && (
          <p className="text-xl md:text-2xl mb-8">{subtitle}</p>
        )} */}
        {ctaText && ctaLink && (
         <button
         className="group flex items-center text-center md:text-left gap-2 px-4 py-3.5 text-sm font-medium text-white rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg active:scale-95 mx-auto md:mx-0"
         style={{ backgroundColor: '#D30013', width: 'fit-content' }}
         onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#B8000F'; }}
         onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#D30013'; }}
         onClick={() => window.location.href = ctaLink}
            >
          {ctaText}
          </button>
        )}


         {/* Action Icons - Scroll Down and Play Video */}
      {!isVideoPlaying && (
        <div className="absolute bottom-0 left-0 right-0 z-20" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <div className="w-full max-w-[1120px] px-4 xs:px-6 sm:px-8">
            <div className="flex items-center gap-2 xs:gap-3 sm:gap-4 pb-4 xs:pb-6 sm:pb-8">
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

              {/* Play Video Button - only show if there's an image and video */}
              {hasValidImage && hasValidVideo && (
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
                "
                  aria-label="Play video"
                >
                  <svg
                    className="w-8 h-8 xs:w-8 xs:h-8 sm:w-8 sm:h-8 text-white ml-0.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      </div>

     
    </section>
  );
};

export default BannerBlock;
