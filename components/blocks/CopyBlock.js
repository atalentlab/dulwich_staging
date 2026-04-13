import React, { useMemo } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
// Custom arrow components for the slider (22x44 size)
const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center text-[#d30013] hover:text-[#a0000f] transition-colors"
    style={{ left: '-50px', width: '22px', height: '44px' }}
    aria-label="Previous slide"
  >
    <svg width="22" height="44" viewBox="0 0 22 44" fill="none">
      <path d="M16 4L6 22L16 40" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center text-[#d30013] hover:text-[#a0000f] transition-colors"
    style={{ right: '-50px', width: '22px', height: '44px' }}
    aria-label="Next slide"
  >
    <svg width="22" height="44" viewBox="0 0 22 44" fill="none">
      <path d="M6 4L16 22L6 40" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  </button>
);

/**
 * CopyBlock Component
 * Displays HTML text content with optional contextual link card
 * Supports HTML responses from API while maintaining the same UI and formatting
 * Detects and renders Swiper/slider HTML content as interactive sliders
 */
const CopyBlock = ({ content }) => {
  const {
    style,
    copy,
    html,
    'contextual-link': contextualLink,
    'contextual-link-data': contextualLinkData,
    'contextual-image': contextualImageProp,
    'contextual-title': contextualTitleProp,
    'contextual-description': contextualDescriptionProp,
    'contextual-button-text': contextualButtonTextProp,
    'contextual-button-link': contextualButtonLinkProp,
    'anchor-id': anchorId,
    
  } = content;
  const isChineseVersion = window.location.pathname.startsWith('/zh');
  // Derive contextual card fields — prefer explicit props, fall back to contextual-link-data
  const contextualImage = contextualImageProp || contextualLinkData?.header_image;
  const contextualTitle = contextualTitleProp || contextualLinkData?.title;
  const contextualDescription = contextualDescriptionProp || contextualLinkData?.intro;
  const contextualButtonText = contextualButtonTextProp || (
    contextualLinkData
      ? isChineseVersion ? '阅读更多' : 'Read More'
      : null
  );
  const contextualButtonLink = contextualButtonLinkProp || contextualLinkData?.url;

  // Skip no-image placeholders
  const isNoImage = contextualImage && (contextualImage.includes('no-image.gif') || contextualImage.includes('placeholders/no-image'));
  const resolvedImage = isNoImage ? null : contextualImage;

  // Use html field if available, otherwise fall back to copy field
  // This ensures HTML responses are properly displayed with all tags and formats preserved
  const htmlContent = html || copy || '';

  // Helper function to detect if content contains slider/swiper markup
  const isSliderContent = (content) => {
    if (!content || typeof content !== 'string') return false;
    return content.includes('swiper') ||
           content.includes('swiper-slide') ||
           content.includes('swiper-wrapper') ||
           content.includes('custom-swiper');
  };

  // Helper function to extract image URLs from HTML content
  const extractImagesFromHtml = (htmlString) => {
    if (!htmlString) return [];
    const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
    const images = [];
    let match;
    while ((match = imgRegex.exec(htmlString)) !== null) {
      images.push(match[1]);
    }
    return images;
  };

  // Check if the HTML content contains slider markup and extract images
  const hasSliderContent = useMemo(() => isSliderContent(htmlContent), [htmlContent]);
  const sliderImages = useMemo(() => {
    if (hasSliderContent) {
      return extractImagesFromHtml(htmlContent);
    }
    return [];
  }, [htmlContent, hasSliderContent]);

  // Slider settings for react-slick
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    dotsClass: 'slick-dots custom-dots',
  };

  // Enhanced prose classes for comprehensive HTML tag styling
  const proseClasses = `prose prose-lg max-w-none
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
    [&_.lead]:text-lg [&_.lead]:font-semibold [&_.lead]:text-gray-800 [&_.lead]:mb-3`;

  // Style classes based on 'style' property
  const styleClasses = {
    default: 'py-8 sm:py-6 lg:py-6 px-4 sm:px-6 lg:px-4 bg-white',
    centered: 'py-8 sm:py-6 lg:py-6 px-4 sm:px-6 lg:px-4 bg-white text-center',
    highlighted: 'py-8 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-4 bg-gray-50',
    dark: 'py-8 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-4 bg-gray-900 text-white',
    full_width: 'py-8 sm:py-6 lg:py-6 px-4 sm:px-6 lg:px-4 bg-white',
  };

  const containerClass = styleClasses[style] || styleClasses.default;

  // Check if we have contextual card data
  const hasContextualCard = contextualLink || contextualImage || contextualTitle;

  return (
    <section data-id={anchorId} className={containerClass}>
      <div className="max-w-[1120px] mx-auto">
        {/* Two-column layout when contextual card exists */}
        {hasContextualCard ? (
          <div className="grid grid-cols-1 min-[1024px]:grid-cols-[500px_1fr] min-[1180px]:grid-cols-[736px_1fr] gap-16 lg:gap-18 items-start justify-between">
            {/* Left column - Text content (736px) */}
            <div className="text-left">
              <div
                className={proseClasses}
                style={{
                  lineHeight: '1.5',
                  color: '#374151'
                }}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            </div>

            {/* Right column - Contextual card */}
            <div className="text-left bg-[#FFFFFF] border border-[#F2EDE9] rounded-lg shadow min-w-[256px] overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
              {resolvedImage ? (
                isSliderContent(resolvedImage) ? (
                  <div className="slider-container">
                    <Slider {...sliderSettings}>
                      {extractImagesFromHtml(resolvedImage).map((imgSrc, index) => (
                        <div key={index}>
                          <div className="flex justify-center items-center">
                            <img
                              src={imgSrc}
                              alt={`Slide ${index + 1}`}
                              className="w-full h-[150px] object-cover"
                            />
                          </div>
                        </div>
                      ))}
                    </Slider>
                    <style>{`
                      .custom-dots {
                        bottom: -30px;
                      }
                      .custom-dots li button:before {
                        font-size: 10px;
                        color: #ccc;
                      }
                      .custom-dots li.slick-active button:before {
                        color: #d30013;
                      }
                    `}</style>
                  </div>
                ) : (
                  <img
                    src={resolvedImage}
                    alt={contextualTitle || 'Contextual image'}
                    className="w-full h-auto object-cover"
                  />
                )
              ) : (
                <div className="w-full aspect-[5/3] bg-gray-100" />
              )}

              <div className="p-4">
                {contextualTitle && (
                  <h3 className="text-xl font-bold mb-3 text-gray-900 text-left">
                    {contextualTitle}
                  </h3>
                )}

                {contextualDescription && (
                  <p className="text-[#3C3C3B] leading-relaxed mb-4 text-left">
                    {contextualDescription}
                  </p>
                )}

                {contextualButtonLink && (
                  <a
                    href={contextualButtonLink}
                    className="text-[12px] inline-block border border-[#D30013] text-[#D30013] hover:bg-[#D30013] hover:text-white font-medium px-3 py-2 rounded-lg transition-colors duration-200"
                  >
                    {contextualButtonText}
                  </a>
                )}
              </div>
            </div>
          </div>
        ) : (

          <div className={`${style === 'full_width' ? 'max-w-[1120px]' : 'max-w-[736px]'} w-[100%] h-[100%] mx-0 text-left overflow-hidden`}>
            {hasSliderContent && sliderImages.length > 0 ? (
              /* Render slider when content contains swiper markup */
              <div className="slider-container px-12 py-8 ">
                <Slider {...sliderSettings}>
                  {sliderImages.map((imgSrc, index) => (
                    <div key={index} className="px-2">
                      <div className="flex justify-center items-center">
                        <img
                          src={imgSrc}
                          alt={`Slide ${index + 1}`}
                          className="max-w-[650px] w-full h-auto object-cover mx-auto rounded-lg"
                        />
                      </div>
                    </div>
                  ))}
                </Slider>
                <style>{`
                  .custom-dots {
                    bottom: -30px;
                  }
                  .custom-dots li button:before {
                    font-size: 10px;
                    color: #ccc;
                  }
                  .custom-dots li.slick-active button:before {
                    color: #d30013;
                  }
                `}</style>
              </div>
            ) : (
              <>
                <div
                  className={`${proseClasses} copy-block-content`}
                  style={{
                    lineHeight: '1.5',
                    color: '#374151'
                  }}
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default CopyBlock;
