import React, { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import InternationalHeader from '../components/layout/PageHeader';
import SchoolHeader from '../components/layout/school/PageHeader';
import InternationalFooter from '../components/layout/PageFooter';
import SchoolFooter from '../components/layout/school/PageFooter';
import { getCurrentSchool } from '../utils/schoolDetection';

function NotFound() {
  const location = useLocation();
  const currentSchool = getCurrentSchool();
  const [selectedSchool, setSelectedSchool] = React.useState('Dulwich College International');
  const [selectedSchoolSlug, setSelectedSchoolSlug] = React.useState('');
  const [availableSchools, setAvailableSchools] = React.useState([]);
  const [chatOpen, setChatOpen] = React.useState(false);

  // Determine locale based on URL path
  const isChineseVersion = location.pathname.startsWith('/zh/') || location.pathname === '/zh';
  const locale = isChineseVersion ? 'zh' : 'en';

  // Translations
  const translations = {
    en: {
      pageNotFound: 'Page Not Found',
      pageNotFoundDesc: 'Sorry but the page you requested could not be found. Please click the buttons below to navigate back or start at the homepage.',
      goToHome: 'Go to Home',
      goBack: 'Go Back',
      needHelp: 'Need help? Contact us'
    },
    zh: {
      pageNotFound: '页面未找到',
      pageNotFoundDesc: '抱歉，您请求的页面无法找到。请点击下面的按钮返回或前往首页。',
      goToHome: '返回首页',
      goBack: '返回',
      needHelp: '需要帮助？请联系我们'
    }
  };

  const t = translations[locale];

  const Header = currentSchool ? SchoolHeader : InternationalHeader;

  const Footer = currentSchool ? SchoolFooter : InternationalFooter;

  // Create sectionRefs for Footer component
  const sectionRefs = useRef({});

  // Fetch available schools for header and footer
  React.useEffect(() => {
    const fetchSchools = async () => {
      try {
        const baseUrl = process.env.REACT_APP_API_URL || 'https://cms.dulwich.org';
        const response = await fetch(`${baseUrl}/api/schools`);
        if (response.ok) {
          const data = await response.json();
          const schoolsList = data.data || data.schools || data;
          if (Array.isArray(schoolsList)) {
            setAvailableSchools(schoolsList);
            // Set selectedSchool to the current school based on subdomain
            if (currentSchool) {
              const match = schoolsList.find(s => s.slug === currentSchool);
              if (match) {
                setSelectedSchool(match.title);
                setSelectedSchoolSlug(match.slug);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching schools:', error);
      }
    };

    fetchSchools();
  }, [currentSchool]);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Header */}
      <Header
        selectedSchool={selectedSchool}
        availableSchools={availableSchools}
        setSelectedSchool={setSelectedSchool}
        setSelectedSchoolSlug={setSelectedSchoolSlug}
        setChatOpen={setChatOpen}
        chatOpen={chatOpen}
      />

      {/* 404 Content */}
      <div className="flex-grow flex items-center justify-center px-4 py-16 sm:py-24">
        <div className="text-center max-w-[1120px] mx-auto">
          {/* Error Icon */}
          <div className="mb-4 mt-20">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#D30013]/10">
              <svg
                className="w-12 h-12 text-[#D30013]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>

          {/* Error Code */}
          <h1 className="text-7xl sm:text-8xl font-bold text-[#D30013] mb-2">
            404
          </h1>

          {/* Error Message */}
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4">
            {t.pageNotFound}
          </h2>

          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            {t.pageNotFoundDesc}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to={isChineseVersion ? '/zh/' : '/'}
              className="inline-flex items-center justify-center px-6 py-3 bg-[#D30013] text-white font-semibold rounded-lg hover:bg-[#B8000F] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              {t.goToHome}
            </Link>

            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#D30013] font-semibold rounded-lg border-2 border-[#D30013] hover:bg-[#D30013] hover:text-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              {t.goBack}
            </button>
          </div>

          {/* Additional Help Text */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              {t.needHelp}{' '}
              <a
                href="mailto:info@dulwich.org"
                className="text-[#D30013] hover:underline font-medium"
              >
                info@dulwich.org
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer
        sectionRefs={sectionRefs}
        isVisible={true}
        availableSchools={availableSchools}
        selectedSchool={selectedSchool}
        setSelectedSchool={setSelectedSchool}
        setSelectedSchoolSlug={setSelectedSchoolSlug}
      />
    </div>
  );
}

export default NotFound;
