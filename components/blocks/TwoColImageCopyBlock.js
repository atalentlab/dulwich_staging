import React from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://cms.dulwich.atalent.xyz';

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
    <section data-id={anchorId} className="py-2 md:py-10 px-4 bg-white">
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
              className="prose prose-lg max-w-none
                prose-headings:font-bold prose-headings:text-gray-900 prose-headings:leading-tight
                prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-6
                prose-h2:text-2xl prose-h2:mb-6 prose-h2:mt-6 prose-h2:leading-snug
                prose-h3:text-xl prose-h3:mb-4 prose-h3:mt-5
                prose-h4:text-lg prose-h4:mb-3 prose-h4:mt-4
                prose-p:text-base prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4 prose-p:mt-0
                prose-ol:list-decimal prose-ol:ml-6 prose-ol:pl-6 prose-ol:mb-6 prose-ol:mt-4 prose-ol:space-y-3 prose-ol:text-gray-700
                prose-ul:list-disc prose-ul:ml-6 prose-ul:pl-6 prose-ul:mb-6 prose-ul:mt-4 prose-ul:space-y-3 prose-ul:text-gray-700
                prose-li:text-base prose-li:text-gray-700 prose-li:leading-relaxed prose-li:mb-3 prose-li:pl-3 prose-li:marker:text-gray-600 prose-li:marker:font-bold
                prose-strong:text-gray-900 prose-strong:font-bold
                prose-em:text-gray-700 prose-em:italic
                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline hover:prose-a:text-blue-800
                prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic
                prose-code:text-gray-800 prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded
                [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:pl-6 [&_ol]:my-6 [&_ol]:space-y-3
                [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:pl-6 [&_ul]:my-6 [&_ul]:space-y-3
                [&_li]:text-base [&_li]:text-gray-700 [&_li]:leading-relaxed [&_li]:mb-3 [&_li]:pl-3
                [&_li::marker]:text-gray-700 [&_li::marker]:font-semibold
                [&_.subtitle]:text-2xl [&_.subtitle]:font-bold [&_.subtitle]:text-gray-900 [&_.subtitle]:mb-6 [&_.subtitle]:leading-snug [&_.subtitle]:block
                [&_.lead]:text-lg [&_.lead]:font-semibold [&_.lead]:text-gray-800 [&_.lead]:mb-3"
              dangerouslySetInnerHTML={{ __html: copy }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TwoColImageCopyBlock;
