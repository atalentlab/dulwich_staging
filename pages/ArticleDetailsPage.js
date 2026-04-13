import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import PageHeader from '../components/layout/school/PageHeader';
import PageFooter from '../components/layout/PageFooter';
import { useArticleDetailsBySlug } from '../hooks/useArticleDetailsBySlug';
import Loading from '../components/common/Loading';
import { getCurrentSchool } from '../utils/schoolDetection';

function ArticleDetailsPage() {
  const { slug: paramSlug } = useParams();
  const location = useLocation();
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState('Dulwich College International');
  const [selectedSchoolSlug, setSelectedSchoolSlug] = useState('');
  const [availableSchools, setAvailableSchools] = useState([]);
  const [tagsOpen, setTagsOpen] = useState(false);

  // Parse query parameters from URL
  const searchParams = new URLSearchParams(location.search);
  const querySlug = searchParams.get('slug');
  const queryLocale = searchParams.get('locale');
  const querySchool = searchParams.get('school');

  // Supported locales (only zh/cn - English is default without prefix)
  const supportedLocales = ['zh', 'cn'];

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
  const { locale: urlLocale } = parseUrl(location.pathname);

  // Priority: query params > URL params > parsed URL > defaults
  const slug = querySlug || paramSlug;
  const locale = queryLocale || urlLocale || 'en';

  // Detect school from subdomain or query params
  const detectedSchool = getCurrentSchool();
  // Add -cms suffix if detecting from subdomain (API expects format like "beijing")
  const schoolWithSuffix = detectedSchool ? detectedSchool : null;
  const school = querySchool || schoolWithSuffix;

  const { data: article, isLoading, error } = useArticleDetailsBySlug(slug, locale, school);

  // Fetch schools
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const API_URL = process.env.NODE_ENV === 'development'
          ? '/api/active_schools'
          : 'https://dulwich-ai-chat.atalent.xyz/api/active_schools';

        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          const result = await response.json();
          if (result.status === 'success' && result.data) {
            setAvailableSchools(result.data);
            const defaultSchool = result.data.find(s => s.id === -1 || s.slug === '') || result.data[0];
            setSelectedSchool(`Dulwich College ${defaultSchool.title}`);
            setSelectedSchoolSlug(defaultSchool.slug);
          }
        }
      } catch (error) {
        console.error('Error fetching schools:', error);
      }
    };

    fetchSchools();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = article?.title || '';

    switch(platform) {
      case 'wechat':
        // WeChat sharing - typically handled by WeChat API
        alert('WeChat sharing functionality');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      default:
        break;
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error || !article) {
    return (
      <>
        <PageHeader
          selectedSchool={selectedSchool}
          availableSchools={availableSchools}
          setSelectedSchool={setSelectedSchool}
          setSelectedSchoolSlug={setSelectedSchoolSlug}
          setChatOpen={setChatOpen}
          chatOpen={chatOpen}
          headerScrolled={true}
        />
        <div className="min-h-screen flex items-center justify-center pt-32">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-8">{error?.message || 'The article you are looking for does not exist.'}</p>
            <a
              href="/dulwich-life"
              className="inline-block px-6 py-3 bg-[#D30013] text-white rounded-lg hover:bg-[#B8000F] transition-colors"
            >
              Back to Articles
            </a>
          </div>
        </div>
        <PageFooter />
      </>
    );
  }

  return (
    <>
      <PageHeader
        selectedSchool={selectedSchool}
        availableSchools={availableSchools}
        setSelectedSchool={setSelectedSchool}
        setSelectedSchoolSlug={setSelectedSchoolSlug}
        setChatOpen={setChatOpen}
        chatOpen={chatOpen}
        headerScrolled={true}
      />

      <main className="pt-32 pb-16 bg-white text-left">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Article Header */}
          <header className="mb-12 text-left">
            <h1 className="text-4xl text-left sm:text-5xl md:text-6xl font-black text-gray-900 mb-6">
              {article.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {/* Date */}
              {article.published_date && (
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{formatDate(article.published_date)}</span>
                </div>
              )}

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setTagsOpen(!tagsOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span className="text-sm font-medium">Tags</span>
                    <svg className={`w-4 h-4 transition-transform ${tagsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {tagsOpen && (
                    <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[200px] z-10">
                      <div className="flex flex-wrap gap-2">
                        {article.tags.map((tag, index) => (
                          <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Social Share Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleShare('wechat')}
                className="w-10 h-10 flex items-center justify-center bg-[#09B83E] text-white rounded hover:bg-[#078A2F] transition-colors"
                aria-label="Share on WeChat"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01.178-.555c1.529-1.119 2.498-2.764 2.498-4.593 0-3.359-3.24-5.949-7.058-5.949zm-2.635 2.379c.535 0 .969.44.969.984 0 .544-.434.985-.969.985a.978.978 0 01-.969-.985c0-.544.434-.984.969-.984zm5.31 0c.536 0 .97.44.97.984 0 .544-.434.985-.97.985a.978.978 0 01-.969-.985c0-.544.433-.984.969-.984z"/>
                </svg>
              </button>

              <button
                onClick={() => handleShare('linkedin')}
                className="w-10 h-10 flex items-center justify-center bg-[#0077B5] text-white rounded hover:bg-[#006396] transition-colors"
                aria-label="Share on LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </button>

              <button
                onClick={() => handleShare('facebook')}
                className="w-10 h-10 flex items-center justify-center bg-[#1877F2] text-white rounded hover:bg-[#0C63D4] transition-colors"
                aria-label="Share on Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
            </div>
          </header>

          {/* Dulwich Crest */}
          {article.featured_image && (
            <div className="flex justify-center my-12">
              <img
                src={article.featured_image}
                alt="Dulwich Crest"
                className="w-32 h-32 object-contain"
              />
            </div>
          )}

          {/* Article Content */}
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
            style={{
              fontSize: '1.125rem',
              lineHeight: '1.75',
              color: '#1f2937'
            }}
          />

          {/* Additional Images */}
          {article.gallery && article.gallery.length > 0 && (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              {article.gallery.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-auto rounded-lg shadow-md"
                />
              ))}
            </div>
          )}
        </article>
      </main>

      <PageFooter />
    </>
  );
}

export default ArticleDetailsPage;