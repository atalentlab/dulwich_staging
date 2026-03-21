import React from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://cms.dulwich.org';

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
                      className="text-gray-700 leading-relaxed mb-6"
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
