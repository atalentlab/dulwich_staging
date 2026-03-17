import React from 'react';

/**
 * SingleImageBlock Component
 * Displays a single image with optional title and caption
 * Supports 3 width options:
 * - full-width: Full 12-Col Span (1600px W x 650px H min)
 * - cropped: Cropped (1600px W x 650px H min)
 * - original: Original Image (1600px W max x No limit H)
 */
const SingleImageBlock = ({ content }) => {
  const {
    title,
    title1,
    title2,
    caption,
    alignment,
    image,
    'image_description': imageDescription,
    'anchor-id': anchorId,
    eyebrow_text,
    'cta-text': ctaText,
    'cta-type': ctaType,
    'cta-link': ctaLinkRaw,
    'contextual-link-data': contextualLinkData,
  } = content;

  // Resolve CTA URL: cta-link first, then contextual-link-data.url
  const ctaLink = (() => {
    if (ctaLinkRaw) return ctaLinkRaw.startsWith('http') ? ctaLinkRaw : `https://${ctaLinkRaw}`;
    return contextualLinkData?.url || null;
  })();

  // Use title1/title2 if present, fall back to title
  const headingLine1 = title1 || title || null;
  const headingLine2 = title2 || null;

  // Construct full image URL
  const imageUrl = image?.startsWith('http') ? image : `https://www.dulwich.atalent.xyz${image}`;

  // Determine if full-width layout
  const isFullWidth = alignment === 'full-width' || alignment === 'full';

  return (
    <section data-id={anchorId} className="py-12 px-4 bg-white">
      <div className={isFullWidth ? 'w-full' : 'max-w-[1120px] mx-auto'}>
        {/* Image container with optional title overlay */}
        <div className="relative">
          <img
            src={imageUrl}
            alt={imageDescription || caption || title || 'Image'}
            className={`w-full h-auto rounded-lg ${
              alignment === 'original' ? 'max-w-[1600px] mx-auto' : ''
            } ${
              alignment === 'cropped' ? 'max-w-[1600px] mx-auto aspect-[1600/650] object-cover' : ''
            } ${
              isFullWidth ? 'object-cover' : ''
            }`}
            loading="lazy"
          />

          {/* Title overlay on image (if exists) */}
          {(headingLine1 || eyebrow_text || ctaText) && (
            <div className="max-w-[1120px] m-auto absolute inset-0 flex items-center justify-start px-4 md:px-8">
              <div className="text-left">
                {eyebrow_text && (
                  <p className="text-white text-xs md:text-sm font-bold tracking-[2px] uppercase mb-4 drop-shadow-lg">
                    {eyebrow_text}
                  </p>
                )}
                {headingLine1 && (
                  <h2 className="text-2xl md:text-[50px] lg:text-[64px] font-extrabold text-white drop-shadow-lg leading-tight">
                    {headingLine1}
                  </h2>
                )}
                {headingLine2 && (
                  <h2 className="text-2xl md:text-[50px] lg:text-[64px] font-extrabold text-white drop-shadow-lg leading-tight mb-6">
                    {headingLine2}
                  </h2>
                )}
                {!headingLine2 && headingLine1 && <div className="mb-6" />}
                {ctaText && ctaLink && (
                  <a
                    href={ctaLink}
                    className="inline-block px-8 py-3 bg-[#D30013] text-white font-bold text-base md:text-[16px] rounded-lg hover:bg-[#B01810] transition-all duration-300 shadow-lg"
                    target={ctaType === 'link' ? '_blank' : '_self'}
                    rel={ctaType === 'link' ? 'noopener noreferrer' : undefined}
                  >
                    {ctaText}
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Full 12-Col Span label for full-width images */}
          {/* {isFullWidth && (
            <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white text-xs px-3 py-1 rounded">
              Full 12-Col Span
            </div>
          )} */}
        </div>

        {/* Title below image (only if not showing in overlay) */}
        {headingLine1 && !(eyebrow_text || ctaText) && (
          <h1 className="max-w-[1120px] m-auto text-2xl md:text-3xl font-bold mt-6 text-gray-900">
            {headingLine1}
            {headingLine2 && <span className="block">{headingLine2}</span>}
          </h1>
        )}

        {/* Caption */}
        {caption && (
          <p className="max-w-[1120px] m-auto text-sm text-left px-7 text-[#3C3C3B] mt-6 leading-relaxed">
            {caption}
          </p>
        )}

        {/* Image description (fallback if no caption) */}
        {imageDescription && !caption && (
          <p className="max-w-[1120px] m-auto text-sm text-left px-7 text-[#3C3C3B] mt-6 leading-relaxed">
            {imageDescription}
          </p>
        )}
      </div>
    </section>
  );
};

export default SingleImageBlock;
