import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

/**
 * SEOHead Component - Laravel Blade @section('opengraph') equivalent
 *
 * Converts Laravel Blade SEO template to React with react-helmet-async
 *
 * @param {Object} props
 * @param {string} props.title - Page title (required)
 * @param {string} props.description - Meta description
 * @param {string} props.image - OG image URL
 * @param {string} props.url - Canonical URL
 * @param {string} props.type - OG type (default: 'website')
 * @param {string} props.siteName - Site name
 * @param {string} props.locale - Page locale (default: 'en_US')
 * @param {string} props.keywords - Meta keywords
 *
 * @example
 * <SEOHead
 *   title="Sports | Dulwich College Singapore"
 *   description="Sports excellence at Dulwich College Singapore"
 *   image="https://example.com/sports.jpg"
 * />
 */
const SEOHead = ({
  title,
  description,
  image,
  url,
  type = 'website',
  siteName = 'Dulwich International Schools',
  locale = 'en_US',
  keywords
}) => {
  const location = useLocation();

  // Use provided values (no fallbacks - rely on SSR-injected meta tags)
  const pageUrl = url || `${window.location.origin}${location.pathname}${location.search}`;

  // Ensure image URL is absolute
  const getAbsoluteImageUrl = (imgUrl) => {
    if (!imgUrl) return null;

    // Already absolute
    if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://')) {
      return imgUrl;
    }

    // Relative path from CDN
    if (imgUrl.startsWith('/')) {
      return `${window.location.origin}${imgUrl}`;
    }

    return `${window.location.origin}/${imgUrl}`;
  };

  const absoluteImageUrl = getAbsoluteImageUrl(image);

  // Only render meta tags if values are provided (no fallbacks)
  // This allows SSR-injected meta tags to remain without being overridden
  if (!title && !description && !image) {
    return null;
  }

  return (
    <Helmet>
      {/* Basic Meta Tags - Only render if provided */}
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Canonical URL */}
      <link rel="canonical" href={pageUrl} />

      {/* Open Graph / Facebook / WhatsApp / LinkedIn - Only render if provided */}
      <meta property="og:url" content={pageUrl} />
      <meta property="og:type" content={type} />
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      {absoluteImageUrl && <meta property="og:image" content={absoluteImageUrl} />}
      {absoluteImageUrl && <meta property="og:image:secure_url" content={absoluteImageUrl} />}
      {title && <meta property="og:image:alt" content={title} />}
      {absoluteImageUrl && <meta property="og:image:width" content="1200" />}
      {absoluteImageUrl && <meta property="og:image:height" content="630" />}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />

      {/* Twitter Card - Only render if provided */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@DulwichColleges" />
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      {absoluteImageUrl && <meta name="twitter:image" content={absoluteImageUrl} />}
      {title && <meta name="twitter:image:alt" content={title} />}
    </Helmet>
  );
};

export default SEOHead;
