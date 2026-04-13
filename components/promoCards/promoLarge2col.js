import React from 'react';
import { ArrowRight } from 'lucide-react';

/**
 * PromoLarge2col Component
 * Displays two promotional cards side by side in a 2-column grid
 *
 * Props:
 * - card1: Object containing { image, imageAlt, title, description, buttonText, buttonLink, onButtonClick }
 * - card2: Object containing { image, imageAlt, title, description, buttonText, buttonLink, onButtonClick }
 * - backgroundColor: Background color (default: white)
 */

function PromoLarge2col({
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
      <div className="bg-white shadow-[0_10px_15px_-3px_rgb(0_0_0_/_5%),_0_4px_6px_-4px_rgb(0_0_0_/_0.1)] rounded-[5px] border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg">
        {/* Image */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={image}
            alt={imageAlt}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="p-8 text-left">
          {/* Title */}
          <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
            {title}
          </h3>

          {/* Description */}
          <p className="text-sm lg:text-base text-gray-700 leading-relaxed mb-6">
            {description}
          </p>

          {/* CTA Button */}
          {buttonText && (
            <a
              href={buttonLink}
              onClick={handleButtonClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium border rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
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
        {/* Two Column Grid */}
        <div className="grid md:grid-cols-2 gap-8">
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
        </div>
      </div>
    </section>
  );
}

export default PromoLarge2col;
