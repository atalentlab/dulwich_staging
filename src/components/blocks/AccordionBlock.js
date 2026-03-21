import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, AlertTriangle } from 'lucide-react';

/**
 * AccordionBlock Component
 * Displays expandable accordion sections with dynamic content and animations
 * Supports multiple styles based on content.style field
 */
function AccordionBlock({ content, block }) {
  const [expandedSection, setExpandedSection] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Toggle accordion section
  const toggleSection = (id) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  // Intersection Observer for animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Extract data from content prop
  const {
    title,
    copy, // "copy" field from response containing intro HTML
    items,
    intro,
    cta,
    'cta_name': ctaName,
    'nested-blocks': nestedBlocks,
    'anchor-id': anchorId,
    style // Style field to determine which accordion layout to use
  } = content || {};


// Render Style 2 - Single accordion (FAQ style)
if (style === '2') {
  const isOpen = expandedSection === 'style-2';

  return (
    <section
      data-id={anchorId} 
      ref={sectionRef}
      className=" px-4 sm:px-8 bg-white"
    >
      <style>{`
        .accordion-hover-style-2::before,
        .accordion-hover-style-3::before,
        .accordion-hover-style-4::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 0;
          background-color: #FAF7F5;
          transition: height 0.3s ease-out;
          z-index: 0;
        }

        .accordion-hover-style-2:hover::before,
        .accordion-hover-style-3:hover::before,
        .accordion-hover-style-4:hover::before {
          height: 100%;
        }
      `}</style>
      <div className="max-w-[1120px] mx-auto  px-2">

        {/* Accordion Header */}
        <button
          onClick={() => toggleSection('style-2')}
          className="w-full flex items-center justify-between text-left py-12 border-t border-b border-gray-200 px-4 -mx-4 transition-all duration-300 group relative overflow-hidden accordion-hover-style-2"
        >
          <h3 className="text-[24px] sm:text-xl font-bold text-[#3C3737] relative z-10">
            {title}
          </h3>

          <div
            className={`rounded-full flex items-center justify-center transition-all duration-300 relative z-10 ${
              isOpen
                ? 'bg-[#FAF7F5] text-[#D30013] border-[#D30013] border w-14 h-9'
                : 'border border-[#F2EDE9] text-[#3C3737] w-8 h-8 group-hover:bg-[#D30013] group-hover:text-white group-hover:w-14'
            }`}
          >
            <ChevronDown
              className={`w-5 h-5 transition-transform duration-300 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
        </button>

        {/* Accordion Content */}
        <div
          className={`overflow-hidden transition-all duration-500 ${
            isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="text-left pt-6 pb-8 space-y-6">
            {copy && (
              <div
                className="prose prose-sm text-[#3C3737]"
                dangerouslySetInnerHTML={{ __html: copy }}
              />
            )}

            {/* CTA Button */}
            {cta && (
              <a
                href={cta || '#'}
                className="text-left inline-block mt-4 px-6 py-3 border-2 border-[#D30013] text-[#D30013] rounded-[10px] font-semibold hover:bg-[#D30013] hover:text-white transition"
              >
                {ctaName}
              </a>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
// Render Style 3 - Profile / Big accordion card
if (style === '3') {
  const isOpen = expandedSection === 'style-3';

  return (
    <section
      data-id={anchorId} 
      ref={sectionRef}
      className="py-4 px-4 sm:px-8 bg-white"
    >
      <style>{`
        .accordion-hover-style-2::before,
        .accordion-hover-style-3::before,
        .accordion-hover-style-4::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 0;
          background-color: #FAF7F5;
          transition: height 0.3s ease-out;
          z-index: 0;
        }

        .accordion-hover-style-2:hover::before,
        .accordion-hover-style-3:hover::before,
        .accordion-hover-style-4:hover::before {
          height: 100%;
        }
      `}</style>
      <div className="max-w-[1120px] mx-auto">

        <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">

          {/* Header */}
          <button
            onClick={() => toggleSection('style-3')}
            className="w-full flex flex-col sm:flex-row items-stretch text-left transition-all duration-300 group relative overflow-hidden accordion-hover-style-3"
          >
            {/* Image */}
            {content.image && (
              <div className="w-full md:min-w-[200px] sm:w-32 md:w-40 h-48 sm:h-auto flex-shrink-0 relative z-10">
                <img
                  src={content.image}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div className="flex-1 p-5 sm:p-6 flex items-center justify-between gap-6 relative z-10">
              <div className='max-w-[700px]'>

                <h3 className="text-2xl sm:text-3xl font-bold text-[#3C3737]">
                  {title}
                </h3>

                {intro && (
                  <p className="mt-2 text-gray-600 text-sm sm:text-base">
                    {intro}
                  </p>
                )}
              </div>

              {/* Chevron */}
             <div
            className={`rounded-full flex items-center justify-center transition-all duration-300 ${
              isOpen
                ? 'bg-[#D30013] text-white w-14 h-9'
                : 'border-2 border-[#D30013] text-[#D30013] w-9 h-9 group-hover:bg-[#D30013] group-hover:text-white group-hover:w-14'
            }`}
          >
            <ChevronDown
              className={`w-5 h-5 transition-transform duration-300 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
            </div>
          </button>

          {/* Expanded Content */}
          <div
            className={`overflow-hidden transition-all duration-500 ${
              isOpen ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="px-6 sm:px-8 pb-8 border-t border-gray-200">

             

              {/* Qualifications */}
              <div className="mt-6">
              

                {copy && (
                  <div
                    className="text-left prose prose-sm max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: copy }}
                  />
                )}

                                {/* CTA */}
                {cta && (
                  <div className="text-left mt-8">
                    <a
                      href={cta|| '#'}
                      className="inline-flex items-center justify-center px-6 py-3 border border-[#D30013] text-[#D30013] font-semibold rounded-[10px] hover:bg-[#D30013] hover:text-white transition"
                    >
                      {ctaName}
                    </a>
                  </div>
                )}

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
 }
  // Render Style 4 - Tuition accordion
if (style === '4') {
  const isOpen = expandedSection === 'style-4';

  return (
    <section
      data-id={anchorId} 
      ref={sectionRef}
      className="py-6 px-4 sm:px-8 bg-white"
    >
      <style>{`
        .accordion-hover-style-2::before,
        .accordion-hover-style-3::before,
        .accordion-hover-style-4::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 0;
          background-color: #FAF7F5;
          transition: height 0.3s ease-out;
          z-index: 0;
        }

        .accordion-hover-style-2:hover::before,
        .accordion-hover-style-3:hover::before,
        .accordion-hover-style-4:hover::before {
          height: 100%;
        }
      `}</style>
      <div className="max-w-[1120px] mx-auto">

        <div className="border border-gray-200 rounded-xl p-6 sm:p-8">

          {/* HEADER */}
          <button
            onClick={() => toggleSection('style-4')}
            className="w-full flex flex-col sm:flex-row items-start justify-between text-left gap-6 p-4 -m-4 rounded-lg transition-all duration-300 group relative overflow-hidden accordion-hover-style-4"
          >
            {/* LEFT */}
            <div className="w-full sm:max-w-[55%] relative z-10">
              <h3 className="text-3xl sm:text-4xl font-bold text-[#3C3737] mb-4">
                {title}
              </h3>

              {intro && (
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  {intro}
                </p>
              )}
            </div>

            {/* RIGHT - Year / Term & Chevron Container */}
            <div className="w-full sm:w-auto flex items-start gap-6 justify-between sm:justify-end relative z-10">
              {/* Year / Term */}
              <div className="flex flex-col gap-8">
                {(nestedBlocks || []).map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-2 gap-8 sm:gap-12"
                  >
                    {/* YEAR */}
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        {item.label || 'Name'}
                      </p>

                      <p className="text-3xl sm:text-4xl font-bold text-[#3C3737]">
                        {item.year}
                      </p>

                      <p className="text-sm text-gray-500">
                        /Year
                      </p>
                    </div>

                    {/* TERM */}
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        &nbsp;
                      </p>

                      <p className="text-xl sm:text-2xl font-bold text-[#3C3737]">
                        {item.term}
                      </p>

                      <p className="text-sm text-gray-500">
                        /Term
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CHEVRON */}
              <div
                className={`flex-shrink-0 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isOpen
                    ? 'bg-[#D30013] text-white w-14 h-9'
                    : 'border-2 border-[#D30013] text-[#D30013] w-9 h-9 group-hover:bg-[#D30013] group-hover:text-white group-hover:w-14'
                }`}
              >
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </div>
          </button>

          {/* EXPANDED CONTENT */}
          <div
            className={`overflow-hidden transition-all duration-500 ${
              isOpen ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="pt-8 mt-8 border-t border-gray-200">

              {copy && (
                <div
                  className="text-left prose prose-sm max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: copy }}
                />
              )}

              {/* CTA (same style as 2 & 3) */}
              {cta && (
                <div className="text-left mt-8">
                  <a
                    href={cta || '#'}
                    className="inline-flex items-center justify-center px-6 py-3 border border-[#D30013] text-[#D30013] font-semibold rounded-[10px] hover:bg-[#D30013] hover:text-white transition"
                  >
                    {ctaName}
                  </a>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
}

export default AccordionBlock;
