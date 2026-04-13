import React from 'react';

const ColoredBlock = ({ content }) => {
  const {
    'block-title': blockTitle,
    'block-copy': blockCopy,
    'bg-color': bgColor,
    'anchor-id': anchorId,
    'cta-type': ctaType,
    'cta-text': ctaText,
    'cta-link': ctaLink,
    'text-align': textAlign
  } = content;

  // Background color mapping
  const bgColorMap = {
    'bg-overlay-dark': 'bg-[#F5F5F5]',
    'bg-gray': 'bg-[#F5F5F5]',
    'bg-red': 'bg-[#9E1422]',
    'bg-blue': 'bg-[#1E3A8A]',
    'bg-green': 'bg-[#166534]',
    'bg-yellow': 'bg-[#9E1422]',
  };

  // Text alignment mapping
  const alignmentMap = {
    'left': 'text-left',
    'center': 'text-center',
    'right': 'text-right'
  };

  // Determine if this is a colored background (not grey/gray)
  const isColoredBg = bgColor && !['bg-grey', 'bg-gray'].includes(bgColor);

  // Get the background color class
  const backgroundClass = bgColorMap[bgColor] || 'bg-[#F5F5F5]';

  // Get text alignment class (default to left)
  const textAlignClass = alignmentMap[textAlign] || 'text-left';

  return (
    <section
      data-id={anchorId}
      className={`py-16 mt-[8%] md:py-24 px-4 mb-4 ${backgroundClass}`}
    >
      <div className="max-w-[1120px] mx-auto">
        {/* Grey/Gray Background - Simple Layout */}
        {!isColoredBg && (
          <div className={`max-w-[800px] mt-[-16%] bg-white rounded-lg shadow p-8 md:p-12 ${textAlignClass}`}>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-[#3C3C3B]">
              {blockTitle || 'Grey Coloured Block'}
            </h2>
            <p className="text-lg text-[#3C3C3B] leading-relaxed mb-8">
              {blockCopy || 'Block Copy Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'}
            </p>

            {/* CTA Button - Only show if ctaType is not 'none' AND ctaLink exists */}
            {ctaType !== 'none' && ctaLink && ctaText && (
              <div className={textAlign === 'center' ? 'flex justify-center' : textAlign === 'right' ? 'flex justify-end' : ''}>
                <a
                  href={ctaLink}
                  className="inline-flex items-center gap-2 bg-[#D30013] hover:bg-[#8B2B2B] text-white font-semibold px-6 py-3 rounded-md transition-colors duration-200"
                >
                  {ctaText}
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        )}

        {/* Colored Background - With White Content Box */}
        {isColoredBg && (
          <div className={`max-w-[800px] mt-[-16%] bottom bottom-[#F2EDE9] bg-[#FCFAF9] rounded-lg shadow-lg p-8 md:p-12 ${textAlignClass}`}>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-[#3C3C3B]">
              {blockTitle || 'Red Coloured Block'}
            </h2>
            <p className="text-lg text-[#3C3C3B] leading-relaxed mb-8">
              {blockCopy || 'Block Copy Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'}
            </p>

            {/* CTA Button - Only show if ctaType is not 'none' AND ctaLink exists */}
            {ctaType !== 'none' && ctaLink && ctaText && (
              <div className={textAlign === 'center' ? 'flex justify-center' : textAlign === 'right' ? 'flex justify-end' : ''}>
                <a
                  href={ctaLink}
                  className="inline-flex items-center gap-2 bg-[#D30013] hover:bg-[#8B2B2B] text-white font-semibold px-6 py-3 rounded-md transition-colors duration-200"
                >
                  {ctaText}
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ColoredBlock;
