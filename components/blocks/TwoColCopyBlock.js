import React from 'react';

/**
 * TwoColCopyBlock Component
 * Displays HTML text content in a two-column layout
 * Supports HTML responses from WYSIWYG editor while maintaining the same UI and formatting
 */
const TwoColCopyBlock = ({ content }) => {
  const {
    col = [],
    style,
    'anchor-id': anchorId,
  } = content;

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
    default: 'py-16 px-4 bg-white',
    centered: 'py-16 px-4 bg-white text-center',
    highlighted: 'py-16 px-4 bg-gray-50',
    dark: 'py-16 px-4 bg-gray-900 text-white',
    full_width: 'py-16 px-4 bg-white',
  };

  const containerClass = styleClasses[style] || styleClasses.default;

  return (
    <section data-id={anchorId} className={containerClass}>
      <style>
        {`
          .prose span > strong {
            color: inherit;
          }
        `}
      </style>
      <div className="max-w-[1120px] mx-auto">
        <div className="grid grid-cols-1 text-left md:grid-cols-2 gap-8">
          {col.map((column, index) => {
            // Use html field if available, otherwise fall back to copy field
            // This ensures HTML responses are properly displayed with all tags and formats preserved
            const htmlContent = column.html || column.copy || '';

            return (
              <div key={index}>
                {htmlContent && typeof htmlContent === 'string' ? (
                  // Render HTML string directly with all tags and formats
                  <div
                    className={proseClasses}
                    style={{
                      lineHeight: '1.7',
                      color: '#374151'
                    }}
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                  />
                ) : Array.isArray(htmlContent) ? (
                  // Original array rendering for backward compatibility
                  <div className={proseClasses}>
                    {htmlContent.map((paragraph, pIndex) => (
                      <p key={`col-${index}-p-${pIndex}`} className="text-base text-gray-700 leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TwoColCopyBlock;
