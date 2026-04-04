import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { MoveDiagonal } from 'lucide-react';
import Icon from '../Icon';
import Icon1 from '../Icon';
import AOS from 'aos';
import 'aos/dist/aos.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://cms.dulwich.org';

/**
 * TaxonomyBlock Component
 * Displays categorized content based on taxonomy
 *
 * Features:
 * - Supports HTML rendering in description, subtitle, and content fields
 * - Responsive grid layout for terms
 * - Loading states and error handling
 * - Locale-aware content fetching
 *
 * API Response:
 * {
 *   "type": "taxonomy",
 *   "content": {
 *     "title": "Test block 23",
 *     "description": "Description text...",
 *     "taxonomy": "19",
 *     "taxonomy_type": 2,
 *     "anchor-id": null
 *   }
 * }
 *
 * Term Data (from API):
 * {
 *   "id": 124,
 *   "title": "Aaron Blaise | Dulwich College International",
 *   "subtitle": "<p>Oscar-nominated Walt Disney artist</p>",
 *   "content": "<p>Aaron Blaise is an animation feature film director...</p>",
 *   "image": "https://...",
 *   "slug": "aaron-blaise"
 * }
 */
const ITEMS_PER_VIEW = 8;
const API_PAGE_SIZE = 10;

const TaxonomyBlock = ({ content }) => {
  const { title, description, taxonomy, taxonomy_type: taxonomyType, 'anchor-id': anchorId, search } = content;
  const location = useLocation();
  const [allTerms, setAllTerms] = useState([]);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_VIEW);
  const [currentApiPage, setCurrentApiPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedStory, setSelectedStory] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownClosing, setIsDropdownClosing] = useState(false);
  const scrollableContentRef = useRef(null);
  const dropdownRef = useRef(null);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startScrollTop = useRef(0);

  // Determine locale based on URL path
  const isChineseVersion = location.pathname.startsWith('/zh/') || location.pathname === '/zh';
  const locale = isChineseVersion ? 'zh' : 'en';

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: 'ease-out',
      once: false,
      mirror: false,
    });
  }, []);

  // Refresh AOS when terms change
  useEffect(() => {
    AOS.refresh();
  }, [allTerms]);

  const handleDropdownClose = () => {
    setIsDropdownClosing(true);
    setTimeout(() => {
      setIsDropdownOpen(false);
      setIsDropdownClosing(false);
    }, 180);
  };

  const handleFilterSelect = (filterId) => {
    setIsDropdownClosing(true);
    setTimeout(() => {
      setSelectedFilter(filterId);
      setIsDropdownOpen(false);
      setIsDropdownClosing(false);
    }, 180);
  };

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startY.current = e.clientY;
    startScrollTop.current = scrollableContentRef.current.scrollTop;
    scrollableContentRef.current.style.cursor = 'grabbing';
    scrollableContentRef.current.style.userSelect = 'none';
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const delta = startY.current - e.clientY;
    scrollableContentRef.current.scrollTop = startScrollTop.current + delta;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    if (scrollableContentRef.current) {
      scrollableContentRef.current.style.cursor = 'grab';
      scrollableContentRef.current.style.userSelect = '';
    }
  };

  // Lock body scroll using position:fixed (works reliably in Next.js)
  useEffect(() => {
    if (selectedStory === null) return;

    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      window.scrollTo(0, scrollY);
    };
  }, [selectedStory]);

  // Reset scroll to top when navigating between stories
  useEffect(() => {
    if (scrollableContentRef.current) {
      scrollableContentRef.current.scrollTop = 0;
    }
  }, [selectedStory]);

  // Release drag if mouse released outside the scroll area
  useEffect(() => {
    const onGlobalMouseUp = () => handleMouseUp();
    window.addEventListener('mouseup', onGlobalMouseUp);
    return () => window.removeEventListener('mouseup', onGlobalMouseUp);
  }, []);


  // Direct wheel listener on scroll container so mouse/trackpad scroll works
  useEffect(() => {
    const el = scrollableContentRef.current;
    if (!el || selectedStory === null) return;

    const onWheel = (e) => {
      e.stopPropagation();
      el.scrollTop += e.deltaY;
    };

    el.addEventListener('wheel', onWheel, { passive: true });
    return () => el.removeEventListener('wheel', onWheel);
  }, [selectedStory]);

  useEffect(() => {
    if (taxonomy) {
      fetchSchools();
      fetchTaxonomyTerms(selectedFilter, 1, true);
    }
  }, [taxonomy, locale]);

  useEffect(() => {
    if (taxonomy) {
      fetchTaxonomyTerms(selectedFilter, 1, true);
    }
  }, [selectedFilter, locale]);

  const fetchSchools = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/get_schools_by_taxonomy?taxonomy_id=${taxonomy}&locale=${locale}`
      );

      // Handle 404 or other HTTP errors
      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`[TaxonomyBlock] Schools endpoint not found (404) for taxonomy ${taxonomy}`);
          // Fallback: Use schools from context or empty array
          setSchools([]);
          return;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success && data.data && data.data.schools) {
        setSchools(data.data.schools);
      } else {
        // API returned success but no schools data
        setSchools([]);
      }
    } catch (error) {
      console.error('[TaxonomyBlock] Error fetching schools:', error.message);
      setSchools([]);
    }
  };

  const fetchTaxonomyTerms = async (filter, page = 1, reset = false) => {
    try {
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      let url = `${API_BASE_URL}/api/get_term_by_taxonomy?taxonomy_id=${taxonomy}&page_no=${page}&locale=${locale}`;
      if (filter && filter !== 'All') {
        url += `&school_id=${filter}`;
      }

      const response = await fetch(url);

      // Handle 404 or other HTTP errors
      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`[TaxonomyBlock] Terms endpoint not found (404) for taxonomy ${taxonomy}`);
          setAllTerms([]);
          setLoading(false);
          setLoadingMore(false);
          return;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      const fetched = (data.success && data.data && data.data.terms) ? data.data.terms : [];

      if (reset) {
        setAllTerms(fetched);
        setVisibleCount(ITEMS_PER_VIEW);
        setCurrentApiPage(1);
        setHasMorePages(fetched.length >= API_PAGE_SIZE);
      } else {
        setAllTerms(prev => [...prev, ...fetched]);
        setCurrentApiPage(page);
        setHasMorePages(fetched.length >= API_PAGE_SIZE);
      }
    } catch (error) {
      console.error('Error fetching taxonomy terms:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = async () => {
    const nextVisible = visibleCount + ITEMS_PER_VIEW;

    if (nextVisible > allTerms.length && hasMorePages) {
      const nextPage = currentApiPage + 1;
      await fetchTaxonomyTerms(selectedFilter, nextPage, false);
    }

    setVisibleCount(nextVisible);
  };

  const terms = allTerms;

  if (!title && !description && terms.length === 0) {
    return null;
  }

  return (
    <section data-id={anchorId} className="py-2 md:py-10 px-4 bg-white">
      <style>{`
        /* Ensure HTML content renders properly */
        .taxonomy-html-content p {
          margin-bottom: 0.5rem;
        }
        .taxonomy-html-content p:last-child {
          margin-bottom: 0;
        }
        .taxonomy-html-content strong {
          font-weight: 600;
        }
        .taxonomy-html-content em {
          font-style: italic;
        }
        .taxonomy-html-content ul,
        .taxonomy-html-content ol {
          margin-left: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .taxonomy-html-content a {
          color: #fff;
          text-decoration: underline;
        }
        .taxonomy-html-content a:hover {
          color: #ddd;
        }

        /* Custom scrollbar for dropdown */
        .overflow-y-auto::-webkit-scrollbar {
          width: 8px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 4px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #D30013;
          border-radius: 4px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #B8000F;
        }

        /* Ensure dropdown is scrollable and receives mouse events */
        .overflow-y-auto {
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
        }

        /* Prevent layout shift during dropdown animations */
        .relative {
          contain: layout;
        }
      `}</style>
      <div className="max-w-[1376px] mx-auto">
        {/* Header with Title and Filter */}
        <div className="flex text-left mx-auto items-start mb-4">
          {title && (
            <h2
              className="flex m-auto max-w-[1120px] w-[100%] text-left text-[28px] sm:text-[32px] md:text-[40px] lg:text-[50px] font-bold text-[#9E1422]"
              dangerouslySetInnerHTML={{ __html: title }}
            />
          )}

          {search === "1" && (
            <div className="relative text-left" ref={dropdownRef} style={{ isolation: 'isolate' }}>
              <button
                onClick={() => !isDropdownClosing && setIsDropdownOpen(!isDropdownOpen)}
                className="bg-[#eaeaea] text-[#3C3737] border rounded-lg px-6 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[#D30013] focus:border-transparent cursor-pointer min-w-[200px] text-left font-medium hover:bg-[#D30013] transition-colors"
                style={{ willChange: 'auto' }}
              >
                {selectedFilter === 'All' ? 'All Types' : schools.find(s => s.id === selectedFilter)?.title || 'All Types'}
                <svg
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {(isDropdownOpen || isDropdownClosing) && (
                <>
                  {/* Backdrop overlay with fade animations */}
                  <div
                    className={`fixed inset-0 bg-black z-[100] transition-opacity duration-150 ${
                      isDropdownClosing ? 'opacity-0' : 'opacity-30'
                    }`}
                    onClick={handleDropdownClose}
                    style={{ willChange: 'opacity' }}
                  />

                  {/* Dropdown Menu with slide animations and smooth scroll */}
                  <div
                    className={`absolute z-[101] w-full min-w-[200px] mt-2 bg-white border border-gray-300 rounded-lg shadow-2xl max-h-[400px] overflow-y-auto overflow-x-hidden transition-all duration-150 ease-out ${
                      isDropdownClosing ? 'opacity-0 scale-95 translate-y-[-4px]' : 'opacity-100 scale-100 translate-y-0'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                    onWheel={(e) => e.stopPropagation()}
                    style={{
                      scrollBehavior: 'smooth',
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#D30013 #f3f4f6',
                      pointerEvents: 'auto',
                      willChange: 'transform, opacity',
                      transformOrigin: 'top'
                    }}
                  >
                    <button
                      onClick={() => handleFilterSelect('All')}
                      className={`w-full px-6 py-3 cursor-pointer transition-all duration-150 ${
                        selectedFilter === 'All'
                          ? 'bg-[#FFF5F5] text-[#D30013] font-semibold'
                          : 'text-[#3C3C3B] hover:bg-[#FAF7F5]'
                      } border-b border-gray-200 rounded-t-lg`}
                    >
                      <div className="flex items-center text-left">
                        {selectedFilter === 'All' && (
                          <span className="mr-2 text-[#D30013] font-bold">✓</span>
                        )}
                        All Types
                      </div>
                    </button>

                    {schools.map((school, index) => (
                      <button
                        key={school.id}
                        onClick={() => handleFilterSelect(school.id)}
                        className={`w-full px-6 py-3 cursor-pointer transition-all duration-150 ${
                          selectedFilter === school.id
                            ? 'bg-[#FFF5F5] text-[#D30013] font-semibold'
                            : 'text-[#3C3C3B] hover:bg-[#FAF7F5]'
                        } ${index === schools.length - 1 ? 'rounded-b-lg' : ''}`}
                      >
                        <div className="flex items-center text-left">
                          {selectedFilter === school.id && (
                            <span className="mr-2 text-[#D30013] font-bold">✓</span>
                          )}
                          {school.title}
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Description */}
        {description && (
          <div
            className="text-base text-left text-gray-700 mb-12 taxonomy-html-content"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D30013]"></div>
          </div>
        )}

        {/* Terms Grid - Type 0: Website Layout */}
        {!loading && terms.length > 0 && taxonomyType === 0 && (
          <div className="grid text-left grid-cols-1 md:grid-cols-2 gap-8">
            {terms.map((term, index) => (
              <div
                key={term.id}
                className="flex gap-6"
                data-aos="fade-up"
                data-aos-delay={index * 50}
                data-aos-duration="200"
              >
                <div className="flex-shrink-0 text-left">
                  <img
                    src={term.image || 'https://via.placeholder.com/150'}
                    alt={term.title}
                    className="w-[150px] h-[150px] object-cover rounded"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  {term.title && (
                    <h3
                      className="text-xl font-bold text-gray-900 mb-2 taxonomy-html-content"
                      dangerouslySetInnerHTML={{ __html: term.title }}
                    />
                  )}
                  {term.subtitle && (
                    <div
                      className="text-base text-gray-700 mb-3 taxonomy-html-content"
                      dangerouslySetInnerHTML={{ __html: term.subtitle }}
                    />
                  )}
                  {term.content && (
                    <div
                      className="text-sm text-gray-600 mb-3 line-clamp-3 taxonomy-html-content"
                      dangerouslySetInnerHTML={{ __html: term.content }}
                    />
                  )}
                  <a
                    href={term.slug ? `/${term.slug}` : '#'}
                    className="group inline-flex items-center gap-2 px-4 py-2 bg-[#D30013] text-white rounded-md font-semibold text-sm hover:bg-[#B01810] hover:shadow-lg hover:scale-[1.02] transition-all duration-300 w-fit"
                  >
                    {isChineseVersion ? '阅读更多' : 'Read More'}
                    <svg
                      className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Terms Grid - Type 1: Read More Card Layout */}
        {!loading && allTerms.length > 0 && taxonomyType === 1 && (
          <div className="grid text-left grid-cols-1 md:grid-cols-2 gap-6">
            {allTerms.slice(0, visibleCount).map((term, index) => (
              <div
                key={term.id}
                className="flex items-center bg-white rounded-xl shadow-md overflow-hidden p-4 gap-4"
                data-aos="fade-up"
                data-aos-delay={index * 50}
                data-aos-duration="200"
              >
                <div className="flex-shrink-0">
                  <img
                    src={term.image || 'https://via.placeholder.com/120'}
                    alt={term.title}
                    className="w-[160px] h-[160px] object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  {term.title && (
                    <h3
                      className="text-lg font-bold text-gray-900 mb-2 taxonomy-html-content"
                      dangerouslySetInnerHTML={{ __html: term.title }}
                    />
                  )}
                  {term.subtitle && (
                    <div className="flex items-start gap-2 mb-1">

                      

                      <Icon icon="Icon-Pin" size={16} />

                      <span
                        className="text-sm text-gray-600 taxonomy-html-content"
                        dangerouslySetInnerHTML={{ __html: term.subtitle }}
                      />
                    </div>
                  )}
                  


                    
                  {term.school_id && schools.find(s => s.id === term.school_id) && (
                    <div className="flex items-start gap-2">
                      <Icon1 icon="Shield" size={16} />
                      <span className="text-sm text-gray-600">
                        {(() => {
                          const schoolTitle = schools.find(s => s.id === term.school_id).title;
                          if (schoolTitle.includes('High School')) {
                            return `Dulwich Int. High School Programme ${schoolTitle.replace(' High School', '')}`;
                          }
                          return `Dulwich College ${schoolTitle}`;
                        })()}
                      </span>
                    </div>
                  )}
                  
                </div>
                <button
                  onClick={() => setSelectedStory(index)}
                  className="ml-auto self-end flex-shrink-0 w-10 h-10 rounded-lg border-2 border-[#D30013] flex items-center justify-center hover:bg-[#D30013] hover:text-white text-[#D30013] transition-colors duration-300"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button - Type 1 */}
        {!loading && taxonomyType === 1 && (visibleCount < allTerms.length || hasMorePages) && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="px-8 py-3 border-2 border-[#D30013] text-[#D30013] font-semibold rounded-lg hover:bg-[#D30013] hover:text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loadingMore ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Loading...
                </>
              ) : (
                'Load More'
              )}
            </button>
          </div>
        )}

        {/* Terms Grid - Type 2: Stories Layout */}
        {!loading && terms.length > 0 && taxonomyType === 2 && (
          <div
            className="max-w-[1360px] grid grid-cols-1 md:grid-cols-3 gap-4 md:auto-rows-[300px]"
            style={{ gridAutoFlow: 'dense' }}
          >
            {terms.map((term, index) => {
              // Balanced pattern in groups of 9 items (3 rows of 3)
              // Row 1: tall, tall, short+short (fills 2 row-units)
              // Row 2: short, short, tall (fills with row 1)
              const positionInGroup = index % 9;
              let rowSpan = 1;

              if (positionInGroup === 0 || positionInGroup === 1 || positionInGroup === 5 || positionInGroup === 6 || positionInGroup === 8) {
                rowSpan = 2; // tall cards at positions 0,1,5,6,8
              }

              return (
                <div
                  key={term.id}
                  className={`group bg-white rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-2xl transition-all duration-500 ${
                    rowSpan === 2 ? 'md:row-span-2' : 'md:row-span-1'
                  }`}
                  onClick={() => setSelectedStory(index)}
                  data-aos="fade-up"
                  data-aos-delay={index * 50}
                  data-aos-duration="200"
                >
                  <div className="flex flex-col h-full">
                    <div className="flex-1 overflow-hidden min-h-0">
                      <img
                        src={term.image || 'https://via.placeholder.com/400x600'}
                        alt={term.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white flex-shrink-0">
                      {term.title && (
                        <h3
                          className="text-[24px] text-left font-bold text-[#3C3737] taxonomy-html-content flex-1"
                          dangerouslySetInnerHTML={{ __html: term.title }}
                        />
                      )}
                      <div className="relative flex-shrink-0 ml-3 w-10 h-10 rounded-full border-2 border-[#D30013] text-[#D30013] flex items-center justify-center transition-all duration-500 ease-in-out group-hover:w-14 group-hover:bg-[#D30013] group-hover:text-white group-hover:border-transparent">
                        <MoveDiagonal className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Story Modal Overlay — shared for type 1 and type 2 */}
        {selectedStory !== null && (taxonomyType === 1 || taxonomyType === 2) && terms[selectedStory] && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4">
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setSelectedStory(null)}
            />
            <div className="relative w-full h-[92vh] rounded-2xl" style={{ isolation: 'isolate', clipPath: 'inset(0 round 1rem)' }}>
              {/* Background: solid red for type 1 (portrait), full-bleed image for type 2 */}
              {taxonomyType === 1 ? (
                <div className="absolute inset-0 bg-[#9E1422]" />
              ) : (
                <>
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${terms[selectedStory].image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#9E1422]/80 via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#9E1422] via-[#9E1422]/60 to-transparent" />
                </>
              )}

              {/* Close Button */}
              <button
                onClick={() => setSelectedStory(null)}
                className="absolute top-6 right-6 z-10 text-white hover:opacity-70 transition-opacity"
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Type 1: sticky header + scrollable body */}
              {taxonomyType === 1 ? (
                <div
                  ref={scrollableContentRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: '80px',
                    overflowY: 'auto',
                    overscrollBehavior: 'contain',
                    WebkitOverflowScrolling: 'touch',
                    color: 'white',
                    cursor: 'grab',
                  }}
                >
                  {/* Sticky header: stays at top while text scrolls beneath */}
                  <div style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    backgroundColor: '#9E1422',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    paddingTop: '60px',
                    paddingBottom: '16px',
                    paddingLeft: '40px',
                    paddingRight: '40px',
                  }}>
                    {terms[selectedStory].image && (
                      <div style={{ marginBottom: '20px' }}>
                        <img
                          src={terms[selectedStory].image}
                          alt=""
                          style={{ width: '180px', height: '180px', borderRadius: '50%', objectFit: 'cover', border: '4px solid rgba(255,255,255,0.3)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
                        />
                      </div>
                    )}
                    {terms[selectedStory].title && (
                      <h2
                        style={{ fontSize: '1.875rem', fontWeight: 'bold', textAlign: 'center', margin: 0 }}
                        className="taxonomy-html-content"
                        dangerouslySetInnerHTML={{ __html: terms[selectedStory].title }}
                      />
                    )}
                  </div>

                  {/* Scrollable text content */}
                  <div style={{ padding: '24px 40px 32px' }}>
                    <div style={{ maxWidth: '768px', margin: '0 auto' }}>
                      <div
                        className="text-base md:text-lg text-left leading-relaxed taxonomy-html-content"
                        dangerouslySetInnerHTML={{ __html: terms[selectedStory].content || '' }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* Type 2: content scrollable above nav bar */
                <div className="relative h-full flex flex-col justify-center text-white">
                  <div className="w-full max-w-4xl mx-auto px-10 md:px-16 overflow-y-auto max-h-[calc(92vh-5rem)] pb-6">
                    {terms[selectedStory].title && (
                      <h2
                        className="text-3xl md:text-5xl font-bold mb-6 text-center taxonomy-html-content"
                        dangerouslySetInnerHTML={{ __html: terms[selectedStory].title }}
                      />
                    )}
                    {terms[selectedStory].content && (
                      <div
                        className="text-base md:text-lg text-left leading-relaxed taxonomy-html-content"
                        dangerouslySetInnerHTML={{ __html: terms[selectedStory].content }}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Navigation bar — same centered column as content */}
              <div className="absolute bottom-0 left-0 right-0 py-5">
                <div className="w-full max-w-4xl mx-auto px-10 md:px-16 flex items-center justify-between">
                  {/* Left: prev arrow + counter pill */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStory(selectedStory > 0 ? selectedStory - 1 : terms.length - 1);
                      }}
                      className="w-10 h-10 rounded-lg bg-white flex items-center justify-center hover:bg-gray-100 transition-colors text-[#9E1422]"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <span className="h-10 px-5 rounded-lg bg-white flex items-center text-sm font-medium text-gray-800">
                      {selectedStory + 1} / {terms.length}
                    </span>
                  </div>

                  {/* Right: next story title + next arrow */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-white/80 hidden md:block">
                      {terms[selectedStory < terms.length - 1 ? selectedStory + 1 : 0]?.title?.replace(/<[^>]*>/g, '')}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStory(selectedStory < terms.length - 1 ? selectedStory + 1 : 0);
                      }}
                      className="w-10 h-10 rounded-lg bg-white flex items-center justify-center hover:bg-gray-100 transition-colors text-[#9E1422]"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && terms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No content available for this taxonomy.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TaxonomyBlock;