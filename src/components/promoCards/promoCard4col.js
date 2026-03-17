import React from 'react';
import { ArrowRight } from 'lucide-react';

/**
 * PromoCard4col Component
 * Displays a title, description, and four promotional cards in a 4-column grid
 *
 * Props:
 * - sectionTitle: Main section title
 * - sectionDescription: Section description text
 * - card1-4: Objects containing { image, imageAlt, title, description, buttonText, buttonLink, onButtonClick }
 * - backgroundColor: Background color (default: white)
 */

function PromoCard4col({
  sectionTitle = "Promo Large (4 Col) Title",
  sectionDescription = "Optional Intro. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris ni",
  card1 = {
    image: "https://placehold.co/512x336/e5e7eb/1f2937?text=Card+1",
    imageAlt: "Card 1 Image",
    title: "Eligibility Requirements",
    description: "Check if you meet the criteria set out by the Shanghai Municipal Education Commission (SMEC).",
    buttonText: "Check Eligibility",
    buttonLink: "#",
    onButtonClick: null
  },
  card2 = {
    image: "https://placehold.co/512x336/e5e7eb/1f2937?text=Card+2",
    imageAlt: "Card 2 Image",
    title: "Eligibility Requirements",
    description: "Check if you meet the criteria set out by the Shanghai Municipal Education Commission (SMEC).",
    buttonText: "Check Eligibility",
    buttonLink: "#",
    onButtonClick: null
  },
  card3 = {
    image: "https://placehold.co/512x336/e5e7eb/1f2937?text=Card+3",
    imageAlt: "Card 3 Image",
    title: "Eligibility Requirements",
    description: "Check if you meet the criteria set out by the Shanghai Municipal Education Commission (SMEC).",
    buttonText: "Check Eligibility",
    buttonLink: "#",
    onButtonClick: null
  },
  card4 = {
    image: "https://placehold.co/512x336/e5e7eb/1f2937?text=Card+4",
    imageAlt: "Card 4 Image",
    title: "Eligibility Requirements",
    description: "Check if you meet the criteria set out by the Shanghai Municipal Education Commission (SMEC).",
    buttonText: "Check Eligibility",
    buttonLink: "#",
    onButtonClick: null
  },
  backgroundColor = "#ffffff"
}) {

  // Single Card Component
  const PromoCard = ({ image, imageAlt, title, description, buttonText, buttonLink, onButtonClick }) => {
    const handleButtonClick = (e) => {
      if (onButtonClick) {
        e.preventDefault();
        onButtonClick();
      }
    };

    return (
      <div className="bg-white shadow-[0_10px_15px_-3px_rgb(0_0_0_/_5%),_0_4px_6px_-4px_rgb(0_0_0_/_0.1)] rounded-[5px] overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-2">
        {/* Image */}
        <div className="relative overflow-hidden">
          <img
            src={image}
            alt={imageAlt}
            className="w-full max-h-[192px] h-auto object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="p-5 text-left">
          {/* Title */}
          <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-2">
            {title}
          </h3>

          {/* Description */}
          <p className="text-[14px] text-gray-700 leading-relaxed mb-5 mt-3">
            {description}
          </p>

          {/* CTA Button */}
          {buttonText && (
            <a
              href={buttonLink}
              onClick={handleButtonClick}
              className="inline-flex items-center gap-2 px-4 py-1.5 text-[12px] font-medium border-[1px] rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
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
              {buttonText}
              <ArrowRight className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="py-12 lg:py-16 px-4 lg:px-8" style={{ backgroundColor }}>
      <div className="max-w-[1120px] mx-auto">
        {/* Section Header */}
        <div className="mb-12 text-left">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
            {sectionTitle}
          </h2>
          <p className="text-base max-w-[640px] text-gray-700 leading-[1.5]">
            {sectionDescription}
          </p>
        </div>

        {/* Four Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <PromoCard
            image={card1.image}
            imageAlt={card1.imageAlt}
            title={card1.title}
            description={card1.description}
            buttonText={card1.buttonText}
            buttonLink={card1.buttonLink}
            onButtonClick={card1.onButtonClick}
          />

          {/* Card 2 */}
          <PromoCard
            image={card2.image}
            imageAlt={card2.imageAlt}
            title={card2.title}
            description={card2.description}
            buttonText={card2.buttonText}
            buttonLink={card2.buttonLink}
            onButtonClick={card2.onButtonClick}
          />

          {/* Card 3 */}
          <PromoCard
            image={card3.image}
            imageAlt={card3.imageAlt}
            title={card3.title}
            description={card3.description}
            buttonText={card3.buttonText}
            buttonLink={card3.buttonLink}
            onButtonClick={card3.onButtonClick}
          />

          {/* Card 4 */}
          <PromoCard
            image={card4.image}
            imageAlt={card4.imageAlt}
            title={card4.title}
            description={card4.description}
            buttonText={card4.buttonText}
            buttonLink={card4.buttonLink}
            onButtonClick={card4.onButtonClick}
          />
        </div>
      </div>
    </section>
  );
}

export default PromoCard4col;
