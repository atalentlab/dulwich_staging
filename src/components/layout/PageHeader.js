import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { ChevronDown, Menu as MenuIcon, X } from 'lucide-react';
import Icon from '../Icon';
import elImage from '../../assets/images/el.png';
import liveImage from '../../assets/images/live.png';
import matric from '../../assets/images/DCI/University Matriculation.jpeg';
import sleImage from '../../assets/images/sle.png';
import wellImage from '../../assets/images/DCI/wellbeing.jpg';
import wanImage from '../../assets/images/wan.png';
import weImage from '../../assets/images/we.png';
import excelImage from '../../assets/images/excel.png';
import uniImage from '../../assets/images/uni.png';
import curriculumImage from '../../assets/images/Curriculum.png';
import logo from '../../assets/images/dci-group-logo.svg';
import sitemapIcon from '../../assets/images/sitemap.png';
import { getCurrentSchool } from '../../utils/schoolDetection';
import rawNavigationData from '../../assets/menu/header-navigation.json';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://www.dulwich.atalent.xyz';

const imageMap = {
  el: elImage,
  live: liveImage,
  matric: matric,
  sle: sleImage,
  well: wellImage,
  wellbeing: wellImage,
  wan: wanImage,
  we: weImage,
  excel: excelImage,
  uni: uniImage,
  curriculum: curriculumImage,
  'co-curricular': curriculumImage,
};

function PageHeader({ selectedSchool, availableSchools, setSelectedSchool, setSelectedSchoolSlug, setChatOpen, chatOpen, pageLayoutType }) {
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

  // Pick locale data — updates whenever isChineseVersion changes
  const nav = isChineseVersion ? rawNavigationData.zh : rawNavigationData.en;

  // ── All useEffect hooks MUST be called before any conditional returns ─────

  // Check if current URL has zh/ prefix
  useEffect(() => {
    const pathname = location.pathname;
    const isChinese = pathname.startsWith('/zh/') || pathname === '/zh';
    setIsChineseVersion(isChinese);
    setActiveLanguage(isChinese ? '中文' : 'EN');
  }, [location.pathname]);

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
                  onClick={() => window.location.href = '/'}
                />
                <img
                  src={logo}
                  alt="Dulwich College International"
                  className="h-12 w-[305px] cursor-pointer transition-all duration-200"
                  onClick={() => window.location.href = '/'}
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
                onClick={() => window.location.href = '/'}
              />
              <img
                src={logo}
                alt="Dulwich College International"
                className="w-[220px] cursor-pointer"
                onClick={() => window.location.href = '/'}
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
        query: searchQuery.trim()
      });

      // Add optional page parameter for pagination
      if (pageNumber > 1) {
        searchParams.append('page', pageNumber.toString());
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
                      onClick={() => window.location.href = '/'}
                    />
                    <img
                      src={logo}
                      alt="Dulwich College International"
                      className="h-12 w-[305px] transition-all duration-500 ease-out cursor-pointer"
                      onClick={() => window.location.href = '/'}
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
                        onClick={() => window.location.href = '/'}
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
                                    <a key={i} href={card.url}>
                                      <h3 className="text-[12px] text-left font-bold text-[#3C3C3B] mb-6 uppercase tracking-widest">
                                        {card.heading}
                                      </h3>
                                      <div className="text-left overflow-hidden">
                                        <img
                                          src={imageMap[card.imageKey]}
                                          alt={card.imageAlt}
                                          className="w-full h-40 object-cover rounded-lg overflow-hidden"
                                        />
                                        <div className="mt-5">
                                          <p className="text-xs min-h-[48px] text-[#3C3C3B] mb-4 leading line-clamp-3">
                                            {card.description}
                                          </p>
                                          <button className="px-4 py-2 text-xs text-[#D30013] border border-[#D30013] rounded hover:bg-[#9E1422] hover:text-white transition-all duration-200">
                                            {card.buttonText}
                                          </button>
                                        </div>
                                      </div>
                                    </a>
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

                  <a href="/find-a-school">
                    <button
                      className="group flex items-center gap-2 px-5 py-3.5 text-sm text-white rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg active:scale-95"
                      style={{ backgroundColor: '#D30013' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#B8000F'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#D30013'; }}
                    >
                      {isChineseVersion ? '查找学校' : 'Find a School'}
                      <Icon icon="graduation-cap" size={16} color="white" className="font-medium transition-transform duration-300 group-hover:translate-x-1" />
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
              onClick={() => window.location.href = '/'}
            />
               <img
              src={logo}
              alt="Dulwich College"
              className="w-[220px] cursor-pointer"
              onClick={() => window.location.href = '/'}
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
          <a href='/admissions/visit-us'
            // onClick={() => setChatOpen && setChatOpen(true)}
            className="flex flex-col items-center justify-center gap-1 hover:bg-gray-50 transition-colors"
          >
            {/* <Icon icon="Icon-AI" size={20} color="#D30013" /> */}
            
             <Icon icon="map2" size={20} color="#3C3C3B" />
            <span className="text-[10px] text-[#3C3C3B]">VISIT US</span>
          </a>

          {/* ENQUIRE */}
          <a href='#' className="flex flex-col items-center justify-center gap-1 hover:bg-gray-50 transition-colors">
            <Icon icon="Icon_Email" size={20} color="#374151" />
            <span className="text-[10px] text-[#3C3C3B]">ENQUIRE</span>
          </a>

          {/* APPLY */}
          <button className="flex flex-col items-center justify-center gap-1 hover:bg-gray-50 transition-colors">
            <Icon icon="Icon-Arrow" size={20} color="#D30013" />
            <span className="text-[10px] text-[#3C3C3B]">APPLY</span>
          </button>
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
                href="/"
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
                    <div className="relative">
                      <button
                        onClick={() => setOpenMobileSection(openMobileSection === section.id ? null : section.id)}
                        className={`w-full flex items-center justify-between py-4 ${section.borderFull ? '' : ''}`}
                      >
                        <span className="text-[20px] text-[#3C3C3B] font-normal">{section.label}</span>
                        <ChevronDown className={`chevron-rotate w-7 h-6 text-[#D30013] translate-x-1 ${openMobileSection === section.id ? 'rotate-180' : 'rotate-0'}`} />
                      </button>
                      {/* Red underline when expanded */}
                      <div
                        className={`section-underline absolute left-0 right-0 bottom-0 h-[4px] bg-[#9E1422] ${
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
                                          {link.image && (
                                            <div className="aspect-[4/3] overflow-hidden relative">
                                              <img
                                                src={imageMap[link.image] || link.image}
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

                {/* Schools Dropdown - Always show when availableSchools is available */}
                {availableSchools && availableSchools.length > 0 && (
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
                        {availableSchools.map((school) => (
                          <button
                            key={school.id}
                            onClick={() => {
                              const schoolName = `Dulwich College ${school.title}`;
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
                              selectedSchool === `Dulwich College ${school.title}`
                                ? 'bg-white font-semibold text-[#D30013] scale-[1.02]'
                                : 'hover:bg-white hover:scale-[1.02] text-[#4B5563]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>Dulwich College {school.title}</span>
                              {selectedSchool === `Dulwich College ${school.title}` && (
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
      {showSearchResults && (
        <>
          <style>{`
            @keyframes modalZoomIn {
              from {
                opacity: 0;
                transform: scale(0.8) translateY(20px);
              }
              to {
                opacity: 1;
                transform: scale(1) translateY(0);
              }
            }

            @keyframes backdropFadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }

            .modal-zoom-in {
              animation: modalZoomIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            }

            .backdrop-fade-in {
              animation: backdropFadeIn 0.3s ease-out;
            }

            .result-card-hover {
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .result-card-hover:hover {
              transform: translateY(-4px);
              box-shadow: 0 12px 24px rgba(211, 0, 19, 0.15);
            }

            /* Custom scrollbar for modal content */
            .modal-zoom-in .flex-1 {
              scroll-behavior: smooth;
            }

            .modal-zoom-in .flex-1::-webkit-scrollbar {
              width: 10px;
            }

            .modal-zoom-in .flex-1::-webkit-scrollbar-track {
              background: #f8f8f8;
              border-radius: 10px;
              margin: 10px 0;
            }

            .modal-zoom-in .flex-1::-webkit-scrollbar-thumb {
              background: #D30013;
              border-radius: 10px;
              border: 2px solid #f8f8f8;
            }

            .modal-zoom-in .flex-1::-webkit-scrollbar-thumb:hover {
              background: #9E1422;
            }

            /* Smooth scrolling for all browsers */
            .scroll-smooth {
              scroll-behavior: smooth;
              -webkit-overflow-scrolling: touch;
            }

            /* Ensure modal scrolls properly on mobile */
            @media (max-width: 768px) {
              .modal-zoom-in .flex-1 {
                max-height: calc(90vh - 300px);
                min-height: 300px;
              }
            }

            /* Firefox scrollbar */
            .modal-zoom-in .flex-1 {
              scrollbar-width: thin;
              scrollbar-color: #D30013 #f8f8f8;
            }

          `}</style>

          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-60 z-[200] backdrop-fade-in"
            onClick={() => setShowSearchResults(false)}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 lg:p-6 pointer-events-none">
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] modal-zoom-in flex flex-col pointer-events-auto"
              style={{ overflow: 'hidden' }}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 lg:px-8 py-5 lg:py-6 border-b border-gray-200 bg-gradient-to-r from-[#FAF7F5] to-white flex-shrink-0">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-[#9E1422]">Search Results</h2>
                  {searchQuery && (
                    <p className="text-sm text-gray-600 mt-1">Searching for: <span className="font-semibold text-[#3C3C3B]">"{searchQuery}"</span></p>
                  )}
                </div>
                <button
                  onClick={() => setShowSearchResults(false)}
                  className="p-2 hover:bg-white rounded-full transition-all duration-200 hover:shadow-md"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6 lg:w-7 lg:h-7 text-[#D30013]" />
                </button>
              </div>

              {/* Modal Content */}
              <div
                className="px-6 lg:px-8 py-6 flex-1 scroll-smooth"
                style={{
                  overflowY: 'scroll',
                  overflowX: 'hidden',
                  WebkitOverflowScrolling: 'touch',
                  scrollBehavior: 'smooth',
                  minHeight: '200px',
                  maxHeight: 'calc(90vh - 240px)'
                }}
              >
                {isSearching ? (
                  <div className="py-16 text-center">
                    <div className="relative inline-flex">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-t-4 border-[#D30013]"></div>
                      <div className="absolute top-0 left-0 animate-ping rounded-full h-16 w-16 border-4 border-[#D30013] opacity-20"></div>
                    </div>
                    <p className="mt-6 text-lg font-medium text-gray-700">Searching for "{searchQuery}"...</p>
                    <p className="mt-2 text-sm text-gray-500">Please wait while we fetch the results</p>
                  </div>
                ) : searchResults ? (
                  <div>
                    {searchResults.content || searchResults.results ? (
                      <div>
                        {(searchResults.content || searchResults.results) && (searchResults.content || searchResults.results).length > 0 ? (
                          <>
                            {/* Results Count Badge */}
                            <div className="mb-6 flex items-center gap-3">
                              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#9E1422] to-[#D30013] text-white rounded-full shadow-md">
                                <Icon icon="Icon-Search" size={16} color="white" />
                                <span className="font-semibold text-sm">
                                  {searchResults.total ? `${searchResults.total} Result${searchResults.total !== 1 ? 's' : ''}` : `${(searchResults.content || searchResults.results).length} Result${(searchResults.content || searchResults.results).length !== 1 ? 's' : ''}`}
                                </span>
                              </div>
                              {searchResults.page && (
                                <span className="text-sm text-gray-600 font-medium">
                                  Page {searchResults.page}
                                </span>
                              )}
                            </div>

                            {/* Results Grid */}
                            <div className="space-y-4">
                              {(searchResults.content || searchResults.results).map((result, index) => (
                                <a
                                  key={result.id || index}
                                  href={result.url}
                                  className="result-card-hover block p-5 lg:p-6 rounded-xl border-2 border-gray-200 hover:border-[#D30013] bg-white hover:bg-gradient-to-br hover:from-white hover:to-[#FEF2F2] group"
                                  onClick={() => setShowSearchResults(false)}
                                  style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                  {/* Title */}
                                  <h3 className="text-lg lg:text-xl font-bold text-[#3C3C3B] group-hover:text-[#D30013] transition-colors mb-3">
                                    {result.title}
                                  </h3>

                                  {/* Content/Excerpt */}
                                  {result.excerpt && (
                                    <p className="text-sm lg:text-base text-gray-700 mb-4 line-clamp-3 leading-relaxed">
                                      {result.excerpt}
                                    </p>
                                  )}

                                  {/* URL */}
                                  <div className="flex items-center gap-2 text-xs text-[#D30013] font-medium">
                                    <Icon icon="Icon-Chevron-Large" size={12} color="#D30013" />
                                    <span className="truncate">{result.url}</span>
                                  </div>
                                </a>
                              ))}
                            </div>

                            {/* Pagination Controls */}
                            {(searchResults.page > 1 || !searchResults.noMore) && (
                              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8 pt-6 border-t-2 border-gray-200">
                                <button
                                  onClick={() => handleSearchPageChange(currentSearchPage - 1)}
                                  disabled={currentSearchPage === 1}
                                  className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-[#D30013] hover:text-[#D30013] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 disabled:hover:text-inherit transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                  <Icon icon="Icon-Chevron-Large" size={14} style={{ transform: 'rotate(180deg)' }} />
                                  Previous
                                </button>

                                <span className="px-4 py-2 text-sm font-medium text-gray-700">
                                  Page {searchResults.page || currentSearchPage}
                                </span>

                                <button
                                  onClick={() => handleSearchPageChange(currentSearchPage + 1)}
                                  disabled={searchResults.noMore}
                                  className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-[#D30013] hover:text-[#D30013] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 disabled:hover:text-inherit transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                  Next
                                  <Icon icon="Icon-Chevron-Large" size={14} />
                                </button>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="py-16 text-center">
                            <div className="flex justify-center mb-6">
                              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                                <Icon icon="Icon-Search" size={48} color="#9CA3AF" />
                              </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-700 mb-3">No Results Found</h3>
                            <p className="text-lg text-gray-600 mb-2">We couldn't find any matches for <span className="font-semibold text-[#D30013]">"{searchQuery}"</span></p>
                            <p className="text-sm text-gray-500 mt-4">Try using different keywords or check your spelling</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="py-8">
                        <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-6 lg:p-8">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#D30013] to-[#9E1422] rounded-full flex items-center justify-center">
                              <X className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl lg:text-2xl font-bold text-[#D30013] mb-3">
                                Search Error
                              </h3>
                              {searchResults.errors && (
                                <div className="space-y-3">
                                  {Object.entries(searchResults.errors).map(([key, messages]) => (
                                    <div key={key} className="text-sm">
                                      <span className="font-semibold text-gray-700 capitalize block mb-2 text-base">{key}:</span>
                                      {Array.isArray(messages) ? (
                                        <ul className="list-disc list-inside text-[#D30013] space-y-1 ml-2">
                                          {messages.map((msg, idx) => (
                                            <li key={idx} className="text-sm">{msg}</li>
                                          ))}
                                        </ul>
                                      ) : (
                                        <span className="text-[#D30013]">{messages}</span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>

              {/* Modal Footer */}
              <div className="px-6 lg:px-8 py-5 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white flex-shrink-0">
                <button
                  onClick={() => setShowSearchResults(false)}
                  className="w-full py-3.5 px-6 text-base font-semibold text-[#D30013] border-2 border-[#D30013] rounded-xl hover:bg-[#D30013] hover:text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default PageHeader;
