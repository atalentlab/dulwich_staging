import React, { useEffect, useRef, useState, useMemo } from 'react';
import BlockRenderer from '../components/blocks/BlockRenderer';
import PageFooter from '../components/layout/PageFooter';
import {
  scrollToSection,
  createScrollSpyObserver
} from '../utils/scrollspy';


const ScrollSpyPage = ({
  banner,
  blocks = [],
  header,
  footer,
  selectedSchool,
  availableSchools,
  setSelectedSchool,
  setSelectedSchoolSlug
}) => {
  const [activeSection, setActiveSection] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const contentRef = useRef(null);
  const observerRef = useRef(null);
  const sidebarRef = useRef(null);

  // Scroll chaining: sidebar scrolls first, then hands off to the page
  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const handleWheel = (e) => {
      const { deltaY } = e;
      const { scrollTop, scrollHeight, clientHeight } = sidebar;
      const atTop = scrollTop <= 0 && deltaY < 0;
      const atBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 1 && deltaY > 0;

      if (!atTop && !atBottom) {
        // Sidebar still has room to scroll — take control and scroll it manually.
        // Without preventDefault the browser sends the wheel event to the page instead.
        e.preventDefault();
        e.stopPropagation();
        sidebar.scrollTop += deltaY;
      }
      // When sidebar is at its top/bottom limit, do nothing:
      // the browser will naturally pass the scroll to the page.
    };

    sidebar.addEventListener('wheel', handleWheel, { passive: false });
    return () => sidebar.removeEventListener('wheel', handleWheel);
  }, []);

  // Group consecutive same-type blocks (testimonial, curriculum, openday_carousel)
  const groupedBlocks = useMemo(() => {
    // Filter out video and promo blocks from the page entirely
    const excludedTypes = ['promo', 'promo_new', 'admissions_promo'];
    const filteredBlocks = (blocks || []).filter(block => !excludedTypes.includes(block.type));

    const grouped = [];
    let collectionGroup = [];
    let curriculamGroup = [];
    let opendayGroup = [];

    const flushCollection = () => {
      if (collectionGroup.length > 0) {
        grouped.push({ type: 'collection_block_group', id: `collection-group-${collectionGroup[0].id}`, items: [...collectionGroup] });
        collectionGroup = [];
      }
    };
    const flushCurriculam = () => {
      if (curriculamGroup.length > 0) {
        grouped.push({ type: 'curriculam_group', id: `curriculam-group-${curriculamGroup[0].id}`, items: [...curriculamGroup] });
        curriculamGroup = [];
      }
    };
    const flushOpenday = () => {
      if (opendayGroup.length > 0) {
        grouped.push({ type: 'openday_carousel_group', id: `openday-carousel-group-${opendayGroup[0].id}`, items: [...opendayGroup] });
        opendayGroup = [];
      }
    };

    filteredBlocks.forEach(block => {
      if (block.type === 'testimonial' || block.type === 'quote_card' || block.type === 'staff_quote') {
        flushCurriculam(); flushOpenday();
        collectionGroup.push(block);
      } else if (block.type === 'curriculum') {
        flushCollection(); flushOpenday();
        curriculamGroup.push(block);
      } else if (block.type === 'openday_carousel') {
        flushCollection(); flushCurriculam();
        opendayGroup.push(block);
      } else {
        flushCollection(); flushCurriculam(); flushOpenday();
        grouped.push(block);
      }
    });
    flushCollection(); flushCurriculam(); flushOpenday();
    return grouped;
  }, [blocks]);

  const blockNavItems = useMemo(() => {
    const clean = (str) => (str || '').trim().replace(/\s+/g, ' ');

    const getBestTitle = (block, index) => {
      // 1. Direct block-level fields
      if (block.title) return clean(block.title);
      if (block.subtitle) return clean(block.subtitle);
      if (block.heading) return clean(block.heading);

      // 2. Structured content — named fields (title, subtitle, heading, text, value)
      if (block.content && typeof block.content === 'object' && !Array.isArray(block.content)) {
        const c = block.content;
        const named = clean(c.title || c.subtitle || c.heading || c.text || c.value || null);
        if (named && named.length >= 3) return named;

        // 2b. content.copy — raw HTML used by copy / 2-col-copy / 2-col-image-copy blocks.
        //     ONLY extract text from h1-h5 headings, no-strong tags, or elements with "subtitle" class.
        const copyHtml = c.copy || (c.col && c.col[0] && c.col[0].copy) || null;
        if (copyHtml && typeof copyHtml === 'string' && copyHtml.trim()) {
          const div = document.createElement('div');
          div.innerHTML = copyHtml;

          // ONLY look for heading tags (h1-h5), no-strong tags, and elements with class "subtitle"
          const headingSelectors = 'h1, h2, .subtitle, [class*="subtitle"]';
          const headingEl = div.querySelector(headingSelectors);

          if (headingEl?.textContent?.trim()) {
            const cleaned = clean(headingEl.textContent);
            if (cleaned && cleaned.length >= 3) return cleaned;
          }
        }
      }

      // 3. Grouped blocks — check each item's direct fields, then their content.copy (headings only)
      if (block.items?.length > 0) {
        for (const item of block.items) {
          if (item.title) return clean(item.title);
          if (item.subtitle) return clean(item.subtitle);
          if (item.heading) return clean(item.heading);
          // Also try item's content.copy - ONLY extract from headings, no-strong tags, or subtitle classes
          const itemCopy = item.content?.copy;
          if (itemCopy && typeof itemCopy === 'string' && itemCopy.trim()) {
            const div = document.createElement('div');
            div.innerHTML = itemCopy;
            const headingSelectors = 'h1, h2, .subtitle, [class*="subtitle"]';
            const headingEl = div.querySelector(headingSelectors);
            if (headingEl?.textContent?.trim()) {
              const cleaned = clean(headingEl.textContent);
              if (cleaned && cleaned.length >= 3) return cleaned;
            }
          }
        }
      }

      // 4. HTML parsing — block.content is a raw HTML string (legacy) - headings and no-strong tags only
      if (typeof block.content === 'string' && block.content.trim()) {
        const div = document.createElement('div');
        div.innerHTML = block.content;

        // Check for subtitle class first
        const subtitle = div.querySelector('.subtitle, [class*="subtitle"]');
        if (subtitle?.textContent?.trim()) return clean(subtitle.textContent);

        // Then check for headings and no-strong tags in order of preference
        const orderedTags = ['h1', 'h2'];
        for (const tag of orderedTags) {
          const el = div.querySelector(tag);
          if (el?.textContent?.trim()) return clean(el.textContent);
        }
      }

      // 5. Friendly fallbacks
      const typeMap = {
        curriculam_group: 'Our Curriculum',
        collection_block_group: 'Testimonials & Quotes',
        openday_carousel_group: 'Open Days & Events',
        testimonial: 'Parent Voices',
      };

      return typeMap[block.type] || null;
    };

    // Define which block types should NOT appear in the sidebar list
    const hiddenInNavTypes = ['text_block', 'cta', '2-col-cta', '2-col-image'];

    return groupedBlocks
      .map((block, index) => {
        const title = getBestTitle(block, index);
        // Skip if block type is in hidden list OR if no meaningful title was found
        if (hiddenInNavTypes.includes(block.type) || !title || title.length < 3) return null;

        return { id: `block-${index}`, title, index };
      })
      .filter(Boolean);
  }, [groupedBlocks]);
  // Scroll spy — observe each grouped section
  useEffect(() => {
    if (!contentRef.current) return;

    // Observe the actual section containers we created in the map function
    const sections = contentRef.current.querySelectorAll('.scrollspy-block-section');

    if (sections.length === 0) return;

    // Ensure setActiveSection receives the ID of the section (e.g., "block-0")
    observerRef.current = createScrollSpyObserver((id) => {
      setActiveSection(id);
    });

    sections.forEach((section) => observerRef.current.observe(section));

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [groupedBlocks]); // Re-run if blocks change

  // Handle scroll to section
  const handleScrollToSection = (id) => {
    scrollToSection(id, -100);
    // Close mobile menu after clicking
    if (window.innerWidth <= 768) {
      setIsMobileMenuOpen(false);
    }
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <style>{`
  

        /* Main Container */
        .scrollspy-page {
          display: block;
          max-width: 1600px;
          width: 100%;
          margin: 0 auto;
          min-height: 100vh;
        }

        /* ============================================
           LEFT SIDEBAR - BLOCK NAVIGATION
           ============================================ */
        .scrollspy-sidebar {
          position: sticky;
          top: 140px;
          width: 280px;
          height: fit-content;
          padding: 2rem 1.5rem;
          background: linear-gradient(135deg, #FAF7F5 0%, #F5F1EE 100%);
          border-right: 2px solid #E3D9D1;
          overflow-y: auto;
          max-height: calc(100vh - 160px);
          box-shadow: 2px 0 8px rgba(0, 0, 0, 0.03);
          transition: transform 0.3s ease;
        }

        .scrollspy-nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .scrollspy-nav-item {
          display: block;
          padding: 0.75rem 1rem;
          margin-bottom: 0.5rem;
     
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          border-left: 4px solid transparent;
          border-radius: 0 6px 6px 0;
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .scrollspy-nav-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 0;
          height: 100%;
          background: rgba(211, 0, 19, 0.08);
          transition: width 0.3s ease;
          z-index: 0;
        }

        .scrollspy-nav-item:hover::before {
          width: 100%;
        }

        .scrollspy-nav-item:hover {
          color: #D30013;
          border-left-color: #D30013;
          transform: translateX(4px);
        }

        .scrollspy-nav-item.active {
          color: #D30013;
          font-weight: 700;
          background: rgba(211, 0, 19, 0.12);
          border-left-color: #D30013;
          box-shadow: 0 2px 8px rgba(211, 0, 19, 0.15);
        }

        .scrollspy-nav-item.active::before {
          width: 100%;
        }

        /* ============================================
           MAIN CONTENT AREA
           ============================================ */
        .scrollspy-content {
          margin-left: 300px;
          padding: 160px 4rem 4rem 4rem;
          min-width: 0;
          background: #FFFFFF;
          overflow: hidden;
        }

        .scrollspy-page-title {
          font-size: 48px;
          font-weight: bold;
          color: #9E1422;
          margin-bottom: 1rem;
          line-height: 1.2;
          text-align:left;
        }

        .scrollspy-page-description {
          font-size: 18px;
          color: #6B7280;
          margin-bottom: 3rem;
          text-align:left;
          line-height: 1.6;
        }

        /* Block Section Container */
        .scrollspy-block-section {
        
          scroll-margin-top: 120px;
        }

        .scrollspy-block-section:last-child {
          border-bottom: none;
          margin-bottom: 2rem;
        }

        /* Block Section Title */
        .scrollspy-block-title {
          color: #9E1422;
          font-size: 32px;
          font-weight: bold;
          margin-top: 0;
          margin-bottom: 2rem;
          padding-bottom: 0.75rem;
          border-bottom: 3px solid #D30013;
          display: inline-block;
          position: relative;
        }

        .scrollspy-block-title::after {
          content: '';
          position: absolute;
          bottom: -3px;
          left: 0;
          width: 60%;
          height: 3px;
          background: linear-gradient(90deg, #D30013 0%, transparent 100%);
        }

        /* Content Headings */
        .scrollspy-content h2 {
          font-weight: 600;
          margin-top: 2.5rem;
          margin-bottom: 1.25rem;
          scroll-margin-top: 120px;
        }

        .scrollspy-content h3 {
        
          font-size: 22px;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 1rem;
          scroll-margin-top: 120px;
        }

        .scrollspy-content p {

          font-size: 16px;
          line-height: 1.8;
          margin-bottom: 1.25rem;
        }

        /* Subtitle styling */
        .scrollspy-content .subtitle {
          color: rgb(55, 65, 81);
          font-size: 24px;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }

        /* ============================================
           RIGHT SIDEBAR - ANCHOR NAVIGATION
           ============================================ */
        .scrollspy-anchors {
          position: fixed;
          top: 0;
          left: max(0px, calc(50vw - 800px));
          width: 300px;
          height: calc(100vh - 160px);
          padding: 160px 1.5rem 2rem;
          background: #FFFFFF;
          overflow-y: auto;
          z-index: 10;
        }

        // .scrollspy-anchors-header {
        //   margin-bottom: 1.5rem;
        //   padding-bottom: 1rem;
        //   border-bottom: 2px solid #E3D9D1;
        // }

        .scrollspy-anchors-title {
          font-size: 14px;
          font-weight: bold;
          color: #9E1422;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .scrollspy-anchor-list {
        text-align:left;
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .scrollspy-anchor-item {
          display: block;
          padding: 0.7rem 0;
          padding-left: 1.5rem;
          color: #6B7280;
          text-decoration: none;
          font-size: 14px;
          transition: all 0.2s ease;
          cursor: pointer;
          position: relative;
        }

        .scrollspy-anchor-item:before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 5px;
          height: 100%;
          background-color: #F2EDE9;
          border-radius: 10px;
          transition: all 0.3s ease;
         
        }

        .scrollspy-anchor-item:hover {
          color: #D30013;
          padding-left: 1.5rem;
        }

        .scrollspy-anchor-item:hover:before {
          background-color: #D30013;
          height: 100%;
        }

        .scrollspy-anchor-item.active {
          color: #D30013;
          font-weight: 600;
          padding-left: 1.5rem;
        }

        .scrollspy-anchor-item.active:before {
          background-color: #D30013;
          height: 100%;
        }

        .scrollspy-anchor-item.level-h2 {
          font-weight: 600;
    
          font-size: 15px;
        }

        .scrollspy-anchor-item.level-h3 {
          padding-left: 1.75rem;
          font-size: 13px;
        }

        .scrollspy-anchor-item.level-h3:hover,
        .scrollspy-anchor-item.level-h3.active {
          padding-left: 2rem;
        }

        /* ============================================
           MOBILE MENU TOGGLE BUTTON
           ============================================ */
        .scrollspy-mobile-toggle {
          display: none;
          position: fixed;
          bottom: 2rem;
          left: 1rem;
          z-index: 1000;
          background: #D30013;
          color: white;
          border: none;
          border-radius: 50%;
          width: 56px;
          height: 56px;
          box-shadow: 0 4px 12px rgba(211, 0, 19, 0.4);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .scrollspy-mobile-toggle:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(211, 0, 19, 0.5);
        }

        .scrollspy-mobile-toggle svg {
          width: 24px;
          height: 24px;
        }

        /* Empty State */
        .scrollspy-empty {
          text-align: center;
          padding: 4rem 2rem;
          color: #9CA3AF;
        }

        /* ============================================
           RESPONSIVE DESIGN
           ============================================ */

        /* Tablet - Hide sidebar */
        @media (max-width: 1280px) {
          .scrollspy-anchors { display: none; }
          .scrollspy-content { margin-left: 0; padding: 160px 2rem 4rem 3rem; }
        }

        /* Mobile - Stack layout */
        @media (max-width: 768px) {
          .scrollspy-page {
            flex-direction: column;
          }

          .scrollspy-sidebar {
            position: fixed;
            top: 80px;
            left: 0;
            width: 280px;
            height: calc(100vh - 80px);
            max-height: calc(100vh - 80px);
            z-index: 999;
            transform: translateX(-100%);
            box-shadow: 4px 0 12px rgba(0, 0, 0, 0.1);
          }

          .scrollspy-sidebar.mobile-open {
            transform: translateX(0);
          }

          .scrollspy-content {
            max-width: 100%;
            padding: 1.5rem 1rem;
          }

          .scrollspy-page-title {
            font-size: 32px;
          }

          .scrollspy-block-title {
            font-size: 24px;
          }

          .scrollspy-mobile-toggle {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          /* Mobile overlay */
          .scrollspy-overlay {
            display: none;
            position: fixed;
            top: 80px;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 998;
          }

          .scrollspy-overlay.active {
            display: block;
          }
        }

        /* Small mobile */
        @media (max-width: 480px) {
          .scrollspy-content {
            padding: 1rem 0.75rem;
          }

          .scrollspy-page-title {
            font-size: 28px;
          }

          .scrollspy-block-title {
            font-size: 20px;
          }

          .scrollspy-sidebar {
            width: 260px;
          }
        }

        /* Smooth scrollbar styling */
        .scrollspy-sidebar::-webkit-scrollbar,
        .scrollspy-anchors::-webkit-scrollbar {
          width: 6px;
        }

        .scrollspy-sidebar::-webkit-scrollbar-track,
        .scrollspy-anchors::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
        }

        .scrollspy-sidebar::-webkit-scrollbar-thumb,
        .scrollspy-anchors::-webkit-scrollbar-thumb {
          background: #D30013;
          border-radius: 3px;
        }

        .scrollspy-sidebar::-webkit-scrollbar-thumb:hover,
        .scrollspy-anchors::-webkit-scrollbar-thumb:hover {
          background: #9E1422;
        }
      `}</style>

      <div className="scrollspy-page w-full">


        {/* Mobile Overlay */}
        <div
          className={`scrollspy-overlay `}
          onClick={toggleMobileMenu}
        />

        {/* Main Content */}
        <main className="scrollspy-content" ref={contentRef}>
          {/* Page Header */}
          {banner && banner.title && (
            <div>
              <h1 className="scrollspy-page-title">{banner.title}</h1>
              {banner.description && (
                <p className="scrollspy-page-description">{banner.description}</p>
              )}
            </div>
          )}

          {/* Content Blocks */}
          {groupedBlocks && groupedBlocks.length > 0 ? (
            <>
              {groupedBlocks.map((block, index) => {
                return (
                  <section
                    key={block.id || index}
                    id={`block-${index}`}
                    className="scrollspy-block-section"
                  >
                    {/* Block Content */}
                    <BlockRenderer
                      blocks={block.items || [block]}
                      header={header}
                      footer={footer}
                    />
                  </section>
                );
              })}
            </>
          ) : (
            <div className="scrollspy-empty">
              <p>No content blocks available for this page.</p>
            </div>
          )}
        </main>

        {/* Right Sidebar - Section Navigation */}
        {blockNavItems.length > 0 && (
          <aside className="scrollspy-anchors" ref={sidebarRef}>
            <div className="scrollspy-anchors-header">
              {/* <div className="scrollspy-anchors-title">On This Page</div> */}
            </div>
            <nav>
              <ul className="scrollspy-anchor-list">
                {blockNavItems.map((item) => (
                  <li key={item.id}>
                    <a
                      className={`scrollspy-anchor-item ${activeSection === item.id ? 'active' : ''}`}
                      onClick={() => handleScrollToSection(item.id)}
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        )}


        {/* Mobile Menu Toggle Button */}
        {/* <button
          className="scrollspy-mobile-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button> */}
      </div>

      {/* Footer — position: relative + z-index: 20 so it renders above the fixed sidebar (z-index: 10) */}
      <div style={{ position: 'relative', zIndex: 20 }}>
        <PageFooter
          selectedSchool={selectedSchool}
          availableSchools={availableSchools}
          setSelectedSchool={setSelectedSchool}
          setSelectedSchoolSlug={setSelectedSchoolSlug}
        />
      </div>
    </>
  );
};

export default ScrollSpyPage;
