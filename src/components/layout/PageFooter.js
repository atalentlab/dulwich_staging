import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../Icon';
import eimLogo from '../../assets/images/eim-logo-blue.svg';
import wechatQRCode from '../../assets/images/Wechat_QRcode.webp';
import redNoteQRCode from '../../assets/images/rednote.webp';
import { getSchoolUrl } from '../../utils/schoolDetection';
import footerNavData from '../../assets/menu/footer-navigation.json';
import dcLogoWhite from '../../assets/images/logo_white/dci-group-logo-white.svg';
import dcLogo from '../../assets/images/article-logo.svg';

// Custom Dropdown Component
const CustomDropdown = ({ value, options, onChange, isOpen, setIsOpen }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 180);
  };

  const handleSelect = (option) => {
    setIsClosing(true);
    setTimeout(() => {
      onChange(option);
      setIsOpen(false);
      setIsClosing(false);
    }, 180);
  };

  return (
    <div className="relative" style={{ isolation: 'isolate' }}>
      <button
        onClick={() => !isClosing && setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 bg-[#FFFFFF] border border-[#EBE4DD] rounded-[4px] text-left flex items-center justify-between hover:border-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-[#D30013] focus:border-transparent"
        style={{ willChange: 'auto' }}
      >
        <span className="text-[#3C3C3B]">{value}</span>
        <Icon icon="Icon-Chevron-small" size={20} color="#3C3C3B" className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {(isOpen || isClosing) && (
        <>
          {/* Backdrop overlay with fade animations */}
          <div
            className={`fixed inset-0 bg-black z-[100] transition-opacity duration-150 ${
              isClosing ? 'opacity-0' : 'opacity-30'
            }`}
            onClick={handleClose}
            style={{ willChange: 'opacity' }}
          ></div>

          {/* Dropdown Menu with slide animations and smooth scroll */}
          <div
            className={`absolute z-[101] w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-2xl max-h-60 overflow-y-auto overflow-x-hidden transition-all duration-150 ease-out ${
              isClosing ? 'opacity-0 scale-95 translate-y-[-4px]' : 'opacity-100 scale-100 translate-y-0'
            }`}
            onClick={(e) => e.stopPropagation()}
            style={{
              scrollBehavior: 'smooth',
              scrollbarWidth: 'thin',
              scrollbarColor: '#D30013 #f3f4f6',
              pointerEvents: 'auto',
              willChange: 'transform, opacity',
              transformOrigin: 'top'
            }}
            onWheel={(e) => e.stopPropagation()}
          >
            {options.map((option, index) => (
              <div
                key={index}
                onClick={() => handleSelect(option)}
                className={`px-4 py-3 cursor-pointer transition-all duration-150 ${
                  value === option
                    ? 'bg-[#FFF5F5] text-[#D30013] font-semibold'
                    : 'text-[#3C3C3B] hover:bg-[#FAF7F5]'
                } ${index === 0 ? 'border-b border-gray-200 rounded-t-lg' : ''} ${index === options.length - 1 ? 'rounded-b-lg' : ''}`}
              >
                <div className="flex items-center">
                  {value === option && (
                    <span className="mr-2 text-[#D30013] font-bold">✓</span>
                  )}
                  {option}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

function PageFooter({ sectionRefs, selectedSchool, setSelectedSchool, setSelectedSchoolSlug }) {
  // Detect language from URL (same pattern as PageHeader)
  const location = useLocation();
  const isChineseVersion = location.pathname.startsWith('/zh/') || location.pathname === '/zh';
  const nav = isChineseVersion ? footerNavData.zh : footerNavData.en;

  // Shorthand nav columns
  const aboutCol = nav.columns[0];
  const liveCol  = nav.columns[1];
  const worldCol = nav.columns[2];
  const wiseCol  = nav.columns[3];

  // Local state for schools
  const [schoolsList, setSchoolsList] = useState([]);

  // State for the left dropdown — initially shows "Please select" placeholder
  const [selectedOption, setSelectedOption] = useState(nav.pleaseSelect);

  // Sync selectedOption when language toggles without unmounting
  useEffect(() => {
    setSelectedOption(prev => {
      if (prev === 'International' || prev === '国际') return nav.international;
      if (prev === 'Please select' || prev === '请选择') return nav.pleaseSelect;
      return prev;
    });
  }, [nav.international, nav.pleaseSelect]);

  // Always fetch schools from API with the current locale
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const baseUrl = process.env.REACT_APP_API_URL;
        const currentLocale = isChineseVersion ? 'zh' : 'en';
        const response = await fetch(`${baseUrl}/api/schools?locale=${currentLocale}`, {
          signal: controller.signal,
        });
        const json = await response.json();
        const rawSchools = json?.success && Array.isArray(json?.data) ? json.data : [];
        // Ensure International option exists
        const hasInternational = rawSchools.some(s => s.slug === 'international');
        const processed = hasInternational ? rawSchools : [
          { id: -1, title: 'International', slug: 'international', url: process.env.REACT_APP_BASE_URL },
          ...rawSchools,
        ];
        setSchoolsList(processed);
      } catch (err) {
        if (err?.name === 'AbortError') return;
        setSchoolsList([]);
      }
    })();

    return () => controller.abort();
  }, [isChineseVersion]);

  // State for dropdown open/close (desktop)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // State for dropdown open/close (mobile)
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);

  // Compute the current school title for the dropdown value
  const currentSchoolTitle = useMemo(() => {
    if (selectedSchool && schoolsList.length > 0) {
      const found = schoolsList.find(school =>
        school.title === selectedSchool || 
        `Dulwich College ${school.title}` === selectedSchool ||
        school.slug === (typeof selectedSchool === 'string' && selectedSchool.toLowerCase())
      );
      if (found) return found.slug === 'international' ? nav.international : found.title;
      if (selectedSchool === 'International' || selectedSchool === 'International School' || selectedSchool === 'Dulwich International College') {
        return nav.international;
      }
    }
    // If we have a selectedOption from manual selection, use it as fallback
    if (selectedOption && selectedOption !== nav.pleaseSelect) {
      return selectedOption;
    }
    return nav.international;
  }, [selectedSchool, schoolsList, nav.international, selectedOption, nav.pleaseSelect]);

  // State for social icon hover
  const [hoveredIcon, setHoveredIcon] = useState(null);

  // State for QR code modals
  const [activeModal, setActiveModal] = useState(null);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleOpenModal = (modalType) => {
    setActiveModal(modalType);
    setIsModalClosing(false);
    setImageLoading(true);
  };

  const handleCloseModal = () => {
    setIsModalClosing(true);
    setTimeout(() => {
      setActiveModal(null);
      setIsModalClosing(false);
    }, 300);
  };

  // Generate options from schoolsList (from API / context / props) with localised "International" as first option
  const selectOptions = useMemo(() => {
    const options = [nav.international];

    if (schoolsList && schoolsList.length > 0) {
      const schoolOptions = schoolsList
        .filter(school => school.slug !== 'international')
        .map(school => school.title);
      return [...options, ...schoolOptions];
    }

    return options;
  }, [schoolsList, nav.international]);

  // Create a mapping for school data lookup
  const schoolDataMap = useMemo(() => {
    const map = {};
    if (schoolsList && schoolsList.length > 0) {
      schoolsList.forEach(school => {
        map[school.title] = school;
      });
    }
    return map;
  }, [schoolsList]);

  // Handle selection change
  const handleSelectChange = (schoolName) => {
    setSelectedOption(schoolName);

    if (!schoolName) return;

    // Update state
    if (setSelectedSchool && setSelectedSchoolSlug) {
      if (schoolName === nav.international) {
        setSelectedSchool('International');
        setSelectedSchoolSlug('international');
      } else {
        const schoolData = schoolDataMap[schoolName];
        if (schoolData) {
          setSelectedSchool(schoolName);
          setSelectedSchoolSlug(schoolData.slug);
          localStorage.setItem('selectedSchoolSlug', schoolData.slug);
          localStorage.setItem('selectedSchoolName', schoolName);
        }
      }
    }

    // Redirect to school URL
    if (schoolName === nav.international) {
      const internationalData = schoolsList.find(s => s.slug === 'international');
      if (internationalData?.url) {
        window.location.href = internationalData.url.replace(/\\\//g, '/');
      } else {
        const baseUrl = process.env.REACT_APP_BASE_URL;
        window.location.href = isChineseVersion ? `${baseUrl}zh/` : baseUrl;
      }
      return;
    } else {
      const schoolData = schoolDataMap[schoolName];
      if (schoolData) {
        if (schoolData.url) {
          const cleanUrl = schoolData.url.replace(/\\\//g, '/');
          window.location.href = cleanUrl;
        } else {
          window.location.href = getSchoolUrl(schoolData.slug, '');
        }
      }
    }
  };

  return (
    <footer
      ref={(el) => (sectionRefs?.current ? sectionRefs.current['footer'] = el : null)}
      className="bg-[#3C3737] text-[#FFFFFF] transition-all duration-1000 mt-[16px]"
    >
      {/* Top Section - Logo and School Selector */}
      <div className="max-w-[1120px] mx-auto px-4 py-14">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Left - Logo and Brand */}
          <div className="flex items-center gap-2 md:gap-8">
            <img
              src={dcLogo}
              alt="Dulwich College"
              className="h-[50px] md:h-[64px] w-[80%] md:w-[100%]"
              onError={(e) => {
                e.target.style.display = '';
              }}
            />
         <img
              src={dcLogoWhite}
              alt="Dulwich College"
              className="w-[230px] md:w-[400px]"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>

       {/* Right - School Selector - Desktop Only */}
       <div className="hidden md:block md:w-auto">
            <label className="block text-[16px] text-left font-semibold mb-2 text-white tracking-wide">
              {nav.ourSchools}
            </label>
            <div className="w-full md:w-56">
              <CustomDropdown
                value={currentSchoolTitle}
                options={selectOptions}
                onChange={handleSelectChange}
                isOpen={isDropdownOpen}
                setIsOpen={setIsDropdownOpen}
                placeholder={nav.pleaseSelect}
              />
            </div>
            </div>
        </div>
      </div>

      {/* Main Content - Grid */}
      <div>
        <div className="max-w-[1120px] mx-auto px-4 py-4 mb-2">
          <div className="grid text-left grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-8 lg:gap-10">

            {/* Column 1 - About */}
            <div>
              <h3 className="text-[14px] md:text-[16px] text-[#FDFCF8] font-bold mb-4 tracking-wide">{aboutCol.label}</h3>
              <ul className="space-y-2.5">
                {aboutCol.links.map((link, i) => (
                  <li key={i}>
                    <a href={link.url} className="text-[14px] text-[#FDFCF8] leading-[48px] md:leading-[40px] sm:leading-[32px] font-normal hover:text-[#D30013] transition-colors">
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2 - Live */}
            <div>
              <h3 className="text-[14px] md:text-[16px] text-[#FDFCF8] font-bold mb-4 tracking-wide">{liveCol.label}</h3>
              <ul className="space-y-2.5">
                {liveCol.links.map((link, i) => (
                  <li key={i}>
                    <a href={link.url} className="text-[14px] text-[#FDFCF8] leading-[48px] md:leading-[40px] sm:leading-[32px] font-normal hover:text-[#D30013] transition-colors">
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 - World */}
            <div>
              <h3 className="text-[14px] md:text-[16px] text-[#FDFCF8] font-bold mb-4 tracking-wide">{worldCol.label}</h3>
              <ul className="space-y-2.5">
                {worldCol.links.map((link, i) => (
                  <li key={i}>
                    <a href={link.url} className="text-[14px] text-[#FDFCF8] leading-[48px] md:leading-[40px] sm:leading-[32px] font-normal hover:text-[#D30013] transition-colors">
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4 - Wise + External Links */}
            <div>
              <h3 className="text-[14px] md:text-[16px] text-[#FDFCF8] font-bold mb-4 tracking-wide">{wiseCol.label}</h3>
              <ul className="space-y-2.5">
                {wiseCol.links.map((link, i) => (
                  <li key={i}>
                    <a href={link.url} className="text-[14px] text-[#FDFCF8] leading-[48px] md:leading-[40px] sm:leading-[32px] font-normal hover:text-[#D30013] transition-colors">
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
              <div>
                <br></br>  <br></br>
                <h3 className="text-[14px] md:text-[16px] font-bold text-[#FDFCF8] mb-4 tracking-wide">{wiseCol.externalLinks.heading}</h3>
                <ul className="space-y-2.5">
                  {wiseCol.externalLinks.links.map((link, i) => (
                    <li key={i}>
                      <a href={link.url} className="text-[14px] text-[#FDFCF8] hover:text-[#D30013] leading-[48px] md:leading-[40px] sm:leading-[32px] font-normal transition-colors">
                        {link.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - QR Code, Social Media & Copyright */}
      <div className="bg-[#3C3737]">
        <div className="max-w-[1120px] mx-auto px-4 py-8">

          {/* Mobile: School Selector */}
          <div className="block md:hidden mb-6">
            <h3 className="text-sm text-left font-semibold mb-3 text-white">{nav.ourSchools}</h3>
            <CustomDropdown
              value={currentSchoolTitle}
              options={selectOptions}
              onChange={handleSelectChange}
              isOpen={isMobileDropdownOpen}
              setIsOpen={setIsMobileDropdownOpen}
              placeholder={nav.pleaseSelect}
            />
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between lg:items-center lg:justify-start gap-6">

            {/* QR Code - Centered on mobile, left on desktop */}
            <div className="flex justify-left md:justify-start w-full md:w-auto">
              <img
                src={wechatQRCode}
                alt="QR Code"
                className="w-32 h-32 md:w-40 md:h-40 bg-white p-2 rounded"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>

            {/* Social Media Icons - Grid layout on mobile, flex on desktop */}
            <div className="w-full md:w-auto">
              <div className="grid grid-cols-4 md:flex md:flex-row gap-6 md:gap-8 justify-items-center md:justify-start items-center">
                <button
                  onClick={() => handleOpenModal('wechat')}
                  className="transition-all duration-300 cursor-pointer bg-transparent border-0 p-0"
                  aria-label="WeChat"
                  onMouseEnter={() => setHoveredIcon('wechat')}
                  onMouseLeave={() => setHoveredIcon(null)}
                >
                  <Icon icon="Icon-Social-WC" size={28} color={hoveredIcon === 'wechat' ? '#D30013' : 'white'} />
                </button>
                <a
                  href="https://www.facebook.com/Dulwich.College.International"
                  className="transition-all duration-300"
                  aria-label="Facebook"
                  onMouseEnter={() => setHoveredIcon('facebook')}
                  onMouseLeave={() => setHoveredIcon(null)}
                >
                  <Icon icon="Icon-Social-FB" size={28} color={hoveredIcon === 'facebook' ? '#D30013' : 'white'} />
                </a>
                <a
                  href="https://x.com/in_dulwich"
                  className="transition-all duration-300"
                  aria-label="x"
                  onMouseEnter={() => setHoveredIcon('x')}
                  onMouseLeave={() => setHoveredIcon(null)}
                >
                  <Icon icon="X_logo_2023" size={22} color={hoveredIcon === 'x' ? '#D30013' : 'white'} />
                </a>
                <a
                  href="https://www.youku.com/profile/index/?uid=UMTg2MTQ5NTk3Mg=="
                  className="transition-all duration-300"
                  aria-label="Youku"
                  onMouseEnter={() => setHoveredIcon('youku')}
                  onMouseLeave={() => setHoveredIcon(null)}
                >
                  <Icon icon="Icon-Social-YK" size={28} color={hoveredIcon === 'youku' ? '#D30013' : 'white'} />
                </a>    
                <a
                  href="https://www.youtube.com/c/Indulwich"
                  className="transition-all duration-300"
                  aria-label="YouTube"
                  onMouseEnter={() => setHoveredIcon('youtube')}
                  onMouseLeave={() => setHoveredIcon(null)}
                >
                  <Icon icon="Icon-Social-YT" size={28} color={hoveredIcon === 'youtube' ? '#D30013' : 'white'} />
                </a>
                <a
                  href="https://www.linkedin.com/company/dulwich-college-management"
                  className="transition-all duration-300"
                  aria-label="LinkedIn"
                  onMouseEnter={() => setHoveredIcon('linkedin')}
                  onMouseLeave={() => setHoveredIcon(null)}
                >
                  <Icon icon="Icon-Social-LI" size={28} color={hoveredIcon === 'linkedin' ? '#D30013' : 'white'} />
                </a>
                <button
                  onClick={() => handleOpenModal('rednote')}
                  className="transition-all duration-300 cursor-pointer bg-transparent border-0 p-0"
                  aria-label="RedNote"
                  onMouseEnter={() => setHoveredIcon('rednote')}
                  onMouseLeave={() => setHoveredIcon(null)}
                >
                  <Icon icon="Icon-Social-RedNote" size={40} color={hoveredIcon === 'rednote' ? '#D30013' : 'white'} />
                </button>
              </div>
            </div>
          </div>

          {/* Safeguarding Notice */}
          <div className="mt-9 text-[16px] text-left text-[#FDFCF8] max-w-full">
            <p className="leading-relaxed font-light">
              <strong className="text-[#FDFCF8] font-bold">{nav.safeguarding.title}</strong> {nav.safeguarding.text}{' '}
              <a href={nav.safeguarding.linkUrl} className="text-[#FDFCF8] underline hover:text-[#D30013] transition-colors">
                {nav.safeguarding.linkText}
              </a>
              {' '}{nav.safeguarding.suffix}
            </p>
            <div className="footer-privacy flex justify-center gap-3 mt-6 text-center">
                 <a href={nav.Policy.linkUrl} className='text-[16px] text-left text-[#FDFCF8] underline hover:text-[#D30013] transition-colors'>{nav.Policy.title}</a>
                 <span className="text-[#FDFCF8]">|</span>
                 <a href={nav.RecruitmentPolicy.linkUrl} className='text-[16px] text-left text-[#FDFCF8] underline hover:text-[#D30013] transition-colors'>{nav.RecruitmentPolicy.title}</a>
              </div>
          </div>

          {/* Copyright */}
          <div className="mt-4 md:mt-10 pt-2 md:pt-6 border-t border-[#646261] md:mb-[10px] text-left">
            <a href='https://beian.miit.gov.cn/#/Integrated/index'>
              <p className="text-[14px] text-[#FDFCF8] mt-4 text-left leading-relaxed">
                © 2026 Dulwich College Management International Limited, or its affiliates
                <br className="md:hidden" />
                <span className="hidden md:inline"> </span>
                沪ICP备16016470号-4 · 沪公网安备31010602002392号
              </p>
            </a>
          </div>
        </div>
      </div>

      {/* QR Code Modal for WeChat and RedNote */}
      {activeModal && (
        <div
          className={`fixed inset-0 z-[200] flex items-center justify-center transition-all duration-300 ${
            isModalClosing ? 'bg-black bg-opacity-0' : 'bg-black bg-opacity-50 backdrop-blur-sm'
          }`}
          onClick={handleCloseModal}
          style={{
            animation: isModalClosing ? 'fadeOut 0.3s ease-out' : 'fadeIn 0.3s ease-out'
          }}
        >
          <div
            className={`relative bg-[#fff] drop-shadow-lg rounded-lg p-0 max-w-[90vw] md:max-w-md transform transition-all duration-300 ${
              isModalClosing ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
            }`}
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: isModalClosing
                ? 'zoomOut 0.3s cubic-bezier(0.4, 0, 1, 1)'
                : 'zoomIn 0.3s cubic-bezier(0, 0, 0.2, 1)'
            }}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-10 text-[#D30013] hover:text-[#B8000F] transition-colors text-3xl font-light leading-none"
              aria-label="Close"
            >
              ×
            </button>

            {/* QR Code Image */}
            <div className="p-8 md:p-12 relative min-h-[200px] flex items-center justify-center">
              {/* Loading Spinner */}
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-t-4 border-[#D30013]"></div>
                </div>
              )}

              {/* QR Code Image */}
              <img
                src={activeModal === 'wechat' ? wechatQRCode : redNoteQRCode}
                alt={activeModal === 'wechat' ? 'WeChat QR Code' : 'RedNote QR Code'}
                className={`w-full h-auto transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                onLoad={() => setImageLoading(false)}
                onError={() => setImageLoading(false)}
                style={{
                  animation: isModalClosing
                    ? 'fadeOut 0.2s ease-out'
                    : !imageLoading ? 'fadeIn 0.4s ease-out' : 'none'
                }}
              />
            </div>
          </div>
          
        </div>
      )}

      {/* Dropdown Styles */}
      <style>{`
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

        /* QR Code Modal Animations */
        @keyframes zoomIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes zoomOut {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 0;
            transform: scale(0.3);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
      `}</style>

<div className='mb-[60px] md:mb-[10px] bg-white px-4 py-4'>
                  {/* EiM Family Logo - Right */}
                  <div className='max-w-[1120px] m-auto flex justify-end'>
                  <a
                href="https://www.eimglobal.com/?utm_source=dulwich.org&utm_medium=footer-link&utm_campaign=eim-family-of-schools"
                target="_blank"
                rel="noopener noreferrer"
                className="flex place-items-baseline leading-4 gap-4 hover:opacity-80 transition-opacity duration-200 flex-shrink-0"
              >
                <span className="font-figtree text-[12px] md:text-[14px] text-[#000] font-normal whitespace-nowrap relative">
                  Part of the EiM Family
                </span>
                <img
                  src={eimLogo}
                  alt="EiM Family"
                  className="h-16 md:h-16 w-auto"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </a>
              </div>
            </div>
    </footer>
  );
}

export default PageFooter;
