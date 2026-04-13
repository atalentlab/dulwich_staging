import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useArticleDetailsBySlug } from '../../hooks/useArticleDetailsBySlug';
import { getCurrentSchool, isSchoolSite } from '../../utils/schoolDetection';
import useSEO from '../../hooks/useSEO';
import { useSchools } from '../../contexts/SchoolsContext';
import BlockRenderer from '../blocks/BlockRenderer';
import Loading from '../common/Loading';
import SchoolPageHeader from '../layout/school/PageHeader';
import SchoolPageFooter from '../layout/school/PageFooter';
import InternationalPageHeader from '../layout/PageHeader';
import InternationalPageFooter from '../layout/PageFooter';
import ArticleLogo from '../../assets/images/article-logo.svg';


const ArticlePageRenderer = ({ slug: propSlug, locale: propLocale }) => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  // Use schools from context instead of fetching
  const { schools: availableSchools, loading: schoolsLoading } = useSchools();

  const [chatOpen, setChatOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState('Dulwich College International');
  const [selectedSchoolSlug, setSelectedSchoolSlug] = useState('');
  const [tagsOpen, setTagsOpen] = useState(false);

  // Supported locales (only zh/cn - English is default without prefix)
  const supportedLocales = ['zh', 'cn'];

  // Parse URL to extract locale and slug
  const parseUrl = (pathname) => {
    // Remove leading and trailing slashes
    const cleanPath = pathname.replace(/^\/|\/$/g, '');

    if (!cleanPath) {
      return { locale: null, slug: null };
    }

    // Split path into segments
    const segments = cleanPath.split('/');

    // Check if first segment is a locale
    const firstSegment = segments[0].toLowerCase();

    if (supportedLocales.includes(firstSegment)) {
      // First segment is locale
      const extractedLocale = firstSegment;
      // Remaining segments form the slug
      const extractedSlug = segments.slice(1).join('/');

      return { locale: extractedLocale, slug: extractedSlug };
    } else {
      // No locale in URL, use entire path as slug
      return { locale: null, slug: cleanPath };
    }
  };

  // Extract locale and slug from URL
  const { locale: urlLocale, slug: urlSlug } = parseUrl(location.pathname);

  // Determine slug (priority: prop > URL param > parsed URL)
  const articleSlug = propSlug || params.slug || urlSlug;

  // Determine locale (priority: prop > parsed URL > default 'en')
  const locale = propLocale || urlLocale || 'en';

  // Detect school from subdomain (e.g., 'singapore' from singapore.localhost:3000)
  const detectedSchool = getCurrentSchool();
  // Add -cms suffix (API expects format like "beijing")
  const school = detectedSchool ? detectedSchool : null;

  // Determine if this is a school site or international site
  const isSchool = isSchoolSite();

  // Select appropriate header and footer components
  const PageHeader = isSchool ? SchoolPageHeader : InternationalPageHeader;
  const PageFooter = isSchool ? SchoolPageFooter : InternationalPageFooter;

  // Fetch article details using React Query
  const { data: articleData, isLoading, error, isFetching } = useArticleDetailsBySlug(articleSlug, locale, school);

  // Extract main article info and blocks from API response
  const article = articleData?.main || articleData;
  const blocks = articleData?.blocks || [];

  // Dynamically update SEO meta tags with article data
  useSEO({
    meta_title:       article?.meta_title       || article?.title,
    meta_description: article?.meta_description || article?.intro,
    meta_keywords:    article?.meta_keywords,
    og_image:         article?.listing_image    || article?.featured_image,
  });

  // Schools are now fetched from context (no duplicate API calls)

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

  // Loading state
  if (isLoading) {
    return <Loading />;
  }

  // Error state
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
        <PageFooter
          selectedSchool={selectedSchool}
          availableSchools={availableSchools}
          setSelectedSchool={setSelectedSchool}
          setSelectedSchoolSlug={setSelectedSchoolSlug}
        />
      </>
    );
  }

  // Show background loading indicator
  if (isFetching) {
    console.log('Background fetching article data...');
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
      />

      <main className="pt-32 pb-16 min-[370px]:pt-[70px] bg-white">
        <article className="max-w-[1120px] mx-auto px-3 max-[1300px]:m-[20px] max-[500px]:m-0 lg:px-2">
          {/* Article Header */}
          <header className="mb-8 mt-[20px] md:mt-[8rem] mx-auto">
            <div className="gap-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl text-left font-black text-[#9E1422] leading mb-5 sm:mb-6 lg:mb-10">
               {article.title}
            </h1>
            {/* <h1 className="text-2xl sm:text-3xl lg:text-[36px] text-left font-black text-[#3C3737] leading mb- sm:mb-6 lg:mb-6">
            {article.intro}  
            </h1> */}

            <div className='flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-0'>
              {/* Left Column - Article Info */}
              <div className="justify-start lg:flex-[2] space-y-6">
                {/* Date */}
                {article.created_at && (
                  <div className="flex items-center gap-2 sm:gap-3 text-gray-600 mb-5 sm:mb-6 lg:mb-8">
                    <div className="w-[80px] h-[80px] sm:w-[80px] sm:h-[80px] lg:w-[96px] lg:h-[96px] px-3.5 py-3.5 sm:px-4 sm:py-4 bg-[#FAF7F5] rounded-lg border border-[#F2EDE9] flex-shrink-0">
                      <img alt='Article Logo' src={ArticleLogo} className="w-full h-full object-contain"/>
                    </div>
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-[11px] sm:text-[12px] font-medium text-[#3C3C3B]">{formatDate(article.created_at)}</span>
                  </div>
                )}

                {/* Tags - Show only first 2 */}
                {article.article_tags && article.article_tags.length > 0 && (
                  <div className="flex flex-col gap-3 sm:gap-3 mb-5 sm:mb-6 lg:mb-8">
                    {article.article_tags.map((tag, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          const tagSlug = tag.slug || tag.name.toLowerCase().replace(/\s+/g, '-');
                          navigate(`/dulwich-life?tags=${tagSlug}`);
                        }}
                        className="px-4 py-2.5 sm:px-4 sm:py-2 max-w-[240px] sm:max-w-[264px] bg-[#FAF7F5] border border-[#F2EDE9] text-[#3C3C3B] text-xs sm:text-sm font-medium rounded-md hover:bg-[#9E1422] hover:text-[#fff] cursor-pointer transition-colors inline-block w-fit"
                      >
                        #{tag.name}
                      </div>
                    ))}
                  </div>
                )}

                {/* Share Button - Desktop Only */}
                <div className="hidden lg:block">

                  <button
                    onClick={() => setTagsOpen(!tagsOpen)}
                    className="flex items-center gap-2 px-4 py-2.5 sm:px-4 sm:py-3 bg-white border-2 border-[#D30013] text-[#D30013] rounded-md hover:bg-[#D30013] hover:text-[#fff] transition-colors w-fit"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <span className="font-medium text-xs sm:text-sm">Share this story</span>
                  </button>

                  {/* Social Share Options (expandable) - Desktop */}
                  {tagsOpen && (
                    <div className="flex flex-wrap gap-3 mt-4">
                      <button
                        onClick={() => handleShare('wechat')}
                        className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-[#09B83E] text-white rounded hover:bg-[#078A2F] transition-colors"
                        aria-label="Share on WeChat"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01.178-.555c1.529-1.119 2.498-2.764 2.498-4.593 0-3.359-3.24-5.949-7.058-5.949zm-2.635 2.379c.535 0 .969.44.969.984 0 .544-.434.985-.969.985a.978.978 0 01-.969-.985c0-.544.434-.984.969-.984zm5.31 0c.536 0 .97.44.97.984 0 .544-.434.985-.97.985a.978.978 0 01-.969-.985c0-.544.433-.984.969-.984z"/>
                        </svg>
                      </button>

                      <button
                        onClick={() => handleShare('linkedin')}
                        className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-[#0077B5] text-white rounded hover:bg-[#006396] transition-colors"
                        aria-label="Share on LinkedIn"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </button>

                      <button
                        onClick={() => handleShare('facebook')}
                        className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-[#1877F2] text-white rounded hover:bg-[#0C63D4] transition-colors"
                        aria-label="Share on Facebook"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Featured Image */}
              <div className="w-full lg:flex-[7] lg:pl-4 mt-0 lg:mt-0" >
                {article.listing_image && (
                  <img
                    src={article.listing_image}
                    alt={article.title}
                    className="w-full h-auto object-cover rounded-lg shadow-lg"
                  />
                )}

                {/* Share Button - Below Image - Mobile Only */}
                <div className="mt-5 lg:hidden">
                  <button
                    onClick={() => setTagsOpen(!tagsOpen)}
                    className="flex items-center gap-2 px-4 py-2.5 sm:px-4 sm:py-3 bg-white border-2 border-[#D30013] text-[#D30013] rounded-md hover:bg-[#D30013] hover:text-[#fff] transition-colors w-fit"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <span className="font-medium text-xs sm:text-sm">Share this story</span>
                  </button>

                  {/* Social Share Options (expandable) - Mobile */}
                  {tagsOpen && (
                    <div className="flex flex-wrap gap-3 mt-4">
                      <button
                        onClick={() => handleShare('wechat')}
                        className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-[#09B83E] text-white rounded hover:bg-[#078A2F] transition-colors"
                        aria-label="Share on WeChat"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01.178-.555c1.529-1.119 2.498-2.764 2.498-4.593 0-3.359-3.24-5.949-7.058-5.949zm-2.635 2.379c.535 0 .969.44.969.984 0 .544-.434.985-.969.985a.978.978 0 01-.969-.985c0-.544.434-.984.969-.984zm5.31 0c.536 0 .97.44.97.984 0 .544-.434.985-.97.985a.978.978 0 01-.969-.985c0-.544.433-.984.969-.984z"/>
                        </svg>
                      </button>

                      <button
                        onClick={() => handleShare('linkedin')}
                        className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-[#0077B5] text-white rounded hover:bg-[#006396] transition-colors"
                        aria-label="Share on LinkedIn"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </button>

                      <button
                        onClick={() => handleShare('facebook')}
                        className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-[#1877F2] text-white rounded hover:bg-[#0C63D4] transition-colors"
                        aria-label="Share on Facebook"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              </div>
            </div>
          </header>

          {/* Render Article Blocks */}
          {blocks && blocks.length > 0 ? (
            <div className="article-blocks-content">
              <BlockRenderer blocks={blocks} />
            </div>
          ) : (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Fallback to legacy content if no blocks */}
              {/* Featured Image */}
              {article.featured_image && (
                <div className="flex justify-center my-8 sm:my-12">
                  <img
                    src={article.featured_image}
                    alt={article.title || 'Article image'}
                    className="w-full max-w-2xl h-auto object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Article Intro */}
              {article.intro && (
                <div className="mb-6 sm:mb-8 text-left text-base sm:text-lg text-[#3C3737] leading-relaxed italic border-l-4 border-[#D30013] pl-4 sm:pl-6">
                  {article.intro}
                </div>
              )}

              {/* Article Content */}
              {article.content && (
                <div
                  className="prose prose-sm sm:prose-base lg:prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                  style={{
                    fontSize: '1rem',
                    lineHeight: '1.75',
                    color: '#1f2937'
                  }}
                />
              )}

              {/* Additional Images/Gallery */}
              {article.gallery && article.gallery.length > 0 && (
                <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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
            </div>
          )}

          {/* Article Footer - Tags and Share Buttons */}
          <footer className="mt-12">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 lg:gap-8">
              {/* Tags Section - Left */}
              {article.article_tags && article.article_tags.length > 0 && (
                <div className="flex-1 w-full lg:w-auto">
                  <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 text-left">Tags</h4>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {article.article_tags.map((tag, index) => (
                      <span
                        key={index}
                        onClick={() => {
                          const tagSlug = tag.slug || tag.name.toLowerCase().replace(/\s+/g, '-');
                          navigate(`/dulwich-life?tags=${tagSlug}`);
                        }}
                        className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 text-gray-700 text-xs sm:text-sm font-medium rounded border border-gray-200 hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Share Buttons Section - Desktop Only */}
              <div className="hidden lg:block">
                <button
                  onClick={() => setTagsOpen(!tagsOpen)}
                  className="flex items-center gap-2 px-4 py-2.5 sm:px-4 sm:py-3 bg-white border-2 border-[#D30013] text-[#D30013] rounded-md hover:bg-[#D30013] hover:text-[#fff] transition-colors w-fit"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span className="font-medium text-xs sm:text-sm">Share this story</span>
                </button>

                {/* Social Share Options (expandable) - Desktop */}
                {tagsOpen && (
                  <div className="flex flex-wrap gap-3 mt-4">
                    <button
                      onClick={() => handleShare('wechat')}
                      className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-[#09B83E] text-white rounded hover:bg-[#078A2F] transition-colors"
                      aria-label="Share on WeChat"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01.178-.555c1.529-1.119 2.498-2.764 2.498-4.593 0-3.359-3.24-5.949-7.058-5.949zm-2.635 2.379c.535 0 .969.44.969.984 0 .544-.434.985-.969.985a.978.978 0 01-.969-.985c0-.544.434-.984.969-.984zm5.31 0c.536 0 .97.44.97.984 0 .544-.434.985-.97.985a.978.978 0 01-.969-.985c0-.544.433-.984.969-.984z"/>
                      </svg>
                    </button>

                    <button
                      onClick={() => handleShare('linkedin')}
                      className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-[#0077B5] text-white rounded hover:bg-[#006396] transition-colors"
                      aria-label="Share on LinkedIn"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </button>

                    <button
                      onClick={() => handleShare('facebook')}
                      className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-[#1877F2] text-white rounded hover:bg-[#0C63D4] transition-colors"
                      aria-label="Share on Facebook"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Share Buttons Section - Mobile Only */}
              <div className="lg:hidden">
                <button
                  onClick={() => setTagsOpen(!tagsOpen)}
                  className="flex items-center gap-2 px-4 py-2.5 sm:px-4 sm:py-3 bg-white border-2 border-[#D30013] text-[#D30013] rounded-md hover:bg-[#D30013] hover:text-[#fff] transition-colors w-fit"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span className="font-medium text-xs sm:text-sm">Share this story</span>
                </button>

                {/* Social Share Options (expandable) - Mobile */}
                {tagsOpen && (
                  <div className="flex flex-wrap gap-3 mt-4">
                    <button
                      onClick={() => handleShare('wechat')}
                      className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-[#09B83E] text-white rounded hover:bg-[#078A2F] transition-colors"
                      aria-label="Share on WeChat"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01.178-.555c1.529-1.119 2.498-2.764 2.498-4.593 0-3.359-3.24-5.949-7.058-5.949zm-2.635 2.379c.535 0 .969.44.969.984 0 .544-.434.985-.969.985a.978.978 0 01-.969-.985c0-.544.434-.984.969-.984zm5.31 0c.536 0 .97.44.97.984 0 .544-.434.985-.97.985a.978.978 0 01-.969-.985c0-.544.433-.984.969-.984z"/>
                      </svg>
                    </button>

                    <button
                      onClick={() => handleShare('linkedin')}
                      className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-[#0077B5] text-white rounded hover:bg-[#006396] transition-colors"
                      aria-label="Share on LinkedIn"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </button>

                    <button
                      onClick={() => handleShare('facebook')}
                      className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-[#1877F2] text-white rounded hover:bg-[#0C63D4] transition-colors"
                      aria-label="Share on Facebook"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </button>
                  </div>
                )}
              </div>


            </div>
          </footer>
        </article>
      </main>

      <PageFooter
        selectedSchool={selectedSchool}
        availableSchools={availableSchools}
        setSelectedSchool={setSelectedSchool}
        setSelectedSchoolSlug={setSelectedSchoolSlug}
      />

      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black text-white text-xs p-2 rounded opacity-50 z-50">
          Slug: {articleSlug} | Locale: {locale}
        </div>
      )}
    </>
  );
};

export default ArticlePageRenderer;
