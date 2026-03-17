import React from 'react';

const CtaBlock = ({ content }) => {
  const {
    style,
    alignment,
    cta,
    'anchor-id': anchorId
  } = content;

  // Convert cta object to array if it's an object
  const ctaArray = cta ? (Array.isArray(cta) ? cta : Object.values(cta)) : [];

  const alignmentClasses = {
    center: 'justify-center',
    left: 'justify-start',
    right: 'justify-end',
  };

  // Style classes for different button types
  const getButtonStyle = (buttonStyle) => {
    const styles = {
      red: 'bg-[#D30013] hover:bg-[#B00010] text-white',
      outline: 'border-2 border-[#D30013] text-[#D30013] hover:bg-[#D30013] hover:text-white bg-transparent',
      default: 'bg-[#D30013] hover:bg-[#B00010] text-white',
    };
    return styles[buttonStyle] || styles.default;
  };

  return (
    <section data-id={anchorId} className="py-12 px-4 bg-white">
      <div className="max-w-[1120px] mx-auto">
        <div className={`flex flex-wrap gap-4 ${alignmentClasses[alignment] || 'justify-center'}`}>
          {ctaArray.map((button, index) => (
            <a
              key={index}
              href={button.link || '#'}
              className={`inline-block font-semibold px-8 py-3 rounded-lg transition-colors duration-200 ${getButtonStyle(button.style || style)}`}
            >
              {button.copy}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CtaBlock;
