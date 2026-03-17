# Full-Screen Scrolling Implementation Guide

## Overview

Your React website now features a premium, Apple-style full-screen scrolling experience where each section occupies the entire viewport and smoothly snaps into place as users scroll.

## How It Works

### Architecture

The implementation uses three key technologies:

1. **CSS Scroll Snap** - Native browser feature for section snapping
2. **Lenis** - Smooth scrolling library for buttery-smooth physics
3. **Intersection Observer** - Tracks which section is currently active

### Key Files Modified

#### 1. `/src/pages/Home.js`
- Main landing page with 16 full-screen sections
- Uses `scroll-snap-align: start` on each section
- Implements IntersectionObserver to track active section
- Navigation dots allow jumping to specific sections

#### 2. `/src/components/SmoothScrolling.js`
- Wrapper component that initializes Lenis
- Configured with Apple-style easing and timing
- Enabled smooth scrolling on both desktop and mobile

#### 3. `/src/styles/smoothScroll.css`
- Hides scrollbars for cleaner appearance
- Defines scroll-snap container styles
- Includes fade-in animations for sections
- Premium easing curves for all transitions

## Features

### Desktop Experience
- Scroll with mouse wheel - one section at a time
- Click navigation dots on the right to jump to any section
- Smooth easing and physics create premium feel

### Mobile Experience
- Swipe up/down to navigate sections
- Touch-optimized smooth scrolling enabled
- Responsive layout adapts to all screen sizes

### Navigation
- **Navigation Dots**: Fixed on the right (desktop) or bottom (mobile)
- **Active Indicator**: Blue dot shows current section
- **Click to Jump**: Click any dot to scroll to that section

## How to Add a New Section

1. **Update section count** in `Home.js`:
```javascript
const totalSections = 17; // Increment this number
```

2. **Add your new section** inside the main container:
```javascript
<section
  ref={(el) => (sectionsRef.current[16] = el)} // Use next index
  className="w-full h-screen flex-shrink-0 flex items-center justify-center bg-white"
  style={{
    scrollSnapAlign: 'start',
    scrollSnapStop: 'always',
  }}
>
  {/* Your content here */}
  <YourComponent />
</section>
```

## Customization

### Adjust Scroll Speed
Edit `/src/components/SmoothScrolling.js`:
```javascript
const lenis = new Lenis({
  duration: 1.5, // Increase for slower, decrease for faster
  // ...
});
```

### Change Easing Curve
Modify the easing function for different feel:
```javascript
easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
```

### Show Scrollbars
Remove scrollbar hiding in `/src/styles/smoothScroll.css` (lines 45-66)

### Disable Smooth Scrolling
Remove or comment out `<SmoothScrolling>` wrapper in `/src/App.js`

## Browser Support

- **Chrome/Edge**: Full support ✓
- **Safari**: Full support ✓
- **Firefox**: Full support ✓
- **Mobile Safari**: Full support ✓
- **Mobile Chrome**: Full support ✓

## Performance Notes

- Sections use `flex-shrink-0` to prevent layout shifts
- IntersectionObserver is hardware-accelerated
- CSS scroll-snap is GPU-accelerated
- Lenis uses requestAnimationFrame for optimal performance

## Troubleshooting

### Sections not snapping properly
- Ensure each section has `scroll-snap-align: start`
- Check that container has `scroll-snap-type: y mandatory`
- Verify sections are exactly `h-screen` (100vh)

### Scrolling feels too fast/slow
- Adjust `duration` in SmoothScrolling.js
- Modify `wheelMultiplier` for mouse wheel speed
- Change `touchMultiplier` for mobile swipe speed

### Navigation dots not updating
- Check IntersectionObserver threshold (currently 0.5)
- Ensure sections are properly ref'd in sectionsRef array
- Verify activeSection state is being set correctly

## Testing Your Changes

1. **Development**: `npm start`
2. **Build**: `npm run build`
3. **Preview Build**: `npm install -g serve && serve -s build`

## Routes

- Main site: `http://localhost:3000/landing-page`
- The full-screen scrolling is implemented on the `/landing-page` route

## Next Steps

Consider adding:
- GSAP animations triggered when sections become visible
- Parallax effects for depth
- Loading transitions between sections
- Preloading images for smoother experience
- Custom scroll indicators
- Section-specific animations

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify all dependencies are installed: `npm install`
3. Clear cache and rebuild: `rm -rf node_modules build && npm install && npm run build`
4. Ensure you're on the correct route: `/landing-page`
