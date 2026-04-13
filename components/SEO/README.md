# Dynamic Open Graph SEO Implementation

Complete implementation of dynamic Open Graph (OG) meta tags for social media previews in React.

## 📦 What's Included

### Components
1. **`DynamicSEO.js`** - Main SEO component with Open Graph and Twitter Card meta tags
2. **`LinkPreviewCard.js`** - Visual preview card component (WhatsApp/Facebook style)

### Hooks
1. **`useFetchSEOData.js`** - Custom hook for fetching SEO data from API

### Pages
1. **`SEOExamplePage.js`** - Complete example demonstrating all features

### Documentation
1. **`OPEN_GRAPH_SEO_GUIDE.md`** - Comprehensive guide explaining CSR limitations and solutions
2. **`SEO_INTEGRATION_EXAMPLE.md`** - Integration examples for existing components

---

## 🚀 Quick Start

### 1. Install Dependencies

Already installed in this project:
```bash
npm install react-helmet-async
```

### 2. Basic Usage

```jsx
import DynamicSEO from './components/SEO/DynamicSEO';

function MyPage() {
  return (
    <>
      <DynamicSEO
        title="招生报名"
        description="西安曲江德闳学校是一所将中国基础教育的精髓和国际化教育理念有机结合的中国学校"
        image="https://example.com/images/admissions.jpg"
        url="https://xian.dehong.cn"
        locale="zh_CN"
      />

      <div>
        <h1>Your Page Content</h1>
      </div>
    </>
  );
}
```

### 3. With API Data

```jsx
import DynamicSEO from './components/SEO/DynamicSEO';
import useFetchSEOData from './hooks/useFetchSEOData';

function DynamicPage() {
  const { data: seoData } = useFetchSEOData('https://api.example.com/seo');

  return (
    <>
      <DynamicSEO
        title={seoData?.title}
        description={seoData?.description}
        image={seoData?.image}
        url={seoData?.url}
      />

      <div>Page Content</div>
    </>
  );
}
```

### 4. View Example Page

Visit: **http://localhost:3000/test-seo**

---

## 🎯 Features

### ✅ Dynamic Meta Tags
- Open Graph (og:*) tags
- Twitter Card (twitter:*) tags
- Standard meta tags (description, keywords)
- Canonical URLs

### ✅ API Integration
- Fetch SEO data from backend
- Automatic fallback to static defaults
- Error handling

### ✅ Static Fallbacks
```javascript
const FALLBACK_TITLE = 'Dulwich College International';
const FALLBACK_DESCRIPTION = 'We are the leading network...';
const FALLBACK_IMAGE = '/images/opengraph/default.png';
```

### ✅ Localization Support
- Chinese (zh_CN)
- English (en_US)
- Automatic locale detection

### ✅ Social Platform Optimization
- Facebook
- Twitter/X
- LinkedIn
- WhatsApp
- Telegram
- Slack

### ✅ Bonus: Preview Card Component
Visual preview of how links appear in social media apps.

---

## 📋 Component API

### DynamicSEO Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | string | No | Fallback title | Page title |
| `description` | string | No | Fallback desc | Page description |
| `image` | string | No | Fallback image | OG image URL (absolute) |
| `url` | string | No | Current URL | Canonical page URL |
| `type` | string | No | `'website'` | OG type (website/article) |
| `locale` | string | No | `'en_US'` | Page locale |
| `siteName` | string | No | `'Dulwich College...'` | Site name |
| `twitter` | object | No | `{}` | Twitter-specific config |

### useFetchSEOData Hook

```jsx
const { data, loading, error } = useFetchSEOData(apiUrl, options);
```

**Returns:**
- `data` - SEO data from API
- `loading` - Loading state (boolean)
- `error` - Error message (string or null)

### LinkPreviewCard Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | string | No | Preview title |
| `description` | string | No | Preview description |
| `image` | string | No | Preview image |
| `url` | string | No | Link URL |
| `domain` | string | No | Domain to display |

---

## ⚠️ Important Limitations

### CSR (Client-Side Rendering) Issue

**The Problem:**
- React apps built with CRA are CSR (Client-Side Rendered)
- Social media bots **don't execute JavaScript**
- They only see the initial HTML (which is empty in CSR)
- Result: **OG tags don't work** ❌

### What Works vs What Doesn't

| Feature | Regular Users | Social Media Bots |
|---------|---------------|-------------------|
| See dynamic content | ✅ Yes | ❌ No |
| Execute JavaScript | ✅ Yes | ❌ No |
| See OG meta tags | ✅ Yes (too late) | ❌ No |
| Generate preview | N/A | ❌ Broken |

---

## ✅ Solutions for Production

### Option 1: Next.js (SSR) - RECOMMENDED

Migrate to Next.js for server-side rendering.

```bash
# Create new Next.js app
npx create-next-app@latest my-app

# Or migrate existing React app
npm install next react react-dom
```

**Why it works:**
- HTML is generated on the server
- Contains all meta tags before sending to client
- Social media bots see complete HTML
- **OG tags work perfectly** ✅

### Option 2: Prerendering (react-snap)

Generate static HTML at build time.

```bash
npm install react-snap --save-dev
```

**Good for:**
- Static or mostly-static sites
- Sites with known routes
- Quick wins without major migration

**Limitations:**
- Must define all routes in advance
- Dynamic routes need configuration

### Option 3: Backend Middleware

Detect social media bots and serve pre-rendered HTML.

**Good for:**
- Can't change React architecture
- Need quick solution
- Have backend control

---

## 🧪 Testing

### Test OG Tags

1. **Facebook Sharing Debugger**
   https://developers.facebook.com/tools/debug/

2. **Twitter Card Validator**
   https://cards-dev.twitter.com/validator

3. **LinkedIn Post Inspector**
   https://www.linkedin.com/post-inspector/

4. **OpenGraph.xyz (Universal)**
   https://www.opengraph.xyz/

### Testing on Localhost

**Problem:** Can't test on localhost
**Solution:** Use ngrok

```bash
# Install ngrok
npm install -g ngrok

# Expose localhost
ngrok http 3000

# Use the HTTPS URL for testing
# Example: https://abc123.ngrok.io
```

---

## 📸 Image Requirements

### Recommended Specifications

| Aspect | Requirement |
|--------|-------------|
| **Size** | 1200 x 630 px |
| **Aspect Ratio** | 1.91:1 |
| **Format** | JPG or PNG |
| **Max File Size** | 8 MB (Facebook), 5 MB (Twitter) |
| **URL** | Absolute HTTPS URL |
| **Load Time** | < 3 seconds |

### Creating OG Images

```bash
# Create opengraph directory
mkdir -p public/images/opengraph

# Place default image
cp your-default-image.jpg public/images/opengraph/opengraph-default.png
```

---

## 📝 API Response Format

### Expected API Structure

```json
{
  "success": true,
  "data": {
    "title": "招生报名",
    "description": "西安曲江德闳学校是一所将中国基础教育的精髓和国际化教育理念有机结合的中国学校",
    "image": "https://cms.dulwich.atalent.xyz/images/admissions.jpg",
    "url": "https://xian.dehong.cn/admissions",
    "type": "website",
    "locale": "zh_CN"
  }
}
```

### Alternative Formats Supported

```json
// Format 1: Nested in meta object
{
  "data": {
    "meta": {
      "meta_title": "Page Title",
      "meta_description": "Page description",
      "og_image": "https://example.com/image.jpg"
    }
  }
}

// Format 2: In banner object
{
  "data": {
    "banner": {
      "title": "Page Title",
      "description": "Page description",
      "header_image": "https://example.com/image.jpg"
    }
  }
}
```

---

## 🔧 Environment Setup

Create `.env` file:

```env
# API Base URL
REACT_APP_API_URL=https://api.dulwich.org

# SEO Defaults
REACT_APP_DEFAULT_OG_IMAGE=/images/opengraph/default.png
REACT_APP_SITE_NAME=Dulwich College International
REACT_APP_TWITTER_HANDLE=@DulwichCollege
```

---

## 📚 Documentation Files

1. **OPEN_GRAPH_SEO_GUIDE.md**
   - Complete guide to OG implementation
   - CSR limitations explained
   - SSR/prerendering solutions
   - Best practices

2. **SEO_INTEGRATION_EXAMPLE.md**
   - Integration examples
   - Code snippets for existing components
   - Common issues & solutions

3. **README.md** (this file)
   - Quick reference
   - API documentation
   - Testing guide

---

## 🎓 Learn More

### Official Documentation
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [React Helmet Async](https://github.com/staylor/react-helmet-async)

### Tools
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
- [OpenGraph.xyz](https://www.opengraph.xyz/)

---

## 📞 Support

**Issues with implementation?**
1. Check the comprehensive guide: `OPEN_GRAPH_SEO_GUIDE.md`
2. Review integration examples: `SEO_INTEGRATION_EXAMPLE.md`
3. Test with OpenGraph.xyz
4. Verify HTML source (View Page Source)

**Common problems:**
- ✅ Images must use absolute HTTPS URLs
- ✅ Test on actual domain (not localhost)
- ✅ Clear social media cache (24-48 hours)
- ✅ Verify image loads fast (<3 seconds)
- ✅ Use SSR/prerendering for production

---

## ✅ Implementation Checklist

- [x] Installed react-helmet-async
- [x] Created DynamicSEO component
- [x] Created useFetchSEOData hook
- [x] Created LinkPreviewCard component
- [x] Created example page (/test-seo)
- [x] Added static fallback values
- [x] Added localization support
- [x] Documented CSR limitations
- [x] Provided SSR/prerendering solutions
- [ ] Created OG images (1200x630px)
- [ ] Tested on Facebook Debugger
- [ ] Tested on Twitter Validator
- [ ] Deployed with SSR/prerendering

---

**Created:** 2026-03-28
**Last Updated:** 2026-03-28
**Version:** 1.0.0
