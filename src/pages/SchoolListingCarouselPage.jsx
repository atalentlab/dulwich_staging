import React, { useState, useRef, useEffect } from 'react';
import Icon from '../components/Icon';
import schoolsDataJson from '../data/schoolsData.json';

// Import local school images
import beijingImg from '../assets/schoollist/beijing.jpg';
import pudongImg from '../assets/schoollist/pudong.jpg';
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

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://cms.dulwich.org';

// Static tags per school (mirrors SCHOOL_CTAS pattern)
const jsontag = {
  // International schools
  'Dulwich College Bangkok': ['IGCSE'],
  'Dulwich College Beijing': ['IGCSE', 'IB Diploma'],
  'Dulwich College Shanghai Pudong': ['IGCSE', 'IB Diploma'],
  'Dulwich College Shanghai Puxi': ['IGCSE', 'IB Diploma'],
  'Dulwich College Suzhou': ['IGCSE', 'IB Diploma'],
  'Dulwich College (Singapore)': ['IGCSE', 'IB Diploma'],
  'Dulwich College Seoul': ['IGCSE', 'IB Diploma'],

  // High School programmes
  'Dulwich International High School Programme Suzhou': ['IGCSE', 'A Level'],
  'Dulwich Int. High School Programme Suzhou': ['IGCSE', 'A Level'],
  'Dulwich International High School Programme Hengqin': ['Pre-A Level', 'A Level'],
  'Dulwich Int. High School Programme Hengqin': ['Pre-A Level', 'A Level'],

  // Chinese names
  '曼谷德威学院': ['IGCSE', 'IB课程'],
  '北京德威学院': ['IGCSE'],
  '北京德威英国国际学校': ['IGCSE'],
  '上海浦东德威国际学校': ['IGCSE', 'IB课程'],
  '上海浦东德威英国国际学校': ['IGCSE', 'IB课程'],
  '上海德威外籍人员子女学校（浦东）': ['IGCSE', 'IB课程'],
  '上海浦西德威国际学校': ['IGCSE', 'IB课程'],
  '上海德威外籍人员子女学校（浦西）': ['IGCSE', 'IB课程'],
  '苏州德威国际学校': ['IGCSE', 'IB课程'],
  '苏州德威学院': ['IGCSE', 'IB课程'],
  '苏州德威外籍人员子女学校': ['IGCSE', 'IB课程'],
  '德威学院（新加坡）': ['IGCSE', 'IB课程'],
  '德威学院首尔分校': ['IGCSE', 'IB课程'],
  '苏州德威国际高中课程': ['IGCSE', 'A Level课程'],
  '苏州工业园区德威联合书院': ['IGCSE', 'A Level课程'],
  '德威国际高中课程横琴分校': ['Pre-A Level课程', 'A Level课程'],
  '横琴德威国际课程高中项目·广东横琴粤澳深度合作区华发容闳高级中学': ['Pre-A Level课程', 'A Level课程'],
};

export default function SchoolListingCarouselPage({ title = "Find a School" }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollContainerRef = useRef(null);
  const pageSubtitle =
    "A family of international schools across Asia. We are located in Beijing, Seoul, Shanghai, Singapore, Suzhou, Yangon and Zhuhai.";

  // Detect locale
  const isZh = typeof window !== 'undefined' && window.location.pathname.startsWith('/zh');
  const locale = isZh ? 'zh' : 'en';

  // State for dynamic schools from API
  const [dynamicSchools, setDynamicSchools] = useState([]);
  const [isLoadingSchools, setIsLoadingSchools] = useState(false);

  // Set document title dynamically
  useEffect(() => {
    document.title = title;
  }, [title]);

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
    'Dehong Shanghai International Chinese School': ssDehongImg,
    '上海德宏国际中文学校': ssDehongImg,
    'Dehong Beijing International Chinese School': ssBeijingImg,
    '北京德宏国际中文学校': ssBeijingImg,
    "Dehong Xi'an School": ssXianImg,
    '西安德宏学校': ssXianImg,
    '德宏西安学校': ssXianImg
  };

  // Helper function to get local image for a school
  const getSchoolImage = (school) => {
    const schoolName = school.full_title || school.name;
    if (!schoolName) return null;

    // Try local image map first
    const localImage = schoolImageMap[schoolName];
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

  // Helper function to get tags for a school
  const getSchoolTags = (schoolName) => {
    if (!schoolName) return [];

    // Try exact match first
    if (jsontag[schoolName]) {
      return jsontag[schoolName];
    }

    // Try normalized match (case-insensitive, trimmed)
    const normalizedName = schoolName.trim();
    const matchedKey = Object.keys(jsontag).find(
      key => key.toLowerCase() === normalizedName.toLowerCase()
    );

    if (matchedKey) {
      return jsontag[matchedKey];
    }

    return [];
  };

  // Fetch schools from API
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setIsLoadingSchools(true);

        // Build query parameters
        const params = new URLSearchParams();
        params.append('locale', locale);

        const response = await fetch(`${API_BASE_URL}/api/all_schools?${params.toString()}`);
        const data = await response.json();

        if (data.success && data.data) {
          // Transform API data to match carousel format
          const transformedSchools = data.data.map(school => {
            const schoolName = school.full_title || school.title || school.name;

            // Map API type to display type
            const mapTypeToDisplay = (apiType) => {
              if (!apiType) return null;
              const typeMapping = {
                'College': isZh ? '国际学校' : 'International Schools',
                'International College': isZh ? '国际学校' : 'International Schools',
                'High School': isZh ? '国际高中课程' : 'Int. High School Programmes',
                'International High School': isZh ? '国际高中课程' : 'Int. High School Programmes',
                'Sister Schools': isZh ? '姊妹学校' : 'Sister Schools',
                '国际学院': isZh ? '国际学校' : 'International Schools',
                '国际高中': isZh ? '国际高中课程' : 'Int. High School Programmes',
                '姊妹学校': isZh ? '姊妹学校' : 'Sister Schools',
              };
              return typeMapping[apiType] || apiType;
            };

            return {
              name: schoolName,
              location: school.location,
              students: school.students_count || school.students,
              ages: school.ages,
              established: school.established,
              type: mapTypeToDisplay(school.type),
              image_url: school.image_url,
              url: school.url,
              // Use API tags if available, otherwise fall back to jsontag mapping
              tags: (school.tags && school.tags.length > 0) ? school.tags : getSchoolTags(schoolName),
            };
          });

          setDynamicSchools(transformedSchools);
        }
      } catch (error) {
        console.error('Error fetching schools:', error);
        // Fallback to static data on error
        setDynamicSchools(schoolsDataJson.carousel.items);
      } finally {
        setIsLoadingSchools(false);
      }
    };

    fetchSchools();
  }, [locale]);

  // Use data from API if available, otherwise fallback to JSON — triple for infinite loop
  const schools = dynamicSchools.length > 0 ? dynamicSchools : schoolsDataJson.carousel.items;
  const N = schools.length;
  const loopedSchools = [...schools, ...schools, ...schools];
  const absIndexRef = useRef(N); // current absolute index in looped array (starts at middle set)

  const getSlideWidth = () => {
    const container = scrollContainerRef.current;
    const slide = container?.children[0]?.children[0];
    return slide ? slide.offsetWidth + 24 : 0;
  };

  // On mount: jump silently to middle set (index N) so both directions have room
  useEffect(() => {
    requestAnimationFrame(() => {
      const container = scrollContainerRef.current;
      if (!container) return;
      const slideWidth = getSlideWidth();
      container.scrollLeft = N * slideWidth;
    });
  }, []);

  const handlePrevious = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const slideWidth = getSlideWidth();
    if (!slideWidth) return;

    // Use absIndexRef (the INTENDED target) — never scrollLeft which lags during animation
    let targetAbs = absIndexRef.current - 1;

    // If target would leave the safe middle zone, shift everything by N simultaneously.
    // scrollLeft shifts by the same amount so the visible content stays identical
    // (clone slides contain the same content, so the shift is invisible to the user).
    if (targetAbs < Math.floor(N / 2)) {
      container.scrollLeft += N * slideWidth; // shift visible position forward by N
      targetAbs += N;
    }

    absIndexRef.current = targetAbs;
    setCurrentSlide(((targetAbs % N) + N) % N);
    container.scrollTo({ left: targetAbs * slideWidth, behavior: 'smooth' });
  };

  const handleNext = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const slideWidth = getSlideWidth();
    if (!slideWidth) return;

    let targetAbs = absIndexRef.current + 1;

    if (targetAbs >= 2 * N) {
      container.scrollLeft -= N * slideWidth; // shift visible position back by N
      targetAbs -= N;
    }

    absIndexRef.current = targetAbs;
    setCurrentSlide(((targetAbs % N) + N) % N);
    container.scrollTo({ left: targetAbs * slideWidth, behavior: 'smooth' });
  };

  const handleDotClick = (index) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const slideWidth = getSlideWidth();
    const newAbs = N + index;
    absIndexRef.current = newAbs;
    setCurrentSlide(index);
    container.scrollTo({ left: newAbs * slideWidth, behavior: 'smooth' });
  };

  // Sync active dot on manual drag/scroll — also normalize if user scrolled into clone zone
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    let scrollTimer;
    const onScroll = () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const slideWidth = getSlideWidth();
        if (!slideWidth) return;
        let abs = Math.round(container.scrollLeft / slideWidth);
        // Silently normalise after manual scroll settles
        if (abs >= 2 * N) { abs -= N; container.scrollLeft = abs * slideWidth; }
        else if (abs < Math.floor(N / 2)) { abs += N; container.scrollLeft = abs * slideWidth; }
        absIndexRef.current = abs;
        setCurrentSlide(((abs % N) + N) % N);
      }, 120);
    };
    container.addEventListener('scroll', onScroll, { passive: true });
    return () => container.removeEventListener('scroll', onScroll);
  }, [N]);

  return (
    <div>
      {/* Carousel */}
      <section className="bg-white py-8">
        {/* Title section with max-width 1120px */}
        <div className="max-w-[1120px] mx-auto">
          <h1 className="text-left text-4xl md:text-5xl lg:text-6xl font-bold text-[#9E1422] mb-10">
            {title}
          </h1>
        </div>

        {/* Slider section - full width on right side */}
        <div className="w-full relative carousel-container">
          {isLoadingSchools ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D30013]"></div>
            </div>
          ) : (
            <>
              <div
                ref={scrollContainerRef}
                className="w-full overflow-x-auto scroll-smooth hide-scrollbar pb-8 mb-4 snap-x snap-mandatory"
              >
                <div className="flex flex-row flex-nowrap gap-6 pr-16 ">
                  {loopedSchools.map((school, idx) => (
                <div
                  key={idx}
                  className="group flex flex-col flex-shrink-0 bg-white rounded-2xl shadow-[0_0_16px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 overflow-hidden snap-start"
                  style={{ width: '352px' }}
                >
                  {/* Image */}
                  {getSchoolImage(school) && (
                    <div className="w-full overflow-hidden flex-shrink-0" style={{ height: '192px' }}>
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
                  <div className="px-5 py-4 flex flex-col flex-grow">
                    <h3 className="text-[18px] text-left font-bold text-[#3C3737] mb-3 leading-snug">
                      {school.name}
                    </h3>

                    <div className="space-y-1.5 mb-3 flex-grow">
                      {/* District/Location */}
                      {school.location && (
                        <div className="flex items-center gap-3 text-[#3C3C3B]">
                          <Icon icon="Icon-Pin" size={16} color="#3C3737" className="flex-shrink-0" />
                          <span className="text-[14px] font-medium">{school.location}</span>
                        </div>
                      )}

                      {/* Students */}
                      {school.students && (
                        <div className="flex items-center gap-3 text-[#3C3C3B]">
                          <Icon icon="Icon-Profile_Add" size={16} color="#3C3737" className="flex-shrink-0" />
                          <span className="text-[14px] font-medium">{school.students.toLocaleString()} {isZh ? '学生' : 'Students'}</span>
                        </div>
                      )}

                      {/* Ages */}
                      {school.ages && (
                        <div className="flex items-center gap-3 text-[#3C3C3B]">
                          <Icon icon="Age-Range" size={16} color="#3C3737" className="flex-shrink-0" />
                          <span className="text-[14px] font-medium">{isZh ? '年龄' : 'Ages'} {school.ages}</span>
                        </div>
                      )}

                      {/* Established Year */}
                      {school.established && (
                        <div className="flex items-center gap-3 text-[#3C3C3B]">
                          <Icon icon="Icon-Schools" size={16} color="#3C3737" className="flex-shrink-0" />
                          <span className="text-[14px] font-medium">{isZh ? '成立于' : 'Established'} {school.established}</span>
                        </div>
                      )}

                      {/* Tags */}
                      {school.tags && school.tags.length > 0 && (
                        <div className="flex gap-1.5 flex-wrap mt-3 mb-1 py-2">
                          {school.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-[#F2EDE9] border border-[#F2EDE9] rounded text-xs font-medium text-[#3C3C3B]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {(() => {
                      // Add /zh to URL if Chinese version and URL doesn't already have it
                      // Skip adding /zh for Sister Schools (姊妹学校)
                      const isSisterSchool = school.type === '姊妹学校' || school.type === 'Sister Schools';
                      const schoolUrl = isZh && school.url && !school.url.endsWith('/zh') && !school.url.includes('/zh/') && !isSisterSchool
                        ? school.url.replace(/\/$/, '') + '/zh'
                        : school.url;

                      return (
                        <a
                          href={schoolUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-center bg-[#D30013] hover:bg-[#B8000F] text-[16px] text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300"
                        >
                          {isZh ? '访问网站' : 'Visit Website'}
                        </a>
                      );
                    })()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between px-4 md:px-8">
            <div className="hidden sm:flex items-center gap-2">
              {Array.from({ length: N }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentSlide === index
                      ? "w-[72px] bg-red-600"
                      : "w-8 bg-[#F2EDE9]"
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handlePrevious}
                className="carousel-nav-btn w-12 h-12 bg-[#FAF7F5] border border-[#F2EDE9] rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-[#D30013] hover:border-[#D30013]"
                aria-label="Previous slide"
              >
                <Icon
                  icon="Icon-Chevron-small"
                  size={24}
                  color="#D30013"
                  style={{ transform: 'rotate(90deg)' }}
                />
              </button>

              <button
                onClick={handleNext}
                className="carousel-nav-btn w-12 h-12 bg-[#FAF7F5] border border-[#F2EDE9] rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-[#D30013] hover:border-[#D30013]"
                aria-label="Next slide"
              >
                <Icon
                  icon="Icon-Chevron-small"
                  size={24}
                  color="#D30013"
                  style={{ transform: 'rotate(270deg)' }}
                />
              </button>
            </div>
          </div>
          </>
          )}
        </div>
      </section>

      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }

          .carousel-container {
            padding-left: calc((100% - 1120px) / 2);
            padding-right: 0;
          }

          .carousel-nav-btn:hover svg path {
            fill: white !important;
          }

          @media (max-width: 1200px) {
            .carousel-container {
              padding-left: 40px;
            }
          }

          @media (max-width: 768px) {
            .carousel-container {
              padding-left: 16px;
            }
          }
        `}
      </style>
    </div>
  );
}
