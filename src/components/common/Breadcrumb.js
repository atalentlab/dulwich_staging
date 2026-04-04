import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Breadcrumb Component
 * Dynamically generates breadcrumbs based on the current URL path
 *
 * Example URLs:
 * /our-school/sustainability-and-global-citizenship
 *   → Home > Our School > Sustainability & Global Citizenship
 *
 * /zh/our-college/academic-programs
 *   → Home > Our College > Academic Programs
 */

const Breadcrumb = ({ className = '' }) => {
  const location = useLocation();

  // Parse the URL to extract locale and path segments
  const parseUrl = (pathname) => {
    const cleanPath = pathname.replace(/^\/|\/$/g, '');

    if (!cleanPath) return { locale: null, segments: [] };

    const segments = cleanPath.split('/');
    const supportedLocales = ['zh', 'cn'];
    const firstSegment = segments[0].toLowerCase();

    if (supportedLocales.includes(firstSegment)) {
      return {
        locale: firstSegment,
        segments: segments.slice(1)
      };
    }

    return {
      locale: null,
      segments: segments
    };
  };

  const { locale, segments } = parseUrl(location.pathname);

  // Don't show breadcrumbs on home page or if no segments
  if (segments.length === 0 || (segments.length === 1 && segments[0] === 'home')) {
    return null;
  }

  // Convert slug to title (e.g., "our-school" → "Our School")
  const slugToTitle = (slug) => {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Build breadcrumb items
  const breadcrumbItems = [];

  // Always start with Home
  const homeLink = locale ? `/${locale}` : '/';
  breadcrumbItems.push({
    title: 'Home',
    link: homeLink,
    isLast: false
  });

  // Add intermediate segments
  let currentPath = locale ? `/${locale}` : '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    breadcrumbItems.push({
      title: slugToTitle(segment),
      link: currentPath,
      isLast: index === segments.length - 1
    });
  });

  return (
    <nav className={`bg-white py-4 px-4 ${className}`} aria-label="Breadcrumb">
      <div className="max-w-[1376px] mx-auto">
        <ol className="flex flex-wrap items-center gap-2 text-sm">
          {breadcrumbItems.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <svg
                  className="w-4 h-4 mx-2 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              )}
              {item.isLast ? (
                <span className="text-gray-600 font-medium">
                  {item.title}
                </span>
              ) : (
                <Link
                  to={item.link}
                  className="text-[#D30013] hover:text-[#B01810] hover:underline transition-colors duration-200"
                >
                  {item.title}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumb;
