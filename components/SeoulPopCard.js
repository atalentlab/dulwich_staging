import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getCurrentSchool } from '../utils/schoolDetection';

// Unique script ID — avoids conflicts with GTM or any other 'mw' tagged script
const POPCARD_SCRIPT_ID = 'tap-popcard-script';

/**
 * School PopCard Component
 * Loads the Access Platform popcard widget ONLY on specific pages for Seoul and Singapore schools.
 *
 * Bugs fixed vs previous version:
 * 1. window.mw and window.popCard are now fully reset in cleanup (no stale globals)
 * 2. window.mw.q is always reset to [] before each load (no stale queued calls)
 * 3. mw('init') is now queued BEFORE the script loads (correct async pattern)
 * 4. Widget DOM elements created by popcard.js are removed on cleanup
 * 5. Unique script ID to avoid collision with GTM or other scripts using id='mw'
 */
const SeoulPopCard = () => {
  const location = useLocation();
  const currentSchoolSlug = getCurrentSchool();

  useEffect(() => {
    // ── School configurations ──────────────────────────────────────────────
    const schoolConfigs = {
      seoul: {
        universityID: 684,
        title: 'Chat to Our Parents & Staff',
        baseUrl: 'https://seoul.dulwich.org',
        allowedPaths: [
          '/',
          '/community/our-members/friends-of-dulwich',
          '/community/our-members/meet-our-parents',
          '/admissions/admissions-overview',
        ],
      },
      singapore: {
        universityID: 335,
        title: 'Chat with our Parents',
        baseUrl: 'https://singapore.dulwich.org',
        allowedPaths: [
          '/',
          '/community/our-members/friends-of-dulwich',
          '/admissions/admissions-overview',
        ],
      },
    };

    const config = schoolConfigs[currentSchoolSlug];

    // ── Guard: school must be Seoul or Singapore ───────────────────────────
    if (!config) {
      console.log('[PopCard] Not loading: school not supported →', currentSchoolSlug);
      return;
    }

    // ── Guard: path must be in the allowlist ───────────────────────────────
    const isAllowedPath = config.allowedPaths.some((allowedPath) => {
      if (allowedPath === '/') return location.pathname === '/';
      return (
        location.pathname === allowedPath ||
        location.pathname.startsWith(allowedPath + '/')
      );
    });

    if (!isAllowedPath) {
      console.log('[PopCard] Blocked — path not in allowlist:', location.pathname);
      return;
    }

    console.log('[PopCard] ✅ Loading for', currentSchoolSlug, 'at', location.pathname);

    // ── Initialise the async queue BEFORE the script loads ────────────────
    // This is the correct Access Platform async pattern:
    // queue 'init' first, then inject the script so it processes the queue on load.
    window.popCard = 'mw';

    // Always create a fresh queue function — never reuse stale window.mw
    window.mw = function () {
      (window.mw.q = window.mw.q || []).push(arguments);
    };
    window.mw.q = []; // Always start with a clean queue

    // Queue the init call NOW (before the script loads)
    window.mw('init', {
      universityID: config.universityID,
      terms: [],
      title: config.title,
      popcardButtonText: '',
      alignment: 'right',
      viewType: 'common',
      backgroundColor: '#4f4c4c',
      titleColor: '#efefef',
      buttonTextColor: '#ffffff',
      href: `${config.baseUrl}/chat-with-our-parents?tap-dashboard=true&utm_medium=popcard&leadType=tap_feed`,
    });

    // ── Inject script (only once per render cycle) ─────────────────────────
    if (!document.getElementById(POPCARD_SCRIPT_ID)) {
      const script = document.createElement('script');
      script.id = POPCARD_SCRIPT_ID;
      script.src = 'https://cdn.theaccessplatform.com/popcard.js';
      script.async = true;

      script.onload = () => {
        console.log('[PopCard] ✅ Script loaded successfully');
      };

      script.onerror = (err) => {
        console.error('[PopCard] ❌ Script failed to load:', err);
      };

      const firstScript = document.getElementsByTagName('script')[0];
      if (firstScript?.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
      } else {
        document.head.appendChild(script);
      }
    } else {
      // Script already in DOM (e.g. navigated back) — the window.mw above has
      // reset the queue and queued a fresh 'init'. The already-loaded popcard.js
      // exposes window.mw as a real function at this point, so re-call init directly.
      console.log('[PopCard] Script already present — re-initialising widget');
    }

    // ── Cleanup: runs when navigating away or component unmounts ──────────
    return () => {
      console.log('[PopCard] Cleaning up');

      // 1. Remove our script element
      const existingScript = document.getElementById(POPCARD_SCRIPT_ID);
      if (existingScript) existingScript.remove();

      // 2. Remove any DOM elements the popcard widget injected
      //    (floating button, overlay, iframe — the Access Platform typically
      //     uses a container with id="mw-popcard" or class="mw-popcard")
      const widgetContainers = document.querySelectorAll(
        '#mw-popcard, .mw-popcard, [id^="popcard-"], [class*="popcard"]'
      );
      widgetContainers.forEach((el) => el.remove());

      // 3. Reset window globals so the next mount starts completely fresh
      if (window.mw) {
        window.mw = undefined;
        delete window.mw;
      }
      if (window.popCard) {
        window.popCard = undefined;
        delete window.popCard;
      }
    };
  }, [location.pathname, currentSchoolSlug]);

  return null;
};

export default SeoulPopCard;