import React from 'react';

/**
 * TextBlock Component
 * A flexible text and image layout component similar to the Dulwich "Founded by parents" section
 *
 * Features:
 * - Two-column layout with text and image
 * - Supports HTML rendering in all text fields
 * - Customizable button
 * - Responsive design
 * - Image position (left/right)
 *
 * Props:
 * - eyebrow: Small text above the title (e.g., "DULWICH COLLEGE INTERNATIONAL")
 * - title: Main heading (supports HTML for colored text)
 * - subtitle: Subheading text
 * - content: Array of paragraph texts
 * - attribution: Attribution text (italicized)
 * - buttonText: Text for the CTA button
 * - buttonLink: URL for the CTA button
 * - image: Image URL
 * - imageAlt: Alt text for image
 * - imagePosition: 'left' or 'right' (default: 'right')
 * - backgroundColor: Background color (default: 'white')
 * - anchorId: Optional anchor ID for section
 */
const TextBlock = ({
  eyebrow,
  title,
  subtitle,
  content = [],
  attribution,
  buttonText,
  buttonLink,
  onButtonClick,
  image,
  imageAlt = '',
  imagePosition = 'right',
  backgroundColor = 'white',
  anchorId
}) => {
  const handleButtonClick = (e) => {
    if (onButtonClick) {
      e.preventDefault();
      onButtonClick();
    }
  };

  return (
    <section
      id={anchorId || undefined}
      className="px-4 mt-12"
      style={{ backgroundColor }}
    >
      <style>{`
        .text-block-content p {
          margin-bottom: 1rem;
        }
        .text-block-content p:last-child {
          margin-bottom: 0;
        }
        .text-block-content strong {
          font-weight: 600;
        }
        .text-block-content em {
          font-style: italic;
        }
      `}</style>

      <div className="w-full relative">
        <div className="flex flex-col lg:flex-row gap-0 items-center">
          {/* Text Content - Left side with header alignment */}
          <div className="flex-1 text-left px-4" style={{ marginLeft: 'calc(-593px + 50vw)', maxWidth: '593px' }}>
            {/* Eyebrow */}
            {eyebrow && (
              <div className="text-xs font-bold tracking-wider text-gray-700 mb-4 uppercase">
                {eyebrow}
              </div>
            )}

            {/* Title */}
            {title && (
              <h2
                className="text-4xl lg:text-5xl font-bold mb-6 text-block-content"
                dangerouslySetInnerHTML={{ __html: title }}
              />
            )}

            {/* Subtitle */}
            {subtitle && (
              <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-6">
                {subtitle}
              </h3>
            )}

            {/* Content Paragraphs */}
            {content && content.length > 0 && (
              <div className="space-y-4 mb-6">
                {content.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-base lg:text-lg text-gray-700 leading-relaxed text-block-content"
                    dangerouslySetInnerHTML={{ __html: paragraph }}
                  />
                ))}
              </div>
            )}

            {/* Attribution */}
            {attribution && (
              <p className="text-base italic text-gray-600 mb-8">
                {attribution}
              </p>
            )}

            {/* CTA Button */}
            {buttonText && (
              <a
                href={buttonLink || '#'}
                onClick={handleButtonClick}
                className="inline-block px-8 py-4 bg-[#D30013] text-white font-semibold text-base rounded-md hover:bg-[#B01810] hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
              >
                {buttonText}
              </a>
            )}
          </div>

          {/* Image - Extends to right edge */}
          {image && (
            <div className="flex-1 min-w-[500px]">
              <img
                src={image}
                alt={imageAlt}
                className="w-full h-auto object-cover"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TextBlock;
