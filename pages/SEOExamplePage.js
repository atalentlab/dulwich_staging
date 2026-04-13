import React from 'react';
import DynamicSEO from '../components/SEO/DynamicSEO';
import LinkPreviewCard from '../components/SEO/LinkPreviewCard';
import useFetchSEOData from '../hooks/useFetchSEOData';
import Loading from '../components/common/Loading';

/**
 * Example Page: Dynamic SEO with API Data
 *
 * This page demonstrates how to:
 * 1. Fetch SEO data from API
 * 2. Use DynamicSEO component with API data
 * 3. Display a preview card (bonus feature)
 * 4. Handle loading and error states
 * 5. Fallback to static defaults when API fails
 */
const SEOExamplePage = () => {
  // Example API endpoint (replace with your actual API)
  const apiUrl = `${process.env.REACT_APP_API_URL}/api/seo/page-meta?slug=stem-se21`;

  // Fetch SEO data from API
  const { data: seoData, loading, error } = useFetchSEOData(apiUrl);

  // Prepare SEO props (use API data or fallback to defaults)
  const seoProps = {
    title: seoData?.title || undefined,
    description: seoData?.description || undefined,
    image: seoData?.image || undefined,
    url: seoData?.url || window.location.href,
    type: seoData?.type || 'website',
    locale: seoData?.locale || 'zh_CN',
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {/* Apply Dynamic SEO Meta Tags */}
      <DynamicSEO {...seoProps} />

      {/* Page Content */}
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Dynamic SEO Example Page
            </h1>
            <p className="text-lg text-gray-600">
              This page demonstrates dynamic Open Graph meta tags
            </p>
          </div>

          {/* SEO Data Status */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              SEO Data Status
            </h2>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-700">
                  <strong>Error fetching SEO data:</strong> {error}
                </p>
                <p className="text-sm text-red-600 mt-2">
                  Using static fallback values instead.
                </p>
              </div>
            )}

            {seoData ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-700 font-medium mb-2">
                  ✓ SEO data loaded successfully from API
                </p>
                <div className="bg-white rounded p-3 mt-3">
                  <pre className="text-xs text-gray-700 overflow-x-auto">
                    {JSON.stringify(seoData, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-700">
                  ⚠ No API data available. Using static fallback values.
                </p>
              </div>
            )}
          </div>

          {/* Link Preview Card (Bonus Feature) */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Link Preview (WhatsApp/Facebook Style)
            </h2>
            <LinkPreviewCard
              title={seoProps.title}
              description={seoProps.description}
              image={seoProps.image}
              url={seoProps.url}
            />
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-3">
              📘 How to Test Open Graph Tags
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-blue-800">
              <li>Copy the current page URL</li>
              <li>
                Open{' '}
                <a
                  href="https://www.opengraph.xyz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-medium"
                >
                  OpenGraph.xyz
                </a>{' '}
                or{' '}
                <a
                  href="https://developers.facebook.com/tools/debug/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-medium"
                >
                  Facebook Debugger
                </a>
              </li>
              <li>Paste the URL and check the preview</li>
              <li>
                <strong>Important:</strong> OG tags won't work on localhost or
                with CSR apps in production!
              </li>
            </ol>
          </div>

          {/* Meta Tags Display */}
          <div className="bg-white rounded-lg shadow p-6 mt-8">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Applied Meta Tags
            </h3>
            <div className="bg-gray-50 rounded p-4 font-mono text-xs overflow-x-auto">
              <div className="space-y-1 text-gray-700">
                <div>&lt;title&gt;{seoProps.title}&lt;/title&gt;</div>
                <div>&lt;meta property="og:title" content="{seoProps.title}" /&gt;</div>
                <div>&lt;meta property="og:description" content="{seoProps.description}" /&gt;</div>
                <div>&lt;meta property="og:image" content="{seoProps.image}" /&gt;</div>
                <div>&lt;meta property="og:url" content="{seoProps.url}" /&gt;</div>
                <div>&lt;meta property="og:type" content="{seoProps.type}" /&gt;</div>
                <div>&lt;meta name="twitter:card" content="summary_large_image" /&gt;</div>
                <div>&lt;meta name="twitter:title" content="{seoProps.title}" /&gt;</div>
                <div>&lt;meta name="twitter:image" content="{seoProps.image}" /&gt;</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SEOExamplePage;
