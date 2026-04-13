import React, { useEffect, useState } from 'react';
import { useLocation, useSearchParams, useParams } from 'react-router-dom';
import { fetchPreviewPage } from '../api/pageService';
import { fetchSchoolPreviewPage } from '../api/schoolPageService';
import { getCurrentSchool, isSchoolSite } from '../utils/schoolDetection';
import DynamicSEO from '../components/SEO/DynamicSEO';
import BlockRenderer from '../components/blocks/BlockRenderer';
import BannerBlock from '../components/blocks/BannerBlock';
import Loading from '../components/common/Loading';
import PageHeader from '../components/layout/PageHeader';
import PageFooter from '../components/layout/PageFooter';
import SchoolPageHeader from '../components/layout/school/PageHeader';
import SchoolPageFooter from '../components/layout/school/PageFooter';
import ParallaxLayout from '../components/layout/ParallaxLayout';
import ScrollSpyPage from './ScrollSpyPage';

/**
 * PreviewPage Component
 * Handles preview for both Group and School pages
 *
 * Group Preview URLs:
 *   - /preview/page/mkjrrn5lf51775126879
 *   - /preview/page/mkjrrn5lf51775126879?locale=zh
 *   - /preview/page?slug=mkjrrn5lf51775126879&locale=zh
 *
 * School Preview URLs:
 *   - /preview/page/ldx500q2s11775127037?school=beijing
 *   - /preview/page/ldx500q2s11775127037?school=beijing&locale=zh
 *   - /preview/page?slug=ldx500q2s11775127037&school=beijing&locale=zh
 *
 * If 'school' parameter exists, it's a school preview; otherwise, it's a group preview
 */
const PreviewPage = () => {
  const location = useLocation();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSchoolPreview, setIsSchoolPreview] = useState(false);

  // Header/Footer states
  const [selectedSchool, setSelectedSchool] = useState('Dulwich International College');
  const [selectedSchoolSlug, setSelectedSchoolSlug] = useState('international');
  const [availableSchools] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const loadPreviewData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get slug from path parameter or query parameter
        // Priority: path param (/preview/page/{slug}) > query param (?slug=...)
        const slug = params.slug || searchParams.get('slug');
        const locale = searchParams.get('locale') || null;

        // Detect school from subdomain or query parameter
        const detectedSchool = getCurrentSchool();
        const isSchoolPreviewSite = isSchoolSite();
        const schoolParam = searchParams.get('school');

        // Priority: query param > subdomain detection
        const school = schoolParam || (isSchoolPreviewSite && detectedSchool ? detectedSchool : null);

        console.log('🔍 Preview Page - Hostname:', window.location.hostname);
        console.log('🔍 Preview Page - Detected School:', detectedSchool);
        console.log('🔍 Preview Page - Is School Site:', isSchoolPreviewSite);
        console.log('🔍 Preview Page - URL params:', { slug, school, locale });
        console.log('🔍 Path params:', params);
        console.log('🔍 Query params:', Object.fromEntries(searchParams));

        if (!slug) {
          throw new Error('Preview slug is required');
        }

        // Determine if this is a school or group preview
        const isSchool = !!school;
        setIsSchoolPreview(isSchool);

        let data;
        if (isSchool) {
          // School preview
          console.log('📚 Loading School Preview with school:', school);
          data = await fetchSchoolPreviewPage(slug, school, locale);
        } else {
          // Group preview
          console.log('🌍 Loading Group Preview...');
          data = await fetchPreviewPage(slug, locale);
        }

        console.log('✅ Preview data loaded:', data);
        console.log('🔍 Banner:', data?.banner);
        console.log('🔍 Blocks:', data?.blocks);
        console.log('🔍 Blocks count:', data?.blocks?.length);
        setPageData(data);
      } catch (err) {
        console.error('❌ Error loading preview:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPreviewData();
  }, [location.search, location.pathname, searchParams, params]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Preview Error</h1>
          <p className="text-gray-700 mb-4">{error}</p>
          <p className="text-sm text-gray-500">
            Please check the preview URL and try again.
          </p>
        </div>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No Preview Data</h1>
          <p className="text-gray-600">Unable to load preview content.</p>
        </div>
      </div>
    );
  }

  const { banner, blocks = [], meta } = pageData;
  const pageLayoutType = banner?.page_layout_type;

  // Debug logging
  console.log('🎨 Rendering Preview Page');
  console.log('📦 Blocks to render:', blocks);
  console.log('📊 Block count:', blocks?.length);
  console.log('🎭 Layout type:', pageLayoutType);
  console.log('🏫 Is school preview:', isSchoolPreview);

  // Determine which components to use based on preview type
  const HeaderComponent = isSchoolPreview ? SchoolPageHeader : PageHeader;
  const FooterComponent = isSchoolPreview ? SchoolPageFooter : PageFooter;

  // Render based on layout type
  if (pageLayoutType === 'parallax_scroll') {
    return (
      <>
        {/* Preview indicator banner */}
        <div className="bg-gradient-to-r from-[#D30013] to-[#FF4D5A]/10 w-[300px] text-white rounded-lg text-center py-2 px-4 font-semibold fixed top-[30%] right-0 z-[9999]">
          PREVIEW MODE - {isSchoolPreview ? 'School Page' : 'Group Page'} (Parallax)
        </div>

        <DynamicSEO meta={meta} pageLayoutType={pageLayoutType} />
        <HeaderComponent
          selectedSchool={selectedSchool}
          setSelectedSchool={setSelectedSchool}
          availableSchools={availableSchools}
          selectedSchoolSlug={selectedSchoolSlug}
          setSelectedSchoolSlug={setSelectedSchoolSlug}
          chatOpen={chatOpen}
          setChatOpen={setChatOpen}
        />
        <ParallaxLayout banner={banner} blocks={blocks} />
        <FooterComponent
          availableSchools={availableSchools}
          selectedSchool={selectedSchool}
          setSelectedSchool={setSelectedSchool}
          setSelectedSchoolSlug={setSelectedSchoolSlug}
        />
      </>
    );
  }

  if (pageLayoutType === 'scroll_spy') {
    return (
      <>
        {/* Preview indicator banner */}
        <div className="bg-yellow-500 text-black text-center py-2 px-4 font-semibold sticky top-0 z-[9999]">
          🔍 PREVIEW MODE - {isSchoolPreview ? 'School Page' : 'Group Page'} (ScrollSpy)
        </div>

        <DynamicSEO meta={meta} pageLayoutType={pageLayoutType} />
        <ScrollSpyPage banner={banner} blocks={blocks} />
      </>
    );
  }

  // Default layout (standard_scroll)
  return (
    <>
      {/* Preview indicator banner */}
      <div className="bg-gradient-to-r from-[#D30013] to-[#FF4D5A]/10 w-[300px] text-white rounded-lg text-center py-2 px-4 font-semibold fixed top-[30%] right-0 z-[9999]">
        PREVIEW MODE - {isSchoolPreview ? 'School Page' : 'Group Page'}
      </div>

      <DynamicSEO meta={meta} pageLayoutType={pageLayoutType} />
      <HeaderComponent
        selectedSchool={selectedSchool}
        setSelectedSchool={setSelectedSchool}
        availableSchools={availableSchools}
        selectedSchoolSlug={selectedSchoolSlug}
        setSelectedSchoolSlug={setSelectedSchoolSlug}
        chatOpen={chatOpen}
        setChatOpen={setChatOpen}
      />

      {/* Banner Block */}
      {banner && <BannerBlock content={banner} />}

      {/* Content Blocks */}
      <main className="page-content">
        {console.log('🎯 About to render blocks:', blocks)}
        {blocks && blocks.length > 0 ? (
          <BlockRenderer
            blocks={blocks}
            header={pageData.header}
            footer={pageData.footer}
          />
        ) : (
          <div className="text-center p-8">
            <p className="text-gray-600">No blocks to display</p>
            <p className="text-sm text-gray-400">Blocks count: {blocks?.length || 0}</p>
          </div>
        )}
      </main>

      <FooterComponent
        availableSchools={availableSchools}
        selectedSchool={selectedSchool}
        setSelectedSchool={setSelectedSchool}
        setSelectedSchoolSlug={setSelectedSchoolSlug}
      />
    </>
  );
};

export default PreviewPage;
