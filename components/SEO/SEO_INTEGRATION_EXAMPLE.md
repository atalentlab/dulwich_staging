# SEO Integration Examples

## Integrating DynamicSEO into Existing Components

### Example 1: PageRenderer Integration

```jsx
// src/components/PageRenderer.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { usePageBySlug } from '../hooks/usePageBySlug';
import DynamicSEO from './SEO/DynamicSEO'; // Import DynamicSEO
import useSEO from '../hooks/useSEO';
import useSmoothScroll from '../hooks/useSmoothScroll';
// ... other imports

const PageRenderer = ({ slug: fixedSlug, locale: fixedLocale }) => {
  const location = useLocation();
  // ... existing code ...

  const slug = fixedSlug || getSlug();
  const locale = fixedLocale || /* derive locale */;

  // Fetch page data
  const { data, isLoading, error } = usePageBySlug(slug, locale);

  // Prepare SEO data from API response
  const seoData = {
    title: data?.meta?.meta_title || data?.banner?.title,
    description: data?.meta?.meta_description || data?.banner?.description,
    image: data?.banner?.header_image || data?.banner?.cover_image,
    url: window.location.href,
    type: 'website',
    locale: locale === 'zh' ? 'zh_CN' : 'en_US',
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error || !data) {
    return <ErrorPage errorCode={404} />;
  }

  return (
    <div className="page-wrapper">
      {/* Add DynamicSEO Component */}
      <DynamicSEO
        title={seoData.title}
        description={seoData.description}
        image={seoData.image}
        url={seoData.url}
        type={seoData.type}
        locale={seoData.locale}
      />

      {/* Existing page content */}
      <PageHeader {...headerProps} />
      {data.banner && <BannerBlock content={data.banner} />}
      <main className="page-content">
        <BlockRenderer blocks={data.blocks} />
      </main>
      <PageFooter {...footerProps} />
    </div>
  );
};

export default PageRenderer;
```

---

### Example 2: SchoolPageRenderer Integration

```jsx
// src/components/school/SchoolPageRenderer.js
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Navigate } from 'react-router-dom';
import { useSchoolPageBySlug } from '../../hooks/useSchoolPageBySlug';
import DynamicSEO from '../SEO/DynamicSEO'; // Import DynamicSEO
// ... other imports

const SchoolPageRenderer = ({ school: propSchool, slug: propSlug, locale: propLocale }) => {
  const location = useLocation();
  // ... existing code ...

  const school = propSchool || params.school;
  const pageSlug = propSlug || urlSlug;
  const locale = propLocale !== undefined ? propLocale : (urlLocale || null);

  // Fetch school page data
  const { data, isLoading, error } = useSchoolPageBySlug(pageSlug, school, locale);

  // Prepare SEO data
  const seoData = {
    title: data?.meta?.meta_title || data?.banner?.title || `${school} - Dulwich College`,
    description: data?.meta?.meta_description || data?.banner?.description,
    image: data?.banner?.header_image,
    url: window.location.href,
    type: 'website',
    locale: locale === 'zh' ? 'zh_CN' : 'en_US',
    siteName: `Dulwich College ${school.charAt(0).toUpperCase() + school.slice(1)}`,
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error || !data) {
    return <ErrorPage errorCode={404} />;
  }

  return (
    <div className="school-page-wrapper">
      {/* Add DynamicSEO Component */}
      <DynamicSEO
        title={seoData.title}
        description={seoData.description}
        image={seoData.image}
        url={seoData.url}
        type={seoData.type}
        locale={seoData.locale}
        siteName={seoData.siteName}
      />

      {/* Existing page content */}
      <PageHeader {...headerProps} />
      {data.banner && <BannerBlock content={data.banner} />}
      <main className="school-page-content">
        <BlockRenderer blocks={data.blocks} />
      </main>
      <PageFooter {...footerProps} />
    </div>
  );
};

export default SchoolPageRenderer;
```

---

### Example 3: Article Page Integration

```jsx
// src/components/article/ArticlePageRenderer.js
import React from 'react';
import { useParams } from 'react-router-dom';
import { useArticleBySlug } from '../../hooks/useArticleBySlug';
import DynamicSEO from '../SEO/DynamicSEO';
import Loading from '../common/Loading';

const ArticlePageRenderer = () => {
  const { slug, locale } = useParams();

  // Fetch article data
  const { data: article, isLoading, error } = useArticleBySlug(slug, locale);

  if (isLoading) return <Loading />;
  if (error || !article) return <ErrorPage errorCode={404} />;

  // Article-specific SEO
  const seoData = {
    title: article.title,
    description: article.excerpt || article.description,
    image: article.featured_image || article.header_image,
    url: window.location.href,
    type: 'article', // Important: use 'article' type
    locale: locale === 'zh' ? 'zh_CN' : 'en_US',
  };

  return (
    <>
      <DynamicSEO {...seoData} />

      <article className="article-page">
        <header>
          <h1>{article.title}</h1>
          <time dateTime={article.published_date}>
            {new Date(article.published_date).toLocaleDateString()}
          </time>
        </header>
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </article>
    </>
  );
};

export default ArticlePageRenderer;
```

---

### Example 4: Using with API Endpoint

#### Backend API Response Format

```json
// GET /api/page?slug=admissions&locale=zh
{
  "success": true,
  "data": {
    "banner": {
      "title": "招生报名",
      "description": "西安曲江德闳学校是一所将中国基础教育的精髓和国际化教育理念有机结合的中国学校",
      "header_image": "https://cms.dulwich.atalent.xyz/images/admissions-banner.jpg"
    },
    "meta": {
      "meta_title": "招生报名 | 德闳学校",
      "meta_description": "了解德闳学校的招生流程、入学要求和申请时间表",
      "meta_keywords": "招生, 报名, 德闳学校, 国际学校"
    },
    "seo": {
      "og_title": "招生报名 | 德闳学校",
      "og_description": "了解德闳学校的招生流程",
      "og_image": "https://cms.dulwich.atalent.xyz/images/og/admissions.jpg",
      "og_type": "website"
    },
    "blocks": [...]
  }
}
```

#### Using API Data in Component

```jsx
import React from 'react';
import { usePageBySlug } from '../hooks/usePageBySlug';
import DynamicSEO from './SEO/DynamicSEO';

const AdmissionsPage = () => {
  const { data, isLoading } = usePageBySlug('admissions', 'zh');

  if (isLoading) return <Loading />;

  // Extract SEO data with proper fallbacks
  const seoData = {
    title: data?.seo?.og_title || data?.meta?.meta_title || data?.banner?.title,
    description: data?.seo?.og_description || data?.meta?.meta_description || data?.banner?.description,
    image: data?.seo?.og_image || data?.banner?.header_image,
    url: `${window.location.origin}/zh/admissions`,
    type: data?.seo?.og_type || 'website',
    locale: 'zh_CN',
  };

  return (
    <>
      <DynamicSEO {...seoData} />
      <div className="page-content">
        {/* Page content */}
      </div>
    </>
  );
};
```

---

### Example 5: Testing with Preview Card

```jsx
import React from 'react';
import DynamicSEO from '../components/SEO/DynamicSEO';
import LinkPreviewCard from '../components/SEO/LinkPreviewCard';
import useFetchSEOData from '../hooks/useFetchSEOData';

const TestSEOPage = () => {
  const apiUrl = `${process.env.REACT_APP_API_URL}/api/seo/test`;
  const { data: seoData, loading } = useFetchSEOData(apiUrl);

  const seoProps = {
    title: seoData?.title || 'Test Page',
    description: seoData?.description || 'Test description',
    image: seoData?.image || '/images/default.jpg',
    url: window.location.href,
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {/* Apply SEO tags */}
      <DynamicSEO {...seoProps} />

      <div className="container mx-auto py-12">
        <h1 className="text-4xl font-bold mb-8">SEO Testing Page</h1>

        {/* Show preview card */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Link Preview</h2>
          <LinkPreviewCard {...seoProps} />
        </div>

        {/* Show applied meta tags */}
        <div className="bg-gray-100 p-6 rounded">
          <h3 className="font-bold mb-2">Applied Meta Tags:</h3>
          <pre className="text-xs overflow-x-auto">
            {JSON.stringify(seoProps, null, 2)}
          </pre>
        </div>
      </div>
    </>
  );
};

export default TestSEOPage;
```

---

## Route Configuration

Add SEO example route to your App.js:

```jsx
// src/App.js
import SEOExamplePage from './pages/SEOExamplePage';

function App() {
  return (
    <Routes>
      {/* ... existing routes ... */}

      {/* SEO Testing Route */}
      <Route path="/test-seo" element={<SEOExamplePage />} />

      {/* ... other routes ... */}
    </Routes>
  );
}
```

---

## Environment Variables

Add to `.env`:

```env
# API Configuration
REACT_APP_API_URL=https://api.dulwich.org

# SEO Defaults
REACT_APP_DEFAULT_OG_IMAGE=/images/opengraph/default.png
REACT_APP_SITE_NAME=Dulwich College International
REACT_APP_TWITTER_HANDLE=@DulwichCollege
```

---

## Testing Checklist

- [ ] Test on Facebook Sharing Debugger
- [ ] Test on Twitter Card Validator
- [ ] Test on LinkedIn Post Inspector
- [ ] Test on OpenGraph.xyz
- [ ] Verify image URLs are absolute (HTTPS)
- [ ] Check image loads within 3 seconds
- [ ] Verify title length (<60 chars)
- [ ] Verify description length (<155 chars)
- [ ] Test Chinese (zh) and English (en) pages
- [ ] Check mobile preview
- [ ] Verify fallback values work when API fails
- [ ] Test with network offline (fallback behavior)

---

## Common Issues & Solutions

### Issue 1: Images Not Showing in Preview

**Problem:** OG image appears broken in social media preview

**Solutions:**
- ✅ Use absolute HTTPS URLs (not relative paths)
- ✅ Ensure image is publicly accessible (not behind auth)
- ✅ Use recommended size: 1200x630px
- ✅ Check image loads fast (<3 seconds)
- ✅ Verify correct CORS headers on image server

### Issue 2: Old Preview Cached

**Problem:** Updated OG tags but old preview still shows

**Solutions:**
- ✅ Use Facebook Debugger "Scrape Again" button
- ✅ Add cache-busting query parameter: `?v=2`
- ✅ Wait 24-48 hours for WhatsApp cache to expire

### Issue 3: Tags Not Updating

**Problem:** Meta tags don't change when navigating between pages

**Solution:**
```jsx
// Make sure DynamicSEO re-renders with new data
useEffect(() => {
  // Force re-render when data changes
}, [data]);
```

### Issue 4: Localhost Testing

**Problem:** Can't test OG tags on localhost

**Solutions:**
- ✅ Use ngrok to expose localhost: `ngrok http 3000`
- ✅ Deploy to staging environment
- ✅ Use OpenGraph.xyz for basic validation

---

## Best Practices

1. **Always provide fallbacks:**
   ```jsx
   title: apiData?.title || staticData?.title || 'Default Title'
   ```

2. **Use absolute URLs:**
   ```jsx
   image: image.startsWith('http') ? image : `${origin}${image}`
   ```

3. **Set locale correctly:**
   ```jsx
   locale: isChineseVersion ? 'zh_CN' : 'en_US'
   ```

4. **Include image dimensions:**
   ```jsx
   <meta property="og:image:width" content="1200" />
   <meta property="og:image:height" content="630" />
   ```

5. **Test regularly:**
   - Check after every deployment
   - Verify on all major platforms
   - Monitor social sharing analytics

---

**Last Updated:** 2026-03-28
