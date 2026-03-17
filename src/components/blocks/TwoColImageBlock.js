import React from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://www.dulwich.atalent.xyz';

const TwoColImageBlock = ({ content }) => {
  const {
    col = [],
    caption,
    'anchor-id': anchorId
  } = content;

  // Convert col object to array if it's an object
  const colArray = col ? (Array.isArray(col) ? col : Object.values(col)) : [];

  // Enhanced prose classes for comprehensive HTML tag styling

  return (
    <section data-id={anchorId} className="py-12 px-4 bg-white">
      <div className="max-w-[1120px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {colArray.map((column, index) => {
            const imageUrl = column.image?.startsWith('http')
              ? column.image
              : `${API_BASE_URL}${column.image}`;

            return (
              <div key={index} className="relative group overflow-hidden">
                <img
                  src={imageUrl}
                  alt={column.title || `Image ${index + 1}`}
                  className="w-full h-auto object-cover aspect-[16/10]"
                  loading="lazy"
                />

                {/* Title overlay on image */}
                {column.title && (
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl md:text-3xl text-left font-bold text-white drop-shadow-lg">
                      {column.title}
                    </h3>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Caption below the grid */}
        {caption && (
          <div
            className={` mt-6 text-left`}
            style={{
              lineHeight: '1.7',
              color: '#374151'
            }}
            dangerouslySetInnerHTML={{ __html: caption }}
          />
        )}
      </div>
    </section>
  );
};

export default TwoColImageBlock;
