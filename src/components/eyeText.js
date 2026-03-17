import React from 'react';
import { motion } from 'framer-motion';

/**
 * EyeText Component
 * A high-impact text component with a two-tone headline and eyebrow.
 *
 * Props:
 * - eyebrow: Optional small uppercase text above (e.g., "OUR COMMUNITY")
 * - redText: The first part of the headline in Dulwich Red
 * - blackText: The second part of the headline in Dark Grey
 * - align: 'left' | 'center' | 'right' (default: 'left')
 * - className: Optional extra classes
 */
const EyeText = ({
    eyebrow,
    redText,
    blackText,

}) => {

    return (
        <div className={`max-w-[1120px] m-auto text-left`}>
            {/* Eyebrow */}
            {eyebrow && (
                <div className="flex flex-col mb-4">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-xs font-bold tracking-wider text-gray-600 uppercase"
                    >
                        {eyebrow}
                    </motion.span>
                </div>
            )}

            {/* Main Title */}
            <h2 className="text-4xl lg:text-5xl font-figtree font-bold leading-tight tracking-tight">
                {redText && (
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-[#9E1422] inline-block"
                    >
                        {redText}
                    </motion.span>
                )}
                <br />
                {blackText && (
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-[#3C3737]"
                    >
                        {blackText}
                    </motion.span>
                )}
            </h2>
        </div>
    );
};

export default EyeText;
