import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import usePageDataQuery from '../hooks/usePageDataQuery';
import PageHeader from '../components/layout/PageHeader';
import PageFooter from '../components/layout/PageFooter';
import BlockRenderer from '../components/blocks/BlockRenderer';
import Loading from '../components/common/Loading';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const HomePage = () => {
  // Fetch all page data using React Query
  // Provides automatic caching, refetching, and loading/error states
  const { pageData, loading, error, refetch, isFetching } = usePageDataQuery('home', 'zh');

  // Refs for scroll animations
  const contentRef = useRef(null);
  const headerScrolled = useRef(false);

  // Initialize GSAP ScrollTrigger animations
  useEffect(() => {
    if (!pageData) return;

    // Refresh ScrollTrigger after page data loads
    ScrollTrigger.refresh();

    // Clean up on unmount
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [pageData]);

  // Loading state
  if (loading) {
    return <Loading />;
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <div className="text-red-500 mb-4">
            <svg
              className="mx-auto h-16 w-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={refetch}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">No page data available.</p>
      </div>
    );
  }

  // Destructure page data
  const { header, blocks, footer } = pageData;

  // Success state - render the full page
  return (
    <div className="page-wrapper" ref={contentRef}>
      {/* Header - consumes header data from same API response */}
      <PageHeader headerData={header} />


      <BlockRenderer blocks={blocks} />


      {/* Footer - consumes footer data from same API response */}
      <PageFooter footerData={footer} />
    </div>
  );
};

export default HomePage;
