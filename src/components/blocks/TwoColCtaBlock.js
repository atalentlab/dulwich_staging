import React from 'react';

const TwoColCtaBlock = ({ content }) => {
  const { col = [] } = content;

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {col.map((column, index) => (
            <div key={index} className="text-center">
              <a
                href={column.cta?.link || '#'}
                className="inline-block bg-[#D30013] hover:bg-[#B00010] text-white font-semibold px-8 py-3 rounded-lg"
              >
                {column.cta?.name}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TwoColCtaBlock;
