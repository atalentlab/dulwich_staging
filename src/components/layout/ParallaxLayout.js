import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import AOS from 'aos';
import 'aos/dist/aos.css';
// import lottie from 'lottie-web'; // DISABLED: External animations returning 403 errors
import BannerBlock from '../blocks/BannerBlock';
import BlockRenderer from '../blocks/BlockRenderer';
import PageFooter from './PageFooter';

/**
 * ParallaxLayout Component
 * Adds AOS-style animations and parallax effects to text blocks
 * Used for page_layout_type = 5
 */
const ParallaxLayout = ({
  banner,
  blocks = [],
  header,
  footer,
  selectedSchool,
  availableSchools,
  setSelectedSchool,
  setSelectedSchoolSlug
}) => {
  const containerRef = useRef(null);
  const animatedElementsRef = useRef(new Set());
  const [isScrolled, setIsScrolled] = useState(false);
  const lottieRef1 = useRef(null);
  const lottieRef2 = useRef(null);
  const lottieAnimations = useRef([]);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 400,
      easing: 'ease-out-cubic',
      once: true,
      offset: 20,
      delay: 0,
    });

    return () => {
      AOS.refresh();
    };
  }, []);

  // Apply AOS animations to section titles (exclude statistics/results sections)
  useEffect(() => {
    if (!containerRef.current) return;

    const timeoutId = setTimeout(() => {
      // Add data-aos attributes to all section titles
      const sectionTitles = containerRef.current.querySelectorAll(
        '.page-content h1, .page-content h2, .page-content h3'
      );

      sectionTitles.forEach((title, index) => {
        if (!title.dataset.aos) {
          // Skip if element contains statistics/results content
          const text = title.textContent.toLowerCase();
          const isStatsSection =
            text.includes('ib result') ||
            text.includes('pass rate') ||
            text.includes('perfect scores') ||
            text.includes('average points') ||
            title.closest('[style*="background"]')?.textContent?.toLowerCase().includes('ib result');

          if (!isStatsSection) {
            title.setAttribute('data-aos', 'fade-up');
            title.setAttribute('data-aos-duration', '400');
            title.setAttribute('data-aos-delay', '0');
            title.setAttribute('data-aos-easing', 'ease-out');
          }
        }
      });

      // Refresh AOS to detect new elements
      AOS.refresh();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [blocks]);

  // Detect scroll position for responsive banner margin
  useEffect(() => {
    // Set initial scroll state
    setIsScrolled(window.scrollY > 20);

    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initialize Lottie animations
  useEffect(() => {
    // Clean up previous animations
    lottieAnimations.current.forEach(anim => anim.destroy());
    lottieAnimations.current = [];

    // DISABLED: External Lottie animations returning 403 errors
    // Hiding containers to prevent XHR errors in console
    console.info('[Lottie] Animations disabled - external files not accessible (403 errors)');

    if (lottieRef1.current) {
      lottieRef1.current.style.display = 'none';
    }

    if (lottieRef2.current) {
      lottieRef2.current.style.display = 'none';
    }

    // ORIGINAL CODE (commented out to prevent 403 errors):
    /*
    // Animation 1 - Scroll indicator (near banner)
    if (lottieRef1.current) {
      try {
        const anim1 = lottie.loadAnimation({
          container: lottieRef1.current,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: 'https://lottie.host/4db68bbd-31f6-4cd8-b6a3-0c4c6f0d7a13/OT7w7pZIrP.json'
        });
        anim1.addEventListener('data_failed', () => {
          console.warn('[Lottie] Animation 1 failed to load - hiding container');
          if (lottieRef1.current) lottieRef1.current.style.display = 'none';
        });
        lottieAnimations.current.push(anim1);
      } catch (error) {
        console.warn('Failed to load Lottie animation 1:', error);
        if (lottieRef1.current) lottieRef1.current.style.display = 'none';
      }
    }

    // Animation 2 - Decorative element (in content area)
    if (lottieRef2.current) {
      try {
        const anim2 = lottie.loadAnimation({
          container: lottieRef2.current,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: 'https://lottie.host/embed/ee628a4a-e5dd-4ff5-aa85-f5d9c8d1eecf/u3RAi7gPBv.json'
        });
        anim2.addEventListener('data_failed', () => {
          console.warn('[Lottie] Animation 2 failed to load - hiding container');
          if (lottieRef2.current) lottieRef2.current.style.display = 'none';
        });
        lottieAnimations.current.push(anim2);
      } catch (error) {
        console.warn('Failed to load Lottie animation 2:', error);
        if (lottieRef2.current) lottieRef2.current.style.display = 'none';
      }
    }
    */

    return () => {
      lottieAnimations.current.forEach(anim => anim.destroy());
      lottieAnimations.current = [];
    };
  }, []);

  // Add AOS attributes to banner and content elements (exclude statistics sections)
  useEffect(() => {
    if (!containerRef.current) return;

    const timeoutId = setTimeout(() => {
      if (!containerRef.current) return;

      // Helper function to check if element is in statistics section
      const isInStatsSection = (element) => {
        const section = element.closest('section') || element.closest('div[style*="background"]');
        if (!section) return false;
        const sectionText = section.textContent.toLowerCase();
        return (
          sectionText.includes('ib result') ||
          sectionText.includes('pass rate') ||
          sectionText.includes('perfect scores') ||
          sectionText.includes('average points') ||
          sectionText.includes('100%') ||
          sectionText.includes('out of 45')
        );
      };

      // Banner title - Skip AOS if using custom AnimatedBannerText component
      const bannerTitle = containerRef.current.querySelector('.parallax-section-banner h1, .parallax-section-banner h2');
      const hasAnimatedText = containerRef.current.querySelector('.parallax-section-banner .char');
      if (bannerTitle && !bannerTitle.dataset.aos && !hasAnimatedText) {
        bannerTitle.setAttribute('data-aos', 'fade-up');
        bannerTitle.setAttribute('data-aos-duration', '500');
        bannerTitle.setAttribute('data-aos-delay', '0');
        bannerTitle.setAttribute('data-aos-easing', 'ease-out');
      }

      // Banner CTA button - AOS animation
      const bannerCTA = containerRef.current.querySelector('.parallax-section-banner button');
      if (bannerCTA && !bannerCTA.dataset.aos) {
        bannerCTA.setAttribute('data-aos', 'fade-up');
        bannerCTA.setAttribute('data-aos-duration', '400');
        bannerCTA.setAttribute('data-aos-delay', '100');
      }

      // Add AOS to paragraphs (exclude stats sections)
      const paragraphs = containerRef.current.querySelectorAll('.page-content p');
      paragraphs.forEach((para, index) => {
        if (!para.dataset.aos && !para.closest('button') && !isInStatsSection(para)) {
          para.setAttribute('data-aos', 'fade-up');
          para.setAttribute('data-aos-duration', '350');
          para.setAttribute('data-aos-delay', '0');
        }
      });

      // Add AOS fade-right to images and image containers
      const images = containerRef.current.querySelectorAll('.page-content img, .page-content figure, .page-content [class*="image"], .page-content [class*="card"]');
      images.forEach((img, index) => {
        if (!img.dataset.aos && !isInStatsSection(img)) {
          img.setAttribute('data-aos', 'fade-right');
          img.setAttribute('data-aos-duration', '450');
          img.setAttribute('data-aos-delay', '0');
          img.setAttribute('data-aos-easing', 'ease-out');
        }
      });

      // Add AOS fade-right to content sections and divs with background images
      const contentSections = containerRef.current.querySelectorAll('.page-content section, .page-content div[class*="col"], .page-content div[class*="block"]');
      contentSections.forEach((section, index) => {
        if (!section.dataset.aos && !isInStatsSection(section) && !section.querySelector('[data-aos]')) {
          const hasImage = section.querySelector('img') || section.style.backgroundImage;
          if (hasImage) {
            section.setAttribute('data-aos', 'fade-up');
            section.setAttribute('data-aos-duration', '450');
            section.setAttribute('data-aos-delay', '0');
            section.setAttribute('data-aos-easing', 'ease-out');
          }
        }
      });

      // Refresh AOS to detect new elements
      AOS.refresh();
    }, 150);

    return () => {
      clearTimeout(timeoutId);
      animatedElementsRef.current.clear();
    };
  }, [blocks, banner]);

  return (
    <>
      <style>{`
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Parallax container - Hide horizontal, show vertical scroll */
        .parallax-layout-container {
          position: relative;
          overflow-x: hidden !important;
          overflow-y: scroll !important;
        }

        /* Banner section styling with smooth transitions */
        .parallax-section-banner {
          position: relative;
          transition: margin-top 0.3s ease-in-out;
          will-change: margin-top;
        }

        /* Center align content and buttons in banner on all screen sizes */
        .parallax-section-banner .max-w-\\[1120px\\],
        .parallax-section-banner .text-center {
          text-align: center !important;
        }

        /* Center align all buttons in banner */
        .parallax-section-banner button {
          margin-left: auto !important;
          margin-right: auto !important;
          display: inline-flex !important;
        }

        /* Ensure banner content is always visible */
        .parallax-section-banner h1,
        .parallax-section-banner h2,
        .parallax-section-banner button {
          opacity: 1 !important;
          visibility: visible !important;
        }

        /* Main content area - Hide horizontal overflow */
        .page-content {
          overflow-x: hidden !important;
          overflow-y: visible !important;
        }

        /* Text elements with AOS animations */
        .page-content h1,
        .page-content h2,
        .page-content h3,
        .page-content h4,
        .page-content h5,
        .page-content h6,
        .page-content p,
        .parallax-section-banner h1,
        .parallax-section-banner h2 {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          word-break: keep-all;
          white-space: normal;
          overflow-wrap: normal;
          hyphens: none;
        }

        /* Ensure AOS animations work smoothly */
        [data-aos] {
          opacity: 1;
          visibility: visible;
        }

        [data-aos].aos-animate {
          opacity: 1;
          visibility: visible;
        }

        /* Prevent word breaking for all text */
        .parallax-layout-container * {
          word-break: normal;
          overflow-wrap: normal;
        }

        /* Subtle parallax for background images - fixed attachment */
        .parallax-layout-container [style*="background-image"] {
          background-attachment: fixed;
          background-position: center;
          background-size: cover;
        }

        /* Responsive - disable fixed backgrounds on mobile */
        @media (max-width: 1024px) {
          .parallax-section-banner {
            margin-top: 60px !important;
          }
        }

        @media (max-width: 768px) {
          .parallax-layout-container [style*="background-image"] {
            background-attachment: scroll;
          }

          .parallax-section-banner {
            margin-top: 60px !important;
          }

          /* Simplify AOS animations on mobile */
          [data-aos] {
            animation-duration: 300ms !important;
          }
        }

        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          [data-aos] {
            animation: none !important;
            transition: none !important;
          }
        }

        /* Lottie Animation Containers */
        .lottie-scroll-indicator {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 60px;
          z-index: 10;
          pointer-events: none;
          opacity: 0.8;
          transition: opacity 0.3s ease;
        }

        .lottie-scroll-indicator:hover {
          opacity: 1;
        }



        @media (max-width: 768px) {
          .lottie-scroll-indicator {
            width: 40px;
            height: 40px;
            bottom: 20px;
          }

          .lottie-decorative {
            width: 120px;
            height: 120px;
          }
        }

        /* Hide Lottie animations when reduced motion is preferred */
        @media (prefers-reduced-motion: reduce) {
          .lottie-scroll-indicator,
          .lottie-decorative {
            display: none;
          }
        }
      `}</style>

      {/* Main Container */}
      <div ref={containerRef} className="parallax-layout-container">
        {/* Banner Section */}
        {banner && banner.media && (
          <div
            className="parallax-section-banner transition-all duration-300 ease-in-out"
            style={{

            }}
          >
            <BannerBlock
              content={{
                ...banner,
                backgroundImage: banner.media,
                title: banner.title || '',
                subtitle: banner.description || '',
                ctaText: banner.link_copy || null,
                ctaLink: banner.link || null,
                page_layout_type: 5
              }}
            />
            {/* Lottie Scroll Indicator */}
            <div
              ref={lottieRef1}
              className="lottie-scroll-indicator"
              data-aos="fade-in"
              data-aos-delay="1000"
            />
          </div>
        )}

        {/* Main Content - Blocks rendered normally */}
        <main className="page-content">
          {/* Decorative Lottie Animation */}
          {blocks && blocks.length > 0 && (
            <div
              className="py-8"
              data-aos="zoom-in"
              data-aos-duration="1000"
            >
              <div ref={lottieRef2} className="lottie-decorative" />
            </div>
          )}

          {blocks && blocks.length > 0 ? (
            <BlockRenderer
              blocks={blocks.map(block => ({
                ...block,
                content: {
                  ...block.content,
                  page_layout_type: 5
                }
              }))}
              header={header}
              footer={footer}
            />
          ) : (
            <div className="py-16 text-center text-gray-500">
              <p>No content blocks available for this page.</p>
            </div>
          )}
        </main>

        {/* Footer Section */}
        <PageFooter
          selectedSchool={selectedSchool}
          availableSchools={availableSchools}
          setSelectedSchool={setSelectedSchool}
          setSelectedSchoolSlug={setSelectedSchoolSlug}
        />
      </div>
    </>
  );
};

export default ParallaxLayout;
