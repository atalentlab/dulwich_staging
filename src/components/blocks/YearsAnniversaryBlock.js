import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './YearsAnniversaryBlock.css';

/**
 * Custom Arrow Components
 */
const NextArrow = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="anniversary-arrow anniversary-arrow-next"
      aria-label="Next slide"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
};

const PrevArrow = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="anniversary-arrow anniversary-arrow-prev"
      aria-label="Previous slide"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  );
};

/**
 * YearsAnniversaryBlock Component
 * Displays anniversary milestones and celebrations in a slider
 *
 * API Response:
 * {
 *   "type": "years_anniversary",
 *   "content": {
 *     "years_anniversary": ["4"],
 *     "anchor-id": null
 *   }
 * }
 */
const YearsAnniversaryBlock = ({ content }) => {
  const { years_anniversary = [], 'anchor-id': anchorId } = content;
  const [anniversaryData, setAnniversaryData] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log('YearsAnniversaryBlock initialized with content:', content);

  // Static anniversary data
  const staticAnniversaryData = [
    {
      id: 1,
      year: '2005',
      description: 'The 20th anniversary slider text caption container has space for above 170 characters, including spaces, set over five lines of text when using the \'caption\' text class.',
      image: null
    },
    {
      id: 2,
      year: '2007',
      description: 'The 20th anniversary slider text caption container has space for above 170 characters, including spaces, set over five lines of text when using the \'caption\' text class.',
      image: null
    },
    {
      id: 3,
      year: '2009',
      description: 'The 20th anniversary slider text caption container has space for above 170 characters, including spaces, set over five lines of text when using the \'caption\' text class.',
      image: null
    },
    {
      id: 4,
      year: '2011',
      description: 'The 20th anniversary slider text caption container has space for above 170 characters, including spaces, set over five lines of text when using the \'caption\' text class.',
      image: null
    },
    {
      id: 5,
      year: '2013',
      description: 'The 20th anniversary slider text caption container has space for above 170 characters, including spaces, set over five lines of text when using the \'caption\' text class.',
      image: null
    },
    {
      id: 6,
      year: '2015',
      description: 'The 20th anniversary slider text caption container has space for above 170 characters, including spaces, set over five lines of text when using the \'caption\' text class.',
      image: null
    },
    {
      id: 7,
      year: '2017',
      description: 'The 20th anniversary slider text caption container has space for above 170 characters, including spaces, set over five lines of text when using the \'caption\' text class.',
      image: null
    },
    {
      id: 8,
      year: '2019',
      description: 'The 20th anniversary slider text caption container has space for above 170 characters, including spaces, set over five lines of text when using the \'caption\' text class.',
      image: null
    },
    {
      id: 9,
      year: '2021',
      description: 'The 20th anniversary slider text caption container has space for above 170 characters, including spaces, set over five lines of text when using the \'caption\' text class.',
      image: null
    },
    {
      id: 10,
      year: '2023',
      description: 'The 20th anniversary slider text caption container has space for above 170 characters, including spaces, set over five lines of text when using the \'caption\' text class.',
      image: null
    }
  ];

  useEffect(() => {
    // Always use static data - API fetch disabled for now
    setAnniversaryData(staticAnniversaryData);
    setLoading(false);

    // Uncomment below to enable API fetching
    // if (years_anniversary.length > 0) {
    //   fetchAnniversaryData();
    // } else {
    //   setAnniversaryData(staticAnniversaryData);
    //   setLoading(false);
    // }
  }, [years_anniversary]);

  const fetchAnniversaryData = async () => {
    try {
      setLoading(true);
      console.log('Fetching anniversary data for IDs:', years_anniversary);

      // Fetch data for each anniversary ID
      const promises = years_anniversary.map(anniversaryId =>
        fetch(`https://www.dulwich.atalent.xyz/api/years_anniversary/${anniversaryId}`)
          .then(res => res.json())
          .then(data => {
            if (data.success && data.data) {
              console.log(`Anniversary ${anniversaryId} fetched:`, data.data);
              return data.data;
            }
            console.warn(`Anniversary ${anniversaryId} failed or has no data:`, data);
            return null;
          })
          .catch(err => {
            console.error(`Error fetching anniversary ${anniversaryId}:`, err);
            return null;
          })
      );

      const results = await Promise.all(promises);
      const validAnniversaries = results.filter(item => item !== null);
      console.log('Valid anniversaries loaded:', validAnniversaries);
      setAnniversaryData(validAnniversaries);
    } catch (error) {
      console.error('Error fetching anniversaries:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D30013]"></div>
      </div>
    );
  }

  if (anniversaryData.length === 0) {
    return null;
  }

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: anniversaryData.length > 1,
    speed: 500,
    slidesToShow: Math.min(5, anniversaryData.length),
    slidesToScroll: 1,
    arrows: true,
    autoplay: false,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    dotsClass: "slick-dots anniversary-dots",
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: Math.min(4, anniversaryData.length),
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(3, anniversaryData.length),
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(2, anniversaryData.length),
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  return (
    <section data-id={anchorId} className="py-16 px-4 bg-white">
      <div className="max-w-[1490px] ml-auto">
        {/* Header */}
        <div className="mb-12 flex justify-between items-start">
          <div>
            <h2 className="text-4xl md:text-5xl text-left font-bold text-gray-900 mb-2">
              20 Years of Excellence
            </h2>
            <p className="text-gray-600 text-base text-left">
              Optional Subtitle
            </p>
          </div>

        </div>

        {/* Slider */}
        <div className="anniversary-slider">
          <Slider {...sliderSettings}>
            {anniversaryData.map((item, index) => (
              <div key={item.id || index} className="px-2">
                <div className="bg-[#fff] overflow-hidden h-full">
                  {/* Image placeholder */}
                  <div className="w-full h-[400px] bg-[#E8E4DD] rounded-lg flex items-center justify-center">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title || `Anniversary ${item.year || '20XX'}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400 text-6xl font-bold">
                        {item.year || '20XX'}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-2xl text-left font-bold text-gray-900 mb-4">
                      {item.year || '20XX'}
                    </h3>
                    <p className="text-left text-gray-700 text-sm mb-6 line-clamp-5">
                      {item.description || 'The 20th anniversary slider text caption container has space for above 170 characters, including spaces, set over five lines of text when using the \'caption\' text class.'}
                    </p>

                    {/* Arrow button - no hover effect */}
                    <button className="w-10 h-10 border-2 border-[#D30013] rounded flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#D30013]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default YearsAnniversaryBlock;
