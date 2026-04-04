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
            className="text-base lg:text-lg text-[#3C3737] leading-relaxed [&_p]:mb-4 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_em]:italic"
            dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(htmlContent) }}
          />
        )}
      </div>
    </section>
  );
};

export default TextBlock;
