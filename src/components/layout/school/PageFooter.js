import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../../Icon';
import eimLogo from '../../../assets/images/eim-logo-blue.svg';
import { getSchoolUrl, getCurrentSchool } from '../../../utils/schoolDetection';
import { useMainMenu } from '../../../hooks/useMainMenu';
import { useSchoolInfo } from '../../../hooks/useSchoolInfo';
import schoolFooterNavData from '../../../assets/menu/school-footer-navigation.json';
import { fetchSchools } from '../../../api/schoolPageService';

// Import school logos from logo_white folder as fallback
import singaporeLogo from '../../../assets/images/logo_white/singapore.svg';
import suzhouLogo from '../../../assets/images/logo_white/suzhou.svg';
import suzhouHighSchoolLogo from '../../../assets/images/logo_white/suzhou-high-school.svg';
import hengqinHighSchoolLogo from '../../../assets/images/logo_white/hengqin-high-school.svg';
import seoulLogo from '../../../assets/images/logo_white/seoul.svg';
import shanghaiPuxiLogo from '../../../assets/images/logo_white/shanghai-puxi.svg';
import shanghaiPudongLogo from '../../../assets/images/logo_white/shanghai-pudong.svg';
import bangkokLogo from '../../../assets/images/logo_white/bangkok.svg';
import beijingLogo from '../../../assets/images/logo_white/beijing.svg';

// Tree-Nation widget config — only schools listed here show the widget
const TREE_NATION_CONFIG = {
  'singapore': {
    code:      'b473d6384ca5f3ca',
    elementId: 'tree-nation-offset-website',
    theme:     'white',
  },
  'shanghai-pudong': {
    code:      '58ce11394a828dd3',
    elementId: 'tree-nation-offset-website',
    theme:     'white',
  },
};

// Assets base URL for dynamic images
const ASSETS_BASE_URL = 'https://assets.dulwich.org';

// Static logo fallbacks mapped by school slug
const STATIC_LOGO_FALLBACKS = {
  'singapore': singaporeLogo,
  'suzhou': suzhouLogo,
  'suzhou-high-school': suzhouHighSchoolLogo,
  'hengqin-high-school': hengqinHighSchoolLogo,
  'seoul': seoulLogo,
  'shanghai-puxi': shanghaiPuxiLogo,
  'shanghai-pudong': shanghaiPudongLogo,
  'bangkok': bangkokLogo,
  'beijing': beijingLogo,
};

// School-specific portal URLs
const SCHOOL_PORTAL_LINKS = {
  'bangkok': null,
  'shanghai-pudong': 'https://portal-dcspd.dulwich.org/',
  'shanghai-puxi': 'https://portal-dcspx.dulwich.org/',
  'seoul': 'https://portal-dcsl.dulwich.org/',
  'singapore': 'https://portal-dcsg.dulwich.org/',
  'suzhou': 'https://portal-dcsz.dulwich.org/',
  'hengqin-high-school': null,
  'suzhou-high-school': 'https://portal-dhsz.dulwich.org/',
  'beijing': 'https://portal-dcb.dulwich.org/',
};

// Custom Dropdown Component
const CustomDropdown = ({ value, options, onChange, isOpen, setIsOpen, placeholder }) => {
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
        className="w-full px-4 py-2.5 bg-[#FFFFFF] border border-[#EBE4DD] rounded-lg text-left flex items-center justify-between hover:border-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-[#D30013] focus:border-transparent"
        style={{ willChange: 'auto' }}
      >
        <span className="text-[#3C3C3B]">{value}</span>
        <Icon icon="Icon-Chevron-small" size={20} color="#3C3737" className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
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
            className={`absolute z-[101] w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-2xl max-h-60 overflow-y-auto overflow-x-hidden transition-all duration-150 ease-out ${
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

function PageFooter({ sectionRefs, isVisible, availableSchools, selectedSchool, setSelectedSchool, setSelectedSchoolSlug }) {
  const location = useLocation();

  // Determine locale based on URL path
  const isChineseVersion = location.pathname.startsWith('/zh/') || location.pathname === '/zh';
  const locale = isChineseVersion ? 'zh' : 'en';
  const t = isChineseVersion ? schoolFooterNavData.zh : schoolFooterNavData.en;

  // Get current school from subdomain
  const currentSchoolSlug = getCurrentSchool();

  // Fetch school information from API
  const { schoolInfo, isLoading: isSchoolInfoLoading } = useSchoolInfo(currentSchoolSlug, locale);

  // State for fetched schools from API
  const [fetchedSchools, setFetchedSchools] = useState([]);

  // State for the left dropdown - default to localised "Please select"
  const [selectedOption, setSelectedOption] = useState(t.pleaseSelect);
  const [displaySchoolName, setDisplaySchoolName] = useState('INTERNATIONAL');
  const [hoveredIcon, setHoveredIcon] = useState(null);

  // State for QR code modals
  const [activeModal, setActiveModal] = useState(null);
  const [isModalClosing, setIsModalClosing] = useState(false);

  const handleOpenModal = (modalType) => {
    setActiveModal(modalType);
    setIsModalClosing(false);
  };

  const handleCloseModal = () => {
    setIsModalClosing(true);
    setTimeout(() => {
      setActiveModal(null);
      setIsModalClosing(false);
    }, 300);
  };

  // Sync selectedOption label when language toggles
  useEffect(() => {
    setSelectedOption(prev =>
      (prev === 'Please select' || prev === '请选择' || prev === 'International' || prev === '国际') ? t.pleaseSelect : prev
    );
  }, [t.pleaseSelect]);

  // Fetch schools from API based on locale
  useEffect(() => {
    const loadSchools = async () => {
      try {
        console.log('🔍 School PageFooter - Fetching schools with locale:', locale);
        const schoolsList = await fetchSchools(locale);
        console.log('🔍 School PageFooter - Fetched schools:', schoolsList);

        if (Array.isArray(schoolsList)) {
          setFetchedSchools(schoolsList);
        }
      } catch (error) {
        console.error('Error fetching schools in school footer:', error);
      }
    };

    loadSchools();
  }, [locale]);

  // State for dropdown open/close (desktop)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // State for dropdown open/close (mobile)
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);

  // Extract social links and other data from API response
  const socialLinks = useMemo(() => ({
    facebook: schoolInfo?.sns_facebook || '#',
    instagram: schoolInfo?.sns_instagram || '#',
    linkedin: schoolInfo?.sns_linkedin || '#',
    youtube: schoolInfo?.sns_youtube || '#',
    youku: schoolInfo?.sns_youku || '#',
  }), [schoolInfo]);

  // Get logo URL from API, fallback to static logo based on school slug
  const logoUrl = useMemo(() => {
    if (schoolInfo?.logo) {
      return `${ASSETS_BASE_URL}/${schoolInfo.logo}`;
    }
    // Fallback to static logo if API doesn't provide one
    return STATIC_LOGO_FALLBACKS[currentSchoolSlug] || null;
  }, [schoolInfo, currentSchoolSlug]);

  // Get footer logo URL from API (used for mobile/centered variants)
  const logoFooterUrl = schoolInfo?.logo_footer ? `${ASSETS_BASE_URL}/${schoolInfo.logo_footer}` : logoUrl;

  // Get WeChat QR code URL from API (if it's a path, not a full URL)
  const wechatQRCode = useMemo(() => {
    if (!schoolInfo?.sns_wechat) return null;
    // Check if it's already a full URL
    if (schoolInfo.sns_wechat.startsWith('http')) return schoolInfo.sns_wechat;
    // Otherwise, construct the full URL
    return `${ASSETS_BASE_URL}/${schoolInfo.sns_wechat}`;
  }, [schoolInfo]);

  // Get Red Note QR code URL from API
  const redNoteQRCode = useMemo(() => {
    if (!schoolInfo?.red_note) return null;
    // Check if it's already a full URL
    if (schoolInfo.red_note.startsWith('http')) return schoolInfo.red_note;
    // Otherwise, construct the full URL
    return `${ASSETS_BASE_URL}/${schoolInfo.red_note}`;
  }, [schoolInfo]);

  // Get safeguarding text from API
  const safeguardingHtml = schoolInfo?.footer_rs_copy || null;

  // Get contact info from API
  const contactEmail = schoolInfo?.addresses?.contact_email || 'info@dulwich.org';
  const contactPhone = schoolInfo?.addresses?.telephone || '';
  const contactAddress = schoolInfo?.addresses?.address || '';
  const localizedAddress = schoolInfo?.addresses?.localized_address || '';

  // Load Tree-Nation widget for supported schools
  useEffect(() => {
    const config = TREE_NATION_CONFIG[currentSchoolSlug];
    if (!config) return;

    let mounted = true;
    let attempts = 0;

    const tryRender = () => {
      if (!mounted) return;
      if (window.TreeNationOffsetWebsite && document.getElementById(config.elementId)) {
        try {
          window.TreeNationOffsetWebsite({ code: config.code, lang: 'en', theme: config.theme })
            .render(`#${config.elementId}`);
        } catch (e) { /* silent */ }
        return;
      }
      // Retry up to 10 times (5 seconds total)
      if (attempts < 10) {
        attempts++;
        setTimeout(tryRender, 500);
      }
    };

    if (window.TreeNationOffsetWebsite) {
      setTimeout(tryRender, 300);
      return () => { mounted = false; };
    }

    const script = document.createElement('script');
    script.src = 'https://widgets.tree-nation.com/js/widgets/v1/widgets.min.js?v=1.0';
    script.async = true;
    script.onload = () => setTimeout(tryRender, 300);
    script.onerror = () => {};
    document.body.appendChild(script);

    return () => {
      mounted = false;
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, [currentSchoolSlug]);

  // Fetch dynamic menu data for footer (ALL items)
  const { data: menuItems } = useMainMenu(currentSchoolSlug, locale);

  // Helper function to check if URL is external
  const isExternalUrl = (url) => {
    return url && (url.startsWith('http://') || url.startsWith('https://'));
  };

  // Update display name based on selected school or current URL
  useEffect(() => {
    const currentSchoolSlug = getCurrentSchool();
    // Use fetchedSchools from API, fallback to availableSchools from props
    const schoolsToUse = fetchedSchools.length > 0 ? fetchedSchools : availableSchools;

    if (currentSchoolSlug && schoolsToUse) {
      const currentSchoolData = schoolsToUse.find(s => s.slug === currentSchoolSlug);
      if (currentSchoolData) {
        setDisplaySchoolName(currentSchoolData.title.toUpperCase());
        // Don't auto-select the current school - keep "Please select" as default
        // setSelectedOption(currentSchoolData.title);
        return;
      }
    }

    // Check if there's a selected school prop
    if (selectedSchool && selectedSchool !== 'Dulwich International College') {
      // Extract school name from "Dulwich College Beijing" format
      const schoolName = selectedSchool.replace('Dulwich College ', '').toUpperCase();
      setDisplaySchoolName(schoolName);
    } else {
      setDisplaySchoolName('INTERNATIONAL');
    }
  }, [selectedSchool, availableSchools, fetchedSchools]);

  // Generate options from fetchedSchools with localised "Please select" as first option
  const selectOptions = useMemo(() => {
    const options = [t.pleaseSelect];

    // Use fetchedSchools from API, fallback to availableSchools from props
    const schoolsToUse = fetchedSchools.length > 0 ? fetchedSchools : availableSchools;

    if (schoolsToUse && schoolsToUse.length > 0) {
      const schoolOptions = schoolsToUse.map(school => school.title);
      return [...options, ...schoolOptions];
    }

    return options;
  }, [fetchedSchools, availableSchools, t.pleaseSelect]);

  // Create a mapping for school data lookup
  const schoolDataMap = useMemo(() => {
    const map = {};
    // Use fetchedSchools from API, fallback to availableSchools from props
    const schoolsToUse = fetchedSchools.length > 0 ? fetchedSchools : availableSchools;

    if (schoolsToUse && schoolsToUse.length > 0) {
      schoolsToUse.forEach(school => {
        map[school.title] = school;
      });
    }
    return map;
  }, [fetchedSchools, availableSchools]);

  // Handle selection change
  const handleSelectChange = (schoolName) => {
    setSelectedOption(schoolName);

    if (!schoolName) return;

    // If "Please select" is chosen, just return without navigating
    if (schoolName === t.pleaseSelect) {
      return;
    }

    // Update state
    if (setSelectedSchool && setSelectedSchoolSlug) {
      if (schoolName === t.international) {
        setSelectedSchool('International');
        setSelectedSchoolSlug('international');
      } else {
        const schoolData = schoolDataMap[schoolName];
        if (schoolData) {
          setSelectedSchool(`Dulwich College ${schoolName}`);
          setSelectedSchoolSlug(schoolData.slug);
          localStorage.setItem('selectedSchoolSlug', schoolData.slug);
          localStorage.setItem('selectedSchoolName', `Dulwich College ${schoolName}`);
        }
      }
    }

    // Redirect to school URL
    if (schoolName === t.international) {
      // Redirect to static international site
      window.location.href = 'https://www.dulwich-frontend.atalent.xyz/';
    } else {
      const schoolData = schoolDataMap[schoolName];
      if (schoolData) {
        // Use school URL directly from API response if available (without appending current path)
        if (schoolData.url) {
          // Clean up escaped forward slashes if present
          const cleanUrl = schoolData.url.replace(/\\\//g, '/');
          window.location.href = cleanUrl;
        } else {
          // Fallback to utility function if URL not available
          window.location.href = getSchoolUrl(schoolData.slug, '');
        }
      }
    }
  };

  return (
    <footer
      ref={(el) => (sectionRefs?.current ? sectionRefs.current['footer'] = el : null)}
      className="bg-[#3C3737] text-white transition-all duration-1000 mt-12"
    >
      {/* Top Section - Logo and School Selector */}
      <div className="max-w-[1120px] mx-auto px-4 py-10 md:py-14">
        <div className="flex flex-col md:flex-row items-start md:items-start justify-between gap-6 md:gap-8">
          {/* Left - Logo and Brand */}
          <div className="flex text-left items-start justify-start w-[100%] max-w-[500px]">
            {/* Dynamic school logo from API with static fallback */}
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={`Dulwich College ${displaySchoolName}`}
                className="h-auto w-[100%]"
                onError={(e) => {
                  // If dynamic logo fails and we have a static fallback, try it
                  const staticFallback = STATIC_LOGO_FALLBACKS[currentSchoolSlug];
                  if (staticFallback && e.target.src !== staticFallback) {
                    e.target.src = staticFallback;
                  } else {
                    // If all logos fail, hide image and show text fallback
                    e.target.style.display = 'none';
                    const textFallback = e.target.nextElementSibling;
                    if (textFallback) textFallback.style.display = 'block';
                  }
                }}
              />
            ) : null}
            <h2
              className="text-base sm:text-lg md:text-xl lg:text-[24px] font-bold tracking-wider uppercase text-[#FFFFFF]"
              style={{ display: logoUrl ? 'none' : 'block' }}
            >
              DULWICH COLLEGE &nbsp;
              <span className='font-light'>| {displaySchoolName} |</span>
            </h2>
          </div>

          {/* Right - School Selector - Desktop Only */}
          <div className="hidden md:block md:w-auto flex-shrink-0">
            <label className="block text-left text-sm md:text-base font-bold mb-3 text-[#FFFFFF] tracking-wide">
              {t.ourSchools}
            </label>
            <div className="w-full md:w-60 lg:w-64">
              <CustomDropdown
                value={(() => {
                  // Check if a school is selected
                  if (selectedSchool && availableSchools) {
                    const found = availableSchools.find(school =>
                      `Dulwich College ${school.title}` === selectedSchool
                    );
                    if (found) return found.title;
                  }
                  // Default to localised "Please select"
                  return t.pleaseSelect;
                })()}
                options={selectOptions}
                onChange={handleSelectChange}
                isOpen={isDropdownOpen}
                setIsOpen={setIsDropdownOpen}
                placeholder={t.pleaseSelect}
              />
            </div>
            </div>

        </div>
      </div>

      {/* Main Content - Grid */}
      <div className="">
        <div className="max-w-[1120px] mx-auto px-4 py-7 md:py-14">
          <div className="grid text-left grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-14">

            {/* Column 1 - General Enquiries (Singapore) or Contact Info (Others) */}
            {currentSchoolSlug === 'singapore' ? (
              <div className="space-y-2.5">
                <h3 className="text-[14px] md:text-[16px] font-bold tracking-wide text-[#FFFFFF]">{t.generalEnquiries}</h3>
                <div className="space-y-2.5">
                  <div>
                    <a
                      href={`mailto:${contactEmail}`}
                      className="text-[14px] text-[#FDFCF8] leading-[24px] font-normal hover:text-[#D30013] transition-colors block"
                    >
                      {contactEmail}
                    </a>
                  </div>
                  {contactAddress && (
                    <div className="mt-4">
                      <h4 className="text-[14px] md:text-[16px] font-bold text-white mb-2">{t.mainCampus}</h4>
                      <p className="text-[14px] text-[#FDFCF8] leading-[24px] whitespace-pre-line">
                        {isChineseVersion && localizedAddress ? localizedAddress : contactAddress}
                      </p>
                      {contactPhone && (
                        <p className="text-[14px] text-[#FDFCF8] leading-[24px] mt-2">
                          T: {contactPhone}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-[14px] md:text-[16px] font-bold tracking-wide text-[#FFFFFF]">{t.generalEnquiries}</h3>
                <div>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="text-[14px] text-[#FDFCF8] leading-[24px] font-normal hover:text-[#D30013] transition-colors block"
                  >
                    {contactEmail}
                  </a>
                </div>
                {contactAddress && (
                  <div className="mt-4">
                    <h4 className="text-[14px] md:text-[16px] font-bold text-white mb-2">{t.mainCampus}</h4>
                    <p className="text-[14px] text-[#FDFCF8] leading-[24px] whitespace-pre-line">
                      {isChineseVersion && localizedAddress ? localizedAddress : contactAddress}
                    </p>
                    {contactPhone && (
                      <p className="text-[14px] text-[#FDFCF8] leading-[24px] mt-2">
                        T: {contactPhone}
                      </p>
                    )}
                  </div>
                )}
                {currentSchoolSlug !== 'beijing' && schoolInfo?.addresses?.kindergarten_address && (
                  <div className="mt-4">
                    <h4 className="text-[14px] md:text-[16px] font-bold text-white mb-2">{t.kindergarten || 'Kindergarten'}</h4>
                    <p className="text-[14px] text-[#FDFCF8] leading-[24px] whitespace-pre-line">
                      {schoolInfo.addresses.kindergarten_address}
                    </p>
                    {schoolInfo?.addresses?.kindergarten_telephone && (
                      <p className="text-[14px] text-[#FDFCF8] leading-[24px] mt-2">
                        T: {schoolInfo.addresses.kindergarten_telephone}
                      </p>
                    )}
                  </div>
                )}

                {/* Admissions Section */}
                <div className="mt-6">
                  <h4 className="text-[14px] md:text-[16px] font-bold text-white mb-2">{t.admissions}</h4>
                  <a
                    href="/admissions/apply-now"
                    className="text-[14px] text-[#FDFCF8] leading-[24px] font-normal hover:text-[#D30013] transition-colors block"
                  >
                    {t.applyNow}
                  </a>
                </div>

                {/* Visit Us Section */}
                <div className="mt-4">
                  <h4 className="text-[14px] md:text-[16px] font-bold text-white mb-2">{t.visitUs}</h4>
                  <a
                    href="/admissions/book-a-tour"
                    className="text-[14px] text-[#FDFCF8] leading-[24px] font-normal hover:text-[#D30013] transition-colors block"
                  >
                    {t.bookATour}
                  </a>
                </div>
              </div>
            )}

            {/* Column 2 - Quick Links */}
            <div className="space-y-3">
              <h3 className="text-[14px] md:text-[16px] font-bold tracking-wide text-[#FFFFFF]">{t.quickLinks}</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="/admissions/careers"
                    className="text-[14px] text-[#FDFCF8] leading-[48px] md:leading-[40px] sm:leading-[32px] font-normal hover:text-[#D30013] transition-colors inline-block"
                  >
                    {t.careers}
                  </a>
                </li>
               
                <li>
                  <a
                    href="/admissions/contact"
                    className="text-[14px] text-[#FDFCF8] leading-[48px] md:leading-[40px] sm:leading-[32px] font-normal hover:text-[#D30013] transition-colors inline-block"
                  >
                    {t.contactSchool}
                  </a>
                </li>
                <li>
                  <a
                    href="/our-college/safeguarding"
                    className="text-[14px] text-[#FDFCF8] leading-[48px] md:leading-[40px] sm:leading-[32px] font-normal hover:text-[#D30013] transition-colors inline-block"
                  >
                    {t.safeguarding}
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy-policy"
                    className="text-[14px] text-[#FDFCF8] leading-[48px] md:leading-[40px] sm:leading-[32px] font-normal hover:text-[#D30013] transition-colors inline-block"
                  >
                    {t.privacyPolicy}
                  </a>
                </li>
                <li>
                  <a
                    href="/sitemap"
                    className="text-[14px] text-[#FDFCF8] leading-[48px] md:leading-[40px] sm:leading-[32px] font-normal hover:text-[#D30013] transition-colors inline-block"
                  >
                    {t.siteMap}
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3 - External Links */}
            <div className="space-y-3">
              <h3 className="text-[14px] md:text-[16px] font-bold tracking-wide text-[#FFFFFF]">{t.externalLinks}</h3>
              <ul className="space-y-3 mb-8">
                {/* Parent Portal - School-specific or hidden */}
                {SCHOOL_PORTAL_LINKS[currentSchoolSlug] && (
                  <li>
                    <a
                      href={SCHOOL_PORTAL_LINKS[currentSchoolSlug]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[14px] text-[#FDFCF8] leading-[48px] md:leading-[40px] sm:leading-[32px] font-normal hover:text-[#D30013] transition-colors inline-block"
                    >
                      {t.parentPortal}
                    </a>
                  </li>
                )}
                <li>
                  <a
                    href="/find-a-school"
                    rel="noopener noreferrer"
                    className="text-[14px] text-[#FDFCF8] leading-[48px] md:leading-[40px] sm:leading-[32px] font-normal hover:text-[#D30013] transition-colors inline-block"
                  >
                    {t.foundingSchool}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.eimglobal.com/?utm_source=dulwich.org&utm_medium=footer-link&utm_campaign=eim-family-of-schools"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[14px] text-[#FDFCF8] leading-[48px] md:leading-[40px] sm:leading-[32px] font-normal hover:text-[#D30013] transition-colors inline-block"
                  >
                    {t.educationInMotion}
                  </a>
                </li>
              </ul>

              {/* QR Code and Social Icons Section - Desktop Only */}
              <div className="hidden md:block mt-8 pt-8">
                  <div className="flex flex-col sm:flex-row items-start gap-6">
                    {/* QR Code with Enhanced Border - Dynamic from API */}
                    {wechatQRCode && (
                      <div className="flex-shrink-0">
                        <div className="bg-white p-1 rounded-md border-[5px] border-white shadow-lg">
                          <img
                            src={wechatQRCode}
                            alt="WeChat QR Code"
                            className="w-32 h-32 sm:w-36 sm:h-36"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Social Icons - 3 Column Grid (3x3) */}
                    <div className="flex-grow">
                      <div className="grid grid-cols-3 gap-x-6 gap-y-8 mt-2">
                        {/* Row 1 */}
                        {wechatQRCode && (
                          <button
                            onClick={() => handleOpenModal('wechat')}
                            className="transition-all duration-300 hover:opacity-70 hover:scale-110 flex items-center justify-start cursor-pointer bg-transparent border-0 p-0"
                            aria-label="WeChat"
                            onMouseEnter={() => setHoveredIcon('wechat-alt')}
                            onMouseLeave={() => setHoveredIcon(null)}
                          >
                            <Icon icon="Icon-Social-WC" size={24} color={hoveredIcon === 'wechat-alt' ? '#D30013' : 'white'} />
                          </button>
                        )}
                        {redNoteQRCode && (
                          <button
                            onClick={() => handleOpenModal('rednote')}
                            className="transition-all duration-300 hover:opacity-70 hover:scale-110 flex items-center justify-start cursor-pointer bg-transparent border-0 p-0"
                            aria-label="RedNote"
                            onMouseEnter={() => setHoveredIcon('rednote-alt')}
                            onMouseLeave={() => setHoveredIcon(null)}
                          >
                            <Icon icon="Icon-Social-RedNote" size={40} color={hoveredIcon === 'rednote-alt' ? '#D30013' : 'white'} />
                          </button>
                        )}
</div>
<div className="grid grid-cols-3 gap-x-6 gap-y-6 mt-4">

                        <a
                          href={socialLinks.youku}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-all duration-300 hover:opacity-70 hover:scale-110 flex items-center justify-start"
                          aria-label="Youku"
                          onMouseEnter={() => setHoveredIcon('youku-alt')}
                          onMouseLeave={() => setHoveredIcon(null)}
                        >
                          <Icon icon="Icon-Social-YK" size={24} color={hoveredIcon === 'youku-alt' ? '#D30013' : 'white'} />
                        </a>

                        {/* Row 2 */}
                        <a
                          href={socialLinks.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-all duration-300 hover:opacity-70 hover:scale-110 flex items-center justify-start"
                          aria-label="YouTube"
                          onMouseEnter={() => setHoveredIcon('youtube-alt')}
                          onMouseLeave={() => setHoveredIcon(null)}
                        >
                          <Icon icon="Icon-Social-YT" size={24} color={hoveredIcon === 'youtube-alt' ? '#D30013' : 'white'} />
                        </a>
                        </div>
                        <div className="grid grid-cols-3 gap-x-6 gap-y-6 mt-6">

                        <a
                          href={socialLinks.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-all duration-300 hover:opacity-70 hover:scale-110 flex items-center justify-start"
                          aria-label="Facebook"
                          onMouseEnter={() => setHoveredIcon('facebook-alt')}
                          onMouseLeave={() => setHoveredIcon(null)}
                        >
                          <Icon icon="Icon-Social-FB" size={24} color={hoveredIcon === 'facebook-alt' ? '#D30013' : 'white'} />
                        </a>
                        <a
                          href={socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-all duration-300 hover:opacity-70 hover:scale-110 flex items-center justify-start"
                          aria-label="Instagram"
                          onMouseEnter={() => setHoveredIcon('instagram-alt')}
                          onMouseLeave={() => setHoveredIcon(null)}
                        >
                          <Icon icon="Icon-Social-IG" size={24} color={hoveredIcon === 'instagram-alt' ? '#D30013' : 'white'} />
                        </a>

                        {/* Row 3 */}
                        <a
                          href={socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-all duration-300 hover:opacity-70 hover:scale-110 flex items-center justify-start"
                          aria-label="LinkedIn"
                          onMouseEnter={() => setHoveredIcon('linkedin-alt')}
                          onMouseLeave={() => setHoveredIcon(null)}
                        >
                          <Icon icon="Icon-Social-LI" size={24} color={hoveredIcon === 'linkedin-alt' ? '#D30013' : 'white'} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
            </div>

          </div>
        </div>
        

        
      </div>



      {/* Bottom Section - Mobile Selector, Safeguarding & Copyright */}
      <div className="bg-[#3C3737]">
        <div className="max-w-[1120px] mx-auto px-4 py-8 md:py-10">

          {/* Mobile: School Selector */}
          <div className="block md:hidden mb-8">
            <h3 className="text-base font-bold mb-3 text-white text-left">{t.ourSchools}</h3>
            <CustomDropdown
              value={selectedOption}
              options={selectOptions}
              onChange={handleSelectChange}
              isOpen={isMobileDropdownOpen}
              setIsOpen={setIsMobileDropdownOpen}
              placeholder={t.pleaseSelect}
            />
          </div>

          {/* QR Code and Social Icons Section - Mobile Only */}
          <div className="block md:hidden mb-8">
            <div className="flex flex-col items-left text-left gap-6">
              {/* QR Code - Dynamic from API */}
              {wechatQRCode && (
                <div className="flex-shrink-0">
                  <div className=" p-1 rounded-lg">
                    <img
                      src={wechatQRCode}
                      alt="WeChat QR Code"
                      className="w-32 h-32"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Social Icons Grid */}
              <div className="w-full p-2">
                {/* Row 1: WeChat, RedNote, Youku */}
                <div className="flex items-center justify-between mb-6 w-[63%]">
                  {wechatQRCode && (
                    <button
                      onClick={() => handleOpenModal('wechat')}
                      className="transition-all duration-300 hover:opacity-70 hover:scale-110 cursor-pointer bg-transparent border-0 p-0"
                      aria-label="WeChat"
                    >
                      <Icon icon="Icon-Social-WC" size={28} color="white" />
                    </button>
                  )}
                  {redNoteQRCode && (
                    <button
                      onClick={() => handleOpenModal('rednote')}
                      className="transition-all duration-300 hover:opacity-70 hover:scale-110 cursor-pointer bg-transparent border-0 p-0"
                      aria-label="RedNote"
                    >
                      <Icon icon="Icon-Social-RedNote" size={44} color="white" />
                    </button>
                  )}
                  <a
                    href={socialLinks.youku}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-all duration-300 hover:opacity-70 hover:scale-110"
                    aria-label="Youku"
                  >
                    <Icon icon="Icon-Social-YK" size={28} color="white" />
                  </a>
                </div>

                {/* Row 2: Instagram, Facebook, YouTube, LinkedIn */}
                <div className="flex items-center justify-between w-[90%]">
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-all duration-300 hover:opacity-70 hover:scale-110"
                    aria-label="Instagram"
                  >
                    <Icon icon="Icon-Social-IG" size={28} color="white" />
                  </a>
                  <a
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-all duration-300 hover:opacity-70 hover:scale-110"
                    aria-label="Facebook"
                  >
                    <Icon icon="Icon-Social-FB" size={28} color="white" />
                  </a>
                  <a
                    href={socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-all duration-300 hover:opacity-70 hover:scale-110"
                    aria-label="YouTube"
                  >
                    <Icon icon="Icon-Social-YT" size={28} color="white" />
                  </a>
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-all duration-300 hover:opacity-70 hover:scale-110"
                    aria-label="LinkedIn"
                  >
                    <Icon icon="Icon-Social-LI" size={28} color="white" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Safeguarding Notice */}
          <div className=" text-[16px] text-left text-[#FFFFFF] mb-8">
            {safeguardingHtml ? (
              <div className="leading-relaxed flex">
                <strong className="text-white font-bold">{t.safeguardingTitle}</strong>{' '}
              &nbsp;
                <span
                  className='font-light'
                  dangerouslySetInnerHTML={{ __html: safeguardingHtml }}
                />
              </div>
            ) : (
              <p className="leading-relaxed md:flex">
                <strong className="text-white font-bold">{t.safeguardingTitle}</strong>{' '}
                &nbsp;
                <span className='font-light md:flex'>
                  {t.safeguardingText}{' '}
                  &nbsp;
                  <a
                    href="/our-college/safeguarding"
                    className="text-white text-[14px] underline hover:text-[#d30014] transition-colors duration-200"
                  >
                    
                    {t.safeguardingLink}
                  </a>
                  &nbsp;
                  {' '}{t.safeguardingSuffix}
                </span>
              </p>
            )}
          </div>

          {/* Tree-Nation Widget */}
          {TREE_NATION_CONFIG[currentSchoolSlug] && (
            <div className="flex justify-center">
              <div
                id={TREE_NATION_CONFIG[currentSchoolSlug].elementId}
                // style={{ minHeight: '60px', display: 'block' }}
              ></div>
            </div>
          )}

          {/* Copyright and EiM Logo */}
          <div className="pt-0 border-t border-[#4a4545] mb-[100px] mt-[50px] md:mb-0">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mt-[20px]">
              {/* Copyright - Left */}
              <a
                href='https://beian.miit.gov.cn/#/Integrated/index'
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14px] hover:opacity-80 transition-opacity duration-200 text-[#FDFCF8]"
              >
                <p className="text-[14px] text-[#FDFCF8] hover:text-gray-300 text-left leading-relaxed transition-colors duration-200">
                  © 2026 Dulwich College Management International Limited, or its affiliates
                  <br className="md:hidden" />
                  <span className="hidden md:inline"> · </span>
                  沪ICP备16016470号-4 · 沪公网安备31010602002392号
                </p>
              </a>
            </div>
          
          </div>

        </div>

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
            className={`relative bg-white rounded-lg p-0 max-w-[90vw] md:max-w-md transform transition-all duration-300 ${
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
            <div className="p-8 md:p-12">
              <img
                src={activeModal === 'wechat' ? wechatQRCode : redNoteQRCode}
                alt={activeModal === 'wechat' ? 'WeChat QR Code' : 'RedNote QR Code'}
                className="w-full h-auto"
                style={{
                  animation: isModalClosing
                    ? 'fadeOut 0.2s ease-out'
                    : 'fadeIn 0.4s ease-out 0.1s backwards'
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
    </footer>
  );
}

export default PageFooter;
