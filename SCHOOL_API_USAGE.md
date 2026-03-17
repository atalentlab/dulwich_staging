# School Page API Usage Guide

## 📂 File Structure

```
src/
├── api/
│   ├── pageService.js          # Main site pages
│   ├── schoolPageService.js    # School-specific pages (NEW)
│   └── articleService.js       # Article pages (NEW)
│
├── hooks/
│   ├── usePageBySlug.js        # Main site pages hook
│   ├── useSchoolPageBySlug.js  # School pages hook (NEW)
│   ├── useSchools.js           # Get all schools (NEW)
│   ├── useSchoolHomepage.js    # School homepage (NEW)
│   ├── useArticleBySlug.js     # Article details (NEW)
│   └── useArticles.js          # Article list (NEW)
│
└── components/
    ├── PageRenderer.js         # Main site renderer
    └── school/
        └── SchoolPageRenderer.js  # School page renderer (NEW)
```

---

## 🌐 API Endpoints

### **1. Main Site Pages**
```javascript
// URL: /api/page?slug=home&locale=en
import { usePageBySlug } from '../hooks/usePageBySlug';

const { data, isLoading, error } = usePageBySlug('home', 'en');
```

---

### **2. School-Specific Pages** ⭐ NEW

#### Get School Page
```javascript
// URL: /api/school/page?slug=admissions/admissions-overview&school=beijing&locale=en
import { useSchoolPageBySlug } from '../hooks/useSchoolPageBySlug';

const { data, isLoading, error } = useSchoolPageBySlug(
  'admissions/admissions-overview',  // slug
  'beijing',                          // school
  'en'                                // locale
);

// Response Structure:
{
  header: { /* school-specific header */ },
  footer: { /* school-specific footer */ },
  banner: { /* page banner */ },
  blocks: [ /* content blocks */ ],
  school: {
    name: 'Beijing',
    slug: 'beijing'
  }
}
```

#### Get All Schools
```javascript
// URL: /api/school/schools?locale=en
import { useSchools } from '../hooks/useSchools';

const { schools, isLoading, error } = useSchools('en');

// Response: Array of schools
[
  { id: 1, name: 'Beijing', slug: 'beijing' },
  { id: 2, name: 'Shanghai', slug: 'shanghai' },
  { id: 3, name: 'Suzhou', slug: 'suzhou' }
]
```

#### Get School Homepage
```javascript
// URL: /api/school/homepage?school=beijing&locale=en
import { useSchoolHomepage } from '../hooks/useSchoolHomepage';

const { data, isLoading, error } = useSchoolHomepage('beijing', 'en');
```

---

### **3. Article Pages** ⭐ NEW

#### Get Article by Slug
```javascript
// URL: /api/article?slug=dulwich-life&locale=en
import { useArticleBySlug } from '../hooks/useArticleBySlug';

const { data, isLoading, error } = useArticleBySlug('dulwich-life', 'en');

// Response:
{
  id: 123,
  slug: 'dulwich-life',
  title: 'Dulwich Life',
  content: '...',
  author: '...',
  date: '2025-01-08',
  category: 'News',
  tags: ['community', 'events']
}
```

#### Get Article List
```javascript
// URL: /api/article/list?locale=en&page=1&limit=10&category=news
import { useArticles } from '../hooks/useArticles';

const { articles, pagination, isLoading } = useArticles({
  locale: 'en',
  page: 1,
  limit: 10,
  category: 'news',  // optional
  tag: 'events'      // optional
});

// Response:
{
  articles: [
    { id: 1, title: 'Article 1', slug: 'article-1' },
    { id: 2, title: 'Article 2', slug: 'article-2' }
  ],
  pagination: {
    page: 1,
    limit: 10,
    total: 50,
    totalPages: 5
  }
}
```

---

## 🎨 Component Usage Examples

### **School Page Renderer**

```javascript
import React from 'react';
import SchoolPageRenderer from './components/school/SchoolPageRenderer';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main site */}
        <Route path="/" element={<HomePage />} />
        <Route path="/*" element={<PageRenderer />} />

        {/* School pages - each school has different header/footer */}
        <Route path="/school/:school/*" element={<SchoolPageRenderer />} />
      </Routes>
    </BrowserRouter>
  );
}
```

**URL Examples:**
- `/school/beijing/admissions/admissions-overview`
- `/school/shanghai/academics/curriculum`
- `/school/suzhou/about/vision-and-values`

---

### **Custom Component Example**

```javascript
import React from 'react';
import { useSchoolPageBySlug } from '../hooks/useSchoolPageBySlug';
import { useParams } from 'react-router-dom';

function AdmissionsPage() {
  const { school } = useParams();

  const { data, isLoading, error } = useSchoolPageBySlug(
    'admissions/admissions-overview',
    school || 'beijing',
    'en'
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>{data.school.name} - Admissions</h1>
      {/* Render content blocks */}
    </div>
  );
}
```

---

## 🔄 API Response Formats

### **School Page Response**
```json
{
  "success": true,
  "data": {
    "header": {
      "logo": "Beijing Campus Logo",
      "navigation": [...]
    },
    "footer": {
      "copyright": "© 2025 Dulwich College Beijing",
      "links": [...]
    },
    "banner": {
      "title": "Admissions Overview",
      "image": "..."
    },
    "blocks": [
      {
        "id": "block-1",
        "type": "accordion",
        "content": {...}
      }
    ],
    "school": {
      "id": 1,
      "name": "Beijing",
      "slug": "beijing"
    }
  }
}
```

### **Article Response**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "slug": "dulwich-life",
    "title": "Dulwich Life",
    "content": "<p>Article content...</p>",
    "excerpt": "Short description",
    "author": {
      "name": "John Doe",
      "avatar": "..."
    },
    "publishedAt": "2025-01-08T10:00:00Z",
    "category": "News",
    "tags": ["community", "events"],
    "image": "..."
  }
}
```

---

## 🚀 Quick Start

### **1. Use School Pages**
```javascript
import { useSchoolPageBySlug } from './hooks/useSchoolPageBySlug';

function MyComponent() {
  const { data } = useSchoolPageBySlug('admissions/overview', 'beijing');

  return (
    <div>
      <h1>{data?.school?.name}</h1>
      {/* School-specific header */}
      <Header data={data?.header} />

      {/* Content blocks */}
      <BlockRenderer blocks={data?.blocks} />

      {/* School-specific footer */}
      <Footer data={data?.footer} />
    </div>
  );
}
```

### **2. Use Articles**
```javascript
import { useArticleBySlug } from './hooks/useArticleBySlug';

function ArticlePage() {
  const { data } = useArticleBySlug('dulwich-life');

  return (
    <article>
      <h1>{data?.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: data?.content }} />
    </article>
  );
}
```

---

## ✅ Key Features

1. **Separate Headers/Footers** - Each school has unique branding
2. **React Query Caching** - Automatic data caching and background sync
3. **Type Safety** - Clear API contracts
4. **Error Handling** - Built-in retry and error states
5. **Loading States** - Automatic loading indicators
6. **Dynamic Routing** - URL-based page rendering

---

## 🎯 URL Patterns

| Type | URL Pattern | API Endpoint |
|------|------------|--------------|
| Main Site | `/about` | `/api/page?slug=about` |
| School Page | `/school/beijing/admissions` | `/api/school/page?slug=admissions&school=beijing` |
| Article | `/article/dulwich-life` | `/api/article?slug=dulwich-life` |
| Article List | `/articles?category=news` | `/api/article/list?category=news` |

---

## 🔧 Environment Variables

Add to your `.env` file:
```env
REACT_APP_API_URL=https://www.dulwich.atalent.xyz
```

Default value is already set in the service files.
