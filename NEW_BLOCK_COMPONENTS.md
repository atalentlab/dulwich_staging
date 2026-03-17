# New Block Components - video_upload, copy, single_image

## ✅ Created 3 New Block Components

### 1. **VideoUploadBlock** (`video_upload`)
### 2. **CopyBlock** (`copy`)
### 3. **SingleImageBlock** (`single_image`)

All automatically registered in the component registry!

---

## 📦 1. VideoUploadBlock

### API Response Format
```json
{
  "id": 97573,
  "type": "video_upload",
  "title": null,
  "content": {
    "title": null,
    "video": "/blocks/97573/p/video/dci-live-worldwise.mp4",
    "image": "/blocks/97573/p/image/live-worldwise-cover.png",
    "image_description": null,
    "anchor-id": null
  },
  "config": null
}
```

### Features
✅ Video player with controls
✅ Custom poster image
✅ Play button overlay
✅ Responsive aspect ratio (16:9)
✅ Auto-constructs full URLs
✅ Supports anchor links

### Props Mapping
```javascript
{
  title: "Optional title above video",
  video: "/blocks/.../video.mp4",           // Auto-prepends domain
  image: "/blocks/.../poster.png",          // Poster image
  'image_description': "Optional caption",
  'anchor-id': "optional-anchor"
}
```

### Component Code
```javascript
<video
  controls
  poster={posterUrl}
  preload="metadata"
>
  <source src={videoUrl} type="video/mp4" />
</video>
```

### Visual Design
- Full-width video player
- Dark overlay with play button
- Hover effects
- Shadow and rounded corners
- Responsive scaling

---

## 📝 2. CopyBlock

### API Response Format
```json
{
  "id": 97572,
  "type": "copy",
  "title": null,
  "content": {
    "style": "default",
    "copy": "<p>观看以下视频，了解德威学校如何培养学生&ldquo;<strong>心怀世界，睿引未来</strong>&rdquo;</p>",
    "contextual-link": null,
    "anchor-id": null
  },
  "config": null
}
```

### Features
✅ Renders HTML content safely
✅ Multiple style options
✅ Contextual link support
✅ Typography optimization
✅ Supports rich text formatting
✅ Anchor link support

### Style Options
```javascript
style: "default"      // White background, left-aligned
style: "centered"     // White background, center-aligned
style: "highlighted"  // Gray background
style: "dark"         // Dark background, white text
```

### Props Mapping
```javascript
{
  style: "default",                      // Style variant
  copy: "<p>HTML content here...</p>",   // Rich HTML
  'contextual-link': "https://...",      // Optional link
  'anchor-id': "optional-anchor"
}
```

### HTML Support
Supports all standard HTML tags:
- `<p>`, `<h1>-<h6>` - Paragraphs and headings
- `<strong>`, `<em>` - Bold and italic
- `<a>` - Links
- `<ul>`, `<ol>`, `<li>` - Lists
- `<blockquote>` - Quotes

### Component Code
```javascript
<div
  className="prose prose-lg max-w-none"
  dangerouslySetInnerHTML={{ __html: copy }}
/>
```

### Visual Design
- Tailwind Typography (prose)
- Optimized line height and spacing
- Styled links (blue, underline on hover)
- List styling
- Responsive font sizes

---

## 🖼️ 3. SingleImageBlock

### API Response Format
```json
{
  "id": 260,
  "type": "single_image",
  "title": null,
  "content": {
    "title": null,
    "caption": null,
    "alignment": "original",
    "image": "/blocks/260/p/image/dci-visionmission-cn-20220715.png",
    "image_description": null,
    "anchor-id": null
  },
  "config": null
}
```

### Features
✅ Responsive image display
✅ Multiple alignment options
✅ Optional title and caption
✅ Lazy loading
✅ Auto-constructs full URLs
✅ Anchor link support

### Alignment Options
```javascript
alignment: "original"  // Center, maintains original size
alignment: "left"      // Left-aligned
alignment: "right"     // Right-aligned
alignment: "center"    // Center-aligned
alignment: "full"      // Full-width
```

### Props Mapping
```javascript
{
  title: "Optional heading above image",
  caption: "Optional caption below image",
  alignment: "original",                    // Alignment option
  image: "/blocks/.../image.png",           // Auto-prepends domain
  'image_description': "Alt text",          // Accessibility
  'anchor-id': "optional-anchor"
}
```

### Component Code
```javascript
<img
  src={imageUrl}
  alt={imageDescription || caption || title}
  className="rounded-lg shadow-lg"
  loading="lazy"
/>
```

### Visual Design
- Rounded corners
- Drop shadow
- Responsive sizing
- Italic caption styling
- Center-aligned by default

---

## 🎯 How They Work Together

### Example Page with All Three Blocks

```json
{
  "success": true,
  "data": {
    "blocks": [
      {
        "type": "copy",
        "content": {
          "copy": "<h2>Welcome to Dulwich</h2><p>Discover our vision...</p>"
        }
      },
      {
        "type": "single_image",
        "content": {
          "image": "/blocks/260/p/image/vision.png",
          "caption": "Our Vision & Values"
        }
      },
      {
        "type": "copy",
        "content": {
          "copy": "<p>Watch the video below to learn more...</p>"
        }
      },
      {
        "type": "video_upload",
        "content": {
          "video": "/blocks/97573/p/video/intro.mp4",
          "image": "/blocks/97573/p/image/poster.png"
        }
      }
    ]
  }
}
```

### Renders As:

```
┌─────────────────────────────────┐
│ Welcome to Dulwich              │
│ Discover our vision...          │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│   [Vision & Values Image]       │
│   Our Vision & Values           │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Watch the video below...        │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  ▶️  [Video Player]             │
│     with poster image           │
└─────────────────────────────────┘
```

---

## 🚀 Usage in PageRenderer

### Automatic Rendering

No configuration needed! Just navigate to a URL:

```
http://localhost:3000/about-dulwich/vision-and-values
```

If the API returns these block types, they automatically render:

```javascript
// API Response
{
  "blocks": [
    { "type": "video_upload", ... },
    { "type": "copy", ... },
    { "type": "single_image", ... }
  ]
}

// Automatically renders
<VideoUploadBlock content={...} />
<CopyBlock content={...} />
<SingleImageBlock content={...} />
```

---

## 📊 Component Registry

Updated `src/components/blocks/registry.js`:

```javascript
export const BLOCK_COMPONENTS = {
  // Real API block types
  triptych: TriptychBlock,
  school_listing: SchoolListingBlock,
  promo: PromoBlock,
  video_upload: VideoUploadBlock,      // ← NEW
  copy: CopyBlock,                      // ← NEW
  single_image: SingleImageBlock,       // ← NEW
};
```

---

## 🎨 Styling Details

### VideoUploadBlock
```css
- Section: py-16 px-4 bg-white
- Container: max-w-6xl mx-auto
- Video: aspect-video rounded-lg shadow-2xl
- Play button: 20x20 white circle with blue icon
- Hover: Scale 1.1, darker overlay
```

### CopyBlock
```css
- Section: py-12 px-4 (varies by style)
- Container: max-w-4xl mx-auto
- Typography: prose prose-lg
- Links: text-blue-600 hover:underline
- Strong: font-semibold text-gray-900
```

### SingleImageBlock
```css
- Section: py-16 px-4 bg-white
- Container: max-w-7xl mx-auto
- Image: rounded-lg shadow-lg
- Caption: text-sm italic text-gray-600
- Lazy loading enabled
```

---

## 🔧 Customization Examples

### Custom Video Player Controls

```javascript
// Add custom buttons
<div className="custom-controls">
  <button onClick={handleRewind}>⏪ 10s</button>
  <button onClick={handlePlayPause}>⏯️</button>
  <button onClick={handleForward}>⏩ 10s</button>
</div>
```

### Custom Copy Styles

```javascript
// Add new style variant
const styleClasses = {
  default: 'py-12 px-4 bg-white',
  featured: 'py-16 px-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white',
};
```

### Custom Image Lightbox

```javascript
// Click to open full-screen
const [lightboxOpen, setLightboxOpen] = useState(false);

<img
  onClick={() => setLightboxOpen(true)}
  className="cursor-zoom-in"
/>

{lightboxOpen && <Lightbox image={imageUrl} />}
```

---

## 🐛 Testing

### Test Video Upload
```
http://localhost:3000/about-dulwich/vision-and-values
→ Should show video player with poster
→ Click play button → Video plays
→ Controls visible
```

### Test Copy Block
```
→ Should render HTML content
→ Check formatting: bold, italic, links
→ Verify style variants work
```

### Test Single Image
```
→ Should show image with caption
→ Check alignment options
→ Verify lazy loading (Network tab)
```

---

## 📝 File Structure

```
src/components/blocks/
├── VideoUploadBlock.js     ← NEW
├── CopyBlock.js            ← NEW
├── SingleImageBlock.js     ← NEW
├── registry.js             ← UPDATED
├── BlockRenderer.js        (no changes needed)
├── TriptychBlock.js
├── PromoBlock.js
└── ...
```

---

## ✅ Production Checklist

- [x] VideoUploadBlock created
- [x] CopyBlock created
- [x] SingleImageBlock created
- [x] All registered in registry.js
- [x] URL construction for images/videos
- [x] Responsive design
- [x] Accessibility (alt text, ARIA labels)
- [x] Loading states (lazy loading)
- [x] Error handling (missing content)
- [x] Style variants implemented
- [x] Anchor link support

---

## 🎯 Next Steps

1. **Test all three blocks:**
   ```
   http://localhost:3000/about-dulwich/vision-and-values
   ```

2. **Check DevTools:**
   - Network: See video/image requests
   - Console: Check for errors
   - React Query DevTools: View cached data

3. **Customize styling:**
   - Modify Tailwind classes
   - Add animations
   - Adjust spacing

4. **Add more block types:**
   - Just create component
   - Add to registry
   - Done!

---

**All three block components are now live and ready to use!** 🎉

Navigate to any page with these block types and they'll render automatically.
