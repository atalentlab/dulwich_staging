# CopyBlock Component - Usage Guide

A reusable content block component with a colored background and white card overlay, perfect for call-to-action sections.

## Component Location
`src/components/CopyBlock.js`

## Features
✅ Responsive design (mobile & desktop)
✅ Customizable background color
✅ Multiple content paragraphs support
✅ CTA button with icon
✅ Hover animations
✅ Clean card design

## Basic Usage

```jsx
import CopyBlock from './components/CopyBlock';

function MyPage() {
  return (
    <CopyBlock
      title="Join the Dulwich Family"
      content={[
        "We proudly welcome international students from all backgrounds who meet our academic entry requirements and admissions criteria.",
        "We invite you to consider joining the Dulwich family."
      ]}
      buttonText="Check Eligibility"
      buttonLink="#eligibility"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | "Join the Dulwich Family" | Main heading text |
| `content` | array | [] | Array of paragraph strings |
| `buttonText` | string | "Check Eligibility" | CTA button text |
| `buttonLink` | string | "#" | Button href link |
| `backgroundColor` | string | "#9E1422" | Background color (hex/rgb) |
| `onButtonClick` | function | undefined | Optional click handler |

## Examples

### Example 1: Default (As shown in design)
```jsx
<CopyBlock
  title="Join the Dulwich Family"
  content={[
    "We proudly welcome international students from all backgrounds who meet our academic entry requirements and admissions criteria.",
    "We invite you to consider joining the Dulwich family. Our vibrant environment fosters growth across all areas of college life, offering a holistic education for your child. Are you ready to embark on this exciting journey with us?",
    "Join our Open House or submit your registration of interest for your child/children."
  ]}
  buttonText="Check Eligibility"
  buttonLink="/admissions/eligibility"
/>
```

### Example 2: Custom Background Color
```jsx
<CopyBlock
  title="Discover Excellence"
  content={[
    "At Dulwich College, we believe in nurturing the whole child.",
    "Our world-class facilities and dedicated faculty create an environment where students thrive."
  ]}
  buttonText="Learn More"
  buttonLink="/about"
  backgroundColor="#1a4d7a"
/>
```

### Example 3: With Click Handler
```jsx
function MyComponent() {
  const handleApply = () => {
    // Custom logic
    console.log("Opening application form...");
    // Navigate or open modal
  };

  return (
    <CopyBlock
      title="Apply Now"
      content={[
        "Ready to take the next step?",
        "Start your application today."
      ]}
      buttonText="Start Application"
      buttonLink="/apply"
      onButtonClick={handleApply}
      backgroundColor="#D30013"
    />
  );
}
```

### Example 4: Single Paragraph
```jsx
<CopyBlock
  title="Open House Event"
  content={[
    "Join us for our upcoming Open House event and experience Dulwich College firsthand."
  ]}
  buttonText="Register Now"
  buttonLink="/events/open-house"
/>
```

## Styling

The component uses:
- **Tailwind CSS** for responsive layout
- **Inline styles** for dynamic colors
- **Transitions** for smooth hover effects
- **Icomoon icons** for the arrow icon

## Responsive Behavior

- **Mobile (< 1024px)**:
  - Smaller padding
  - Adjusted font sizes
  - Full-width card

- **Desktop (≥ 1024px)**:
  - Larger padding and spacing
  - Bigger typography
  - Max-width card (2xl)

## Color Variables

Default Dulwich colors:
- Background: `#9E1422` (Dark Dulwich Red)
- Button: `#D30013` (Primary Dulwich Red)
- Button Hover: `#B8000F` (Darker Red)

## Adding to Your Page

```jsx
import CopyBlock from '../components/CopyBlock';

function Home() {
  return (
    <div>
      <HomeBanner />

      {/* Add CopyBlock anywhere in your page */}
      <CopyBlock
        title="Join the Dulwich Family"
        content={[
          "Your content here...",
          "Another paragraph..."
        ]}
        buttonText="Get Started"
        buttonLink="/get-started"
      />

      <OtherSections />
    </div>
  );
}
```

## Notes

- The component is fully responsive
- Uses the Icon component for the arrow (requires Icon.js)
- Button includes scale animations on hover/click
- Content array can have any number of paragraphs
- Background can be any valid CSS color value
