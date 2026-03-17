import React, { useState, useEffect, useRef } from 'react';
import '../styles/TestPage.css';
import HomeBanner from '../components/HomeBanner';
import PageHeader from '../components/layout/school/PageHeader';
import PageFooter from '../components/layout/PageFooter';
import DataGrid from './DataGrid';
import TextBlock from '../components/TextBlock';
import EyeText from '../components/eyeText';
import LiveWorldView from '../components/LiveWorldView';
import LiveWorldWiseOverlay from '../components/LiveWorldWiseOverlay';
import ImageBlock from '../components/ImageBlock';
import LiveWorldWiseGrid from '../components/LiveWorldWiseGrid';
import AcademicResultSpinner from '../components/AcademicResultSpinner';
import GalleryScrollSlider from '../components/GalleryScrollSlider';
import HistorySlider from '../components/HistorySlider';
import HolisticCurriculumBlock from '../components/blocks/HolisticCurriculumBlock';
import DCSZ_Chevron_KV_3840x2160_20260123 from '../assets/images/DCSZ/DCSZ_Chevron_KV_3840x2160_20260123.png';


/**
 * TestPage - Full Screen Section Scrolling Demo
 *
 * Features Apple-style smooth scrolling with full-screen sections
 * Based on the Dulwich landing page reference
 */
const TestPage = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState('Dulwich College International');
  const [selectedSchoolSlug, setSelectedSchoolSlug] = useState('');
  const [availableSchools, setAvailableSchools] = useState([]);
  const sectionsRef = useRef([]);
  const sectionRefs = useRef({});
  const observerRef = useRef(null);
  const galleryContainerRef = useRef(null);
  const galleryInnerRef = useRef(null);
  const totalSections = 15;

  // Refs for scroll locking - prevents race conditions
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef(null);
  const isKeyScrollingRef = useRef(false);
  const keyScrollTimeoutRef = useRef(null);
  const activeSectionRef = useRef(0); // Track current section immediately

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

  // Sync activeSection state with ref on mount
  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

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

  // Scroll to specific section
  const scrollToSection = React.useCallback((index) => {
    if (index < 0 || index >= totalSections) return;

    // Update ref immediately for instant tracking
    activeSectionRef.current = index;
    // Update state for UI
    setActiveSection(index);

    const section = sectionsRef.current[index];
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [totalSections]);

  // Track active section - only update when not actively scrolling
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.8, // Higher threshold to prevent premature section updates
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // Only update active section if we're not in the middle of a scroll action
        if (entry.isIntersecting && !isScrollingRef.current && !isKeyScrollingRef.current) {
          const index = sectionsRef.current.findIndex(
            (section) => section === entry.target
          );
          if (index !== -1 && index !== activeSectionRef.current) {
            activeSectionRef.current = index;
            setActiveSection(index);
          }
        }
      });
    }, options);

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  // Implement one scroll = one section navigation (STRICT MODE)
  useEffect(() => {
    const scrollCooldown = 1500; // Longer cooldown to ensure smooth scroll completes

    const handleWheel = (e) => {
      // ALWAYS prevent default scroll behavior
      e.preventDefault();
      e.stopPropagation();

      // If already scrolling, completely ignore this event
      if (isScrollingRef.current) {
        return;
      }

      // Lock scrolling immediately
      isScrollingRef.current = true;

      // Get current section from ref (always up-to-date)
      const currentSection = activeSectionRef.current;

      // Determine direction - very simple check
      const direction = e.deltaY > 0 ? 'down' : 'up';

      // Execute scroll based on direction
      if (direction === 'down') {
        if (currentSection < totalSections - 1) {
          scrollToSection(currentSection + 1);
        } else {
          // At last section, unlock immediately
          isScrollingRef.current = false;
        }
      } else {
        if (currentSection > 0) {
          scrollToSection(currentSection - 1);
        } else {
          // At first section, unlock immediately
          isScrollingRef.current = false;
        }
      }

      // Clear any existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Only set timeout if we actually scrolled
      if ((direction === 'down' && currentSection < totalSections - 1) ||
          (direction === 'up' && currentSection > 0)) {
        // Unlock scrolling after cooldown period
        scrollTimeoutRef.current = setTimeout(() => {
          isScrollingRef.current = false;
        }, scrollCooldown);
      }
    };

    // Add wheel event listener with passive: false to prevent default
    window.addEventListener('wheel', handleWheel, { passive: false });

    // Handle touch swipe for mobile (STRICT MODE)
    let touchStartY = 0;

    const handleTouchStart = (e) => {
      if (!isScrollingRef.current) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      // Prevent default scrolling on mobile
      if (touchStartY) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e) => {
      if (isScrollingRef.current || !touchStartY) {
        touchStartY = 0;
        return;
      }

      const touchEndY = e.changedTouches[0].clientY;
      const swipeDistance = touchStartY - touchEndY;
      const minSwipeDistance = 50;

      if (Math.abs(swipeDistance) > minSwipeDistance) {
        // Lock scrolling immediately
        isScrollingRef.current = true;

        // Get current section from ref (always up-to-date)
        const currentSection = activeSectionRef.current;

        if (swipeDistance > 0 && currentSection < totalSections - 1) {
          // Swiped up (scroll down)
          scrollToSection(currentSection + 1);
        } else if (swipeDistance < 0 && currentSection > 0) {
          // Swiped down (scroll up)
          scrollToSection(currentSection - 1);
        } else {
          // At boundary, unlock immediately
          isScrollingRef.current = false;
        }

        // Clear any existing timeout
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        // Only set timeout if we actually scrolled
        if ((swipeDistance > 0 && currentSection < totalSections - 1) ||
            (swipeDistance < 0 && currentSection > 0)) {
          // Unlock scrolling after cooldown (1500ms to match wheel scroll)
          scrollTimeoutRef.current = setTimeout(() => {
            isScrollingRef.current = false;
          }, 1500);
        }
      }

      touchStartY = 0;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [totalSections, scrollToSection]);

  // Keyboard navigation (STRICT MODE)
  useEffect(() => {
    const keyScrollCooldown = 1500; // Cooldown to match wheel scroll

    const handleKeyDown = (e) => {
      const isNavigationKey = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End'].includes(e.key);

      if (!isNavigationKey) return;

      e.preventDefault();

      // If already scrolling via keyboard, ignore
      if (isKeyScrollingRef.current) return;

      // Lock keyboard scrolling
      isKeyScrollingRef.current = true;

      // Get current section from ref (always up-to-date)
      const currentSection = activeSectionRef.current;
      let shouldScroll = false;

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        if (currentSection < totalSections - 1) {
          scrollToSection(currentSection + 1);
          shouldScroll = true;
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        if (currentSection > 0) {
          scrollToSection(currentSection - 1);
          shouldScroll = true;
        }
      } else if (e.key === 'Home') {
        if (currentSection !== 0) {
          scrollToSection(0);
          shouldScroll = true;
        }
      } else if (e.key === 'End') {
        if (currentSection !== totalSections - 1) {
          scrollToSection(totalSections - 1);
          shouldScroll = true;
        }
      }

      // If we didn't scroll (at boundary), unlock immediately
      if (!shouldScroll) {
        isKeyScrollingRef.current = false;
        return;
      }

      // Clear any existing timeout
      if (keyScrollTimeoutRef.current) {
        clearTimeout(keyScrollTimeoutRef.current);
      }

      // Unlock keyboard scrolling after cooldown
      keyScrollTimeoutRef.current = setTimeout(() => {
        isKeyScrollingRef.current = false;
      }, keyScrollCooldown);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (keyScrollTimeoutRef.current) {
        clearTimeout(keyScrollTimeoutRef.current);
      }
    };
  }, [totalSections, scrollToSection]);

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

            // Always use default International school (id: -1, slug: "")
            if (result.data.length > 0) {
              const defaultSchool = result.data.find(s => s.id === -1 || s.slug === '') || result.data[0];
              setSelectedSchool(`Dulwich College ${defaultSchool.title}`);
              setSelectedSchoolSlug(defaultSchool.slug);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching schools:', error);
        // Fallback to default schools if API fails
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

        // Always use default International school (id: -1, slug: "")
        const defaultSchool = fallbackSchools.find(s => s.id === -1 || s.slug === '') || fallbackSchools[0];
        setSelectedSchool(`Dulwich College ${defaultSchool.title}`);
        setSelectedSchoolSlug(defaultSchool.slug);
      }
    };

    fetchSchools();
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    // Hero section is visible on initial load
    setIsVisible((prev) => ({ ...prev, hero: true }));

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px',
      }
    );

    const currentObserver = observerRef.current;
    const refs = sectionRefs.current;

    Object.keys(refs).forEach((key) => {
      if (refs[key] && key !== 'hero') {
        currentObserver.observe(refs[key]);
      }
    });

    return () => {
      if (currentObserver) {
        Object.keys(refs).forEach((key) => {
          if (refs[key]) {
            currentObserver.unobserve(refs[key]);
          }
        });
      }
    };
  }, []);

  return (
    <>
      {/* Fixed Header - Outside fullscreen container */}
      <PageHeader
        selectedSchool={selectedSchool}
        availableSchools={availableSchools}
        setSelectedSchool={setSelectedSchool}
        setSelectedSchoolSlug={setSelectedSchoolSlug}
        setChatOpen={setChatOpen}
        chatOpen={chatOpen}
        headerScrolled={activeSection > 0}
      />

      {/* Full-Screen Scroll Container */}
      <div className="test-page fullscreen-container">
        {/* Navigation Dots */}
        {/* <div className="scroll-nav">
          {Array.from({ length: totalSections }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToSection(index)}
              className={`nav-dot ${activeSection === index ? 'active' : ''}`}
              aria-label={`Go to section ${index + 1}`}
            />
          ))}
        </div> */}

        {/* Section 1: Hero */}
        <section
          ref={(el) => (sectionsRef.current[0] = el)}
          className="fullscreen-section hero-section"
        >
          <div className="section-content">
            <HomeBanner
              sectionRefs={sectionRefs}
              isVisible={isVisible}
            />
          </div>
        </section>

        {/* Section 2: Statistics */}
        <section
          ref={(el) => (sectionsRef.current[1] = el)}
          className="fullscreen-section stats-section"
        >
          <div className="section-content">
            <DataGrid />
          </div>
        </section>

        {/* Section 3: Founded by Parents */}
        <section
          ref={(el) => (sectionsRef.current[2] = el)}
          className="fullscreen-section text-block-section"
        >
          <div className="section-content">
            <TextBlock
              eyebrow="Dulwich College Suzhou"
              title="<span style='color: #9E1422;'>Building bridges to the World</span></br> "
              subtitle="Academic Excellence, Community, Sustainability, Tradition & Inovation"
              content={[
"It is with great pleasure that I welcome you to Dulwich College Suzhou. Our school is a place where academic excellence, wellbeing, and global citizenship are all deeply valued, it is also a place where our students are known and cared for. This is the legacy of our school and is very much the vision that will guide the work of our leadership team and staff."
              ]}
              // attribution="— Karen Yung & Fraser White, Founders, Dulwich College International"
              buttonText="Head of College Welcome"
              buttonLink="#about"
              image={DCSZ_Chevron_KV_3840x2160_20260123}
              imageAlt="Dulwich College founders and community"
              imagePosition="right"
              backgroundColor="#ffffff"
              anchorId="founders-section"
            />
          </div>
        </section>

        {/* Section 4: EyeText Component */}
        <section
          ref={(el) => (sectionsRef.current[3] = el)}
          className="fullscreen-section"
        >
    <div className="section-content flex items-center h-full max-w-[1120px] m-auto text-left pl-4 pr-[12%]">

            <EyeText
              eyebrow="CORE CURRICULUM"
              redText="World-class international education for"
              blackText="students aged 2-18"
              align="left"
            />
          </div>
        </section>

        {/* Section 5: Gallery Scroll Slider */}
        <section
          ref={(el) => (sectionsRef.current[4] = el)}
          className="fullscreen-section gallery-section"
        >
          <div className="section-content w-full h-full p-0 max-w-none">
            <GalleryScrollSlider
              sectionRefs={sectionRefs}
              isVisible={isVisible}
              galleryContainerRef={galleryContainerRef}
              galleryInnerRef={galleryInnerRef}
            />
          </div>
        </section>

        {/* Section 6: Experience */}
        <section
          ref={(el) => (sectionsRef.current[5] = el)}
          className="fullscreen-section"
        >
         <div className="section-content flex items-center h-full max-w-[1120px] m-auto text-left px-4 pr-[15%]">
            <EyeText
              eyebrow="OFFERINGS"
              redText="International education across Asia        "
              blackText="for young people aged 2–18"
              align="left"
            />
          </div>
        </section>

        {/* Section 7: LiveWorldWiseGrid */}
        <section
          ref={(el) => (sectionsRef.current[6] = el)}
          className="fullscreen-section live-world-wise-section"
        >
          <div className="section-content w-full h-full p-0 max-w-none">
            <LiveWorldWiseGrid
              sectionRefs={sectionRefs}
              isVisible={isVisible}
              liveWorldWiseState={liveWorldWiseState}
              expandedView={expandedView}
              handleExpandView={handleExpandView}
              handleCloseExpandView={handleCloseExpandView}
            />
          </div>
        </section>

        {/* Live World Wise Overlay */}
        <LiveWorldWiseOverlay
          expandedView={expandedView}
          handleExpandView={handleExpandView}
          handleCloseExpandView={handleCloseExpandView}
        />

     
        {/* Section 7 */}
        <section
          ref={(el) => (sectionsRef.current[7] = el)}
          className="fullscreen-section"
        >
          <div className="section-content flex items-center justify-center h-full m-auto px-4">
            <ImageBlock />
          </div>
        </section>

           {/* Section 8: Experience */}
           <section
          ref={(el) => (sectionsRef.current[8] = el)}
          className="fullscreen-section"
        >
             <div className="section-content flex items-center h-full max-w-[1120px] m-auto text-left px-4 pr-[20%]">
          <EyeText
              eyebrow="VIBRANT COMMUNITY"
              redText="DCSZ: Where Your Heart Belong  "
              blackText=""
              align="left"
            />
          </div>
        </section>
        {/* Section 10: Experience */}
        {/* <section
          ref={(el) => (sectionsRef.current[9] = el)}
          className="fullscreen-section"
        >
          <div className="section-content flex items-center justify-center h-full max-w-[800px] m-auto px-4">
            <EyeText
              eyebrow="HOLISTIC EDUCATION"
              redText="Empowering young people to make a positive        "
              blackText=" difference in the world"
              align="left"
            />
          </div>
        </section> */}

        {/* Section 11: LiveWorldView */}
        {/* <section
          ref={(el) => (sectionsRef.current[9] = el)}
          className="fullscreen-section"
        >
          <div className="section-content justify-center w-full h-full p-0">
            <LiveWorldView
              sectionRefs={sectionRefs}
              isVisible={isVisible}
              handleExpandView={handleExpandView}
            />
          </div>
        </section> */}

        {/* Section 12: Experience */}
        <section
          ref={(el) => (sectionsRef.current[10] = el)}
          className="fullscreen-section"
        >
    <div className="section-content flex items-center h-full max-w-[1120px] m-auto text-left px-4 pr-[3%]">
            <EyeText
              eyebrow="ACADEMIC EXCELLENCE"
              redText="Some of the highest-performing schools locally ,"
              blackText="regionally, and worldwide"
              align="left"
            />
          </div>
        </section>

        <div className='normal-section' ref={(el) => (sectionsRef.current[11] = el)}>
          <AcademicResultSpinner />
        </div>

        {/* Section 14: History Slider */}
        <section
          ref={(el) => (sectionsRef.current[12] = el)}
          className="fullscreen-section history-slider-section"
        >
          <div className="section-content w-full h-full p-0 max-w-none">
            <HistorySlider />
          </div>
        </section>

        {/* Section 14: Holistic Curriculum */}
        <section
          ref={(el) => (sectionsRef.current[13] = el)}
          className="fullscreen-section"
        >
          <div className="section-content w-full h-full p-0 max-w-none">
            <HolisticCurriculumBlock content={{}} />
          </div>
        </section>

        {/* Section 15: Footer */}
        <section
          ref={(el) => (sectionsRef.current[14] = el)}
          className="fullscreen-section"
        >
          <div className="section-content w-full h-full p-0 max-w-none">
            <PageFooter />
          </div>
        </section>

        {/* Mobile Navigation */}
        <div className="scroll-nav-mobile">
          {Array.from({ length: totalSections }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToSection(index)}
              className={`nav-dot ${activeSection === index ? 'active' : ''}`}
              aria-label={`Go to section ${index + 1}`}
            />
          ))}
        </div>
      </div>
      {/* End of fullscreen-container */}
    </>
  );
};

export default TestPage;
