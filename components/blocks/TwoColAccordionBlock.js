import React from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://cms.dulwich.atalent.xyz';

/**
 * TwoColAccordionBlock Component
 * Displays card items in a two-column layout with images and content
 *
 * API Response:
 * {
 *   "type": "2-col-accordion",
 *   "content": {
 *     "col": [
 *       {
 *         "title": "Test block 12",
 *         "image": "/blocks/.../image.jpg",
 *         "cta": "Test block",
 *         "cta_name": "test",
 *         "copy": "<p>Lorem Ipsum...</p>"
 *       }
 *     ]
 *   }
 * }
 */
const TwoColAccordionBlock = ({ content }) => {
  const { col = [] } = content;

  if (col.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-[1120px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {col.map((item, index) => {
            const imageUrl = item.image?.startsWith('http')
              ? item.image
              : `${API_BASE_URL}${item.image}`;

            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden group relative"
              >
                {/* Image */}
                {item.image && (
                  <div className="overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={item.title}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}

                {/* Content Container */}
                <div className="p-8 text-left">
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {item.title}
                  </h3>

                  {/* Description */}
                  {item.copy && (
                    <div
                      className="prose prose-lg max-w-none mb-6
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
                      dangerouslySetInnerHTML={{ __html: item.copy }}
                    />
                  )}

                  {/* CTA Link */}
                  {item.cta && (
                    <a
                      href={item.cta}
                      className="inline-flex items-center text-red-600 font-semibold hover:text-red-700 transition-colors group/link absolute bottom-[20px]"
                    >
                      {item.cta_name}
                      <svg
                        className="w-5 h-5 ml-2 transition-transform duration-200 group-hover/link:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TwoColAccordionBlock;
