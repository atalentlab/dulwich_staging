require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;

// API base URL - use production CMS
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://cms.dulwich.org';

// Serve static files from the React app (but not HTML files)
app.use(express.static(path.join(__dirname, 'build'), {
  index: false, // Don't serve index.html automatically
  setHeaders: (res, filePath) => {
    // Don't cache HTML files
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-store');
    }
  }
}));

// Helper function to escape HTML
const escapeHtml = (text) => {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Helper function to inject meta tags
const injectMetaTags = (html, pageData) => {
  const meta = pageData?.meta || {};

  // Extract values from API response
  const title = meta.meta_title;
  const description = meta.meta_description || '';
  const keywords = meta.meta_keywords;
  const ogImage = meta.og_image;

  // Remove ALL title tags (handle multiline and minified)
  html = html.replace(/<title[\s>][^<]*<\/title>/gi, '');
  html = html.replace(/<title>.*?<\/title>/gi, '');

  // Insert ONE dynamic title after charset meta tag (safest position)
  html = html.replace(
    /(<meta\s+charset="[^"]*"\s*\/?>)/i,
    `$1<title>${escapeHtml(title)}</title>`
  );

  // Replace meta description (handles both spaced and minified HTML)
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/gi,
    `<meta name="description" content="${escapeHtml(description)}"/>`
  );

  // Replace meta keywords
  html = html.replace(
    /<meta\s+name="keywords"\s+content="[^"]*"\s*\/?>/gi,
    `<meta name="keywords" content="${escapeHtml(keywords)}"/>`
  );

  // Replace OG title
  html = html.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/gi,
    `<meta property="og:title" content="${escapeHtml(title)}"/>`
  );

  // Replace OG description
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/gi,
    `<meta property="og:description" content="${escapeHtml(description)}"/>`
  );

  // Replace OG image
  html = html.replace(
    /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/gi,
    `<meta property="og:image" content="${escapeHtml(ogImage)}"/>`
  );

  // Replace Twitter title
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/gi,
    `<meta name="twitter:title" content="${escapeHtml(title)}"/>`
  );

  // Replace Twitter description
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/gi,
    `<meta name="twitter:description" content="${escapeHtml(description)}"/>`
  );

  // Replace Twitter image
  html = html.replace(
    /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/gi,
    `<meta name="twitter:image" content="${escapeHtml(ogImage)}"/>`
  );

  return html;
};

// Fetch page data from API
const fetchPageData = async (slug, locale = 'en', school = null) => {
  try {
    let url;
    const cmsSuffix = process.env.REACT_APP_SCHOOL_CMS_SUFFIX || '-cms';

    // Check if this is a school-specific request
    if (school) {
      const normalizedSlug = slug.replace(/^\/+|\/+$/g, '');
      const isHomepage = !normalizedSlug || normalizedSlug === 'home';

      if (isHomepage) {
        // School homepage: /api/school/home?locale=en&slug=singapore-cms
        url = `${API_BASE_URL}/api/school/home?`;
        if (locale) {
          url += `locale=${locale}&`;
        }
        url += `slug=${school}${cmsSuffix}`;
      } else {
        // School page: /api/school/page?locale=en&slug=about&school=singapore-cms
        url = `${API_BASE_URL}/api/school/page?`;
        if (locale) {
          url += `locale=${locale}&`;
        }
        url += `slug=${normalizedSlug}&school=${school}${cmsSuffix}`;
      }
    } else {
      // General page (no school)
      if (slug === '/' || slug === 'home') {
        url = `${API_BASE_URL}/api/page/home`;
        if (locale) {
          url += `?locale=${locale}`;
        }
      } else {
        // All other general pages
        url = `${API_BASE_URL}/api/page?`;
        if (locale) {
          url += `locale=${locale}&`;
        }
        url += `slug=${slug}`;
      }
    }

    console.log(`📡 Fetching from: ${url}`);
    const response = await axios.get(url);
    const pageData = response.data?.data;

    // Debug: Log the meta data
    if (pageData?.meta) {
      console.log('📋 Meta data received:', JSON.stringify(pageData.meta, null, 2));
    } else {
      console.log('⚠️  No meta data in response');
    }

    return pageData;
  } catch (error) {
    console.error('Error fetching page data:', error.message);
    return null;
  }
};

// Handle all routes
app.get('*', async (req, res) => {
  try {
    // Read the index.html file
    const indexPath = path.join(__dirname, 'build', 'index.html');
    let html = fs.readFileSync(indexPath, 'utf8');

    // Detect school from hostname (subdomain)
    const hostname = req.hostname;
    let school = null;

    // List of school subdomains
    const schools = ['singapore', 'shanghai', 'suzhou', 'beijing', 'seoul', 'yangon'];

    // Check if hostname is a school subdomain
    for (const s of schools) {
      if (hostname.startsWith(s + '.') || hostname === s) {
        school = s;
        break;
      }
    }

    // Parse the URL to get slug and locale
    const urlPath = req.path;
    let locale = 'en';
    let slug = urlPath;

    // Check if it's a Chinese version
    if (urlPath.startsWith('/zh/')) {
      locale = 'zh';
      slug = urlPath.replace('/zh/', '');
    } else if (urlPath === '/zh') {
      locale = 'zh';
      slug = '/';
    } else {
      slug = urlPath === '/' ? '/' : urlPath.replace(/^\//, '');
    }

    // Remove trailing slashes
    if (slug !== '/' && slug.endsWith('/')) {
      slug = slug.slice(0, -1);
    }

    console.log(`📄 Rendering page: ${slug} (locale: ${locale}, school: ${school || 'none'})`);

    // Fetch page data from API
    const pageData = await fetchPageData(slug, locale, school);

    // Inject meta tags if we have page data
    if (pageData) {
      console.log('✅ Page data found, injecting meta tags');
      html = injectMetaTags(html, pageData);
    } else {
      console.log('⚠️ No page data found, using defaults');
    }

    // Send the modified HTML
    res.send(html);
  } catch (error) {
    console.error('Error serving page:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📡 API base URL: ${API_BASE_URL}`);
});
