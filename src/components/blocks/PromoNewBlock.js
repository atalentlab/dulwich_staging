import React from 'react';

/**
 * PromoNewBlock Component
 * Promotional block with text and image layout.
 * Content is truncated at 150 words with "..." if it exceeds the limit.
 */
const WORD_LIMIT = 120;

// Truncate plain text from HTML to word limit, return as plain text + "..."
const truncateContent = (html, limit) => {
  if (!html) return '';
  const div = document.createElement('div');
  div.innerHTML = html;
  const text = div.textContent || div.innerText || '';
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= limit) return html;
  return '<p>' + words.slice(0, limit).join(' ') + '...</p>';
};

const getCtaUrl = (content) => {
  const ctaLink = content['cta-link'];
  if (ctaLink) {
    if (ctaLink.startsWith('http')) return ctaLink;
    return ctaLink.startsWith('/') ? ctaLink : `/${ctaLink}`;
  }
  return content['contextual-link-data']?.url || null;
};

const PromoNewBlock = ({ content }) => {
  if (!content) return null;

  const {
    eyebrow,
    grey_heading,
    red_heading,
    content: htmlContent,
    'cta-text': ctaText,
    sc_image,
    'anchor-id': anchorId
  } = content;

  const ctaLink = getCtaUrl(content);

  return (
    <section
      data-id={anchorId}
      className="pl-4 mt-4 mb-4 md:mt-12 md:mb-10"
    >
      <div className="w-full relative">
        <div className="flex flex-col lg:flex-row gap-0 items-start">
          {/* Text Content - Left side with header alignment */}
          <div className="flex-1 text-left px-4 lg:pr-12 lg:ml-[calc(-593px+50vw)] lg:max-w-[593px]">
            {/* Eyebrow */}
            {eyebrow && (
              <h3 className="font-['Figtree'] space-y-3 font-bold text-[12px] text-left leading-[24px] tracking-[1.32px] letter-spacing: 1.32px;
 uppercase text-[#3c3c3b] opacity-100">
              {eyebrow}
              </h3>
            )}

            {/* Red Heading (Main Title) */}
            {red_heading && (
              <h2 className="font-['Figtree'] font-extrabold text-left text-[#9E1422] mt-3 opacity-100
                text-[32px] leading-[40px] tracking-[-0.8px]
                sm:text-[40px] sm:leading-[50px] sm:tracking-[-1px]
                md:text-[50px] md:leading-[60px] md:tracking-[-1.25px]
              ">
              {/* <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[50px] font-bold mb-2 text-[#9E1422] leading-[2.8rem] md:leading-[2.8rem] lg:leading-[3.2rem]"> */}
                {red_heading}
              </h2>
            )}

            {/* Grey Heading (Subtitle) */}
            {grey_heading && (
              <h2 className="font-['Figtree'] font-extrabold text-left text-[#3C3737] mb-3 opacity-100
              text-[32px] leading-[40px] tracking-[-0.8px]
              sm:text-[40px] sm:leading-[50px] sm:tracking-[-1px]
              md:text-[50px] md:leading-[60px] md:tracking-[-1.25px]
            ">
                {grey_heading}
              </h2>
            )}

            {/* HTML Content — truncated at 150 words with ... */}
            {htmlContent && (
              <div
                className="text-base text-[#3C3737] leading-relaxed mb-8 mt-6 [&_p]:mb-4 [&_p]:leading-[1.4] [&_p:last-child]:mb-0 [&_strong]:font-[700] [&_em]:italic"
                dangerouslySetInnerHTML={{ __html: truncateContent(htmlContent, WORD_LIMIT) }}
              />
            )}

            {/* CTA Button */}
            {ctaText && ctaLink && (
              <a
                href={ctaLink} 
                className="inline-block px-6 py-3 bg-[#D30013] text-white font-medium text-base rounded-lg hover:bg-[#B01810] hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                target={ctaLink.startsWith('http') ? '_blank' : '_self'}
                rel={ctaLink.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                {ctaText}
              </a>
            )}
          </div>

          {/* Image - Extends to right edge */}
          {sc_image && (
            <div className="flex-1 w-full lg:min-w-[500px] pr-4 lg:pr-0 mt-8 lg:mt-0">
              <img
                src={sc_image}
                alt={red_heading || eyebrow || 'Promotional image'}
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

export default PromoNewBlock;
