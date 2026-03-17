# Dynamic Block Architecture - Implementation Guide

## Overview
This implementation provides a scalable, production-ready architecture for dynamically rendering page content based on a single API response.

## Architecture Summary

```
API Call (ONE REQUEST)
    ↓
usePageData Hook
    ↓
    ├── Header Data → PageHeader Component
    ├── Blocks Array → BlockRenderer → Component Registry → Specific Block Components
    └── Footer Data → PageFooter Component
```

## Key Benefits

✅ **Single API Call** - Entire page loads with one request
✅ **Scalable** - Add new block types by adding one line to registry
✅ **Type-Safe** - Clear data contracts between API and components
✅ **Error Resilient** - Error boundaries prevent cascade failures
✅ **Developer-Friendly** - No large if/else chains, clean component mapping
✅ **Production-Ready** - Includes loading states, error handling, fallbacks

---

## How It Works

### 1. API Response Structure

```json
{
  "header": {
    "logo": "/images/logo.svg",
    "navigation": [...]
  },
  "blocks": [
    {
      "id": "block-1",
      "type": "banner",
      "content": {
        "title": "Welcome",
        "subtitle": "..."
      }
    },
    {
      "id": "block-2",
      "type": "triptych",
      "content": {...}
    }
  ],
  "footer": {
    "copyright": "...",
    "links": [...]
  }
}
```

### 2. Data Flow

1. **HomePage** mounts
2. **usePageData** hook automatically fetches data
3. Data is stored in React state
4. Components receive their portion of data as props
5. **BlockRenderer** maps over blocks array
6. For each block, **Component Registry** looks up `block.type`
7. Corresponding component renders with `block.content`

### 3. Component Mapping (Registry Pattern)

```javascript
// src/components/blocks/registry.js
export const BLOCK_COMPONENTS = {
  banner: BannerBlock,
  triptych: TriptychBlock,
  articles: ArticlesBlock,
  // Add new types here ⬇️
  testimonials: TestimonialsBlock,
};
```

**No if/else statements needed!** The registry acts as a lookup table.

---

## Adding New Block Types (3 Simple Steps)

Let's say your backend team adds a new "Testimonials" block type:

### Step 1: Create the Component

```bash
# Create the file
touch src/components/blocks/TestimonialsBlock.js
```

```javascript
// src/components/blocks/TestimonialsBlock.js
import React from 'react';

const TestimonialsBlock = ({ content }) => {
  const { heading, testimonials } = content;

  return (
    <section className="py-16 px-4">
      <h2 className="text-4xl font-bold text-center mb-12">{heading}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map(testimonial => (
          <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
            <p className="font-bold">{testimonial.author}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsBlock;
```

### Step 2: Register in Registry

```javascript
// src/components/blocks/registry.js
import TestimonialsBlock from './TestimonialsBlock'; // ← Import it

export const BLOCK_COMPONENTS = {
  banner: BannerBlock,
  triptych: TriptychBlock,
  articles: ArticlesBlock,
  testimonials: TestimonialsBlock, // ← Add this ONE line
};
```

### Step 3: Done! 🎉

That's it. No other files need to be touched. When the API returns a block with `type: "testimonials"`, it will automatically render.

---

## Usage Examples

### Basic Usage (in App.js or Router)

```javascript
import HomePage from './pages/HomePage';

function App() {
  return <HomePage />;
}
```

### With React Router

```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Multiple Pages with Different Slugs

```javascript
// src/pages/AboutPage.js
const AboutPage = () => {
  const { pageData, loading, error } = usePageData('about', false);
  // ... rest is the same as HomePage
};
```

---

## Configuration

### Switch from Mock to Real API

```javascript
// src/pages/HomePage.js
const { pageData, loading, error } = usePageData('home', false); // ← Change to false
```

### Configure API Base URL

```bash
# .env
REACT_APP_API_URL=https://your-api.com/api/v1
```

```javascript
// src/api/pageService.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.example.com';
```

---

## API Contract

### Backend Requirements

Your API endpoint should return JSON in this structure:

```typescript
{
  header: {
    logo: string;
    navigation: Array<{
      id: string | number;
      label: string;
      href: string;
    }>;
  };
  blocks: Array<{
    id: string;           // Required: Unique identifier
    type: string;         // Required: Must match registry key
    content: object;      // Required: Component-specific data
  }>;
  footer: {
    copyright: string;
    socialLinks: Array<{
      id: string | number;
      platform: string;
      url: string;
    }>;
    links: Array<{
      id: string | number;
      label: string;
      href: string;
    }>;
  };
}
```

### Important Notes

- `blocks` must be an array
- Each block must have `id`, `type`, and `content`
- `type` must match a key in the component registry
- Unknown block types will render `DefaultBlock` (shows warning in dev mode)

---

## Error Handling

### Built-in Error Boundaries

Each block is wrapped in an error boundary. If one block crashes, the rest of the page continues to work.

```javascript
// Automatically handled by BlockRenderer
<ErrorBoundary key={block.id} blockId={block.id} blockType={block.type}>
  <BlockComponent content={block.content} />
</ErrorBoundary>
```

### Custom Error Handling

```javascript
const { pageData, loading, error, refetch } = usePageData('home');

if (error) {
  return (
    <div>
      <p>Error: {error}</p>
      <button onClick={refetch}>Retry</button>
    </div>
  );
}
```

---

## Testing

### Test a Single Block Component

```javascript
import { render, screen } from '@testing-library/react';
import BannerBlock from './BannerBlock';

test('renders banner with title', () => {
  const content = {
    title: 'Test Banner',
    subtitle: 'Test Subtitle',
  };

  render(<BannerBlock content={content} />);
  expect(screen.getByText('Test Banner')).toBeInTheDocument();
});
```

### Test BlockRenderer

```javascript
import { render, screen } from '@testing-library/react';
import BlockRenderer from './BlockRenderer';

test('renders multiple blocks', () => {
  const blocks = [
    { id: '1', type: 'banner', content: { title: 'Banner' } },
    { id: '2', type: 'video', content: { title: 'Video' } },
  ];

  render(<BlockRenderer blocks={blocks} />);
  // Assert blocks are rendered
});
```

---

## Performance Optimization

### Lazy Loading Block Components

```javascript
// src/components/blocks/registry.js
import { lazy } from 'react';

const BannerBlock = lazy(() => import('./BannerBlock'));
const VideoBlock = lazy(() => import('./VideoBlock'));

export const BLOCK_COMPONENTS = {
  banner: BannerBlock,
  video: VideoBlock,
};
```

Then wrap BlockRenderer with Suspense:

```javascript
import { Suspense } from 'react';

<Suspense fallback={<Loading />}>
  <BlockRenderer blocks={blocks} />
</Suspense>
```

### Memoization

```javascript
import { memo } from 'react';

const BannerBlock = memo(({ content }) => {
  // Component code
});
```

---

## Troubleshooting

### Block Not Rendering

1. Check if block type is registered in `registry.js`
2. Check browser console for errors
3. Verify API response structure matches contract
4. Check `DefaultBlock` is rendering (indicates unknown type)

### API Call Failing

1. Check `REACT_APP_API_URL` environment variable
2. Check CORS settings on backend
3. Check network tab in browser DevTools
4. Verify authentication headers if needed

### TypeScript Errors

If using TypeScript, create type definitions:

```typescript
// src/types/blocks.ts
export interface Block {
  id: string;
  type: string;
  content: Record<string, any>;
}

export interface PageData {
  header: HeaderData;
  blocks: Block[];
  footer: FooterData;
}
```

---

## Best Practices

✅ **Always validate block structure** in BlockRenderer
✅ **Use error boundaries** for resilience
✅ **Keep block components pure** (no side effects)
✅ **Use PropTypes or TypeScript** for type safety
✅ **Keep content prop flexible** (different blocks need different data)
✅ **Log unknown block types** in development
✅ **Test each block component** independently
✅ **Use semantic HTML** for accessibility
✅ **Optimize images** in block components

---

## File Structure Reference

```
src/
├── api/
│   └── pageService.js           # API calls
├── hooks/
│   └── usePageData.js           # Data fetching hook
├── components/
│   ├── layout/
│   │   ├── PageHeader.js        # Header wrapper
│   │   └── PageFooter.js        # Footer wrapper
│   ├── blocks/
│   │   ├── registry.js          # ⭐ Component mapping
│   │   ├── BlockRenderer.js     # ⭐ Dynamic renderer
│   │   ├── BannerBlock.js
│   │   ├── TriptychBlock.js
│   │   ├── ArticlesBlock.js
│   │   ├── SchoolsBlock.js
│   │   ├── VideoBlock.js
│   │   └── DefaultBlock.js      # Fallback
│   └── common/
│       └── Loading.js
└── pages/
    └── HomePage.js              # ⭐ Main orchestration
```

---

## Questions?

- Check `src/api/pageService.js` for mock data examples
- Review `src/pages/HomePage.js` for complete integration
- Examine any block component for implementation patterns

---

**Built with React best practices, production-ready, and ready to scale!** 🚀
