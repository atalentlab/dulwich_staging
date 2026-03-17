import React from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://www.dulwich.atalent.xyz';

const QuoteBlock = ({ content }) => {
  const {
    name,
    position,
    image,
    copy,
    'anchor-id': anchorId
  } = content;
  const imageUrl = image?.startsWith('http') ? image : `${API_BASE_URL}${image}`;

  return (
    <section data-id={anchorId} className="py-12 my-3 mx-2 px-4 mb-8 bg-[#FAF7F5]">
      <div className="max-w-[1120px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8 lg:gap-12 items-start">
          {/* Image Section */}
          {image && (
            <div className="flex-shrink-0">
              <img
                src={imageUrl}
                alt={name || 'Quote author'}
                className="w-full lg:w-[180px] h-auto rounded-lg object-cover"
              />
            </div>
          )}

          {/* Quote Content Section */}
          <div className="relative flex gap-4">
            {/* Quote character */}
            <div className="flex-shrink-0 leading-none">
              <span className="font-['Figtree'] text-[#ddd] font-light text-left opacity-100 text-[96px] leading-[110px] sm:text-[160px] sm:leading-[900px] md:text-[200px] md:leading-[120px] lg:text-[232px] lg:leading-[156px] select-none">
                &ldquo;
              </span>
            </div>

            <div className="flex-1">
              {/* Quote Text */}
              <blockquote className="text-base lg:text-lg text-left text-gray-700 leading-relaxed mb-4">
                {copy}
              </blockquote>

              {/* Attribution */}
              <cite className="not-italic text-left">
                <div className="font-bold text-gray-900">
                  {name}{position && `, ${position}`}
                </div>
              </cite>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuoteBlock;
