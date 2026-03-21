import { useEffect } from 'react';

/**
 * useSEO Hook
 * Dynamically updates all document head meta tags using banner data from the API.
 * Fields used: meta_title, meta_description, meta_keywords, header_image
 */

// Placeholder patterns — omit og:image entirely for these
const isPlaceholderImage = (src) =>
  !src || src.includes('no-image.gif') || src.includes('placeholders/no-image');

// Resolve OG image — use direct CDN URL if valid, empty otherwise.
const resolveOgImage = (src) => {
  if (!src || isPlaceholderImage(src)) return '';
  return src;
};

const useSEO = ({ meta_title, meta_description, meta_keywords, og_image } = {}) => {
  useEffect(() => {
    // Update document title with fallback (handle both null and string "null")
    const validTitle = meta_title && meta_title !== 'null' ? meta_title : 'Dulwich International Schools';
    document.title = validTitle;

    // Helper: always set a <meta name="..."> tag (creates if missing, clears if empty)
    const setMetaName = (name, content = '') => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        if (!content) return;           // no value & no tag — nothing to do
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    // Helper: always set a <meta property="..."> tag (creates if missing, clears if empty)
    const setMetaProperty = (property, content = '') => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        if (!content) return;           // no value & no tag — nothing to do
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);  // always write — clears stale value
    };

    // Use direct CDN image URL (simple and reliable for WhatsApp/social crawlers)
    const resolvedImage = resolveOgImage(og_image);
    const imageAlt = meta_title || 'Dulwich International Schools';

    // Standard meta tags
    setMetaName('description', meta_description);
    setMetaName('keywords', meta_keywords);

    // Open Graph — read by WhatsApp, Facebook, LinkedIn, Telegram
    setMetaProperty('og:title', meta_title);
    setMetaProperty('og:description', meta_description);
    setMetaProperty('og:image', resolvedImage);        // always updated (clears stale image)
    setMetaProperty('og:image:alt', imageAlt);
    setMetaProperty('og:url', window.location.href);
    setMetaProperty('og:type', 'website');

    // Twitter Card — read by Twitter / X
    setMetaName('twitter:title', meta_title);
    setMetaName('twitter:description', meta_description);
    setMetaName('twitter:image', resolvedImage);       // always updated (clears stale image)
    setMetaName('twitter:image:alt', imageAlt);

  }, [meta_title, meta_description, meta_keywords, og_image]);
};

export default useSEO;
