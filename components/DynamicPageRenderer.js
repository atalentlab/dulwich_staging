import React from 'react';
import { getCurrentSchool, isSchoolSite } from '../utils/schoolDetection';
import PageRenderer from './PageRenderer';
import SchoolPageRenderer from './school/SchoolPageRenderer';

/**
 * DynamicPageRenderer Component
 * Automatically detects school from hostname and renders appropriate page
 *
 * Hostname Detection:
 * - beijing.dulwich.loc:3000 → Renders SchoolPageRenderer with school="beijing"
 * - shanghai.dulwich.loc:3000 → Renders SchoolPageRenderer with school="shanghai"
 * - dulwich.loc:3000 → Renders PageRenderer (main site)
 *
 * URL Examples:
 * - http://beijing.dulwich.loc:3000/admissions/overview
 *   → SchoolPageRenderer with school="beijing", slug="admissions/overview"
 *
 * - http://dulwich.loc:3000/about-dulwich/vision-and-values
 *   → PageRenderer with slug="about-dulwich/vision-and-values"
 */
const DynamicPageRenderer = () => {
  // Detect school synchronously to avoid an extra "null -> page" render pass.
  const school = getCurrentSchool();
  const isSchool = isSchoolSite();

  // Log detection for debugging
  console.log('Hostname:', window.location.hostname);
  console.log('Detected School:', school);
  console.log('Is School Site:', isSchool);

  // Render school page if school detected
  if (isSchool && school) {
    console.log(`Rendering School Page for school: ${school}`);
    // Don't pass slug prop - let SchoolPageRenderer parse it from location
    return <SchoolPageRenderer school={school} />;
  }

  // Render main site page
  console.log(`Rendering Main Site Page`);
  return <PageRenderer />;
};

export default DynamicPageRenderer;
