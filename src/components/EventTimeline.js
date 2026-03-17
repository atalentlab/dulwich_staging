import React, { useState, useEffect, useRef } from "react";
import { Clock, FileText, Users, CreditCard, Upload } from "lucide-react";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const EventTimeline = () => {
  const [activeStep, setActiveStep] = useState(1);
  const sectionRef = useRef(null);
  const pinContainerRef = useRef(null);
  const contentContainerRef = useRef(null);
  const stepRefs = useRef([]);

  const events = [
    {
      id: 1,
      step: 1,
      title: "Eligibility",
      headerTitle: "Check Eligibility",
      duration: "2 minutes",
      description: "Make sure your child meets Shanghai's requirements for international students.",
      buttonText: "Check Eligibility"
    },
    {
      id: 2,
      step: 2,
      title: "Application",
      headerTitle: "Submit Application",
      duration: "15 - 20 min",
      description: "Complete the online application form and upload required documents.",
      buttonText: "Submit Application",
      details: {
        documents: [
          { category: "Student Documents", items: ["Photo", "Passport", "Visa", "Medical Records", "Academic Records", "Recommendation Letter"], icon: <FileText className="w-4 h-4" /> },
          { category: "Parent Documents", items: ["Both Parents' Passports", "Recent Photos"], icon: <Users className="w-4 h-4" /> },
          { category: "Payment Information", items: ["Credit Card Details"], icon: <CreditCard className="w-4 h-4" /> }
        ],
        fee: "RMB 3,500"
      }
    },
    {
      id: 3,
      step: 3,
      title: "Interview",
      headerTitle: "Interview",
      duration: "30 min",
      description: "Attend an interview with our admissions team to discuss your child's interests and goals.",
      buttonText: "Schedule Interview"
    },
    {
      id: 4,
      step: 4,
      title: "Decision",
      headerTitle: "Decision",
      duration: "Within 5 working days",
      description: "Our Admissions Committee reviews your application and assessment.\n\nWe'll email you with the outcome.",
      buttonText: "Track Status"
    },
    {
      id: 5,
      step: 5,
      title: "Outcomes",
      headerTitle: "Outcomes",
      duration: "",
      description: "Receive your final decision and next steps for enrollment.",
      buttonText: "View Next Steps"
    },
  ];

  const handleStepClick = (step) => {
    const stepIndex = step - 1;
    const stepElement = stepRefs.current[stepIndex];
    const container = contentContainerRef.current;

    if (stepElement && container) {
      const containerRect = container.getBoundingClientRect();
      const elementRect = stepElement.getBoundingClientRect();
      const scrollTop = container.scrollTop;
      const offsetPosition = elementRect.top - containerRect.top + scrollTop - 32;

      container.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // GSAP ScrollTrigger for sticky timeline
  useEffect(() => {
    if (!sectionRef.current || !pinContainerRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        pin: pinContainerRef.current,
        pinSpacing: false,
        anticipatePin: 1,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Continuous tracking of active step using RAF
  useEffect(() => {
    let rafId;

    const updateActiveStep = () => {
      const container = contentContainerRef.current;
      if (!container) {
        rafId = requestAnimationFrame(updateActiveStep);
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const containerTop = containerRect.top;
      const containerCenter = containerRect.top + containerRect.height / 3; // Upper third

      let closestStep = 1;
      let closestDistance = Infinity;

      stepRefs.current.forEach((stepElement, index) => {
        if (stepElement) {
          const elementRect = stepElement.getBoundingClientRect();
          const elementTop = elementRect.top;
          const distance = Math.abs(elementTop - containerCenter);

          if (distance < closestDistance) {
            closestDistance = distance;
            closestStep = index + 1;
          }
        }
      });

      setActiveStep(closestStep);
      rafId = requestAnimationFrame(updateActiveStep);
    };

    // Start the animation loop
    rafId = requestAnimationFrame(updateActiveStep);

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  // Calculate progress height based on active step
  const progressHeight = ((activeStep - 1) / (events.length - 1)) * 100;

  return (
    <section
      ref={sectionRef}
      className="relative bg-white max-w-[1120px] m-auto "
      style={{ height: `${events.length * 100}vh` }}
    >
      <div
        ref={pinContainerRef}
        className="h-screen py-2 px-2 lg:px-2 "
      >
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 h-full">

        {/* LEFT SIDE - Sticky Timeline */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="sticky top-20">
            <div className="relative">
              {/* Vertical connecting line */}
              <div className="absolute left-[21px] top-[22px] h-[calc(100%-44px)] w-[3px] bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 w-full transition-[height] duration-500 ease-out"
                  style={{
                    height: `${progressHeight}%`,
                    background: 'linear-gradient(180deg, #8B1538 0%, #00ACC1 100%)'
                  }}
                />
              </div>

              <div className="flex flex-col gap-8 relative z-10 py-2">
              {events.map((event) => (
                <div
                  key={event.step}
                  className="flex items-center gap-4 cursor-pointer transition-all hover:opacity-80 group"
                  onClick={() => handleStepClick(event.step)}
                >
                  {/* Step circle */}
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center text-base font-bold transition-all flex-shrink-0 shadow-sm border-2 ${
                      activeStep === event.step
                        ? "bg-[#8B1538] text-white border-[#8B1538] shadow-md scale-105"
                        : activeStep > event.step
                          ? "bg-[#8B1538] text-white border-[#8B1538]"
                          : "bg-white text-gray-400 border-gray-300"
                    }`}
                  >
                    {activeStep > event.step ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      event.step
                    )}
                  </div>

                  {/* Title */}
                  <div
                    className={`font-medium text-base transition-all leading-tight ${
                      activeStep === event.step
                        ? "text-[#8B1538] font-semibold"
                        : activeStep > event.step
                          ? "text-gray-900 font-medium"
                          : "text-gray-400"
                    }`}
                  >
                    {event.title}
                  </div>
                </div>
              ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE – Scrollable Content */}
        <div
          ref={contentContainerRef}
          className="flex-grow overflow-y-auto pr-4 relative"
          data-lenis-prevent
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#8B1538 #E5E7EB'
          }}
        >
          <div className="space-y-4">
            {events.map((event, index) => (
              <div
                key={event.step}
                ref={(el) => (stepRefs.current[index] = el)}
                className="bg-gradient-to-br from-white via-[#FDF7F9] to-[#FAF8F6] border border-[#F4E3E8]/70 rounded-2xl p-8 lg:p-12 shadow-sm min-h-[80vh] flex flex-col"
              >
                  {/* Step circle, label and duration - Top Left */}
                  <div className="flex items-center gap-4 mb-16">
                    <div
                      className={`w-20 h-20 flex items-center justify-center text-white text-3xl font-bold rounded-full shadow-lg transition-all duration-300 ${
                        activeStep === event.step ? 'bg-[#8B1538] scale-105' : 'bg-[#8B1538]'
                      }`}
                    >
                      {event.step}
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-base font-semibold text-gray-900">
                        Step {event.step}
                      </span>
                      {event.duration && (
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <Clock className="w-4 h-4" />
                          <span>{event.duration}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Title - Centered */}
                  <div className="text-center mb-8">
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">{event.headerTitle || event.title}</h2>
                  </div>

                  {/* Description and content - Centered */}
                  <div className="flex-1 flex flex-col items-center text-center">
                    {/* Special content for Application step */}
                    {event.step === 2 && event.details ? (
                      <div className="space-y-6 max-w-3xl">
                        <p className="text-gray-700 leading-relaxed text-base">{event.description}</p>

                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <Upload className="w-5 h-5 text-[#D30013]" />
                            Required Documents
                          </h3>

                          {event.details.documents.map((docCategory, idx) => (
                            <div key={idx} className="bg-white rounded-lg p-4 shadow-sm">
                              <div className="flex items-center gap-2 mb-3">
                                <div className="text-[#D30013]">{docCategory.icon}</div>
                                <h4 className="font-medium text-gray-800">{docCategory.category}</h4>
                              </div>
                              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-6">
                                {docCategory.items.map((item, itemIndex) => (
                                  <li key={itemIndex} className="text-gray-600 text-sm flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>

                        <div className="bg-red-50 rounded-lg p-4 flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-800">Application Fee</h3>
                            <p className="text-2xl font-bold text-[#D30013] mt-1">{event.details.fee}</p>
                          </div>
                          <div className="text-gray-500 text-sm">
                            <p>Payment required</p>
                            <p>to submit application</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="max-w-3xl">
                        <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">{event.description}</p>
                      </div>
                    )}
                  </div>

                  {/* Action Button - Centered */}
                  <div className="mt-8 flex justify-center">
                    <button className="px-8 py-3 rounded-md border-2 border-[#D30013] text-[#D30013] font-semibold hover:bg-[#D30013] hover:text-white transition-all duration-300">
                      {event.buttonText}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventTimeline;