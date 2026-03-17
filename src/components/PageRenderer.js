import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { usePageBySlug } from '../hooks/usePageBySlug';
import useSEO from '../hooks/useSEO';
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
import { useNavigate } from 'react-router-dom';

/**
 * PageRenderer Component
 * Dynamically renders pages based on URL slug
 *
 * Usage:
 *   <Route path="/*" element={<PageRenderer />} />
 *
 * URL Examples:
 *   /about-dulwich/vision-and-values
 *   /zh/about-dulwich/vision-and-values
 *   /en/admissions/how-to-apply
 *   /admissions/how-to-apply
 */
const PageRenderer = ({ slug: fixedSlug, locale: fixedLocale }) => {
  const location = useLocation();

  // State for header props
  const [selectedSchool, setSelectedSchool] = useState('Dulwich International College');
  const [selectedSchoolSlug, setSelectedSchoolSlug] = useState('international');
  const [availableSchools, setAvailableSchools] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);

  // Supported locales
  const supportedLocales = ['zh', 'en', 'cn'];

  // Parse URL to extract locale and slug
  const parseUrl = (pathname) => {
    // Remove leading and trailing slashes
    const cleanPath = pathname.replace(/^\/|\/$/g, '');

    if (!cleanPath) {
      return { locale: null, slug: 'home' };
    }

    // Split path into segments
    const segments = cleanPath.split('/');

    // Check if first segment is a locale
    const firstSegment = segments[0].toLowerCase();

    if (supportedLocales.includes(firstSegment)) {
      // First segment is locale
      const extractedLocale = firstSegment;
      // Remaining segments form the slug
      const extractedSlug = segments.slice(1).join('/') || 'home';

      return { locale: extractedLocale, slug: extractedSlug };
    } else {
      // No locale in URL, use entire path as slug
      return { locale: null, slug: cleanPath };
    }
  };

  // Extract locale and slug from URL
  const { locale: urlLocale, slug: urlSlug } = parseUrl(location.pathname);

  // Use fixed values from props or extracted values from URL
  const slug = fixedSlug || urlSlug;
  const locale = fixedLocale || urlLocale;

  // Fetch available schools from API with locale
  useEffect(() => {
    const fetchSchoolsList = async () => {
      try {
        const baseUrl = process.env.REACT_APP_API_URL || 'https://www.dulwich.atalent.xyz';
        const currentLocale = locale || 'en';
        const response = await fetch(`${baseUrl}/api/schools?locale=${currentLocale}`);

        if (!response.ok) {
          throw new Error('Failed to fetch schools');
        }

        const data = await response.json();
        const schoolsList = data.data || data.schools || data;

        if (Array.isArray(schoolsList)) {
          // Process schools to handle duplicates and add International
          const processedSchools = [];

          // Add International as first option (if not already in list)
          const hasInternational = schoolsList.some(s => s.slug === 'international');
          if (!hasInternational) {
            processedSchools.push({
              id: -1,
              title: 'International',
              slug: 'international',
              url: window.location.origin
            });
          }

          // Process each school
          schoolsList.forEach(school => {
            const processedSchool = { ...school };

            // Handle "International School" - rename to "International"
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
  useSEO({
    meta_title:       data?.meta?.meta_title       || data?.banner?.meta_title       || data?.banner?.title,
    meta_description: data?.meta?.meta_description || data?.banner?.meta_description,
    meta_keywords:    data?.meta?.meta_keywords    || data?.banner?.meta_keywords,
    og_image:         data?.banner?.header_image,
  });

  // Handle smooth scrolling to anchors - only after data is loaded
  useSmoothScroll(!isLoading && !!data);

  // Loading state
  if (isLoading) {
    return <Loading />;
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

  const pageLayoutType = data?.banner?.page_layout_type;

  // ── Layout type 5: full-viewport section-by-section scrolling ─────────────
  if (pageLayoutType === 5) {
    return (
      <>
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
