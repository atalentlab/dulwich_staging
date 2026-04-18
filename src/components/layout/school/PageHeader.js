import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { ChevronDown, Menu as X } from 'lucide-react';
import Icon from '../../Icon';
import SearchModal from '../../SearchModal';
// School logos (SVGs)
import suzhou from '../../../assets/images/suzhou.svg';
import suzhouHighSchool from '../../../assets/images/suzhou-high-school.svg';
import hengqinHighSchool from '../../../assets/images/hengqin-high-school.svg';
import sing from '../../../assets/images/sing.svg';
import seoul from '../../../assets/images/seoul.svg';
import puxi from '../../../assets/images/puxi.svg';
import pudong from '../../../assets/images/pudong.svg';
import bangkok from '../../../assets/images/bangkok.svg';
import beijing from '../../../assets/images/beijing.svg';
import { getCurrentSchool, getSchoolUrl } from '../../../utils/schoolDetection';
import schoolPortals from '../../../assets/config/schoolPortals.json';
import sitemapIcon from '../../../assets/images/sitemap.png';
import { useDynamicMenu } from '../../../hooks/useDynamicMenu';
import { transformSchoolMenuData } from '../../../utils/schoolMenuTransformer';

// Placeholder image for cards when API doesn't provide images
const CARD_PLACEHOLDER_IMAGE = '/images/placeholder-card.jpg';


const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://cms.dulwich.atalent.xyz';

function PageHeader({ selectedSchool, availableSchools, setSelectedSchool, setSelectedSchoolSlug, setChatOpen, chatOpen, headerScrolled, pageLayoutType }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize locale state based on current URL to prevent duplicate API calls
  const initialIsChinese = location.pathname.startsWith('/zh/') || location.pathname === '/zh';

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState(initialIsChinese ? '中文' : 'EN');
  const [openMobileSection, setOpenMobileSection] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isChineseVersion, setIsChineseVersion] = useState(initialIsChinese);
  const [schoolsList, setSchoolsList] = useState(Array.isArray(availableSchools) ? availableSchools : []);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [currentSearchPage, setCurrentSearchPage] = useState(1);
  const mobileSearchRef = React.useRef(null);
  const mobileMenuScrollRef = React.useRef(null);
  const calendarHref =

    // Prevent body scroll when search modal is open
    useEffect(() => {
      if (showSearchResults) {
        // Stop Lenis smooth scrolling
        if (window.lenis) {
          window.lenis.stop();
        }
        // Prevent background scroll
        document.body.style.overflow = 'hidden';
        // Remove lenis class to disable smooth scroll
        document.documentElement.classList.remove('lenis', 'lenis-smooth');
      } else {
        // Restart Lenis smooth scrolling
        if (window.lenis) {
          window.lenis.start();
        }
        // Restore scroll
        document.body.style.overflow = '';
        // Add lenis class back
        document.documentElement.classList.add('lenis', 'lenis-smooth');
      }

      return () => {
        // Cleanup on unmount
        if (window.lenis) {
          window.lenis.start();
        }
        document.body.style.overflow = '';
        document.documentElement.classList.add('lenis', 'lenis-smooth');
      };
    }, [showSearchResults]);

  // Check if current URL has zh/ prefix
  useEffect(() => {
    const pathname = location.pathname;
    const isChinese = pathname.startsWith('/zh/') || pathname === '/zh';
    setIsChineseVersion(isChinese);
    setActiveLanguage(isChinese ? '中文' : 'EN');
  }, [location.pathname]);

  // Keep local list in sync when parent provides it
  useEffect(() => {
    if (Array.isArray(availableSchools) && availableSchools.length > 0) {
      setSchoolsList(availableSchools);
    }
  }, [availableSchools]);

  // Fetch schools here if none were provided via props
  useEffect(() => {
    if (Array.isArray(availableSchools) && availableSchools.length > 0) return;

    const controller = new AbortController();
    (async () => {
      try {
        const baseUrl = process.env.REACT_APP_API_URL;
        const currentLocale = isChineseVersion ? 'zh' : 'en';
        const response = await fetch(`${baseUrl}/api/schools?locale=${currentLocale}`, {
          signal: controller.signal,
        });
        const json = await response.json();
        const nextSchools = json?.success && Array.isArray(json?.data) ? json.data : [];
        setSchoolsList(nextSchools);
      } catch (err) {
        if (err?.name === 'AbortError') return;
        setSchoolsList([]);
      }
    })();

    return () => controller.abort();
  }, [availableSchools, isChineseVersion]);

  // Auto-select school based on current subdomain (when schools are loaded)
  useEffect(() => {
    if (!schoolsList || schoolsList.length === 0) return;
    if (!setSelectedSchool || !setSelectedSchoolSlug) return;

    const currentSchoolSlug = getCurrentSchool();
    if (!currentSchoolSlug) return;

    const matched = schoolsList.find(
      (s) => (s?.slug || '').toLowerCase() === currentSchoolSlug.toLowerCase()
    );
    if (!matched) return;

    const expectedName = `${matched.title}`;
    // Avoid pointless state updates
    if (selectedSchool !== expectedName) {
      setSelectedSchool(expectedName);
      setSelectedSchoolSlug(matched.slug);
    }
  }, [schoolsList, selectedSchool, setSelectedSchool, setSelectedSchoolSlug]);

  const redirectToSchool = (school) => {
    const schoolSlug = typeof school === 'string' ? school : school?.slug;

    // Use school URL directly from API response if available (without appending current path)
    if (typeof school === 'object' && school?.url) {
      // Clean up escaped forward slashes if present
      const cleanUrl = school.url.replace(/\\\//g, '/');
      window.location.assign(cleanUrl);
    } else {
      // Fallback to utility function if URL not available
      window.location.assign(getSchoolUrl(schoolSlug, ''));
    }
  };

  const handleSchoolSelect = (school) => {
    const schoolName = `${school.title}`;
    setSelectedSchool?.(schoolName);
    setSelectedSchoolSlug?.(school.slug);

    const currentSchoolSlug = getCurrentSchool() || '';
    const nextSlug = school.slug || '';
    if (currentSchoolSlug !== nextSlug) {
      redirectToSchool(school);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const shouldBeScrolled = window.scrollY > 20;
      // Only update if state actually changes to avoid unnecessary re-renders
      if (scrolled !== shouldBeScrolled) {
        setScrolled(shouldBeScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Use headerScrolled prop if provided, otherwise fall back to internal scrolled state
  const isScrolled = headerScrolled !== undefined ? headerScrolled : scrolled;

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, [mobileMenuOpen]);

  // Prevent body scroll when chat is open
  useEffect(() => {
    if (chatOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, [chatOpen]);

  // Language toggle function
  const toggleLanguage = (e) => {
    e.preventDefault();
    const pathname = location.pathname;
    const search = location.search;
    const hash = location.hash;

    let newPath;
    if (isChineseVersion) {
      // Remove zh/ prefix
      newPath = pathname.replace(/^\/zh(\/|$)/, '/');
      if (newPath === '') newPath = '/';
    } else {
      // Add zh/ prefix
      if (pathname === '/') {
        newPath = '/zh/';
      } else if (pathname.startsWith('/')) {
        newPath = '/zh' + pathname;
      } else {
        newPath = '/zh/' + pathname;
      }
    }

    navigate(newPath + search + hash);
  };

  // Fetch dynamic menu data from API
  const currentLocale = isChineseVersion ? 'zh' : 'en';
  const currentSchool = getCurrentSchool();
  const schoolParam = currentSchool ? currentSchool : null;
  const { data: dynamicMenuData, isLoading: isMenuLoading, error: menuError } = useDynamicMenu(currentLocale, schoolParam);

  // Transform API data to navigation structure, fallback to empty structure if API fails
  const nav = React.useMemo(() => {
    if (dynamicMenuData?.success) {
      const result = transformSchoolMenuData(dynamicMenuData, currentLocale);
      // DEBUG: log subsectionLinks for each nav item
      console.log('[PageHeader] Full transformed data:', result);
      console.log('[PageHeader] navItems:', result.navItems?.map(n => ({
        id: n.id, label: n.label,
        sectionsCount: n.sections?.length,
        sections: n.sections?.map(s => ({
          heading: s.heading,
          style: s.style,
          linksCount: s.links?.length,
          links: s.links?.map(l => ({ title: l.title, isHighlighted: l.isHighlighted }))
        })),
        cardsCount: n.cards?.length
      })));
      return result;
    }
    // Fallback to empty structure
    console.log('[PageHeader] API failed, using empty fallback');
    return {
      navItems: [],
      topBar: {
        parentPortal: isChineseVersion ? '家长门户' : 'Parent Portal',
        schoolCalendar: isChineseVersion ? '学校日历' : 'School Calendar'
      },
      siteMapLabel: isChineseVersion ? '查看完整网站地图' : 'See Full Site Map',
      searchPlaceholder: isChineseVersion ? '搜索' : 'Search',
      buttons: {
        enquire: isChineseVersion ? '咨询' : 'Enquire',
        applyNow: isChineseVersion ? '立即申请' : 'Apply Now'
      }
    };
  }, [dynamicMenuData, isChineseVersion, currentLocale]);


  // Helpers: look up nav items, sections, cards, and school-filtered links by id
  const getNavItem = (id) => nav.navItems.find(n => n.id === id) || {};
  const getSection = (navItem, id) => (navItem.sections || []).find(s => s.id === id) || {};

  // Returns the card best matching current school (handles duplicate ids with different schools filters)
  const getCard = (navItem, id) => {
    const s = getCurrentSchool();
    const cards = (navItem.cards || []).filter(c => c.id === id);
    if (!s) return cards[0] || {};
    const _m = (arr) => arr.some(e => e.split(',').map(x => x.trim()).includes(s));
    return cards.find(c => c.schools && _m(c.schools))
      || cards.find(c => !c.schools && (!c.excludeSchools || !_m(c.excludeSchools)))
      || {};
  };

  // Returns true if the card's schools/excludeSchools JSON fields allow current school
  const showCard = (card) => {
    if (!card || !card.id) return false;
    const s = getCurrentSchool();
    if (!s) return true;
    const _m = (arr) => arr.some(e => e.split(',').map(x => x.trim()).includes(s));
    return (!card.schools || _m(card.schools))
      && (!card.excludeSchools || !_m(card.excludeSchools));
  };

  // Returns card image - uses dynamic API image URL or fallback placeholder
  const getCardImage = (cardImageUrl) => {
    // If it's a URL (from dynamic API), use it directly
    if (cardImageUrl && (cardImageUrl.startsWith('http://') || cardImageUrl.startsWith('https://') || cardImageUrl.startsWith('/'))) {
      return cardImageUrl;
    }
    // Fallback to placeholder image
    return CARD_PLACEHOLDER_IMAGE;
  };

  const filterLinks = (links = []) => {
    const s = getCurrentSchool();
    if (!s) return links;
    const _m = (arr) => arr.some(e => e.split(',').map(x => x.trim()).includes(s));
    return links.filter(l =>
      (!l.schools || _m(l.schools)) &&
      (!l.excludeSchools || !_m(l.excludeSchools))
    );
  };

  // Shorthand nav sections used in JSX below
  const whyNav = getNavItem('why-dulwich');
  const learningNav = getNavItem('learning');
  const communityNav = getNavItem('community');
  const admissionsNav = getNavItem('admissions');

  // Helper function to recursively collect all URLs from nested menu structure
  const collectAllUrls = (sections) => {
    const urls = [];

    if (!sections || !Array.isArray(sections)) return urls;

    sections.forEach(section => {
      // Add the section's own URL if it exists
      if (section.url) urls.push(section.url);

      // Add URLs from links array
      if (section.links && Array.isArray(section.links)) {
        section.links.forEach(link => {
          if (link.url) urls.push(link.url);

          // Recursively check nested items
          if (link.items && Array.isArray(link.items)) {
            const nestedUrls = collectAllUrls(link.items);
            urls.push(...nestedUrls);
          }
        });
      }

      // Recursively check items at section level
      if (section.items && Array.isArray(section.items)) {
        const nestedUrls = collectAllUrls(section.items);
        urls.push(...nestedUrls);
      }
    });

    return urls;
  };

  // Helper function to check if a specific link is active
  const isLinkActive = (linkUrl) => {
    if (!linkUrl || linkUrl === '#') return false;

    const currentPath = location.pathname;

    try {
      // Extract pathname from the URL (handle both relative and absolute URLs)
      let linkPath;

      // If URL starts with http:// or https://, it's absolute
      if (linkUrl.startsWith('http://') || linkUrl.startsWith('https://')) {
        const url = new URL(linkUrl);
        linkPath = url.pathname;
      } else {
        // Relative URL - use as-is
        linkPath = linkUrl.startsWith('/') ? linkUrl : '/' + linkUrl;
      }

      // Remove trailing slashes for comparison
      const normalizedCurrentPath = currentPath.replace(/\/$/, '').toLowerCase();
      const normalizedLinkPath = linkPath.replace(/\/$/, '').toLowerCase();

      // Remove locale prefix for comparison (e.g., /zh/)
      const currentPathWithoutLocale = normalizedCurrentPath.replace(/^\/zh\//, '/');
      const linkPathWithoutLocale = normalizedLinkPath.replace(/^\/zh\//, '/');

      // Check if current path matches exactly
      return currentPathWithoutLocale === linkPathWithoutLocale;
    } catch (e) {
      console.error('Error matching link URL:', linkUrl, e);
      return false;
    }
  };

  // Helper function to check if a menu item is active based on current route
  const isMenuItemActive = (navItem) => {
    if (!navItem || !navItem.sections) return false;

    const currentPath = location.pathname;

    // Collect all URLs recursively from the menu item's sections
    const allUrls = collectAllUrls(navItem.sections);

    // Debug: Log menu check (can be removed later)
    if (process.env.NODE_ENV === 'development') {
      console.log(`Checking menu "${navItem.label}" - Current path: ${currentPath}`);
      console.log(`Found ${allUrls.length} URLs in menu`);
    }

    // Check if any URL matches the current path
    const isActive = allUrls.some(url => {
      if (!url || url === '#') return false;

      try {
        // Extract pathname from the URL (handle both relative and absolute URLs)
        let linkPath;

        // If URL starts with http:// or https://, it's absolute
        if (url.startsWith('http://') || url.startsWith('https://')) {
          const linkUrl = new URL(url);
          linkPath = linkUrl.pathname;
        } else {
          // Relative URL - use as-is
          linkPath = url.startsWith('/') ? url : '/' + url;
        }

        // Remove trailing slashes for comparison
        const normalizedCurrentPath = currentPath.replace(/\/$/, '').toLowerCase();
        const normalizedLinkPath = linkPath.replace(/\/$/, '').toLowerCase();

        // Check if current path matches exactly
        if (normalizedCurrentPath === normalizedLinkPath) {
          if (process.env.NODE_ENV === 'development') {
            console.log(`✓ Exact match found: ${normalizedLinkPath}`);
          }
          return true;
        }

        // Check if current path starts with the link path (for nested routes)
        if (normalizedCurrentPath.startsWith(normalizedLinkPath + '/')) {
          if (process.env.NODE_ENV === 'development') {
            console.log(`✓ Prefix match found: ${normalizedLinkPath}`);
          }
          return true;
        }

        return false;
      } catch (e) {
        console.error('Error matching URL:', url, e);
        return false;
      }
    });

    if (process.env.NODE_ENV === 'development' && isActive) {
      console.log(`Menu "${navItem.label}" is ACTIVE`);
    }

    return isActive;
  };

  // Search handler function
  const handleSearch = async (e, pageNumber = 1) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setShowSearchResults(true);
    setCurrentSearchPage(pageNumber);

    try {
      // Build search URL with required and optional parameters
      const searchParams = new URLSearchParams({
        query: searchQuery.trim(),
        page: pageNumber.toString()
      });

      // Add school parameter with -cms suffix if available
      const currentSchoolSlug = getCurrentSchool();
      if (currentSchoolSlug) {
        const cmsSuffix = process.env.REACT_APP_SCHOOL_CMS_SUFFIX || '-cms';
        searchParams.append('school', `${currentSchoolSlug}${cmsSuffix}`);
      }

      // Always add locale parameter (zh for Chinese, en for English)
      const locale = isChineseVersion ? 'zh' : 'en';
      searchParams.append('locale', locale);

      const response = await fetch(`${API_BASE_URL}/api/search?${searchParams.toString()}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults({ success: false, errors: { general: ['Failed to fetch search results'] } });
    } finally {
      setIsSearching(false);
    }
  };

  // Handle pagination
  const handleSearchPageChange = (pageNumber) => {
    handleSearch(null, pageNumber);
  };

  // Prevent body scroll when search modal is open and reset page number
  useEffect(() => {
    if (showSearchResults) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      setCurrentSearchPage(1); // Reset page when modal closes
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, [showSearchResults]);

  // Scroll search input into view when focused on mobile
  useEffect(() => {
    if (isSearchFocused && mobileSearchRef.current && mobileMenuScrollRef.current) {
      // Use requestAnimationFrame for better timing
      requestAnimationFrame(() => {
        setTimeout(() => {
          const searchElement = mobileSearchRef.current;
          const scrollContainer = mobileMenuScrollRef.current;

          if (searchElement && scrollContainer) {
            // Get the position of the search element
            const searchRect = searchElement.getBoundingClientRect();
            const containerRect = scrollContainer.getBoundingClientRect();

            // Calculate how much to scroll
            const scrollOffset = searchElement.offsetTop - containerRect.top - 80; // 80px from top for better visibility

            scrollContainer.scrollTo({
              top: scrollOffset,
              behavior: 'smooth'
            });
          }
        }, 400); // Increased delay to allow keyboard to fully appear
      });
    }
  }, [isSearchFocused]);
  const school = getCurrentSchool();
  const parentPortalUrl = schoolPortals[school];
  const normalizedLayoutType = pageLayoutType !== undefined && pageLayoutType !== null
    ? parseInt(pageLayoutType, 10)
    : null;
  const homeHref = school === 'singapore' ? 'https://singapore.dulwich.org/' : (isChineseVersion ? '/zh/' : '/');
  const schoolLogoBySlug = {
    singapore: sing,
    suzhou,
    'suzhou-high-school': suzhouHighSchool,
    'hengqin-high-school': hengqinHighSchool,
    seoul,
    'shanghai-puxi': puxi,
    'shanghai-pudong': pudong,
    bangkok,
    beijing,
  };
  const schoolLogoAltBySlug = {
    singapore: 'Dulwich College Singapore',
    suzhou: 'Dulwich College Suzhou',
    'suzhou-high-school': 'Dulwich College Suzhou High School',
    'hengqin-high-school': 'Dulwich College Hengqin High School',
    seoul: 'Dulwich College Seoul',
    'shanghai-puxi': 'Dulwich College Shanghai Puxi',
    'shanghai-pudong': 'Dulwich College Shanghai Pudong',
    bangkok: 'Dulwich College Bangkok',
    beijing: 'Dulwich College Beijing',
  };
  const schoolLogoSrc = schoolLogoBySlug[school];
  const schoolLogoAlt = schoolLogoAltBySlug[school] || 'Dulwich College';

  if (normalizedLayoutType === 4) {
    return (
      <>
        {/* DESKTOP MINIMAL HEADER */}
        <header className="hidden lg:block fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
          <div className="px-4 py-4">
            <div className="max-w-[1120px] mx-auto flex items-center justify-start gap-4">

              {schoolLogoSrc && (
                <img
                  src={schoolLogoSrc}
                  alt={schoolLogoAlt}
                  className="h-12 w-[270px] cursor-pointer transition-all duration-200"
                  onClick={() => window.location.href = homeHref}
                />
              )}
            </div>
          </div>
        </header>

        {/* MOBILE MINIMAL HEADER */}
        <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
          <div className="px-4 py-3">
            <div className="flex items-center justify-start gap-3">

              {schoolLogoSrc && (
                <img
                  src={schoolLogoSrc}
                  alt={schoolLogoAlt}
                  className="w-[220px] cursor-pointer"
                  onClick={() => window.location.href = homeHref}
                />
              )}
            </div>
          </div>
        </header>
      </>
    );
  }

  return (
    <>
      <style>{`
        @keyframes smoothSlideDown {
          from {
            opacity: 0;
            transform: scaleY(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scaleY(1) translateY(0);
          }
        }

        @keyframes smoothSlideUp {
          from {
            opacity: 1;
            transform: scaleY(1) translateY(0);
          }
          to {
            opacity: 0;
            transform: scaleY(0.95) translateY(-10px);
          }
        }

        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-10px);
            max-height: 0;
          }
          to {
            opacity: 1;
            transform: translateY(0);
            max-height: 2000px;
          }
        }

        [data-radix-navigation-menu-content] {
          transform-origin: top center;
        }

        [data-radix-navigation-menu-content][data-state="open"] {
          animation: smoothSlideDown 200ms ease-out;
        }

        [data-radix-navigation-menu-content][data-state="closed"] {
          animation: smoothSlideUp 150ms ease-in;
        }

        [data-state=open] .nav-content {
          animation: smoothSlideDown 200ms ease-out;
          transform-origin: top center;
        }

        [data-state=closed] .nav-content {
          animation: smoothSlideUp 200ms ease-in;
          transform-origin: top center;
        }

        /* Header minimize on scroll for page_layout_type 5 */
        body.header-minimized header {
          height: 80px !important;
          transition: height 0.3s ease-in-out;
          overflow: hidden;
        }

        body.header-minimized header > div {
          padding-top: 0.5rem !important;
          padding-bottom: 0.5rem !important;
        }

        body.header-minimized header img {
          height: 2.5rem !important;
          transition: height 0.3s ease-in-out;
        }

        /* Custom scrollbar for mobile menu */
        .mobile-menu-scroll {
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
          overscroll-behavior: contain;
        }

        /* Prevent viewport from resizing on keyboard open */
        @supports (-webkit-touch-callout: none) {
          .mobile-menu-scroll {
            min-height: 100vh;
            min-height: -webkit-fill-available;
          }
        }

        .mobile-menu-scroll::-webkit-scrollbar {
          width: 6px;
        }

        .mobile-menu-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .mobile-menu-scroll::-webkit-scrollbar-thumb {
          background: #D1D5DB;
          border-radius: 3px;
        }

        .mobile-menu-scroll::-webkit-scrollbar-thumb:hover {
          background: #3C3737;
        }

        /* Smooth transition for mobile menu padding */
        .mobile-menu-scroll {
          transition: padding-bottom 0.3s ease-out;
        }

        /* Smooth dropdown transitions */
        .dropdown-content {
          overflow: hidden;
          transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-out;
        }

        .dropdown-content-enter {
          max-height: 0;
          opacity: 0;
        }

        .dropdown-content-enter-active {
          max-height: 2000px;
          opacity: 1;
        }

        .dropdown-content-exit {
          max-height: 2000px;
          opacity: 1;
        }

        .dropdown-content-exit-active {
          max-height: 0;
          opacity: 0;
        }

        /* Smooth chevron rotation */
        .chevron-rotate {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Smooth underline animation */
        .section-underline {
          transform-origin: left;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Stagger animation for cards */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .card-stagger-1 {
          animation: fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
        }

        .card-stagger-2 {
          animation: fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
        }

        /* Smooth link transitions */
        .link-item {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Search focus highlighting */
        .search-container-focused {
          position: sticky;
          bottom: 0;
          z-index: 10;
        }

        /* Smooth keyboard appearance handling */
        @media screen and (max-width: 1023px) {
          .mobile-menu-scroll {
            scroll-padding-bottom: 400px;
          }
        }
      `}</style>

      {/* DESKTOP HEADER - Shows on screens >= lg (1024px) */}
      <header className="hidden lg:block fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        {/* Simplified Header when Chat is Open */}
        {chatOpen && (
          <div className="">
            <div className="max-w-[1120px] mx-auto flex items-center justify-end gap-3">
              {/* Close Button */}
              <button
                onClick={() => setChatOpen(false)}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-500 transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4 text-white" />
              </button>

              {/* Right Side Buttons */}
              <div className="flex items-center gap-3">
                {/* Ask AI Button - Active State (Click to close) */}
                <div className="relative bg-[#FAF7F5] gap-3" onClick={() => setChatOpen(false)}>
                  {/* <div className="my-3 py-3 px-2 align-middle"

                          style={{
                            color: 'black',
                            borderColor: 'unset',
                                                     }}
                      >
                        Ask AI
                        <Icon icon="Icon-AI" size={20} color="#D30013" className="transition-all duration-300" />
                      </div> */}
                  {/* Active Indicator - Red underline */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-[5px] bg-[#D30013] rounded-full"
                    style={{ animation: 'slideIn 0.3s ease-out' }}
                  />
                </div>

                <button
                  className="group flex items-center gap-2 px-4 py-3 text-sm font-medium border-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
                  style={{ color: '#D30013', borderColor: '#D30013' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FEF2F2'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  Enquire
                  <Icon icon="Icon_Email" size={20} className="transition-transform duration-300" />
                </button>

                {getCurrentSchool() !== 'seoul' && (
                  <a href="/admissions/apply-now">
                    <button
                      className="group flex items-center gap-2 px-4 py-3.5 text-sm font-medium text-white rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg active:scale-95"
                      style={{ backgroundColor: '#D30013' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#B8000F'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#D30013'; }}
                    >
                      Apply Now
                      <Icon icon="Icon-Arrow" size={18} color="white" className="transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Normal Header when Chat is Closed */}
        {!chatOpen && (
          <>
            {/* Top Bar - Hidden when scrolled */}
            {!isScrolled && (
              <div className="px-4 py-2">
                <div className="max-w-[1120px] mx-auto px-5 flex items-center justify-between">
                  {/* Logo and School Name */}
                  <div className="flex items-center gap-4">
                    {
                      getCurrentSchool() === 'singapore' ? (
                        <a
                          href="https://singapore.dulwich.org/"

                          rel="noopener noreferrer"
                        >
                          <img
                            src={sing}
                            alt="Dulwich College Singapore"
                            className="w-[270px] transition-all duration-500 ease-out hover:scale-105"
                          />
                        </a>
                      ) : getCurrentSchool() === 'suzhou' ? (
                        <a href={isChineseVersion
                          ? "/zh"
                          : "/"}

                          rel="noopener noreferrer"
                        >
                          <img
                            src={suzhou}
                            alt="Dulwich College Suzhou"
                            className="h-12 w-[270px] transition-all duration-500 ease-out hover:scale-105"
                          />
                        </a>
                      ) : getCurrentSchool() === 'suzhou-high-school' ? (
                        <a
                          href={isChineseVersion
                            ? "/zh"
                            : "/"}

                          rel="noopener noreferrer"
                        >
                          <img
                            src={suzhouHighSchool}
                            alt="Dulwich College Suzhou High School"
                            className="h-12 w-[270px] transition-all duration-500 ease-out hover:scale-105"
                          />
                        </a>
                      ) : getCurrentSchool() === 'hengqin-high-school' ? (

                        <a href={isChineseVersion
                          ? "/zh"
                          : "/"}

                          rel="noopener noreferrer">
                          <img
                            src={hengqinHighSchool}
                            alt="Dulwich College Hengqin High School"
                            className="h-12 w-[270px] transition-all duration-500 ease-out hover:scale-105"
                          />
                        </a>
                      ) : getCurrentSchool() === 'seoul' ? (
                        <a
                          href="/"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={seoul}
                            alt="Dulwich College Seoul"
                            className="h-12 w-[270px] transition-all duration-500 ease-out hover:scale-105"
                          />
                        </a>
                      ) : getCurrentSchool() === 'shanghai-puxi' ? (

                        <a href={isChineseVersion
                          ? "/zh"
                          : "/"}

                          rel="noopener noreferrer">

                          <img
                            src={puxi}
                            alt="Dulwich College Shanghai Puxi"
                            className="h-12 w-[270px] transition-all duration-500 ease-out hover:scale-105"
                          />
                        </a>
                      ) : getCurrentSchool() === 'shanghai-pudong' ? (
                        <a href={isChineseVersion
                          ? "/zh"
                          : "/"}

                          rel="noopener noreferrer">
                          <img
                            src={pudong}
                            alt="Dulwich College Shanghai Pudong"
                            className="h-12 w-[270px] transition-all duration-500 ease-out hover:scale-105"
                          />
                        </a>
                      ) : getCurrentSchool() === 'bangkok' ? (
                        <a
                          href="/"

                          rel="noopener noreferrer"
                        >

                          <img
                            src={bangkok}
                            alt="Dulwich College Bangkok"
                            className="h-12 w-[270px] transition-all duration-500 ease-out hover:scale-105"
                          />
                        </a>
                      ) : getCurrentSchool() === 'beijing' ? (
                        <a href={isChineseVersion
                          ? "/zh"
                          : "/"}

                          rel="noopener noreferrer">
                          <img
                            src={beijing}
                            alt="Dulwich College Beijing"
                            className="h-12 w-[270px] transition-all duration-500 ease-out hover:scale-105"
                          />
                        </a>
                      ) : null
                    }
                  </div>

                  {/* Top Right Links */}
                  <div className="flex items-center gap-6 text-sm text-[#3C3C3B]">
                    {school !== "bangkok" && school !== "hengqin-high-school" && (
                      <a
                        href={parentPortalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-red-600 transition-colors parent-portal text-left"
                        style={{
                          color: "#3C3C3B",
                          lineHeight: "2.2",
                          borderRight: "1px solid #E3D9D1",
                          paddingRight: "30px",
                        }}
                      >
                        {nav.topBar.parentPortal}
                      </a>
                    )}
                    <a
                      href={
                        getCurrentSchool() === 'singapore'
                          ? (isChineseVersion ? "/zh/community/life-at-dulwich/school-calendar" : "/community/life-at-dulwich/school-calendar")
                          : (isChineseVersion ? "/zh/community/life-at-dulwich/school-calendar" : "/community/life-at-dulwich/school-calendar")
                      }
                      className="hover:text-red-600 transition-colors"
                      style={{ color: "#3C3C3B" }}
                    >
                      {isChineseVersion ? "学校日历" : "School Calendar"}
                    </a>
                    {/* Hide language switcher for Singapore, Bangkok, and Seoul */}
                    {!['singapore', 'bangkok', 'seoul'].includes(getCurrentSchool()) && (
                      <a href="#" onClick={toggleLanguage} className="hover:text-red-800 font-extrabold transition-colors">
                        {isChineseVersion ? 'EN' : '中文'}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Main Navigation */}
            <div className={`px-4 ${isScrolled ? 'py-3' : 'py-4'} transition-all duration-200`}>
              <div className="max-w-[1120px] mx-auto px-5 flex items-center justify-between">
                {/* Logo - Only visible when scrolled */}
                <div className={`w-full flex items-center justify-left gap-5 ${isScrolled ? 'ml-[0%]' : 'ml-[2%]'}`}>
                  {isScrolled && (
                    <div className="items-center animate-in fade-in slide-in-from-left-4 duration-200">
                      <img
                        src="/images/crest-logo.svg"
                        alt="Dulwich College"
                        className="transition-all duration-500 ease-out h-12 min-w-[38px] hover:scale-110"
                      />
                    </div>

                  )}

                  {/* Navigation Menu */}
                  <NavigationMenu.Root
                    className="flex"
                    onValueChange={(value) => setIsDrawerOpen(!!value)}
                    delayDuration={100}
                  >
                    <NavigationMenu.List className="flex items-left gap-1">
                      {/* Dynamic nav items - works for all schools regardless of menu order */}
                      {(nav.navItems || []).map((navItem) => {
                        const hasSections = (navItem.sections || []).some(sec => filterLinks(sec.links).length > 0);
                        return (
                          <NavigationMenu.Item key={navItem.id}>
                            {hasSections ? (
                              <>
                                <NavigationMenu.Trigger asChild className={`group px-3 py-1 text-[16px] leading font-base text-[#3C3C3B] hover:text-gray-900 data-[state=open]:text-gray-900 outline-none transition-all duration-200 relative cursor-pointer`}>
                                  <a href={navItem.url || '#'}>
                                    {navItem.label}
                                    <span className={`absolute ${isScrolled ? '-bottom-3' : '-bottom-4'} left-0 w-full h-2 bg-[#9E1422] ${isMenuItemActive(navItem) ? 'scale-x-100' : 'scale-x-0'} group-hover:scale-x-100 group-data-[state=open]:scale-x-100 transition-transform duration-200 origin-left`}></span>
                                  </a>
                                </NavigationMenu.Trigger>
                                <NavigationMenu.Content className={`nav-content fixed left-0 right-0 ${isScrolled ? 'top-[72px]' : 'top-[138px]'} w-full z-[60]`}>
                                  <div className="w-full bg-white">
                                    <div className="w-[1120px] mx-auto px-4 py-8">
                                      {/* 4-column grid - regular sections + highlighted section spanning 2 columns */}
                                      <div className="grid grid-cols-4 gap-8 mb-8">
                                        {(() => {
                                          // Separate regular and highlighted sections
                                          const regularSections = [];
                                          const highlightedItems = [];

                                          (navItem.sections || []).forEach((sec) => {
                                            const filteredLinks = filterLinks(sec.links || []);
                                            const regularLinks = filteredLinks.filter(link => !link.isHighlighted);
                                            const highlightedLinks = filteredLinks.filter(link => link.isHighlighted);

                                            if (regularLinks.length > 0) {
                                              regularSections.push({ ...sec, links: regularLinks });
                                            }

                                            if (highlightedLinks.length > 0) {
                                              highlightedItems.push(...highlightedLinks);
                                            }
                                          });

                                          const hasRegularSections = regularSections.length > 0;
                                          const emptySpacersNeeded = hasRegularSections
                                            ? Math.max(0, 2 - regularSections.length)
                                            : 2;

                                          return (
                                            <>
                                              {/* Regular sections */}
                                              {regularSections.map((sec, si) => (
                                                <div key={si} className="text-left">
                                                  <h3 className="text-[12px] text-left font-bold text-[#3C3C3B] mb-4 tracking-widest uppercase">
                                                    <button className="uppercase transition-colors">
                                                      {sec.heading}
                                                    </button>
                                                  </h3>
                                                  <ul className="space-y-3" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                                    {sec.links.map((link, i) => {
                                                      const linkIsActive = isLinkActive(link.url);
                                                      return (
                                                        <li key={i}>
                                                          <a
                                                            href={link.url}
                                                            className={`text-base transition-colors ${linkIsActive
                                                              ? 'text-[#D30013] font-semibold'
                                                              : 'text-[#3C3C3B] hover:text-[#D30013]'
                                                              }`}
                                                          >
                                                            {link.header_menu_title || link.title}
                                                          </a>
                                                        </li>
                                                      );
                                                    })}
                                                  </ul>
                                                </div>
                                              ))}

                                              {/* Empty spacers to fill remaining columns before highlighted section */}
                                              {Array.from({ length: emptySpacersNeeded }).map((_, idx) => (
                                                <div key={`spacer-${idx}`}></div>
                                              ))}

                                              {/* Highlighted section - spans 2 columns, always at the end */}
                                              {highlightedItems.length > 0 && (
                                                <div className="col-span-2 text-left">
                                                  <div className="grid grid-cols-2 gap-6">
                                                    {highlightedItems.map((link, i) => (
                                                      <div key={i} className="flex flex-col h-full">
                                                        <h3 className="text-[12px] text-left font-bold text-[#3C3C3B] mb-4 tracking-widest uppercase h-8 flex items-start">
                                                          <button className="uppercase transition-colors">
                                                            {link.title}
                                                          </button>
                                                        </h3>
                                                        {link.imageUrl && (
                                                          <div className="w-full h-40 overflow-hidden relative rounded-lg mb-4">
                                                            <img
                                                              src={link.imageUrl}
                                                              alt={link.title}
                                                              className="w-full h-full object-cover"
                                                            />
                                                          </div>
                                                        )}
                                                        <div className="flex-1 flex flex-col">
                                                          {link.description && (
                                                            <p className="text-xs text-left text-[#3C3C3B] mb-4 leading line-clamp-3 flex-1">
                                                              {link.description}
                                                            </p>
                                                          )}
                                                          <a
                                                            href={link.url}
                                                            className="px-4 w-fit py-[7px] text-xs text-[#D30013] border border-[#D30013] rounded hover:bg-[#9E1422] hover:text-white"
                                                          >
                                                            {link.buttonText || link.title}
                                                          </a>
                                                        </div>
                                                      </div>
                                                    ))}
                                                  </div>
                                                </div>
                                              )}
                                            </>
                                          );
                                        })()}
                                      </div>

                                      {/* Bottom Section */}
                                      <div className="pt-6 border-t border-[#EAE8E4] flex items-center justify-between">
                                        <a href={isChineseVersion ? "/zh/sitemap" : "/sitemap"} className="text-sm text-[#3C3C3B] hover:text-[#D30013] transition-colors">
                                          {nav.siteMapLabel}
                                        </a>
                                        <form onSubmit={handleSearch} className="relative w-[50%]">
                                          <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                            <Icon icon="Icon-Search" size={16} color="#9CA3AF" />
                                          </div>
                                          <input
                                            type="text"
                                            placeholder={nav.searchPlaceholder}
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            autoComplete="off"
                                            autoCorrect="off"
                                            autoCapitalize="off"
                                            spellCheck="false"
                                            className="w-full pl-10 pr-4 py-2 border border-[#EAE8E4] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D30013] focus:border-transparent"
                                          />
                                        </form>
                                      </div>
                                    </div>
                                  </div>
                                </NavigationMenu.Content>
                              </>
                            ) : (
                              <NavigationMenu.Link asChild className={`group px-3 py-1 text-[16px] leading font-base text-[#3C3C3B] hover:text-[#D30013] outline-none transition-all duration-200 relative cursor-pointer`}>
                                <a href={navItem.url || '#'}>
                                  {navItem.label}
                                  <span className={`absolute ${isScrolled ? '-bottom-3' : '-bottom-4'} left-0 w-full h-2 bg-[#9E1422] ${isMenuItemActive(navItem) ? 'scale-x-100' : 'scale-x-0'} group-hover:scale-x-100 transition-transform duration-200 origin-left`}></span>
                                </a>
                              </NavigationMenu.Link>
                            )}
                          </NavigationMenu.Item>
                        );
                      })}
                    </NavigationMenu.List>
                  </NavigationMenu.Root>
                </div>
                {/* Right Side Buttons */}
                < div className="w-full flex justify-end items-center gap-3" >
                  {/* Ask AI Button with Active State */}
                  < div className="relative" >
                    {/* <button
                      onClick={() => setChatOpen && setChatOpen(!chatOpen)}
                      className={`group flex items-center gap-2 px-4 py-3 text-sm font-medium border rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 ${
                          chatOpen ? 'shadow-md' : ''
                      }`}
                      style={{
                        color: chatOpen ? 'white' : '#D30013',
                        borderColor: '#D30013',
                        backgroundColor: chatOpen ? '#D30013' : 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        if (!chatOpen) {
                          e.currentTarget.style.backgroundColor = '#D30013';
                          e.currentTarget.style.color = 'white';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!chatOpen) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#D30013';
                        }
                      }}
                  >
                    Ask AI
                    <Icon icon="Icon-AI" size={20} color={chatOpen ? 'white' : undefined} className="transition-all duration-300" />
                  </button> */}
                    {/* Active Indicator - Red underline */}
                    {
                      chatOpen && (
                        <div
                          className="absolute -bottom-1 left-0 right-0 h-1 bg-[#D30013] rounded-full animate-in slide-in-from-bottom-2 duration-300"
                          style={{ animation: 'slideIn 0.3s ease-out' }}
                        />
                      )
                    }
                  </div >


                  <a href={getCurrentSchool() === 'suzhou-high-school' ? "https://dhsz.openapply.cn/roi?c_campaign=2369" : getCurrentSchool() === 'hengqin-high-school' ? "https://dulwichzhuhai.mike-x.com/GVBeZ" : getCurrentSchool() === 'beijing' ? "https://dulwichbeijing.openapply.cn/roi?c_campaign=1962" : getCurrentSchool() === 'bangkok' ? "/admissions/enquire-more-about-dulwich" : (isChineseVersion ? "/zh/admissions/enquire" : "/admissions/enquire")}>
                    <button
                      className="group flex items-center gap-2 px-4 py-3 text-sm font-medium border rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
                      style={{ color: '#D30013', borderColor: '#D30013' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FEF2F2'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      {nav.buttons.enquire}
                      <Icon icon="Icon_Email" size={20} className="transition-transform duration-300" />
                    </button>
                  </a>
                  {
                    getCurrentSchool() !== 'seoul' && (
                      <a href={getCurrentSchool() === 'suzhou-high-school'
                        ? " https://dhsz.openapply.cn/apply/forms/22963?c_campaign=2056"
                        : getCurrentSchool() === 'beijing'
                          ? "  https://dulwichbeijing.openapply.cn/apply/forms/19779?c_campaign=1963"
                          : getCurrentSchool() === 'hengqin-high-school'
                            ? "https://dulwichzhuhai.mike-x.com/zVFgO"
                            : (isChineseVersion ? "/zh/admissions/apply-now" : "/admissions/apply-now")}>
                        <button
                          className="group flex items-center gap-2 px-4 py-3.5 text-sm font-medium text-white rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg active:scale-95"
                          style={{ backgroundColor: '#D30013' }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#B8000F'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#D30013'; }}
                        >
                          {nav.buttons.applyNow}
                          <Icon icon="Icon-Arrow" size={18} color="white" className="transition-transform duration-300 group-hover:translate-x-1" />
                        </button>
                      </a>
                    )
                  }
                </div >
              </div >
            </div >
          </>
        )
        }
      </header >

      {/* Overlay - Dims background when drawer is open */}
      {
        isDrawerOpen && (
          <div
            className="
              hidden lg:block
              fixed inset-0
              bg-gray-400/40
              z-40
              animate-in fade-in duration-200
            "
            style={{ top: isScrolled ? '72px' : '154px' }}
          />
        )
      }

      {/* MOBILE HEADER - Shows on screens < lg (below 1024px) */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="px-4 py-2.5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className='flex items-center'>
              {/* Crest Logo */}
              {/* <img
                src="/images/crest-logo.svg"
                alt="Dulwich College"
                className="h-10 w-auto cursor-pointer pr-4"
                onClick={() => window.location.href = '/'}
              /> */}
              {/* School Logo based on current school */}
              {getCurrentSchool() === 'singapore' ? (
                <a
                  href="https://singapore.dulwich.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={sing}
                    alt="Dulwich College Singapore"
                    className="w-[220px] cursor-pointer transition-all duration-500 ease-out hover:scale-105"
                  />
                </a>
              ) : getCurrentSchool() === 'suzhou' ? (
                <a
                  href="/"

                  rel="noopener noreferrer"
                >
                  <img
                    src={suzhou}
                    alt="Dulwich College Suzhou"
                    className="w-[220px] cursor-pointer transition-all duration-500 ease-out hover:scale-105"
                  />
                </a>
              ) : getCurrentSchool() === 'suzhou-high-school' ? (
                <a
                  href="/"

                  rel="noopener noreferrer"
                >
                  <img
                    src={suzhouHighSchool}
                    alt="Dulwich College Suzhou High School"
                    className="w-[220px] cursor-pointer transition-all duration-500 ease-out hover:scale-105"
                  />
                </a>
              ) : getCurrentSchool() === 'hengqin-high-school' ? (
                <a href={isChineseVersion
                  ? "/zh"
                  : "/"}

                  rel="noopener noreferrer"
                >
                  <img
                    src={hengqinHighSchool}
                    alt="Dulwich College Hengqin High School"
                    className="w-[220px] cursor-pointer transition-all duration-500 ease-out hover:scale-105"
                  />
                </a>
              ) : getCurrentSchool() === 'seoul' ? (
                <a
                  href="/"

                  rel="noopener noreferrer"
                >
                  <img
                    src={seoul}
                    alt="Dulwich College Seoul"
                    className="w-[220px] cursor-pointer transition-all duration-500 ease-out hover:scale-105"
                  />
                </a>
              ) : getCurrentSchool() === 'shanghai-puxi' ? (
                <a
                  href="/"

                  rel="noopener noreferrer"
                >
                  <img
                    src={puxi}
                    alt="Dulwich College Shanghai Puxi"
                    className="w-[220px] cursor-pointer transition-all duration-500 ease-out hover:scale-105"
                  />
                </a>
              ) : getCurrentSchool() === 'shanghai-pudong' ? (
                <a
                  href="/"

                  rel="noopener noreferrer"
                >
                  <img
                    src={pudong}
                    alt="Dulwich College Shanghai Pudong"
                    className="w-[250px] cursor-pointer transition-all duration-500 ease-out hover:scale-105"
                  />
                </a>
              ) : getCurrentSchool() === 'bangkok' ? (
                <a
                  href="/"

                  rel="noopener noreferrer"
                >
                  <img
                    src={bangkok}
                    alt="Dulwich College Bangkok"
                    className="w-[220px] cursor-pointer transition-all duration-500 ease-out hover:scale-105"
                  />
                </a>
              ) : getCurrentSchool() === 'beijing' ? (
                <a
                  href="/"

                  rel="noopener noreferrer"
                >
                  <img
                    src={beijing}
                    alt="Dulwich College Beijing"
                    className="w-[220px] cursor-pointer transition-all duration-500 ease-out hover:scale-105"
                  />
                </a>
              ) : null}
            </div>

            {/* Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <Icon icon="Icon-Menu" size={24} color="#D30013" />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE BOTTOM NAVIGATION - Fixed at bottom */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
        <div className="grid grid-cols-3 h-16">
          {/* VISIT US */}
          <a href={isChineseVersion ? "/zh/admissions/visit/visit-us" : "/admissions/visit/visit-us"}
            className="flex flex-col items-center justify-center gap-1 hover:bg-gray-50 transition-colors"
          >
            <Icon icon="map2" size={20} color="#D30013" />
            <span className="text-[10px] text-[#3C3C3B]">{isChineseVersion ? '校园参观' : 'VISIT US'}</span>
          </a>

          {/* ENQUIRE */}
          <a href={getCurrentSchool() === 'suzhou-high-school' ? "https://dhsz.openapply.cn/roi?c_campaign=2369" : getCurrentSchool() === 'hengqin-high-school' ? "https://dulwichzhuhai.mike-x.com/GVBeZ" : getCurrentSchool() === 'beijing' ? "https://dulwichbeijing.openapply.cn/roi?c_campaign=1962" : getCurrentSchool() === 'bangkok' ? "/admissions/enquire-more-about-dulwich" : (isChineseVersion ? "/zh/admissions/enquire" : "/admissions/enquire")} className="flex flex-col items-center justify-center gap-1 hover:bg-gray-50 transition-colors">
            <Icon icon="Icon_Email" size={20} color="#D30013" />
            <span className="text-[10px] text-[#3C3C3B]">{isChineseVersion ? '咨询' : 'ENQUIRE'}</span>
          </a>

          {/* APPLY */}
          {getCurrentSchool() !== 'seoul' && (
            <a href={getCurrentSchool() === 'hengqin-high-school' ? "https://dulwichzhuhai.mike-x.com/zVFgO" : getCurrentSchool() === 'beijing' ? "https://dulwichbeijing.openapply.cn/apply/forms/19779?c_campaign=1963" : (isChineseVersion ? "/zh/admissions/apply-now" : "/admissions/apply-now")} className="flex flex-col items-center justify-center gap-1 hover:bg-gray-50 transition-colors">
              <Icon icon="Admissions" size={20} color="#D30013" />
              <span className="text-[10px] text-[#3C3C3B]"> {isChineseVersion ? '上海浦东德威招生申请' : 'APPLY NOW'}</span>
            </a>
          )}

          {getCurrentSchool() === 'seoul' && (
            <a href="/contact" className="flex flex-col items-center justify-center gap-1 hover:bg-gray-50 transition-colors">
              <Icon icon="Contact-Us_Icon" size={20} color="#D30013" />
              <span className="text-[10px] text-[#3C3C3B]"> {isChineseVersion ? 'CONTACT US' : 'CONTACT US'}</span>
            </a>
          )}
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      {
        mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="lg:hidden fixed inset-0 z-[100] bg-black bg-opacity-50 animate-in fade-in duration-300"
              onClick={() => setMobileMenuOpen(false)}
              style={{ touchAction: 'none' }}
              onTouchMove={(e) => e.preventDefault()}
            />

            {/* Menu Panel - Slides in from right */}
            <div className="lg:hidden fixed top-0 right-0 bottom-0 w-full max-w-md z-[101] bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col"
              style={{
                transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
                maxHeight: '100vh',
                maxHeight: '100dvh'
              }}>
              {/* Menu Header */}
              <div className="bg-white px-3 py-4 flex items-center justify-between flex-shrink-0">
                <a
                  href="/"
                  className="flex items-center gap-0 text-[#3C3C3B]] hover:text-[#D30013] transition-colors"
                >
                  <div className="w-11 h-8 bg-white flex items-center justify-center">
                    <Icon icon="Icon-Home" size={24} color="#3C3C3B" />
                  </div>
                  <span className="text-[12px] font-bold">HOME</span>
                </a>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                  <Icon icon="Close-Button" size={38} color="#D30013" />
                </button>
              </div>

              {/* Menu Content */}
              <div className="flex flex-col flex-1 overflow-hidden">
                {/* Menu Items - mapped from navItems */}
                <div
                  ref={mobileMenuScrollRef}
                  className="flex-1 px-5 py-0 space-y-1 overflow-y-auto mobile-menu-scroll"
                  style={{
                    paddingBottom: isSearchFocused ? '70vh' : '1.5rem',
                    transition: 'padding-bottom 0.4s ease-out'
                  }}
                >
                  {nav.navItems.map((navItem, navIndex) => {
                    // Collect all highlighted links from all sections for this nav item
                    const allHighlightedLinks = [];
                    navItem.sections?.forEach((sec) => {
                      const filteredLinks = filterLinks(sec.links || []);
                      const highlightedLinks = filteredLinks.filter(link => link.isHighlighted);
                      allHighlightedLinks.push(...highlightedLinks);
                    });

                    // Use a unique identifier combining id and index to ensure uniqueness
                    const uniqueNavId = `${navItem.id}-${navIndex}`;

                    // Debug logging
                    if (process.env.NODE_ENV === 'development') {
                      console.log(`Mobile Nav Item: ${navItem.label}, ID: ${navItem.id}, Unique ID: ${uniqueNavId}`);
                    }

                    return (
                      <React.Fragment key={uniqueNavId}>
                        <div className="relative">
                          <div className="w-full flex items-center py-4">
                            {/* Left 80% - Direct link to page */}
                            <a
                              href={navItem.url || '#'}
                              className="text-[20px] text-[#3C3C3B] font-normal hover:text-[#D30013] transition-colors text-left"
                              style={{ width: '80%' }}
                            >
                              {navItem.label}
                            </a>

                            {/* Right 20% - Dropdown toggle */}
                            <button
                              onClick={() => {
                                const newSection = openMobileSection === uniqueNavId ? null : uniqueNavId;
                                console.log(`Clicked: ${navItem.label} (${uniqueNavId}), Setting openMobileSection to:`, newSection);
                                setOpenMobileSection(newSection);
                              }}
                              className="flex items-center justify-end"
                              style={{ width: '20%' }}
                            >
                              <ChevronDown className={`chevron-rotate w-7 h-6 text-[#D30013] ${openMobileSection === uniqueNavId ? 'rotate-180' : 'rotate-0'}`} />
                            </button>
                          </div>
                          {/* Red underline when expanded */}
                          <div
                            className={`section-underline absolute left-0 right-0 bottom-0 h-[4px] bg-[#9E1422] ${openMobileSection === uniqueNavId ? 'scale-x-100' : 'scale-x-0'
                              }`}
                          />
                        </div>

                        {openMobileSection === uniqueNavId && (
                          <div
                            className="dropdown-content bg-white px-0 py-3 mb-2 text-left"
                            style={{
                              animation: 'slideInFromTop 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                          >
                            <div className="space-y-6">
                              {/* Main Section Link - appears first when dropdown opens */}
                              {/* {navItem.url && navItem.url !== '#' && (
                                <div className="border-b border-gray-100">
                                  <a
                                    href={navItem.url}
                                    className="link-item flex items-center justify-between text-base font-semibold text-[#D30013] hover:text-[#B8000F] hover:pl-2 py-2 transition-all"
                                  >
                                    {navItem.label}
                                    <Icon icon="Icon-Chevron-Large" size={15} color="#D30013" className="flex-shrink-0" />
                                  </a>
                                </div>
                              )} */}

                              {(() => {
                                // Check if there are any regular sections with content
                                const hasRegularSections = navItem.sections.some(sec => {
                                  const filteredLinks = filterLinks(sec.links);
                                  const regularLinks = filteredLinks.filter(link => !link.isHighlighted);
                                  return regularLinks.length > 0;
                                });

                                return (
                                  <>
                                    {/* REGULAR SECTIONS - Show first */}
                                    {navItem.sections.map((sec, i) => {
                                      const filteredLinks = filterLinks(sec.links);
                                      if (filteredLinks.length === 0) return null;

                                      // Only show regular (non-highlighted) links in the sections
                                      const regularLinks = filteredLinks.filter(link => !link.isHighlighted);

                                      // Skip this section if there are no regular links
                                      if (regularLinks.length === 0) return null;

                                      return (
                                        <div key={i}>
                                          <h3 className="text-[12px] font-bold text-[#3C3C3B] mb-4 tracking-[1.1px] uppercase">
                                            <a href={sec.url || '#'} className="hover:text-[#D30013] transition-colors">
                                              {sec.heading}
                                            </a>
                                          </h3>

                                          {/* Regular link list */}
                                          <div className="space-y-0">
                                            {regularLinks.map((link, j) => {
                                              const linkIsActive = isLinkActive(link.url);
                                              return (
                                                <a
                                                  key={j}
                                                  href={link.url}
                                                  className={`link-item block text-base hover:pl-2 py-3.5 border-b border-gray-100 last:border-b-0 ${linkIsActive
                                                    ? 'text-[#D30013] font-semibold bg-[#FEF2F2] pl-2'
                                                    : 'text-[#3C3C3B] hover:text-[#D30013]'
                                                    }`}
                                                >
                                                  {link.header_menu_title || link.title}
                                                </a>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      );
                                    })}

                                    {/* HIGHLIGHTED SECTION */}
                                    {allHighlightedLinks.length > 0 && (
                                      <div className="pt-4">
                                        <div className="grid grid-cols-4 gap-4">
                                          {/* Empty spacers to push items to columns 3 and 4 when there are 2 items */}
                                          {allHighlightedLinks.length === 2 && (
                                            <>
                                              <div></div>
                                              <div></div>
                                            </>
                                          )}
                                          {allHighlightedLinks.length === 1 && (
                                            <>
                                              <div></div>
                                              <div></div>
                                              <div></div>
                                            </>
                                          )}
                                          {allHighlightedLinks.map((link, j) => (
                                            <a key={j} href={link.url} className="block group">
                                              <div className="bg-white rounded text-left overflow-hidden shadow-sm border border-[#F2EDE9] hover:shadow-md transition-all duration-300">
                                                {link.imageUrl && (
                                                  <div className="aspect-[4/3] overflow-hidden relative">
                                                    <img
                                                      src={link.imageUrl}
                                                      alt={link.title}
                                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                  </div>
                                                )}
                                              </div>
                                            </a>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </>
                                );
                              })()}
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}



                  <a href={isChineseVersion ? "/zh/sitemap" : "/sitemap"} className="link-item flex items-center gap-3 py-3.5 text-[15px] text-[#3C3C3B] hover:text-[#D30013] hover:pl-2">
                    <img src={sitemapIcon} alt="Site Map" className="w-5 h-5" />
                    <span className='text-[14px] font-medium text-[#3C3C3B]'>{nav.siteMapLabel}</span>
                  </a>

                  <button
                    onClick={() => setOpenMobileSection(openMobileSection === 'schools' ? null : 'schools')}
                    className="w-full flex items-center justify-between py-3.5 text-[14px] font-medium text-[#3C3C3B] hover:text-[#D30013] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Icon icon="Icon-Menu" size={20} color="#3C3C3B" />
                      <span className='text-[14px] font-medium text-[#3C3C3B]'>{isChineseVersion ? "学校" : "Schools"}</span>
                    </div>
                    <ChevronDown className={`chevron-rotate w-5 h-5 text-[#D30013] ${openMobileSection === 'schools' ? 'rotate-180' : 'rotate-0'}`} />
                  </button>
                  {openMobileSection === 'schools' && schoolsList && schoolsList.length > 0 && (
                    <div
                      className="dropdown-content bg-gray-50 rounded-lg p-4 mb-2 space-y-2"
                      style={{
                        animation: 'slideInFromTop 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      {schoolsList.map((school) => (
                        <button
                          key={school.id}
                          onClick={() => {
                            handleSchoolSelect(school);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${selectedSchool === `${school.title}`
                            ? 'bg-white font-semibold text-[#D30013] scale-[1.02]'
                            : 'hover:bg-white hover:scale-[1.02] text-[#4B5563]'
                            }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{school.title}</span>
                            {selectedSchool === `${school.title}` && (
                              <span className="text-[#D30013] text-lg">✓</span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {school !== "bangkok" && school !== "hengqin-high-school" && (
                    <a
                      href={parentPortalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-red-600 transition-colors parent-portal text-left flex"
                      style={{
                        color: "#3C3C3B",
                        lineHeight: "2.2",
                        borderRight: "1px solid #E3D9D1",
                        paddingRight: "30px",
                      }}
                    >
                      {nav.topBar.parentPortal}
                    </a>
                  )}

                  {/* <a href="#calendar" className="link-item flex items-center gap-3 py-3 text-base text-[#3C3C3B] hover:text-[#D30013] hover:pl-2 transition-colors mb-4">
                  <Icon icon="Icon---Download" size={20} color="#3C3C3B" />
                  <span className='text-[14px] font-medium text-[#3C3C3B]'>School Calendar</span>
                </a> */}

                  {/* Search and Language Tabs */}
                  <div
                    ref={mobileSearchRef}
                    className={`mt-4 pt-4 border-t border-[#F2EDE9] px-4 py-4 -mx-4 transition-all duration-300 ${isSearchFocused ? 'bg-white shadow-lg' : 'bg-[#fff]'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Search */}
                      <form onSubmit={handleSearch} className="relative flex-1">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                          <Icon icon="Icon-Search" size={20} color="#3C3737" />
                        </div>
                        <input
                          type="text"
                          placeholder={nav.searchPlaceholder}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onFocus={() => {
                            setIsSearchFocused(true);
                          }}
                          onBlur={() => {
                            // Delay blur to allow keyboard to close smoothly
                            setTimeout(() => {
                              setIsSearchFocused(false);
                            }, 100);
                          }}
                          autoComplete="off"
                          autoCorrect="off"
                          autoCapitalize="off"
                          spellCheck="false"
                          inputMode="search"
                          className={`w-full pl-10 pr-4 py-2.5  bg-[#FAF7F5] border bottom-[#F2EDE9] rounded-lg text-sm transition-all duration-300 ${isSearchFocused
                            ? 'border-[#D30013] ring-2 ring-[#D30013] ring-opacity-50 shadow-lg'
                            : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D30013] focus:border-transparent'
                            }`}
                        />
                      </form>

                      {/* Language Tabs - Hidden for Singapore, Bangkok, and Seoul */}
                      {!['singapore', 'bangkok', 'seoul'].includes(getCurrentSchool()) && (
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              if (!isChineseVersion) {
                                toggleLanguage(e);
                              }
                            }}
                            className={`relative px-3 py-2.5 text-sm font-bold  transition-colors ${activeLanguage === '中文'
                              ? 'text-[#3C3737]'
                              : 'text-[#3C3737] hover:text-[#3C3737]'
                              }`}
                          >
                            中文
                            {activeLanguage === '中文' && (
                              <span className="absolute bottom-0 left-0 right-0 h-[4px] bg-[#9E1422]" />
                            )}
                          </button>
                          <button
                            onClick={(e) => {
                              if (isChineseVersion) {
                                toggleLanguage(e);
                              }
                            }}
                            className={`relative px-3 py-2.5 text-sm font-bold transition-colors ${activeLanguage === 'EN'
                              ? 'text-[#3C3737]'
                              : 'text-[#3C3737] hover:text-[#3C3737]'
                              }`}
                          >
                            EN
                            {activeLanguage === 'EN' && (
                              <span className="absolute bottom-0 left-0 right-0 h-[4px] bg-[#9E1422]" />

                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Empty Bottom Section - for proper layout */}
                <div className="flex-shrink-0"></div>
              </div>
            </div>
          </>
        )
      }

      {/* SEARCH RESULTS MODAL - Shows on all screen sizes */}
      <SearchModal
        showSearchResults={showSearchResults}
        setShowSearchResults={setShowSearchResults}
        searchQuery={searchQuery}
        isSearching={isSearching}
        searchResults={searchResults}
        currentSearchPage={currentSearchPage}
        handleSearchPageChange={handleSearchPageChange}
        nav={nav}
      />
    </>
  );
}

export default PageHeader;