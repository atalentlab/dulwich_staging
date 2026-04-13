import React, { useState, useEffect } from 'react';
import { fetchAllArticles, fetchArticleTags } from '../../api/articleService';
import { getCurrentSchool } from '../../utils/schoolDetection';
import { useLocation } from 'react-router-dom';

/**
 * Articles Block Component
 * Displays news articles or blog posts in a grid
 * Supports dynamic loading from API with pagination
 */
const ArticlesBlock = ({ content }) => {
  const { heading, articles: staticArticles, template, 'anchor-id': anchorId, slug: contentSlug } = content;
  const location = useLocation();

  // Get current school from subdomain
  const currentSchoolSlug = getCurrentSchool();

  // Determine if this is dulwich-life page by checking URL path
  const isDulwichLifePage = location.pathname.includes('/dulwich-life');

  // Use slug from content, or detect from URL, or fallback to 'dulwich-life'
  const articleSlug = contentSlug || (isDulwichLifePage ? 'dulwich-life' : location.pathname.split('/').pop());

  const locale = (location.pathname.startsWith('/zh/') || location.pathname === '/zh') ? 'zh' : 'en';
  // dulwich-life: 24 (set in service), others: 6
  const initialDisplayCount = isDulwichLifePage ? 24 : 6;

  const [allArticles, setAllArticles] = useState(staticArticles || []);
  const [filteredArticles, setFilteredArticles] = useState(staticArticles || []);
  const [displayedCount, setDisplayedCount] = useState(initialDisplayCount);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  // Update displayed count when page type changes
  useEffect(() => {
    setDisplayedCount(initialDisplayCount);
  }, [initialDisplayCount]);

  // Single API call — only on dulwich-life page, page_no=1
  useEffect(() => {
    if (!isDulwichLifePage) return;
    if (staticArticles && staticArticles.length > 0) return;

    let cancelled = false;
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const articlesResponse = await fetchAllArticles({
          slug: articleSlug,
          locale,
          school: currentSchoolSlug,
        });

        if (cancelled) return;

        const fetchedArticles = articlesResponse.articles || [];
        setAllArticles(fetchedArticles);
        setFilteredArticles(fetchedArticles);

        if (articlesResponse.tags && articlesResponse.tags.length > 0) {
          setTags(articlesResponse.tags);
        } else {
          const tagsResponse = await fetchArticleTags(locale, currentSchoolSlug);
          if (!cancelled) setTags(tagsResponse || []);
        }
      } catch (err) {
        if (cancelled) return;
        setError('Failed to load articles');
        setAllArticles([]);
        setFilteredArticles([]);
        setTags([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadData();
    return () => { cancelled = true; };
  }, [staticArticles, currentSchoolSlug, articleSlug, locale]);

  // Filter articles when tags are selected
  useEffect(() => {
    if (selectedTags.length === 0) {
      setFilteredArticles(allArticles);
    } else {
      const filtered = allArticles.filter(article => {
        if (!article.tags || article.tags.length === 0) return false;

        // Check if article has any of the selected tag IDs
        return article.tags.some(articleTag => {
          // Handle both string tags, tag objects, and tag IDs
          const tagId = typeof articleTag === 'object' && articleTag.id
            ? articleTag.id
            : articleTag;
          return selectedTags.includes(tagId);
        });
      });
      setFilteredArticles(filtered);
    }
    // Reset displayed count when filter changes (use initialDisplayCount)
    setDisplayedCount(initialDisplayCount);
  }, [selectedTags, allArticles, initialDisplayCount]);

  // Load more articles (client-side pagination)
  // dulwich-life: Shows all fetched cards initially (no pagination needed usually)
  // Other pages: Initial 6 cards, then +6 cards each click
  const handleLoadMore = () => {
    setDisplayedCount(prevCount => prevCount + 6);
  };

  // Handle tag selection (using tag ID)
  const handleTagClick = (tagId) => {
    setSelectedTags(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(t => t !== tagId);
      } else {
        return [...prev, tagId];
      }
    });
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedTags([]);
  };

  // Get articles to display
  const articles = filteredArticles.slice(0, displayedCount);
  const hasMore = displayedCount < filteredArticles.length;

  // IMPORTANT: Only render ArticlesBlock on dulwich-life page
  // Don't render on other pages like /world/worldwise-alumni-network/our-alumni-stories
  if (!isDulwichLifePage) {
    return null;
  }

  // Show loading state
  if (loading) {
    return (
      <section data-id={anchorId} className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-gray-600">Loading articles...</div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section data-id={anchorId} className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-red-600">{error}</div>
        </div>
      </section>
    );
  }

  // Don't render if no articles
  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <section data-id={anchorId} className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {heading && (
          <h2 className="text-3xl lg:text-4xl font-normal mb-12 text-center text-gray-900">
            {heading}
          </h2>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Articles Grid */}
        {articles && articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {articles.map((article, index) => {
                // Use listing_image if available, fallback to image
                const articleImage = article.listing_image || article.image;

                return (
                  <article
                    key={article.id || index}
                    className="bg-white rounded overflow-hidden shadow hover:shadow-lg transition-shadow duration-300 group"
                  >
                    {/* Article Image with Label */}
                    {articleImage && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={articleImage}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                        {/* Top Label */}
                        {article.label && (
                          <div className="absolute top-0 left-0 bg-[#9E1422] text-white px-4 py-2">
                            <p className="text-xs font-semibold">{article.label}</p>
                            <p className="text-sm font-bold">{article.labelSubtext}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Article Content */}
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight">
                        {article.title}
                      </h3>
                      {article.intro && (
                        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                          {article.intro}
                        </p>
                      )}
                      <a
                        href={`${locale === 'zh' ? '/zh' : ''}/dulwich-life?slug=${article.slug || article.id}&locale=${locale}&school=${currentSchoolSlug ? currentSchoolSlug : 'beijing'}`}
                        className="inline-block border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-semibold px-4 py-2 text-sm rounded transition-colors duration-200"
                      >
                        {(location.pathname.startsWith('/zh/') || location.pathname === '/zh') ? '阅读更多' : 'Read More'}
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center">
                <button
                  onClick={handleLoadMore}
                  className="inline-block px-8 py-3 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition-colors"
                >
                  Load More
                </button>
              </div>
            )}

            {/* Show total count if available */}
            {filteredArticles.length > 0 && (
              <div className="text-center mt-6 text-gray-600 text-sm">
                Showing {articles.length} of {filteredArticles.length} articles
              </div>
            )}
          </>
        ) : loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin h-8 w-8 border-4 border-red-600 border-t-transparent rounded-full"></div>
            <p className="mt-4 text-gray-600">Loading articles...</p>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            {selectedTags.length > 0 ? 'No articles found with selected tags.' : 'No articles available at this time.'}
          </div>
        )}
      </div>
    </section>
  );
};

export default ArticlesBlock;
