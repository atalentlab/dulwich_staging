import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Navigate } from 'react-router-dom';
import { useSchoolPageBySlug } from '../../hooks/useSchoolPageBySlug';
import DynamicSEO from '../SEO/DynamicSEO';
import useSmoothScroll from '../../hooks/useSmoothScroll';
import { useSchools } from '../../contexts/SchoolsContext';
import BlockRenderer from '../blocks/BlockRenderer';
import BannerBlock from '../blocks/BannerBlock';
import Loading from '../common/Loading';
import PageHeader from '../layout/school/PageHeader';
import PageFooter from '../layout/school/PageFooter';
import ParallaxLayout from '../layout/ParallaxLayout';
import ScrollSpyPage from '../../pages/ScrollSpyPage';
import NotFound from '../../pages/NotFound';
import ErrorPage from '../../pages/ErrorPage';

/**
 * SchoolPageRenderer Component
 * Dynamically renders school-specific pages based on URL slug and school
 *
 * Usage Option 1: URL Parameter
 *   <Route path="/school/:school/*" element={<SchoolPageRenderer />} />
 *   URL: /school/beijing/admissions/overview
 *
 * Usage Option 2: Subdomain (Hostname)
 *   <Route path="/*" element={<SchoolPageRenderer school="beijing" />} />
 *   URL: http://beijing.dulwich.loc:3000/admissions/overview
 *
 * Usage Option 3: Direct Props
 *   <SchoolPageRenderer school="beijing" slug="admissions/overview" />
 */
const SchoolPageRenderer = ({ school: propSchool, slug: propSlug, locale: propLocale }) => {
  const params = useParams();
  const location = useLocation();

  // Use schools from context instead of fetching
  const { schools: availableSchools, loading: schoolsLoading } = useSchools();

  // State for header/footer props
  const [selectedSchool, setSelectedSchool] = useState('Dulwich International College');
  const [selectedSchoolSlug, setSelectedSchoolSlug] = useState('');
  const [chatOpen, setChatOpen] = useState(false);

  // Supported locales (only zh/cn - English is default without prefix)
  const supportedLocales = ['zh', 'cn'];

  // Parse URL to extract locale and slug
  const parseUrl = (pathname) => {
    // Remove leading and trailing slashes
    const cleanPath = pathname.replace(/^\/|\/$/g, '');

    if (!cleanPath) {
      return { locale: null, slug: '' }; // Empty slug for homepage
    }

    // Split path into segments
    const segments = cleanPath.split('/');

    // If using /school/:school/* pattern, remove first two segments
    if (segments[0] === 'school' && segments.length > 1) {
      segments.shift(); // Remove 'school'
      segments.shift(); // Remove school name
    }

    // Check if first remaining segment is a locale
    const firstSegment = segments[0]?.toLowerCase();

    if (supportedLocales.includes(firstSegment)) {
      // First segment is locale
      const extractedLocale = firstSegment;
      // Remaining segments form the slug
      const extractedSlug = segments.slice(1).join('/') || ''; // Empty string for homepage

      return { locale: extractedLocale, slug: extractedSlug };
    } else {
      // No locale in URL, use entire path as slug
      return { locale: null, slug: segments.join('/') || '' }; // Empty string for homepage
    }
  };

  // Extract locale and slug from URL
  const { locale: urlLocale, slug: urlSlug } = parseUrl(location.pathname);

  // Determine school (priority: prop > URL param > default)
  const school = propSchool || params.school;

  // Determine slug (priority: prop > parsed URL)
  const pageSlug = propSlug || urlSlug;

  // Determine locale (priority: explicitly passed prop > parsed URL > null)
  // Only pass locale to API if it's explicitly in the URL
  const locale = propLocale !== undefined ? propLocale : (urlLocale || null);

  // Schools are now fetched from context (no duplicate API calls)

  // Fetch school page data using React Query
  const { data, isLoading, error, isFetching } = useSchoolPageBySlug(pageSlug, school, locale);

  // Check if this is the initial load (no cached data)
  const isInitialLoading = isLoading && !data;

  // Dynamically update SEO meta tags — meta object takes priority over banner
  // OG Image priority: header_image > cover_image > media > background_image
  const getOgImage = () => {
    const headerImage = data?.banner?.header_image;
    const coverImage = data?.banner?.cover_image;
    const mediaImage = data?.banner?.media;
    const backgroundImage = data?.banner?.background_image;

    // Skip placeholder images AND Azure CDN URLs (we prefer files.dulwich.org)
    const isPlaceholder = (img) => !img ||
                                   img.includes('no-image.gif') ||
                                   img.includes('placeholders/no-image') ||
                                   img.includes('placeholder') ||
                                   img.includes('dulwich-azure-prod.oss-cn-shanghai.aliyuncs.com');

    // Try images in priority order
    if (!isPlaceholder(headerImage)) {
      const absoluteUrl = headerImage.startsWith('http') ? headerImage : `${window.location.origin}${headerImage}`;
      console.log('📸 School OG Image - Using header_image:', absoluteUrl);
      return absoluteUrl;
    }

    if (!isPlaceholder(coverImage)) {
      const absoluteUrl = coverImage.startsWith('http') ? coverImage : `${window.location.origin}${coverImage}`;
      console.log('📸 School OG Image - Using cover_image:', absoluteUrl);
      return absoluteUrl;
    }

    if (!isPlaceholder(mediaImage)) {
      const absoluteUrl = mediaImage.startsWith('http') ? mediaImage : `${window.location.origin}${mediaImage}`;
      console.log('📸 School OG Image - Using media:', absoluteUrl);
      return absoluteUrl;
    }

    if (!isPlaceholder(backgroundImage)) {
      const absoluteUrl = backgroundImage.startsWith('http') ? backgroundImage : `${window.location.origin}${backgroundImage}`;
      console.log('📸 School OG Image - Using background_image:', absoluteUrl);
      return absoluteUrl;
    }


  };

  // SEO is now handled by DynamicSEO component in each layout section

  // Prepare school name for SEO
  const schoolName = school ? school.charAt(0).toUpperCase() + school.slice(1) : '';

  // Handle smooth scrolling to anchors - only after data is loaded
  useSmoothScroll(!isInitialLoading && !!data);

  // Validation: School is required
  if (!school) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">School Not Detected</h2>
          <p className="text-gray-600 mb-4">
            Unable to determine school from URL or hostname.
          </p>
          <p className="text-sm text-gray-500">
            Expected format: http://beijing.dulwich.loc:3000/ or /school/beijing/
          </p>
        </div>
      </div>
    );
  }

  // Loading state - only show loader on initial load, not on background refetch
  if (isInitialLoading) {
    return <Loading />;
  }

  // Check for redirect from API response
  if (data?.redirects?.redirect === true && data?.redirects?.target) {
    console.log('🔄 Redirect detected:', {
      from: location.pathname,
      to: data.redirects.target,
      status: data.redirects.status
    });

    // Build redirect URL with locale preservation
    let redirectTarget = data.redirects.target;

    // If current page has locale prefix (/zh), preserve it in redirect
    if (locale && locale !== 'en' && !redirectTarget.startsWith(`/${locale}`)) {
      if (!redirectTarget.startsWith('/')) {
        redirectTarget = '/' + redirectTarget;
      }
      redirectTarget = `/${locale}${redirectTarget}`;
      console.log('🌐 Locale preserved in redirect:', redirectTarget);
    }

    console.log('➡️ Redirecting to:', redirectTarget);

    // Render OG tags BEFORE redirect so WhatsApp can scrape them
    // Use banner data from API if available
    const redirectPageLayoutType =
      data?.banner?.page_layout_type ||
      data?.data?.banner?.page_layout_type ||
      data?.page_layout_type;
    const redirectSeoTitle = data?.meta?.meta_title || data?.banner?.meta_title || data?.banner?.title || `Dulwich College ${schoolName}`;
    const redirectSeoDescription = data?.meta?.meta_description || data?.banner?.meta_description || data?.banner?.description || '';
    const redirectSeoImage = getOgImage();
    const redirectSeoUrl = `${window.location.origin}${redirectTarget}`;

    return (
      <>
        {/* OG Tags for WhatsApp/social bots - rendered BEFORE redirect */}
        <DynamicSEO
          title={redirectSeoTitle}
          description={redirectSeoDescription}
          image={redirectSeoImage}
          url={redirectSeoUrl}
          locale={locale === 'zh' ? 'zh_CN' : 'en_US'}
          siteName={`Dulwich College ${schoolName}`}
          pageLayoutType={redirectPageLayoutType}
        />

        {/* Client-side redirect */}
        <Navigate to={redirectTarget} replace />
      </>
    );
  }

  // Error state - show appropriate error page based on status code
  if (error || !data) {
    // Extract error code and determine error message
    // Try multiple ways to get the status code
    let errorCode;

    // Method 1: Direct status property
    if (error?.status) {
      errorCode = error.status;
    }
    // Method 2: Nested response.status
    else if (error?.response?.status) {
      errorCode = error.response.status;
    }
    // Method 3: Parse from error message (e.g., "HTTP error! status: 500")
    else if (error?.message) {
      const match = error.message.match(/status:\s*(\d{3})/);
      if (match) {
        errorCode = parseInt(match[1], 10);
      }
    }

    // Method 4: If we have an error object but no status, and it's a fetch error, assume 500
    if (!errorCode && error && error.message) {
      if (error.message.includes('HTTP error') || error.message.includes('Failed to fetch')) {
        errorCode = 500;
      }
    }

    // Default to 404 if still no error code and no data
    if (!errorCode) {
      errorCode = !data ? 404 : 500;
    }

    // Don't pass errorMessage and errorDescription - let ErrorPage handle translations based on locale
    return (
      <ErrorPage
        errorCode={errorCode}
        technicalMessage={error?.message}
      />
    );
  }

  // Show background loading indicator
  if (isFetching) {
    console.log('Background fetching school page data...');
  }

  // Debug logging - ALWAYS show to diagnose issue
  console.log('🔍 SchoolPageRenderer DEBUG - Full data:', data);
  console.log('🔍 SchoolPageRenderer DEBUG - data?.banner:', data?.banner);
  console.log('🔍 SchoolPageRenderer DEBUG - data?.data?.banner:', data?.data?.banner);

  // Try multiple possible paths to extract pageLayoutType
  const pageLayoutType =
    data?.banner?.page_layout_type ||
    data?.data?.banner?.page_layout_type ||
    data?.page_layout_type;

  // Debug logging
  console.log('🔍 SchoolPageRenderer - Extracted pageLayoutType:', pageLayoutType, 'Type:', typeof pageLayoutType);
  console.log('🔍 SchoolPageRenderer - Extraction paths checked:', {
    'data.banner.page_layout_type': data?.banner?.page_layout_type,
    'data.data.banner.page_layout_type': data?.data?.banner?.page_layout_type,
    'data.page_layout_type': data?.page_layout_type,
    'final': pageLayoutType
  });

  // Success state - render the blocks with school-specific header and footer
  // Extract banner data - try multiple possible paths
  const bannerData = data?.banner || data?.data?.banner;

  // Prepare SEO data for all layouts
  const seoTitle = data?.meta?.meta_title || data?.banner?.meta_title || data?.banner?.title || `Dulwich College ${schoolName}`;
  const seoDescription = data?.meta?.meta_description || data?.banner?.meta_description || data?.banner?.description || '';
  const seoImage = getOgImage();
  const seoUrl = `${window.location.origin}${location.pathname}`;

  // ── Layout type 5: full-viewport section-by-section scrolling ─────────────
  if (pageLayoutType === 5 || pageLayoutType === "5") {
    return (
      <>
        {/* Dynamic SEO Meta Tags */}
        <DynamicSEO
          title={seoTitle}
          description={seoDescription}
          image={seoImage}
          url={seoUrl}
          locale={locale === 'zh' ? 'zh_CN' : 'en_US'}
          siteName={`Dulwich College ${schoolName}`}
          pageLayoutType={pageLayoutType}
        />

        <PageHeader
          selectedSchool={selectedSchool}
          availableSchools={availableSchools}
          setSelectedSchool={setSelectedSchool}
          setSelectedSchoolSlug={setSelectedSchoolSlug}
          setChatOpen={setChatOpen}
          chatOpen={chatOpen}
          pageLayoutType={pageLayoutType}
        />
        <ParallaxLayout
          banner={data.banner}
          blocks={data.blocks || []}
          header={data.header}
          footer={data.footer}
          selectedSchool={selectedSchool}
          availableSchools={availableSchools}
          setSelectedSchool={setSelectedSchool}
          setSelectedSchoolSlug={setSelectedSchoolSlug}
        />
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 right-4 bg-black text-white text-xs p-2 rounded opacity-50 z-[9999]">
            School: {school} | Slug: {pageSlug} | Layout: 5 | Sections: {(data.blocks?.length || 0) + 2}
          </div>
        )}
      </>
    );
  }

  // ── Layout type 3: ScrollSpy with sticky sidebar navigation ───────────────
  if (pageLayoutType === 3 || pageLayoutType === "3") {
    return (
      <>
        {/* Dynamic SEO Meta Tags */}
        <DynamicSEO
          title={seoTitle}
          description={seoDescription}
          image={seoImage}
          url={seoUrl}
          locale={locale === 'zh' ? 'zh_CN' : 'en_US'}
          siteName={`Dulwich College ${schoolName}`}
          pageLayoutType={pageLayoutType}
        />

        <PageHeader
          selectedSchool={selectedSchool}
          availableSchools={availableSchools}
          setSelectedSchool={setSelectedSchool}
          setSelectedSchoolSlug={setSelectedSchoolSlug}
          setChatOpen={setChatOpen}
          chatOpen={chatOpen}
          pageLayoutType={pageLayoutType}
        />
        <ScrollSpyPage
          banner={data.banner}
          blocks={data.blocks || []}
          header={data.header}
          footer={data.footer}
          selectedSchool={selectedSchool}
          availableSchools={availableSchools}
          setSelectedSchool={setSelectedSchool}
          setSelectedSchoolSlug={setSelectedSchoolSlug}
        />
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 right-4 bg-black text-white text-xs p-2 rounded opacity-50 z-[9999]">
            School: {school} | Slug: {pageSlug} | Layout: 3 (ScrollSpy) | Blocks: {data.blocks?.length || 0}
          </div>
        )}
      </>
    );
  }

  // ── Default layout ─────────────────────────────────────────────────────────
  return (
    <div className="school-page-wrapper">
      {/* Dynamic SEO Meta Tags */}
      <DynamicSEO
        title={seoTitle}
        description={seoDescription}
        image={seoImage}
        url={seoUrl}
        locale={locale === 'zh' ? 'zh_CN' : 'en_US'}
        siteName={`Dulwich College ${schoolName}`}
        pageLayoutType={pageLayoutType}
      />

      {/* School-specific Header */}
      <PageHeader
        selectedSchool={selectedSchool}
        availableSchools={availableSchools}
        setSelectedSchool={setSelectedSchool}
        setSelectedSchoolSlug={setSelectedSchoolSlug}
        setChatOpen={setChatOpen}
        chatOpen={chatOpen}
        pageLayoutType={pageLayoutType}
      />

      {/* Render Banner if exists - after header */}
      {bannerData && bannerData.header_image && (
        <BannerBlock
          content={{
            ...bannerData,
            backgroundImage: bannerData.header_image,
            title: bannerData.title || '',
            subtitle: bannerData.description || '',
            ctaText: bannerData.link_copy || null,
            ctaLink: bannerData.link || null,
            page_layout_type: pageLayoutType
          }}
        />
      )}

      {/* Main content - dynamically rendered blocks */}
      <main className="school-page-content">
        {data.blocks && data.blocks.length > 0 ? (
          <BlockRenderer
            blocks={data.blocks}
            header={data.header}
            footer={data.footer}
            school={data.school}
            locale={locale}
          />
        ) : (
          <div className="py-16 text-center text-gray-500">
            <p>No content blocks available for this page.</p>
          </div>
        )}
      </main>

      {/* School-specific Footer */}
      <PageFooter
        selectedSchool={selectedSchool}
        availableSchools={availableSchools}
        setSelectedSchool={setSelectedSchool}
        setSelectedSchoolSlug={setSelectedSchoolSlug}
      />

      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black text-white text-xs p-2 rounded opacity-50 z-50">
          School: {school} | Slug: {pageSlug} | Locale: {locale} | Layout: {pageLayoutType || 'default'}
          <br />
          Hostname: {window.location.hostname}
        </div>
      )}
    </div>
  );
};

export default SchoolPageRenderer;
