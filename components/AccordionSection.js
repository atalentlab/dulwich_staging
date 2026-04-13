import React from 'react';
import { ChevronDown, AlertTriangle } from 'lucide-react';

function AccordionSection({ sectionRefs, isVisible, expandedSection, toggleSection }) {
  const accordionItems = [
    {
      id: 'early-years',
      badge: 'Early Years',
      badgeColor: 'bg-[#D30013]',
      ageRange: 'Ages 2-4 • Toddlers & Reception',
      title: 'Early Years',
      subtitle: 'Assessment: 2 hours',
      image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop',
      sections: [
        {
          heading: "What we're looking for",
          content: "Students ready to embrace our opportunities and contribute meaningfully to our early learning community."
        },
        {
          heading: "Assessment Process",
          content: "Your child will participate in a 2-hour play-based assessment evaluating developmental readiness and social skills."
        }
      ],
      importantInfo: {
        title: "Important Information",
        items: [
          "Applications are considered on a rolling basis and typically accepted throughout the year.",
          "All applications are evaluated carefully. Priority may be given to siblings of current students."
        ]
      }
    },
    {
      id: 'key-stage',
      badge: 'Key Stage 1 & 2',
      badgeColor: 'bg-[#009ED0]',
      ageRange: 'Ages 5-7 • Years 1 & 2',
      title: 'Key Stage 1 & 2',
      subtitle: 'Assessment: 3 hours',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop',
      sections: [
        {
          heading: "What we're looking for",
          content: "Students ready to engage with our foundational academic program and contribute meaningfully to our primary school community."
        },
        {
          heading: "Assessment Process",
          content: "Your child will participate in a 3-hour comprehensive assessment evaluating academic readiness and fit for our programme."
        }
      ],
      importantInfo: {
        title: "Important Information",
        items: [
          "Applications are considered case-by-case and typically not accepted for Terms 2 and 3.",
          "We rarely consider applications for Year 1-3 entry. To be considered, students must be applying from a nearly identical IB Diploma Programme."
        ]
      }
    },
    {
      id: 'middle-years',
      badge: 'Middle Years',
      badgeColor: 'bg-[#FFB909]',
      ageRange: 'Ages 8-11 • Years 3-6',
      title: 'Middle Years',
      subtitle: 'Assessment: 3-4 hours',
      image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop',
      sections: [
        {
          heading: "What we're looking for",
          content: "Students ready to engage with our challenging middle school program and contribute meaningfully to our learning community."
        },
        {
          heading: "Assessment Process",
          content: "Your child will participate in a 3-4 hour comprehensive assessment evaluating academic readiness and fit for our programme."
        }
      ],
      importantInfo: {
        title: "Important Information",
        items: [
          "Year 7: Applications are considered case-by-case for all terms based on space availability.",
          "Year 8-9: We consider applications on a case-by-case basis. Priority given to students from similar curriculum backgrounds."
        ]
      }
    },
    {
      id: 'senior-school',
      badge: 'Senior School',
      badgeColor: 'bg-[#D30013]',
      ageRange: 'Ages 11-18 • Years 7-13',
      title: 'Senior School',
      subtitle: 'Assessment: 4 - 4 hours',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop',
      sections: [
        {
          heading: "What we're looking for",
          content: "Students ready to engage with our rigorous academic program and contribute meaningfully to our senior school community."
        },
        {
          heading: "Assessment Process",
          content: "Your child will participate in a 3-4 hour comprehensive assessment evaluating academic readiness and fit for our programme."
        }
      ],
      importantInfo: {
        title: "Important Information",
        items: [
          "Year 11: Applications are considered case-by-case and typically not accepted for Terms 2 and 3, as current students are on study leave for much of this period.",
          "Year 13: We rarely consider applications for Year 13 entry. To be considered, students must be applying from a nearly identical IB Diploma Programme. All applications are evaluated case-by-case."
        ]
      }
    }
  ];

  return (
    <section
      id="accordion"
      ref={(el) => (sectionRefs.current['accordion'] = el)}
      className={`py-12 xs:py-16 sm:py-20 md:py-24 px-4 xs:px-6 sm:px-8 xl:px-10 bg-white transition-all duration-1000 ${
        isVisible['accordion']
          ? 'opacity-100'
          : 'opacity-0'
      }`}
    >
      <div className="max-w-6xl mx-auto text-left">
        {/* Header Section */}
        <div className={`mb-12 transition-all duration-1000 ${
          isVisible['accordion']
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10'
        }`}>
          <p className="text-xs sm:text-sm font-semibold tracking-widest text-gray-500 uppercase mb-4">
            WHAT WE LOOK FOR
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-[#D30013]">We're building a diverse, vibrant community</span>
            <br />
            <span className="text-gray-900">where every student can thrive</span>
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-3xl">
            We look for students who will embrace our opportunities and contribute their unique perspectives.
          </p>
        </div>

        {/* Accordion Items */}
        <div className="space-y-4">
          {accordionItems.map((item, index) => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-1000 hover:shadow-lg ${
                isVisible['accordion']
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 -translate-x-10'
              } ${expandedSection === item.id ? 'shadow-xl border-gray-300' : ''}`}
              style={{ transitionDelay: `${(index + 1) * 0.1}s` }}
            >
              <div className="flex items-start">
                {/* Image */}
                <div className="flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full max-w-60  object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 gap-4 p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className={`px-3 py-1.5 ${item.badgeColor} text-white text-xs font-semibold rounded-full`}>
                      {item.badge}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-600">
                      {item.ageRange}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                  {item.subtitle}

                  </div>
                </div>
                  <div className='min-w-0 gap-4 p-4 sm:p-6'>
                           {/* Chevron Button */}
                <button
                  onClick={() => toggleSection(item.id)}
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    expandedSection === item.id
                      ? 'bg-[#D30013] text-white'
                      : 'bg-white border-2 border-[#D30013] text-[#D30013] hover:bg-[#D30013] hover:text-white'
                  }`}
                  aria-label={`Expand ${item.title}`}
                >
                  <ChevronDown
                    className={`w-5 h-5 transition-all duration-500 ${
                      expandedSection === item.id ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </button>
                  </div>
         
              </div>

              {/* Expanded Content */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  expandedSection === item.id ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-4 sm:px-6 lg:px-8 pb-6 pt-4 bg-white border-t border-gray-200">
                  {/* Sections */}
                  {item.sections.map((section, idx) => (
                    <div key={idx} className="mb-6">
                      <h4 className="text-base font-bold text-[#8B1538] mb-2">
                        {section.heading}
                      </h4>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {section.content}
                      </p>
                    </div>
                  ))}

                  {/* Important Information Box */}
                  {item.importantInfo && (
                    <div className="bg-[#FFF8E6] border-l-4 border-yellow-500 rounded-r-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h5 className="text-sm font-bold text-gray-900 mb-3">
                            {item.importantInfo.title}
                          </h5>
                          <ul className="space-y-2">
                            {item.importantInfo.items.map((infoItem, infoIdx) => (
                              <li key={infoIdx} className="text-sm text-gray-700 leading-relaxed">
                                <span className="font-semibold">
                                  {infoItem.split(':')[0]}:
                                </span>{' '}
                                {infoItem.split(':').slice(1).join(':')}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AccordionSection;
