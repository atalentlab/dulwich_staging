import React, { useState, useEffect } from 'react';
import Icon from '../components/Icon';
import schoolsDataJson from '../data/schoolsData.json';
import useSEO from '../hooks/useSEO';
// Import local school images
import beijingImg from '../assets/schoollist/puxi.jpg';
import pudongImg from '../assets/schoollist/puxi.jpg';
import puxiImg from '../assets/schoollist/puxi.jpg';
import suzhouImg from '../assets/schoollist/suzhou.jpeg';
import singaporeImg from '../assets/schoollist/singapore.png';
import seoulImg from '../assets/schoollist/seoul.jpeg';
import bangkokImg from '../assets/schoollist/bangkok.jpeg';
import hsSuzhouImg from '../assets/schoollist/hs-suzhou.jpeg';
import hsHengqinImg from '../assets/schoollist/hs-hengqin.jpg';
import ssDehongImg from '../assets/schoollist/ss-dehong.webp';
import ssBeijingImg from '../assets/schoollist/ss-beijing.jpeg';
import ssXianImg from '../assets/schoollist/ss-xian.webp';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://www.dulwich.atalent.xyz';

// Static CTAs for each school
const SCHOOL_CTAS = {
  'Dulwich College Bangkok': [
    { label: 'Visit Website', url: 'https://bangkok.dulwich-prod.atalent.xyz/' }
  ],
  'Dulwich College Beijing': [
    { label: 'Visit Website', url: 'https://beijing.dulwich-prod.atalent.xyz/' }
  ],
  'Dulwich College Shanghai Pudong': [
    { label: 'Visit Website', url: 'https://shanghai-pudong.dulwich-prod.atalent.xyz/' }
  ],
  'Dulwich College Shanghai Puxi': [
    { label: 'Visit Website', url: 'https://shanghai-puxi.dulwich-prod.atalent.xyz/' }
  ],
  'Dulwich College Suzhou': [
    { label: 'Visit Website', url: 'https://suzhou.dulwich-prod.atalent.xyz/' }
  ],
  'Dulwich College (Singapore)': [
    { label: 'Visit Website', url: 'https://singapore.dulwich-prod.atalent.xyz/' }
  ],
  'Dulwich College Seoul': [
    { label: 'Visit Website', url: 'https://seoul.dulwich-prod.atalent.xyz/' }
  ],
  'Dulwich International High School Programme Suzhou': [
    { label: 'Visit Website', url: 'https://suzhou-high-school.dulwich-prod.atalent.xyz/' }
  ],
  'Dulwich International High School Programme Hengqin': [
    { label: 'Visit Website', url: 'https://hengqin-high-school.dulwich-prod.atalent.xyz/' }
  ],
  // Chinese names
  '曼谷德威学院': [
    { label: '访问网站', url: 'https://bangkok.dulwich-prod.atalent.xyz/' }
  ],
  '北京德威学院': [
    { label: '访问网站', url: 'https://beijing.dulwich-prod.atalent.xyz/' }
  ],
  '北京德威英国国际学校': [
    { label: '访问网站', url: 'https://beijing.dulwich-prod.atalent.xyz/' }
  ],
  '上海浦东德威国际学校': [
    { label: '访问网站', url: 'https://shanghai-pudong.dulwich-prod.atalent.xyz/' }
  ],
  '上海浦东德威英国国际学校': [
    { label: '访问网站', url: 'https://shanghai-pudong.dulwich-prod.atalent.xyz/' }
  ],
  '上海浦西德威国际学校': [
    { label: '访问网站', url: 'https://shanghai-puxi.dulwich-prod.atalent.xyz/' }
  ],
  '苏州德威国际学校': [
    { label: '访问网站', url: 'https://suzhou.dulwich-prod.atalent.xyz/' }
  ],
  '苏州德威学院': [
    { label: '访问网站', url: 'https://suzhou.dulwich-prod.atalent.xyz/' }
  ],
  '德威学院（新加坡）': [
    { label: '访问网站', url: 'https://singapore.dulwich-prod.atalent.xyz/' }
  ],
  '德威学院首尔分校': [
    { label: '访问网站', url: 'https://seoul.dulwich-prod.atalent.xyz/' }
  ],
  '苏州德威国际高中课程': [
    { label: '访问网站', url: 'https://suzhou-high-school.dulwich-prod.atalent.xyz/' }
  ],
  '德威国际高中课程横琴分校': [
    { label: '访问网站', url: 'https://hengqin-high-school.dulwich-prod.atalent.xyz/' }
  ],
};

/**
 * School Listing List Page
 * Static grid layout with filters - fully static data
 */
export default function SchoolListingListPage({ title = 'Find Your School' }) {
  const isZh = typeof window !== 'undefined' && window.location.pathname.startsWith('/zh');
  const locale = isZh ? 'zh' : 'en';
  const localeData = isZh ? schoolsDataJson.zh.listing : schoolsDataJson.listing;
  const staticSchools = localeData.items;

  // State for dynamic schools from API
  const [dynamicSchools, setDynamicSchools] = useState([]);
  const [isLoadingSchools, setIsLoadingSchools] = useState(false);
  const [allSchools, setAllSchools] = useState(staticSchools);

  // Map school names to local images
  const schoolImageMap = {
    'Dulwich College Beijing': beijingImg,
    '北京德威学院': beijingImg,
    '北京德威英国国际学校': beijingImg,
    'Dulwich College Shanghai Pudong': pudongImg,
    '上海浦东德威国际学校': pudongImg,
    '上海浦东德威英国国际学校': pudongImg,
    'Dulwich College Shanghai Puxi': puxiImg,
    '上海浦西德威国际学校': puxiImg,
    'Dulwich College Suzhou': suzhouImg,
    '苏州德威国际学校': suzhouImg,
    '苏州德威学院': suzhouImg,
    'Dulwich College (Singapore)': singaporeImg,
    '德威学院（新加坡）': singaporeImg,
    'Dulwich College Seoul': seoulImg,
    '德威学院首尔分校': seoulImg,
    'Dulwich College Bangkok': bangkokImg,
    '曼谷德威学院': bangkokImg,
    'Dulwich International High School Programme Suzhou': hsSuzhouImg,
    '苏州德威国际高中课程': hsSuzhouImg,
    'Dulwich International High School Programme Hengqin': hsHengqinImg,
    '德威国际高中课程横琴分校': hsHengqinImg,
    'Dehong Shanghai International School': ssDehongImg,
    '上海德宏国际中文学校': ssDehongImg,
    'Dehong Beijing International School': ssBeijingImg,
    '北京德宏国际中文学校': ssBeijingImg,
    "Dehong Xi'an School": ssXianImg,
    '西安德宏学校': ssXianImg,
    '德宏西安学校': ssXianImg
  };

  // Helper function to get local image for a school
  const getSchoolImage = (school) => {
    if (!school.name) return null;

    // Try local image map first
    const localImage = schoolImageMap[school.name];
    if (localImage) return localImage;

    // Use API image URL if available
    if (school.image_url) {
      // If it's a relative path, prepend base URL
      if (school.image_url.startsWith('http')) {
        return school.image_url;
      }
      return `${API_BASE_URL}/${school.image_url}`;
    }

    return null;
  };

  // SEO Meta Tags
  useSEO({
    meta_title: isZh ? '寻找学校 | 德威国际学校' : 'Find a School | Dulwich International Schools',
    meta_description: isZh
      ? '探索亚洲12所德威国际学校。我们提供英国课程、IGCSE和IB文凭课程，为K-12学生提供全球视野的教育。'
      : 'Explore 12 Dulwich International Schools across Asia. We offer British curriculum, IGCSE and IB Diploma for K-12 students with a global perspective.',
    meta_keywords: 'international school, British curriculum, IGCSE, IB Diploma, K-12 education, Asia, Dulwich',
    og_image: 'https://dulwich-azure-prod.oss-cn-shanghai.aliyuncs.com/pages/dcsg-holistic-education.jpg'
  });

  // i18n labels - Define before using in useEffect
  const t = isZh ? {
    headerSubtext: '亚洲12所国际学校',
    headerTitle: '英国课程。全球视野。',
    headerTitlesub: '提供英国国家课程、IGCSE和IB文凭的K-12学校',
    cardHeading: '国际学校',
    statsLabels: ['国家', '学生', '成立于'],
    allLocations: '所有地区',
    allAges: '所有年龄',
    allTypes: '所有类型',
    showing: '显示',
    schools: '所学校',
    clearFilters: '清除筛选',
    noSchools: '未找到符合条件的学校',
    students: '学生',
    ages: '年龄',
    established: '成立于',
    typeInternationalSchools: '国际学校',
    typeHighSchoolProgrammes: '国际高中课程',
    typeSisterSchools: '姊妹学校',
  } : {
    headerSubtext: '12 INTERNATIONAL SCHOOLS ACROSS ASIA',
    headerTitle: 'British curriculum. Global perspective.',
    headerTitlesub: 'K-12 Schools offering English National Curriculum, IGCSE and IB Diploma',
    cardHeading: 'International Schools',
    statsLabels: ['COUNTRIES', 'STUDENTS', 'SINCE'],
    allLocations: 'All Locations',
    allAges: 'All Ages',
    allTypes: 'All Types',
    showing: 'Showing',
    schools: 'Schools',
    clearFilters: 'Clear all filters',
    noSchools: 'No schools found matching your filters',
    students: 'Students',
    ages: 'Ages',
    established: 'Established',
    typeInternationalSchools: 'International Schools',
    typeHighSchoolProgrammes: 'Int. High School Programmes',
    typeSisterSchools: 'Sister Schools',
  };

  // Filter states
  const [selectedLocation, setSelectedLocation] = useState(t.allLocations);
  const [selectedAge, setSelectedAge] = useState(t.allAges);
  const [selectedType, setSelectedType] = useState(t.allTypes);

  // Dropdown open states
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isAgeOpen, setIsAgeOpen] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);

  // Function to map API type values to display text
  const mapTypeToDisplay = (apiType) => {
    if (!apiType) return null;

    const typeMapping = {
      'College': isZh ? '国际学校' : 'International Schools',
      'International College': isZh ? '国际学校' : 'International Schools',
      'High School': isZh ? '国际高中课程' : 'Int. High School Programmes',
      'International High School': isZh ? '国际高中课程' : 'Int. High School Programmes',
      'Sister Schools': isZh ? '姊妹学校' : 'Sister Schools',
      // Chinese variants
      '国际学院': isZh ? '国际学校' : 'International Schools',
      '国际高中': isZh ? '国际高中课程' : 'Int. High School Programmes',
      '姊妹学校': isZh ? '姊妹学校' : 'Sister Schools',
    };

    return typeMapping[apiType] || apiType;
  };

  // Fetch schools from API
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setIsLoadingSchools(true);

        // Build query parameters - only locale, no filters
        // Filtering will be done on the frontend
        const params = new URLSearchParams();
        params.append('locale', locale);

        const response = await fetch(`${API_BASE_URL}/api/all_schools?${params.toString()}`);
        const data = await response.json();

        if (data.success && data.data) {
          // Transform API data to match our format
          const transformedSchools = data.data.map(school => {
            const schoolName = school.title || school.name;

            // Create dynamic CTA from API URL with localized label
            let ctas = [];
            if (school.url) {
              ctas = [{
                label: isZh ? '访问网站' : 'Visit Website',
                url: school.url
              }];
            } else {
              // Fallback to static mapping if no URL in API
              ctas = SCHOOL_CTAS[schoolName] || [];
            }

            return {
              name: schoolName,
              location: school.location,
              students: school.students_count || school.students,
              ages: school.ages,
              established: school.established,
              type: mapTypeToDisplay(school.type),
              image_url: school.image_url,
              ctas: ctas,
              tags: school.tags || [],
              content: school.content || school.description,
            };
          });

          setDynamicSchools(transformedSchools);
        }
      } catch (error) {
        console.error('Error fetching schools:', error);
        setDynamicSchools([]);
      } finally {
        setIsLoadingSchools(false);
      }
    };

    fetchSchools();
  }, [locale]);

  // Merge dynamic and static schools
  useEffect(() => {
    // Separate schools by section
    const internationalSchoolsHeading = staticSchools.find(s => s.heading && (
      s.heading.includes('International Schools') ||
      s.heading.includes('国际学校')
    ));

    const highSchoolsHeading = staticSchools.find(s => s.heading && (
      s.heading.includes('High School') ||
      s.heading.includes('国际高中')
    ));

    // Get static schools that are not in dynamic sections
    const otherStaticSchools = staticSchools.filter(s => {
      if (s.heading) return true; // Keep all headings
      // Filter out schools that should be dynamic (International Schools and Int. High School Programmes)
      return !s.type || (
        s.type !== 'International Schools' &&
        s.type !== '国际学校' &&
        s.type !== 'Int. High School Programmes' &&
        s.type !== '国际高中课程'
      );
    });

    // Combine: dynamic schools + other static schools
    const merged = [];

    // Add International Schools heading if exists
    if (internationalSchoolsHeading) {
      merged.push(internationalSchoolsHeading);
    }

    // Add dynamic International College schools
    const collegeSchools = dynamicSchools.filter(s =>
      s.type && (s.type === 'International Schools' || s.type === '国际学校')
    );
    merged.push(...collegeSchools);

    // Add High Schools heading if exists
    if (highSchoolsHeading) {
      merged.push(highSchoolsHeading);
    }

    // Add dynamic High School schools
    const highSchools = dynamicSchools.filter(s =>
      s.type && (s.type === 'Int. High School Programmes' || s.type === '国际高中课程')
    );
    merged.push(...highSchools);

    // Add remaining static content (other sections)
    const otherSections = otherStaticSchools.filter(s =>
      !s.heading ||
      (!s.heading.includes('International Schools') &&
       !s.heading.includes('国际学校') &&
       !s.heading.includes('High School') &&
       !s.heading.includes('国际高中'))
    );
    merged.push(...otherSections);

    setAllSchools(merged);
  }, [dynamicSchools, staticSchools]);

  // Static content
  const headerSubtext = t.headerSubtext;
  const headerTitle = t.headerTitle;
  const headerTitlesub = t.headerTitlesub;
  const cardHeading = t.cardHeading;
  const headerStats = [
    { value: 7, label: t.statsLabels[0], prefix: '', suffix: '' },
    { value: 9000, label: t.statsLabels[1], prefix: '+', suffix: '' },
    { value: 2003, label: t.statsLabels[2], prefix: '', suffix: '' }
  ];

  // Extract unique filter options from data
  const locations = [t.allLocations, ...new Set(allSchools.filter(s => !s.heading).map(s => s.location).filter(Boolean))];
  const ages = [t.allAges, ...new Set(allSchools.filter(s => !s.heading).map(s => s.ages).filter(Boolean))];

  // Static types - always show all three categories
  const types = [
    t.allTypes,
    t.typeInternationalSchools,
    t.typeHighSchoolProgrammes,
    t.typeSisterSchools
  ];

  // Check if any filters are active
  const hasActiveFilters = selectedLocation !== t.allLocations ||
                           selectedAge !== t.allAges ||
                           selectedType !== t.allTypes;

  // Filter schools based on selected filters
  const filteredSchools = allSchools.filter(school => {
    // Hide heading items when filters are active
    if (hasActiveFilters && school.heading) {
      return false;
    }

    const matchesLocation = selectedLocation === t.allLocations || school.location === selectedLocation;
    const matchesAge = selectedAge === t.allAges || school.ages === selectedAge;
    const matchesType = selectedType === t.allTypes || school.type === selectedType;
    return matchesLocation && matchesAge && matchesType;
  });

  // Calculate actual school count (excluding headings)
  const schoolCount = filteredSchools.filter(school => !school.heading).length;

  // Clear all filters
  const clearFilters = () => {
    setSelectedLocation(t.allLocations);
    setSelectedAge(t.allAges);
    setSelectedType(t.allTypes);
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
          className="w-full px-4 py-3 bg-[#FFFFFF] border border-[#EBE4DD] rounded-lg text-left flex items-center justify-between hover:border-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-[#D30013] focus:border-transparent"
          style={{ willChange: 'auto' }}
        >
          <span className="text-[#3C3C3B]">{value}</span>
          <Icon icon="Icon-Chevron-small" size={20} color="#D30013" className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
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

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pb-4 px-4">
        <div className="max-w-[1120px] mx-auto">
        <h1
          className="font-['Figtree'] text-4xl md:text-5xl font-bold lg:text-[50px] mb-12 text-left text-[#9E1422] transition-all duration-500"
          style={{ animation: 'fadeInUp 0.6s ease-out both' }}
        >
          {title}
        </h1>

        {/* Header Subtext */}
        {/* <p
          className="text-xs font-bold text-[#3C3C3B] tracking-wider mb-4 text-left transition-all duration-500"
          style={{ animation: 'fadeInUp 0.6s ease-out 0.1s both' }}
        >
          {headerSubtext}
        </p> */}

        {/* Main Title */}
        {/* <h2
          className="font-['Figtree'] text-4xl md:text-5xl font-extrabold lg:text-[50px] mb-16 text-left text-[#3C3737] transition-all duration-500"
          style={{ animation: 'fadeInUp 0.6s ease-out 0.2s both' }}
        >
          {headerTitle}
        </h2> */}

      
          

          {/* Stats Boxes - With counter animation */}
          {/* <div className="flex flex-wrap gap-4 mb-12">
            {headerStats.map((stat, index) => (
              <div
                key={index}
                className="bg-[#FAF7F5] border border-[#F2EDE9] rounded-3xl px-8 py-6 min-w-[140px] transition-all duration-300 hover:shadow-md hover:scale-105"
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                }}
              >
                <div className="font-['Figtree'] text-4xl font-bold text-[#9E1422] mb-1">
                  <CountUp
                    start={0}
                    end={stat.value}
                    duration={4}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    separator=""
                    useEasing={true}
                    easingFn={(t, b, c, d) => {
                      // easeOutQuart for smooth deceleration
                      return -c * ((t = t / d - 1) * t * t * t - 1) + b;
                    }}
                    enableScrollSpy
                    scrollSpyOnce
                  />
                </div>
                <div className="font-['Figtree'] text-xs font-semibold text-[#3C3C3B] tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div> */}

          {/* Filters Section */}
          <div className="bg-[#FAF7F5] border border-[#F2EDE9] rounded-lg p-8 transition-all duration-300">
            {/* Filter Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {/* Location Filter */}
              <CustomDropdown
                value={selectedLocation}
                options={locations}
                onChange={setSelectedLocation}
                isOpen={isLocationOpen}
                setIsOpen={(value) => {
                  setIsLocationOpen(value);
                  if (value) {
                    setIsAgeOpen(false);
                    setIsTypeOpen(false);
                  }
                }}
                placeholder="All Locations"
              />

              {/* Age Filter */}
              <CustomDropdown
                value={selectedAge}
                options={ages}
                onChange={setSelectedAge}
                isOpen={isAgeOpen}
                setIsOpen={(value) => {
                  setIsAgeOpen(value);
                  if (value) {
                    setIsLocationOpen(false);
                    setIsTypeOpen(false);
                  }
                }}
                placeholder="All Ages"
              />

              {/* Type Filter */}
              <CustomDropdown
                value={selectedType}
                options={types}
                onChange={setSelectedType}
                isOpen={isTypeOpen}
                setIsOpen={(value) => {
                  setIsTypeOpen(value);
                  if (value) {
                    setIsLocationOpen(false);
                    setIsAgeOpen(false);
                  }
                }}
                placeholder="All Types"
              />
            </div>

            {/* Results Count and Clear Filters */}
            <div className="flex items-center justify-between">
              <p className="text-[16px] text-[#3C3C3B] font-medium">
                {t.showing} <span className="font-bold">{schoolCount} {t.schools}</span>
              </p>
              <button
                onClick={clearFilters}
                className="text-[#D30013] text-[16px] font-semibold hover:underline transition-all">
                {t.clearFilters}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Schools Grid Section */}
      <section className="px-4 mb-12 bg-[#fff] py-12">

        <div className="max-w-[1120px] mx-auto">
        {!hasActiveFilters && (
          <>
            <h1 className="font-['Figtree'] text-4xl md:text-5xl font-extrabold lg:text-[50px] mb-6 mt-2 text-left text-[#3C3737]">
              {cardHeading}
            </h1>
            {/* Header Title Subtitle */}
            <p className="text-[16px] font-medium text-[#3C3C3B] mb-12 text-left transition-all duration-500">
              {headerTitlesub}
            </p>
          </>
        )}

          {/* Loading State */}
          {isLoadingSchools ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D30013]"></div>
            </div>
          ) : schoolCount === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-500">{t.noSchools}</p>
              <button
                onClick={clearFilters}
                className="mt-4 text-[#D30013] font-semibold hover:underline"
              >
                {t.clearFilters}
              </button>
            </div>
          ) : (
            <>
              {(() => {
                const sections = [];
                let currentSection = [];

                filteredSchools.forEach((school, index) => {
                  if (school.heading) {
                    // Push previous section if it has schools
                    if (currentSection.length > 0) {
                      sections.push({ type: 'schools', items: currentSection });
                      currentSection = [];
                    }
                    // Add heading section
                    sections.push({ type: 'heading', data: school, index });
                  } else {
                    currentSection.push({ ...school, originalIndex: index });
                  }
                });

                // Push last section
                if (currentSection.length > 0) {
                  sections.push({ type: 'schools', items: currentSection });
                }

                return sections.map((section, sectionIdx) => {
                  if (section.type === 'heading') {
                    return (
                      <div key={`heading-${sectionIdx}`} className="pt-12 pb-8">
                        <h2 className="font-['Figtree'] text-3xl md:text-[3rem] font-extrabold mb-4 text-left text-[#3C3737]">
                          {section.data.heading}
                        </h2>
                        {section.data.subHeading && (
                          <p className="text-[16px] mt-8 mb-4 text-left text-[#3C3C3B] font-medium">
                            {section.data.subHeading}
                          </p>
                        )}
                      </div>
                    );
                  }

                  return (
                    <div key={`section-${sectionIdx}`} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                      {section.items.map((school, idx) => (
                        <div
                          key={idx}
                          className="bg-white rounded-lg overflow-hidden border border-[#F2EDE9] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
                          style={{
                            animation: `0.5s ease-out ${school.originalIndex * 0.05}s both`
                          }}
                        >
                            {/* School Image */}
                          {getSchoolImage(school) && (
                            <div className="w-full overflow-hidden" style={{ height: '192px' }}>
                              <img
                                src={getSchoolImage(school)}
                                alt={school.name}
                                className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-500"
                                onError={(e) => {
                                  e.target.src = '';
                                }}
                              />
                            </div>
                          )}

                          {/* Content */}
                          <div className="px-6 py-4 flex flex-col flex-grow">
                            {/* School Name */}
                            <h6 className="text-xl font-bold text-[#3C3737] mb-3 text-left">
                              {school.name}
                            </h6>

                            {/* Info Items */}
                            <div className="space-y-2 mb-2 flex-grow">
                              {/* District */}
                              {school.location && (
                                <div className="flex items-center gap-2 text-[#3C3C3B]">
                                  <Icon icon="Icon-Pin" size={22} color="#3C3737" className="flex-shrink-0" />
                                  <span className="text-sm font-medium">{school.location}</span>
                                </div>
                              )}

                              {/* Students */}
                              {school.students && (
                                <div className="flex items-center gap-2 text-[#3C3C3B]">
                                  <Icon icon="Icon-Profile_Add" size={22} color="#3C3737" className="flex-shrink-0" />
                                  <span className="text-sm font-medium">{school.students.toLocaleString()} {t.students}</span>
                                </div>
                              )}

                              {/* Age Range */}
                              {school.ages && (
                                <div className="flex items-center gap-2 text-[#3C3C3B]">
                                  <Icon icon="Age-Range" size={22} color="#3C3737" className="flex-shrink-0" />
                                  <span className="text-sm font-medium">{t.ages} {school.ages}</span>
                                </div>
                              )}

                              {/* Established Year */}
                              {school.established && (
                                <div className="flex items-center gap-2 text-[#3C3C3B]">
                                  <Icon icon="Icon-Schools" size={22} color="#3C3737" className="flex-shrink-0" />
                                  <span className="text-sm font-medium">{t.established} {school.established}</span>
                                </div>
                              )}

                              {/* Tags */}
                              {/* {school.tags && school.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2 py-2">
                                  {school.tags.map((tag, tagIndex) => (
                                    <span
                                      key={tagIndex}
                                      className="px-2 py-0.5 bg-[#F2EDE9] border border-[#F2EDE9] rounded text-xs font-medium text-[#3C3C3B]"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )} */}

                              {/* Content/Description
                              {school.content && (
                                <p className="text-[#3C3C3B] text-sm font-medium text-left mt-3 leading">
                                  {school.content}
                                </p>
                              )} */}
                            </div>

                  
                          </div>
                          <div className='px-6 py-4 h-[80px] bottom border-t bottom-[#F2EDE9]'>
                              {/* CTA Buttons */}
                              {school.ctas && school.ctas.length > 0 && (
                              <div className="flex gap-3 mt-auto">
                                {school.ctas.map((cta, ctaIndex) => (
                                  <a
                                    key={ctaIndex}
                                    href={cta.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 text-center bg-[#D30013] hover:bg-[#B8000F] text-[16px] text-white font-semibold px-4 py-3 rounded-lg transition-all duration-300"
                                  >
                                    {cta.label}
                                  </a>
                                ))}
                              </div>
                            )}
                      </div>
                        </div>
                      ))}
                    </div>
                  );
                });
              })()}
            </>
          )}
        </div>
      </section>

      {/* Dropdown Styles */}
      <style>{`
        /* Smooth fade-in animation (no counting) */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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
    </div>
  );
}
