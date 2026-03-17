import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LiveWorldWiseGrid from '../components/LiveWorldWiseGrid';
import HomeBanner from '../components/HomeBanner';
import AcademicResultSpinner from '../components/AcademicResultSpinner';
import Footer from '../components/layout/school/PageFooter';
import Header from '../components/layout/school/PageHeadersg';
import ImageBlock from '../components/ImageBlock';
import TextBlock from '../components/TextBlock';
import HistorySlider from '../components/HistorySlider';
import EyeText from '../components/eyeText';
import DCSZ_Chevron_KV_3840x2160_20260123 from '../assets/images/DCSZ/DCSZ_Chevron_KV_3840x2160_20260123.png';
import HolisticCurriculumBlock from '../components/blocks/HolisticCurriculumBlock';


gsap.registerPlugin(ScrollTrigger);

function Home() {
  const [expandedSection, setExpandedSection] = useState(null);
  const [isVisible, setIsVisible] = useState({});
  const [counters, setCounters] = useState({ '37.5': 0, '7': 0, '100': 0, '2025': 2025 });
  const [selectedLocation, setSelectedLocation] = useState('Shanghai');
  const [selectedSchool, setSelectedSchool] = useState('Dulwich College International');
  const [selectedSchoolSlug, setSelectedSchoolSlug] = useState(''); // Empty string matches International school slug
  const [availableSchools, setAvailableSchools] = useState([]);
  const [liveWorldWiseState, setLiveWorldWiseState] = useState({
    live: { icon: 'bird', text: 'Ducks' },
    world: { icon: 'book', text: 'Juniors' },
    wise: { icon: 'brain', text: 'Wise' }
  });
  const [expandedView, setExpandedView] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, type: 'bot', text: 'Hi, I am the Dulwich AI Assistant. How can I help you today?' }
  ]);
  const observerRef = useRef(null);
  const sectionRefs = useRef({});
  const galleryContainerRef = useRef(null);
  const galleryInnerRef = useRef(null);
  const globeRef = useRef(null);
  const chatMessagesEndRef = useRef(null);

  const toggleSection = React.useCallback((section) => {
    setExpandedSection(prev => prev === section ? null : section);
  }, []);

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

  const handleSendMessage = React.useCallback(() => {
    if (!chatMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: chatMessage
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatMessage('');

    // Simulate bot response
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: 'Thank you for your question! Our admissions team will provide you with detailed information shortly.'
      };
      setChatMessages(prev => [...prev, botMessage]);
    }, 1000);
  }, [chatMessage]);

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

  // Prevent body scroll when expanded view is open
  useEffect(() => {
    if (expandedView) {
      // Save current scroll position
      const currentScrollY = window.scrollY;
      setScrollPosition(currentScrollY);

      // Prevent scrolling
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${currentScrollY}px`;
      document.body.style.width = '100%';
    } else {
      // Restore scroll position
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';

      // Restore the scroll position
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

  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (chatMessagesEndRef.current) {
      chatMessagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

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

  // Initialize globe when schools section is visible
  const schoolsVisible = isVisible['schools'];
  useEffect(() => {
    if (globeRef.current && schoolsVisible) {
      // Set initial camera position to Shanghai
      globeRef.current.pointOfView({
        lat: 31.2304,
        lng: 121.4737,
        altitude: 2.5
      }, 0);
    }
  }, [schoolsVisible]);

  // GSAP ScrollTrigger for gallery pinning
  const galleryVisible = isVisible['gallery'];
  useEffect(() => {
    if (galleryContainerRef.current && galleryInnerRef.current && galleryVisible) {
      const container = galleryContainerRef.current;
      const inner = galleryInnerRef.current;

      const scrollWidth = inner.scrollWidth - window.innerWidth;

      const pinTrigger = ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: () => `+=${scrollWidth}`,
        pin: true,
        anticipatePin: 1,
        scrub: true,
        invalidateOnRefresh: true,
      });

      gsap.to(inner, {
        x: () => -(inner.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: () => `+=${scrollWidth}`,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        pinTrigger.kill();
        ScrollTrigger.getAll().forEach(trigger => {
          if (trigger.vars.trigger === container) {
            trigger.kill();
          }
        });
      };
    }
  }, [galleryVisible]);

  // Counter animation for statistics
  const statsVisible = isVisible['stats'];
  useEffect(() => {
    if (statsVisible) {
      const duration = 2000;
      const steps = 60;
      const interval = duration / steps;

      const countersToAnimate = [
        { key: '37.5', target: 37.5, decimals: 1 },
        { key: '7', target: 7, decimals: 0 },
        { key: '100', target: 100, decimals: 0 },
      ];

      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;

        countersToAnimate.forEach(({ key, target, decimals }) => {
          const current = target * progress;
          setCounters((prev) => ({
            ...prev,
            [key]: decimals === 1 ? parseFloat(current.toFixed(1)) : Math.floor(current),
          }));
        });

        if (currentStep >= steps) {
          clearInterval(timer);
          countersToAnimate.forEach(({ key, target, decimals }) => {
            setCounters((prev) => ({
              ...prev,
              [key]: decimals === 1 ? parseFloat(target.toFixed(1)) : target,
            }));
          });
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [statsVisible]);

  return (
    <div className="bg-white scroll-smooth overflow-x-hidden w-full max-w-[100vw]">
      {/* New Header Component */}
      <Header
        selectedSchool={selectedSchool}
        availableSchools={availableSchools}
        setSelectedSchool={setSelectedSchool}
        setSelectedSchoolSlug={setSelectedSchoolSlug}
        setChatOpen={setChatOpen}
        chatOpen={chatOpen}
      />
          <div className="section-content w-full h-full p-0 max-w-none">
            <HolisticCurriculumBlock content={{}} />
          </div>
      <HomeBanner
        sectionRefs={sectionRefs}
        isVisible={isVisible}
      />
          
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

        <div className="items-center h-full max-w-[1120px] m-auto text-left px-0 py-[80px]">
        <EyeText
          eyebrow="CORE CURRICULUM"
          redText="World-class international education for"
          blackText="students aged 2-18"
          align="left"
        />
        </div>
        


      {/* Live World Wise Grid Section */}
      <LiveWorldWiseGrid
        sectionRefs={sectionRefs}
        isVisible={isVisible}
        liveWorldWiseState={liveWorldWiseState}
        expandedView={expandedView}
        handleExpandView={handleExpandView}
        handleCloseExpandView={handleCloseExpandView}
      />

      {/* Curriculum Image Block */}
      <ImageBlock />

      <div className="items-center h-full max-w-[1120px] m-auto text-left px-0 py-[80px]">
      <EyeText
              eyebrow="ACADEMIC EXCELLENCE"
              redText="Some of the highest-performing schools locally,"
              blackText="regionally, and worldwide"
              align="left"
            />
          </div>
  

      {/* Academic Results Spinner */}
      <AcademicResultSpinner />
      <div className="items-center h-full max-w-[1120px] m-auto text-left px-0 py-[80px]">

          <EyeText
              eyebrow="VIBRANT COMMUNITY"
              redText="DCSZ: Where Your Heart Belong"
              blackText=""
              align="left"
            />
          </div>
    
          <HistorySlider />

      <Footer
        sectionRefs={sectionRefs}
        isVisible={isVisible}
        availableSchools={availableSchools}
        selectedSchool={selectedSchool}
        setSelectedSchool={setSelectedSchool}
        setSelectedSchoolSlug={setSelectedSchoolSlug}
      />


    </div>
  );
}

export default Home;