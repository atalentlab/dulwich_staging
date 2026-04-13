/**
 * Example routing configuration for School Pages
 *
 * Add this to your App.js or main routing file
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SchoolPageRenderer from './SchoolPageRenderer';

/**
 * School Routes Example
 *
 * URL Structure:
 * /school/:school/*
 *
 * Examples:
 * - /school/beijing/admissions/admissions-overview
 * - /school/shanghai/academics/curriculum
 * - /school/suzhou/about/vision-and-values
 */
const SchoolRoutes = () => {
  return (
    <Routes>
      {/* School Pages - catches all school/:school/* routes */}
      <Route path="/school/:school/*" element={<SchoolPageRenderer locale="en" />} />

      {/* You can also create specific school routes if needed */}
      <Route path="/school/:school/admissions/*" element={<SchoolPageRenderer locale="en" />} />
      <Route path="/school/:school/academics/*" element={<SchoolPageRenderer locale="en" />} />
      <Route path="/school/:school/about/*" element={<SchoolPageRenderer locale="en" />} />
    </Routes>
  );
};

export default SchoolRoutes;

/**
 * In your main App.js, add the school routes:
 *
 * import SchoolPageRenderer from './components/school/SchoolPageRenderer';
 *
 * function App() {
 *   return (
 *     <BrowserRouter>
 *       <Routes>
 *         // Main site pages
 *         <Route path="/" element={<HomePage />} />
 *         <Route path="/*" element={<PageRenderer />} />
 *
 *         // School-specific pages with different headers/footers
 *         <Route path="/school/:school/*" element={<SchoolPageRenderer />} />
 *       </Routes>
 *     </BrowserRouter>
 *   );
 * }
 */
