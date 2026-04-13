import React, { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import InternationalHeader from '../components/layout/PageHeader';
import SchoolHeader from '../components/layout/school/PageHeader';
import InternationalFooter from '../components/layout/PageFooter';
import SchoolFooter from '../components/layout/school/PageFooter';
import { getCurrentSchool } from '../utils/schoolDetection';

function ErrorPage({
  errorCode: propErrorCode,
  errorMessage: propErrorMessage,
  errorDescription: propErrorDescription,
  technicalMessage: propTechnicalMessage
}) {
  const location = useLocation();
  const currentSchool = getCurrentSchool();
  const [selectedSchool, setSelectedSchool] = React.useState('Dulwich College International');
  const [selectedSchoolSlug, setSelectedSchoolSlug] = React.useState('');
  const [availableSchools, setAvailableSchools] = React.useState([]);
  const [chatOpen, setChatOpen] = React.useState(false);

  // Determine error code first
  const errorCode = propErrorCode || location.state?.errorCode || 404;

  // Determine locale based on URL path
  const isChineseVersion = location.pathname.startsWith('/zh/') || location.pathname === '/zh';
  const locale = isChineseVersion ? 'zh' : 'en';

  const Header = currentSchool ? SchoolHeader : InternationalHeader;
  const Footer = currentSchool ? SchoolFooter : InternationalFooter;

  // Translations
  const translations = {
    en: {
      goToHome: 'Go to Home',
      goBack: 'Go Back',
      retry: 'Retry',
      needHelp: 'Need help? Contact us at',
      pageNotFound: 'Page Not Found',
      pageNotFoundDesc: 'Sorry but the page you requested could not be found. Please click the buttons below to navigate back or start at the homepage.',
      internalServerError: 'Internal Server Error',
      internalServerErrorDesc: 'Something went wrong on our server. Please try again later or contact support if the problem persists.',
      badGateway: 'Bad Gateway',
      badGatewayDesc: 'The server encountered a temporary error. Please try again in a few moments.',
      serviceUnavailable: 'Service Unavailable',
      serviceUnavailableDesc: 'The server is temporarily unable to handle the request. Please try again later.',
      accessForbidden: 'Access Forbidden',
      accessForbiddenDesc: 'You do not have permission to access this page.',
      somethingWentWrong: 'Something Went Wrong',
      somethingWentWrongDesc: 'An unexpected error occurred. Please try again later.',
      detectedErrorCode: 'Detected error code'
    },
    zh: {
      goToHome: '返回首页',
      goBack: '返回',
      retry: '重试',
      needHelp: '需要帮助？请联系我们',
      pageNotFound: '页面未找到',
      pageNotFoundDesc: '抱歉，您请求的页面无法找到。请点击下面的按钮返回或前往首页。',
      internalServerError: '内部服务器错误',
      internalServerErrorDesc: '服务器发生错误。请稍后再试，如果问题持续存在，请联系支持团队。',
      badGateway: '错误网关',
      badGatewayDesc: '服务器遇到临时错误。请稍后再试。',
      serviceUnavailable: '服务不可用',
      serviceUnavailableDesc: '服务器暂时无法处理请求。请稍后再试。',
      accessForbidden: '访问被禁止',
      accessForbiddenDesc: '您没有权限访问此页面。',
      somethingWentWrong: '出错了',
      somethingWentWrongDesc: '发生了意外错误。请稍后再试。',
      detectedErrorCode: '检测到错误代码'
    }
  };

  const t = translations[locale];

  // Get error message and description based on error code and locale
  let errorMessage, errorDescription;

  // Check if error message was explicitly provided
  if (propErrorMessage || location.state?.errorMessage) {
    errorMessage = propErrorMessage || location.state?.errorMessage;
    errorDescription = propErrorDescription || location.state?.errorDescription || t.somethingWentWrongDesc;
  } else {
    // Use translations based on error code
    switch (errorCode) {
      case 404:
        errorMessage = t.pageNotFound;
        errorDescription = t.pageNotFoundDesc;
        break;
      case 500:
        errorMessage = t.internalServerError;
        errorDescription = t.internalServerErrorDesc;
        break;
      case 502:
        errorMessage = t.badGateway;
        errorDescription = t.badGatewayDesc;
        break;
      case 503:
        errorMessage = t.serviceUnavailable;
        errorDescription = t.serviceUnavailableDesc;
        break;
      case 403:
        errorMessage = t.accessForbidden;
        errorDescription = t.accessForbiddenDesc;
        break;
      default:
        errorMessage = t.somethingWentWrong;
        errorDescription = t.somethingWentWrongDesc;
    }
  }

  const technicalMessage = propTechnicalMessage || location.state?.technicalMessage;

  // Create sectionRefs for Footer component
  const sectionRefs = useRef({});

  // Fetch available schools for header and footer
  React.useEffect(() => {
    const fetchSchools = async () => {
      try {
        const baseUrl = process.env.REACT_APP_API_URL || 'https://cms.dulwich.atalent.xyz';
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

  // Determine icon and color based on error code
  const getErrorStyles = () => {
    switch (errorCode) {
      case 500:
      case 502:
      case 503:
        return {
          icon: (
            <svg className="w-12 h-12 text-[#D30013]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          bgColor: 'bg-[#D30013]/10',
          textColor: 'text-[#D30013]'
        };
      case 403:
        return {
          icon: (
            <svg className="w-12 h-12 text-[#D30013]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          ),
          bgColor: 'bg-[#D30013]/10',
          textColor: 'text-[#D30013]'
        };
      default: // 404 and others
        return {
          icon: (
            <svg className="w-12 h-12 text-[#D30013]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ),
          bgColor: 'bg-[#D30013]/10',
          textColor: 'text-[#D30013]'
        };
    }
  };

  const errorStyles = getErrorStyles();

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

      {/* Error Content */}
      <div className="flex-grow flex items-center justify-center px-4 py-16 sm:py-24">
        <div className="text-center max-w-[1120px] mx-auto">
          {/* Error Icon */}
          <div className="mb-4 mt-20">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${errorStyles.bgColor}`}>
              {errorStyles.icon}
            </div>
          </div>

          {/* Error Code */}
          <h1 className={`text-7xl sm:text-8xl font-bold ${errorStyles.textColor} mb-2`}>
            {errorCode}
          </h1>

          {/* Development mode indicator */}
          {process.env.NODE_ENV === 'development' && (
            <p className="text-xs text-gray-400 mb-2">
              ({t.detectedErrorCode}: {errorCode})
            </p>
          )}

          {/* Error Message */}
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4">
            {errorMessage}
          </h2>

          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            {errorDescription}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/"
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

            {errorCode >= 500 && (
              <button
                onClick={() => window.location.reload()}
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
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                {t.retry}
              </button>
            )}
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

            {/* Show technical details for server errors in development */}
            {process.env.NODE_ENV === 'development' && errorCode >= 500 && (
              <div >
                {/* 
                className="mt-4 p-4 bg-gray-100 rounded-lg text-left max-w-2xl mx-auto"
                <p className="text-xs font-mono text-gray-700">
                  <strong>Technical Details:</strong><br />
                  Error Code: {errorCode}<br />
                  {technicalMessage && (
                    <>Technical Message: {technicalMessage}</>
                  )}
                </p> */}
              </div>
            )}
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

export default ErrorPage;
