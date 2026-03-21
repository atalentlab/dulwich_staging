import React, { useEffect, useRef, useState, useMemo } from 'react';
import BlockRenderer from '../blocks/BlockRenderer';
import PageFooter from './PageFooter';

/**
 * ScrollSpyLayout Component
 * Displays a left sidebar navigation with scroll spy functionality
 * Used for page_layout_type = 3
 */
const ScrollSpyLayout = ({
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
  const contentRef = useRef(null);
  const observerRef = useRef(null);

  console.log('ScrollSpyLayout blocks:', blocks);

  // Pre-group consecutive collection/curriculum/openday blocks (same logic as BlockRenderer)
  // so they render correctly as grouped components instead of one-by-one
  const groupedBlocks = useMemo(() => {
    const grouped = [];
    let collectionGroup = [];
    let curriculamGroup = [];
    let opendayGroup = [];
    let quoteGroup = [];

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
    const flushQuote = () => {
      if (quoteGroup.length > 0) {
        grouped.push({ type: 'quote_group', id: `quote-group-${quoteGroup[0].id}`, items: [...quoteGroup] });
        quoteGroup = [];
      }
    };

    let articlesBlockSeen = false;

    (blocks || []).forEach(block => {
      // Only keep the first articles block — skip duplicates from CMS
      if (block.type === 'articles') {
        if (articlesBlockSeen) return;
        articlesBlockSeen = true;
      }

      if (block.type === 'testimonial') {
        flushCurriculam(); flushOpenday(); flushQuote();
        collectionGroup.push(block);
      } else if (block.type === 'quote_card' || block.type === 'staff_quote') {
        flushCollection(); flushCurriculam(); flushOpenday();
        quoteGroup.push(block);
      } else if (block.type === 'curriculum') {
        flushCollection(); flushOpenday(); flushQuote();
        curriculamGroup.push(block);
      } else if (block.type === 'openday_carousel') {
        flushCollection(); flushCurriculam(); flushQuote();
        opendayGroup.push(block);
      } else {
        flushCollection(); flushCurriculam(); flushOpenday(); flushQuote();
        grouped.push(block);
      }
    });
    flushCollection(); flushCurriculam(); flushOpenday(); flushQuote();
    console.log('ScrollSpyLayout groupedBlocks:', grouped);
    return grouped;
  }, [blocks]);

  // Extract nav items from grouped blocks
  const blockNavItems = useMemo(() => {
    const getTitle = (content, fallback) => {
      if (!content) return fallback;
      const itemType = content['item-type'];
      if (itemType === 'quote_card') return content.author || content.quotetext || fallback;
      if (itemType === 'staff_quote') return content.author_name || content.sq_quotetext || fallback;
      if (itemType === 'story_card') return content.sc_title || fallback;
      return content.title || content.heading || content.name || fallback;
    };

    return groupedBlocks.map((block, index) => {
      const blockId = `block-${index}`;
      const fallback = `Section ${index + 1}`;
      let title = '';

      if (block.items) {
        // Grouped block — derive title from first item
        const first = block.items[0];
        title = getTitle(first?.content, fallback);
      } else if (block.content && typeof block.content === 'object') {
        title = getTitle(block.content, fallback);
      } else if (block.title) {
        title = block.title;
      } else if (block.content && typeof block.content === 'string') {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = block.content;
        const firstHeading = tempDiv.querySelector('h1, h2, h3, h4');
        title = firstHeading ? firstHeading.textContent : fallback;
      } else {
        title = fallback;
      }

      return { id: blockId, title, index };
    });
  }, [groupedBlocks]);

  // Scroll spy observer
  useEffect(() => {
    if (!contentRef.current) return;
    const sections = contentRef.current.querySelectorAll('[id^="block-"]');
    if (sections.length === 0) return;

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    }, { root: null, rootMargin: '-20% 0px -70% 0px', threshold: 0 });

    sections.forEach(section => observerRef.current.observe(section));
    return () => { if (observerRef.current) observerRef.current.disconnect(); };
  }, [blockNavItems]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <>
      <style>{`
        .scrollspy-layout {
          display: flex;
          align-items: flex-start;
          max-width: 1600px;
          margin: 0 auto;
          min-height: 100vh;
          gap: 0;
        }

        .scrollspy-sidebar {
          position: sticky;
          top: 0;
          height: 100vh;
          width: 300px;
          overflow-y: auto;
          flex-shrink: 0;
          order: 2;
          background: #FFFFFF;
          border-left: 1px solid #E5E7EB;
          padding: 160px 2rem 2rem 2rem;
        }

        .scrollspy-sidebar::-webkit-scrollbar { width: 0; }


        .scrollspy-nav-title {
          font-size: 12px;
          font-weight: 700;
          color: #D30013;
          margin-bottom: 1.5rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .scrollspy-nav-item {
          display: block;
          padding: 0.75rem 0;
          padding-left: 1rem;
          color: #6B7280;
          text-decoration: none;
          font-size: 15px;
          font-weight: 400;
          border-left: 4px solid transparent;
          transition: all 0.2s ease;
          cursor: pointer;
          line-height: 1.5;
        }

        .scrollspy-nav-item:hover {
          color: #374151;
          padding-left: 1.25rem;
        }

        .scrollspy-nav-item.active {
          color: #111827;
          font-weight: 600;
          border-left-color: #D30013;
          padding-left: 1.25rem;
        }

        .scrollspy-content {
          flex: 1;
          padding: 160px 3rem 4rem 4rem;
          max-width: 100%;
          min-width: 0;
          order: 1;
        }

        .scrollspy-content h2 {
          color: #9E1422;
          font-size: 32px;
          font-weight: bold;
          margin-top: 3rem;
          margin-bottom: 1.5rem;
          scroll-margin-top: 120px;
        }

        .scrollspy-content h2:first-child { margin-top: 0; }

        .scrollspy-content h3 {
          color: #3C3C3B;
          font-size: 24px;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 1rem;
          scroll-margin-top: 120px;
        }

        .scrollspy-content p {
          color: #3C3C3B;
          font-size: 16px;
          line-height: 1.8;
          margin-bottom: 1rem;
        }

        .scrollspy-sidebar::-webkit-scrollbar { width: 6px; }
        .scrollspy-sidebar::-webkit-scrollbar-track { background: #F9FAFB; }
        .scrollspy-sidebar::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 3px; }
        .scrollspy-sidebar::-webkit-scrollbar-thumb:hover { background: #9CA3AF; }

        @media (max-width: 1280px) {
          .scrollspy-sidebar { width: 260px; }
          .scrollspy-content { padding: 160px 2rem 4rem 3rem; }
        }

        @media (max-width: 768px) {
          .scrollspy-layout { flex-direction: column; }
          .scrollspy-sidebar {
            position: relative;
            top: 0;
            height: auto;
            width: 100%;
            order: 1;
            border-left: none;
            border-bottom: 1px solid #E3D9D1;
            padding: 100px 1.5rem 1.5rem;
          }
          .scrollspy-content { padding: 1.5rem 1rem 4rem; order: 2; }
        }
      `}</style>

      <div className="scrollspy-layout">
        {/* Main Content */}
        <main className="scrollspy-content" ref={contentRef}>
          {banner && banner.title && (
            <h1 style={{ fontSize: '42px', fontWeight: 'bold', color: '#9E1422', marginBottom: '2rem' }}>
              {banner.title}
            </h1>
          )}

          {groupedBlocks.length > 0 ? (
            groupedBlocks.map((block, index) => (
              <div key={block.id || index} id={`block-${index}`} style={{ scrollMarginTop: '120px' }}>
                <BlockRenderer
                  blocks={block.items || [block]}
                  header={header}
                  footer={footer}
                />
              </div>
            ))
          ) : (
            <div className="py-16 text-center text-gray-500">
              <p>No content blocks available for this page.</p>
            </div>
          )}
        </main>
      </div>

      <PageFooter
        selectedSchool={selectedSchool}
        availableSchools={availableSchools}
        setSelectedSchool={setSelectedSchool}
        setSelectedSchoolSlug={setSelectedSchoolSlug}
      />
    </>
  );
  
};

export default ScrollSpyLayout;
