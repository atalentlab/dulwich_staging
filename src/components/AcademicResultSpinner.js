import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AcademicResultSpinner() {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);

  const statRefs = useRef([]);
  const labelRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
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

      gsap.set(statRefs.current[0], { y: 0, opacity: 1 });
      gsap.set(labelRefs.current[0], { opacity: 1 });

      // 37.5 → 7
      tl.to(statRefs.current[0], { y: -120, opacity: 0, duration: 0.3 }, 0.25)
        .to(labelRefs.current[0], { opacity: 0, duration: 0.2 }, 0.25)

        .to(statRefs.current[1], { y: 0, opacity: 1, duration: 0.3 }, 0.35)
        .to(labelRefs.current[1], { opacity: 1, duration: 0.2 }, 0.35)

        // 7 → 100%
        .to(statRefs.current[1], { y: -120, opacity: 0, duration: 0.3 }, 0.6)
        .to(labelRefs.current[1], { opacity: 0, duration: 0.2 }, 0.6)

        .to(statRefs.current[2], { y: 0, opacity: 1, duration: 0.3 }, 0.7)
        .to(labelRefs.current[2], { opacity: 1, duration: 0.2 }, 0.7);
      // ⬆️ FINAL VALUE STAYS — NO EXIT ANIMATION
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className=""
    >
      <div
        ref={pinRef}
        className="h-screen flex items-center justify-center bg-[#9e1422]"
      >
        <div className="max-w-7xl w-full px-6">
          <div className="flex items-center justify-center gap-16">

            {/* LEFT */}
            <div className="w-[220px] text-right">
              <p className="text-xl font-semibold tracking-widest uppercase text-white">
                2025 IB RESULTS
              </p>
            </div>

            {/* CENTER PILL */}
            <div className="relative">
              <div className="bg-white rounded-full px-32 py-14 shadow-[0_40px_90px_rgba(0,0,0,0.18)]">
                <div className="relative h-[120px] w-[300px] flex items-center justify-center overflow-hidden">
                  {['37.5', '7', '100%'].map((value, i) => (
                    <div
                      key={i}
                      ref={el => (statRefs.current[i] = el)}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <span className="text-[110px] font-black text-gray-900 leading-none tabular-nums">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="w-[260px] relative h-[40px]">
              {[
                'Average points out of 45',
                'Perfect scores',
                'Pass rate',
              ].map((label, i) => (
                <p
                  key={i}
                  ref={el => (labelRefs.current[i] = el)}
                  className="absolute text-xl font-semibold text-white"
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