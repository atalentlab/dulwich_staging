import React from 'react';
import { ArrowRight } from 'lucide-react';

function PromoExtraLarge({
  image = "https://placehold.co/600x400/e5e7eb/1f2937?text=Dulwich+College",
  imageAlt = "Promo Image",
  title = "Eligibility Requirements",
  description = "Check if you meet the criteria set out by the Shanghai Municipal Education Commission (SMEC).",
  buttonText = "Check Eligibility",
  buttonLink = "#",
  onButtonClick,
  backgroundColor = "#ffffff",
  imagePosition = "left"
}) {

  const handleButtonClick = (e) => {
    if (onButtonClick) {
      e.preventDefault();
      onButtonClick();
    }
  };

  // Image component
  const ImageSection = () => (
    <div className="relative h-64 lg:h-auto">
      <img
        src={image}
        alt={imageAlt}
        className="w-full max-w-[512px] max-h-[336px] h-full object-cover hover:scale-05 rounded-[5px]"
      />
    </div>
  );

  // Content component
  const ContentSection = () => (
    <div className="p-8 text-left lg:p-12 flex flex-col justify-center">
      {/* Title */}
      <h2 className="text-2xl lg:text-3xl font-bold text-gray mb-4">
        {title}
      </h2>

      {/* Description */}
      <p className="text-base lg:text-sm text-gray-700 leading-relaxed mb-6">
        {description}
      </p>

      {/* CTA Button */}
      {buttonText && (
        <div>
          <a
            href={buttonLink}
            onClick={handleButtonClick}
            className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium border rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
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
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      )}
    </div>
  );

  return (
    <section className="py-12 lg:py-16 px-4 lg:px-8" style={{ backgroundColor }}>
      <div className="max-w-[1120px] mx-auto">
        {/* Card Container */}
        <div className="bg-white overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            {imagePosition === "left" ? (
              <>
                <ImageSection />
                <ContentSection />
              </>
            ) : (
              <>
                <ContentSection />
                <ImageSection />
              </>
            )}
          </div>
        </div>
      </div>
  <br/><br/><br/>
      <div className="max-w-[1120px] mx-auto">
        {/* Card Container */}
        <div className="bg-white overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            {imagePosition === "right" ? (
              <>
                <ImageSection />
                <ContentSection />
              </>
            ) : (
              <>
                <ContentSection />
                <ImageSection />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PromoExtraLarge;
