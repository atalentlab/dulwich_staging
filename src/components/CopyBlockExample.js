import React from 'react';
import CopyBlock from './CopyBlock';

/**
 * Example usage of the CopyBlock component
 * This shows how to use the component in your pages
 */

function CopyBlockExample() {
  // Example content
  const content = [
    "We proudly welcome international students from all backgrounds who meet our academic entry requirements and admissions criteria.",
    "We invite you to consider joining the Dulwich family. Our vibrant environment fosters growth across all areas of college life, offering a holistic education for your child. Are you ready to embark on this exciting journey with us?",
    "Join our Open House or submit your registration of interest for your child/children."
  ];

  const handleCheckEligibility = () => {
    console.log("Check Eligibility clicked");
    // Add your navigation or modal logic here
    // window.location.href = '/admissions';
  };

  return (
    <div>
      {/* Default Example */}
      <CopyBlock
        title="Join the Dulwich Family"
        content={content}
        buttonText="Check Eligibility"
        buttonLink="#eligibility"
        onButtonClick={handleCheckEligibility}
      />

      {/* Custom Background Color Example */}
      <CopyBlock
        title="Discover Excellence"
        content={[
          "At Dulwich College, we believe in nurturing the whole child.",
          "Our world-class facilities and dedicated faculty create an environment where students thrive."
        ]}
        buttonText="Learn More"
        buttonLink="#learn-more"
        backgroundColor="#1a4d7a"
      />

      {/* Different Content Example */}
      <CopyBlock
        title="Apply Now"
        content={[
          "Ready to take the next step? Our admissions team is here to guide you through the process.",
          "Start your application today and join a community of excellence."
        ]}
        buttonText="Start Application"
        buttonLink="/apply"
        backgroundColor="#D30013"
      />
    </div>
  );
}

export default CopyBlockExample;
