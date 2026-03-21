import React, { useState, useEffect } from 'react';
import { getCurrentSchool, isSchoolSite } from '../utils/schoolDetection';
import { useLocation } from 'react-router-dom';
import SchoolPageHeader from '../components/layout/school/PageHeader';
import SchoolPageFooter from '../components/layout/school/PageFooter';
import InternationalPageHeader from '../components/layout/PageHeader';
import InternationalPageFooter from '../components/layout/PageFooter';
import icoStar2 from '../assets/images/ico-star2.svg';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://cms.dulwich.org';

// Recursive component to render nested menu items
const MenuItem = ({ item, level = 0 }) => {
  const hasChildren = item.items && item.items.length > 0;

  // Extract slug from URL or use slug property
  const getSlug = (item) => {
    if (item.slug) return item.slug;
    if (item.url && item.url !== '#') {
      // Remove common base URLs to get the relative path
      return item.url
        .replace(`${API_BASE_URL}/`, '')
        .replace(/https:\/\/[^.]+\.dulwich-frontend\.atalent\.xyz\//, '')
        .replace(/https:\/\/[^.]+\.dulwich\.atalent\.xyz\//, '');
    }
    return '#';
  };

  // Check if URL is external (full URL that wasn't converted to slug)
  const isExternalUrl = (url) => {
    return url && (url.startsWith('http://') || url.startsWith('https://'));
  };

  const slug = getSlug(item);
  const displayName = item.title || item.menu_name;
  const isClickable = slug && slug !== '#';

  // Determine the final href - use external URL as-is, or prepend / for internal slugs
  const href = isExternalUrl(slug) ? slug : `/${slug}`;

  // Visual hierarchy: different indentation and styling per level
  const indentClass = level === 0 ? '' : level === 1 ? 'ml-3' : level === 2 ? 'ml-6' : 'ml-9';
  const bulletStyle = level === 0 ? '' : level === 1 ? '•' : level === 2 ? '◦' : '▪';
  const textSize = level === 0 ? 'text-base' : level === 1 ? 'text-sm' : 'text-xs';
  const fontWeight = level === 0 ? 'font-semibold' : level === 1 ? 'font-medium' : 'font-normal';

  return (
    <li className={indentClass}>
      {isClickable ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-[#3C3737] hover:text-[#D30013] hover:underline transition-all duration-200 block ${textSize} ${fontWeight} ${level > 0 ? 'py-0.5' : 'py-1'}`}
        >
          {level > 0 && <span className="mr-2 text-gray-400">{bulletStyle}</span>}
          {displayName}
        </a>
      ) : (
        <span
          className={`text-[#9e1422] block font-extrabold ${textSize} ${level > 0 ? 'py-0.5' : 'py-3'}`}
        >
          {level > 0 && <span className="mr-2 text-[#3C3737] font-light">{bulletStyle}</span>}
          {displayName}
        </span>
      )}

      {hasChildren && (
        <ul className={`${level === 0 ? 'mt-1 mb-2 space-y-0.5' : 'mt-0.5 space-y-0.5'}`}>
          {item.items.map((child) => (
            <MenuItem key={child.id} item={child}  />
          ))}
        </ul>
      )}
    </li>
  );
};

function SitemapPage() {
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchool, setSelectedSchool] = useState('Dulwich International College');
  const [selectedSchoolSlug, setSelectedSchoolSlug] = useState('international');
  const [availableSchools, setAvailableSchools] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const location = useLocation();

  // Determine if this is a school site or international site
  const isSchool = isSchoolSite();
  const detectedSchool = getCurrentSchool();

  // Use 'international' as fallback if no school detected
  const currentSchool = detectedSchool || 'international';

  // Determine locale based on URL path
  const isChineseVersion = location.pathname.startsWith('/zh/') || location.pathname === '/zh';
  const locale = isChineseVersion ? 'zh' : 'en';

  // Select appropriate header and footer components
  const PageHeader = isSchool ? SchoolPageHeader : InternationalPageHeader;
  const PageFooter = isSchool ? SchoolPageFooter : InternationalPageFooter;

  // Fetch available schools
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const baseUrl = process.env.REACT_APP_API_URL || 'https://cms.dulwich.org';
        const res = await fetch(`${baseUrl}/api/schools`);
        if (!res.ok) return;
        const data = await res.json();
        const list = data.data || data.schools || data;
        if (Array.isArray(list)) {
          const processed = [];
          if (!list.some(s => s.slug === 'international')) {
            processed.push({ id: -1, title: 'International', slug: 'international', url: window.location.origin });
          }
          list.forEach(s => {
            processed.push(s.slug === 'international' ? { ...s, title: 'International' } : s);
          });
          setAvailableSchools(processed);
        }
      } catch { /* silent */ }
    };
    fetchSchools();
  }, []);

  useEffect(() => {
    const fetchSitemapData = async () => {
      try {
        setLoading(true);

        // Build API URL - for international site (no school detected), don't pass school parameter
        let apiUrl = `${API_BASE_URL}/api/mainmenu`;

        if (isSchool && detectedSchool) {
          // School site - pass school parameter
          apiUrl += `?school=${detectedSchool}-cms&locale=${locale}`;
        } else {
          // International site - only pass locale
          apiUrl += `?locale=${locale}`;
        }

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.success && data.data) {
          // Remove duplicate menu sections (API returns same sections twice with different formats)
          const uniqueSections = [];
          const seenIds = new Set();

          // Recursive function to normalize items at all levels
          const normalizeItem = (item) => {
            const normalized = {
              id: item.id,
              title: item.title || item.menu_name,
              slug: item.slug || (item.url && item.url !== '#' ? item.url.replace(`${API_BASE_URL}/`, '') : null),
              url: item.url,
              menu_name: item.menu_name,
              items: []
            };

            // Recursively normalize child items
            if (item.items && item.items.length > 0) {
              normalized.items = item.items.map(child => normalizeItem(child));
            }

            return normalized;
          };

          data.data.forEach(section => {
            // Skip if we've already seen this section ID
            if (seenIds.has(section.id)) return;
            seenIds.add(section.id);

            // Normalize the entire section tree
            const normalizedSection = normalizeItem(section);
            uniqueSections.push(normalizedSection);
          });

          setMenuData(uniqueSections);
        }
      } catch (error) {
        console.error('Error fetching sitemap data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSitemapData();
  }, [isSchool, detectedSchool, locale]);

  return (
    <div className="page-wrapper">
      <PageHeader
        selectedSchool={selectedSchool}
        availableSchools={availableSchools}
        setSelectedSchool={setSelectedSchool}
        setSelectedSchoolSlug={setSelectedSchoolSlug}
        setChatOpen={setChatOpen}
        chatOpen={chatOpen}
      />

      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-white pt-32">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D30013]"></div>
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <div
            className="bg-[#9E1422] pt-[78px] lg:pt-[160px] pb-4 md:pb-6 px-4 md:px-6 relative overflow-hidden"
            style={{
              backgroundImage: `url(${icoStar2})`,
              backgroundRepeat: 'repeat',
              backgroundPosition: 'right center',
              backgroundSize: '50% 100%'
            }}
          >
            <div className="max-w-[1120px] mx-auto px-6 relative z-10">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white text-left">
                {isChineseVersion ? '网站地图' : 'Sitemap'}
              </h1>
              <p className="text-red-200 mt-3 text-sm text-left">
                {isChineseVersion ? '浏览我们网站的所有页面' : 'Browse all pages on our website'}
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white py-5 lg:py-16 px-8 sm:px-8">
            <div className="max-w-[1200px] mx-auto">
              {/* Menu Grid - 3 Columns for better readability with nested items */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12 px-5">
                {menuData.map((section) => (
                  <div key={section.id} className="text-left">
                    {/* Section Title */}
                    <h2 className="text-xl font-bold text-[#3C3737] mb-4 pb-2 border-b-4 border-[#D30013]">
                      {section.menu_name || section.title}
                    </h2>

                    {/* Section Items - Recursive rendering */}
                    {section.items && section.items.length > 0 ? (
                      <ul className="space-y-2">
                        {section.items.map((item) => (
                          <MenuItem key={item.id} item={item} level={0} />
                        ))}
                      </ul>
                    ) : (
                      section.url && section.url !== '#' && (() => {
                        // Check if section URL is external
                        const isExternal = section.url.startsWith('http://') || section.url.startsWith('https://');
                        const sectionHref = isExternal ? section.url : `/${section.url}`;
                        return (
                          <a
                            href={sectionHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-base text-[#3C3737] hover:text-[#D30013] transition-colors duration-200 block"
                          >
                            {isChineseVersion ? '访问' : 'Visit'}
                          </a>
                        );
                      })()
                    )}
                  </div>
                ))}
              </div>

              {/* Back to Home Link */}
              <div className="mt-16 text-center">
                <a
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-[#9E1422] text-[#9E1422] rounded-lg font-semibold hover:bg-[#9E1422] hover:text-white transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  {isChineseVersion ? '返回首页' : 'Back to Home'}
                </a>
              </div>
            </div>
          </div>
        </>
      )}

      <PageFooter
        selectedSchool={selectedSchool}
        availableSchools={availableSchools}
        setSelectedSchool={setSelectedSchool}
        setSelectedSchoolSlug={setSelectedSchoolSlug}
      />
    </div>
  );
}

export default SitemapPage;
