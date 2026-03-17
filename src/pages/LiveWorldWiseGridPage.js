import React, { useState, useEffect, useRef } from 'react';
import PageHeader from '../components/layout/school/PageHeader';
import PageFooter from '../components/layout/PageFooter';
import LiveWorldWiseGrid from '../components/LiveWorldWiseGrid';

/**
 * LiveWorldWiseGridPage - Standalone page for LiveWorldWiseGrid component
 */
const LiveWorldWiseGridPage = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState('Dulwich College International');
  const [selectedSchoolSlug, setSelectedSchoolSlug] = useState('');
  const [availableSchools, setAvailableSchools] = useState([]);
  const [isVisible, setIsVisible] = useState({});
  const sectionRefs = useRef({});

  // LiveWorldWiseGrid State
  const [liveWorldWiseState, setLiveWorldWiseState] = useState({
    live: { icon: 'bird', text: 'Ducks' },
    world: { icon: 'book', text: 'Juniors' },
    wise: { icon: 'brain', text: 'Wise' }
  });
  const [expandedView, setExpandedView] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleExpandView = React.useCallback((view) => {
    requestAnimationFrame(() => {
      setExpandedView(view);
    });
  }, []);

  const handleCloseExpandView = React.useCallback(() => {
    requestAnimationFrame(() => {
      setExpandedView(null);
    });
  }, []);

  // Prevent body scroll when expanded view is open
  useEffect(() => {
    if (expandedView) {
      const currentScrollY = window.scrollY;
      setScrollPosition(currentScrollY);
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${currentScrollY}px`;
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollPosition);
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [expandedView, scrollPosition]);

  // Handle Escape key to close expanded view
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && expandedView) {
        handleCloseExpandView();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [expandedView, handleCloseExpandView]);

  // Fetch active schools from API
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const API_URL = process.env.NODE_ENV === 'development'
          ? '/api/active_schools'
          : 'https://dulwich-ai-chat.atalent.xyz/api/active_schools';

        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          const result = await response.json();
          if (result.status === 'success' && result.data) {
            setAvailableSchools(result.data);

            if (result.data.length > 0) {
              const defaultSchool = result.data.find(s => s.id === -1 || s.slug === '') || result.data[0];
              setSelectedSchool(`Dulwich College ${defaultSchool.title}`);
              setSelectedSchoolSlug(defaultSchool.slug);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching schools:', error);
        const fallbackSchools = [
          { id: 1, slug: 'beijing', title: 'Beijing' },
          { id: 2, slug: 'shanghai-pudong', title: 'Shanghai Pudong' },
          { id: 3, slug: 'shanghai-puxi', title: 'Shanghai Puxi' },
          { id: 4, slug: 'suzhou', title: 'Suzhou' },
          { id: 5, slug: 'singapore', title: 'Singapore' },
          { id: 7, slug: 'yangon', title: 'Yangon' },
          { id: 8, slug: 'seoul', title: 'Seoul' },
          { id: -1, slug: '', title: 'International' }
        ];
        setAvailableSchools(fallbackSchools);

        const defaultSchool = fallbackSchools.find(s => s.id === -1 || s.slug === '') || fallbackSchools[0];
        setSelectedSchool(`Dulwich College ${defaultSchool.title}`);
        setSelectedSchoolSlug(defaultSchool.slug);
      }
    };

    fetchSchools();
  }, []);

  // Set visibility on mount
  useEffect(() => {
    setIsVisible({ 'live-world-wise': true });
  }, []);

  return (
    <>
      {/* Fixed Header */}
      <PageHeader
        selectedSchool={selectedSchool}
        availableSchools={availableSchools}
        setSelectedSchool={setSelectedSchool}
        setSelectedSchoolSlug={setSelectedSchoolSlug}
        setChatOpen={setChatOpen}
        chatOpen={chatOpen}
        headerScrolled={false}
      />

      {/* Main Content */}
      <div style={{ paddingTop: '140px', backgroundColor: '#f9f9f9' }}>
        <LiveWorldWiseGrid
          sectionRefs={sectionRefs}
          isVisible={isVisible}
          liveWorldWiseState={liveWorldWiseState}
          expandedView={expandedView}
          handleExpandView={handleExpandView}
          handleCloseExpandView={handleCloseExpandView}
        />
      </div>

      {/* Footer */}
      <PageFooter />
    </>
  );
};

export default LiveWorldWiseGridPage;
