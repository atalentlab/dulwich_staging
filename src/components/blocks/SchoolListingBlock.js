import React, { useEffect, useState, useRef } from 'react';
import { MapPin, Users, Calendar } from 'lucide-react';
import SchoolListingCarouselPage from '../../pages/SchoolListingCarouselPage';
import SchoolListingListPage from '../../pages/SchoolListingListPage';
import SchoolLocationsBlock from './SchoolLocationsBlock';

/**
 * School Listing Block Component
 * Routes to different layouts based on listing-style:
 * - 'carousel' → SchoolListingCarouselPage
 * - 'list' → SchoolListingListPage
 * - 'school_locations' → SchoolLocationsBlock (Globe view)
 * - 'grid' or default → Grid layout (below)
 */
const SchoolListingBlock = ({ content, schools: propsSchools }) => {
  const { title, subtitle, 'cta-text': ctaText, 'listing-style': listingStyle } = content;

  // Route to appropriate page based on listing-style
  if (listingStyle === 'carousel') {
    return <SchoolListingCarouselPage title={title} />;
  }

  if (listingStyle === 'list') {
    return <SchoolListingListPage title={title} />;
  }

  if (listingStyle === 'school_locations') {
    return <SchoolLocationsBlock content={content} />;
  }

  // Default: Grid layout
  return <GridLayout content={content} propsSchools={propsSchools} />;
};

/**
 * Grid Layout Component
 * Displays a grid of school cards with scroll animations
 */
const GridLayout = ({ content, propsSchools }) => {
  const { title, subtitle, 'cta-text': ctaText } = content;
  const [schools, setSchools] = useState([]);
  const [visibleCards, setVisibleCards] = useState(new Set());
  const cardRefs = useRef([]);

  useEffect(() => {
    // Use schools from props if available, otherwise fetch from API
    if (propsSchools && propsSchools.length > 0) {
      setSchools(propsSchools);
    } else {
      // Fetch schools from API
      fetchSchools();
    }
  }, [propsSchools]);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = entry.target.dataset.index;
          if (entry.isIntersecting) {
            setVisibleCards((prev) => new Set([...prev, parseInt(index)]));
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      cardRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [schools]);

  const fetchSchools = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/school/schools`);
      const data = await response.json();
      if (data.success && data.data && data.data.schools) {
        setSchools(data.data.schools);
      }
    } catch (error) {
      console.error('Error fetching schools:', error);
    }
  };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-[1120px] mx-auto">
        {/* Header */}
        {title && (
          <h2 className="text-4xl text-left md:text-5xl font-bold mb-8 text-gray-800">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="text-lg text-left text-gray-600 mb-12">
            {subtitle}
          </p>
        )}

        {/* School Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {schools.map((school, index) => {
            // Parse listing_info if it's a JSON string
            let listingInfo = {};
            try {
              if (typeof school.listing_info === 'string') {
                listingInfo = JSON.parse(school.listing_info);
              } else {
                listingInfo = school.listing_info || {};
              }
            } catch (e) {
              console.error('Error parsing listing_info:', e);
            }

            return (
              <div
                key={school.id}
                ref={(el) => (cardRefs.current[index] = el)}
                data-index={index}
                className="bg-white flex flex-col rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 group"
              >
                {/* School Image */}
                {school.listing_image && (
                  <div className="text-left h-64 overflow-hidden">
                    <img
                      src={school.listing_image}
                      alt={school.full_title || school.title || school.name}
                      className={`w-full h-full object-cover transition-transform duration-700 ${
                        visibleCards.has(index) ? 'scale-110' : 'scale-100'
                      } group-hover:scale-110`}
                    />
                  </div>
                )}

                {/* Card Content - flex-col with flex-grow and justify-between */}
                <div className="p-6 flex flex-col flex-grow justify-between">
                  {/* Top Content Section */}
                  <div>
                    {/* School Name */}
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 text-left">
                      {school.full_title || school.title || school.name}
                    </h3>

                    {/* Info Items */}
                    <div className="space-y-3 mb-4">
                      {/* Location */}
                      {listingInfo.location && (
                        <div className="flex text-left items-start gap-2 text-[#3C3C3B]">
                          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span className="text-[14px]">{listingInfo.location}</span>
                        </div>
                      )}

                      {/* Students Count */}
                      {listingInfo.students && (
                        <div className="flex text-left items-start gap-2 text-[#3C3C3B]">
                          <Users className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span className="text-[14px]">{listingInfo.students}</span>
                        </div>
                      )}

                      {/* Age Range */}
                      {listingInfo.ages && (
                        <div className="flex text-left items-start gap-2 text-[#3C3C3B]">
                          <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span className="text-[14px]">{listingInfo.ages}</span>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {listingInfo.tags && listingInfo.tags.length > 0 && (
                      <div className="flex text-left gap-2 mb-4 flex-wrap">
                        {listingInfo.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Description */}
                    {school.intro && (
                      <p className="text-gray-600 text-left mb-6 line-clamp-3">
                        {school.intro}
                      </p>
                    )}
                  </div>

                  {/* Bottom Content Section - Button pushed to bottom */}
                  <div className="mt-auto">
                    {/* Visit Website Button */}
                    {school.url && (
                      <a
                        href={school.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center bg-[#D30013] hover:bg-[#B8000F] text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300"
                      >
                        {ctaText || 'Visit Website'}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SchoolListingBlock;
