# IcoMoon Icons - Usage Guide

Your icomoon icons are now fully integrated and ready to use!

## Quick Start

```jsx
import Icon from './components/Icon';

function MyComponent() {
  return (
    <div>
      {/* Basic usage */}
      <Icon icon="Icon-Home" size={24} />

      {/* With color */}
      <Icon icon="Icon-Star" size={32} color="#D30013" />

      {/* With Tailwind classes */}
      <Icon icon="Icon-Menu" className="text-blue-500 hover:text-blue-700" size={24} />
    </div>
  );
}
```

## Icon Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | string | - | **Required**. Icon name from the list below |
| `size` | number | 16 | Icon size in pixels |
| `color` | string | - | Icon color (hex, rgb, or CSS color) |
| `className` | string | - | Additional CSS classes (Tailwind works!) |

## Available Icons (43 total)

### Navigation & UI
- `Close-Button`
- `Icon-Home`
- `Icon-Menu`
- `Icon-Arrow`
- `Arrow-Small`
- `Icon-Chevron-small`
- `Icon-Chevron-Large`
- `Icon---Expand`
- `Button-Expand`
- `Button-Accordion-Large`

### Actions & Tools
- `Icon-Add`
- `Icon-Search`
- `Icon---Download`
- `Icon_Copy`
- `Icon-Minimize`
- `Icon-Cycle`
- `Icon-Camera`

### Status & Alerts
- `Icon-Info`
- `Icon-Alert`
- `Icon_Tick-Solid`
- `Icon-Cross-Solid`
- `Icon-Star`
- `Shield`
- `Icon-Hourglass`
- `Icon-Clock`

### Communication
- `Icon_Email`
- `Icon_Phone`
- `Icon_External`
- `Icon-Pin`

### Files & Documents
- `Icon---PDF`

### Social Media
- `Icon-Social-FB` (Facebook)
- `Icon-Social-IG` (Instagram)
- `Icon-Social-YT` (YouTube)
- `Icon-Social-LI` (LinkedIn)
- `Icon-Social-RedNote`
- `Icon-Social-WC`
- `Icon-Social-YK`

### User & Profile
- `Icon-Profile_Add`
- `Age-Range`

### Other
- `Icon-AI`
- `Icon---Lang`
- `Icon-Lang-En`
- `Icon-Schools`

## Usage Examples

### Basic Icons
```jsx
<Icon icon="Icon-Home" size={24} />
<Icon icon="Icon-Menu" size={24} />
<Icon icon="Icon-Search" size={24} />
```

### Colored Icons
```jsx
<Icon icon="Icon-Alert" size={32} color="#D30013" />
<Icon icon="Icon-Info" size={32} color="#0066cc" />
<Icon icon="Icon_Tick-Solid" size={32} color="#00aa00" />
```

### With Tailwind Styling
```jsx
<Icon
  icon="Icon-Arrow"
  className="text-red-600 hover:text-red-800 cursor-pointer transition-colors"
  size={24}
/>

<Icon
  icon="Icon-Chevron-Large"
  className="text-blue-500 rotate-90 transform"
  size={24}
/>
```

### In Buttons
```jsx
<button className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded">
  <Icon icon="Icon---Download" size={20} color="white" />
  Download PDF
</button>

<button className="flex items-center gap-2">
  <Icon icon="Icon-Social-FB" size={20} color="#1877f2" />
  Share on Facebook
</button>
```

### Social Media Icons
```jsx
<div className="flex gap-4">
  <Icon icon="Icon-Social-FB" size={28} color="#1877f2" />
  <Icon icon="Icon-Social-IG" size={28} color="#E4405F" />
  <Icon icon="Icon-Social-YT" size={28} color="#FF0000" />
  <Icon icon="Icon-Social-LI" size={28} color="#0A66C2" />
</div>
```

### Responsive Sizes
```jsx
<Icon
  icon="Icon-Menu"
  className="w-6 h-6 md:w-8 md:h-8"
  size={24}
/>
```

## View All Icons

To see all icons in action, you can import and use the example component:

```jsx
import IconExample from './components/IconExample';

// In your route or page
<IconExample />
```

## Tips

1. **Icon names are case-sensitive** - Use exact names from the list above
2. **Color can be set via prop or className** - Both work with Tailwind
3. **Size can be responsive** - Combine size prop with Tailwind classes
4. **Icons work with transforms** - Use Tailwind transform utilities (rotate, scale, etc.)
5. **Accessible** - Add `aria-label` for screen readers when icons are clickable

## Need More Icons?

1. Go to [IcoMoon.io](https://icomoon.io/app/)
2. Import your current `selection.json` from `src/assets/icomoon/`
3. Add/remove icons
4. Download and replace the files in `src/assets/icomoon/`
5. Icons will be automatically available!
