import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';

/**
 * Triptych Block Component
 * Displays tabbed content with image on left and content on right
 */
const TriptychBlock = ({ content }) => {
  const { title, 'nested-blocks': nestedBlocks = [] } = content;
  const items = nestedBlocks; // API uses 'nested-blocks' instead of 'items'

  // Active tab state - default to first item
  const [activeTab, setActiveTab] = useState(0);

  // Refs for animation
  const imageRef = useRef(null);
  const contentRef = useRef(null);

  // Get current active item
  const activeItem = items[activeTab] || {};

  // Animate on tab change
  useEffect(() => {
    if (imageRef.current && contentRef.current) {
      // Fade out first
      gsap.to([imageRef.current, contentRef.current], {
        opacity: 0,
        y: 20,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          // Then fade in with new content
          gsap.fromTo(
            [imageRef.current, contentRef.current],
            {
              opacity: 0,
              y: 20,
              scale: 0.95
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              ease: 'power2.out',
              stagger: 0.1
            }
          );
        }
      });
    }
  }, [activeTab]);

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-[1120px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left side - Image */}
          <div className="order-2 md:order-1 overflow-hidden">
            {activeItem.image && (
              <img
                ref={imageRef}
                src={activeItem.image}
                alt={activeItem.label1 || activeItem.title}
                className="w-full h-auto rounded-lg"
              />
            )}
          </div>

          {/* Right side - Content with tabs */}
          <div className="order-1 md:order-2">
            {title && (
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text[#3C3737] leading-tight text-center md:text-left">
                {title}
              </h2>
            )}

            {/* Tab buttons */}
            <div className="flex gap-4 mb-6 justify-center md:justify-start">
              {items.map((item, index) => (
                <button
                  key={item.id || index}
                  onClick={() => setActiveTab(index)}
                  className={`px-2.5 py-2.5 text-sm rounded-lg transition-all duration-300 ${
                    activeTab === index
                      ? 'bg-[#D30013] text-white'
                      : 'bg-[#F2EDE9] text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {item.label1 || item.title}
                </button>
              ))}
            </div>

            {/* Active tab content */}
            <p
              ref={contentRef}
              className="text-[#3C3C3B] text-lg leading-relaxed text-center md:text-left"
            >
              {activeItem.content1 || activeItem.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TriptychBlock;
