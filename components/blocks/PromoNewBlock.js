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
                className="prose prose-lg max-w-none mb-8 mt-6
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
                  [&_.lead]:text-lg [&_.lead]:font-semibold [&_.lead]:text-gray-800 [&_.lead]:mb-3"
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
