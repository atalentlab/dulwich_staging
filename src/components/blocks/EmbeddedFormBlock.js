import React from 'react';

const EmbeddedFormBlock = ({ content }) => {
  const { url, height = '800' } = content;

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-[1120px] w-full mx-auto">
        <iframe
          src={url?.startsWith('http') ? url : `https://${url}`}
          width="100%"
          height={`${height}px`}
          frameBorder="0"
          className="rounded-lg shadow-lg"
          title="Embedded Form"
        />
      </div>
    </section>
  );
};

export default EmbeddedFormBlock;
