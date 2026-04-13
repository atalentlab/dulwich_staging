import React from 'react';
import Icon from '../Icon';

/**
 * PromoMicro Component
 * Displays micro promotional cards with title, description, optional CTA, and 4 micro cards
 *
 * Props:
 * - sectionTitle: Main section title
 * - sectionDescription: Section description text
 * - showCTA: Show optional CTA button (default: false)
 * - ctaText: CTA button text
 * - ctaLink: CTA button link
 * - card1-4: Objects containing { image, imageAlt, title, link, onCardClick }
 * - backgroundColor: Background color (default: white)
 */

function PromoMicro({
  sectionTitle = "Promo Micro",
  sectionDescription = "Optional Intro. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris ni",
  showCTA = false,
  ctaText = "Optional CTA",
  ctaLink = "#",
  onCTAClick,
  card1 = {
    image: "https://placehold.co/320x240/e5e7eb/1f2937?text=Card+1",
    imageAlt: "Card 1 Image",
    title: "Eligibility Requirements",
    link: "#",
    onCardClick: null
  },
  card2 = {
    image: "https://placehold.co/320x240/e5e7eb/1f2937?text=Card+2",
    imageAlt: "Card 2 Image",
    title: "Eligibility Requirements",
    link: "#",
    onCardClick: null
  },
  card3 = {
    image: "https://placehold.co/320x240/e5e7eb/1f2937?text=Card+3",
    imageAlt: "Card 3 Image",
    title: "Eligibility Requirements",
    link: "#",
    onCardClick: null
  },
  card4 = {
    image: "https://placehold.co/320x240/e5e7eb/1f2937?text=Card+4",
    imageAlt: "Card 4 Image",
    title: "Eligibility Requirements",
    link: "#",
    onCardClick: null
  },
  backgroundColor = "#ffffff"
}) {

  // Micro Card Component
  const MicroCard = ({ image, imageAlt, title, link, onCardClick }) => {
    const handleClick = (e) => {
      if (onCardClick) {
        e.preventDefault();
        onCardClick();
      }
    };

    return (
      <a
        href={link}
        onClick={handleClick}
        className="group bg-white shadow-[0_10px_15px_-3px_rgb(0_0_0_/_5%),_0_4px_6px_-4px_rgb(0_0_0_/_0.1)] rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-2 block"
      >
        {/* Image */}
        <div className="relative overflow-hidden">
          <img
            src={image}
            alt={imageAlt}
            className="w-full max-h-[142px] object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="p-4 flex items-center justify-between">
          {/* Title */}
          <h3 className="text-sm lg:text-base font-bold text-gray-900">
            {title}
          </h3>

          {/* Arrow Button */}
          <div
            className="flex items-center justify-center w-10 h-10 rounded-[8px] border transition-all duration-300 group-hover:bg-red-600 group-hover:border-red-600"
            style={{ borderColor: '#D30013' }}
          >
            <Icon
              icon="Icon-Chevron-Large"
              size={20}
              color="#D30013"
              className="transition-colors duration-300 group-hover:text-white"
            />
          </div>
        </div>
      </a>
    );
  };

  return (
    <section className="py-12 lg:py-16 px-4 lg:px-8" style={{ backgroundColor }}>
      <div className="max-w-[1120px] mx-auto">
        {/* Section Header */}
        <div className="mb-8 text-left">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
            {sectionTitle}
          </h2>
          <p className="text-base text-gray-700 leading-relaxed max-w-3xl mb-6">
            {sectionDescription}
          </p>

          {/* Optional CTA Button */}
          {showCTA && (
            <a
              href={ctaLink}
              onClick={(e) => {
                if (onCTAClick) {
                  e.preventDefault();
                  onCTAClick();
                }
              }}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium border-2 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
              style={{
                color: '#D30013',
                borderColor: '#D30013'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#D30013';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#D30013';
              }}
            >
              {ctaText}
              <Icon icon="Icon-Chevron-Large" size={16} />
            </a>
          )}
        </div>

        {/* Four Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <MicroCard
            image={card1.image}
            imageAlt={card1.imageAlt}
            title={card1.title}
            link={card1.link}
            onCardClick={card1.onCardClick}
          />

          {/* Card 2 */}
          <MicroCard
            image={card2.image}
            imageAlt={card2.imageAlt}
            title={card2.title}
            link={card2.link}
            onCardClick={card2.onCardClick}
          />

          {/* Card 3 */}
          <MicroCard
            image={card3.image}
            imageAlt={card3.imageAlt}
            title={card3.title}
            link={card3.link}
            onCardClick={card3.onCardClick}
          />

          {/* Card 4 */}
          <MicroCard
            image={card4.image}
            imageAlt={card4.imageAlt}
            title={card4.title}
            link={card4.link}
            onCardClick={card4.onCardClick}
          />
        </div>
      </div>
    </section>
  );
}

export default PromoMicro;
