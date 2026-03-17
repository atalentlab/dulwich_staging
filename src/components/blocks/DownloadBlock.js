import React from 'react';
import Icon from '../Icon';

/**
 * DownloadBlock Component
 * Displays downloadable files with CTA buttons in a card layout
 *
 * API Response:
 * {
 *   "type": "download",
 *   "content": {
 *     "title": "Terms and Conditions",
 *     "description": "Full enrolment and admissions terms...",
 *     "anchor-id": "downloads",
 *     "0": {
 *       "cta-copy": "Terms & Conditions",
 *       "download": "/blocks/.../file.pdf",
 *       "weight": "0"
 *     }
 *   }
 * }
 */
const DownloadBlock = ({ content }) => {
  const {
    title,
    description,
    'anchor-id': anchorId
  } = content;

  // Convert object with numeric keys to array, excluding non-download fields
  const downloads = Object.entries(content)
    .filter(([key, item]) => !isNaN(key) && item && item.download)
    .map(([, item]) => item);

  // Sort by weight if available
  downloads.sort((a, b) => (parseInt(a.weight) || 0) - (parseInt(b.weight) || 0));

  if (downloads.length === 0) {
    return null;
  }

  return (
    <section data-id={anchorId} className="py-12 px-4 bg-white">
      <div className="max-w-[1120px] mx-auto">
        <div className="bg-[#FAF7F5] rounded-lg p-8 lg:p-12">
          {/* Title */}
          {title && (
            <h2 className="text-3xl lg:text-4xl font-bold text-[#8B1E1E] mb-6 text-left">
              {title}
            </h2>
          )}

          {/* Description */}
          {description && (
            <p className="text-base text-gray-700 mb-8 text-left leading-relaxed max-w-2xl">
              {description}
            </p>
          )}

          {/* Download Buttons - 2 Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {downloads.map((item, index) => {
              const downloadUrl = item.download?.startsWith('http')
                ? item.download
                : `https://www.dulwich.atalent.xyz${item.download}`;

              return (
                <a
                  key={index}
                  href={downloadUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 px-4 py-2.5 bg-white border border-[#D30013] text-[#D30013] rounded-lg transition-all duration-300 font-semibold text-base hover:bg-[#FFF5F5] hover:shadow-lg hover:scale-[1.02] w-full"
                >
                  {/* Download Icon */}
                  <Icon icon="Icon---Download" size={20} color="#D30013" className="flex-shrink-0" />
                  {item['cta-copy'] || 'Download File'}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadBlock;
