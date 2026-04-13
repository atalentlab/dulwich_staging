import React from 'react';

/**
 * LinkPreviewCard Component
 * Displays a WhatsApp/Facebook-style link preview card
 * Similar to social media link previews
 *
 * @param {Object} props
 * @param {string} props.title - Preview title
 * @param {string} props.description - Preview description
 * @param {string} props.image - Preview image URL
 * @param {string} props.url - Link URL
 * @param {string} props.domain - Domain name to display
 */
const LinkPreviewCard = ({
  title,
  description,
  image,
  url,
  domain
}) => {
  // Extract domain from URL if not provided
  const displayDomain = domain || (url ? new URL(url).hostname : '');

  return (
    <div className="link-preview-card max-w-md mx-auto bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Preview Image */}
      {image && (
        <div className="relative w-full h-48 bg-gray-100">
          <img
            src={image}
            alt={title || 'Preview'}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Preview Content */}
      <div className="p-4">
        {/* Domain/URL */}
        {displayDomain && (
          <div className="flex items-center mb-2">
            <svg
              className="w-4 h-4 text-gray-400 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            <span className="text-xs text-gray-500 uppercase">{displayDomain}</span>
          </div>
        )}

        {/* Title */}
        {title && (
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
            {title}
          </h3>
        )}

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 line-clamp-3 mb-3">
            {description}
          </p>
        )}

        {/* Link Button */}
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm font-medium text-[#00704A] hover:text-[#005A3C] transition-colors"
          >
            Visit Link
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
};

export default LinkPreviewCard;
