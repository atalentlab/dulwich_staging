import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function IBRatingBlock({ content }) {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const statRefs = useRef([]);
  const labelRefs = useRef([]);

  const title = content?.title || '2025 IB RESULTS';
  const blocks = content?.['nested-blocks'] || [];
  const ibRatingImage = content?.ib_rating_image || null;

  const sortedBlocks = [...blocks].sort(
    (a, b) => Number(a.weight || 0) - Number(b.weight || 0)
  );

  const values = sortedBlocks.map(b => b.score || '');
  const labels = sortedBlocks.map(b => b.content || '');

  useEffect(() => {
    if (!values.length) return;

    const ctx = gsap.context(() => {
      if (!statRefs.current.length || !labelRefs.current.length) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=250%',
          pin: pinRef.current,
          scrub: 1,
          anticipatePin: 1,
          pinSpacing: true,
        },
      });

      // Initial state
      gsap.set(statRefs.current, { y: 120, opacity: 0 });
      gsap.set(labelRefs.current, { opacity: 0 });

      // Show first item immediately
      gsap.set(statRefs.current[0], { y: 0, opacity: 1 });
      gsap.set(labelRefs.current[0], { opacity: 1 });

      const count = values.length;

      if (count === 2) {
        // Item 1 → Item 2 (stays)
        tl.to(statRefs.current[0], { y: -120, opacity: 0, duration: 0.3 }, 0.25)
          .to(labelRefs.current[0], { opacity: 0, duration: 0.2 }, 0.25)
          .to(statRefs.current[1], { y: 0, opacity: 1, duration: 0.3 }, 0.35)
          .to(labelRefs.current[1], { opacity: 1, duration: 0.2 }, 0.35);
      }
      else if (count === 3) {
        // Item 1 → Item 2 → Item 3 (stays)
        tl.to(statRefs.current[0], { y: -120, opacity: 0, duration: 0.3 }, 0.25)
          .to(labelRefs.current[0], { opacity: 0, duration: 0.2 }, 0.25)
          .to(statRefs.current[1], { y: 0, opacity: 1, duration: 0.3 }, 0.35)
          .to(labelRefs.current[1], { opacity: 1, duration: 0.2 }, 0.35)
          .to(statRefs.current[1], { y: -120, opacity: 0, duration: 0.3 }, 0.6)
          .to(labelRefs.current[1], { opacity: 0, duration: 0.2 }, 0.6)
          .to(statRefs.current[2], { y: 0, opacity: 1, duration: 0.3 }, 0.7)
          .to(labelRefs.current[2], { opacity: 1, duration: 0.2 }, 0.7);
      }
      else if (count > 3) {
        // Dynamic: cycle through all items, last one stays
        let time = 0.25;
        for (let i = 0; i < count - 1; i++) {
          const exitTime = time;
          const enterTime = time + 0.1;

          tl.to(statRefs.current[i], { y: -120, opacity: 0, duration: 0.3 }, exitTime)
            .to(labelRefs.current[i], { opacity: 0, duration: 0.2 }, exitTime)
            .to(statRefs.current[i + 1], { y: 0, opacity: 1, duration: 0.3 }, enterTime)
            .to(labelRefs.current[i + 1], { opacity: 1, duration: 0.2 }, enterTime);

          time += 0.25;
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [values.join(','), labels.join(',')]);

  if (!values.length) return null;

  return (
    <section ref={sectionRef}>
      <div
        ref={pinRef}
        className="h-screen flex items-center justify-center bg-[#9e1422] relative overflow-hidden"
      >
        {/* Background Image - Full Width & Responsive */}
        {ibRatingImage && (
          <img
            src={ibRatingImage}
            alt="IB Rating Background"
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        )}

        {/* Content Overlay */}
        <div className="max-w-7xl w-full px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-16">
            {/* TITLE — top on mobile, left on desktop */}
            <div className="w-full lg:w-[220px] text-center lg:text-right order-1 lg:order-none">
              <p className="text-base lg:text-xl font-semibold tracking-widest uppercase text-white">
                {title}
              </p>
            </div>

            {/* CENTER PILL */}
            <div className="relative order-2 lg:order-none">
              <div className="bg-white rounded-full px-14 py-8 lg:px-32 lg:py-14 shadow-[0_40px_90px_rgba(0,0,0,0.18)]">
                <div className="relative h-[80px] w-[200px] lg:h-[120px] lg:w-[300px] flex items-center justify-center overflow-hidden">
                  {values.map((value, i) => (
                    <div
                      key={i}
                      ref={el => (statRefs.current[i] = el)}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <span className="text-[72px] lg:text-[110px] font-black text-gray-900 leading-none tabular-nums">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* LABEL — below on mobile, right on desktop */}
            <div className="w-full lg:w-[260px] relative h-[36px] lg:h-[40px] order-3 lg:order-none">
              {labels.map((label, i) => (
                <p
                  key={i}
                  ref={el => (labelRefs.current[i] = el)}
                  className="absolute left-0 right-0 text-center lg:text-left text-base lg:text-xl font-semibold text-white"
                >
                  {label}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
