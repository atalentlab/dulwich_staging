import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { ChevronDown, Menu as MenuIcon, X } from 'lucide-react';
import Icon from '../Icon';
import SearchModal from '../SearchModal';
import curriculumImage from '../../assets/images/Curriculum.png';
import logo from '../../assets/images/dci-group-logo.svg';
import sitemapIcon from '../../assets/images/sitemap.png';
import { getCurrentSchool } from '../../utils/schoolDetection';
import rawNavigationData from '../../assets/menu/header-navigation.json';
import { useDynamicMenu } from '../../hooks/useDynamicMenu';
import { transformMenuData } from '../../utils/menuTransformer';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://cms.dulwich.atalent.xyz';


function PageHeader({ selectedSchool, setSelectedSchool, setSelectedSchoolSlug, setChatOpen, chatOpen, pageLayoutType }) {
  // ── All Hooks MUST be called unconditionally at the top ───────────────────
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState('EN');
  const [openMobileSection, setOpenMobileSection] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isChineseVersion, setIsChineseVersion] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [currentSearchPage, setCurrentSearchPage] = useState(1);
  const mobileSearchRef = React.useRef(null);
  const mobileMenuScrollRef = React.useRef(null);
  const [schoolsList, setSchoolsList] = useState([]);

  // Fetch dynamic menu data from API
  const currentLocale = isChineseVersion ? 'zh' : 'en';
  const { data: dynamicMenuData, isLoading: isMenuLoading, error: menuError } = useDynamicMenu(currentLocale);

  // Transform API data to navigation structure, fallback to static JSON if API fails
  const nav = React.useMemo(() => {
    if (dynamicMenuData?.success) {
      return transformMenuData(dynamicMenuData);
    }
    // Fallback to static JSON
    return isChineseVersion ? rawNavigationData.zh : rawNavigationData.en;
  }, [dynamicMenuData, isChineseVersion]);

  // ── All useEffect hooks MUST be called before any conditional returns ─────

  // Check if current URL has zh/ prefix
  useEffect(() => {
    const pathname = location.pathname;
    const isChinese = pathname.startsWith('/zh/') || pathname === '/zh';
    setIsChineseVersion(isChinese);
    setActiveLanguage(isChinese ? '中文' : 'EN');
  }, [location.pathname]);

  // Always fetch schools from API with the current locale
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const baseUrl = process.env.REACT_APP_API_URL || 'https://www.dulwich.atalent.xyz';
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
  }, [isChineseVersion]);

  useEffect(() => {
    const handleScroll = () => {
      const shouldBeScrolled = window.scrollY > 20;
      if (scrolled !== shouldBeScrolled) {
        setScrolled(shouldBeScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

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

  // ── Layout Type 4: Minimal Header with Logo Only ──────────────────────────
  // Debug logging and robust type conversion
  const normalizedLayoutType = pageLayoutType !== undefined && pageLayoutType !== null
    ? parseInt(pageLayoutType, 10)
    : null;

  if (process.env.NODE_ENV === 'development') {
    console.log('International PageHeader - pageLayoutType:', pageLayoutType, 'Type:', typeof pageLayoutType, 'Normalized:', normalizedLayoutType);
  }

  if (normalizedLayoutType === 4) {
    console.log('✅ Rendering MINIMAL header for international');

    return (
      <>
        {/* DESKTOP MINIMAL HEADER */}
        <header className="hidden lg:block fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
          <div className="px-4 py-4">
            <div className="max-w-[1120px] mx-auto flex items-left justify-left">
              <div className="flex items-left gap-4">
                <img
                  src="/images/crest-logo.svg"
                  alt="Dulwich College"
                  className="h-12 w-[30px] hover:scale-110 cursor-pointer transition-all duration-200"
                  onClick={() => window.location.href = isChineseVersion ? '/zh/' : '/'}
                />
                <img
                  src={logo}
                  alt="Dulwich College International"
                  className="h-12 w-[305px] cursor-pointer transition-all duration-200"
                  onClick={() => window.location.href = isChineseVersion ? '/zh/' : '/'}
                />
              </div>
            </div>
          </div>
        </header>

        {/* MOBILE MINIMAL HEADER */}
        <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
          <div className="px-4 py-3">
            <div className="flex items-left justify-left">
              <img
                src="/images/crest-logo.svg"
                alt="Dulwich College"
                className="h-12 w-auto cursor-pointer pr-3"
                onClick={() => window.location.href = isChineseVersion ? '/zh/' : '/'}
              />
              <img
                src={logo}
                alt="Dulwich College International"
                className="w-[220px] cursor-pointer"
                onClick={() => window.location.href = isChineseVersion ? '/zh/' : '/'}
              />
            </div>
          </div>
        </header>
      </>
    );
  }

  // ── Normal Header (all other layout types) ────────────────────────────────

  // Language toggle function
  const toggleLanguage = (e) => {
    e.preventDefault();
    const pathname = location.pathname;
    const search = location.search;
    const hash = location.hash;

    let newPath;
    if (isChineseVersion) {
      newPath = pathname.replace(/^\/zh(\/|$)/, '/');
      if (newPath === '') newPath = '/';
    } else {
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

      // Add school parameter if available
      const currentSchoolSlug = getCurrentSchool();
      if (currentSchoolSlug) {
        searchParams.append('school', `${currentSchoolSlug}`);
      }

      // Add locale parameter for Chinese version
      if (isChineseVersion) {
        searchParams.append('locale', 'zh');
      }

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

  return (
    <>
      {/* Custom CSS for smooth dropdown animations */}
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
          background: #9CA3AF;
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
                <div className="relative bg-[#FAF7F5] gap-3" onClick={() => setChatOpen(false)}>
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
                  {isChineseVersion ? '查询' : 'Enquire'}
                  <Icon icon="Icon_Email" size={20} className="transition-transform duration-300" />
                </button>

                <a href="https://www.dulwich.org/contact">
                  <button
                    className="group flex items-center gap-2 px-4 py-3.5 text-sm font-medium text-white rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg active:scale-95"
                    style={{ backgroundColor: '#D30013' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#B8000F'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#D30013'; }}
                  >
                    {isChineseVersion ? '查找学校' : 'Find a School'}
                    <Icon icon="Icon-Arrow" size={18} color="white" className="transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Normal Header when Chat is Closed */}
        {!chatOpen && (
          <>
            {/* Top Bar - Hidden when scrolled */}
            {!scrolled && (
              <div className="px-4 py-2 transition-all duration-200 ease-out">
                <div className="max-w-[1120px] mx-auto px-5 flex items-center justify-between">
                  {/* Logo */}
                  <div className="flex items-center gap-8">
                    <img
                      src="/images/crest-logo.svg"
                      alt="Dulwich College"
                      className="transition-all duration-200 ease-out h-12 w-[30px] hover:scale-110 cursor-pointer"
                      onClick={() => window.location.href = isChineseVersion ? '/zh/' : '/'}
                    />
                    <img
                      src={logo}
                      alt="Dulwich College International"
                      className="h-12 w-[305px] transition-all duration-500 ease-out cursor-pointer"
                      onClick={() => window.location.href = isChineseVersion ? '/zh/' : '/'}
                    />
                  </div>

                  {/* Top Right Links */}
                  <div className="flex items-center gap-4 font-medium text-[12px] text-[#3C3C3B]">
                    <a
                      href={nav.topBar.admissions.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#9E1422] transition-colors"
                      style={{ color: '#3C3C3B', lineHeight: '2.2', borderRight: '1px solid #E3D9D1', paddingRight: '20px' }}
                    >
                      {nav.topBar.admissions.label}
                    </a>
                    <a href={nav.topBar.careers.url} className="hover:text-[#D30013] transition-colors">
                      {nav.topBar.careers.label}
                    </a>
                    {/* Hide language switcher for Singapore */}
                    {getCurrentSchool() !== 'singapore' && (
                      <a href="#"
                        onClick={toggleLanguage}
                        className="hover:text-[#9E1422] font-extrabold transition-colors px-2">
                        {isChineseVersion ? 'EN' : '中文'}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Main Navigation */}
            <div className={`px-4 ${scrolled ? 'py-3' : 'py-4'} transition-all duration-200 ease-out`}>
              <div className="max-w-[1120px] mx-auto px-5 flex items-center justify-between">
                {/* Logo - Only visible when scrolled */}
                <div className={`w-full flex items-center justify-left gap-5 transition-all duration-200 ease-out ${scrolled ? 'ml-[0%]' : 'ml-[2%]'}`}>
                  {scrolled && (
                    <div className="flex items-center gap-4 transition-all duration-200 ease-out" style={{
                      animation: 'smoothSlideDown 200ms ease-out'
                    }}>
                      <img
                        src="/images/crest-logo.svg"
                        alt="Dulwich College"
                        className="transition-all duration-200 ease-out h-12 w-12 hover:scale-110 cursor-pointer"
                        onClick={() => window.location.href = isChineseVersion ? '/zh/' : '/'}
                      />
                    </div>
                  )}

                  {/* Navigation Menu - mapped from JSON */}
                  <NavigationMenu.Root
                    className="flex"
                    onValueChange={(value) => setIsDrawerOpen(!!value)}
                    delayDuration={100}
                  >
                    <NavigationMenu.List className="flex items-left gap-1">
                      {nav.desktopNav.map((navItem) => (
                        <NavigationMenu.Item key={navItem.id}>
                          <NavigationMenu.Trigger className="group px-5 py-1 text-[16px] font-base text-[#3C3C3B] hover:text-gray-900 data-[state=open]:text-gray-900 outline-none transition-all duration-200 relative">
                            {navItem.label}
                            <span className={`absolute ${scrolled ? '-bottom-3' : '-bottom-4'} left-0 w-full h-2 bg-[#9E1422] scale-x-0 group-hover:scale-x-100 group-data-[state=open]:scale-x-100 transition-all duration-200 origin-left`}></span>
                          </NavigationMenu.Trigger>
                          <NavigationMenu.Content
                            className={`fixed left-0 right-0 ${scrolled ? 'top-[72px]' : 'top-[140px]'} w-full transition-all duration-200 ease-out z-[60]`}
                            style={{ transformOrigin: 'top', animation: 'none' }}
                          >
                            <div className="w-full bg-white">
                              <div className="w-[1120px] mx-auto px-4 py-8">
                                <div className="grid grid-cols-3 gap-8 mb-8">
                                  {/* Links column - only rendered when links exist */}
                                  {navItem.links.length > 0 && (
                                    <div className="text-left">
                                      <ul className="space-y-4">
                                        {navItem.links.map((link, i) => (
                                          <li key={i}>
                                            <a href={link.url} className="text-base text-[#3C3C3B] hover:text-[#D30013] transition-colors">
                                              {link.title}
                                            </a>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {/* Feature cards */}
                                  {navItem.cards.map((card, i) => (
                                    <div key={i} className="flex flex-col h-full">
                                      {/* Card title as heading */}
                                      <h3 className="text-[12px] text-left font-bold text-[#3C3C3B] mb-4 tracking-widest uppercase h-8 flex items-start">
                                        {card.heading}
                                      </h3>
                                      <div className="w-full h-40 overflow-hidden relative rounded-lg mb-4">
                                        <img
                                          src={card.imageUrl}
                                          alt={card.imageAlt}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <div className="flex-1 flex flex-col">
                                        <p className="text-sm text-left text-[#3C3C3B] mb-4 leading-relaxed flex-1">
                                          {card.description}
                                        </p>
                                        <a
                                          href={card.url}
                                          className="block w-full px-6 py-2.5 text-sm text-[#D30013] border border-[#D30013] rounded hover:bg-[#D30013] hover:text-white transition-all duration-200 text-center mt-auto"
                                        >
                                          {card.heading}
                                        </a>
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                {/* Bottom Section */}
                                <div className="pt-6 border-t col-span-2 border-[#EAE8E4] flex items-center justify-between">
                                  <a href={isChineseVersion ? '/zh/sitemap' : '/sitemap'} className="text-sm text-[#3C3C3B] hover:text-[#D30013] transition-colors">
                                    {nav.siteMapLabel}
                                  </a>
                                  <form onSubmit={handleSearch} className="relative w-[50%]">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                      <Icon icon="Icon-Search" size={16} color="#9CA3AF" />
                                    </div>
                                    <input
                                      type="text"
                                      placeholder={isChineseVersion ? '搜索' : 'Search'}
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
                        </NavigationMenu.Item>
                      ))}

                      {/* Schools Dropdown */}
                      {/* {availableSchools && availableSchools.length > 0 && (
                        <NavigationMenu.Item>
                          <NavigationMenu.Trigger className={`group px-5 py-1 text-[16px] font-base text-[#3C3C3B] hover:text-gray-900 data-[state=open]:text-gray-900 outline-none transition-all duration-200 relative`}>
                            Schools
                            <span className={`absolute ${scrolled ? '-bottom-3' : '-bottom-4'} left-0 w-full h-2 bg-[#9E1422] scale-x-0 group-hover:scale-x-100 group-data-[state=open]:scale-x-100 transition-all duration-200 origin-left`}></span>
                          </NavigationMenu.Trigger>
                          <NavigationMenu.Content
                            className={`fixed left-0 right-0 ${scrolled ? 'top-[72px]' : 'top-[140px]'} w-full transition-all duration-200 ease-out z-[60]`}
                            style={{ transformOrigin: 'top', animation: 'none' }}
                          >
                            <div className="w-full bg-white">
                              <div className="w-[1120px] mx-auto px-4 py-8">
                                <div className="grid grid-cols-2 gap-4">
                                  {availableSchools.map((school) => {
                                    const schoolName = `Dulwich College ${school.title}`;
                                    const isSelected = selectedSchool === schoolName;

                                    return (
                                      <button
                                        key={school.id}
                                        onClick={() => {
                                          if (setSelectedSchool) setSelectedSchool(schoolName);
                                          if (setSelectedSchoolSlug) setSelectedSchoolSlug(school.slug);
                                          // Redirect to school URL if available
                                          if (school.url) {
                                            const cleanUrl = school.url.replace(/\\\\\//g, '/');
                                            window.location.assign(cleanUrl);
                                          }
                                        }}
                                        className={`text-left px-6 py-4 rounded-lg border transition-all duration-200 ${
                                          isSelected
                                            ? 'border-[#D30013] bg-[#FEF2F2]'
                                            : 'border-gray-200 hover:border-[#D30013] hover:bg-[#FEF2F2]'
                                        }`}
                                      >
                                        <div className="flex items-center justify-between">
                                          <span className={`text-base ${isSelected ? 'font-semibold text-[#D30013]' : 'text-[#3C3C3B]'}`}>
                                            {schoolName}
                                          </span>
                                          {isSelected && (
                                            <span className="text-[#D30013] text-xl">✓</span>
                                          )}
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </NavigationMenu.Content>
                        </NavigationMenu.Item>
                      )} */}

                    </NavigationMenu.List>
                  </NavigationMenu.Root>
                </div>

                {/* Right Side Buttons */}
                <div className="w-full flex justify-end items-center gap-3">
                  <div className="relative">
                    {chatOpen && (
                      <div
                        className="absolute -bottom-1 left-0 right-0 h-1 bg-[#D30013] rounded-full animate-in slide-in-from-bottom-2 duration-300"
                        style={{ animation: 'slideIn 0.3s ease-out' }}
                      />
                    )}
                  </div>

{/* <a href={isChineseVersion ? "/zh/admissions/enquire" : "/admissions/enquire"}>
                  <button
                    className="group flex items-center gap-2 px-4 py-3 text-sm border rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
                    style={{ color: '#D30013', borderColor: '#D30013' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FEF2F2'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    {isChineseVersion ? '查询' : 'Enquire'}
                    <Icon icon="Icon_Email" size={20} className="transition-transform duration-300" />
                  </button>
                  </a> */}

<a href={isChineseVersion ? "/zh/find-a-school" : "/find-a-school"}>
  <button
    className="group flex items-center gap-2 px-5 py-3.5 text-sm text-white rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg active:scale-95"
    style={{ backgroundColor: '#D30013' }}
    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#B8000F'; }}
    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#D30013'; }}
  >
    {isChineseVersion ? '查找学校' : 'Find a School'}
    <Icon icon="Find-a-School_White" size={18} color="white" className="pb-[2px]"/>
  </button>
</a>
                </div>
              </div>
            </div>
          </>
        )}
      </header>

      {/* Overlay - Dims background when drawer is open */}
      {isDrawerOpen && (
        <div
          className="
              hidden lg:block
              fixed inset-0
              bg-gray-400/40
              z-40
              transition-all duration-200 ease-out
            "
          style={{
            top: scrolled ? '80px' : '140px',
            opacity: isDrawerOpen ? 1 : 0
          }}
        />
      )}

      {/* MOBILE HEADER - Shows on screens < lg (below 1024px) */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="px-4 py-2.5 border-b border-gray-200">
          <div className="flex items-center justify-between">
      <div className='flex items-center'>
              {/* Logo */}
              <img
              src="/images/crest-logo.svg"
              alt="Dulwich College"
              className="h-10 w-auto cursor-pointer pr-4"
              onClick={() => window.location.href = isChineseVersion ? '/zh/' : '/'}
            />
               <img
              src={logo}
              alt="Dulwich College"
              className="w-[220px] cursor-pointer"
              onClick={() => window.location.href = isChineseVersion ? '/zh/' : '/'}
            />
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
          {/* ai ask replaced */}
          <a href={isChineseVersion ? "/zh/admissions" : "/admissions"} 
            // onClick={() => setChatOpen && setChatOpen(true)}
            className="flex flex-col items-center justify-center gap-1 hover:bg-gray-50 transition-colors"
          >
            {/* <Icon icon="Icon-AI" size={20} color="#D30013" /> */}
            
             <Icon icon="Admissions" size={20} color="#D30013" />
            <span className="text-[10px] text-[#3C3C3B]"> {isChineseVersion ? '招生' : 'Admissions'}</span>
          </a>

          {/* ENQUIRE */}
          <a href={isChineseVersion ? "/zh/working-at-dulwich" : "/working-at-dulwich"} className="flex flex-col items-center justify-center gap-1 hover:bg-gray-50 transition-colors">
            <Icon icon="Careers" size={20} color="#D30013" />
            <span className="text-[10px] text-[#3C3C3B]"> {isChineseVersion ? '职业发展' : 'Careers'}</span>
          </a>

          {/* APPLY */}
          <a href={isChineseVersion ? "/zh/find-a-school" : "/find-a-school"} className="flex flex-col items-center justify-center gap-1 hover:bg-gray-50 transition-colors">
          <Icon icon="Find-a-School_Red" size={18} color="red" className="transition-transform duration-300 group-hover:translate-x-1" />
            <span className="text-[10px] text-[#3C3C3B]"> {isChineseVersion ? '查找学校' : 'Find a School'}</span>
          </a>

        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      {mobileMenuOpen && (
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
                href={isChineseVersion ? '/zh/' : '/'}
                className="flex items-center gap-0 text-[#3C3C3B]] hover:text-[#D30013] transition-colors"
              >
                <div className="w-11 h-8 bg-white flex items-center justify-center">
                  <Icon icon="Icon-Home" size={24} color="#3C3C3B" />
                </div>
                <span className="text-[12px] font-bold">HOME</span>
              </a>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
              <Icon icon="Close-Button" size={38} color="#D30013"/>
              </button>
            </div>

            {/* Menu Content */}
            <div className="flex flex-col flex-1 overflow-hidden">
              {/* Menu Items - mapped from JSON */}
              <div
                ref={mobileMenuScrollRef}
                className="flex-1 px-5 py-0 space-y-1 overflow-y-auto mobile-menu-scroll"
                style={{
                  paddingBottom: isSearchFocused ? '70vh' : '1.5rem',
                  transition: 'padding-bottom 0.4s ease-out'
                }}
              >
                {nav.mobileNav.map((section) => (
                  <React.Fragment key={section.id}>
                    <div className="relative border-b border-gray-100">
                      <button
                        onClick={() => setOpenMobileSection(openMobileSection === section.id ? null : section.id)}
                        className="w-full flex items-center justify-between py-4"
                      >
                        <span className="text-[20px] text-[#3C3C3B] font-normal">{section.label}</span>
                        <ChevronDown className={`chevron-rotate w-7 h-6 text-[#D30013] translate-x-1 ${openMobileSection === section.id ? 'rotate-180' : 'rotate-0'}`} />
                      </button>
                      {/* Red underline when expanded */}
                      <div
                        className={`section-underline absolute left-0 right-0 bottom-0 h-[4px] bg-[#9E1422] transition-transform duration-300 ${
                          openMobileSection === section.id ? 'scale-x-100' : 'scale-x-0'
                        }`}
                      />
                    </div>

                    {openMobileSection === section.id && (
                      <div
                        className="dropdown-content bg-white px-0 py-3 mb-2 text-left"
                        style={{
                          animation: 'slideInFromTop 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                      >
                        {section.type === 'simple' ? (
                          <div className="space-y-3">
                            {section.links.map((link, i) => (
                              <a key={i} href={link.url} className="link-item block text-[16px] text-[#3C3C3B] hover:text-[#D30013] hover:pl-2 py-2">
                                {link.title}
                              </a>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-6 text-left">
                            {section.sections.map((sec, i) => (
                              <div key={i}>
                                {sec.style === 'highlighted' ? (
                                  <>
                                    {/* Highlighted Section Header */}
                                    <h3 className="text-[12px] font-bold text-[#3C3C3B] mb-3 uppercase tracking-[1.1px]">{sec.heading || 'HIGHLIGHTED'}</h3>
                                  </>
                                ) : (
                                  <h3 className="text-[12px] font-bold text-[#3C3C3B] mb-4 uppercase tracking-widest">{sec.heading}</h3>
                                )}

                                {/* Card Grid for highlighted items */}
                                {sec.style === 'highlighted' ? (
                                  <div className="grid grid-cols-2 gap-4 mb-6 text-left">
                                    {sec.links.map((link, j) => (
                                      <a key={j} href={link.url} className={`block group card-stagger-${j + 1}`}>
                                        <div className="bg-white rounded text-left overflow-hidden shadow-sm border border-[#F2EDE9] hover:shadow-md transition-all duration-300">
                                          {(link.imageUrl || link.image) && (
                                            <div className="aspect-[4/3] overflow-hidden relative">
                                              <img
                                                src={link.imageUrl || link.image}
                                                alt={link.title}
                                                className="w-full h-full min-w-[168px] object-cover group-hover:scale-105 transition-transform duration-300"
                                              />
                                            </div>
                                          )}
                                          <div className="h-[36px] px-2 flex items-center justify-between bg-white">
                                            <span className="text-[12px] leading-3 font-semibold text-[#D30013]">{link.title}</span>
                                            <Icon icon="Icon-Chevron-Large" size={15} color="#D30013" className="font-semibold flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                                          </div>
                                        </div>
                                      </a>
                                    ))}
                                  </div>
                                ) : (
                                  /* Regular link list */
                                  <div className="space-y-0">
                                    {sec.links.map((link, j) => (
                                      <a key={j} href={link.url} className="link-item block text-base text-[#3C3C3B] hover:text-[#D30013] hover:pl-2 py-3.5 border-b border-gray-100 last:border-b-0">
                                        {link.title}
                                      </a>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </React.Fragment>
                ))}

                {/* Extra links - mapped from JSON */}
                {nav.mobileExtraLinks.map((link, i) => {
                  // Map icon names for each link
                  const iconMap = {
                    'Full Site Map': 'Icon-Schools',
                    'Schools': 'Icon-Menu',
                    'Parent Portal': 'Icon_External',
                    'School Calendar': 'Icon---Download'
                  };
                  const iconName = link.icon || iconMap[link.label] || 'Icon-Arrow';

                  // Skip Schools link here - it will be rendered separately below
                  if (link.label === 'Schools') {
                    return null;
                  }

                  // Handle sitemap link with language routing
                  const href = (link.label === 'Full Site Map' || link.label === '完整网站地图')
                    ? (isChineseVersion ? '/zh/sitemap' : '/sitemap')
                    : link.href;

                  return (
                    <a key={i} href={href} className="link-item flex font-medium  items-center gap-3 py-3.5 text-[14px] text-[#3C3C3B] hover:text-[#D30013] hover:pl-2">
                      {link.label === 'Full Site Map' || link.label === '完整网站地图' ? (
                        <img src={sitemapIcon} alt="Site Map" className="w-5 h-5" />
                      ) : (
                        <Icon icon={iconName} size={20} color="#3C3C3B" />
                      )}
                      <span>{link.label}</span>
                    </a>
                  );
                })}

                {/* Schools Dropdown - Show when schools are loaded (from prop or API) */}
                {schoolsList && schoolsList.length > 0 && (
                  <>
                    <button
                      onClick={() => setOpenMobileSection(openMobileSection === 'schools' ? null : 'schools')}
                      className="w-full flex items-center justify-between py-3.5 font-medium text-[14px] text-[#3C3C3B] hover:text-[#D30013] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Icon icon="Icon-Menu" size={22} color="#3C3C3B" />
                        <span>Schools</span>
                      </div>
                      <ChevronDown className={`chevron-rotate w-7 h-6x text-[#D30013] ${openMobileSection === 'schools' ? 'rotate-180' : 'rotate-0'}`} />
                    </button>
                    {openMobileSection === 'schools' && (
                      <div
                        className="dropdown-content rounded-lg p-3 mb-2 space-y-2"
                        style={{
                          animation: 'slideInFromTop 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                      >
                        {schoolsList.map((school) => (
                          <button
                            key={school.id}
                            onClick={() => {
                              const schoolName = `${school.title}`;
                              if (setSelectedSchool) setSelectedSchool(schoolName);
                              if (setSelectedSchoolSlug) setSelectedSchoolSlug(school.slug);
                              // Redirect to school URL if available
                              if (school.url) {
                                const cleanUrl = school.url.replace(/\\\//g, '/');
                                window.location.assign(cleanUrl);
                              }
                              setMobileMenuOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${
                              selectedSchool === `${school.title}`
                                ? 'bg-white font-semibold text-[#D30013] scale-[1.02]'
                                : 'hover:bg-white hover:scale-[1.02] text-[#4B5563]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span> {school.title}</span>
                              {selectedSchool === `${school.title}` && (
                                <span className="text-[#D30013] text-lg">✓</span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* Search and Language Tabs */}
                <div
                  ref={mobileSearchRef}
                  className={`bg-[#fff] mt-4 pt-4 border-t border-[#F2EDE9] px-4 py-4 -mx-4 transition-all duration-300 ${
                    isSearchFocused ? 'bg-[#FAF7F5] shadow-lg' : 'bg-[#FAF7F5]'
                  }`}
                >
                  <div className="flex items-center gap-3 ">
                    {/* Search */}
                    <form onSubmit={handleSearch} className="relative flex-1 bg-[#FAF7F5]">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <Icon icon="Icon-Search" size={20} color="#3C3737" />
                      </div>
                      <input
                        type="text"
                        placeholder={isChineseVersion ? '搜索' : 'Search'}
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
                        className={`w-full pl-10 pr-4 py-2.5 bg-[#FAF7F5] border bottom-[#F2EDE9] rounded-lg text-sm transition-all duration-300 ${
                          isSearchFocused
                            ? 'border-[#D30013] ring-2 ring-[#D30013] ring-opacity-50 shadow-lg'
                            : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D30013] focus:border-transparent'
                        }`}
                      />
                    </form>

                    {/* Language Tabs - Hidden for Singapore */}
                    {getCurrentSchool() !== 'singapore' && (
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            if (!isChineseVersion) {
                              toggleLanguage(e);
                            }
                          }}
                          className={`relative px-3 py-2.5 text-sm font-medium transition-colors ${activeLanguage === '中文'
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
      )}

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
