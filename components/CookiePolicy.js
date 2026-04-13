import React, { useState, useEffect } from 'react';

function CookiePolicy() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // TESTING MODE: Always show the cookie policy (comment out for production)
    // Check if user has already accepted the policy
    // const hasAccepted = localStorage.getItem('cookiePolicyAccepted');
    const hasAccepted = null; // Force show for testing

    console.log('Cookie Policy - hasAccepted:', hasAccepted);

    if (!hasAccepted) {
      // Show the policy box after a short delay
      setTimeout(() => {
        setIsVisible(true);
      }, 1000);
    } else {
      setShouldRender(false);
    }
  }, []);

  const handleAccept = () => {
    // Start closing animation
    setIsClosing(true);

    // After animation completes, hide the component
    setTimeout(() => {
      setIsVisible(false);
      setShouldRender(false);
      // Store acceptance in localStorage
      localStorage.setItem('cookiePolicyAccepted', 'true');
    }, 500);
  };

  if (!shouldRender) return null;

  return (
    <>
      <div
        className={`fixed bottom-0 left-auto right-2 max-w-[928px] text-left z-50 flex justify-start items-end p-2 sm:p-4 pointer-events-none transition-all duration-500 ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div
          className={`bg-white rounded-2xl shadow-2xl max-w-[928px] w-full p-4 sm:p-6 pointer-events-auto transition-transform duration-500 ease-in-out ${
            isClosing ? 'translate-x-full' : 'translate-x-0'
          } ${isVisible && !isClosing ? 'cookie-policy-enter' : ''}`}
        >
        {/* Cookie Policy Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-[#8B1538] mb-4">
          Cookie Policy
        </h2>

        {/* Policy Text */}
        <p className="text-sm sm:text-base text-gray-700 mb-6 leading-relaxed">
          By continuing to use this site, you are deemed to have agreed to our Privacy Policy.
          We use cookies to improve your experience on our site and to show you relevant advertising.
          For more information on how we process your personal data and use your cookies, please read our{' '}
          <a
            href="/privacy-policy"
            className="text-[#D30013] underline hover:text-[#B8000F] transition-colors"
          >
            Privacy Policy
          </a>.
        </p>

        {/* Accept Button */}
        <button
          onClick={handleAccept}
          className="w-full sm:w-auto px-4 py-2.5 bg-[#D30013] text-white text-sm font-medium rounded-lg hover:bg-[#B8000F] transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
        >
          Accept and Continue
        </button>
      </div>
    </div>
    </>
  );
}

export default CookiePolicy;
