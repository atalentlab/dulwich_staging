# School API Flow - Subdomain Detection

## 🎯 How It Works

### **URL to API Mapping**

```
Browser URL:
http://beijing.dulwich.loc:3000/zh/about-dulwich/vision-and-values

     ↓

1. Hostname Detection (schoolDetection.js)
   Hostname: "beijing.dulwich.loc"
   Extracted School: "beijing"

     ↓

2. URL Parsing (SchoolPageRenderer)
   Path: "/zh/about-dulwich/vision-and-values"
   Extracted Locale: "zh"
   Extracted Slug: "about-dulwich/vision-and-values"

     ↓

3. API Call (schoolPageService.js)
   Query Parameters Built:
   - locale: "zh"
   - slug: "about-dulwich/vision-and-values"
   - school: "beijing"

     ↓

4. Final API URL:
   /api/school/page?locale=zh&slug=about-dulwich/vision-and-values&school=beijing
```

---

## 📊 Query Parameter Order

The API call ALWAYS follows this order:

```
/api/school/page?locale={locale}&slug={slug}&school={school}
```

**Example:**
```
/api/school/page?locale=zh&slug=about-dulwich/vision-and-values&school=beijing
```

---

## 🔍 Code Flow

### **Step 1: User Visits URL**

```javascript
// Browser URL
http://beijing.dulwich.loc:3000/zh/about-dulwich/vision-and-values
```

---

### **Step 2: DynamicPageRenderer Detects School**

```javascript
// src/components/DynamicPageRenderer.js

import { getCurrentSchool } from '../utils/schoolDetection';

const school = getCurrentSchool();
// Returns: "beijing"

const isSchoolSite = school !== null;
// Returns: true

// Routes to SchoolPageRenderer with school="beijing"
```

---

### **Step 3: SchoolPageRenderer Parses URL**

```javascript
// src/components/school/SchoolPageRenderer.js

URL Path: "/zh/about-dulwich/vision-and-values"

Parsing:
- First segment: "zh" → Recognized as locale
- Remaining: "about-dulwich/vision-and-values" → slug

Result:
- locale: "zh"
- slug: "about-dulwich/vision-and-values"
- school: "beijing" (from props/hostname)
```

---

### **Step 4: API Service Builds URL**

```javascript
// src/api/schoolPageService.js

export const fetchSchoolPageBySlug = async (slug, school, locale) => {
  // Detect school from subdomain if not provided
  const detectedSchool = school || getCurrentSchool();
  // detectedSchool = "beijing"

  // Build URL with query parameters
  let url = `${API_BASE_URL}/api/school/page?`;

  // Add locale (if provided)
  if (locale) {
    url += `locale=${locale}&`;
  }
  // url = "/api/school/page?locale=zh&"

  // Add slug
  url += `slug=${slug}&`;
  // url = "/api/school/page?locale=zh&slug=about-dulwich/vision-and-values&"

  // Add school
  url += `school=${detectedSchool}`;
  // url = "/api/school/page?locale=zh&slug=about-dulwich/vision-and-values&school=beijing"

  // Log the API call
  console.log('🔍 School Page API Call');
  console.log('URL:', url);
  console.log('Query Params:', {
    locale: locale,
    slug: slug,
    school: detectedSchool
  });

  // Make API request
  const response = await fetch(url);
};
```

---

## 🌐 URL Examples

### **Example 1: Beijing School - Chinese**

```
Browser URL:
http://beijing.dulwich.loc:3000/zh/about-dulwich/vision-and-values

Detected:
- School: "beijing" (from hostname)
- Locale: "zh" (from URL path)
- Slug: "about-dulwich/vision-and-values" (from URL path)

API Call:
/api/school/page?locale=zh&slug=about-dulwich/vision-and-values&school=beijing
```

---

### **Example 2: Shanghai School - English**

```
Browser URL:
http://shanghai.dulwich.loc:3000/en/admissions/overview

Detected:
- School: "shanghai" (from hostname)
- Locale: "en" (from URL path)
- Slug: "admissions/overview" (from URL path)

API Call:
/api/school/page?locale=en&slug=admissions/overview&school=shanghai
```

---

### **Example 3: Beijing School - No Locale**

```
Browser URL:
http://beijing.dulwich.loc:3000/admissions/overview

Detected:
- School: "beijing" (from hostname)
- Locale: null (not in URL)
- Slug: "admissions/overview" (from URL path)

API Call:
/api/school/page?slug=admissions/overview&school=beijing
```

---

## 📝 Console Output

When you visit a school page, you'll see:

```
🔍 School Page API Call
URL: /api/school/page?locale=zh&slug=about-dulwich/vision-and-values&school=beijing
Query Params: {
  locale: "zh",
  slug: "about-dulwich/vision-and-values",
  school: "beijing"
}

✅ School Page API Response: {
  success: true,
  data: {
    header: { ... },
    footer: { ... },
    blocks: [ ... ],
    school: { name: "Beijing", slug: "beijing" }
  }
}
```

---

## 🔧 Query Parameter Variables

### **In Browser Console:**

When visiting `http://beijing.dulwich.loc:3000/zh/about-dulwich/vision-and-values`:

```javascript
// You can inspect these in the Network tab:

Request URL:
https://www.dulwich.atalent.xyz/api/school/page?locale=zh&slug=about-dulwich/vision-and-values&school=beijing

Query String Parameters:
  locale: zh
  slug: about-dulwich/vision-and-values
  school: beijing
```

---

## ✅ Key Features

1. **Automatic School Detection**
   - Reads from `beijing.dulwich.loc` hostname
   - Extracts `beijing` as school parameter

2. **Locale Detection**
   - Reads from URL path `/zh/...`
   - Adds as first query parameter

3. **Clean Query Parameters**
   - Always in order: `locale`, `slug`, `school`
   - Only adds locale if present

4. **Debug Logging**
   - Console shows exact API call
   - Shows all query parameters
   - Easy to debug and verify

---

## 🎯 Testing

### **Test Different URLs:**

```bash
# Beijing + Chinese
http://beijing.dulwich.loc:3000/zh/about-dulwich/vision-and-values
→ ?locale=zh&slug=about-dulwich/vision-and-values&school=beijing

# Shanghai + English
http://shanghai.dulwich.loc:3000/en/academics/curriculum
→ ?locale=en&slug=academics/curriculum&school=shanghai

# Suzhou + No Locale
http://suzhou.dulwich.loc:3000/admissions/overview
→ ?slug=admissions/overview&school=suzhou
```

### **Check Network Tab:**

1. Open Chrome DevTools (F12)
2. Go to Network tab
3. Visit a school page
4. Look for request to `/api/school/page`
5. Check Query String Parameters

---

## 🚀 Summary

✅ School detected from **subdomain** (beijing.dulwich.loc)
✅ Locale detected from **URL path** (/zh/)
✅ Slug extracted from **remaining path**
✅ All passed as **query parameters** to API
✅ Order: **locale → slug → school**
✅ Full logging for **debugging**

Your school page system is fully integrated! 🎉
