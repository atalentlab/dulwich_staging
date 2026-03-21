import React from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://cms.dulwich.org';

const TwoColImageCopyBlock = ({ content }) => {
  const {
    copy,
    image,
    'image_description': imageDescription,
    alignment,
    'anchor-id': anchorId,
    title
  } = content;
  const imageUrl = image?.startsWith('http') ? image : `${API_BASE_URL}${image}`;

  return (
    <section data-id={anchorId} className="py-12 px-4 bg-white">
      <div className="max-w-[1120px] mx-auto text-left p-2">
        {title && (
          <h2 className="text-lg font-semibold text-[#3C3C3B] mb-6">
            {title}
          </h2>
        )}

        <div className={`flex flex-col ${alignment === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-12 items-start`}>
          {/* Image column */}
          <div className="flex-shrink-0">
            <img
              src={imageUrl}
              alt={imageDescription || 'Content image'}
              className="min-w-[350px] w-full max-w-[350px] h-auto rounded-lg object-cover"
            />
          </div>

          {/* Text column */}
          <div className="flex-1">
            <div
              className="prose prose-base max-w-none
                prose-headings:font-bold prose-headings:text-[#3C3C3B] prose-headings:mb-4
                prose-h3:text-base prose-h3:font-semibold
                prose-p:text-[#3C3C3B] prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-ul:list-disc prose-ol:list-decimal"
              dangerouslySetInnerHTML={{ __html: copy }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TwoColImageCopyBlock;
