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
          className="w-full flex items-center justify-between text-left py-12 border-t border-gray-200 px-4 -mx-4 transition-all duration-300 group relative overflow-hidden accordion-hover-style-2"
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
                className="prose prose-lg max-w-none
                  prose-headings:font-bold prose-headings:text-gray-900 prose-headings:leading-tight
                  prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-6
                  prose-h2:text-2xl prose-h2:mb-6 prose-h2:mt-6 prose-h2:leading-snug
                  prose-h3:text-xl prose-h3:mb-4 prose-h3:mt-5
                  prose-h4:text-lg prose-h4:mb-3 prose-h4:mt-4
                  prose-p:text-base prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4 prose-p:mt-0
                  prose-ol:list-decimal prose-ol:ml-6 prose-ol:pl-6 prose-ol:mb-6 prose-ol:mt-4 prose-ol:space-y-3 prose-ol:text-gray-700
                  prose-ul:list-disc prose-ul:ml-6 prose-ul:pl-6 prose-ul:mb-6 prose-ul:mt-4 prose-ul:space-y-3 prose-ul:text-gray-700
                  prose-li:text-base prose-li:text-gray-700 prose-li:leading-relaxed prose-li:mb-3 prose-li:pl-3 prose-li:marker:text-gray-600 prose-li:marker:font-bold
                  prose-strong:text-gray-900 prose-strong:font-bold
                  prose-em:text-gray-700 prose-em:italic
                  prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline hover:prose-a:text-blue-800
                  prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic
                  prose-code:text-gray-800 prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded
                  [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:pl-6 [&_ol]:my-6 [&_ol]:space-y-3
                  [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:pl-6 [&_ul]:my-6 [&_ul]:space-y-3
                  [&_li]:text-base [&_li]:text-gray-700 [&_li]:leading-relaxed [&_li]:mb-3 [&_li]:pl-3
                  [&_li::marker]:text-gray-700 [&_li::marker]:font-semibold
                  [&_.subtitle]:text-2xl [&_.subtitle]:font-bold [&_.subtitle]:text-gray-900 [&_.subtitle]:mb-6 [&_.subtitle]:leading-snug [&_.subtitle]:block
                  [&_.lead]:text-lg [&_.lead]:font-semibold [&_.lead]:text-gray-800 [&_.lead]:mb-3
                  [&_table]:!w-full [&_table]:table-auto
                  md:[&_table]:w-auto
                  [&_th]:border [&_th]:border-gray-300 [&_th]:px-2 [&_th]:py-2 [&_th]:text-left [&_th]:text-sm
                  [&_td]:border [&_td]:border-gray-300 [&_td]:px-2 [&_td]:py-2 [&_td]:text-sm"
                dangerouslySetInnerHTML={{ __html: copy }}
              />
            )}
            {/* CTA Button */}
            {cta && (
              <a
                href={cta}
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
          .prose p {
  clear: both !important;
}
      `}</style>
      <div className="max-w-[1120px] mx-auto">

        <div className="border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

          {/* Header */}
          <button
            onClick={() => toggleSection('style-3')}
            className="w-full flex flex-col sm:flex-row items-stretch text-left transition-all duration-300 group relative accordion-hover-style-3"
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
            className={`rounded-full min-w-[40px] flex items-center justify-center transition-all duration-300 ${
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
  className={`transition-all duration-500 overflow-hidden ${
    isOpen ? 'max-h-[1200px] opacity-100 overflow-y-scroll' : 'max-h-0 opacity-0 overflow-y-hidden'
  }`}
>
            <div className="px-6 sm:px-8 pb-8 border-t border-gray-200">

              {/* Qualifications */}
              <div className="mt-6">
                {copy && (
              <div
              className="text-left prose prose-lg max-w-none
                prose-headings:font-bold prose-headings:text-gray-900 prose-headings:leading-tight
                prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-6
                prose-h2:text-2xl prose-h2:mb-6 prose-h2:mt-6 prose-h2:leading-snug
                prose-h3:text-xl prose-h3:mb-4 prose-h3:mt-5
                prose-h4:text-lg prose-h4:mb-3 prose-h4:mt-4

                prose-p:text-base prose-p:text-gray-700 prose-p:leading-relaxed
                prose-p:mb-4 prose-p:mt-0
                prose-p:clear-both

                prose-ol:list-decimal prose-ol:ml-6 prose-ol:pl-6 prose-ol:mb-6 prose-ol:mt-4 prose-ol:space-y-3 prose-ol:text-gray-700
                prose-ul:list-disc prose-ul:ml-6 prose-ul:pl-6 prose-ul:mb-6 prose-ul:mt-4 prose-ul:space-y-3 prose-ul:text-gray-700
                prose-li:text-base prose-li:text-gray-700 prose-li:leading-relaxed prose-li:mb-3 prose-li:pl-3 prose-li:marker:text-gray-600 prose-li:marker:font-bold
                prose-strong:text-gray-900 prose-strong:font-bold
                prose-em:text-gray-700 prose-em:italic
                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline hover:prose-a:text-blue-800
                prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic
                prose-code:text-gray-800 prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded

                [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:pl-6 [&_ol]:my-6 [&_ol]:space-y-3
                [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:pl-6 [&_ul]:my-6 [&_ul]:space-y-3
                [&_li]:text-base [&_li]:text-gray-700 [&_li]:leading-relaxed [&_li]:mb-3 [&_li]:pl-3
                [&_li::marker]:text-gray-700 [&_li::marker]:font-semibold
                [&_.subtitle]:text-2xl [&_.subtitle]:font-bold [&_.subtitle]:text-gray-900 [&_.subtitle]:mb-6 [&_.subtitle]:leading-snug [&_.subtitle]:block
                [&_.lead]:text-lg [&_.lead]:font-semibold [&_.lead]:text-gray-800 [&_.lead]:mb-3
                [&_table]:!w-full [&_table]:table-auto
                md:[&_table]:w-auto
                [&_th]:border [&_th]:border-gray-300 [&_th]:px-2 [&_th]:py-2 [&_th]:text-left [&_th]:text-sm
                [&_td]:border [&_td]:border-gray-300 [&_td]:px-2 [&_td]:py-2 [&_td]:text-sm"
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
                    : 'border-2 border-[#D30013] text-[#D30013] min-w-10 w-9 h-9 group-hover:bg-[#D30013] group-hover:text-white group-hover:w-14'
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
                  className="text-left prose prose-lg max-w-none
                    prose-headings:font-bold prose-headings:text-gray-900 prose-headings:leading-tight
                    prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-6
                    prose-h2:text-2xl prose-h2:mb-6 prose-h2:mt-6 prose-h2:leading-snug
                    prose-h3:text-xl prose-h3:mb-4 prose-h3:mt-5
                    prose-h4:text-lg prose-h4:mb-3 prose-h4:mt-4
                    prose-p:text-base prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4 prose-p:mt-0
                    prose-ol:list-decimal prose-ol:ml-6 prose-ol:pl-6 prose-ol:mb-6 prose-ol:mt-4 prose-ol:space-y-3 prose-ol:text-gray-700
                    prose-ul:list-disc prose-ul:ml-6 prose-ul:pl-6 prose-ul:mb-6 prose-ul:mt-4 prose-ul:space-y-3 prose-ul:text-gray-700
                    prose-li:text-base prose-li:text-gray-700 prose-li:leading-relaxed prose-li:mb-3 prose-li:pl-3 prose-li:marker:text-gray-600 prose-li:marker:font-bold
                    prose-strong:text-gray-900 prose-strong:font-bold
                    prose-em:text-gray-700 prose-em:italic
                    prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline hover:prose-a:text-blue-800
                    prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic
                    prose-code:text-gray-800 prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded
                    [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:pl-6 [&_ol]:my-6 [&_ol]:space-y-3
                    [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:pl-6 [&_ul]:my-6 [&_ul]:space-y-3
                    [&_li]:text-base [&_li]:text-gray-700 [&_li]:leading-relaxed [&_li]:mb-3 [&_li]:pl-3
                    [&_li::marker]:text-gray-700 [&_li::marker]:font-semibold
                    [&_.subtitle]:text-2xl [&_.subtitle]:font-bold [&_.subtitle]:text-gray-900 [&_.subtitle]:mb-6 [&_.subtitle]:leading-snug [&_.subtitle]:block
                    [&_.lead]:text-lg [&_.lead]:font-semibold [&_.lead]:text-gray-800 [&_.lead]:mb-3
                    [&_table]:!w-full [&_table]:table-auto
                    md:[&_table]:w-auto
                    [&_th]:border [&_th]:border-gray-300 [&_th]:px-2 [&_th]:py-2 [&_th]:text-left [&_th]:text-sm
                    [&_td]:border [&_td]:border-gray-300 [&_td]:px-2 [&_td]:py-2 [&_td]:text-sm"
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
