import React from 'react';
import { motion } from 'framer-motion';

/**
 * TextBlock Component
 * A high-impact text component with animated two-tone headline and eyebrow.
 *
 * API content structure:
 * {
 *   "style": "full_width",
 *   "eyebrow": "OUR COMMUNITY",
 *   "red_heading": "Building bridges",
 *   "grey_heading": "to the World",
 *   "content": "<p>HTML content here</p>",
 *   "anchor-id": null
 * }
 *
 * Features:
 * - Animated eyebrow text
 * - Two-tone headline (red + dark grey)
 * - HTML content support
 * - Responsive design
 * - Framer Motion animations
 */

// Decode double-encoded HTML entities like &lt;p&gt; → <p>
const decodeHtmlEntities = (html) => {
  if (!html) return '';
  const textarea = document.createElement('textarea');
  textarea.innerHTML = html;
  return textarea.value;
};

const TextBlock = ({ content }) => {
  const {
    eyebrow,
    red_heading: redHeading,
    grey_heading: greyHeading,
    content: htmlContent,
    'anchor-id': anchorId
  } = content || {};

  // Return null if no content to display
  if (!eyebrow && !redHeading && !greyHeading && !htmlContent) {
    return null;
  }

  return (
    <section
      data-id={anchorId}
      className="pb-4 mt-4 md:pb-10 md:mt-10 px-4">
      <div className="max-w-[1120px] mx-auto text-left">
        {/* Eyebrow */}
        {eyebrow && (
          <div className="flex flex-col mb-4">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xs font-bold tracking-wider text-[#3C3C3B] uppercase"
            >
              {eyebrow}
            </motion.span>
          </div>
        )}

        {/* Main Title - Two-tone Headline */}
        {(redHeading || greyHeading) && (
          <h2 className="text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
            {redHeading && (
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-[#9E1422] inline-block font-extrabold"
              >
                {redHeading}
              </motion.span>
            )}
            {greyHeading && (
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className={`text-[#3C3737] font-extrabold block ${redHeading ? 'mt-2' : ''}`}
              >
                {greyHeading}
              </motion.span>
            )}
          </h2>
        )}

        {/* HTML Content */}
        {htmlContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="prose prose-lg max-w-none mt-6
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
            dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(htmlContent) }}
          />
        )}
      </div>
    </section>
  );
};

export default TextBlock;
