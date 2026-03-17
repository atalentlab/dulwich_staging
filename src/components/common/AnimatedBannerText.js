import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/**
 * AnimatedBannerText Component
 * Creates character-by-character animation with gradient text effect
 * Similar to "LIVE WORLDWISE™" style
 */
const AnimatedBannerText = ({ text, className = '', isDark = false }) => {
  const containerRef = useRef(null);
  const [isAnimated, setIsAnimated] = useState(false);

  // Split text into words and characters
  const words = text.split(' ');

  useEffect(() => {
    if (!containerRef.current || isAnimated) return;

    const chars = containerRef.current.querySelectorAll('.char');
    const shimmers = containerRef.current.querySelectorAll('.shimmer-overlay');

    // Initial state - blur and transform
    gsap.set(chars, {
      opacity: 0,
      filter: 'blur(10px)',
      y: 20,
      rotateX: -45,
    });

    // Animate characters in sequence
    gsap.to(chars, {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      rotateX: 0,
      duration: 0.8,
      stagger: 0.03,
      ease: 'power3.out',
      onComplete: () => setIsAnimated(true),
    });

    // iPhone-style shimmer effect - slow, smooth metallic shine
    if (shimmers && shimmers.length > 0) {
      gsap.fromTo(
        shimmers,
        {
          x: '-200%',
        },
        {
          x: '200%',
          duration: 3,
          delay: 1.5,
          ease: 'power1.inOut',
          repeat: -1,
          repeatDelay: 3,
        }
      );
    }

  }, [isAnimated]);

  // iPhone-style text styling with metallic gradient
  const textStyle = isDark
    ? {
        perspective: '600px',
        WebkitTextStroke: '0.5px rgba(0, 0, 0, 0.08)',
        background: 'linear-gradient(rgb(14, 14, 14), rgb(12, 12, 12) 60%, rgb(0, 0, 0) 100%)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
      }
    : {
        perspective: '600px',
        WebkitTextStroke: '1px rgba(0, 0, 0, 0.1)',
        background: 'linear-gradient(180deg, #ffffff 0%, #f5f5f5 20%, #e0e0e0 50%, #c8c8c8 80%, #b8b8b8 100%)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        filter: 'drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.5)) drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.3))',
      };

  const glowStyle = isDark
    ? {
        background: 'radial-gradient(70% 55%, rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0))',
        opacity: 0.28,
      }
    : {
        background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0) 70%)',
        opacity: 0.5,
        filter: 'blur(60px)',
      };

  return (
    <div ref={containerRef} className={`relative ${className}`} style={{ isolation: 'isolate' }}>
      {/* Glow background effect */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-6 rounded-[2rem] blur-2xl"
        style={glowStyle}
      />

      {/* Text content wrapper with shimmer */}
      <div className="relative grid md:flex gap-5 place-items-center text-center" style={{ overflow: 'hidden' }}>
        {/* Render text twice: base layer and shimmer layer */}
        <div className="relative" style={{ overflow: 'hidden', display: 'inline-block' }}>
          {/* Base text layer */}
          {words.map((word, wordIndex) => (
            <div key={`base-${wordIndex}`} className="leading-none" style={{ display: 'inline-block', marginRight: wordIndex < words.length - 1 ? '1.25rem' : '0', overflow: 'hidden' }}>
              <span className="inline-block" style={{ overflow: 'hidden' }}>
                {word.split('').map((char, charIndex) => (
                  <span
                    key={`${wordIndex}-${charIndex}`}
                    className="char inline-block will-change-transform"
                    style={textStyle}
                  >
                    {char}
                  </span>
                ))}
              </span>
            </div>
          ))}

          {/* iPhone-style shimmer layer - metallic shine effect */}
          <div
            className="shimmer-overlay pointer-events-none absolute"
            style={{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(110deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 35%, rgba(255, 255, 255, 0.5) 45%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0.5) 55%, rgba(255, 255, 255, 0) 65%, rgba(255, 255, 255, 0) 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
              mixBlendMode: 'overlay',
              willChange: 'transform',
              overflow: 'hidden',
              filter: 'brightness(1.3)',
            }}
          >
            {words.map((word, wordIndex) => (
              <div key={`shimmer-${wordIndex}`} className="leading-none" style={{ display: 'inline-block', marginRight: wordIndex < words.length - 1 ? '1.25rem' : '0', overflow: 'hidden' }}>
                <span className="inline-block" style={{ overflow: 'hidden' }}>
                  {word.split('').map((char, charIndex) => (
                    <span
                      key={`shimmer-${wordIndex}-${charIndex}`}
                      className="inline-block will-change-transform"
                      style={{
                        perspective: '600px',
                        fontWeight: 'inherit',
                        fontSize: 'inherit',
                      }}
                    >
                      {char}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </div>

          {/* Secondary reflection layer - adds depth like iPhone text */}
          <div
            className="pointer-events-none absolute"
            style={{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.2) 20%, rgba(255, 255, 255, 0) 50%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
              mixBlendMode: 'soft-light',
              overflow: 'hidden',
            }}
          >
            {words.map((word, wordIndex) => (
              <div key={`reflection-${wordIndex}`} className="leading-none" style={{ display: 'inline-block', marginRight: wordIndex < words.length - 1 ? '1.25rem' : '0', overflow: 'hidden' }}>
                <span className="inline-block" style={{ overflow: 'hidden' }}>
                  {word.split('').map((char, charIndex) => (
                    <span
                      key={`reflection-${wordIndex}-${charIndex}`}
                      className="inline-block"
                      style={{
                        fontWeight: 'inherit',
                        fontSize: 'inherit',
                      }}
                    >
                      {char}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom shadow layer - adds iPhone-style depth */}
          <div
            className="pointer-events-none absolute"
            style={{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to top, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.1) 30%, rgba(0, 0, 0, 0) 60%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
              mixBlendMode: 'multiply',
              overflow: 'hidden',
            }}
          >
            {words.map((word, wordIndex) => (
              <div key={`shadow-${wordIndex}`} className="leading-none" style={{ display: 'inline-block', marginRight: wordIndex < words.length - 1 ? '1.25rem' : '0', overflow: 'hidden' }}>
                <span className="inline-block" style={{ overflow: 'hidden' }}>
                  {word.split('').map((char, charIndex) => (
                    <span
                      key={`shadow-${wordIndex}-${charIndex}`}
                      className="inline-block"
                      style={{
                        fontWeight: 'inherit',
                        fontSize: 'inherit',
                      }}
                    >
                      {char}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedBannerText;
