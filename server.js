require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const app = express();
const PORT = process.env.EXPRESS_PORT || process.env.PORT || 4000;

// API base URL - use production CMS
const API_BASE_URL = process.env.REACT_APP_API_URL;

// Serve static files from the React app (but not HTML, robots.txt, or sitemap.xml files)
app.use((req, res, next) => {
  // Skip static file serving for robots.txt and sitemap.xml routes
  if (req.path === '/robots.txt' || req.path === '/sitemap.xml' || req.path === '/zh/sitemap.xml') {
    return next();
  }
  express.static(path.join(__dirname, 'build'), {
    index: false, // Don't serve index.html automatically
    setHeaders: (res, filePath) => {
      // Don't cache HTML files
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-store');
      }
    }
  })(req, res, next);
});

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

// Helper function to fetch and parse sitemap XML
const fetchSitemapXML = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error.message);
    return null;
  }
};

// Helper function to extract URLs from sitemap XML and replace domain
const extractUrlsFromSitemap = (xmlContent, targetDomain) => {
  if (!xmlContent) return [];

  // Extract all <url> blocks from the XML
  const urlRegex = /<url>([\s\S]*?)<\/url>/g;
  const urls = [];
  let match;

  while ((match = urlRegex.exec(xmlContent)) !== null) {
    let urlBlock = match[1];

    // Replace any localhost or CMS domain URLs with the target domain

    urlBlock = urlBlock.replace(
      /(https?:\/\/)[^\/]+/g,
      targetDomain
    );

    urls.push(`  <url>${urlBlock}</url>`);
  }

  return urls;
};

// Helper function to get all URLs from all sitemap types for a school
const getSchoolSitemapUrls = async (schoolSlug, targetDomain) => {
  const sitemapTypes = ['pages', 'news', 'people'];
  const allUrls = [];

  for (const type of sitemapTypes) {
    const url = `${API_BASE_URL}/sitemap-${type}.xml?subdomain=${schoolSlug}`;
    console.log(`📡 Fetching sitemap-${type}.xml for ${schoolSlug}`);

    const xmlContent = await fetchSitemapXML(url);
    if (xmlContent) {
      const urls = extractUrlsFromSitemap(xmlContent, targetDomain);
      allUrls.push(...urls);
      console.log(`✅ Found ${urls.length} URLs in sitemap-${type}.xml for ${schoolSlug}`);
    }
  }

  return allUrls;
};

// Helper function to get group sitemap URLs (for main domain)
const getGroupSitemapUrls = async (targetDomain) => {
  const sitemapTypes = ['pages', 'news'];
  const allUrls = [];

  for (const type of sitemapTypes) {
    const url = `${API_BASE_URL}/group/sitemap-${type}.xml`;
    console.log(`📡 Fetching group sitemap-${type}.xml`);

    const xmlContent = await fetchSitemapXML(url);
    if (xmlContent) {
      const urls = extractUrlsFromSitemap(xmlContent, targetDomain);
      allUrls.push(...urls);
      console.log(`✅ Found ${urls.length} URLs in group sitemap-${type}.xml`);
    }
  }

  return allUrls;
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

    // Check if this is a school-specific request
    if (school) {
      const normalizedSlug = slug.replace(/^\/+|\/+$/g, '');
      const isHomepage = !normalizedSlug || normalizedSlug === 'home';

      if (isHomepage) {
        // School homepage: /api/school/home?locale=en&slug=singapore
        url = `${API_BASE_URL}/api/school/home?`;
        if (locale) {
          url += `locale=${locale}&`;
        }
        url += `slug=${school}`;
      } else {
        // School page: /api/school/page?locale=en&slug=about&school=singapore
        url = `${API_BASE_URL}/api/school/page?`;
        if (locale) {
          url += `locale=${locale}&`;
        }
        url += `slug=${normalizedSlug}&school=${school}-cms`;
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
    return response.data;
  } catch (error) {
    // If the API returns a 404 or other error, we might still get redirect data in the error response
    if (error.response && error.response.data) {
      return error.response.data;
    }
    console.error('Error fetching page data:', error.message);
    return null;
  }
};

// Helper function to generate sitemap
const generateSitemap = async (req, res) => {
  try {
    console.log('📄 Generating sitemap.xml');

    // Detect school from hostname (subdomain)
    const hostname = req.hostname;
    let school = null;

    // List of all school slugs (without -cms suffix)
    const schools = ['singapore', 'shanghai-puxi', 'shanghai-pudong', 'suzhou', 'suzhou-high-school', 'hengqin-high-school', 'beijing', 'seoul', 'bangkok'];

    // Check if hostname is a school subdomain
    for (const s of schools) {
      if (hostname.startsWith(s + '.') || hostname === s || hostname.includes(s)) {
        school = s;
        break;
      }
    }

    // Build target domain from request
    const protocol = req.protocol;
    const host = req.get('host');
    const targetDomain = `${protocol}://${host}`;

    // If a specific school is detected, return only that school's URLs
    if (school) {
      console.log(`📍 Detected school: ${school}`);
      const urls = await getSchoolSitemapUrls(school, targetDomain);

      // Build the sitemap urlset for this school
      let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
      sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n';

      urls.forEach(url => {
        sitemap += url + '\n';
      });

      sitemap += '</urlset>';

      // Set appropriate headers
      res.header('Content-Type', 'application/xml');
      res.header('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
      res.send(sitemap);

      console.log(`✅ Sitemap for ${school} generated successfully with ${urls.length} URLs`);
    } else {
      // No specific school detected, return group sitemap URLs
      console.log('📍 No specific school detected, generating group sitemap');

      // Fetch group sitemap URLs
      const urls = await getGroupSitemapUrls(targetDomain);

      // Build the sitemap urlset for group pages
      let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
      sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n';

      urls.forEach(url => {
        sitemap += url + '\n';
      });

      sitemap += '</urlset>';

      // Set appropriate headers
      res.header('Content-Type', 'application/xml');
      res.header('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
      res.send(sitemap);

      console.log(`✅ Group sitemap generated successfully with ${urls.length} URLs`);
    }
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
};

// Helper function to generate robots.txt
const generateRobotsTxt = (req, res) => {
  try {
    const hostname = req.hostname;
    const isProduction = process.env.NODE_ENV === 'production';

    // List of all school slugs
    const schools = ['singapore', 'shanghai-puxi', 'shanghai-pudong', 'suzhou', 'suzhou-high-school', 'hengqin-high-school', 'beijing', 'seoul', 'bangkok'];

    // Detect if this is a school site
    let school = null;
    for (const s of schools) {
      if (hostname.startsWith(s + '.') || hostname === s || hostname.includes(s)) {
        school = s;
        break;
      }
    }

    let robotsTxt = '';

    if (isProduction) {
      // Production robots.txt - different for school vs group
      if (school) {
        // School site robots.txt
        robotsTxt = `User-agent: AdsBot-Google
Allow: /

User-agent: *
Disallow: /search/
Disallow: /ajax/
Disallow: /preview/
Disallow: /zh/preview/
Disallow: /my/preview/

Sitemap: ${req.protocol}://${req.get('host')}/sitemap.xml
`;
      } else {
        // Group site robots.txt
        robotsTxt = `User-agent: AdsBot-Google
Allow: /

User-agent: *
Disallow: /search/
Disallow: /ajax/
Disallow: /cms/
Disallow: /careers/search
Disallow: /preview/
Disallow: /zh/preview/
Disallow: /my/preview/
Disallow: /lp/
Disallow: /zh/lp/

Sitemap: ${req.protocol}://${req.get('host')}/sitemap.xml
`;
      }
    } else {
      // Development robots.txt - block all crawlers
      if (school) {
        // School site development
        robotsTxt = `User-agent: *
Disallow: /
`;
      } else {
        // Group site development
        robotsTxt = `User-agent: AdsBot-Google
Allow: /

User-agent: *
Disallow: /
Disallow: /lp/
Disallow: /zh/lp/
`;
      }
    }

    res.header('Content-Type', 'text/plain');
    res.send(robotsTxt);
  } catch (error) {
    console.error('Error generating robots.txt:', error);
    res.status(500).send('Error generating robots.txt');
  }
};

// Robots.txt route - must be before sitemap routes
app.get('/robots.txt', generateRobotsTxt);

// Sitemap routes - must be before the catch-all route
app.get('/sitemap.xml', generateSitemap);
app.get('/zh/sitemap.xml', generateSitemap);

// Handle all routes
app.get('*', async (req, res) => {
  try {
    const urlPath = req.path;
    const hostname = req.hostname;
    const query = req.query;
    const queryString = Object.keys(query).length > 0 
      ? '?' + new URLSearchParams(query).toString() 
      : '';

    // List of school subdomains
    const schools = ['singapore', 'shanghai-puxi', 'shanghai-pudong', 'suzhou', 'suzhou-high-school', 'hengqin-high-school', 'beijing', 'seoul', 'bangkok'];

    // Detect school from hostname (subdomain)
    let school = null;
    for (const s of schools) {
      if (hostname.startsWith(s + '.') || hostname === s) {
        school = s;
        break;
      }
    }

    // 1. HTTP Level Redirects (Legacy path cleanup & Business Rules)
    
    // A. Redirect /en paths to remove /en prefix (SEO best practice)
    if (urlPath.startsWith('/en/') || urlPath === '/en') {
      const newPath = urlPath.replace(/^\/en\/?/, '/') || '/';
      console.log(`🔄 HTTP 301: Redirecting /en prefix to: ${newPath}`);
      return res.redirect(301, newPath + queryString);
    }

    // B. Redirect /zh paths for Bangkok, Singapore, and Seoul schools only (Business requirement)
    const englishOnlySchools = ['bangkok', 'singapore', 'seoul'];
    if (school && englishOnlySchools.includes(school) && (urlPath.startsWith('/zh/') || urlPath === '/zh')) {
      const newPath = urlPath.replace(/^\/zh\/?/, '/') || '/';
      console.log(`🔄 HTTP 302: Redirecting ${school} /zh page to English: ${newPath}`);
      return res.redirect(302, newPath + queryString);
    }

    // Parse the URL to get slug and locale for API call
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

    // Remove trailing slashes for API mapping
    if (slug !== '/' && slug.endsWith('/')) {
      slug = slug.slice(0, -1);
    }

    console.log(`📄 Checking route: ${slug} (locale: ${locale}, school: ${school || 'none'})`);

    // Fetch page data from API (which includes potential dynamic redirects)
    const apiResponse = await fetchPageData(slug, locale, school);

    // 2. Dynamic CMS Redirect Rules
    if (apiResponse) {
      const hasRedirect = apiResponse.redirects?.redirect === true || apiResponse.redirect === true;
      const redirectTarget = apiResponse.redirects?.target || apiResponse.target;
      const redirectStatus = parseInt(apiResponse.redirects?.status || apiResponse.status || 301, 10);

      if (hasRedirect && redirectTarget) {
        console.log(`🔄 HTTP CMS Redirect: ${redirectTarget} (${redirectStatus})`);
        return res.redirect(redirectStatus, redirectTarget);
      }
    }

    // 3. Render Fallback (index.html with SEO injection)
    const indexPath = path.join(__dirname, 'build', 'index.html');
    if (!fs.existsSync(indexPath)) {
      console.error('❌ index.html not found in build folder');
      return res.status(404).send('Not Found');
    }

    let html = fs.readFileSync(indexPath, 'utf8');
    const pageData = apiResponse?.data;

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
