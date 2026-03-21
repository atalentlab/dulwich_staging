/**
 * Express server for Dulwich React SPA
 * Injects dynamic OG/SEO meta tags server-side on every request so social
 * media crawlers (WhatsApp, Telegram, etc.) always receive correct data.
 *
 * OG Image strategy — stale-while-revalidate:
 *   1st crawl  → og:image = direct CDN URL (instant, no processing)
 *                + triggers background image generation saved to disk
 *   2nd+ crawl → og:image = /og-cache/{hash}.jpg (local file, instant)
 */

const express  = require('express');
const path     = require('path');
const fs       = require('fs');
const sharp    = require('sharp');
const crypto   = require('crypto');

const app = express();

// Trust reverse-proxy headers so req.protocol returns 'https' correctly
app.set('trust proxy', true);

const BUILD_PATH   = path.join(__dirname, 'build');
const API_BASE     = process.env.REACT_APP_API_URL || 'https://cms.dulwich.org';
const SITE_URL     = process.env.SITE_URL || '';  // e.g. https://www.dulwich-frontend.atalent.xyz
const OG_CACHE_DIR = path.join(__dirname, 'og-cache');

// Ensure og-cache directory exists
if (!fs.existsSync(OG_CACHE_DIR)) fs.mkdirSync(OG_CACHE_DIR, { recursive: true });

// ─── School subdomain detection (mirrors src/utils/schoolDetection.js) ────────
const VALID_SCHOOLS = new Set([
  'bangkok', 'beijing', 'seoul', 'shanghai-pudong', 'shanghai-puxi',
  'singapore', 'suzhou', 'hengqin-high-school', 'international',
  'shanghai', 'yangon', 'zhuhai', 'haikou', 'tokyo', 'hongkong',
  'london', 'pudong', 'puxi',
]);

const getSchoolFromHostname = (hostname) => {
  const host  = hostname.split(':')[0];
  const parts = host.split('.');
  if (parts.length >= 4 && parts[0] === 'www' && parts[2].includes('dulwich')) {
    const s = parts[1].toLowerCase();
    if (VALID_SCHOOLS.has(s)) return s;
  }
  if (parts.length === 3 && parts[1] === 'atalent') {
    const s = parts[0].toLowerCase();
    if (VALID_SCHOOLS.has(s)) return s;
  }
  if (host.endsWith('localhost')) {
    const s = parts[0].toLowerCase();
    if (VALID_SCHOOLS.has(s)) return s;
  }
  if (parts.length >= 3) {
    const s = parts[0].toLowerCase();
    if (VALID_SCHOOLS.has(s)) return s;
  }
  return null;
};

// ─── Slug / locale parser ─────────────────────────────────────────────────────
const getSlugFromPath = (pathname) => {
  const cleanPath = pathname.replace(/^\/|\/$/g, '');
  if (!cleanPath) return { slug: 'home', locale: null };
  const supportedLocales = ['zh', 'en', 'cn'];
  const segments = cleanPath.split('/');
  const firstSegment = segments[0].toLowerCase();
  if (supportedLocales.includes(firstSegment)) {
    return { slug: segments.slice(1).join('/') || 'home', locale: firstSegment };
  }
  return { slug: cleanPath, locale: null };
};

// ─── API helpers ──────────────────────────────────────────────────────────────
// Both return { banner, meta } so the route handler can use whichever has the data.
// API response shape: { data: { banner: {...}, meta: {...}, blocks: [...] } }

const fetchPageData = async (slug, locale) => {
  try {
    let url;
    if (slug === 'home') {
      url = `${API_BASE}/api/page/home`;
      if (locale) url += `?locale=${locale}`;
    } else {
      url = `${API_BASE}/api/page?`;
      if (locale) url += `locale=${locale}&`;
      url += `slug=${encodeURIComponent(slug)}`;
    }
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return { banner: null, meta: null };
    const data = (await res.json())?.data || {};
    return { banner: data.banner || null, meta: data.meta || null };
  } catch { return { banner: null, meta: null }; }
};

const fetchSchoolData = async (slug, school, locale) => {
  try {
    const isHome = !slug || slug === 'home';
    const params = new URLSearchParams();
    if (locale) params.append('locale', locale);
    let url;
    if (isHome) {
      params.append('slug', school);
      url = `${API_BASE}/api/school/home?${params}`;
    } else {
      params.append('slug', slug);
      params.append('school', school);
      url = `${API_BASE}/api/school/page?${params}`;
    }
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return { banner: null, meta: null };
    const data = (await res.json())?.data || {};
    return { banner: data.banner || null, meta: data.meta || null };
  } catch { return { banner: null, meta: null }; }
};

const fetchArticleData = async (slug, locale, school) => {
  try {
    let url = `${API_BASE}/api/article_details?slug=${encodeURIComponent(slug)}&locale=${locale || 'en'}`;
    if (school) url += `&school=${school}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return { banner: null, meta: null };
    const main = (await res.json())?.data?.main || {};
    return {
      banner: {
        title:            main.title            || null,
        header_image:     main.listing_image    || main.featured_image || null,
        meta_title:       main.meta_title       || main.title          || null,
        meta_description: main.meta_description || main.intro          || null,
        meta_keywords:    main.meta_keywords                           || null,
      },
      meta: {
        meta_title:       main.meta_title       || main.title  || null,
        meta_description: main.meta_description || main.intro  || null,
        meta_keywords:    main.meta_keywords                   || null,
      },
    };
  } catch { return { banner: null, meta: null }; }
};

// ─── Article path detection ───────────────────────────────────────────────────
// Article routes: /dulwich-life/:slug  /article/:slug  /:locale/(dulwich-life|article)/:slug
const ARTICLE_SECTIONS = new Set(['dulwich-life', 'article']);
const SUPPORTED_LOCALES = new Set(['zh', 'en', 'cn']);

const getArticleSlugFromPath = (pathname) => {
  const segs = (pathname || '').replace(/^\/|\/$/g, '').split('/'); 
  let idx = 0;
  if (SUPPORTED_LOCALES.has(segs[0]?.toLowerCase())) idx = 1;
  if (ARTICLE_SECTIONS.has(segs[idx]?.toLowerCase()) && segs[idx + 1]) {
    return segs[idx + 1];
  }
  return null;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const escapeHtml = (str = '') =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const escapeXmlSvg = (str = '') =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const wordWrap = (text, maxChars) => {
  const words = String(text).split(' ');
  const lines = [];
  let current = '';
  for (const word of words) {
    if (!current) { current = word; }
    else if ((current + ' ' + word).length <= maxChars) { current += ' ' + word; }
    else { lines.push(current); current = word; }
  }
  if (current) lines.push(current);
  return lines.slice(0, 3);
};

// ─── OG image disk cache ──────────────────────────────────────────────────────
const ALLOWED_IMAGE_HOSTS = [
  'dulwich.atalent.xyz',
  'dulwich-azure-prod.oss-cn-shanghai.aliyuncs.com',
  'dulwich-azure.oss-cn-shanghai.aliyuncs.com',
  'oss-cn-shanghai.aliyuncs.com',
  'dulwich.org',
];

const getOgCacheKey = (title, bg) =>
  crypto.createHash('md5').update(`${title}::${bg || ''}`).digest('hex');

const getOgCacheFile = (key) => path.join(OG_CACHE_DIR, `${key}.jpg`);

// Generate the composite OG image and save to disk
// Long timeout (15 s) — runs in background, not on the critical path
const generateAndSaveOgImage = async (title, bg, cacheFile) => {
  if (fs.existsSync(cacheFile)) return; // already done

  try {
    let bgBuffer;
    if (bg) {
      try {
        const bgRes = await fetch(bg, { signal: AbortSignal.timeout(15000) });
        if (bgRes.ok) {
          bgBuffer = await sharp(Buffer.from(await bgRes.arrayBuffer()))
            .resize(1200, 630, { fit: 'cover', position: 'centre' })
            .toBuffer();
        }
      } catch { /* CDN unreachable — use solid colour below */ }
    }

    if (!bgBuffer) {
      bgBuffer = await sharp({
        create: { width: 1200, height: 630, channels: 4, background: { r: 158, g: 20, b: 34, alpha: 1 } },
      }).png().toBuffer();
    }

    const lines      = wordWrap(title, 36);
    const lineHeight = 66;
    const textStartY = 630 - 50 - lines.length * lineHeight;

    const textElements = lines.map((line, i) =>
      `<text x="60" y="${textStartY + (i + 1) * lineHeight}"
        font-family="Arial, Helvetica, sans-serif" font-size="54"
        font-weight="bold" fill="white">${escapeXmlSvg(line)}</text>`
    ).join('\n');

    const svgOverlay = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="30%" stop-color="#000" stop-opacity="0"/>
          <stop offset="100%" stop-color="#000" stop-opacity="0.82"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#g)"/>
      <rect x="0" y="0" width="1200" height="10" fill="#9E1422"/>
      ${textElements}
      <text x="60" y="618" font-family="Arial,Helvetica,sans-serif" font-size="22"
        fill="rgba(255,255,255,0.65)">dulwich.org</text>
    </svg>`;

    const result = await sharp(bgBuffer)
      .composite([{ input: Buffer.from(svgOverlay), top: 0, left: 0 }])
      .jpeg({ quality: 90 })
      .toBuffer();

    fs.writeFileSync(cacheFile, result);
    console.log(`[og-cache] Generated: ${path.basename(cacheFile)}`);
  } catch (err) {
    console.error('[og-cache] Generation failed:', err.message);
  }
};

// ─── Serve pre-generated OG images from disk (instant) ───────────────────────
app.use('/og-cache', express.static(OG_CACHE_DIR, {
  maxAge: '24h',
  setHeaders: (res) => res.set('Access-Control-Allow-Origin', '*'),
}));

/**
 * /proxy-fetch — Proxy endpoint to fetch remote assets (like PDF/images)
 * specifically to bypass CORS when generating ZIP files on the frontend.
 */
app.get('/proxy-fetch', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send('URL is required');

  try {
    const targetUrl = new URL(url);
    
    // Safety: Only allow specific trusted domains
    const ALLOWED_PROXY_HOSTS = [
      ...ALLOWED_IMAGE_HOSTS,
      'dulwich.blob.core.chinacloudapi.cn',
      'dulwich-azure-prod.oss-cn-shanghai.aliyuncs.com',
      'cms.dulwich.org'
    ];

    if (!ALLOWED_PROXY_HOSTS.some(h => targetUrl.hostname.endsWith(h))) {
      return res.status(403).send('Domain not allowed for proxy');
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Target returned ${response.status}`);

    const contentType = response.headers.get('content-type');
    if (contentType) res.setHeader('Content-Type', contentType);
    
    // Add CORS headers so the frontend can read the blob
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Stream the body
    const arrayBuffer = await response.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  } catch (err) {
    console.error('[proxy-fetch] Error:', err.message);
    res.status(500).send('Failed to proxy request');
  }
});

// ─── /og-image-gen — on-demand generation (also checks disk cache) ───────────
app.get('/og-image-gen', async (req, res) => {
  const { title = 'Dulwich International Schools', bg } = req.query;

  if (bg) {
    let parsedBg;
    try { parsedBg = new URL(bg); } catch { return res.status(400).send('Invalid bg URL'); }
    if (!ALLOWED_IMAGE_HOSTS.some(h => parsedBg.hostname.endsWith(h)))
      return res.status(403).send('Domain not allowed');
  }

  const key       = getOgCacheKey(title, bg || '');
  const cacheFile = getOgCacheFile(key);

  // Serve from disk if already generated
  if (fs.existsSync(cacheFile)) {
    res.set({ 'Content-Type': 'image/jpeg', 'Cache-Control': 'public, max-age=86400', 'X-Cache': 'HIT' });
    return res.sendFile(cacheFile);
  }

  // Generate now (called directly, not from page HTML — e.g. manual URL test)
  await generateAndSaveOgImage(title, bg || '', cacheFile);

  if (fs.existsSync(cacheFile)) {
    res.set({ 'Content-Type': 'image/jpeg', 'Cache-Control': 'public, max-age=86400', 'X-Cache': 'MISS' });
    return res.sendFile(cacheFile);
  }

  res.status(500).send('Failed to generate OG image');
});

// ─── Meta tag injection ───────────────────────────────────────────────────────
const injectMetaTags = (html, { title, description, keywords, image, url }) => {
  html = html.replace(/<title>[^<]*<\/title>/gi, '');
  html = html.replace(/<meta\s[^>]*name=["']description["'][^>]*>/gi, '');
  html = html.replace(/<meta\s[^>]*name=["']keywords["'][^>]*>/gi, '');
  html = html.replace(/<meta\s[^>]*property=["']og:[^"']*["'][^>]*>/gi, '');
  html = html.replace(/<meta\s[^>]*name=["']twitter:[^"']*["'][^>]*>/gi, '');

  const tags = [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}">`,
    `<meta name="keywords" content="${keywords}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="Dulwich International Schools">`,
    `<meta property="og:locale" content="en_US">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:title" content="${title}">`,
    `<meta property="og:description" content="${description}">`,
    `<meta property="og:image" content="${image}">`,
    ...(image ? [`<meta property="og:image:secure_url" content="${image}">`] : []),
    `<meta property="og:image:alt" content="${title}">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta property="og:image:type" content="image/jpeg">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:site" content="@DulwichColleges">`,
    `<meta name="twitter:title" content="${title}">`,
    `<meta name="twitter:description" content="${description}">`,
    `<meta name="twitter:image" content="${image}">`,
    `<meta name="twitter:image:alt" content="${title}">`,
  ].join('\n    ');

  return html.replace('</head>', `    ${tags}\n  </head>`);
};

// ─── Serve static build ───────────────────────────────────────────────────────
app.use(express.static(BUILD_PATH, { index: false }));

// ─── Page handler — inject dynamic OG tags ───────────────────────────────────
app.get('*', async (req, res) => {
  const indexPath = path.join(BUILD_PATH, 'index.html');
  if (!fs.existsSync(indexPath))
    return res.status(503).send('App not built yet. Run: npm run build');

  let html = fs.readFileSync(indexPath, 'utf8');

  const ogUrl  = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  const { slug, locale } = getSlugFromPath(req.path);
  const school = getSchoolFromHostname(req.get('host') || '');
  const articleSlug = getArticleSlugFromPath(req.path);

  const { banner, meta } = articleSlug
    ? await fetchArticleData(articleSlug, locale, school)
    : school
      ? await fetchSchoolData(slug, school, locale)
      : await fetchPageData(slug, locale);

  // meta object has dedicated SEO fields; banner is fallback for title + image
  const rawTitle    = meta?.meta_title    || banner?.meta_title    || banner?.title || 'Dulwich International Schools';
  const title       = escapeHtml(rawTitle);
  const description = escapeHtml(meta?.meta_description || banner?.meta_description || 'Dulwich International Schools - World-class education across Asia.');
  const keywords    = escapeHtml(meta?.meta_keywords    || banner?.meta_keywords    || 'Dulwich, international school, education, Asia');

  // Image always comes from banner.header_image
  let rawImage        = banner?.header_image || '';
  const isPlaceholder = !rawImage || rawImage.includes('no-image.gif') || rawImage.includes('placeholders/no-image');

  if (!isPlaceholder) {
    if (rawImage.startsWith('//'))     rawImage = 'https:' + rawImage;
    else if (rawImage.startsWith('/')) rawImage = API_BASE + rawImage;
  }

  // Use header_image directly — simple, fast, no generation overhead.
  // WhatsApp will show title + description even if image is missing (like dulwich.org).
  const absoluteImage = isPlaceholder ? '' : rawImage;
  const image = absoluteImage ? escapeHtml(absoluteImage) : '';

  html = injectMetaTags(html, { title, description, keywords, image, url: ogUrl });
  res.send(html);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Dulwich server running on http://0.0.0.0:${PORT}`);
  console.log(`API base: ${API_BASE}`);
  console.log(`OG cache: ${OG_CACHE_DIR}`);
});