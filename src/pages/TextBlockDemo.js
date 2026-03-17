import React from 'react';
import TextBlock from '../components/TextBlock'; // Standalone component with direct props

/**
 * TextBlockDemo - Static page showcasing the TextBlock component
 *
 * This page demonstrates various configurations of the TextBlock component
 * including different layouts, content types, and styling options.
 */
const TextBlockDemo = () => {
  return (
    <div className="text-block-demo">
      {/* Example 1: Full-featured block with image on right */}
      <TextBlock
        eyebrow="DULWICH COLLEGE INTERNATIONAL"
        title="Founded by <span style='color: #D30013;'>parents</span>, driven by excellence"
        subtitle="A Legacy of Educational Innovation"
        content={[
          "Since our founding, Dulwich College International has been committed to providing world-class education that nurtures each student's unique potential.",
          "<strong>Our approach</strong> combines academic rigor with a deep understanding of individual student needs, creating an environment where children thrive both academically and personally.",
          "We believe that education extends beyond the classroom, fostering <em>creativity</em>, <em>critical thinking</em>, and <em>global citizenship</em> in every aspect of school life."
        ]}
        attribution="— Dulwich College International Community"
        buttonText="Learn More About Our Story"
        buttonLink="#about"
        image="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80"
        imageAlt="Students engaged in collaborative learning"
        imagePosition="right"
        backgroundColor="#ffffff"
        anchorId="section-1"
      />

      {/* Example 2: Image on left, different background */}
      <TextBlock
        eyebrow="OUR APPROACH"
        title="Personalized Learning for <span style='color: #D30013;'>Every Student</span>"
        content={[
          "At Dulwich, we recognize that every child learns differently. Our innovative curriculum is designed to adapt to individual learning styles and pace.",
          "Through small class sizes and dedicated mentorship, we ensure that each student receives the attention and support they need to excel."
        ]}
        buttonText="Explore Our Programs"
        buttonLink="#programs"
        image="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80"
        imageAlt="Teacher working one-on-one with student"
        imagePosition="left"
        backgroundColor="#F8F9FA"
        anchorId="section-2"
      />

      {/* Example 3: Text-only block (no image) */}
      <TextBlock
        eyebrow="OUR VALUES"
        title="Excellence Through <span style='color: #D30013;'>Character</span> and <span style='color: #D30013;'>Community</span>"
        subtitle="Building Tomorrow's Leaders Today"
        content={[
          "Our educational philosophy is built on three core pillars: <strong>academic excellence</strong>, <strong>character development</strong>, and <strong>global perspective</strong>.",
          "We cultivate an inclusive community where students from diverse backgrounds come together to learn, grow, and prepare for an interconnected world.",
          "Through our comprehensive programs, students develop not just knowledge, but the wisdom, empathy, and leadership skills needed to make a positive impact on society."
        ]}
        attribution="Dulwich Educational Philosophy, Est. 1619"
        buttonText="Discover Our Values"
        buttonLink="#values"
        backgroundColor="#ffffff"
        anchorId="section-3"
      />

      {/* Example 4: Minimal content */}
      <TextBlock
        title="Join Our <span style='color: #D30013;'>Community</span>"
        content={[
          "Experience the Dulwich difference. Schedule a campus tour and see how we can help your child reach their full potential."
        ]}
        buttonText="Book a Campus Tour"
        buttonLink="#contact"
        image="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80"
        imageAlt="Dulwich College campus"
        imagePosition="right"
        backgroundColor="#F8F9FA"
        anchorId="section-4"
      />

      {/* Example 5: Content with custom styling */}
      <TextBlock
        eyebrow="GLOBAL NETWORK"
        title="<span style='color: #D30013;'>15+</span> Schools Across Asia"
        subtitle="A Truly International Education"
        content={[
          "With schools in <strong>China</strong>, <strong>Singapore</strong>, <strong>South Korea</strong>, and <strong>Myanmar</strong>, Dulwich College International offers a consistent world-class education across diverse cultural contexts.",
          "Our global network provides unique opportunities for student exchanges, collaborative projects, and a truly international perspective on learning and life."
        ]}
        buttonText="View All Locations"
        buttonLink="#locations"
        image="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80"
        imageAlt="Global network visualization"
        imagePosition="left"
        backgroundColor="#ffffff"
        anchorId="section-5"
      />

      {/* Example 6: Custom button action */}
      <TextBlock
        eyebrow="GET IN TOUCH"
        title="Ready to Start Your <span style='color: #D30013;'>Dulwich Journey</span>?"
        content={[
          "Our admissions team is here to guide you through every step of the enrollment process. Whether you have questions about our curriculum, facilities, or community, we're ready to help.",
          "Contact us today to learn more about how Dulwich can provide the exceptional education your child deserves."
        ]}
        buttonText="Contact Admissions"
        onButtonClick={() => {
          console.log('Custom button action triggered!');
          alert('This would open a contact form or redirect to admissions page');
        }}
        image="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80"
        imageAlt="Admissions team meeting with parents"
        imagePosition="right"
        backgroundColor="#F8F9FA"
        anchorId="section-6"
      />
    </div>
  );
};

export default TextBlockDemo;
