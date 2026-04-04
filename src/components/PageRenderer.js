import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { usePageBySlug } from '../hooks/usePageBySlug';
import DynamicSEO from './SEO/DynamicSEO';
import useSmoothScroll from '../hooks/useSmoothScroll';
import BlockRenderer from './blocks/BlockRenderer';
import BannerBlock from './blocks/BannerBlock';
import Loading from './common/Loading';
import PageHeader from './layout/PageHeader';
import PageFooter from './layout/PageFooter';
import ParallaxLayout from './layout/ParallaxLayout';
import ScrollSpyPage from '../pages/ScrollSpyPage';
import NotFound from '../pages/NotFound';
import ErrorPage from '../pages/ErrorPage';

const PageRenderer = ({ slug: fixedSlug, locale: fixedLocale }) => {

  const location = useLocation();

  // Header states
  const [selectedSchool, setSelectedSchool] = useState('Dulwich International College');
  const [selectedSchoolSlug, setSelectedSchoolSlug] = useState('international');
  const [availableSchools, setAvailableSchools] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);

  const pathname = location.pathname;

  /* -----------------------------
     Detect Locale from URL
  ----------------------------- */

  const locale = fixedLocale
    ? fixedLocale
    : pathname.startsWith('/zh/') || pathname === '/zh'
    ? 'zh'
    : 'en';

  /* -----------------------------
     Extract slug
  ----------------------------- */

  const getSlug = () => {

    const cleanPath = pathname.replace(/^\/|\/$/g, '');

    if (!cleanPath) return 'home';

    const segments = cleanPath.split('/');

    if (segments[0] === 'zh') {
      return segments.slice(1).join('/') || 'home';
    }

    return cleanPath;
  };

  const slug = fixedSlug || getSlug();

  console.log("Locale:", locale);
  console.log("Slug:", slug);

  /* -----------------------------
     Fetch schools
  ----------------------------- */

  useEffect(() => {

    const fetchSchoolsList = async () => {

      try {

        const baseUrl = process.env.REACT_APP_API_URL;

        const response = await fetch(
          `${baseUrl}/api/schools?locale=${locale}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch schools');
        }

        const data = await response.json();

        const schoolsList = data.data || data.schools || data;

        if (Array.isArray(schoolsList)) {

          const processedSchools = [];

          const hasInternational = schoolsList.some(
            s => s.slug === 'international'
          );

          if (!hasInternational) {

            processedSchools.push({
              id: -1,
              title: 'International',
              slug: 'international',
              url: window.location.origin
            });

          }

          schoolsList.forEach((school) => {

            const processedSchool = { ...school };

            if (school.slug === 'international') {
              processedSchool.title = 'International';
            }

            processedSchools.push(processedSchool);

          });

          setAvailableSchools(processedSchools);

        }

      } catch (error) {

        console.error('Error fetching schools:', error);

      }

    };

    fetchSchoolsList();

  }, [locale]);

  // Fetch page data using React Query
  const { data, isLoading, error, isFetching } = usePageBySlug(slug, locale);

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
      console.log('📸 Using header_image for OG:', absoluteUrl);
      return absoluteUrl;
    }

    if (!isPlaceholder(coverImage)) {
      const absoluteUrl = coverImage.startsWith('http') ? coverImage : `${window.location.origin}${coverImage}`;
      console.log('📸 Using cover_image for OG:', absoluteUrl);
      return absoluteUrl;
    }

    if (!isPlaceholder(mediaImage)) {
      const absoluteUrl = mediaImage.startsWith('http') ? mediaImage : `${window.location.origin}${mediaImage}`;
      console.log('📸 Using media for OG:', absoluteUrl);
      return absoluteUrl;
    }

    if (!isPlaceholder(backgroundImage)) {
      const absoluteUrl = backgroundImage.startsWith('http') ? backgroundImage : `${window.location.origin}${backgroundImage}`;
      console.log('📸 Using background_image for OG:', absoluteUrl);
      return absoluteUrl;
    }


  };

  // SEO is now handled by DynamicSEO component in each layout section

  // Handle smooth scrolling to anchors - only after data is loaded
  useSmoothScroll(!isLoading && !!data);

  // Loading state
  if (isLoading) {
    return <Loading />;
  }

  // Check for redirect from API response
  if (data?.redirects?.redirect === true && data?.redirects?.target) {
    console.log('🔄 Redirect detected:', {
      from: location.pathname,
      to: data.redirects.target,
      status: data.redirects.status,
      locale: locale
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

    // Render OG tags BEFORE redirect for WhatsApp/social bots
    const redirectSeoTitle = data?.meta?.meta_title || data?.banner?.meta_title || data?.banner?.title || 'Dulwich International Schools';
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
    console.log('Background fetching page data...');
  }

  // Prepare SEO data for all layouts
  const seoTitle = data?.meta?.meta_title || data?.banner?.meta_title || data?.banner?.title || 'Dulwich International Schools';
  const seoDescription = data?.meta?.meta_description || data?.banner?.meta_description || data?.banner?.description || '';
  const seoImage = getOgImage();
  const seoUrl = `${window.location.origin}${location.pathname}`;

  const pageLayoutType = data?.banner?.page_layout_type;

  // ── Layout type 5: full-viewport section-by-section scrolling ─────────────
  if (pageLayoutType === 5) {
    return (
      <>
        {/* Dynamic SEO Meta Tags */}
        <DynamicSEO
          title={seoTitle}
          description={seoDescription}
          image={seoImage}
          url={seoUrl}
          locale={locale === 'zh' ? 'zh_CN' : 'en_US'}
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
            Slug: {slug} | Layout: 5 | Sections: {(data.blocks?.length || 0) + 2}
          </div>
        )}
      </>
    );
  }

  // ── Layout type 3: ScrollSpy with sticky sidebar navigation ───────────────
  if (pageLayoutType === 3) {
    return (
      <>
        {/* Dynamic SEO Meta Tags */}
        <DynamicSEO
          title={seoTitle}
          description={seoDescription}
          image={seoImage}
          url={seoUrl}
          locale={locale === 'zh' ? 'zh_CN' : 'en_US'}
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
            Slug: {slug} | Layout: 3 (ScrollSpy) | Blocks: {data.blocks?.length || 0}
          </div>
        )}
      </>
    );
  }

  // ── Default layout ─────────────────────────────────────────────────────────
  return (
    <div className="page-wrapper">
      {/* Dynamic SEO Meta Tags */}
      <DynamicSEO
        title={seoTitle}
        description={seoDescription}
        image={seoImage}
        url={seoUrl}
        locale={locale === 'zh' ? 'zh_CN' : 'en_US'}
      />

      {/* International Header */}
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
      {data.banner && data.banner.media && (
        <BannerBlock
          content={{
            ...data.banner,
            backgroundImage: data.banner.media,
            title: data.banner.title || '',
            subtitle: data.banner.description || '',
            ctaText: data.banner.link_copy || null,
            ctaLink: data.banner.link || null
          }}
        />
      )}

      {/* Main content - dynamically rendered blocks */}
      <main className="page-content">
        {data.blocks && data.blocks.length > 0 ? (
          <BlockRenderer
            blocks={data.blocks}
            header={data.header}
            footer={data.footer}
            locale={locale}
          />
        ) : (
          <div className="py-16 text-center text-gray-500">
            <p>No content blocks available for this page.</p>
          </div>
        )}
      </main>

      {/* International Footer */}
      <PageFooter
        selectedSchool={selectedSchool}
        availableSchools={availableSchools}
        setSelectedSchool={setSelectedSchool}
        setSelectedSchoolSlug={setSelectedSchoolSlug}
      />

      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black text-white text-xs p-2 rounded opacity-50">
          Slug: {slug} | Locale: {locale || 'none'} | URL: {location.pathname}
        </div>
      )}
    </div>
  );
};

export default PageRenderer;
