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
  title = 'Dulwich International Schools',
  description = 'We are the leading network of British international schools offering the globally IB program. Discover and achieve academic excellence with us.',
  image = 'https://dulwich-azure-prod.oss-cn-shanghai.aliyuncs.com/pages/dcsg-holistic-education.jpg',
  imageAlt = 'Dulwich International Schools',
  type = 'website',
  siteName = 'Dulwich International Schools',
  twitterCard = 'summary_large_image',
  twitterSite = '@DulwichColleges',
  keywords = 'Dulwich, international school, education, Asia, IB programme',
  author = 'Dulwich International Schools'
}) => {
  const location = useLocation();
  const currentUrl = `${window.location.origin}${location.pathname}${location.search}`;

  // Ensure image URL is absolute
  const getAbsoluteImageUrl = (imgUrl) => {
    if (!imgUrl) return image; // fallback to default
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

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />

      {/* Open Graph Tags (Facebook, LinkedIn, WhatsApp) */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={imageAlt} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImageUrl} />
      <meta property="og:image:secure_url" content={absoluteImageUrl} />
      <meta property="og:image:alt" content={imageAlt} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content={twitterSite} />
      <meta name="twitter:creator" content={twitterSite} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImageUrl} />
      <meta name="twitter:image:alt" content={imageAlt} />

      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <link rel="canonical" href={currentUrl} />
    </Helmet>
  );
};

export default SEO;
