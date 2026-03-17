import React, { useState, useEffect } from 'react';
import { getCurrentSchool, isSchoolSite } from '../utils/schoolDetection';

// International (Main) Header & Footer
import InternationalHeader from './layout/PageHeader';

// School-Specific Header & Footer
import SchoolHeader from './layout/school/PageHeader';
import SchoolFooter from './layout/school/PageFooter';

/**
 * DynamicLayout Component
 * Automatically switches between International and School-specific headers/footers
 * based on the current subdomain/URL
 */
function DynamicLayout({
  children,
  selectedSchool,
  setSelectedSchool,
  selectedSchoolSlug,
  setSelectedSchoolSlug,
  availableSchools,
  setChatOpen,
  chatOpen
}) {
  const [isSchool, setIsSchool] = useState(false);
  const [currentSchoolSlug, setCurrentSchoolSlug] = useState(null);

  useEffect(() => {
    // Detect if we're on a school-specific site
    const schoolSite = isSchoolSite();
    const schoolSlug = getCurrentSchool();

    setIsSchool(schoolSite);
    setCurrentSchoolSlug(schoolSlug);

    // Also check localStorage for manual school selection
    const storedSlug = localStorage.getItem('selectedSchoolSlug');
    if (storedSlug && storedSlug !== 'international') {
      setIsSchool(true);
      setCurrentSchoolSlug(storedSlug);
    }
  }, []);

  // Render International Header (no footer for international)
  if (!isSchool || currentSchoolSlug === null || currentSchoolSlug === 'international') {
    return (
      <>
        <InternationalHeader
          selectedSchool={selectedSchool}
          availableSchools={availableSchools}
          setSelectedSchool={setSelectedSchool}
          setSelectedSchoolSlug={setSelectedSchoolSlug}
          setChatOpen={setChatOpen}
          chatOpen={chatOpen}
        />
        {children}
      </>
    );
  }

  // Render School-Specific Header & Footer
  return (
    <>
      <SchoolHeader
        selectedSchool={selectedSchool}
        availableSchools={availableSchools}
        setSelectedSchool={setSelectedSchool}
        setSelectedSchoolSlug={setSelectedSchoolSlug}
        setChatOpen={setChatOpen}
        chatOpen={chatOpen}
      />
      {children}
      <SchoolFooter
        selectedSchool={selectedSchool}
        availableSchools={availableSchools}
        setSelectedSchool={setSelectedSchool}
        setSelectedSchoolSlug={setSelectedSchoolSlug}
      />
    </>
  );
}

export default DynamicLayout;
