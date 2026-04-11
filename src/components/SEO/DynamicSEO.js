import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * DynamicSEO Component
 * Manages Open Graph and Twitter Card meta tags dynamically
 *
 * @param {Object} props - SEO properties
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description
 * @param {string} props.image - OG image URL (absolute URL required)
 * @param {string} props.url - Canonical page URL
 * @param {string} props.type - OG type (default: 'website')
 * @param {string} props.locale - Page locale (default: 'en_US')
 * @param {string} props.siteName - Site name (default: 'Dulwich College International')
 * @param {number|string} [props.pageLayoutType] - CMS layout type; type 4 = landing page (noindex)
 * @param {Object} props.twitter - Twitter specific config
 */
const DynamicSEO = ({
  title,
  description,
  image,
  url,
  type = 'website',
  locale = 'en_US',
  siteName = 'Dulwich College International',
  twitter = {},
  pageLayoutType
}) => {
  const isLandingPage =
    pageLayoutType === 4 || pageLayoutType === '4';
  const robotsContent = isLandingPage
    ? 'noindex,nofollow,noarchive'
    : 'index, follow';
  // Static fallback values
  const FALLBACK_TITLE = 'Dulwich College International';
  const FALLBACK_DESCRIPTION = '';
  const FALLBACK_IMAGE = `${window.location.origin}/images/opengraph/opengraph-default.png`;
  // Use production domain for canonical URL, fallback to current URL
  const FALLBACK_URL = process.env.REACT_APP_SITE_URL
    ? `${process.env.REACT_APP_SITE_URL}${window.location.pathname}`
    : window.location.href;

  // Use provided values or fallback to defaults
  const finalTitle = title || FALLBACK_TITLE;
  const finalDescription = description || FALLBACK_DESCRIPTION;
  const finalImage = image || FALLBACK_IMAGE;
  const finalUrl = url || FALLBACK_URL;

  // Ensure image URL is absolute
  const absoluteImageUrl = finalImage.startsWith('http')
    ? finalImage
    : `${window.location.origin}${finalImage}`;

  // Twitter card type
  const twitterCard = twitter.card || 'summary_large_image';
  const twitterSite = twitter.site || '@DulwichCollege';
  const twitterCreator = twitter.creator || '@DulwichCollege';

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="robots" content={robotsContent} />
      <link rel="canonical" href={finalUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={absoluteImageUrl} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />

      {/* Image dimensions (recommended for better previews) */}
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={finalTitle} />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={absoluteImageUrl} />
      <meta name="twitter:site" content={twitterSite} />
      <meta name="twitter:creator" content={twitterCreator} />

      {/* Additional useful meta tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Helmet>
  );
};

export default DynamicSEO;
