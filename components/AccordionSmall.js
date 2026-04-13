import React from 'react';
import { ChevronDown, AlertTriangle } from 'lucide-react';

function AccordionSection({ sectionRefs, isVisible, expandedSection, toggleSection }) {
  const accordionItems = [
    {
      id: '1',
      title: 'Foreign Parent with Shanghai Work Permit',
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
      id: '2',
  
      title: 'Hong Kong, Macao, or Taiwan Parent',
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
      title: 'Both Parents PRC; Student Foreign Passport',
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
      className={`py-12 xs:py-16 max-w-[1440px] m-auto sm:py-20 md:py-24 px-4 xs:px-6 sm:px-8 xl:px-10 bg-white transition-all duration-1000 ${
        isVisible['accordion']
          ? 'opacity-100'
          : 'opacity-0'
      }`}
    >
      <div className="mx-auto text-left">
        {/* Header Section */}
        <div className={`mb-20 transition-all max-w-[1120px] m-auto duration-1000 ${
          isVisible['accordion']
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10'
            
        }`}>
      
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-[#3C3737]">All Eligibility Categories</span>
          </h2>
          <p className="text-[#3C3737] text-base sm:text-lg max-w-3xl">
          If you prefer to browse all scenarios, expand the category that matches your family situation.
          </p>
        </div>

        {/* Accordion Items */}
        <div className="">
          {accordionItems.map((item, index) => (
            <div
              key={item.id}
              className={` bg-white overflow-hidden transition-all duration-300 hover:border-[#D30013]/30 rounded ${
                isVisible['accordion']
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 -translate-x-10'
              } ${expandedSection === item.id ? 'border-[#D30013]/50' : ''}`}
              style={{ transitionDelay: `${(index + 1) * 0.1}s` }}
            >
              {/* Header */}
              <button
                onClick={() => toggleSection(item.id)}
                className="w-full px-  flex items-center justify-between hover:bg-[#FDF8F9] rounded-lg transition-all duration-300 group"
              >
                <div className={`flex items-center flex-1 justify-between text-left max-w-[1120px] m-auto border-t ${index === accordionItems.length - 1 ? 'border-b' : ''} border-gray-200 py-12`}>
    
                  <h3 className="text-lg sm:text-2xl font-bold text-gray-900">
                    {item.title}
                  </h3>
                 {/* Chevron Button */}
                 <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    expandedSection === item.id
                      ? 'bg-[#D30013] text-white'
                      : 'bg-white border-2 border-gray-300 text-gray-600 group-hover:bg-[#D30013]/10 group-hover:text-[#D30013] group-hover:w-12'
                  }`}
                >
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-300 ${
                      expandedSection === item.id ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </div>
                </div>

             
              </button>

              {/* Expanded Content */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  expandedSection === item.id ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className=" pb-6 space-y-6 max-w-[1120px] m-auto">
                  {/* Assessment Duration */}
                  <div className="pt-4">
                    <p className="text-sm text-gray-600">
                      {item.subtitle}
                    </p>
                  </div>

                  {/* Sections with Background */}
                  {item.sections.map((section, idx) => (
                    <div key={idx} className="bg-[#FDF8F9] rounded-lg p-5">
                      <h4 className="text-base font-bold text-[#8B1538] mb-3">
                        {section.heading}
                      </h4>
                      <ul className="space-y-2">
                        <li className="text-gray-700 text-sm leading-relaxed flex items-start gap-2">
                          <span className="text-gray-400 mt-1.5">•</span>
                          <span>{section.content}</span>
                        </li>
                      </ul>
                    </div>
                  ))}

                  {/* Important Information Box */}
                  {item.importantInfo && (
                    <div className="bg-[#FDF8F9] rounded-lg p-5">
                      <h4 className="text-base font-bold text-[#8B1538] mb-3">
                        {item.importantInfo.title}
                      </h4>
                      <ul className="space-y-3">
                        {item.importantInfo.items.map((infoItem, infoIdx) => (
                          <li key={infoIdx} className="text-sm text-gray-700 leading-relaxed flex items-start gap-3">
                            <div className="w-4 h-4 mt-0.5 border-2 border-gray-300 rounded flex-shrink-0"></div>
                            <div>
                              <span className="font-semibold">
                                {infoItem.split(':')[0]}
                              </span>
                              <br />
                              <span className="text-gray-600">
                                {infoItem.split(':').slice(1).join(':')}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
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
