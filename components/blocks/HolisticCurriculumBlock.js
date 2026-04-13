import React, { useState } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://cms.dulwich.atalent.xyz';

const HolisticCurriculumBlock = ({ content }) => {
  const {
    image,
    title,
    content: bodyContent,
    description,
    cta,
    'nested-blocks': nestedBlocks,
    'anchor-id': anchorId,
  } = content || {};

  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Support both nested-blocks (API format) and cta (legacy format)
  const rawLinks = nestedBlocks && nestedBlocks.length > 0
    ? nestedBlocks
    : (cta ? Object.values(cta) : []);

  // Detect if we're on Chinese version
  const isChineseVersion = typeof window !== 'undefined' && window.location.pathname.startsWith('/zh');

  // Helper function to convert URL to relative path
  const makeRelativeUrl = (url) => {
    if (!url || url === '#') return url;

    // Strip out common base URLs to get relative path
    const urlPatterns = [
      `${API_BASE_URL}/`,
      '/',
      /https:\/\/[^.]+\.dulwich-frontend\.atalent\.xyz\//,
      /https:\/\/[^.]+\.dulwich\.atalent\.xyz\//,
    ];

    let cleanUrl = url;
    for (const pattern of urlPatterns) {
      if (typeof pattern === 'string') {
        cleanUrl = cleanUrl.replace(pattern, '/');
      } else {
        cleanUrl = cleanUrl.replace(pattern, '/');
      }
    }

    return cleanUrl;
  };

  const curriculumLinks = rawLinks
    .filter((item) => (item['cta-text'] || item.text) && (item['cta-type'] !== 'none'))
    .sort((a, b) => (parseInt(a.weight) || 0) - (parseInt(b.weight) || 0))
    .map((item) => ({
      label: item['cta-text'] || item.text || '',
      href: (() => {
        const ctaLink = item['cta-link'] || item.link;
        if (ctaLink) {
          // Convert to relative URL if it's a Dulwich domain
          const relativeUrl = makeRelativeUrl(ctaLink);

          // Check if it's still an external link (didn't get converted)
          if (relativeUrl.startsWith('http')) return relativeUrl;

          // Internal link - preserve Chinese prefix if on Chinese page
          const normalizedLink = relativeUrl.startsWith('/') ? relativeUrl : `/${relativeUrl}`;

          // If on Chinese page and link doesn't already have /zh/, prepend it
          if (isChineseVersion && !normalizedLink.startsWith('/zh/')) {
            return `/zh${normalizedLink}`;
          }

          return normalizedLink;
        }

        // Contextual link fallback
        const contextualUrl = item['contextual-link-data']?.url || '#';
        const relativeContextUrl = makeRelativeUrl(contextualUrl);

        if (relativeContextUrl !== '#' && !relativeContextUrl.startsWith('http')) {
          const normalizedContextLink = relativeContextUrl.startsWith('/') ? relativeContextUrl : `/${relativeContextUrl}`;

          if (isChineseVersion && !normalizedContextLink.startsWith('/zh/')) {
            return `/zh${normalizedContextLink}`;
          }

          return normalizedContextLink;
        }

        return relativeContextUrl;
      })(),
      isExternal: item['cta-type'] === 'link' || item.type === 'external-link',
    }));

  const imageUrl = image
    ? (image.startsWith('http') ? image : `${API_BASE_URL}${image}`)
    : 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=1920&q=80';

  console.log('HolisticCurriculumBlock - Image URL:', imageUrl);
  console.log('HolisticCurriculumBlock - Content:', content);

  // Extract text from description HTML (if provided)
  const getTextFromHtml = (html) => {
    if (!html) return '';
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  };

  const subtitleText = bodyContent || (description ? getTextFromHtml(description) : 'Learning that begins in the classroom and extends to the world');

  const handleToggle = () => {
    if (isAnimating) return; // Prevent double-clicks during animation

    if (isOverlayVisible) {
      // Closing animation
      setIsAnimating(true);
      setIsClosing(true);
      setTimeout(() => {
        setIsOverlayVisible(false);
        setIsClosing(false);
        setIsAnimating(false);
      }, 300); // Match animation duration (0.3s)
    } else {
      // Opening animation
      setIsAnimating(true);
      setIsOverlayVisible(true);
      setTimeout(() => {
        setIsAnimating(false);
      }, 300); // Match animation duration (0.3s)
    }
  };

  return (
    <section data-id={anchorId} className="relative w-full px-4 sm:px-6 md:px-8 lg:px-0">
      <style>{`
        @keyframes slideUpFade {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        .holistic-container {
          position: relative;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .holistic-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .holistic-overlay {
          border-radius: 8px;
          width: 100%;
          display: flex;
          transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: opacity, transform;
          opacity: 1;
          transform: scale(1) translateY(0);
        }

        .holistic-overlay.closing {
          opacity: 0;
          transform: scale(0.98) translateY(10px);
        }

        .holistic-image {
          transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: opacity;
          opacity: 1;
        }

        .holistic-image.hiding {
          opacity: 0;
        }

        .holistic-image.showing {
          opacity: 1;
        }

        .holistic-overlay {
          width: 100%;
          height: 100%;
        }

        .holistic-container.expanding {
          /* Container maintains consistent height during transition */
        }

        .holistic-title {
          animation: slideUpFade 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          opacity: 0;
          animation-delay: 0.05s;
        }

        .holistic-subtitle {
          animation: slideUpFade 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          opacity: 0;
          animation-delay: 0.1s;
        }

        .holistic-link {
          opacity: 0;
          animation: slideUpFade 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        ${curriculumLinks.map((_, index) => `
          .holistic-link:nth-child(${index + 1}) { animation-delay: ${0.15 + index * 0.04}s; }
        `).join('')}

        .holistic-link:hover {
          background-color: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .holistic-link:active {
          transform: translateY(0) scale(0.98);
        }

        @media (max-width: 640px) {
          .holistic-link {
            font-size: 0.875rem;
            padding: 0.5rem 1rem;
          }

          .holistic-container {
            min-height: 550px;
            background-position: center center !important;
          }

          .holistic-container.expanding {
            min-height: 550px;
          }
        }

        @media (min-width: 641px) and (max-width: 1024px) {
          .holistic-container {
            min-height: 650px;
          }

          .holistic-container.expanding {
            min-height: 650px;
          }
        }

        @media (min-width: 1025px) {
          .holistic-container {
            min-height: 750px;
          }

          .holistic-container.expanding {
            min-height: 750px;
          }
        }
      `}</style>

      <div
        className={`holistic-container relative w-full max-w-[1600px] mx-auto cursor-pointer overflow-hidden rounded-lg mt-14 mb-2 ${
          isOverlayVisible ? 'expanding' : ''
        }`}
        style={{
          background: `#000000 url(${imageUrl}) no-repeat center center`,
          backgroundSize: 'cover',
        }}
        onClick={handleToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleToggle()}
        aria-expanded={isOverlayVisible}
        aria-label="Toggle Holistic Curriculum"
      >
        {/* Full width image */}
        <img
          src={imageUrl}
          alt={title || "Holistic Curriculum - Students"}
          className={`holistic-image rounded-lg ${
            isOverlayVisible || isClosing ? 'hiding' : 'showing'
          }`}
          loading="lazy"
          onError={(e) => {
            console.error('Image failed to load:', imageUrl);
            e.target.src = 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=1920&q=80';
          }}
        />

        {/* Overlay */}
        {(isOverlayVisible || isClosing) && (
          <div
            className={`holistic-overlay absolute top-0 left-0 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-10 sm:py-12 md:py-16 lg:py-20 rounded-lg ${
              isClosing ? 'closing' : ''
            }`}
            style={{
              background:
                'radial-gradient(ellipse at 60% 40%, #9B1C1C 0%, #7F1D1D 25%, #5C0A0A 55%, #3B0606 80%, #1A0202 100%)',
            }}
          >
            <h2 className="holistic-title text-[#FDFCF8] text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 text-center tracking-tight px-4">
              {title}
            </h2>
            <p className="holistic-subtitle text-[#FDFCF8] text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl mb-8 sm:mb-10 md:mb-12 lg:mb-14 text-center max-w-3xl px-4" style={{ opacity: 0.85 }}>
              {subtitleText}
            </p>
            <div className="flex flex-col items-center gap-3 sm:gap-4 md:gap-5 w-full max-w-md px-4 pb-6 sm:pb-8">
              {curriculumLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="holistic-link border border-[#FDFCF8] text-[#FDFCF8] text-xs xs:text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-1.5 sm:py-2 md:py-2.5 rounded-lg text-center transition-colors duration-200 w-full sm:w-auto"
                  onClick={(e) => e.stopPropagation()}
                  target={link.isExternal ? '_blank' : undefined}
                  rel={link.isExternal ? 'noopener noreferrer' : undefined}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HolisticCurriculumBlock;
