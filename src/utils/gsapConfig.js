import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register plugins
gsap.registerPlugin(ScrollTrigger);

/**
 * Global GSAP Configuration
 * Prevents errors from crashing the app when DOM nodes are removed
 */

// Configure GSAP to handle errors gracefully
gsap.config({
  nullTargetWarn: false, // Don't warn about null targets
  autoSleep: 60,
});

// Add error handling to prevent removeChild errors
const originalRemoveChild = Element.prototype.removeChild;
Element.prototype.removeChild = function(child) {
  try {
    if (child && child.parentNode === this) {
      return originalRemoveChild.call(this, child);
    }
  } catch (error) {
    // Silently catch removeChild errors from GSAP animations
    if (!error.message?.includes('removeChild')) {
      console.warn('DOM manipulation error:', error);
    }
  }
  return child;
};

// Configure ScrollTrigger defaults
ScrollTrigger.config({
  autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
  ignoreMobileResize: true,
});

// Add global ScrollTrigger error handler
ScrollTrigger.addEventListener('refresh', () => {
  // Debounce refresh to prevent excessive calls
  ScrollTrigger.refresh();
});

/**
 * Safely create a GSAP context for React components
 * @param {Function} callback - GSAP animation function
 * @param {React.RefObject} scope - Scope ref
 * @returns {Object} Context with cleanup function
 */
export const createSafeGsapContext = (callback, scope) => {
  const ctx = gsap.context(callback, scope);

  return {
    revert: () => {
      try {
        ctx.revert();
      } catch (error) {
        // Silently handle cleanup errors
        console.debug('GSAP cleanup warning:', error.message);
      }
    }
  };
};

/**
 * Safely kill all ScrollTriggers
 */
export const killAllScrollTriggers = () => {
  try {
    ScrollTrigger.getAll().forEach(trigger => {
      try {
        trigger.kill();
      } catch (error) {
        // Ignore individual kill errors
      }
    });
  } catch (error) {
    console.debug('ScrollTrigger cleanup warning:', error.message);
  }
};

/**
 * Safely refresh ScrollTrigger
 */
export const safeScrollTriggerRefresh = () => {
  try {
    ScrollTrigger.refresh();
  } catch (error) {
    console.debug('ScrollTrigger refresh warning:', error.message);
  }
};

export { gsap, ScrollTrigger };
export default gsap;
