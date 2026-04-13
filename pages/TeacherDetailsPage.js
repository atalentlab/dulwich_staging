import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import PageHeader from '../components/layout/school/PageHeader';
import PageFooter from '../components/layout/school/PageFooter';
import { fetchTeacherList } from '../api/teacherService';
import { getCurrentSchool } from '../utils/schoolDetection';
import Loading from '../components/common/Loading';

function TeacherDetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [teachers, setTeachers] = useState([]);
  const [currentTeacher, setCurrentTeacher] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Parse query parameters
  const searchParams = new URLSearchParams(location.search);
  const queryLocale = searchParams.get('locale');
  const querySchool = searchParams.get('school');

  // Extract locale from URL
  const parseUrl = (pathname) => {
    const cleanPath = pathname.replace(/^\/|\/$/g, '');
    if (!cleanPath) return { locale: null };

    const segments = cleanPath.split('/');
    const firstSegment = segments[0].toLowerCase();
    const supportedLocales = ['zh', 'cn'];

    if (supportedLocales.includes(firstSegment)) {
      return { locale: firstSegment };
    }
    return { locale: null };
  };

  const { locale: urlLocale } = parseUrl(location.pathname);
  const locale = queryLocale || urlLocale || 'en';

  // Detect school
  const detectedSchool = getCurrentSchool();
  const schoolWithSuffix = detectedSchool ? detectedSchool : null;
  const school = querySchool || schoolWithSuffix;

  // Fetch all teachers
  useEffect(() => {
    const loadTeachers = async () => {
      try {
        setLoading(true);

        // Fetch first page to get total count
        const firstPageResponse = await fetchTeacherList({
          school: school,
          locale: locale,
          page_no: 1,
          limit: 500,
        });

        const firstPageData = firstPageResponse.data?.people || [];
        const total = firstPageResponse.data?.total || firstPageData.length;
        const limit = firstPageResponse.data?.limit;

        // Calculate total pages needed
        const totalPages = Math.ceil(total / limit);

        // If there are more pages, fetch them all
        let allTeachers = [...firstPageData];

        if (totalPages > 1) {
          const pagePromises = [];
          for (let page = 2; page <= totalPages; page++) {
            pagePromises.push(
              fetchTeacherList({
                school: school,
                locale: locale,
                page_no: page,
                limit: limit
              })
            );
          }

          const remainingPages = await Promise.all(pagePromises);
          remainingPages.forEach(response => {
            const pageData = response.data?.people || [];
            allTeachers = [...allTeachers, ...pageData];
          });
        }

        console.log(`Loaded ${allTeachers.length} teachers out of ${total} total`);
        setTeachers(allTeachers);

        // Find current teacher by slug
        const teacherIndex = allTeachers.findIndex(t => t.slug === slug);
        if (teacherIndex !== -1) {
          setCurrentTeacher(allTeachers[teacherIndex]);
          setCurrentIndex(teacherIndex);
        } else {
          setError('Teacher not found');
        }
      } catch (err) {
        console.error('Error loading teachers:', err);
        setError('Failed to load teacher data');
      } finally {
        setLoading(false);
      }
    };

    loadTeachers();
  }, [slug, school, locale]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevTeacher = teachers[currentIndex - 1];
      const localePrefix = locale && locale !== 'en' ? `/${locale}` : '';
      navigate(`${localePrefix}/community/teachers/${prevTeacher.slug}`);
    }
  };

  const handleNext = () => {
    if (currentIndex < teachers.length - 1) {
      const nextTeacher = teachers[currentIndex + 1];
      const localePrefix = locale && locale !== 'en' ? `/${locale}` : '';
      navigate(`${localePrefix}/community/teachers/${nextTeacher.slug}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <PageHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loading />
        </div>
        <PageFooter />
      </div>
    );
  }

  if (error || !currentTeacher) {
    return (
      <div className="min-h-screen bg-white">
        <PageHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Teacher Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The requested teacher could not be found.'}</p>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-[#D30013] text-white rounded-lg hover:bg-[#B8000F] transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
        <PageFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <PageHeader />

      <div className="max-w-[1200px] mx-auto px-4 py-12 mt-[120px]">
        {/* Teacher Details */}
        <div className="bg-white">
          {/* Header Image */}
          {currentTeacher.image && (
            <div className="flex justify-center mb-8">
              <img
                src={currentTeacher.image}
                alt={currentTeacher.name}
                className="w-64 h-64 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}

          {/* Name and Title */}
          <div className="text-center mb-4">
            <h1 className="text-5xl font-bold text-[#D30013] mb-4">
              {currentTeacher.name}
            </h1>
            <h2 className="text-2xl text-[#3C3C3B] font-semibold">
              {currentTeacher.job_title}
            </h2>
          </div>

          {/* School Badges */}
          {currentTeacher.school && currentTeacher.school.length > 0 && (
            <div className="flex justify-center gap-3 mb-8">
              {currentTeacher.school.map((schoolName, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-[#0EA5E9] text-white text-sm font-semibold rounded-full"
                >
                  {schoolName}
                </span>
              ))}
            </div>
          )}

          {/* Content/Biography */}
          {currentTeacher.content && (
            <div className="mb-8 max-w-[900px] mx-auto">
              <div
                className="text-[#3C3C3B] prose prose-lg max-w-none leading-relaxed"
                dangerouslySetInnerHTML={{ __html: currentTeacher.content }}
              />
            </div>
          )}

          {/* Background */}
          {currentTeacher.background && (
            <div className="mb-8 max-w-[900px] mx-auto">
              <div
                className="text-[#3C3C3B] prose prose-lg max-w-none leading-relaxed"
                dangerouslySetInnerHTML={{ __html: currentTeacher.background }}
              />
            </div>
          )}

          {/* Joined */}
          {currentTeacher.joined && (
            <div className="mb-6 max-w-[900px] mx-auto">
              <h3 className="text-[#9E1422] font-bold mb-2 text-lg">Joined</h3>
              <p className="text-[#3C3C3B] text-base">{currentTeacher.joined}</p>
            </div>
          )}

          {/* Qualifications */}
          {currentTeacher.qualifications && (
            <div className="mb-6 max-w-[900px] mx-auto">
              <h3 className="text-[#9E1422] font-bold mb-2 text-lg">Qualifications</h3>
              <div
                className="text-[#3C3C3B] prose prose-base max-w-none"
                dangerouslySetInnerHTML={{ __html: currentTeacher.qualifications }}
              />
            </div>
          )}

          {/* Departments */}
          {currentTeacher.department && currentTeacher.department.length > 0 && (
            <div className="mb-8 max-w-[900px] mx-auto">
              <h3 className="text-[#9E1422] font-bold mb-3 text-lg">
                Department{currentTeacher.department.length > 1 ? 's' : ''}
              </h3>
              <div className="flex flex-wrap gap-3 text-center justify-center">
                {currentTeacher.department.map((deptName, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-[#FAF7F5] border border-[#9E1422] text-[#3C3C3B] text-sm rounded-full"
                  >
                    {deptName}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Controls */}
        <div className="border-t-2 border-gray-300 pt-8 mt-12">
          <div className="flex items-center justify-center gap-8">
            {/* Previous Button */}
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                currentIndex === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-[#D30013] hover:border-[#D30013] hover:text-white'
              }`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Counter */}
            <div className="text-xl font-semibold text-[#3C3C3B]">
              {currentIndex + 1}/{teachers.length}
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              disabled={currentIndex === teachers.length - 1}
              className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                currentIndex === teachers.length - 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-[#D30013] hover:border-[#D30013] hover:text-white'
              }`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <PageFooter />
    </div>
  );
}

export default TeacherDetailsPage;
