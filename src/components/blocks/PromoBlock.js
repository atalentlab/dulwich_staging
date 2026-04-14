import React, { useState } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL;

/**
 * Promo Block Component
 * Displays promotional content with image and CTA
 * Supports multiple styles: xl (Extra Large), large (2 col), medium (3 col), small (4 col), micro (4 col)
 * Supports video popups for YouTube and Youku videos
 */
const getBlockCtaUrl = (block) => {
  if (block['cta-type'] === 'page') {
    return block['contextual-link-data']?.url || '#';
  }
  return block['cta-link'] || '#';
};

/**
 * Extract video ID from YouTube or Youku URL, or use video ID directly
 */
const getVideoEmbedUrl = (block) => {
  const youtubeUrl = block['video-youtube'];
  const youkuUrl = block['video-youku'];

  // Prefer YouTube if available
  if (youtubeUrl) {
    // Check if it's already just a video ID (11 characters, alphanumeric)
    if (/^[a-zA-Z0-9_-]{11}$/.test(youtubeUrl)) {
      return `https://www.youtube.com/embed/${youtubeUrl}?autoplay=1`;
    }

    // Otherwise, extract YouTube video ID from various URL formats
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = youtubeUrl.match(youtubeRegex);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
    }
  }

  // Fall back to Youku if available
  if (youkuUrl) {
    // The CMS provides the video ID (e.g., "id_XNjQwNTMzMzM5Mg==" or just "XNjQwNTMzMzM5Mg==")
    let videoId = youkuUrl;

    // If it's a full URL, extract the ID portion (without 'id_' prefix)
    if (youkuUrl.includes('http')) {
      const youkuRegex = /id_([^=/&\s]+)/;
      const match = youkuUrl.match(youkuRegex);
      if (match && match[1]) {
        videoId = match[1];
      }
    } else if (youkuUrl.startsWith('id_')) {
      // Remove 'id_' prefix to get just the hash
      videoId = youkuUrl.substring(3);
    }

    // Return Youku player embed URL with required parameters
    // Format: https://player.youku.com/embed/[vid]?client_id=[client_id]&target=[target]
    console.log('Youku Video ID:', videoId);
    return `https://player.youku.com/embed/${videoId}?client_id=&target=`;
  }

  return null;
};

/**
 * Video Modal Component with animations
 */
const VideoModal = ({ isOpen, onClose, videoUrl }) => {
  const [isClosing, setIsClosing] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Lock body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;

      // Lock body scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      return () => {
        // Restore body scroll
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';

        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // Reset states when opening
  React.useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setIsLoaded(false);
      // Show modal after a brief delay for smooth animation
      const timer = setTimeout(() => setIsLoaded(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle close with animation
  const handleClose = () => {
    setIsClosing(true);
    // Wait for animation to complete before actually closing
    setTimeout(() => {
      setIsClosing(false);
      setIsLoaded(false);
      onClose();
    }, 300);
  };

  if (!isOpen || !videoUrl) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-all duration-300 ${
        isClosing ? 'bg-opacity-0' : 'bg-opacity-75'
      }`}
      onClick={handleClose}
    >
      <div
        className={`relative w-full max-w-5xl mx-4 aspect-video bg-black rounded-lg overflow-hidden shadow-2xl transition-all duration-300 ${
          isClosing
            ? 'opacity-0 scale-75'
            : isLoaded
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-90'
        }`}
        style={{ transformOrigin: 'center' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-10 right-6 z-10 w-10 h-10 flex items-center justify-center bg-white/50 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
          aria-label="Close video"
        >
          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Loading spinner */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Video iframe */}
        <iframe
          src={videoUrl}
          className={`w-full h-full transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Video player"
          frameBorder="0"
          scrolling="no"
          onLoad={() => setIsLoaded(true)}
        />
      </div>
    </div>
  );
};

const PromoBlock = ({ content }) => {
  const {
    title,
    intro,
    style,
    'cta-type': ctaType,
    'cta-text': ctaText,
    'cta-link': ctaLink,
    'nested-blocks': nestedBlocks = [],
    'anchor-id': anchorId
  } = content;

  // Convert nested-blocks object to array if it's an object
  const blocksArray = nestedBlocks ? (Array.isArray(nestedBlocks) ? nestedBlocks : Object.values(nestedBlocks)) : [];

  // Video modal state
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState(null);

  // Handle video click
  const handleVideoClick = (block) => {
    const embedUrl = getVideoEmbedUrl(block);
    if (embedUrl) {
      setCurrentVideoUrl(embedUrl);
      setVideoModalOpen(true);
    }
  };

  // Close video modal
  const closeVideoModal = () => {
    setVideoModalOpen(false);
    setCurrentVideoUrl(null);
  };

  // Extra Small/Micro Style (xs) - Micro cards with image and title only
  if (style === 'xs') {
    return (
      <>
        <VideoModal isOpen={videoModalOpen} onClose={closeVideoModal} videoUrl={currentVideoUrl} />
        <section data-id={anchorId} className="py-10 px-4 bg-white">
          <div className="max-w-[1120px] mx-auto">
          {/* Section Header */}
          <div className="mb-8 text-left">
            {title && (
              <h2 className="text-3xl lg:text-5xl font-bold text-left text-[#3C3737] mb-4">
                {title}
              </h2>
            )}
            {intro && (
              <p className="text-base text-left text-[#3C3C3B] leading max-w-3xl mb-6">
                {intro}
              </p>
            )}

            {/* Optional CTA Button in header */}
            {ctaText && ctaType !== 'none' && (
              <a
                href={ctaLink || '#'}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium border-2 border-[#D30013] text-[#D30013] hover:bg-[#D30013] hover:text-white rounded-lg transition-all duration-300"
              >
                {ctaText}
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            )}
          </div>

          {/* Four Column Grid - Micro Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {blocksArray.map((block, index) => {
              const imageUrl = block.image?.startsWith('http')
                ? block.image
                : `${API_BASE_URL}${block.image}`;

              const isVideo = block['cta-type'] === 'video';

              return (
                <div
                  key={index}
                  className="group bg-white flex flex-col shadow-[0_10px_15px_-3px_rgb(0_0_0_/_5%),_0_4px_6px_-4px_rgb(0_0_0_/_0.1)] rounded-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                >
                  {/* Image - Fixed height for consistency */}
                  {block.image ? (
                    <div className="relative h-[144px] overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={block.image_description || block.title || 'Promo image'}
                        className="w-full h-full max-h-[144px] object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    // Placeholder space when no image
                    <div className="relative h-[192px] bg-gray-100"></div>
                  )}

                  {/* Content - Title and Arrow Button - flex-grow pushes button to bottom */}
                  <div className="p-4 flex flex-col flex-grow">
                    {/* Title */}
                    {block.title && (
                      <h3 className="text-sm lg:text-base font-bold text-left text-[#3C3737] mb-3 flex-grow">
                        {block.title}
                      </h3>
                    )}

                    {/* CTA Button - aligned to bottom */}
                    {isVideo ? (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleVideoClick(block);
                        }}
                        className="flex items-center justify-between mt-auto w-full cursor-pointer hover:opacity-80 transition-opacity"
                      >
                        <span className="text-[14px] font-bold text-[#3C3737]">{block['cta-text'] || 'Watch Video'}</span>
                        <div className="flex items-center justify-center w-10 h-10 rounded-[8px] border-2 border-[#D30013] transition-all duration-300 group-hover:bg-[#D30013]">
                          <svg
                            className="w-5 h-5 text-[#D30013] transition-colors duration-300 group-hover:text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </button>
                    ) : (
                      <a
                        href={getBlockCtaUrl(block)}
                        className="flex items-center justify-between mt-auto"
                      >
                        <span className="text-[14px] font-bold text-[#3C3737]">{block['cta-text'] || 'Learn More'}</span>
                        <div className="flex items-center justify-center w-10 h-10 rounded-[8px] border-2 border-[#D30013] transition-all duration-300 group-hover:bg-[#D30013]">
                          <svg
                            className="w-5 h-5 text-[#D30013] transition-colors duration-300 group-hover:text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      </>
    );
  }

  // Small 4-Column Style (s) - Four promotional cards in a row
  if (style === 's') {
    return (
      <>
        <VideoModal isOpen={videoModalOpen} onClose={closeVideoModal} videoUrl={currentVideoUrl} />
        <section data-id={anchorId} className="py-10 px-4 bg-white">
        <div className="max-w-[1120px] mx-auto">
          {/* Section Header */}
          <div className="mb-12 text-left">
            {title && (
              <h2 className="text-3xl lg:text-5xl font-bold text-left text-[#3C3737] mb-6">
                {title}
              </h2>
            )}
            {intro && (
              <p className="text-base text-left max-w-[640px] text-[#3C3C3B] leading-[1.4]">
                {intro}
              </p>
            )}
          </div>
               {/* Main CTA at bottom */}
               {ctaText && ctaType !== 'none' && (
            <div className="text-left mt-4 mb-4">
              <a
                href={ctaLink || '#'}
                className="inline-block border-2 border-[#D30013] text-[#D30013] hover:bg-[#D30013] hover:text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300"
              >
                {ctaText}
              </a>
            </div>
          )}

          {/* Four Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {blocksArray.map((block, index) => {
              const imageUrl = block.image?.startsWith('http')
                ? block.image
                : `${API_BASE_URL}${block.image}`;

              return (
                <div
                  key={index}
                  className="bg-white shadow-[0_10px_15px_-3px_rgb(0_0_0_/_5%),_0_4px_6px_-4px_rgb(0_0_0_/_0.1)] rounded-[5px] overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-2"
                >
                  {/* Image */}
                  {block.image && (
                    <div className="relative overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={block.image_description || block.title || 'Promo image'}
                        className="w-full max-h-[192px] h-auto object-cover transition-transform duration-300 hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-5 text-left">
                    {/* Title */}
                    {block.title && (
                      <h3 className="text-base lg:text-lg font-bold text-left text-[#3C3737] mb-2">
                        {block.title}
                      </h3>
                    )}

                    {/* Description */}
                    {block.description && (
                      <p className="text-[14px] text-left text-[#3C3C3B] leading mb-5 mt-3">
                        {block.description}
                      </p>
                    )}

                    {/* CTA Button */}
                    {block['cta-text'] && block['cta-type'] !== 'none' && (
                      block['cta-type'] === 'video' ? (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleVideoClick(block);
                          }}
                          className="inline-flex items-center gap-2 px-4 py-1.5 text-[12px] font-medium border-[1px] border-[#D30013] text-[#D30013] hover:bg-[#D30013] hover:text-white rounded-lg transition-all duration-300 cursor-pointer"
                        >
                          {block['cta-text']}
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </button>
                      ) : (
                        <a
                          href={getBlockCtaUrl(block)}
                          className="inline-flex items-center gap-2 px-4 py-1.5 text-[12px] font-medium border-[1px] border-[#D30013] text-[#D30013] hover:bg-[#D30013] hover:text-white rounded-lg transition-all duration-300"
                        >
                          {block['cta-text']}
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </a>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      </>
    );
  }

  // Medium 3-Column Style (m) - Three promotional cards in a row
  if (style === 'm') {
    return (
      <>
        <VideoModal isOpen={videoModalOpen} onClose={closeVideoModal} videoUrl={currentVideoUrl} />
        <section data-id={anchorId} className="py-10 px-4 bg-white">
        <div className="max-w-[1120px] mx-auto">
          {/* Main Title and Intro */}
          {title && (
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-left text-[#3C3737]">
              {title}
            </h2>
          )}
          {intro && (
            <p className="text-base text-left text-[#3C3C3B] mb-5 leading">
              {intro}
            </p>
          )}
               {/* Main CTA at bottom */}
               {ctaText && ctaType !== 'none' && (
            <div className="text-left mt-6 mb-6">
              <a
                href={ctaLink || '#'}
                className="inline-block border-2 border-[#D30013] text-[#D30013] hover:bg-[#D30013] hover:text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300"
              >
                {ctaText}
              </a>
            </div>
          )}

          {/* Three Column Grid of Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blocksArray.map((block, index) => {
              const imageUrl = block.image?.startsWith('http')
                ? block.image
                : `${API_BASE_URL}${block.image}`;

              return (
                <div
                  key={index}
                  className="bg-white flex flex-col shadow-[0_10px_15px_-3px_rgb(0_0_0_/_5%),_0_4px_6px_-4px_rgb(0_0_0_/_0.1)] rounded-[16px] overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-2"
                >
                  {/* Image */}
                  {block.image && (
                    <div className="relative h-[192px] overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={block.image_description || block.title || 'Promo image'}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6 text-left flex flex-col flex-grow">
                    {/* Title */}
                    {block.title && (
                      <h3 className="text-lg lg:text-xl font-bold text-left text-[#3C3737] mb-3">
                        {block.title}
                      </h3>
                    )}

                    {/* Description */}
                    {block.description && (
                      <p className="text-sm text-left text-[#3C3C3B] leading mb-5">
                        {block.description}
                      </p>
                    )}

                    {/* CTA Button */}
                    {block['cta-text'] && block['cta-type'] !== 'none' && (
                      <a
                        href={getBlockCtaUrl(block)}
                        className="mt-auto w-fit inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium border border-[#D30013] text-[#D30013] hover:bg-[#D30013] hover:text-white rounded-lg transition-all duration-300"
                      >
                        {block['cta-text']}
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>


        </div>
      </section>
      </>
    );
  }

  // Large 2-Column Style (l) - Two promotional cards side by side
  if (style === 'l') {
    return (
      <>
        <VideoModal isOpen={videoModalOpen} onClose={closeVideoModal} videoUrl={currentVideoUrl} />
        <section data-id={anchorId} className="py-10 px-4 bg-white">
        <div className="max-w-[1120px] mx-auto">
          {/* Main Title and Intro */}
          {title && (
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-left text-[#3C3737]">
              {title}
            </h2>
          )}
          {intro && (
            <p className="text-base text-left text-[#3C3C3B] mb-8 leading">
              {intro}
            </p>
          )}
            {/* Main CTA at bottom */}
            {ctaText && ctaType !== 'none' && (
            <div className="text-left mt-5 mb-5">
              <a
                href={ctaLink || '#'}
                className="inline-block border-2 border-[#D30013] text-[#D30013] hover:bg-[#D30013] hover:text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300"
              >
                {ctaText}
              </a>
            </div>
          )}

          {/* Two Column Grid of Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            {blocksArray.map((block, index) => {
              const imageUrl = block.image?.startsWith('http')
                ? block.image
                : `${API_BASE_URL}${block.image}`;
              const isLeftAlign = block.align === 'left';

              return (
                <div
                  key={index}
                  className="bg-white flex flex-col shadow-[0_10px_15px_-3px_rgb(0_0_0_/_5%),_0_4px_6px_-4px_rgb(0_0_0_/_0.1)] rounded-[5px] border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex flex-col flex-grow">
                    {isLeftAlign ? (
                      <>
                        {/* Image Top - Left Alignment (Vertical Card) */}
                        {block.image && (
                          <div className="relative h-64 overflow-hidden">
                            <img
                              src={imageUrl}
                              alt={block.image_description || block.title || 'Promo image'}
                              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                              loading="lazy"
                            />
                          </div>
                        )}

                        {/* Content Bottom */}
                        <div className="p-8 text-left flex flex-col flex-grow">
                          {block.title && (
                            <h3 className="text-xl font-bold text-left text-[#3C3737] mb-4">
                              {block.title}
                            </h3>
                          )}
                          {block.description && (
                            <p className="text-sm lg:text-base text-left text-[#3C3C3B] leading mb-6">
                              {block.description}
                            </p>
                          )}
                          {block['cta-text'] && block['cta-type'] !== 'none' && (
                            <a
                              href={getBlockCtaUrl(block)}
                              className="mt-auto w-fit inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium border-2 border-[#D30013] text-[#D30013] hover:bg-[#D30013] hover:text-white rounded-lg transition-all duration-300"
                            >
                              {block['cta-text']}
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </a>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Content Bottom - Right Alignment (Vertical Card) */}
                        {block.image && (
                          <div className="relative h-64 overflow-hidden">
                            <img
                              src={imageUrl}
                              alt={block.image_description || block.title || 'Promo image'}
                              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                              loading="lazy"
                            />
                          </div>
                        )}

                        {/* Content */}
                        <div className="p-8 text-left flex flex-col flex-grow">
                          {block.title && (
                            <h3 className="text-xl lg:text-2xl font-bold text-left text-[#3C3737] mb-4">
                              {block.title}
                            </h3>
                          )}
                          {block.description && (
                            <p className="text-sm lg:text-base text-left text-[#3C3C3B] leading mb-6">
                              {block.description}
                            </p>
                          )}
                          {block['cta-text'] && block['cta-type'] !== 'none' && (
                            <a
                              href={getBlockCtaUrl(block)}
                              className="mt-auto inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium border-2 border-[#D30013] text-[#D30013] hover:bg-[#D30013] hover:text-white rounded-lg transition-all duration-300"
                            >
                              {block['cta-text']}
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </a>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>


        </div>
      </section>
      </>
    );
  }

  // Extra Large Style (xl) - Full width two-column layout
  if (style === 'xl') {
    return (
      <>
        <VideoModal isOpen={videoModalOpen} onClose={closeVideoModal} videoUrl={currentVideoUrl} />
        <section data-id={anchorId} className="py-10 px-4 bg-white">
        <div className="max-w-[1120px] mx-auto">
          {/* Main Title and Intro */}
          {title && (
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-left text-[#3C3737]">
              {title}
            </h2>
          )}
          {intro && (
            <p className="text-base text-left text-[#3C3C3B] mb-8 leading">
              {intro}
            </p>
          )}

          {/* Main CTA at bottom */}
          {ctaText && ctaType !== 'none' && (
            <div className="text-left mt-1 mb-5">
              <a
                href={ctaLink || '#'}
                className="inline-block border-2 border-[#D30013] text-[#D30013] hover:bg-[#D30013] hover:text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300"
              >
                {ctaText}
              </a>
            </div>
          )}
          {/* Nested Blocks - Extra Large Layout */}
          <div className="space-y-12">
            {blocksArray.map((block, index) => {
              const imageUrl = block.image?.startsWith('http')
                ? block.image
                : `${API_BASE_URL}${block.image}`;
              const isLeftAlign = block.align === 'left';

              return (
                <div key={index} className="bg-white overflow-hidden">
                  <div className="grid lg:grid-cols-2 gap-0">
                    {isLeftAlign ? (
                      <>
                        {/* Image Section - Left */}
                        {block.image && (
                          <div className="relative h-64 lg:h-auto">
                            <img
                              src={imageUrl}
                              alt={block.image_description || block.title || 'Promo image'}
                              className="w-full max-w-[512px] max-h-[336px] h-full object-cover rounded-[5px]"
                              loading="lazy"
                            />
                          </div>
                        )}

                        {/* Content Section - Right */}
                        <div className="p-8 lg:p-12 flex flex-col justify-center text-left">
                          {block.title && (
                            <h3 className="text-2xl lg:text-3xl font-bold text-left text-[#3C3737] mb-4">
                              {block.title}
                            </h3>
                          )}
                          {block.description && (
                            <p className="text-base text-left text-[#3C3C3B] leading mb-6">
                              {block.description}
                            </p>
                          )}
                          {block['cta-text'] && block['cta-type'] !== 'none' && (
                            <div>
                              {block['cta-type'] === 'video' ? (
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleVideoClick(block);
                                  }}
                                  className="inline-block border-2 border-[#D30013] text-[#D30013] hover:bg-[#D30013] hover:text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 cursor-pointer"
                                >
                                  {block['cta-text']}
                                </button>
                              ) : (
                                <a
                                  href={getBlockCtaUrl(block)}
                                  className="inline-block border-2 border-[#D30013] text-[#D30013] hover:bg-[#D30013] hover:text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300"
                                >
                                  {block['cta-text']}
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Content Section - Left */}
                        <div className="p-8 lg:p-12 flex flex-col justify-center text-left">
                          {block.title && (
                            <h3 className="text-2xl lg:text-3xl font-bold text-left text-[#3C3737] mb-4">
                              {block.title}
                            </h3>
                          )}
                          {block.description && (
                            <p className="text-base text-left text-[#3C3C3B] leading mb-6">
                              {block.description}
                            </p>
                          )}
                          {block['cta-text'] && block['cta-type'] !== 'none' && (
                            <div>
                              {block['cta-type'] === 'video' ? (
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleVideoClick(block);
                                  }}
                                  className="inline-block border-2 border-[#D30013] text-[#D30013] hover:bg-[#D30013] hover:text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 cursor-pointer"
                                >
                                  {block['cta-text']}
                                </button>
                              ) : (
                                <a
                                  href={getBlockCtaUrl(block)}
                                  className="inline-block border-2 border-[#D30013] text-[#D30013] hover:bg-[#D30013] hover:text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300"
                                >
                                  {block['cta-text']}
                                </a>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Image Section - Right */}
                        {block.image && (
                          <div className="relative h-64 lg:h-auto">
                            <img
                              src={imageUrl}
                              alt={block.image_description || block.title || 'Promo image'}
                              className="w-full max-w-[512px] max-h-[336px] h-full object-cover rounded-[5px]"
                              loading="lazy"
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>
      </>
    );
  }

  // Default layout for other styles (large, medium, small, micro)
  return (
    <>
      <VideoModal isOpen={videoModalOpen} onClose={closeVideoModal} videoUrl={currentVideoUrl} />
      <section data-id={anchorId} className="py-10 px-4 bg-white">
      <div className="max-w-[1120px] mx-auto">
        {title && (
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-left text-[#3C3737]">
            {title}
          </h2>
        )}
        {intro && (
          <p className="text-lg text-left text-[#3C3C3B] mb-6">
            {intro}
          </p>
        )}
           {ctaText && ctaType !== 'none' && (
          <div className="text-left mt-4 mb-6">
            <a
              href={ctaLink || '#'}
              className="inline-block border-2 border-[#D30013] text-[#D30013] hover:bg-[#D30013] hover:text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300"
            >
              {ctaText}
            </a>
          </div>
        )}

        <div className="grid grid-cols-1 gap-12">
          {blocksArray.map((block, index) => {
            const imageUrl = block.image?.startsWith('http')
              ? block.image
              : `${API_BASE_URL}${block.image}`;

            return (
              <div
                key={index}
                className={`flex flex-col ${
                  block.align === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'
                } items-center gap-8`}
              >
                {/* Image */}
                {block.image && (
                  <div className="md:w-1/2">
                    <img
                      src={imageUrl}
                      alt={block.image_description || block.title}
                      className="w-full h-auto rounded-lg"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="md:w-1/2 text-left">
                  {block.title && (
                    <h3 className="text-2xl lg:text-3xl font-bold text-left mb-4 text-[#3C3737]">
                      {block.title}
                    </h3>
                  )}
                  {block.description && (
                    <p className="text-left text-[#3C3C3B] mb-6 leading">
                      {block.description}
                    </p>
                  )}
                  {block['cta-text'] && block['cta-type'] !== 'none' && (
                    block['cta-type'] === 'video' ? (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleVideoClick(block);
                        }}
                        className="inline-block border-2 border-[#D30013] text-[#D30013] hover:bg-[#D30013] hover:text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 cursor-pointer"
                      >
                        {block['cta-text']}
                      </button>
                    ) : (
                      <a
                        href={getBlockCtaUrl(block)}
                        className="inline-block border-2 border-[#D30013] text-[#D30013] hover:bg-[#D30013] hover:text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300"
                      >
                        {block['cta-text']}
                      </a>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
    </>
  );
};

export default PromoBlock;
