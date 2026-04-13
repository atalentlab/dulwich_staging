import React from 'react';
import { Link } from 'react-router-dom';
import useCookieConsent from '../../hooks/useCookieConsent';

const CookieConsentBanner = () => {
  const { consentGiven, acceptAll } = useCookieConsent();

  if (consentGiven) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9001] bg-[#000]/60 backdrop-blur px-4 py-7">
      <div className="max-w-[1120px] text-left m-auto">

        {/* Text */}
        <p className="text-[14px] text-left text-white leading-relaxed mb-4">
          By continuing to use this site, you are deemed to have agreed to our{' '}
          <Link
            to="/privacy-policy"
            className="text-[#D30013] underline hover:text-red-400 transition-colors"
          >
            Privacy Policy
          </Link>
          . We use cookies to improve your experience on our site and to show you relevant
          advertising. For more information on how we process your personal data and use your
          cookies, please read our Privacy Policy.
        </p>

        {/* Button */}
        <button
          onClick={acceptAll}
          className="px-6 py-3 text-left bg-[#D30013] text-white text-xs font-bold rounded-lg tracking-widest uppercase hover:bg-[#B8000F] transition-colors"
        >
          ACCEPT AND CONTINUE
        </button>

      </div>
    </div>
  );
};

export default CookieConsentBanner;
