import React, { useMemo } from 'react';
import SEO from './SEO';
import { useLocation } from 'react-router-dom';
import { getCurrentSchool } from '../utils/schoolDetection';
import { useSchoolInfo } from '../hooks/useSchoolInfo';

/**
 * PageSEO - Wrapper component that fetches school data and provides SEO tags
 * Uses header_image (KV image) from API as the OG image, falls back to cover_image if not available
 *
 * @param {Object} props
 * @param {string} props.title - Page-specific title (optional, defaults to school + base title)
 * @param {string} props.description - Page-specific description (optional)
 * @param {string} props.image - Override image (optional, defaults to header_image or cover_image from API)
 * @param {Object} props.pageData - Page data from API (optional, for article pages)
 */
const PageSEO = ({
  title,
  description,
  image,
  pageData = null
}) => {
  const location = useLocation();
  const currentSchoolSlug = getCurrentSchool();

  // Determine locale from URL
  const isChineseVersion = location.pathname.startsWith('/zh/') || location.pathname === '/zh';
  const locale = isChineseVersion ? 'zh' : 'en';

  // Fetch school information
  const { schoolInfo } = useSchoolInfo(currentSchoolSlug, locale);

  // Assets base URL
  const ASSETS_BASE_URL = 'https://assets.dulwich.org';

  // Generate dynamic title
  const pageTitle = useMemo(() => {
    if (title) return title;

    // For article pages with page data
    if (pageData?.title) {
      const schoolName = schoolInfo?.menu_title || 'Dulwich International Schools';
      return `${pageData.title} | ${schoolName}`;
    }

    // For school pages
    if (schoolInfo?.menu_title && schoolInfo.menu_title !== 'International') {
      return `Dulwich College ${schoolInfo.menu_title}`;
    }

    return 'Dulwich International Schools';
  }, [title, pageData, schoolInfo]);

  // Generate dynamic description
  const pageDescription = useMemo(() => {
    if (description) return description;

    // For article pages with intro text
    if (pageData?.intro) {
      // Strip HTML tags and limit length
      const plainText = pageData.intro.replace(/<[^>]*>/g, '');
      return plainText.length > 160 ? `${plainText.substring(0, 157)}...` : plainText;
    }

    // Use school intro if available
    if (schoolInfo?.intro) {
      const plainText = schoolInfo.intro.replace(/<[^>]*>/g, '');
      return plainText.length > 160 ? `${plainText.substring(0, 157)}...` : plainText;
    }

    return 'We are the leading network of British international schools offering the globally IB program. Discover and achieve academic excellence with us.';
  }, [description, pageData, schoolInfo]);

  // Generate dynamic OG image - prioritize header_image (KV image)
  const pageImage = useMemo(() => {
    // 1. If explicit image prop is provided, use it
    if (image) {
      if (image.startsWith('http://') || image.startsWith('https://')) {
        return image;
      }
      return `${ASSETS_BASE_URL}/${image}`;
    }

    // 2. For article pages, use the article's listing_image or image
    if (pageData?.listing_image) {
      if (pageData.listing_image.startsWith('http://') || pageData.listing_image.startsWith('https://')) {
        return pageData.listing_image;
      }
      return `${ASSETS_BASE_URL}/${pageData.listing_image}`;
    }

    if (pageData?.image) {
      if (pageData.image.startsWith('http://') || pageData.image.startsWith('https://')) {
        return pageData.image;
      }
      return `${ASSETS_BASE_URL}/${pageData.image}`;
    }

    // 3. Use school's header_image (KV image) - PRIMARY OG IMAGE
    if (schoolInfo?.header_image) {
      if (schoolInfo.header_image.startsWith('http://') || schoolInfo.header_image.startsWith('https://')) {
        return schoolInfo.header_image;
      }
      return `${ASSETS_BASE_URL}/${schoolInfo.header_image}`;
    }

    // 4. Fallback to school's cover_image if header_image not available
    if (schoolInfo?.cover_image) {
      if (schoolInfo.cover_image.startsWith('http://') || schoolInfo.cover_image.startsWith('https://')) {
        return schoolInfo.cover_image;
      }
      return `${ASSETS_BASE_URL}/${schoolInfo.cover_image}`;
    }

    // 5. Fallback to default OG image
    return 'https://dulwich-azure-prod.oss-cn-shanghai.aliyuncs.com/pages/dcsg-holistic-education.jpg';
  }, [image, pageData, schoolInfo, ASSETS_BASE_URL]);

  // Generate image alt text
  const imageAlt = useMemo(() => {
    if (pageData?.title) return pageData.title;
    if (schoolInfo?.menu_title) return `Dulwich College ${schoolInfo.menu_title}`;
    return 'Dulwich International Schools';
  }, [pageData, schoolInfo]);

  // Generate keywords
  const keywords = useMemo(() => {
    const baseKeywords = 'Dulwich, international school, education, IB programme';
    const schoolName = schoolInfo?.menu_title;
    if (schoolName && schoolName !== 'International') {
      return `${baseKeywords}, ${schoolName}`;
    }
    return `${baseKeywords}, Asia`;
  }, [schoolInfo]);

  return (
    <SEO
      title={pageTitle}
      description={pageDescription}
      image={pageImage}
      imageAlt={imageAlt}
      keywords={keywords}
      siteName="Dulwich International Schools"
      type={pageData ? 'article' : 'website'}
    />
  );
};

export default PageSEO;
