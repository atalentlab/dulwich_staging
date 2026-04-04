import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://cms.dulwich.org';

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

  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const imageRef = useRef(null);
  const overlayRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const linksRef = useRef([]);

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

  // Extract text from description HTML (if provided)
  const getTextFromHtml = (html) => {
    if (!html) return '';
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  };

  const subtitleText = bodyContent || (description ? getTextFromHtml(description) : 'Learning that begins in the classroom and extends to the world');

  // GSAP ScrollTrigger pinning and animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial state - everything hidden except image
      gsap.set(imageRef.current, { scale: 1, y: 0, opacity: 1 });
      gsap.set(overlayRef.current, { opacity: 0 });
      gsap.set(titleRef.current, { y: 50, opacity: 0 });
      gsap.set(subtitleRef.current, { y: 50, opacity: 0 });
      gsap.set(linksRef.current, { y: 30, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=150%',
          pin: pinRef.current,
          scrub: 1,
          anticipatePin: 1,
          pinSpacing: true,
        },
      });

      // Animate: Image zoom + fade out, overlay fade in, content slide up
      tl.to(imageRef.current, {
        scale: 1.1,
        y: -50,
        opacity: 0,
        duration: 0.4
      }, 0)
        .to(overlayRef.current, {
          opacity: 1,
          duration: 0.3
        }, 0.1)
        .to(titleRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.3
        }, 0.2)
        .to(subtitleRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.3
        }, 0.25)
        .to(linksRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.3,
          stagger: 0.05
        }, 0.3);

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} data-id={anchorId}>
      <div
        ref={pinRef}
        className="h-screen flex items-center justify-center bg-black relative overflow-hidden"
      >
        {/* Background Image */}
        <img
          ref={imageRef}
          src={imageUrl}
          alt={title || "Holistic Curriculum"}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            console.error('Image failed to load:', imageUrl);
            e.target.src = 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=1920&q=80';
          }}
        />

        {/* Content Overlay */}
        <div
          ref={overlayRef}
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: 'radial-gradient(ellipse at 60% 40%, #9B1C1C 0%, #7F1D1D 25%, #5C0A0A 55%, #3B0606 80%, #1A0202 100%)',
          }}
        >
          <div className="max-w-7xl w-full px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
            <div className="flex flex-col items-center justify-center text-center">
              <h2
                ref={titleRef}
                className="text-[#FDFCF8] text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 tracking-tight px-4"
              >
                {title}
              </h2>
              <p
                ref={subtitleRef}
                className="text-[#FDFCF8] text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl mb-8 sm:mb-10 md:mb-12 lg:mb-14 max-w-3xl px-4"
                style={{ opacity: 0.85 }}
              >
                {subtitleText}
              </p>
              <div className="flex flex-col items-center gap-3 sm:gap-4 md:gap-5 w-full max-w-md px-4">
                {curriculumLinks.map((link, index) => (
                  <a
                    key={index}
                    ref={el => (linksRef.current[index] = el)}
                    href={link.href}
                    className="border border-[#FDFCF8] text-[#FDFCF8] text-xs xs:text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-1.5 sm:py-2 md:py-2.5 rounded-lg text-center transition-all duration-300 w-full sm:w-auto hover:bg-white/10 hover:transform hover:scale-105"
                    target={link.isExternal ? '_blank' : undefined}
                    rel={link.isExternal ? 'noopener noreferrer' : undefined}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HolisticCurriculumBlock;
