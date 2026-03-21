# URL Locale Parsing Guide

## 🎯 Overview

The `PageRenderer` component now automatically detects and extracts the locale from the URL path.

---

## 📝 URL Format Options

### **Option 1: With Locale Prefix**
```
/{locale}/{slug}
```

**Examples:**
- `/zh/about-dulwich/vision-and-values`
- `/en/admissions/how-to-apply`
- `/cn/academics/curriculum`

**Extracted:**
- Locale: `zh`, `en`, or `cn`
- Slug: `about-dulwich/vision-and-values`, `admissions/how-to-apply`, etc.

**API Call:**
```
/api/page?locale=zh&slug=about-dulwich/vision-and-values
```

---

### **Option 2: Without Locale (Default)**
```
/{slug}
```

**Examples:**
- `/about-dulwich/vision-and-values`
- `/admissions/how-to-apply`
- `/academics/curriculum`

**Extracted:**
- Locale: `null` (not included in API call)
- Slug: `about-dulwich/vision-and-values`, `admissions/how-to-apply`, etc.

**API Call:**
```
/api/page?slug=about-dulwich/vision-and-values
```

---

## 🔧 Supported Locales

Currently configured locales (configurable in `PageRenderer.js`):

```javascript
const supportedLocales = ['zh', 'en', 'cn'];
```

To add more locales, simply update this array:

```javascript
const supportedLocales = ['zh', 'en', 'cn', 'fr', 'es', 'de'];
```

---

## 🎨 URL Parsing Examples

| URL | Locale | Slug | API Call |
|-----|--------|------|----------|
| `/zh/about-dulwich/vision-and-values` | `zh` | `about-dulwich/vision-and-values` | `/api/page?locale=zh&slug=about-dulwich/vision-and-values` |
| `/en/admissions/overview` | `en` | `admissions/overview` | `/api/page?locale=en&slug=admissions/overview` |
| `/about-dulwich/vision-and-values` | `null` | `about-dulwich/vision-and-values` | `/api/page?slug=about-dulwich/vision-and-values` |
| `/admissions/overview` | `null` | `admissions/overview` | `/api/page?slug=admissions/overview` |
| `/zh` | `zh` | `home` | `/api/page?locale=zh&slug=home` |
| `/` | `null` | `home` | `/api/page?slug=home` |

---

## 🚀 How It Works

### **1. URL Parsing Logic**

```javascript
// URL: /zh/about-dulwich/vision-and-values

const parseUrl = (pathname) => {
  // Clean: "zh/about-dulwich/vision-and-values"
  const cleanPath = pathname.replace(/^\/|\/$/g, '');

  // Split: ["zh", "about-dulwich", "vision-and-values"]
  const segments = cleanPath.split('/');

  // Check first segment: "zh"
  const firstSegment = segments[0].toLowerCase();

  if (supportedLocales.includes(firstSegment)) {
    // First segment IS a locale
    return {
      locale: "zh",
      slug: "about-dulwich/vision-and-values"
    };
  } else {
    // First segment is NOT a locale
    return {
      locale: null,
      slug: cleanPath
    };
  }
};
```

---

### **2. Component Flow**

```javascript
const PageRenderer = () => {
  const location = useLocation();

  // Parse URL
  const { locale, slug } = parseUrl(location.pathname);
  // locale = "zh"
  // slug = "about-dulwich/vision-and-values"

  // Fetch data with extracted values
  const { data } = usePageBySlug(slug, locale);
  // Calls: /api/page?locale=zh&slug=about-dulwich/vision-and-values

  return <div>{/* Render page */}</div>;
};
```

---

## 📂 Routing Configuration

### **Basic Setup (App.js)**

```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PageRenderer from './components/PageRenderer';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Catch all routes */}
        <Route path="/*" element={<PageRenderer />} />
      </Routes>
    </BrowserRouter>
  );
}
```

This single route handles ALL URL patterns:
- `/about`
- `/zh/about`
- `/en/admissions/overview`
- `/zh/admissions/overview`

---

## 🎯 Usage Examples

### **Example 1: Chinese Page**

**URL:** `http://localhost:3000/zh/about-dulwich/vision-and-values`

**Parsed:**
```javascript
locale = "zh"
slug = "about-dulwich/vision-and-values"
```

**API Call:**
```
GET /api/page?locale=zh&slug=about-dulwich/vision-and-values
```

---

### **Example 2: English Page**

**URL:** `http://localhost:3000/en/admissions/how-to-apply`

**Parsed:**
```javascript
locale = "en"
slug = "admissions/how-to-apply"
```

**API Call:**
```
GET /api/page?locale=en&slug=admissions/how-to-apply
```

---

### **Example 3: No Locale (Default)**

**URL:** `http://localhost:3000/about-dulwich/vision-and-values`

**Parsed:**
```javascript
locale = null
slug = "about-dulwich/vision-and-values"
```

**API Call:**
```
GET /api/page?slug=about-dulwich/vision-and-values
```

---

### **Example 4: Locale Only (Homepage)**

**URL:** `http://localhost:3000/zh`

**Parsed:**
```javascript
locale = "zh"
slug = "home"
```

**API Call:**
```
GET /api/page?locale=zh&slug=home
```

---

## 🔍 Debug Mode

In development mode, a debug panel shows URL parsing info:

```
Slug: about-dulwich/vision-and-values | Locale: zh | URL: /zh/about-dulwich/vision-and-values
```

This appears in the bottom-right corner of the page.

---

## ⚙️ Advanced Configuration

### **Custom Locale Detection**

You can modify the locale detection logic:

```javascript
// Case-insensitive matching
const firstSegment = segments[0].toLowerCase();

// Or add custom validation
const isValidLocale = (segment) => {
  return /^[a-z]{2}(-[A-Z]{2})?$/.test(segment);
};
```

### **Locale Aliases**

Map locale codes to full locale strings:

```javascript
const localeMap = {
  'zh': 'zh-CN',
  'en': 'en-US',
  'cn': 'zh-CN'
};

const locale = localeMap[extractedLocale] || extractedLocale;
```

---

## 🎨 SEO & i18n Best Practices

### **1. Use Locale Prefixes**

✅ **Good:**
```
/zh/about
/en/about
```

❌ **Avoid:**
```
/about?lang=zh
/about?lang=en
```

### **2. Canonical URLs**

```html
<link rel="canonical" href="https://dulwich.com/zh/about" />
```

### **3. Hreflang Tags**

```html
<link rel="alternate" hreflang="zh" href="https://dulwich.com/zh/about" />
<link rel="alternate" hreflang="en" href="https://dulwich.com/en/about" />
```

---

## ✅ Summary

✅ **Automatic locale detection from URL**
✅ **Supports multiple locales (zh, en, cn)**
✅ **Backward compatible (works without locale)**
✅ **Clean, SEO-friendly URLs**
✅ **Easy to extend with more locales**
✅ **Debug mode for development**

Your PageRenderer now intelligently parses URLs and extracts locales! 🎉
