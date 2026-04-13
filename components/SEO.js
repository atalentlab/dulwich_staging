import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

/**
 * SEO Component for Dynamic Meta Tags
 * Handles Open Graph, Twitter Cards, and standard meta tags
 *
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description
 * @param {string} props.image - OG image URL (use header_image from API, fallback to cover_image)
 * @param {string} props.imageAlt - Image alt text
 * @param {string} props.type - OG type (default: 'website')
 * @param {string} props.siteName - Site name (default: 'Dulwich International Schools')
 * @param {string} props.twitterCard - Twitter card type (default: 'summary_large_image')
 * @param {string} props.twitterSite - Twitter handle (default: '@DulwichColleges')
 * @param {string} props.keywords - Meta keywords
 * @param {string} props.author - Page author
 */
const SEO = ({
  title,
  description,
  image,
  imageAlt,
  type = 'website',
  siteName = 'Dulwich International Schools',
  twitterCard = 'summary_large_image',
  twitterSite = '@DulwichColleges',
  keywords,
  author
}) => {
  const location = useLocation();
  // Use production domain for canonical URL, fallback to current URL
  const siteUrl = process.env.REACT_APP_SITE_URL || window.location.origin;
  const currentUrl = `${siteUrl}${location.pathname}${location.search}`;

  // Ensure image URL is absolute
  const getAbsoluteImageUrl = (imgUrl) => {
    if (!imgUrl) return null;
    if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://')) {
      return imgUrl;
    }
    // If it's a relative path from assets.dulwich.org
    if (imgUrl.startsWith('/')) {
      return `https://assets.dulwich.org${imgUrl}`;
    }
    return `https://assets.dulwich.org/${imgUrl}`;
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
      {author && <meta name="author" content={author} />}

      {/* Open Graph Tags (Facebook, LinkedIn, WhatsApp) - Only render if provided */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:url" content={currentUrl} />
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      {absoluteImageUrl && <meta property="og:image" content={absoluteImageUrl} />}
      {absoluteImageUrl && <meta property="og:image:secure_url" content={absoluteImageUrl} />}
      {imageAlt && <meta property="og:image:alt" content={imageAlt} />}
      {absoluteImageUrl && <meta property="og:image:width" content="1200" />}
      {absoluteImageUrl && <meta property="og:image:height" content="630" />}
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Tags - Only render if provided */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content={twitterSite} />
      <meta name="twitter:creator" content={twitterSite} />
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      {absoluteImageUrl && <meta name="twitter:image" content={absoluteImageUrl} />}
      {imageAlt && <meta name="twitter:image:alt" content={imageAlt} />}

      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <link rel="canonical" href={currentUrl} />
    </Helmet>
  );
};

export default SEO;
