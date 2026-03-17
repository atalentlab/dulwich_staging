import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GalleryScrollSlider from '../components/GalleryScrollSlider';
import LiveWorldWiseGrid from '../components/LiveWorldWiseGrid';
import HomeBanner from '../components/HomeBanner';
import AccordionSection from '../components/AccordionSection';
// import BuildingBridges from '../components/BuildingBridges';
import Testimonials from '../components/Testimonials';
import SchoolLocations from '../components/SchoolLocations';
import Admissions from '../components/Admissions';
import Footer from '../components/Footer';
import AIChatAssistant from '../components/AIChatAssistant';
import Header from '../components/Header';
import EventTimeline from '../components/EventTimeline';
import CopyBlock from '../components/CopyBlock';
import ThreeGridCard from '../components/ThreeGridCard';
import PromoExtraLarge from '../components/promoCards/promoExtraLarge';
import PromoLarge2col from '../components/promoCards/promoLarge2col';
import PromoCard3col from '../components/promoCards/promoCard3col';
import PromoCard4col from '../components/promoCards/promoCard4col';
import PromoMicro from '../components/promoCards/promoMicro';
import DataGrid from './DataGrid';

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
          { id: 9, slug: 'suzhou-high-school', title: 'Suzhou High School' },
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
        <HomeBanner
            sectionRefs={sectionRefs}
            isVisible={isVisible}
        />
          {/* Data Grid - Statistics */}
           <DataGrid />

             {/* Accordion Section */}
             <AccordionSection
            sectionRefs={sectionRefs}
            isVisible={isVisible}
            expandedSection={expandedSection}
            toggleSection={toggleSection}
        />

        {/* Eligibility Requirements Promo */}
        <PromoExtraLarge
            image="https://dulwich-eimstaging.oss-cn-shanghai.aliyuncs.com/thumbs/articles/fit/600x324/8fb883c3-194b-4b45-bdab-a2e758c5ecea-20240522-114733-921.jpeg"
            imageAlt="Students at Dulwich College"
            title="Eligibility Requirements"
            description="Check if you meet the criteria set out by the Shanghai Municipal Education Commission (SMEC)."
            buttonText="Check Eligibility"
            buttonLink="/admissions/eligibility"
            onButtonClick={() => {
              console.log("Check Eligibility clicked");
            }}
        />

              {/* Eligibility Requirements Promo */}
              <PromoExtraLarge
            image="https://dulwich-eimstaging.oss-cn-shanghai.aliyuncs.com/thumbs/articles/fit/600x324/8fb883c3-194b-4b45-bdab-a2e758c5ecea-20240522-114733-921.jpeg"
            imageAlt="Students at Dulwich College"
            title="Eligibility "
            description="Check if you meet the criteria set out by the Shanghai Municipal Education Commission (SMEC)."
            buttonText="Check Eligibility"
            buttonLink="/admissions/eligibility"
            onButtonClick={() => {
              console.log("Check Eligibility clicked");
            }}
        />

        {/* Two Column Promo Cards */}
        <PromoLarge2col
          card1={{
            image: "https://dulwich-eimstaging.oss-cn-shanghai.aliyuncs.com/thumbs/articles/fit/600x324/8fb883c3-194b-4b45-bdab-a2e758c5ecea-20240522-114733-921.jpeg",
            imageAlt: "Students at Dulwich College",
            title: "Eligibility Requirements",
            description: "Check if you meet the criteria set out by the Shanghai Municipal Education Commission (SMEC).",
            buttonText: "Check Eligibility",
            buttonLink: "/admissions/eligibility",
            onButtonClick: () => console.log("Card 1 - Check Eligibility clicked")
          }}
          card2={{
            image: "https://assets.dulwich.org/thumbs/articles/fit/600x324/weixin-image-2025-09-16-140743-825.jpg",
            imageAlt: "Dulwich College Campus",
            title: "Eligibility Requirements",
            description: "Check if you meet the criteria set out by the Shanghai Municipal Education Commission (SMEC).",
            buttonText: "Check Eligibility",
            buttonLink: "/admissions/how-to-apply",
            onButtonClick: () => console.log("Card 2 - How to Apply clicked")
          }}
          backgroundColor="#FFFFFF"
        />

        {/* Three Column Promo Cards */}
        <PromoCard3col
          card1={{
            image: "https://dulwich-eimstaging.oss-cn-shanghai.aliyuncs.com/thumbs/articles/fit/600x324/8fb883c3-194b-4b45-bdab-a2e758c5ecea-20240522-114733-921.jpeg",
            imageAlt: "Students at Dulwich College",
            title: "Eligibility Requirements",
            description: "Check if you meet the criteria set out by the Shanghai Municipal Education Commission (SMEC).",
            buttonText: "Check Eligibility",
            buttonLink: "/admissions/eligibility",
            onButtonClick: () => console.log("Card 1 clicked")
          }}
          card2={{
            image: "https://assets.dulwich.org/thumbs/articles/fit/600x324/weixin-image-2025-09-16-140743-825.jpg",
            imageAlt: "Dulwich College Campus",
            title: "Eligibility Requirements",
            description: "Check if you meet the criteria set out by the Shanghai Municipal Education Commission (SMEC).",
            buttonText: "Check Eligibility",
            buttonLink: "/admissions/how-to-apply",
            onButtonClick: () => console.log("Card 2 clicked")
          }}
          card3={{
            image: "https://dulwich-eimstaging.oss-cn-shanghai.aliyuncs.com/thumbs/articles/fit/600x324/signing-10.jpg",
            imageAlt: "Student Activities",
            title: "Eligibility Requirements",
            description: "Check if you meet the criteria set out by the Shanghai Municipal Education Commission (SMEC).",
            buttonText: "Check Eligibility",
            buttonLink: "/admissions/visit",
            onButtonClick: () => console.log("Card 3 clicked")
          }}
          backgroundColor="#F8F9FA"
        />

        {/* Four Column Promo Cards */}
        <PromoCard4col
          sectionTitle="Admissions Information"
          sectionDescription="Optional Intro. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris ni"
          card1={{
            image: "https://dulwich-eimstaging.oss-cn-shanghai.aliyuncs.com/thumbs/articles/fit/600x324/8fb883c3-194b-4b45-bdab-a2e758c5ecea-20240522-114733-921.jpeg",
            imageAlt: "Students at Dulwich College",
            title: "Eligibility Requirements",
            description: "Check if you meet the criteria set out by the Shanghai Municipal Education Commission (SMEC).",
            buttonText: "Check Eligibility",
            buttonLink: "/admissions/eligibility"
          }}
          card2={{
            image: "https://assets.dulwich.org/thumbs/articles/fit/600x324/weixin-image-2025-09-16-140743-825.jpg",
            imageAlt: "How to Apply",
            title: "Eligibility Requirements",
            description: "Check if you meet the criteria set out by the Shanghai Municipal Education Commission (SMEC).",
            buttonText: "Check Eligibility",
            buttonLink: "/admissions/how-to-apply"
          }}
          card3={{
            image: "https://dulwich-eimstaging.oss-cn-shanghai.aliyuncs.com/thumbs/articles/fit/600x324/signing-10.jpg",
            imageAlt: "Admissions Fees",
            title: "Eligibility Requirements",
            description: "Check if you meet the criteria set out by the Shanghai Municipal Education Commission (SMEC).",
            buttonText: "Check Eligibility",
            buttonLink: "/admissions/fees"
          }}
          card4={{
            image: "https://dulwich-eimstaging.oss-cn-shanghai.aliyuncs.com/thumbs/articles/fit/600x324/8fb883c3-194b-4b45-bdab-a2e758c5ecea-20240522-114733-921.jpeg",
            imageAlt: "Visit Us",
            title: "Eligibility Requirements",
            description: "Check if you meet the criteria set out by the Shanghai Municipal Education Commission (SMEC).",
            buttonText: "Check Eligibility",
            buttonLink: "/admissions/visit"
          }}
          backgroundColor="#FFFFFF"
        />

        {/* Micro Promo Cards */}
        <PromoMicro
          sectionTitle="Quick Links"
          sectionDescription="Explore key resources and information about Dulwich College admissions, programs, and community life."
          showCTA={true}
          ctaText="Optional CTA"
          ctaLink="#"
          card1={{
            image: "https://dulwich-eimstaging.oss-cn-shanghai.aliyuncs.com/thumbs/articles/fit/600x324/8fb883c3-194b-4b45-bdab-a2e758c5ecea-20240522-114733-921.jpeg",
            imageAlt: "Eligibility",
            title: "Eligibility Requirements",
            link: "/admissions/eligibility"
          }}
          card2={{
            image: "https://assets.dulwich.org/thumbs/articles/fit/600x324/weixin-image-2025-09-16-140743-825.jpg",
            imageAlt: "How to Apply",
            title: "Eligibility Requirements",
            link: "/admissions/how-to-apply"
          }}
          card3={{
            image: "https://dulwich-eimstaging.oss-cn-shanghai.aliyuncs.com/thumbs/articles/fit/600x324/signing-10.jpg",
            imageAlt: "Fees",
            title: "Eligibility Requirements",
            link: "/admissions/fees"
          }}
          card4={{
            image: "https://dulwich-eimstaging.oss-cn-shanghai.aliyuncs.com/thumbs/articles/fit/600x324/8fb883c3-194b-4b45-bdab-a2e758c5ecea-20240522-114733-921.jpeg",
            imageAlt: "Visit",
            title: "Eligibility Requirements",
            link: "/admissions/visit"
          }}
         
        />

        {/* Join the Dulwich Family CTA */}
        <CopyBlock
            title="Join the Dulwich Family"
            content={[
              "We proudly welcome international students from all backgrounds who meet our academic entry requirements and admissions criteria.",
              "We invite you to consider joining the Dulwich family. Our vibrant environment fosters growth across all areas of college life, offering a holistic education for your child. Are you ready to embark on this exciting journey with us?",
              "Join our Open House or submit your registration of interest for your child/children."
            ]}
            buttonText="Check Eligibility"
            buttonLink="/admissions"
            onButtonClick={() => {
              // Add your navigation logic or scroll to admissions section
              console.log("Check Eligibility clicked");
            }}
        />


        {/* Gallery Scroll Slider - Exact Rivian Style */}
        <GalleryScrollSlider
            sectionRefs={sectionRefs}
            isVisible={isVisible}
            galleryContainerRef={galleryContainerRef}
            galleryInnerRef={galleryInnerRef}
        />

   
        {/* Live World Wise Grid Section */}
        <LiveWorldWiseGrid
            sectionRefs={sectionRefs}
            isVisible={isVisible}
            liveWorldWiseState={liveWorldWiseState}
            expandedView={expandedView}
            handleExpandView={handleExpandView}
            handleCloseExpandView={handleCloseExpandView}
        />

        <Testimonials
            sectionRefs={sectionRefs}
            isVisible={isVisible}
        />

        {/* <EventSlider /> */}
         {/* Three Grid Card - Experience Dulwich */}
         <ThreeGridCard />

        {/* Event Timeline */}
        <EventTimeline />

      

        <SchoolLocations
            sectionRefs={sectionRefs}
            isVisible={isVisible}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            selectedSchool={selectedSchool}
            setSelectedSchool={setSelectedSchool}
            globeRef={globeRef}
        />

        <Admissions
            sectionRefs={sectionRefs}
            isVisible={isVisible}
        />

        <Footer
            sectionRefs={sectionRefs}
            isVisible={isVisible}
            availableSchools={availableSchools}
            selectedSchool={selectedSchool}
            setSelectedSchool={setSelectedSchool}
            setSelectedSchoolSlug={setSelectedSchoolSlug}
        />

        <AIChatAssistant
            chatOpen={chatOpen}
            setChatOpen={setChatOpen}
            chatMessages={chatMessages}
            setChatMessages={setChatMessages}
            chatMessage={chatMessage}
            setChatMessage={setChatMessage}
            handleSendMessage={handleSendMessage}
            chatMessagesEndRef={chatMessagesEndRef}
            selectedSchoolSlug={selectedSchoolSlug}
        />

      </div>
  );
}

export default Home;
