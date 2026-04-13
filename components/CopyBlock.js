import React from 'react';
import Icon from './Icon';

/**
 * CopyBlock Component
 * A reusable content block with a colored background and white card overlay
 *
 * Props:
 * - title: The heading text
 * - content: Array of paragraph texts
 * - buttonText: CTA button text
 * - buttonLink: CTA button link/action
 * - backgroundColor: Background color (default: Dulwich red)
 * - onButtonClick: Optional callback for button click
 */

function CopyBlock({
  title = "Join the Dulwich Family",
  content = [],
  buttonText = "Check Eligibility",
  buttonLink = "#",
  backgroundColor = "#9E1422",
  onButtonClick
}) {

  const handleButtonClick = (e) => {
    if (onButtonClick) {
      e.preventDefault();
      onButtonClick();
    }
  };

  return (
    <section className="relative pb-16 lg:pb-16 px-4 lg:px-8 mt-16" style={{ backgroundColor }}>
      <div className="max-w-[1120px] mx-auto">
        <div className="relative">
          {/* White Content Card */}  
          <div className="bg-[#F2EDE9] rounded-2xl shadow-xl p-8 lg:p-12 max-w-3xl text-left relative bottom-20">
            {/* Title */}
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              {title}
            </h2>

            {/* Content Paragraphs */}
            <div className="space-y-4 mb-8">
              {content && content.length > 0 && typeof content === 'string' ? (
                // Render HTML string directly with all tags and formats
                <div
                  className="html-content prose prose-lg max-w-none
                    prose-headings:font-bold prose-headings:text-gray-900 prose-headings:leading-tight
                    prose-h1:text-3xl prose-h1:mb-4 prose-h1:mt-6
                    prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-6 prose-h2:leading-snug
                    prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-4
                    prose-h4:text-lg prose-h4:mb-2 prose-h4:mt-3
                    prose-p:text-base prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4 prose-p:mt-0
                    prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4 prose-ol:mt-4 prose-ol:space-y-2
                    prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4 prose-ul:mt-4 prose-ul:space-y-2
                    prose-li:text-base prose-li:text-gray-700 prose-li:leading-relaxed prose-li:mb-2
                    prose-strong:text-gray-900 prose-strong:font-bold
                    prose-em:text-gray-700 prose-em:italic
                    prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                    prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic
                    prose-code:text-gray-800 prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded
                    [&_.subtitle]:text-2xl [&_.subtitle]:font-bold [&_.subtitle]:text-gray-900 [&_.subtitle]:mb-6 [&_.subtitle]:leading-snug
                    [&_.lead]:text-lg [&_.lead]:font-semibold [&_.lead]:text-gray-800"
                  style={{
                    lineHeight: '1.6',
                    color: '#374151'
                  }}
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              ) : (
                // Original array rendering for backward compatibility
                content.map((paragraph, index) => (
                  <p key={`copy-block-p-${index}`} className="text-base lg:text-m text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))
              )}
            </div>

            {/* CTA Button */}
            {buttonText && (
              <a
                href={buttonLink}
                onClick={handleButtonClick}
                className="group inline-flex items-center gap-2 px-6 py-3 text-base font-semibold text-white rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
                style={{ backgroundColor: '#D30013' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#B8000F'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#D30013'; }}
              >
                {buttonText}
                <Icon icon="Icon-Arrow" size={18} color="white" className="transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CopyBlock;
