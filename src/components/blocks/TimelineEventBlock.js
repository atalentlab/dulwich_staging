import React, { useState, useEffect, useRef, useCallback } from 'react';
import './TimelineEventBlock.css';

/**
 * TimelineEventBlock Component
 * Vertical timeline — left sticky nav, right panel slides via CSS translateY.
 * No browser scroll on the right panel, so the page never scrolls
 * when the user wheels over the content area.
 */
const TimelineEventBlock = ({ content }) => {
  const { timeline_event = [], 'anchor-id': anchorId, locale } = content;
  const [events, setEvents]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef    = useRef(null);
  const targetIndexRef  = useRef(0);
  const isAnimatingRef  = useRef(false);
  const lastScrollTime  = useRef(0);

  /* ── fetch ────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (timeline_event.length > 0) fetchTimelineEvents();
    else setLoading(false);
  }, [timeline_event, locale]);

  const fetchTimelineEvents = async () => {
    try {
      setLoading(true);
      const promises = timeline_event.map(id =>
        fetch(`https://www.dulwich.atalent.xyz/api/timeline_events_by_id?event_id=${id}${locale ? `&locale=${locale}` : ''}`)
          .then(r => r.json())
          .then(d => (d.success && Array.isArray(d.data) ? d.data : []))
          .catch(() => [])
      );
      const all = (await Promise.all(promises)).flat()
        .filter(e => e.published === 1)
        .sort((a, b) => a.order - b.order);
      setEvents(all);
    } catch (e) {
      console.error('Error fetching timeline events:', e);
    } finally {
      setLoading(false);
    }
  };

  /* ── navigate to an index ─────────────────────────────────────────── */
  const goTo = useCallback((index, eventsLen) => {
    if (isAnimatingRef.current) return;
    const clamped = Math.min(Math.max(index, 0), eventsLen - 1);
    if (clamped === targetIndexRef.current) return;
    isAnimatingRef.current = true;
    targetIndexRef.current = clamped;
    setActiveIndex(clamped);
    setTimeout(() => { isAnimatingRef.current = false; }, 950);
  }, []);

  /* ── wheel on right panel — page never scrolls ────────────────────── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el || events.length === 0) return;

    const onWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      el.scrollTop = 0;
      // Filter tiny inertia ticks (trackpad deceleration)
      if (Math.abs(e.deltaY) < 20) return;
      // Throttle: ignore wheel events within 1500ms of the last navigation
      const now = Date.now();
      if (now - lastScrollTime.current < 1150) return;
      lastScrollTime.current = now;
      const dir = e.deltaY > 0 ? 1 : -1;
      goTo(targetIndexRef.current + dir, events.length);
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [events, goTo]);

  /* ── render ───────────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D30013]" />
      </div>
    );
  }

  if (events.length === 0) return null;

  return (
    <section data-id={anchorId} className="py-10 bg-white">
      <div className="max-w-[1248px] mx-auto flex items-start gap-14 px-5 max-md:flex-col max-md:gap-6">

        {/* Left Navigation */}
        <nav className="w-[200px] flex-shrink-0 sticky top-[100px] self-center max-lg:w-[170px] max-md:relative max-md:top-auto max-md:w-full max-md:overflow-x-auto">
          <div className="relative flex flex-col max-md:flex-row max-md:pb-1">

            {/* Connecting line */}
            <div className="absolute left-[23px] top-6 bottom-6 w-[2px] bg-[#9E1422] z-0 max-lg:left-[17px] max-md:left-[10%] max-md:right-[10%] max-md:top-[18px] max-md:bottom-auto max-md:w-auto max-md:h-[2px]" />

            {events.map((event, i) => (
              <button
                key={event.id}
                onClick={() => goTo(i, events.length)}
                className="flex items-center gap-5 py-3.5 border-none bg-transparent cursor-pointer relative z-[1] text-left max-md:flex-1 max-md:flex-col max-md:gap-1.5 max-md:py-0 max-md:px-1 max-md:items-center"
              >
                <span
                  className={`w-12 h-12 rounded-full border-2 border-[#9E1422] text-[14px] font-semibold flex items-center justify-center flex-shrink-0 transition-all duration-300 max-lg:w-9 max-lg:h-9 max-lg:text-[13px] max-md:w-9 max-md:h-9 max-md:text-[13px] ${
                    i <= activeIndex ? 'bg-[#9E1422] text-white' : 'bg-white text-[#9E1422]'
                  } ${
                    i === activeIndex ? 'scale-[1.2] shadow-[0_3px_10px_rgba(139,26,43,0.35)]' : ''
                  }`}
                >
                  {i + 1}
                </span>
                <span
                  className={`text-[20px] transition-all duration-300 whitespace-nowrap hover:text-[#8b1a2b] max-lg:text-[13px] max-md:text-[10px] max-md:whitespace-normal max-md:text-center max-md:leading-tight ${
                    i <= activeIndex ? 'font-semibold text-[#3C3737]' : 'font-medium text-[#3C3737]'
                  }`}
                >
                  {event['title-min'] || event.title}
                </span>
              </button>
            ))}
          </div>
        </nav>

        {/* Right panel — overflow:hidden, items slide via CSS translateY */}
        <div
          ref={containerRef}
          className="flex-1 max-md:flex-none max-md:w-full relative h-[620px] overflow-hidden rounded-2xl max-lg:h-[480px] max-md:h-[500px] max-md:rounded-xl border bottom-[#F2EDE9]"
          onScroll={e => { e.currentTarget.scrollTop = 0; }}>
          {events.map((event, i) => (
            <div
              key={event.id}
              className="absolute inset-0 flex items-center bg-[#FAF7F5] max-md:overflow-y-auto"
              style={{
                transform: `translateY(${(i - activeIndex) * 100}%)`,
                transition: 'transform 0.9s cubic-bezier(0.42, 0, 0.58, 1)',
              }}
            >
              {/* Red vertical line — starts at circle for first, ends at circle for last, full height for middle */}
              <div
                className="absolute left-[90px] w-[2px] bg-[#9E1422] z-0 max-md:left-[30px]"
                style={{
                  top: i === 0 ? '50%' : 0,
                  bottom: i === events.length - 1 ? '50%' : 0,
                  boxShadow: '0 0 4px 0px rgba(158,20,34,0.45)',
                }}
              />

              {/* Numbered circle */}
              <div className="w-[64px] h-[64px] relative left-[59px] flex-shrink-0 rounded-full bg-[#8b1a2b] text-white text-[36px] font-bold flex items-center justify-center z-[1] max-lg:w-11 max-lg:h-11 max-lg:text-lg max-md:w-10 max-md:h-10 max-md:text-base">
                {i + 1}
              </div>

              {/* Content */}
              <div className="py-[60px] pr-[60px] pl-[100px] w-full text-left max-lg:py-[50px] max-lg:pr-10 max-lg:pl-[90px] max-md:py-10 max-md:pr-6 max-md:pl-[70px]">
                <h3 className="text-[36px] font-bold text-[#3C3737] mb-5 leading-tight max-lg:text-[26px] max-md:text-[22px] max-md:mb-3.5">
                  {event.title}
                </h3>
                {event.content && (
                  <div
                    className="text-[16px] leading-[1.7] text-[#3C3737] mb-5 max-md:text-sm max-md:leading-[1.7] [&_p]:mb-3 [&_p:last-child]:mb-0 [&_strong]:text-[#333] [&_strong]:font-semibold [&_b]:text-[#333] [&_b]:font-semibold"
                    dangerouslySetInnerHTML={{ __html: event.content }}
                  />
                )}
                {/* json_content items: cta buttons and copy text */}
                {Array.isArray(event.json_content) && event.json_content.length > 0 && (
                  <div className="flex flex-col gap-4">
                    {event.json_content.map((item, idx) => {
                      if (item.type === 'cta') {
                        const href = item.cta_type === 'external_link'
                          ? (item.cta_link || '#')
                          : (item.contextual_link_data?.url || (item.cta_page ? `/page/${item.cta_page}` : '#'));
                        return (
                          <a
                            key={idx}
                            href={href}
                            {...(item.cta_type === 'external_link' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                            className="inline-block self-start py-2.5 px-6 border border-[#D30013] rounded-lg text-[#D30013] text-[16px] font-medium no-underline transition-all duration-300 bg-transparent hover:bg-[#D30013] hover:text-white"
                          >
                            {item.cta}
                          </a>
                        );
                      }
                      if (item.type === 'copy') {
                        return (
                          <div
                            key={idx}
                            className="text-[15px] leading-[1.7] text-[#3C3737] [&_p]:mb-3 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_b]:font-semibold"
                            dangerouslySetInnerHTML={{ __html: item.copy_text }}
                          />
                        );
                      }
                      return null;
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TimelineEventBlock;
