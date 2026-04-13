import React from 'react';

/**
 * WhatsAppPreviewCard Component
 * Displays a WhatsApp-style link preview card
 * Matches the exact design of WhatsApp link previews
 *
 * @param {Object} props
 * @param {string} props.title - Preview title
 * @param {string} props.description - Preview description
 * @param {string} props.image - Preview image URL
 * @param {string} props.url - Link URL
 * @param {string} props.domain - Domain name to display (auto-extracted from url if not provided)
 */
const WhatsAppPreviewCard = ({
  title,
  description,
  image,
  url,
  domain
}) => {
  // Extract domain from URL if not provided
  const displayDomain = domain || (url ? new URL(url).hostname.replace('www.', '') : '');

  return (
    <div className="whatsapp-preview-container max-w-md mx-auto">
      {/* WhatsApp Message Bubble */}
      <div className="bg-[#025144] rounded-lg overflow-hidden shadow-lg">
        {/* Preview Image */}
        {image && (
          <div className="relative w-full bg-gray-200">
            <img
              src={image}
              alt={title || 'Preview'}
              className="w-full h-auto object-cover"
              style={{ maxHeight: '300px' }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Preview Content */}
        <div className="p-4 bg-[#025144] text-white">
          {/* Title */}
          {title && (
            <h3 className="text-base font-semibold mb-2 leading-tight text-white">
              {title}
            </h3>
          )}

          {/* Description */}
          {description && (
            <p className="text-sm text-gray-200 leading-relaxed mb-3 line-clamp-3">
              {description}
            </p>
          )}

          {/* Domain/Link with Icon */}
          {displayDomain && (
            <div className="flex items-center text-xs text-gray-300">
              <svg
                className="w-3 h-3 mr-1.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="uppercase">{displayDomain}</span>
            </div>
          )}
        </div>
      </div>

      {/* WhatsApp Timestamp (Optional) */}
      <div className="text-right mt-1 px-2">
        <span className="text-xs text-gray-500">
          {new Date().toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })}
        </span>
      </div>
    </div>
  );
};

export default WhatsAppPreviewCard;
