import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { ChevronDown, ArrowRight, Menu as MenuIcon, X, Search } from 'lucide-react';
import Icon from '../../Icon';
import whyUniversity from '../../../assets/images/DCSZ/Two-menu/WhyUniversityMatriculation.jpeg';
import WhyAcademicResults from '../../../assets/images/DCSZ/Two-menu/WhyAcademicResults.jpg';
import Learningwel from '../../../assets/images/DCSZ/Two-menu/Learningwel.png';
import excelImage from '../../../assets/images/DCSZ/Two-menu/LearningStudentleadership.jpg';
import communityStudentstories from '../../../assets/images/DCSZ/Two-menu/Communitystudentstories.jpg';
import admissionsImage from '../../../assets/images/DCSZ/Two-menu/Admissionsvs.png';
import mmpImage from '../../../assets/images/DCSZ/Two-menu/Communitymparents.JPG';
import suzhou from '../../../assets/images/suzhou.svg';
import sing from '../../../assets/images/sing.svg';

import { getCurrentSchool, getBaseDomain, getSchoolUrl } from '../../../utils/schoolDetection';

function PageHeader({ selectedSchool, availableSchools, setSelectedSchool, setSelectedSchoolSlug, setChatOpen, chatOpen, headerScrolled }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState('EN');
  const [openMobileSection, setOpenMobileSection] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isChineseVersion, setIsChineseVersion] = useState(false);

  // Check if current URL has zh/ prefix
  useEffect(() => {
    const pathname = location.pathname;
    const isChinese = pathname.startsWith('/zh/') || pathname === '/zh';
    setIsChineseVersion(isChinese);
    setActiveLanguage(isChinese ? '中文' : 'EN');
  }, [location.pathname]);

  // Auto-select school based on current subdomain (when availableSchools is loaded)
  useEffect(() => {
    if (!availableSchools || availableSchools.length === 0) return;
    if (!setSelectedSchool || !setSelectedSchoolSlug) return;

    const currentSchoolSlug = getCurrentSchool();
    if (!currentSchoolSlug) return;

    const matched = availableSchools.find(
      (s) => (s?.slug || '').toLowerCase() === currentSchoolSlug.toLowerCase()
    );
    if (!matched) return;

    const expectedName = `Dulwich College ${matched.title}`;
    // Avoid pointless state updates
    if (selectedSchool !== expectedName) {
      setSelectedSchool(expectedName);
      setSelectedSchoolSlug(matched.slug);
    }
  }, [availableSchools, selectedSchool, setSelectedSchool, setSelectedSchoolSlug]);

  const redirectToSchool = (school) => {
    const schoolSlug = typeof school === 'string' ? school : school?.slug;

    // "International" / main site: redirect to static link
    if (!schoolSlug || schoolSlug === 'international') {
      window.location.assign('https://www.dulwich-frontend.atalent.xyz/');
      return;
    }

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
    const schoolName = `Dulwich College ${school.title}`;
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
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Prevent body scroll when chat is open
  useEffect(() => {
    if (chatOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
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

  const schoolLogos = {
    singapore: {
      src: "https://assets.dulwich.org/schools/2022-web-dcsg-left-aligned.svg",
      alt: "Dulwich College Singapore",
      className: "w-[270px] transition-all duration-500 ease-out hover:scale-105"
    },
    suzhou: {
      src: "https://assets.dulwich.org/schools/2022-web-dcsz-cn-left-aligned.svg",
      alt: "Dulwich College Suzhou",
      className: "h-12 w-[270px] transition-all duration-500 ease-out hover:scale-105"
    }
  };
  
  const school = getCurrentSchool();
  const logo = schoolLogos[school];

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

        [data-radix-navigation-menu-content] {
          transform-origin: top center;
        }

        [data-radix-navigation-menu-content][data-state="open"] {
          animation: smoothSlideDown 200ms ease-out;
        }

        [data-radix-navigation-menu-content][data-state="closed"] {
          animation: smoothSlideUp 150ms ease-in;
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
                  className="group flex items-center gap-2 px-4 py-3 text-sm font-medium border-2 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
                  style={{ color: '#D30013', borderColor: '#D30013' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FEF2F2'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  Enquire
                  <Icon icon="Icon_Email" size={20} className="transition-transform duration-200" />
                </button>

                <a href="/admissions/apply-now">
                  <button
                    className="group flex items-center gap-2 px-4 py-3.5 text-sm font-medium text-white rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg active:scale-95"
                    style={{ backgroundColor: '#D30013' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#B8000F'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#D30013'; }}
                  >
                    Apply Now
                    <Icon icon="Icon-Arrow" size={18} color="white" className="transition-transform duration-200 group-hover:translate-x-1" />
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
            {!isScrolled && (
              <div className="px-4 py-2 transition-all duration-200 ease-out">
                <div className="max-w-[1120px] mx-auto flex items-center justify-between">
                  {/* Logo and School Name */}
                  <div className="flex items-center gap-4">
                  {
  getCurrentSchool() === 'singapore' ? (
    <img
      src={sing}
      alt="Dulwich College Singapore"
      className="w-[270px] transition-all duration-500 ease-out hover:scale-105"
    />
  ) : getCurrentSchool() === 'suzhou' ? (
    <img
      src={suzhou}
      alt="Dulwich College Suzhou"
      className="h-12 w-[270px] transition-all duration-500 ease-out hover:scale-105"
    />
  ) : null
}
               </div>

                  {/* Top Right Links */}
                  <div className="flex items-center gap-6 text-sm text-gray-700">
                    <a href="#calendar" className="hover:text-red-600 transition-colors">
                    Parent Portal                    </a>|
                    <a href="#calendar" className="hover:text-red-600 transition-colors">
                      School Calendar
                    </a>
                    {/* Hide language switcher for Singapore */}
                    {getCurrentSchool() !== 'singapore' && (
                      <a
                        href="#"
                        onClick={toggleLanguage}
                        className="hover:text-red-800 font-extrabold transition-colors"
                      >
                        {isChineseVersion ? 'EN' : '中文'}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Main Navigation */}
            <div className={`px-4 ${isScrolled ? 'py-3' : 'py-4'} transition-all duration-200 ease-out`}>
              <div className="max-w-[1120px] mx-auto flex items-center justify-between">
                {/* Logo - Only visible when scrolled */}
                <div className={`w-full flex items-center justify-left gap-5 transition-all duration-200 ease-out ${isScrolled ? 'ml-[0%]' : 'ml-[4%]'}`}>
                  {isScrolled && (
                    <div className="items-center transition-all duration-200 ease-out" style={{
                      animation: 'smoothSlideDown 200ms ease-out'
                    }}>
                      <img
                        src="/images/crest-logo.svg"
                        alt="Dulwich College"
                        className="transition-all duration-200 ease-out h-12 w-12 hover:scale-110"
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
                      {/* Why Dulwich - Full Width Drawer */}
                      <NavigationMenu.Item>
                        <NavigationMenu.Trigger className={`group px-5 py-1 text-[16px] font-base text-[#3C3C3B] hover:text-gray-900 data-[state=open]:text-gray-900 outline-none transition-all duration-200 relative min-w-[150px]`}>
                        Why Dulwich
                          <span className={`absolute ${isScrolled ? '-bottom-3' : '-bottom-4'} left-0 w-full h-2 bg-[#9E1422] scale-x-0 group-hover:scale-x-100 group-data-[state=open]:scale-x-100 transition-all duration-200 origin-left`}></span>
                        </NavigationMenu.Trigger>
                        <NavigationMenu.Content className={`fixed left-0 right-0 ${isScrolled ? 'top-[72px]' : 'top-[138px]'} w-full transition-all duration-200 ease-out z-[60]`} style={{
                          transformOrigin: 'top',
                          animation: 'none'
                        }}>
                          <div className="w-full bg-white shadow-2xl">
                            <div className="w-[1120px] mx-auto px-4 py-8">
                              <div className="grid grid-cols-4 gap-8 mb-8">
                                {/* APPLY Section */}
                                <div className='text-left'>
                                  {/* <h3 className="text-xs font-bold text-gray-900 mb-6 uppercase tracking-wider">APPLY</h3> */}
                                  <ul className="space-y-4">
                                    <h3 className="text-[12px] text-left font-bold text-[#3C3C3B] mb-2 uppercase tracking-widest">OUR COLLEGE</h3>
                                    <li>
                                      <a href="/our-college/from-our-head-of-college" className="text-base text-[#3C3C3B] hover:text-red-600 transition-colors">
                                      Welcome From the Head of College                                      </a>
                                    </li>
                                    <li>
                                      <a href="/about-dulwich/vision-and-values" className="text-base text-[#3C3C3B] hover:text-red-600 transition-colors">
                                      Vision & Values                                      </a>
                                    </li>
                                    <li>
                                      <a href="/our-college/dulwich-difference" className="text-base text-[#3C3C3B] hover:text-red-600 transition-colors">
                                      Dulwich Difference                                     </a>
                                    </li>
                                    <li>
                                      <a href="/our-college/campus-environment" className="text-base text-[#3C3C3B] hover:text-red-600 transition-colors">
                                      Campus & Facilities
                                      </a>
                                    </li>
                                    {getCurrentSchool() === 'singapore' && (
                                      <li>
                                        <a
                                          href="#"
                                          className="text-base text-[#3C3C3B] hover:text-red-600 transition-colors"
                                        >
                                          University Matriculation 
                                        </a>
                                      </li>
                                    )}

                                  </ul>
                                </div>

                                <div className='text-left'>
                                  {/* <h3 className="text-xs font-bold text-gray-900 mb-6 uppercase tracking-wider">APPLY</h3> */}
                                  <ul className="space-y-4">
                                  <h3 className="text-[12px] text-left font-bold text-[#3C3C3B] mb-2 uppercase tracking-widest">FAMILY OF SCHOOLS</h3>
                                    <li>
                                      <a href="holistic-curriculum/worldwise-events" className="text-base text-[#3C3C3B] hover:text-red-600 transition-colors">
                                      Worldwise Events                                      </a>
                                    </li>
                                    <li>
                                      <a href="#" className="text-base text-[#3C3C3B] hover:text-red-600 transition-colors">
                                    International Experiences
                                      </a>
                                    </li>
                                    <li>
                                      <a href="#" className="text-base text-[#3C3C3B] hover:text-red-700 transition-colors">
                                      Global Partnership                                  </a>
                                    </li>
                                    <li>
                                      <a href="#" className="text-base text-[#3C3C3B] hover:text-red-600 transition-colors">
                                      Educational Leadership 
                                      </a>
                                    </li>
                                  </ul>
                                </div>

                                {/* 1 Card */}
                                <a href='/our-college/academic-results'>
                                  <h3 className="text-[12px] text-left font-bold text-[#3C3C3B] mb-2 uppercase tracking-widest">Academic Results</h3>
                                  <div className="text-left overflow-hidden">

                                    <img
                                      src={WhyAcademicResults}
                                      alt="How to Apply"
                                      className="w-full h-40 object-cover rounded-lg overflow-hidden"
                                    />
                                    <div className='mt-5'>
                                      {/* <h4 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider">HOW TO APPLY</h4> */}
                                      <p className="text-xs min-h-[48px] text-[#3C3C3B] mb-4 leading line-clamp-3">
                                      Our students consistently achieve academic results that make Dulwich one of the leading IB Schools in Shanghai, China, and the world.
                                      </p>
                                      <button className="px-4 py-2 text-xs font-medium text-[#D30013] border border-[#D30013] rounded hover:bg-red-600 hover:text-white transition-all duration-200">
                                      Academic Results
                                      </button>
                                    </div>
                                  </div>
                                </a>

                               {/* VISIT US Card */}

                              {getCurrentSchool() === 'singapore' && (
                                <a href="/our-college/the-greenhouse">
                                  <h3 className="text-[12px] font-bold mb-2 uppercase tracking-widest">
                                The Greenhouse
                                  </h3>

                                  <div className="text-left rounded-sm overflow-hidden">
                                    <img
                                      src={whyUniversity}
                                      alt="The Greenhouse"
                                      className="w-full h-40 object-cover rounded-lg"
                                    />

                                    <div className="mt-5">
                                      <p className="text-xs min-h-[48px] text-[#3C3C3B] mb-4 line-clamp-3">
                                        At Dulwich College International, our holistic curriculum nurtures students to make a positive difference in the world.
                                      </p>

                                      <button className="px-4 py-2 text-xs font-medium text-[#D30013] border border-[#D30013] rounded hover:bg-red-600 hover:text-white">
                                        The Greenhouse
                                      </button>
                                    </div>
                                  </div>
                                </a>
                              )}

                              {getCurrentSchool() === 'suzhou' && (
                                <a href="#">
                                  <h3 className="text-[12px] font-bold mb-2 uppercase tracking-widest">
                                    University Matriculation
                                  </h3>

                                  <div className="text-left rounded-sm overflow-hidden">
                                    <img
                                      src={whyUniversity}
                                      alt="University Matriculation"
                                      className="w-full h-40 object-cover rounded-lg"
                                    />

                                    <div className="mt-5">
                                      <p className="text-xs min-h-[48px] text-[#3C3C3B] mb-4 line-clamp-3">
                                        At Dulwich College International, our holistic curriculum nurtures students to make a positive difference in the world.
                                      </p>

                                      <button className="px-4 py-2 text-xs font-medium text-[#D30013] border border-[#D30013] rounded hover:bg-red-600 hover:text-white">
                                        University Matriculation 
                                      </button>
                                    </div>
                                  </div>
                                </a>
                              )}

                              </div>
                              
                              {/* Bottom Section */}
                              <div className="pt-6 border-t border-gray-200 flex items-center justify-between">
                                <a href="/sitemap" className="text-sm text-gray-700 hover:text-red-600 transition-colors">
                                  See Full Site Map
                                </a>
                                <button className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors">
                                  <Icon icon="Icon-Search" size={16} />
                                  <span className="text-sm">Search</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </NavigationMenu.Content>
                      </NavigationMenu.Item>

                      <NavigationMenu.Item>
                        <NavigationMenu.Trigger className={`group px-5 py-1 text-[16px] font-base text-[#3C3C3B] hover:text-gray-900 data-[state=open]:text-gray-900 outline-none transition-all duration-200 relative`}>
                          Learning
                          <span className={`absolute ${isScrolled ? '-bottom-3' : '-bottom-4'} left-0 w-full h-2 bg-[#9E1422] scale-x-0 group-hover:scale-x-100 group-data-[state=open]:scale-x-100 transition-all duration-200 origin-left`}></span>
                        </NavigationMenu.Trigger>
                        <NavigationMenu.Content className={`fixed left-0 right-0 ${isScrolled ? 'top-[72px]' : 'top-[138px]'} w-full transition-all duration-200 ease-out z-[60]`} style={{
                          transformOrigin: 'top',
                          animation: 'none'
                        }}>
                          <div className="w-full bg-white shadow-2xl">
                            <div className="w-[1120px] mx-auto px-4 py-8">
                              <div className="grid grid-cols-4 gap-8 mb-8">
                                {/* APPLY Section */}
                                <div className='text-left'>
                                  {/* <h3 className="text-xs font-bold text-gray-900 mb-6 uppercase tracking-wider">APPLY</h3> */}
                                  <ul className="space-y-4">
                                    <h3 className="text-[12px] text-left font-bold text-[#3C3C3B] mb-2 uppercase tracking-widest">CORE CURRICULUM</h3>
                                    <li>
                                      <a href="/holistic-curriculum/ducks-ages-2-to-7" className="text-base text-[#3C3C3B] hover:text-red-600 transition-colors">
                                      DUCKS (ages 2 to 7)   
                                        </a>                             
                                        </li>
                                    <li>
                                      <a href="/holistic-curriculum/junior-school-ages-7-to-11" className="text-base text-[#3C3C3B] hover:text-red-600 transition-colors">
                                      Junior School (ages 7 to 11)
                                                                        </a>
                                    </li>
                                    <li>
                                      <a href="/holistic-curriculum/senior-school-ages-11-to-18" className="text-base text-[#3C3C3B] hover:text-red-700 transition-colors font-medium">
                                      Senior School (ages 11 to 18)
                                                                          </a>
                                    </li>
                                  {getCurrentSchool() === 'singapore' && (
                                  <>
                                    <li>
                                      <a href="#" className="text-base text-[#3C3C3B] hover:text-red-600 transition-colors">
                                        IGCSE
                                      </a>
                                    </li>

                                    <li>
                                      <a href="#" className="text-base text-[#3C3C3B] hover:text-red-600 transition-colors">
                                        Post-16 Pathways
                                      </a>
                                    </li>
                                  </>
                                )}
                                {getCurrentSchool() === 'suzhou' && (
                                    <>
                                      <li>
                                        <a href="#" className="text-base text-[#3C3C3B] hover:text-red-600 transition-colors">
                                          International Baccalaureate
                                        </a>
                                      </li>

                                      <li>
                                        <a href="#" className="text-base text-[#3C3C3B] hover:text-red-600 transition-colors">
                                          A-Levels & IAD
                                        </a>
                                      </li>
                                    </>
                                  )}
                                  <li>
                                      <a href="/how-we-teach-and-learn/dcsg-university-counselling" className="text-base text-[#3C3C3B] hover:text-red-700 transition-colors font-medium">
                                      University & Careers Counselling
                                                                          </a>
                                    </li>
                                  </ul>
                                </div>

                                <div className='text-left'>
                                  {/* <h3 className="text-xs font-bold text-gray-900 mb-6 uppercase tracking-wider">APPLY</h3> */}
                                  <ul className="space-y-4">
                                  <h3 className="text-[12px] text-left font-bold text-[#3C3C3B] mb-2 uppercase tracking-widest">HOLISTIC EDUCATION</h3>
                                    <li>
                                      <a href="/holistic-curriculum/co-curricular-activities" className="text-base text-[#3C3C3B] hover:text-red-600 transition-colors">
                                      Co-Curricular Activities                                    </a>
                                    </li>
                                    <li>
                                      <a href="/holistic-curriculum/stem-se21" className="text-base text-[#3C3C3B] hover:text-red-600 transition-colors">
                                      STEM                                      </a>
                                    </li>
                                    <li>
                                      <a href="/holistic-curriculum/sports" className="text-base text-[#3C3C3B] hover:text-red-700 transition-colors font-medium">
                                      Sports                                     </a>
                                    </li>
                                    {getCurrentSchool() === 'suzhou' && (
                                      <>
                                    <li>
                                      <a href="/holistic-curriculum/mandarin" className="text-base text-[#3C3C3B] hover:text-red-700 transition-colors font-medium">
                                      Mandarin
                                     </a>
                                    </li>
                                    <li>
                                      <a href="#" className="text-base text-[#3C3C3B] hover:text-red-700 transition-colors font-medium">
                                      Student Leadership
                                     </a>
                                    </li>
                                    </>
                                    )}
                                     <li>
                                      <a href="/holistic-curriculum/visual-and-performing-arts" className="text-base text-[#3C3C3B] hover:text-red-700 transition-colors font-medium">
                                      Visual & Performing Arts                                    </a>
                                    </li>
                                    {getCurrentSchool() === 'singapore' && (
                                      <>
                                     <li>
                                      <a href="/holistic-curriculum/learning-beyond-the-classroom" className="text-base text-[#3C3C3B] hover:text-red-700 transition-colors font-medium">
                                      Learning Beyond the Classroom
                                     </a>
                                    </li>
                                    </>
                                    )}
                                 
                                  </ul>
                                </div>

                                {/* 1 Card */}
                                {getCurrentSchool() === 'singapore' && (
                                <a href='/holistic-curriculum/student-leadership-programme'>
                                  <h3 className="text-[12px] text-left font-bold text-[#3C3C3B] mb-2 uppercase tracking-widest">Student Leadership</h3>
                                  <div className="text-left overflow-hidden">

                                    <img
                                      src={excelImage}
                                      alt="How to Apply"
                                      className="w-full h-40 object-cover rounded-lg overflow-hidden"
                                    />
                                    <div className='mt-5'>
                                      {/* <h4 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider">HOW TO APPLY</h4> */}
                                      <p className="text-xs min-h-[48px] text-[#3C3C3B] mb-4 leading line-clamp-3">
                                        The Dulwich Educational Leadership team bring deep expertise and proven excellence to teaching and learning across our network.
                                      </p>
                                      <button className="px-4 py-2 text-xs font-medium text-[#D30013] border border-[#D30013] rounded hover:bg-red-600 hover:text-white transition-all duration-200">
                                      Student Leadership
                                      </button>
                                    </div>
                                  </div>
                                </a>
                                )}
                                 {getCurrentSchool() === 'suzhou' && (
                                <a href='/how-we-teach-and-learn/wellbeing'>
                                  <h3 className="text-[12px] text-left font-bold text-[#3C3C3B] mb-2 uppercase tracking-widest min-h-[38px]">Wellbeing</h3>
                                  <div className="text-left overflow-hidden">

                                    <img
                                      src={excelImage}
                                      alt="How to Apply"
                                      className="w-full h-40 object-cover rounded-lg overflow-hidden"
                                    />
                                    <div className='mt-5'>
                                      {/* <h4 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider">HOW TO APPLY</h4> */}
                                      <p className="text-xs min-h-[48px] text-[#3C3C3B] mb-4 leading line-clamp-3">
                                      Our whole community supports student health, happiness, and social-emotional growth: the foundation for academic and life success.
                                      </p>
                                      <button className="px-4 py-2 text-xs font-medium text-[#D30013] border border-[#D30013] rounded hover:bg-red-600 hover:text-white transition-all duration-200">
                                      Wellbeing
                                      </button>
                                    </div>
                                  </div>
                                </a>
                                )}


                                {/* VISIT US Card */}
                                <a href='/our-college/sustainability-and-global-citizenship'>
                                  <h3 className="text-[12px] text-left font-bold text-[#3C3C3B] mb-2 uppercase tracking-widest">  
                                  Sustainability & Global Citizenship                              
                                  </h3>

                                  <div className="text-left rounded-sm overflow-hidden">
                                    <img
                                      src={Learningwel}
                                      alt="Visit Us"
                                      className="w-full h-40 object-cover rounded-lg overflow-hidden"
                                    />
                                    <div className="mt-5">
                                      {/* <h4 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider">VISIT US</h4> */}
                                      <p className="text-xs min-h-[48px] text-[#3C3C3B] mb-4 leading line-clamp-3">
                                        At Dulwich College International, our holistic curriculum nurtures students to make a positive difference in the world.
                                      </p>
                                      <button className="px-4 py-2 text-xs font-medium text-[#D30013] border border-[#D30013] rounded hover:bg-red-600 hover:text-white transition-all duration-200">
                                      Sustainability & Global Citizenship
                                      </button>
                                    </div>
                                  </div>
                                </a>
                              </div>
                              
                              {/* Bottom Section */}
                              <div className="pt-6 border-t border-gray-200 flex items-center justify-between">
                                <a href="/sitemap" className="text-sm text-gray-700 hover:text-red-600 transition-colors">
                                  See Full Site Map
                                </a>
                                <button className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors">
                                  <Icon icon="Icon-Search" size={16} />
                                  <span className="text-sm">Search</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </NavigationMenu.Content>
                      </NavigationMenu.Item>

                      <NavigationMenu.Item>
                        <NavigationMenu.Trigger className={`group px-5 py-1 text-[16px] font-base text-[#3C3C3B] hover:text-gray-900 data-[state=open]:text-gray-900 outline-none transition-all duration-200 relative`}>
                          Community
                          <span className={`absolute ${isScrolled ? '-bottom-3' : '-bottom-4'} left-0 w-full h-2 bg-[#9E1422] scale-x-0 group-hover:scale-x-100 group-data-[state=open]:scale-x-100 transition-all duration-200 origin-left`}></span>
                        </NavigationMenu.Trigger>
                        <NavigationMenu.Content className={`fixed left-0 right-0 ${isScrolled ? 'top-[72px]' : 'top-[138px]'} w-full transition-all duration-200 ease-out z-[60]`} style={{
                          transformOrigin: 'top',
                          animation: 'none'
                        }}>
                          <div className="w-full bg-white shadow-2xl">
                            <div className="w-[1120px] mx-auto px-4 py-8">
                              <div className="grid grid-cols-4 gap-8 mb-8">
                                {/* APPLY Section */}
                                <div className='text-left'>
                                  {/* <h3 className="text-xs font-bold text-gray-900 mb-6 uppercase tracking-wider">APPLY</h3> */}
                                  <ul className="space-y-4">
                                    <h3 className="text-[12px] text-left font-bold text-[#3C3C3B] mb-2 uppercase tracking-widest">OUR COMMUNITY</h3>
                                    {getCurrentSchool() === 'singapore' && (
                                      <>
                                    <li>
                                      <a href="#" className="text-base text-[#3C3C3B] hover:text-red-600 transition-colors">
                                      Student Life
                                        </a>
                                    </li>
                                    </>
                                    )}
                                    <li>
                                      <a href="/community/teachers" className="text-base text-[#3C3C3B] hover:text-red-600 transition-colors">
                                      Teachers & Staff                                     </a>
                                    </li>
                                    <li>
                                      <a href="/community/friends-of-dulwich" className="text-base text-[#3C3C3B] hover:text-red-700 transition-colors font-medium">
                                      Friends of Dulwich (FoD)                                    </a>
                                    </li>
                                    <li>
                                      <a href="/community/worldwise-alumni-network" className="text-base text-[#3C3C3B] hover:text-red-600 transition-colors">
                                      Alumni
                                      </a>
                                    </li>
                                    {getCurrentSchool() === 'singapore' && (
                                      <>
                                     <li>
                                      <a href="#" className="text-base text-[#3C3C3B] hover:text-red-600 transition-colors">
                                      Safeguarding & Wellbeing
                                      </a>
                                    </li>
                                    </>
                                    )}
                                  </ul>
                                </div>

                                <div className='text-left'>
                                  {/* <h3 className="text-xs font-bold text-gray-900 mb-6 uppercase tracking-wider">APPLY</h3> */}
                                  <ul className="space-y-4">
                                  <h3 className="text-[12px] text-left font-bold text-[#3C3C3B] mb-2 uppercase tracking-widest">LIFE AT DULWICH</h3>
                                    <li>
                                      <a href="/our-college/academic-year-calendar" className="text-base text-[#3C3C3B] hover:text-red-600 transition-colors">
                                      College Calendar                                  </a>
                                    </li>
                                    <li>
                                      <a href="/dulwich-life" className="text-base text-[#3C3C3B] hover:text-red-600 transition-colors">
                                      Latest News 
                                      </a>
                                    </li>
                                    <li>
                                      <a href="/working-at-dulwich" className="text-base text-[#3C3C3B] hover:text-red-600 transition-colors">
                                      Work at Dulwich
                                      </a>
                                    </li>
                                
                                  </ul>
                                </div>

                                {/* 1 Card */}
                                <a href='/community/meet-our-parents'>
                                  <h3 className="text-[12px] text-left font-bold text-[#3C3C3B] mb-2 uppercase tracking-widest">Meet Our Parents</h3>
                                  <div className="text-left overflow-hidden">

                                    <img
                                      src={mmpImage}
                                      alt="How to Apply"
                                      className="w-full h-40 object-cover rounded-lg overflow-hidden"
                                    />
                                    <div className='mt-5'>
                                      {/* <h4 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider">HOW TO APPLY</h4> */}
                                      <p className="text-xs min-h-[48px] text-[#3C3C3B] mb-4 leading line-clamp-3">
                                      Hear directly from our parent community about their experiences and why they chose Dulwich College Shanghai Pudong.
                                      </p>
                                      <button className="px-4 py-2 text-xs font-medium text-[#D30013] border border-[#D30013] rounded hover:bg-red-600 hover:text-white transition-all duration-200">
                                      Meet Our Parents                    
                                       </button>
                                    </div>
                                  </div>
                                </a>

                                {/* VISIT US Card */}
                                <a href='/community/student-stories'>
                                  <h3 className="text-[12px] text-left font-bold text-[#3C3C3B] mb-2 uppercase tracking-widest">                         Students Stories

                                  </h3>

                                  <div className="text-left rounded-sm overflow-hidden">
                                    <img
                                      src={communityStudentstories}
                                      alt="Visit Us"
                                      className="w-full h-40 object-cover rounded-lg overflow-hidden"
                                    />
                                    <div className="mt-5">
                                      {/* <h4 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider">VISIT US</h4> */}
                                      <p className="text-xs min-h-[48px] text-[#3C3C3B] mb-4 leading line-clamp-3">
                                      Real stories from our students about their journeys, passions, and what makes Dulwich College Shanghai Pudong home.
                                      </p>
                                      <button className="px-4 py-2 text-xs font-medium text-[#D30013] border border-[#D30013] rounded hover:bg-red-600 hover:text-white transition-all duration-200">
                                      Students Stories
                                      </button>
                                    </div>
                                  </div>
                                </a>
                              </div>
                              
                              {/* Bottom Section */}
                              <div className="pt-6 border-t border-gray-200 flex items-center justify-between">
                                <a href="/sitemap" className="text-sm text-gray-700 hover:text-red-600 transition-colors">
                                  See Full Site Map
                                </a>
                                <button className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors">
                                  <Icon icon="Icon-Search" size={16} />
                                  <span className="text-sm">Search</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </NavigationMenu.Content>
                      </NavigationMenu.Item>

                      {/* Admissions */}
                      <NavigationMenu.Item>
                        <NavigationMenu.Trigger className={`group px-5 py-1 text-[16px] font-base text-[#3C3C3B] hover:text-gray-900 data-[state=open]:text-gray-900 outline-none transition-all duration-200 relative`}>
                          Admissions
                          <span className={`absolute ${isScrolled ? '-bottom-3' : '-bottom-4'} left-0 w-full h-2 bg-[#9E1422] scale-x-0 group-hover:scale-x-100 group-data-[state=open]:scale-x-100 transition-all duration-200 origin-left`}></span>
                        </NavigationMenu.Trigger>
                        <NavigationMenu.Content className={`fixed left-0 right-0 ${isScrolled ? 'top-[72px]' : 'top-[138px]'} w-full transition-all duration-200 ease-out z-[60]`} style={{
                          transformOrigin: 'top',
                          animation: 'none'
                        }}>
                          <div className="w-full bg-white shadow-2xl">
                            <div className="w-[1120px] mx-auto px-4 py-8">
                              <div className="grid grid-cols-4 gap-8 mb-8">
                                {/* APPLY Section */}
                                <div className='text-left'>
                                  {/* <h3 className="text-xs font-bold text-gray-900 mb-6 uppercase tracking-wider">APPLY</h3> */}
                                  <ul className="space-y-4">
                                    <h3 className="text-[12px] text-left font-bold text-[#3C3C3B] mb-2 uppercase tracking-widest">APPLY</h3>
                                    <li>
                                      <a href="#" className="text-base text-[#3C3C3B] hover:text-red-600 transition-colors">
                                      Eligibility                               </a>
                                    </li>
                                    <li>
                                      <a href="#" className="text-base text-[#3C3C3B] hover:text-red-600 transition-colors">
                                      Admissions Criteria
                                                                          </a>
                                    </li>
                                    <li>
                                      <a href="#" className="text-base text-[#3C3C3B] hover:text-red-700 transition-colors font-medium">
                                      Fees                                   </a>
                                    </li>
                                    <li>
                                      <a href="#" className="text-base text-[#3C3C3B] hover:text-red-600 transition-colors">
                                      FAQs
                                      </a>
                                    </li>
                                    {getCurrentSchool() === 'singapore' && (
                                      <>
                                    <li>
                                      <a href="/admissions/scholarships" className="text-base text-[#3C3C3B] hover:text-red-600 transition-colors">
                                      Scholarships
                                      </a>
                                    </li>
                                    </>  
                                    )} 

                                  </ul>
                                </div>

                                <div className='text-left'>
                                  {/* <h3 className="text-xs font-bold text-gray-900 mb-6 uppercase tracking-wider">APPLY</h3> */}
                                  <ul className="space-y-4">
                                  <h3 className="text-[12px] text-left font-bold text-[#3C3C3B] mb-2 uppercase tracking-widest">VISIT</h3>
                                    <li>
                                      <a href="/admissions/visit-us?anchor=book-a-tour" className="text-base text-[#3C3C3B] hover:text-red-600 transition-colors">
                                      Book a Tour                                    </a>
                                    </li>
                                    <li>
                                      <a href="/admissions/visit-us?anchor=open-house" className="text-base text-[#3C3C3B] hover:text-red-600 transition-colors">
                                      Open Day
                                      </a>
                                    </li>
                                    <li>
                                      <a href="/admissions/visit-us?anchor=virtual-tour" className="text-base text-[#3C3C3B] hover:text-red-700 transition-colors font-medium">
                                      Virtual Tour                                     </a>
                                    </li>
                                  
                                  </ul>
                                </div>

                                {/* 1 Card */}
                                <a href='/admissions/how-to-apply'>
                                  <h3 className="text-[12px] text-left font-bold text-[#3C3C3B] mb-2 uppercase tracking-widest">How to Apply</h3>
                                  <div className="text-left overflow-hidden">

                                    <img
                                      src={excelImage}
                                      alt="How to Apply"
                                      className="w-full h-40 object-cover rounded-lg overflow-hidden"
                                    />
                                    <div className='mt-5'>
                                      {/* <h4 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider">HOW TO APPLY</h4> */}
                                      <p className="text-xs min-h-[48px] text-[#3C3C3B] mb-4 leading line-clamp-3">
                                      How to apply, what to do, which documents you will need to provide, and how to complete assessments and interviews.
                                      </p>
                                      <button className="px-4 py-2 text-xs font-medium text-[#D30013] border border-[#D30013] rounded hover:bg-red-600 hover:text-white transition-all duration-200">
                                      How to Apply
                                      </button>
                                    </div>
                                  </div>
                                </a>

                                {/* VISIT US Card */}
                                <a href='/admissions/visit-us'>
                                  <h3 className="text-[12px] text-left font-bold text-[#3C3C3B] mb-2 uppercase tracking-widest">                                Visit Us

                                  </h3>

                                  <div className="text-left rounded-sm overflow-hidden">
                                    <img
                                      src={admissionsImage}
                                      alt="Visit Us"
                                      className="w-full h-40 object-cover rounded-lg overflow-hidden"
                                    />
                                    <div className="mt-5">
                                      {/* <h4 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider">VISIT US</h4> */}
                                      <p className="text-xs min-h-[48px] text-[#3C3C3B] mb-4 leading line-clamp-3">
                                      We love meeting new parents. You can make an individual request or join one of our admissions meetings and campus tours.
                                      </p>
                                      <button className="px-4 py-2 text-xs font-medium text-[#D30013] border border-[#D30013] rounded hover:bg-red-600 hover:text-white transition-all duration-200">
                                      Visit Us
                                      </button>
                                    </div>
                                  </div>
                                </a>
                              </div>
                              
                              {/* Bottom Section */}
                              <div className="pt-6 border-t border-gray-200 flex items-center justify-between">
                                <a href="/sitemap" className="text-sm text-gray-700 hover:text-red-600 transition-colors">
                                  See Full Site Map
                                </a>
                                <button className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors">
                                  <Icon icon="Icon-Search" size={16} />
                                  <span className="text-sm">Search</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </NavigationMenu.Content>
                      </NavigationMenu.Item>


                    </NavigationMenu.List>


                  </NavigationMenu.Root>
                </div>

                {/* Right Side Buttons */}
                <div className="w-full flex justify-end items-center gap-3">
                  {/* Ask AI Button with Active State */}
                  <div className="relative">
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
                    {chatOpen && (
                      <div
                        className="absolute -bottom-1 left-0 right-0 h-1 bg-[#D30013] rounded-full animate-in slide-in-from-bottom-2 duration-300"
                        style={{ animation: 'slideIn 0.3s ease-out' }}
                      />
                    )}
                  </div>

                  <button
                    className="group flex items-center gap-2 px-4 py-3 text-sm font-medium border rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
                    style={{ color: '#D30013', borderColor: '#D30013' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FEF2F2'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    Enquire
                    <Icon icon="Icon_Email" size={20} className="transition-transform duration-200" />
                  </button>
                  <a href="/admissions/apply-now">
                  <button
                    className="group flex items-center gap-2 px-4 py-3.5 text-sm font-medium text-white rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg active:scale-95"
                    style={{ backgroundColor: '#D30013' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#B8000F'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#D30013'; }}

                  >
                    Apply Now
                    <Icon icon="Icon-Arrow" size={18} color="white" className="transition-transform duration-200 group-hover:translate-x-1" />
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
            top: isScrolled ? '72px' : '154px',
            opacity: isDrawerOpen ? 1 : 0
          }}
        />
      )}

      {/* MOBILE HEADER - Shows on screens < lg (below 1024px) */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <img src="/images/crest-logo.svg" alt="Dulwich College" className="h-12 w-12" />



            {/* Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <MenuIcon className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE BOTTOM NAVIGATION - Fixed at bottom */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
        <div className="grid grid-cols-3 h-16">
          {/* AI ASSISTANT */}
          <button
            onClick={() => setChatOpen && setChatOpen(true)}
            className="flex flex-col items-center justify-center gap-1 hover:bg-gray-50 transition-colors"
          >
            <Icon icon="Icon-AI" size={20} color="#D30013" />
            <span className="text-[10px] font-medium text-gray-700">AI ASSISTANT</span>
          </button>

          {/* ENQUIRE */}
          <button className="flex flex-col items-center justify-center gap-1 hover:bg-gray-50 transition-colors">
            <Icon icon="Icon_Email" size={20} color="#374151" />
            <span className="text-[10px] font-medium text-gray-700">ENQUIRE</span>
          </button>

          {/* APPLY */}
          <button className="flex flex-col items-center justify-center gap-1 hover:bg-gray-50 transition-colors">
            <Icon icon="Icon-Arrow" size={20} color="#D30013" />
            <span className="text-[10px] font-medium text-gray-700">APPLY</span>
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
          />

          {/* Menu Panel - Slides in from right */}
          <div className="lg:hidden fixed top-0 right-0 bottom-0 w-full max-w-md z-[101] bg-white shadow-2xl transition-transform duration-300 ease-out"
            style={{
              transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(100%)'
            }}>
            {/* Menu Header */}
            <div className="bg-white px-4 py-4 flex items-center justify-between border-b border-gray-200">
              <div className="flex items-center gap-3">
                <img src="/images/crest-logo.svg" alt="Dulwich College" className="h-12 w-12" />

              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-6 h-6 text-gray-700" />
              </button>
            </div>

            {/* Menu Content */}
            <div className="flex flex-col h-full">
              {/* Menu Items */}
              <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                <button
                  onClick={() => setOpenMobileSection(openMobileSection === 'why' ? null : 'why')}
                  className="w-full flex items-center justify-between py-3 border-b border-gray-200"
                >
                  <span className="text-base text-gray-900">Why Dulwich</span>
                  <ChevronDown className={`w-5 h-5 text-red-600 transition-transform ${openMobileSection === 'why' ? 'rotate-180' : ''}`} />
                </button>
                {openMobileSection === 'why' && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-2 animate-in slide-in-from-right duration-300">
                    <div className="space-y-3">
                      <a href="/why-dulwich/overview" className="block text-sm text-gray-700 hover:text-red-600 transition-colors py-2">
                        Overview
                      </a>
                      <a href="/why-dulwich/history" className="block text-sm text-gray-700 hover:text-red-600 transition-colors py-2">
                        Our History
                      </a>
                      <a href="/why-dulwich/values" className="block text-sm text-gray-700 hover:text-red-600 transition-colors py-2">
                        Our Values
                      </a>
                      <a href="/why-dulwich/community" className="block text-sm text-gray-700 hover:text-red-600 transition-colors py-2">
                        Community Life
                      </a>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setOpenMobileSection(openMobileSection === 'learning' ? null : 'learning')}
                  className="w-full flex items-center justify-between py-3 border-b border-gray-200"
                >
                  <span className="text-base text-gray-900">Learning</span>
                  <ChevronDown className={`w-5 h-5 text-red-600 transition-transform ${openMobileSection === 'learning' ? 'rotate-180' : ''}`} />
                </button>
                {openMobileSection === 'learning' && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-2 animate-in slide-in-from-right duration-300">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider">HIGHLIGHTED</h3>
                        <div className="space-y-3">
                          <a href="/learning/wellbeing" className="flex items-center justify-between text-sm text-red-600 hover:text-red-700 transition-colors py-2">
                            <span>Wellbeing</span>
                            <ArrowRight className="w-4 h-4" />
                          </a>
                          <a href="/learning/activities" className="flex items-center justify-between text-sm text-red-600 hover:text-red-700 transition-colors py-2">
                            <span>Co-Curricular Activities</span>
                            <ArrowRight className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider">CORE JOURNEY</h3>
                        <div className="space-y-3">
                          <a href="/learning/ducks" className="block text-sm text-gray-700 hover:text-red-600 transition-colors py-2">
                            DUCKS (2-7)
                          </a>
                          <a href="/learning/junior-school" className="block text-sm text-gray-700 hover:text-red-600 transition-colors py-2">
                            Junior School (7-11)
                          </a>
                          <a href="/learning/senior-school" className="block text-sm text-gray-700 hover:text-red-600 transition-colors py-2">
                            Senior School (11-18)
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setOpenMobileSection(openMobileSection === 'community' ? null : 'community')}
                  className="w-full flex items-center justify-between py-3 border-b border-gray-200"
                >
                  <span className="text-base text-gray-900">Community</span>
                  <ChevronDown className={`w-5 h-5 text-red-600 transition-transform ${openMobileSection === 'community' ? 'rotate-180' : ''}`} />
                </button>
                {openMobileSection === 'community' && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-2 animate-in slide-in-from-right duration-300">
                    <div className="space-y-3">
                      <a href="/community/student-life" className="block text-sm text-gray-700 hover:text-red-600 transition-colors py-2">
                        Student Life
                      </a>
                      <a href="/community/clubs" className="block text-sm text-gray-700 hover:text-red-600 transition-colors py-2">
                        Clubs & Activities
                      </a>
                      <a href="/community/sports" className="block text-sm text-gray-700 hover:text-red-600 transition-colors py-2">
                        Sports
                      </a>
                      <a href="/community/events" className="block text-sm text-gray-700 hover:text-red-600 transition-colors py-2">
                        Events
                      </a>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setOpenMobileSection(openMobileSection === 'admissions' ? null : 'admissions')}
                  className="w-full flex items-center justify-between py-3 border border-gray-200"
                >
                  <span className="text-base text-gray-900">Admissions</span>
                  <ChevronDown className={`w-5 h-5 text-red-600 transition-transform ${openMobileSection === 'admissions' ? 'rotate-180' : ''}`} />
                </button>
                {openMobileSection === 'admissions' && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-2 animate-in slide-in-from-right duration-300">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider">APPLY</h3>
                        <div className="space-y-3">
                          <a href="/admissions/eligibility" className="block text-sm text-gray-700 hover:text-red-600 transition-colors py-2">
                            Eligibility
                          </a>
                          <a href="/admissions/criteria" className="block text-sm text-gray-700 hover:text-red-600 transition-colors py-2">
                            Admissions Criteria
                          </a>
                          <a href="/admissions/fees" className="block text-sm text-gray-700 hover:text-red-600 transition-colors py-2">
                            Fees
                          </a>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider">VISIT US</h3>
                        <div className="space-y-3">
                          <a href="/admissions/open-days" className="block text-sm text-gray-700 hover:text-red-600 transition-colors py-2">
                            Open Days
                          </a>
                          <a href="/admissions/book-tour" className="block text-sm text-gray-700 hover:text-red-600 transition-colors py-2">
                            Book a Tour
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}



                <a href="#sitemap" className="block py-3 text-sm text-gray-700 border border-gray-200">
                  Full Site Map
                </a>
                <button
                  onClick={() => setOpenMobileSection(openMobileSection === 'schools' ? null : 'schools')}
                  className="w-full flex items-center justify-between py-3 border border-gray-200"
                >
                  <span className="text-base text-gray-900">Schools</span>
                  <ChevronDown className={`w-5 h-5 text-[#000] transition-transform ${openMobileSection === 'schools' ? 'rotate-180' : ''}`} />
                </button>
                {openMobileSection === 'schools' && availableSchools && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-2 space-y-1 animate-in slide-in-from-right duration-300">
                    {availableSchools.map((school) => (
                      <button
                        key={school.id}
                        onClick={() => {
                          handleSchoolSelect(school);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors ${selectedSchool === `Dulwich College ${school.title}`
                            ? 'font-medium'
                            : ''
                          }`}
                        style={{
                          color: selectedSchool === `Dulwich College ${school.title}` ? '#D30013' : '#4B5563'
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span>Dulwich College {school.title}</span>
                          {selectedSchool === `Dulwich College ${school.title}` && (
                            <span style={{ color: '#D30013' }}>✓</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                <a href="#parent-portal" className="block py-3 text-sm text-gray-700 border border-gray-200">
                  Parent Portal
                </a>

                <a href="#calendar" className="block py-3 text-sm text-gray-700 border border-gray-200">
                  School Calendar
                </a>
              </div>

              {/* Bottom Section - Search and Language Tabs */}
              <div className="border-t border-gray-200 bg-white">
                {/* Search */}
                <div className="px-4 p4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                </div>

                {/* Language Tabs - Hidden for Singapore */}
                {getCurrentSchool() !== 'singapore' && (
                  <div className="flex border-t border-gray-200">
                    <button
                      onClick={(e) => {
                        if (!isChineseVersion) {
                          toggleLanguage(e);
                        }
                      }}
                      className={`flex-1 py-3 text-sm font-medium transition-colors ${activeLanguage === '中文'
                          ? 'text-gray-900 border-b-2 border-red-600'
                          : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                      中文
                    </button>
                    <button
                      onClick={(e) => {
                        if (isChineseVersion) {
                          toggleLanguage(e);
                        }
                      }}
                      className={`flex-1 py-3 text-sm font-medium transition-colors ${activeLanguage === 'EN'
                          ? 'text-gray-900 border-b-2 border-red-600'
                          : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                      EN
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default PageHeader;