import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchAllArticles, fetchArticleTags } from '../../api/articleService';
import { getCurrentSchool } from '../../utils/schoolDetection';
import loadingSpinner from '../../assets/images/loading_spinner.gif';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://www.dulwich-frontend.atalent.xyz';

/**
 * TemplateBlock Component
 * Displays content based on a template type (e.g., network-news, school-news, events, etc.)
 *
 * API Response:
 * {
 *   "type": "template",
 *   "content": {
 *     "template": "network-news" or "school-news",
 *     "pretag-id": ["13"],
 *     "anchor-id": null
 *   }
 * }
 */
const TemplateBlock = ({ content }) => {
  const { template, 'pretag-id': pretagId = [], 'anchor-id': anchorId } = content;
  console.log(content);
  console.log('TemplateBlock content:', content);

  // Read tag from navigation state (passed from ArticlePageRenderer)
  const location = useLocation();
  const navigate = useNavigate();
  const tagFromState = location.state?.tag || null;

  // Parse locale from URL path (e.g. /zh/homepage/scroll-page → 'zh')
  const supportedLocales = ['zh', 'en', 'cn'];
  const pathSegments = location.pathname.replace(/^\/|\/$/g, '').split('/');
  const locale = supportedLocales.includes(pathSegments[0]?.toLowerCase())
    ? pathSegments[0].toLowerCase()
    : 'en';

  // Parse tags from URL query parameter
  const getTagSlugsFromUrl = () => {
    const params = new URLSearchParams(location.search);
    const tagsParam = params.get('tags');
    console.log('🔍 TemplateBlock URL Parsing:');
    console.log('- location.search:', location.search);
    console.log('- tagsParam:', tagsParam);
    const slugs = tagsParam ? tagsParam.split(',').map(t => t.trim()) : [];
    console.log('- Parsed slugs:', slugs);
    return slugs;
  };

  // Get current school from subdomain
  const currentSchoolSlug = getCurrentSchool();

  const [articles, setArticles] = useState([]); // Articles currently displayed
  const [maindata, setMaindata] = useState([]); // Articles currently displayed
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  // Filter & Pagination State
  const [tags, setTags] = useState([]); // Available tags definitions
  const [selectedTags, setSelectedTags] = useState([]); // Selected filter tags IDs
  const [pageNo, setPageNo] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showTagsFilter, setShowTagsFilter] = useState(false); // Toggle tags dropdown
  const [isInitialLoad, setIsInitialLoad] = useState(true); // Track if this is the first load

  const dropdownRef = useRef(null); // Ref for the scrollable dropdown

  const ARTICLES_PER_PAGE = 6;
  const INITIAL_ARTICLES_COUNT = 20; // Show 20 articles initially

  // Load Tags on Mount
  useEffect(() => {
    const loadTags = async () => {
      if (template === 'network-news' || template === 'school-news') {
        try {
          // Add CMS suffix to school parameter if present
          const cmsSuffix = process.env.REACT_APP_SCHOOL_CMS_SUFFIX || '-cms';
          const schoolParam = currentSchoolSlug ? `${currentSchoolSlug}${cmsSuffix}` : null;

          // Fetch school-specific tags and global tags in parallel
          const [schoolTags, globalTags] = await Promise.all([
            fetchArticleTags(locale, schoolParam).catch(() => []),
            fetchArticleTags(locale).catch(() => []),
          ]);
          // Merge both, deduplicated by id
          const merged = [...(globalTags || [])];
          const globalIds = new Set(merged.map(t => String(t.id)));
          (schoolTags || []).forEach(t => {
            if (!globalIds.has(String(t.id))) merged.push(t);
          });
          setTags(merged);

          // Apply pretag-id only for IDs that exist in the loaded tags list
          if (pretagId.length > 0) {
            const loadedIds = new Set(merged.map(t => String(t.id)));
            const validPretagIds = pretagId.map(String).filter(id => loadedIds.has(id));
            if (validPretagIds.length > 0) {
              setSelectedTags(validPretagIds);
            }
          }
        } catch (err) {
          console.error('Error loading tags:', err);
        }
      }
    };
    loadTags();
  }, [template]);

  // Auto-select tag from navigation state after tags are loaded
  useEffect(() => {
    if (tagFromState && tags.length > 0) {
      const matchedTag = tags.find(
        (t) => t.title.toLowerCase() === tagFromState.toLowerCase()
      );
      if (matchedTag && !selectedTags.includes(String(matchedTag.id))) {
        setSelectedTags([String(matchedTag.id)]);
        setShowTagsFilter(true);
      }
      // Clear the navigation state so tags don't persist on reload
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [tagFromState, tags]);

  // Initialize selected tags from URL when tags are loaded
  useEffect(() => {
    console.log('🏷️ TemplateBlock Tag Matching Effect Triggered');
    console.log('🏷️ Tags available:', tags.length);

    if (tags.length > 0) {
      const urlTagSlugs = getTagSlugsFromUrl();
      console.log('🏷️ URL tag slugs:', urlTagSlugs);
      console.log('🏷️ Available tags (first 5):', tags.slice(0, 5));

      if (urlTagSlugs.length > 0) {
        // Simple direct slug matching - find tags where slug matches URL value
        const matchedTagIds = [];

        console.log('🔍 Starting tag matching process...');
        urlTagSlugs.forEach(urlSlug => {
          console.log(`  Searching for tag with slug: "${urlSlug}"`);

          const matchedTag = tags.find(tag => {
            console.log(`    Comparing with tag: {id: ${tag.id}, slug: "${tag.slug}", title: "${tag.title}"}`);
            return tag.slug === urlSlug;
          });

          if (matchedTag) {
            console.log(`  ✅ Match found: tag "${matchedTag.title}" (ID: ${matchedTag.id}, slug: "${matchedTag.slug}")`);
            matchedTagIds.push(String(matchedTag.id));
          } else {
            console.warn(`  ⚠️ No tag found with slug "${urlSlug}"`);
            console.warn(`  Available slugs:`, tags.map(t => t.slug).slice(0, 10));
          }
        });

        console.log('🏷️ Matched tag IDs from URL:', matchedTagIds);

        if (matchedTagIds.length > 0) {
          console.log('✅ Setting selected tags:', matchedTagIds);
          setSelectedTags(matchedTagIds);
          // Don't auto-open dropdown when tags are from URL
          // setShowTagsFilter(true);
        } else {
          console.warn('⚠️ No matching tags found for URL slugs:', urlTagSlugs);
        }
      } else {
        // No tags in URL, check if we need to clear selection
        // Only clear if not from pretag-id or navigation state
        if (!tagFromState && pretagId.length === 0) {
          console.log('🏷️ No tags in URL and no pretag, clearing selection');
          setSelectedTags([]);
        }
      }
    } else {
      console.log('⚠️ No tags available yet');
    }
  }, [tags, location.search]);

  // Fetch Articles when Filters (selectedTags) Change or on Filter Reset
  // This resets the list and fetches page 1
  useEffect(() => {
    const fetchInitialArticles = async () => {
      if (template === 'network-news' || template === 'school-news') {
        setLoading(true);
        setError(null);
        setPageNo(1); // Reset page
        setHasMore(true);
        setIsInitialLoad(true); // Mark as initial load

        try {
          // For initial load, fetch multiple pages to get 20 articles
          // Fetch 3 pages (10 articles each) to get 20+ articles
          const allArticlesData = [];
          let mainData = null;
          let responseTags = [];

          console.log('Starting initial fetch of articles...');

          // Add CMS suffix to school parameter if present
          const cmsSuffix = process.env.REACT_APP_SCHOOL_CMS_SUFFIX || '-cms';
          const schoolParam = currentSchoolSlug ? `${currentSchoolSlug}${cmsSuffix}` : null;

          for (let page = 1; page <= 3; page++) {
            const response = await fetchAllArticles({
              slug: 'dulwich-life',
              locale: locale,
              school: schoolParam,
              limit: 10, // 10 articles per page
              page_no: page,
              tags: selectedTags
            });

            const newArticles = response.articles || [];

            // Get main data and tags from first response
            if (page === 1) {
              mainData = response.main || null;
              responseTags = response.tags || [];
              console.log('Fetched Main Data:', mainData);
            }

            if (newArticles.length > 0) {
              allArticlesData.push(...newArticles);
              console.log(`Page ${page}: Added ${newArticles.length} articles`);
            }

            // Stop if we got less than expected (no more pages)
            if (newArticles.length < 10) {
              console.log(`Stopping at page ${page} - no more articles`);
              break;
            }
          }

          console.log('✅ Total articles fetched:', allArticlesData.length);

          const newArticles = allArticlesData;
          const main = mainData;
          setMaindata(main);
          setPageNo(3); // We've fetched 3 pages

          // Merge tags from articles response into tags state to cover any missing ones
          if (responseTags.length > 0) {
            setTags(prev => {
              const existingIds = new Set(prev.map(t => String(t.id)));
              const missing = responseTags.filter(t => !existingIds.has(String(t.id)));
              return missing.length > 0 ? [...prev, ...missing] : prev;
            });
          }

          // If no articles found with selected tags, clear the tags and show all
          if (newArticles.length === 0 && selectedTags.length > 0) {
            setSelectedTags([]);
            return;
          }

          setArticles(newArticles);
          setIsInitialLoad(false); // Initial load complete

          // Determine if there might be more
          // Since we fetched 3 pages, check if the last page had less than 10 articles
          if (newArticles.length < 20) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }

        } catch (err) {
          console.error('Error loading articles:', err);
          setError('Failed to load articles');
          setArticles([]);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchInitialArticles();
  }, [selectedTags, template, currentSchoolSlug, locale]);


  // Load More Articles (Pagination)
  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    const nextPage = pageNo + 1;

    try {
      // Add CMS suffix to school parameter if present
      const cmsSuffix = process.env.REACT_APP_SCHOOL_CMS_SUFFIX || '-cms';
      const schoolParam = currentSchoolSlug ? `${currentSchoolSlug}${cmsSuffix}` : null;

      const response = await fetchAllArticles({
        slug: 'dulwich-life',
        locale: locale,
        school: schoolParam,
        limit: ARTICLES_PER_PAGE,
        page_no: nextPage,
        tags: selectedTags
      });

      const newArticles = response.articles || [];


      if (newArticles.length > 0) {
        setArticles(prev => [...prev, ...newArticles]);
        setPageNo(nextPage);

        if (newArticles.length < ARTICLES_PER_PAGE) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }

    } catch (err) {
      console.error('Error loading more articles:', err);
    } finally {
      setLoadingMore(false);
    }
  };


  // Update URL query parameters with selected tag slugs
  const updateUrlWithTags = (tagIds) => {
    const params = new URLSearchParams(location.search);

    if (tagIds.length > 0) {
      // Convert tag IDs to slugs
      const tagSlugs = tags
        .filter(tag => tagIds.includes(String(tag.id)))
        .map(tag => tag.slug || '')
        .filter(slug => slug);

      if (tagSlugs.length > 0) {
        params.set('tags', tagSlugs.join(','));
      } else {
        params.delete('tags');
      }
    } else {
      params.delete('tags');
    }

    // Update URL without page reload
    const newSearch = params.toString();
    const newUrl = newSearch ? `${location.pathname}?${newSearch}` : location.pathname;
    navigate(newUrl, { replace: true });
  };

  // Handle tag selection (using tag ID)
  const handleTagClick = (tagId) => {
    const id = String(tagId);
    setSelectedTags(prev => {
      const newSelectedTags = prev.includes(id)
        ? prev.filter(t => t !== id)
        : [...prev, id];

      // Update URL with tag slugs
      updateUrlWithTags(newSelectedTags);

      return newSelectedTags;
    });
  };

  // Prevent scroll propagation from dropdown
  useEffect(() => {
    const dropdown = dropdownRef.current;
    if (!dropdown) return;

    const handleWheel = (e) => {
      // Stop the event from bubbling up to the window listener in TestPage.js
      e.stopPropagation();
    };

    // We use { passive: false } but since we want the default behavior (scrolling)
    // we do NOT call preventDefault(). We only stop propagation.
    dropdown.addEventListener('wheel', handleWheel, { passive: false });

    // Also handle touchmove for mobile
    dropdown.addEventListener('touchmove', handleWheel, { passive: false });

    return () => {
      dropdown.removeEventListener('wheel', handleWheel);
      dropdown.removeEventListener('touchmove', handleWheel);
    };
  }, [showTagsFilter]); // Re-bind if visibility changes (though ref stays same, good practice)


  if (!template) {
    return null;
  }

  // Initial loading state
  if (loading && articles.length === 0) {
    return (
      <section data-id={anchorId} className="py-16 px-4 bg-[#FAF7F5]">
        <div className="max-w-[1120px] mx-auto text-center">
          <div className="text-gray-600 py-12">
            <img src={loadingSpinner} alt="Loading..." className="inline-block h-[200px] w-auto" />
            {/* <p className="mt-4">Loading articles...</p> */}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section data-id={anchorId} className="py-16 px-4 bg-[#FAF7F5]">
      <div className="max-w-[1120px] mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-left font-bold lg:text-[50px] max-w-[900px] font-weight-900 text-[#3C3737] mb-4 leading-none">
            {maindata.intro}
          </h2>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Filter Section - Top Bar Layout */}
        <div className="mb-6">
          {/* Top row: Tags button + selected pills inline */}
          <div className="flex flex-wrap items-start gap-3">
            {/* Tags Dropdown */}
            <div className="relative flex-shrink-0 z-20">
              {/* Trigger button */}
              <button
                onClick={() => setShowTagsFilter(!showTagsFilter)}
                className="flex items-center justify-between w-[352px] h-[64px] px-5 bg-white border rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#3C3C3B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span className="text-base font-semibold text-[#3C3C3B]">Tags</span>
                </div>
                <svg
                  className={`w-5 h-5 text-[#D30013] transition-transform duration-300 ${showTagsFilter ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Tags List — floats over content */}
              <div
                className={`absolute top-full left-0 mt-1 w-[352px] bg-white border rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${showTagsFilter ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                  }`}
              >
                <div
                  ref={dropdownRef}
                  className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
                >
                  {tags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => handleTagClick(tag.id)}
                      className={`block w-full text-left px-4 py-3 text-base border-b border-gray-200 last:border-b-0 transition ${selectedTags.includes(String(tag.id))
                        ? 'bg-gray-300 text-gray-900 font-medium'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      {tag.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected Tags Display — inline with the dropdown */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {selectedTags.map((tagId) => {
                  const tagObj = tags.find((t) => String(t.id) === tagId);
                  return (
                    <div
                      key={tagId}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 rounded-lg font-medium hover:border-[#9E1422] hover:shadow-md transition"
                    >
                      <button
                        onClick={() => handleTagClick(tagId)}
                        className="flex items-center gap-2 text-base text-gray-900 hover:text-[#9E1422]"
                      >
                        <svg className="w-4 h-4 text-[#9E1422]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>{tagObj ? tagObj.title : tagId}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Content Area - Full Width */}
        <div className="flex-1">
          {/* News Grid */}
          {articles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {articles.map((item, index) => {
                  // Use listing_image if available, fallback to image
                  const articleImage = item.listing_image || item.image;

                  return (
                    <article
                      key={`${item.id}-${index}`}
                      className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-300 group flex flex-col h-full"
                    >
                      {/* Article Image with Label */}
                      <div className="relative h-48 overflow-hidden flex-shrink-0">
                        {articleImage ? (
                          <img
                            src={articleImage}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400">No Image</span>
                          </div>
                        )}
                        {/* Top Label */}
                        {item.label && (
                          <div className="absolute top-0 left-0 bg-[#9E1422] text-white px-4 py-2">
                            <p className="text-xs font-semibold">{item.label}</p>
                            <p className="text-sm font-bold">{item.labelSubtext}</p>
                          </div>
                        )}
                      </div>

                      {/* Article Content */}
                      <div className="p-6 text-left flex flex-col flex-1">
                        <h3 className="text-lg font-semi-bold text-[#000] mb-3 leading-tight">
                          {item.title}
                        </h3>
                        {item.intro && (
                          <div className="text-sm text-gray-600 mb-4 leading-relaxed flex-1 line-clamp-3">
                            {item.intro}
                          </div>
                        )}
                        <div className="mt-auto pt-4">
                          <a
                            href={(() => {
                              const path = item.url || `/article/${item.slug || item.id}`;
                              const normalizedPath = path.startsWith('/') ? path : `/${path}`;
                              const localePrefix = locale && locale !== 'en' ? `/${locale}` : '';
                              return `${window.location.origin}${localePrefix}${normalizedPath}`;
                            })()}
                            className="inline-block border border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-semibold px-4 py-2 text-sm transition-colors duration-200 rounded-lg shadow"
                          >
                            Read More
                          </a>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center">
                  {loadingMore ? (
                    <img src={loadingSpinner} alt="Loading..." className="inline-block h-[140px] w-[140px]" />
                  ) : (
                    <button
                      onClick={handleLoadMore}
                      className="inline-block px-8 py-3 bg-[#d30014] text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Load More
                    </button>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
              {selectedTags.length > 0 ? 'No articles found with selected tags.' : 'No articles available.'}
            </div>
          )}
        </div>

        {/* Debug info */}
        {pretagId.length > 0 && process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Template:</strong> {template} | <strong>Pretag IDs:</strong> {pretagId.join(', ')}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TemplateBlock;