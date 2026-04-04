import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import AOS from 'aos';
import { fetchAllArticles, fetchArticleTags } from '../../api/articleService';
import { fetchTeacherList } from '../../api/teacherService';
import { getCurrentSchool } from '../../utils/schoolDetection';
import loadingSpinner from '../../assets/images/loading_spinner.gif';

const API_BASE_URL = process.env.REACT_APP_API_URL;

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
  // Only zh/cn are supported in URL - English is default without prefix
  const supportedLocales = ['zh', 'cn'];
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
  const loadMoreButtonRef = useRef(null); // Ref for the article load more button
  const teacherLoadMoreButtonRef = useRef(null); // Ref for the teacher load more button

  const ARTICLES_PER_PAGE = 6;
  const INITIAL_ARTICLES_COUNT = 18; // Show 18 articles initially (3 pages)

  // People Listing State
  const [teachers, setTeachers] = useState([]); // Currently displayed teachers (paginated)
  const [allTeachers, setAllTeachers] = useState([]); // All teachers for filtering
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [schools, setSchools] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [schoolSearchQuery, setSchoolSearchQuery] = useState('');
  const [departmentSearchQuery, setDepartmentSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Name'); // Name, School, Department
  const [expandedTeacher, setExpandedTeacher] = useState(null);
  const [showSchoolFilter, setShowSchoolFilter] = useState(false);
  const [showDepartmentFilter, setShowDepartmentFilter] = useState(false);

  // Teacher pagination state
  const [teacherPageNo, setTeacherPageNo] = useState(1);
  const [hasMoreTeachers, setHasMoreTeachers] = useState(true);
  const [loadingMoreTeachers, setLoadingMoreTeachers] = useState(false);
  const INITIAL_TEACHERS_COUNT = 20;
  const TEACHERS_PER_PAGE = 10;

  // Initialize AOS for animations
  useEffect(() => {
    AOS.init({
      duration: 600,
      once: false,
      mirror: true
    });
  }, []);

  // Refresh AOS when teachers change
  useEffect(() => {
    if (template === 'people-listing' && filteredTeachers.length > 0) {
      AOS.refresh();
    }
  }, [filteredTeachers, template]);

  // Load Tags on Mount and when school/locale changes
  useEffect(() => {
    let isMounted = true; // Track if component is still mounted

    const loadTags = async () => {
      if (template === 'network-news' || template === 'school-news') {
        try {
          // Add CMS suffix to school parameter if present
          const cmsSuffix = process.env.REACT_APP_SCHOOL_CMS_SUFFIX || '-cms';
          const schoolParam = currentSchoolSlug ? `${currentSchoolSlug}${cmsSuffix}` : null;

          console.log('📚 Loading tags for school:', schoolParam, 'locale:', locale);

          // Fetch tags with school parameter (API returns both school-specific and global tags)
          const loadedTags = await fetchArticleTags(locale, schoolParam);

          // Only update state if component is still mounted
          if (isMounted) {
            console.log('✅ Tags loaded:', loadedTags?.length || 0);
            setTags(loadedTags || []);

            // Apply pretag-id only for IDs that exist in the loaded tags list
            if (pretagId.length > 0) {
              const loadedIds = new Set((loadedTags || []).map(t => String(t.id)));
              const validPretagIds = pretagId.map(String).filter(id => loadedIds.has(id));
              if (validPretagIds.length > 0) {
                setSelectedTags(validPretagIds);
              }
            }
          }
        } catch (err) {
          if (isMounted) {
            console.error('❌ Error loading tags:', err);
            setTags([]);
          }
        }
      }
    };

    loadTags();

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template, currentSchoolSlug, locale]);

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
        console.log('🔄 Initial Fetch Triggered - Dependencies:', {
          selectedTags,
          template,
          currentSchoolSlug,
          locale
        });

        setLoading(true);
        setError(null);
        setPageNo(1); // Reset page
        setHasMore(true);
        setIsInitialLoad(true); // Mark as initial load

        try {
          // Add CMS suffix to school parameter if present
          const cmsSuffix = process.env.REACT_APP_SCHOOL_CMS_SUFFIX || '-cms';
          const schoolParam = currentSchoolSlug ? `${currentSchoolSlug}${cmsSuffix}` : null;

          const params = {
            slug: 'dulwich-life',
            locale: locale,
            school: schoolParam,
            tags: selectedTags,
            limit: INITIAL_ARTICLES_COUNT,
            page_no: 1
          };

          console.log('🔄 Initial Fetch - API params:', params);

          // Fetch first page with initial articles count
          const response = await fetchAllArticles(params);

          const newArticles = response.articles || [];
          const main = response.main || null;
          const responseTags = response.tags || [];

          setMaindata(main);
          // Set page number to 3 since we're loading 3 pages initially (18 articles / 6 per page)
          setPageNo(3);

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
          if (newArticles.length < INITIAL_ARTICLES_COUNT) {
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

  // Fetch Teachers for people-listing template
  useEffect(() => {
    const fetchTeachers = async () => {
      if (template === 'people-listing') {
        setLoading(true);
        setError(null);
        setTeacherPageNo(1);
        setHasMoreTeachers(true);

        try {
          // Add CMS suffix to school parameter
          const cmsSuffix = process.env.REACT_APP_SCHOOL_CMS_SUFFIX || '-cms';
          const schoolParam = currentSchoolSlug ? `${currentSchoolSlug}${cmsSuffix}` : null;

          // Fetch ALL teachers in one go with pagination - more efficient than double fetch
          const firstPageResponse = await fetchTeacherList({
            school: schoolParam,
            locale: locale,
            page_no: 1,
            limit: 500
          });

          const firstPageData = firstPageResponse.data?.people || [];
          const total = firstPageResponse.data?.total || firstPageData.length;
          const limit = firstPageResponse.data?.limit || 500;
          const totalPages = Math.ceil(total / limit);

          console.log(`📚 Loading teachers: Page 1/${totalPages}, Total: ${total}`);

          // Show first 20 teachers immediately for fast initial render
          const initialTeachers = firstPageData.slice(0, INITIAL_TEACHERS_COUNT);
          setTeachers(initialTeachers);
          setFilteredTeachers(initialTeachers);

          // Store first page data for filtering
          setAllTeachers(firstPageData);

          // Hide loading immediately after first page - smooth UX
          setLoading(false);

          // Set pagination state
          setTeacherPageNo(2);
          setHasMoreTeachers(total > INITIAL_TEACHERS_COUNT);

          // Extract schools and departments from first page for filters
          const extractFilters = (teachersList) => {
            const schoolsSet = new Set();
            const departmentsSet = new Set();

            teachersList.forEach(teacher => {
              if (teacher.school && Array.isArray(teacher.school)) {
                teacher.school.forEach(schoolName => schoolsSet.add(schoolName));
              }
              if (teacher.department && Array.isArray(teacher.department)) {
                teacher.department.forEach(deptName => departmentsSet.add(deptName));
              }
            });

            return {
              schools: Array.from(schoolsSet).map((name, index) => ({ id: index, name })),
              departments: Array.from(departmentsSet).map((name, index) => ({ id: index, name }))
            };
          };

          // Set initial filters from first page
          const { schools: initialSchools, departments: initialDepts } = extractFilters(firstPageData);
          setSchools(initialSchools.sort((a, b) => a.name.localeCompare(b.name)));
          setDepartments(initialDepts.sort((a, b) => a.name.localeCompare(b.name)));

          // Fetch remaining pages in background if needed (non-blocking)
          if (totalPages > 1) {
            console.log(`📥 Fetching remaining ${totalPages - 1} pages in background...`);

            const pagePromises = [];
            for (let page = 2; page <= totalPages; page++) {
              pagePromises.push(
                fetchTeacherList({
                  school: schoolParam,
                  locale: locale,
                  page_no: page,
                  limit: limit
                })
              );
            }

            // This happens in background - UI is already responsive
            Promise.all(pagePromises).then(remainingPages => {
              let allTeachersData = [...firstPageData];

              remainingPages.forEach(response => {
                const pageData = response.data?.people || [];
                allTeachersData = [...allTeachersData, ...pageData];
              });

              console.log(`✅ Background load complete: ${allTeachersData.length}/${total} teachers loaded`);

              // Update all teachers for filtering
              setAllTeachers(allTeachersData);

              // Update filters with complete data
              const { schools: allSchools, departments: allDepts } = extractFilters(allTeachersData);
              setSchools(allSchools.sort((a, b) => a.name.localeCompare(b.name)));
              setDepartments(allDepts.sort((a, b) => a.name.localeCompare(b.name)));
            }).catch(err => {
              console.error('Error loading remaining teachers:', err);
              // Don't show error since we already have first page data
            });
          }

        } catch (err) {
          console.error('Error loading teachers:', err);
          setError('Failed to load teacher directory');
          setTeachers([]);
          setLoading(false);
        }
      }
    };

    fetchTeachers();
  }, [template, currentSchoolSlug, locale]);

  // Filter teachers based on selected filters and search
  useEffect(() => {
    if (template === 'people-listing') {
      // When filters are active, search across ALL teachers
      if (selectedSchool || selectedDepartment || searchQuery.trim()) {
        if (allTeachers.length === 0) return; // Wait for allTeachers to load

        console.log('🔍 Filtering teachers. Total available:', allTeachers.length);
        let filtered = [...allTeachers];

        // Apply school filter - compare by school name
        if (selectedSchool) {
          const selectedSchoolName = schools.find(s => s.id.toString() === selectedSchool)?.name;
          if (selectedSchoolName) {
            filtered = filtered.filter(teacher =>
              teacher.school && teacher.school.includes(selectedSchoolName)
            );
          }
        }

        // Apply department filter - compare by department name
        if (selectedDepartment) {
          const selectedDeptName = departments.find(d => d.id.toString() === selectedDepartment)?.name;
          if (selectedDeptName) {
            filtered = filtered.filter(teacher =>
              teacher.department && teacher.department.includes(selectedDeptName)
            );
          }
        }

        // Apply search filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(teacher =>
            teacher.name.toLowerCase().includes(query) ||
            (teacher.job_title && teacher.job_title.toLowerCase().includes(query))
          );
        }

        console.log('✅ Filtered teachers count:', filtered.length);
        setFilteredTeachers(filtered);
        setHasMoreTeachers(false); // Disable pagination when filtering
      } else {
        // No filters - show paginated results from teachers state
        setFilteredTeachers(teachers);
        // Pagination is already managed by the fetch logic
      }
    }
  }, [teachers, allTeachers, selectedSchool, selectedDepartment, searchQuery, template, schools, departments]);

  // Load More Teachers (Pagination) - No API calls, just slice from allTeachers
  const handleLoadMoreTeachers = useCallback(() => {
    if (loadingMoreTeachers || !hasMoreTeachers || allTeachers.length === 0) return;

    setLoadingMoreTeachers(true);

    // Small delay for smooth UX
    setTimeout(() => {
      // Calculate how many teachers to show
      const currentCount = teachers.length;
      const nextCount = currentCount + TEACHERS_PER_PAGE;

      console.log(`📄 Loading more teachers: ${currentCount} -> ${nextCount} (Total available: ${allTeachers.length})`);

      // Slice more teachers from allTeachers
      const moreTeachers = allTeachers.slice(0, nextCount);
      setTeachers(moreTeachers);

      // Check if we've reached the end
      if (nextCount >= allTeachers.length) {
        setHasMoreTeachers(false);
        console.log('✅ All teachers loaded');
      }

      setLoadingMoreTeachers(false);
    }, 300);
  }, [loadingMoreTeachers, hasMoreTeachers, allTeachers, teachers.length, TEACHERS_PER_PAGE]);

  // Infinite Scroll Observer for Teachers
  useEffect(() => {
    if (template !== 'people-listing') return;
    if (!teacherLoadMoreButtonRef.current) return;
    if (!hasMoreTeachers || loadingMoreTeachers) return;
    if (selectedSchool || selectedDepartment || searchQuery) return; // Don't auto-load when filters are active

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMoreTeachers && !loadingMoreTeachers) {
          console.log('🔍 Intersection detected, loading more teachers...');
          handleLoadMoreTeachers();
        }
      },
      {
        root: null,
        rootMargin: '200px', // Trigger 200px before reaching the sentinel for smoother UX
        threshold: 0.1
      }
    );

    observer.observe(teacherLoadMoreButtonRef.current);

    return () => {
      if (teacherLoadMoreButtonRef.current) {
        observer.unobserve(teacherLoadMoreButtonRef.current);
      }
    };
  }, [hasMoreTeachers, loadingMoreTeachers, selectedSchool, selectedDepartment, searchQuery, template, handleLoadMoreTeachers]);

  // Load More Articles (Pagination)
  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    const nextPage = pageNo + 1;
    const startTime = Date.now();

    console.log('🔄 Load More - Current pageNo:', pageNo);
    console.log('🔄 Load More - Fetching nextPage:', nextPage);
    console.log('🔄 Load More - Current articles count:', articles.length);

    try {
      // Add CMS suffix to school parameter if present
      const cmsSuffix = process.env.REACT_APP_SCHOOL_CMS_SUFFIX || '-cms';
      const schoolParam = currentSchoolSlug ? `${currentSchoolSlug}${cmsSuffix}` : null;

      const params = {
        slug: 'dulwich-life',
        locale: locale,
        school: schoolParam,
        limit: ARTICLES_PER_PAGE,
        page_no: nextPage,
        tags: selectedTags
      };

      console.log('🔄 Load More - API params:', params);

      const response = await fetchAllArticles(params);

      const newArticles = response.articles || [];
      console.log('🔄 Load More - Received articles:', newArticles.length);

      // Ensure minimum loading time of 800ms for smooth animation
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 800 - elapsedTime);

      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }

      if (newArticles.length > 0) {
        setArticles(prev => [...prev, ...newArticles]);
        setPageNo(nextPage);
        console.log('✅ Load More - Updated pageNo to:', nextPage);

        if (newArticles.length < ARTICLES_PER_PAGE) {
          setHasMore(false);
        }

        // Scroll to load more button after new content is added
        setTimeout(() => {
          if (loadMoreButtonRef.current) {
            loadMoreButtonRef.current.scrollIntoView({
              behavior: 'smooth',
              block: 'end',
              inline: 'nearest'
            });
          }
        }, 500);
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
  const handleTagClick = (tagId, event) => {
    // Prevent event from bubbling up to parent elements
    if (event) {
      event.stopPropagation();
    }

    const id = String(tagId);
    setSelectedTags(prev => {
      const newSelectedTags = prev.includes(id)
        ? prev.filter(t => t !== id)
        : [...prev, id];

      // Update URL with tag slugs
      updateUrlWithTags(newSelectedTags);

      return newSelectedTags;
    });

    // Keep dropdown open after selection
    setShowTagsFilter(true);
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
          <div className="text-[#3C3C3B] py-12">
            <img src={loadingSpinner} alt="Loading..." className="inline-block h-[200px] w-auto" />
            {/* <p className="mt-4">Loading articles...</p> */}
          </div>
        </div>
      </section>
    );
  }

  // School color mapping
  const schoolColors = {
    "Senior School": "bg-[#d40012] text-white",
    "Junior School": "bg-[#189dd0] text-white",
    "DUCKS": "bg-[#fdb907] text-white",
    "Whole College": "bg-[#9e1522] text-white",
  };

  // Get school badge color
  const getSchoolColor = (schoolName) => {
    return schoolColors[schoolName] || "bg-gray-600 text-white";
  };

  // Render people-listing template
  if (template === 'people-listing') {
    return (
      <section data-id={anchorId} className="py-12 px-4 bg-gray-50">
        <style>{`
          /* Smooth accordion expansion with snap effect */
          .accordion-content {
            display: grid;
            grid-template-rows: 0fr;
            transition: grid-template-rows 0.35s cubic-bezier(0.4, 0, 0.2, 1);
            will-change: grid-template-rows;
          }

          .accordion-content.open {
            grid-template-rows: 1fr;
          }

          .accordion-content > div {
            overflow: hidden;
          }

          /* Fade in animation for accordion content */
          .accordion-inner {
            opacity: 0;
            transform: translateY(-10px);
            transition: opacity 0.25s ease-out 0.1s, transform 0.25s ease-out 0.1s;
          }

          .accordion-content.open .accordion-inner {
            opacity: 1;
            transform: translateY(0);
          }

          /* Custom scrollbar styles for dropdown */
          .dropdown-scroll {
            -webkit-overflow-scrolling: touch;
            scroll-behavior: smooth;
            overscroll-behavior: contain;
            touch-action: pan-y;
          }

          .dropdown-scroll::-webkit-scrollbar {
            width: 8px;
          }

          .dropdown-scroll::-webkit-scrollbar-track {
            background: #F3F4F6;
            border-radius: 4px;
          }

          .dropdown-scroll::-webkit-scrollbar-thumb {
            background: #D30013;
            border-radius: 4px;
          }

          .dropdown-scroll::-webkit-scrollbar-thumb:hover {
            background: #B8000F;
          }

          /* Firefox scrollbar */
          .dropdown-scroll {
            scrollbar-width: thin;
            scrollbar-color: #D30013 #F3F4F6;
          }
        `}</style>
        <div className="max-w-[1120px] mx-auto relative">
          {/* Tags Filter */}
          <div className="mb-6 relative z-50">
            <div className="flex items-center gap-3">
              <div className="relative w-full max-w-[360px] z-50">
                <button
                  onClick={() => setShowDepartmentFilter(!showDepartmentFilter)}
                  className="flex items-center justify-between w-full px-4 py-3 bg-[#FAF7F5] border-2 border-gray-300 rounded-lg hover:border-red-600 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <i className="icon-tag-21 text-gray-600 text-xl"></i>
                    <span className="text-[#3C3C3B] font-medium text-base">Tags</span>
                  </div>
                  <svg className={`w-5 h-5 text-[#9E1422] transition-transform duration-300 ${showDepartmentFilter ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

              {/* Tags Dropdown */}
              {showDepartmentFilter && (
                <div className="absolute left-0 mt-1 w-full bg-[#FAF7F5] border rounded-lg shadow-xl overflow-hidden transition-all duration-300 max-h-[400px] opacity-100 z-50">
                  {/* Tabs */}
                  <div className="flex border-b border-gray-200 bg-[#FAF7F5]">
                    <button
                      onClick={() => {
                        setActiveTab('Name');
                        setSchoolSearchQuery('');
                        setDepartmentSearchQuery('');
                      }}
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-all relative ${
                        activeTab === 'Name'
                          ? 'text-[#3C3737] bg-white'
                          : 'text-[#3C3C3B] hover:bg-gray-100'
                      }`}
                    >
                      Name
                      {activeTab === 'Name' && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#9E1422]"></div>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('School');
                        setSchoolSearchQuery('');
                        setDepartmentSearchQuery('');
                      }}
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-all relative ${
                        activeTab === 'School'
                          ? 'text-[#3C3737] bg-white'
                          : 'text-[#3C3C3B] hover:bg-gray-100'
                      }`}
                    >
                      Schools
                      {activeTab === 'School' && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#9E1422]"></div>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('Department');
                        setSchoolSearchQuery('');
                        setDepartmentSearchQuery('');
                      }}
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-all relative ${
                        activeTab === 'Department'
                          ? 'text-[#3C3737] bg-white'
                          : 'text-[#3C3C3B] hover:bg-gray-100'
                      }`}
                    >
                      Department
                      {activeTab === 'Department' && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#9E1422]"></div>
                      )}
                    </button>
                  </div>

                  {/* Name Tab */}
                  {activeTab === 'Name' && (
                    <>
                      {/* Search Input - Fixed */}
                      <div className="p-4 bg-[#FAF7F5]">
                        <div className="relative">
                          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <input
                            type="text"
                            placeholder="Search by name or job title"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-10 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-gray-400 transition-colors"
                          />
                          {searchQuery && (
                            <button
                              onClick={() => setSearchQuery('')}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                      {/* Scrollable Teacher List */}
                      <div
                        className="overflow-y-scroll dropdown-scroll p-2"
                        style={{ maxHeight: '250px', overflowY: 'scroll', WebkitOverflowScrolling: 'touch' }}
                        onWheel={(e) => e.stopPropagation()}
                        onTouchMove={(e) => e.stopPropagation()}
                      >
                        {[...allTeachers]
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .filter(teacher =>
                            teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (teacher.job_title && teacher.job_title.toLowerCase().includes(searchQuery.toLowerCase()))
                          )
                          .map(teacher => (
                            <div
                              key={teacher.id}
                              className="w-full text-left px-4 py-3 text-sm hover:bg-gradient-to-r from-[#FF4D5A]/10 to-[#ec7b84] transition-all duration-150 rounded-md mb-1 cursor-pointer"
                              onClick={() => {
                                // Scroll to the teacher card
                                const teacherCard = document.getElementById(`teacher-${teacher.id}`);
                                if (teacherCard) {
                                  teacherCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                  // Briefly highlight the card
                                  teacherCard.classList.add('ring-2', 'ring-[#9E1422]', 'ring-offset-2');
                                  setTimeout(() => {
                                    teacherCard.classList.remove('ring-2', 'ring-[#9E1422]', 'ring-offset-2');
                                  }, 2000);
                                }
                                setShowDepartmentFilter(false);
                              }}
                            >
                              <div className="font-medium text-[#3C3C3B]">{teacher.name}</div>
                              {teacher.job_title && (
                                <div className="text-xs text-gray-500 mt-1">{teacher.job_title}</div>
                              )}
                            </div>
                          ))}
                        {[...allTeachers]
                          .filter(teacher =>
                            teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (teacher.job_title && teacher.job_title.toLowerCase().includes(searchQuery.toLowerCase()))
                          ).length === 0 && (
                          <div className="px-4 py-3 text-sm text-gray-500 text-center">
                            No teachers found
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* School Tab */}
                  {activeTab === 'School' && (
                    <>
                      {/* Search Input - Fixed */}
                      <div className="p-4 bg-[#FAF7F5]">
                        <div className="relative">
                          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <input
                            type="text"
                            placeholder="Search"
                            value={schoolSearchQuery}
                            onChange={(e) => setSchoolSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-10 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-gray-400 transition-colors"
                          />
                          {schoolSearchQuery && (
                            <button
                              onClick={() => setSchoolSearchQuery('')}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                      {/* Scrollable List */}
                      <div
                        className="overflow-y-scroll dropdown-scroll p-2"
                        style={{ maxHeight: '250px', overflowY: 'scroll', WebkitOverflowScrolling: 'touch' }}
                        onWheel={(e) => e.stopPropagation()}
                        onTouchMove={(e) => e.stopPropagation()}
                      >
                        {schools
                          .filter(school =>
                            school.name.toLowerCase().includes(schoolSearchQuery.toLowerCase())
                          )
                          .map(school => (
                            <button
                              key={school.id}
                              onClick={() => {
                                setSelectedSchool(school.id.toString());
                                setShowDepartmentFilter(false);
                                setSchoolSearchQuery('');
                              }}
                              className={`w-full text-left px-4 py-3 text-sm hover:bg-gradient-to-r from-[#FF4D5A]/10 to-[#ec7b84] transition-all duration-150 flex items-center justify-between rounded-md mb-1 ${
                                selectedSchool === school.id.toString() ? 'bg-red-50 text-red-700 font-medium' : 'text-gray-700'
                              }`}
                            >
                              <span>{school.name}</span>
                              {selectedSchool === school.id.toString() && (
                                <svg className="w-4 h-4 text-[#9E1422]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </button>
                          ))}
                        {schools.filter(school =>
                          school.name.toLowerCase().includes(schoolSearchQuery.toLowerCase())
                        ).length === 0 && (
                          <div className="px-4 py-3 text-sm text-gray-500 text-center">
                            No schools found
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* Department Tab */}
                  {activeTab === 'Department' && (
                    <>
                      {/* Search Input - Fixed */}
                      <div className="p-4 bg-[#FAF7F5]">
                        <div className="relative">
                          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <input
                            type="text"
                            placeholder="Search"
                            value={departmentSearchQuery}
                            onChange={(e) => setDepartmentSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-10 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-gray-400 transition-colors"
                          />
                          {departmentSearchQuery && (
                            <button
                              onClick={() => setDepartmentSearchQuery('')}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                      {/* Scrollable List */}
                      <div
                        className="overflow-y-scroll dropdown-scroll p-2"
                        style={{ maxHeight: '250px', overflowY: 'scroll', WebkitOverflowScrolling: 'touch' }}
                        onWheel={(e) => e.stopPropagation()}
                        onTouchMove={(e) => e.stopPropagation()}
                      >
                        {departments
                          .filter(dept =>
                            dept.name.toLowerCase().includes(departmentSearchQuery.toLowerCase())
                          )
                          .map(dept => (
                            <button
                              key={dept.id}
                              onClick={() => {
                                setSelectedDepartment(dept.id.toString());
                                setShowDepartmentFilter(false);
                                setDepartmentSearchQuery('');
                              }}
                              className={`w-full text-left px-4 py-3 text-sm hover:bg-gradient-to-r from-[#FF4D5A]/10 to-[#ec7b84] transition-all duration-150 flex items-center justify-between rounded-md mb-1 ${
                                selectedDepartment === dept.id.toString() ? 'bg-red-50 text-red-700 font-medium' : 'text-gray-700'
                              }`}
                            >
                              <span>{dept.name}</span>
                              {selectedDepartment === dept.id.toString() && (
                                <svg className="w-4 h-4 text-[#9E1422]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </button>
                          ))}
                        {departments.filter(dept =>
                          dept.name.toLowerCase().includes(departmentSearchQuery.toLowerCase())
                        ).length === 0 && (
                          <div className="px-4 py-3 text-sm text-gray-500 text-center">
                            No departments found
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
              </div>

              {/* Clear Filters Button */}
              {(selectedSchool || selectedDepartment || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedSchool('');
                    setSelectedDepartment('');
                    setSearchQuery('');
                    setShowDepartmentFilter(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-[#9E1422] hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-red-300 hover:border-red-500"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>


          {/* Active Filters Display */}
          {(selectedSchool || selectedDepartment || searchQuery) && (
            <div className="mb-4 flex flex-wrap gap-2 items-center">
              <span className="text-sm text-[#3C3C3B] font-medium">Active filters:</span>
              {searchQuery && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full flex items-center gap-2">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="hover:text-blue-900">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              {selectedSchool && (
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full flex items-center gap-2">
                  School: {schools.find(s => s.id.toString() === selectedSchool)?.name}
                  <button onClick={() => setSelectedSchool('')} className="hover:text-green-900">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              {selectedDepartment && (
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full flex items-center gap-2">
                  Department: {departments.find(d => d.id.toString() === selectedDepartment)?.name}
                  <button onClick={() => setSelectedDepartment('')} className="hover:text-purple-900">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
            </div>
          )}

{/* Teacher Cards */}
{filteredTeachers.length > 0 ? (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start relative z-0">
    {filteredTeachers.map((teacher, index) => {
      const isOpen = expandedTeacher === teacher.id;
      const teacherId = teacher.id;

      const handleToggle = () => {
        setExpandedTeacher((prevExpanded) => {
          // If this card is already expanded, close it
          if (prevExpanded === teacherId) {
            return null;
          }
          // Otherwise, open this card (and close any other)
          return teacherId;
        });
      };

      return (
        <div
          key={`teacher-card-${teacherId}-${index}`}
          id={`teacher-${teacherId}`}
          className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-[#F2EDE9] hover:shadow-lg transition-all duration-300"
          data-aos="zoom-out-up"
          data-aos-delay={index % 10 * 50}
          data-aos-duration="600"
        >

          {/* Card Header - Clickable Area */}
          <div
            className="flex items-center justify-between p-0 cursor-pointer hover:bg-[#FAF7F5] active:bg-gray-100 transition-all duration-200"
            onClick={handleToggle}
          >
            <div className="flex items-left gap-5 flex-1 min-w-0">
              {/* Teacher Image */}
              <div className="flex-shrink-0 overflow-hidden rounded-lg">
                {teacher.image ? (
                  <img
                    src={teacher.image}
                    alt={teacher.name}
                    className="w-[140px] h-[162px] rounded-lg shadow-sm transition-transform duration-500 ease-out group-hover:scale-110"
                  />
                ) : (
                  <div className="w-[140px] h-[160px] bg-gray-200 rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-gray-400 text-xs">No Photo</span>
                  </div>
                )}
              </div>

              {/* Teacher Info */}
              <div className="flex-1 min-w-0 text-left align-center mt-[16px]">
                {teacher.school && teacher.school.length > 0 && (
                  <div className="mb-2">
                    <span className={`inline-block px-3 py-2 text-xs font-semibold rounded-lg ${getSchoolColor(
                      // If school filter is active, show the selected school; otherwise show the first school
                      selectedSchool
                        ? schools.find(s => s.id.toString() === selectedSchool)?.name || teacher.school[0]
                        : teacher.school[0]
                    )}`}>
                      {selectedSchool
                        ? schools.find(s => s.id.toString() === selectedSchool)?.name || teacher.school[0]
                        : teacher.school[0]}
                    </span>
                  </div>
                )}

                <h3 className="text-[24px] font-bold text-[#3C3737] mb-2 mt-2 truncate">
                  {teacher.name}
                </h3>

                {teacher.job_title && (
                  <p className="text-[#3C3C3B] text-sm line-clamp-2">
                    {teacher.job_title}
                  </p>
                )}
              </div>
            </div>

            {/* Accordion Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleToggle();
              }}
              aria-label={isOpen ? "Collapse details" : "Expand details"}
              aria-expanded={isOpen}
              className="flex items-center mr-3 justify-center w-8 h-8 rounded-full text-[#D30013] bg-[#FAF7F5] border border-[#F2EDE9] ml-4 transition-all duration-300 flex-shrink-0 group-hover:bg-[#D30013] group-hover:text-white group-hover:w-14 group-hover:h-10"
            >
              <svg
                className={`w-4 h-4 transform transition-transform duration-300 ease-in-out ${
                  isOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>

          {/* Expanded Content with Smooth Animation */}
          <div className={`accordion-content p-0 my-0 ${isOpen ? 'open' : ''}`}>
            <div className="accordion-inner border-t border-gray-200 bg-gray-50">

              {/* Joined */}
              {teacher.joined && (
                <div className="mb-4 text-center mt-4">
                  <h4 className="text-[#9E1422] font-bold mb-1 text-sm">Joined</h4>
                  <p className="text-[#3C3C3B] text-sm">{teacher.joined}</p>
                </div>
              )}

              {/* Qualifications */}
              {teacher.qualifications && (
                <div className="mb-4 p-6 px-4">
                  <h4 className="text-[#9E1422] font-bold mb-1 text-sm">
                    Qualifications
                  </h4>
                  <div
                    className="text-[#3C3C3B] prose prose-sm max-w-none text-sm p-6"
                    dangerouslySetInnerHTML={{
                      __html: teacher.qualifications,
                    }}
                  />
                </div>
              )}

              {/* Content/Biography */}
              {teacher.content && (
                <div className="mb-0 px-6 mt-6 text-left">
                  <div
                    className="text-[#3C3C3B]  prose prose-sm max-w-none text-sm"
                    dangerouslySetInnerHTML={{
                      __html: teacher.content,
                    }}
                  />
                </div>
              )}

              {/* Background */}
              {teacher.background && (
                <div className="mb-4">
                  <div
                    className="text-[#3C3C3B] prose prose-sm max-w-none text-sm"
                    dangerouslySetInnerHTML={{
                      __html: teacher.background,
                    }}
                  />
                </div>
              )}

              {/* Departments */}
              {teacher.department && teacher.department.length > 0 && (
                <div className='p-6 text-left'>
                  <h4 className="text-[#9E1422] font-bold mb-2 text-sm">Department{teacher.department.length > 1 ? 's' : ''}</h4>
                  <div className="flex flex-wrap gap-2">
                    {teacher.department.map((deptName, idx) => (
                      <span key={idx} className="px-3 py-1 bg-[#FAF7F5] border border-[#9E1422] text-[#3C3C3B]  text-xs rounded-full">
                        {deptName}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Read More Button */}
              {teacher.slug && (
                <div className="p-6 flex justify-end">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const localePrefix = locale && locale !== 'en' ? `/${locale}` : '';
                      navigate(`${localePrefix}/community/teachers/${teacher.slug}`);
                    }}
                    className="px-6 py-2 bg-[#D30013] text-white text-sm font-semibold rounded-lg hover:bg-[#B8000F] transition-colors duration-300"
                  >
                    {locale === 'zh' ? '阅读更多' : 'Read More'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    })}
  </div>
) : (
  <div className="text-center py-16 px-6 bg-gray-50 rounded-xl border border-gray-200">
    <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
    <h3 className="text-lg font-semibold text-[#3C3C3B] mb-2">No Teachers Found</h3>
    <p className="text-sm text-gray-500">
      {loading ? 'Loading teachers...' : 'Try adjusting your filters to find more results.'}
    </p>
  </div>
)}

{/* Infinite Scroll Sentinel for Teachers */}
{filteredTeachers.length > 0 && hasMoreTeachers && !selectedSchool && !selectedDepartment && !searchQuery && (
  <div ref={teacherLoadMoreButtonRef} className="text-center mt-8 min-h-[120px] flex items-center justify-center">
    {loadingMoreTeachers && (
      <img src={loadingSpinner} alt="Loading..." className="h-[100px] w-[100px]" />
    )}
  </div>
)}


        </div>
      </section>
    );
  }

  return (
    <section data-id={anchorId} className="py-16 px-4 bg-[#FAF7F5]">
      <div className="max-w-[1120px] mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-left font-bold lg:text-[50px] max-w-[900px] font-weight-900 text-[#3C3737]  mb-4 leading-none">
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
                  <i className="icon-tag-21 text-[#3C3C3B] text-xl"></i>
                  <span className="text-base font-semibold text-[#3C3C3B] ">Tags</span>
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
                      onClick={(e) => handleTagClick(tag.id, e)}
                      className={`block w-full text-left px-4 py-3 text-base border-b border-gray-200 last:border-b-0 transition ${selectedTags.includes(String(tag.id))
                        ? 'bg-gradient-to-r from-[#FF4D5A]/10 to-[#ec7b84] text-[#3C3737] font-medium'
                        : 'bg-white text-[#3C3C3B] hover:bg-gradient-to-r from-[#FF4D5A]/10 to-[#ec7b84] rounded-sm'
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
                        onClick={(e) => handleTagClick(tagId, e)}
                        className="flex items-center gap-2 text-base text-[#3C3737] hover:text-[#9E1422]"
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {articles.map((item, index) => {
                  // Use listing_image if available, fallback to image
                  const articleImage = item.listing_image || item.image;

                  return (
                    <article
                      key={`${item.id}-${index}`}
                      className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-all duration-300 group flex flex-col h-full animate-slideUp"
                      style={{
                        animationDelay: `${(index % 6) * 80}ms`
                      }}
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
                          <div className="text-sm text-[#3C3C3B] mb-4 leading-relaxed flex-1 line-clamp-3">
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
                            className="inline-block border border-red-600 text-[#9E1422] hover:bg-red-600 hover:text-white font-semibold px-4 py-2 text-sm transition-colors duration-200 rounded-lg shadow"
                          >
                            {locale === 'zh' ? '阅读更多' : 'Read More'}
                          </a>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div ref={loadMoreButtonRef} className="text-center min-h-[160px] flex items-center justify-center">
                  {loadingMore ? (
                    <img src={loadingSpinner} alt="Loading..." className="h-[140px] w-[140px]" />
                  ) : (
                    <button
                      onClick={handleLoadMore}
                      className="px-8 py-3 bg-[#d30014] text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
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