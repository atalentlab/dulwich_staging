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

  // Different initial count based on whether it's dulwich-life page
  // dulwich-life: show all fetched cards (up to 40), others: show 6 cards
  const initialDisplayCount = isDulwichLifePage ? 999 : 6;

  const [allArticles, setAllArticles] = useState(staticArticles || []); // All articles
  const [filteredArticles, setFilteredArticles] = useState(staticArticles || []); // Filtered articles
  const [displayedCount, setDisplayedCount] = useState(initialDisplayCount); // Initial count based on slug
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tags, setTags] = useState([]); // Available tags
  const [selectedTags, setSelectedTags] = useState([]); // Selected filter tags

  // Update displayed count when page type changes
  useEffect(() => {
    setDisplayedCount(initialDisplayCount);
  }, [isDulwichLifePage, initialDisplayCount]);

  // Fetch all articles and tags from API
  useEffect(() => {
    const loadData = async () => {
      // Only fetch if no static articles provided
      if (!staticArticles || staticArticles.length === 0) {
        setLoading(true);
        setError(null);

        try {
          const allArticlesData = [];
          let allTagsData = [];

          console.log(`Starting to fetch articles for ${articleSlug}...`);
          console.log(`Is dulwich-life page: ${isDulwichLifePage}`);

          // Different fetch strategy based on page type
          if (isDulwichLifePage) {
            // dulwich-life: Fetch 4 pages (40 articles total)
            for (let page = 1; page <= 4; page++) {
              console.log(`Fetching dulwich-life page ${page}...`);

              const articlesResponse = await fetchAllArticles({
                slug: articleSlug,
                locale: 'en',
                school: currentSchoolSlug,
                limit: 10, // 10 articles per page
                page_no: page
              });

              console.log(`Page ${page} response:`, articlesResponse);

              if (articlesResponse.articles && articlesResponse.articles.length > 0) {
                allArticlesData.push(...articlesResponse.articles);
                console.log(`Added ${articlesResponse.articles.length} articles from page ${page}`);
              }

              // Get tags from first response
              if (page === 1 && articlesResponse.tags) {
                allTagsData = articlesResponse.tags;
              }

              // Stop if we got less than expected (no more pages)
              if (!articlesResponse.articles || articlesResponse.articles.length < 10) {
                console.log(`Stopping at page ${page} - no more articles`);
                break;
              }
            }
          } else {
            // Other pages: Fetch only 1 page with 6 articles
            console.log(`Fetching single page for ${articleSlug} (NOT dulwich-life)...`);

            const articlesResponse = await fetchAllArticles({
              slug: articleSlug,
              locale: 'en',
              school: currentSchoolSlug,
              limit: 6, // Only 6 articles for other pages
              page_no: 1
            });

            console.log('Page 1 response:', articlesResponse);

            if (articlesResponse.articles && articlesResponse.articles.length > 0) {
              allArticlesData.push(...articlesResponse.articles);
              console.log(`Added ${articlesResponse.articles.length} articles`);
            }

            // Get tags from response
            if (articlesResponse.tags) {
              allTagsData = articlesResponse.tags;
            }
          }

          console.log('✅ Fetched total articles:', allArticlesData.length);

          setAllArticles(allArticlesData);
          setFilteredArticles(allArticlesData);

          // If tags not in articles response, fetch separately
          if (!allTagsData || allTagsData.length === 0) {
            const tagsResponse = await fetchArticleTags('en', currentSchoolSlug);
            setTags(tagsResponse || []);
          } else {
            setTags(allTagsData);
          }
        } catch (err) {
          console.error('Error loading data:', err);
          setError('Failed to load articles');
          setAllArticles([]);
          setFilteredArticles([]);
          setTags([]);
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [staticArticles, currentSchoolSlug, articleSlug, isDulwichLifePage]);

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
                        href={article.url || `/article/${article.slug || article.id}`}
                        className="inline-block border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-semibold px-4 py-2 text-sm rounded transition-colors duration-200"
                      >
                        Read More
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
