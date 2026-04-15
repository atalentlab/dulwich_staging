#!/usr/bin/env node

/**
 * Generate static sitemap.xml files for schools or group site
 *
 * This script fetches sitemap data from the CMS API and generates
 * static sitemap.xml files during build time.
 *
 * Usage:
 * - Group site (dulwich.org): npm run build:group
 * - School site: npm run build:beijing or npm run build:singapore
 *
 * Environment Variables:
 * - SCHOOL: School slug (beijing, singapore, shanghai-puxi, shanghai-pudong, suzhou, suzhou-high-school, hengqin-high-school, seoul, bangkok)
 * - DEPLOY_DOMAIN: (Optional) Override the deployment domain (default: https://{school}.dulwich.org)
 * - REACT_APP_SCHOOL: Alternative school slug variable
 *
 * Examples:
 * - npm run build:group                   # Build group site (dulwich.org)
 * - npm run build:beijing                 # Build Beijing site with sitemap
 * - npm run build:singapore               # Build Singapore site with sitemap
 * - SCHOOL=beijing npm run build          # Build Beijing with default domain
 * - SCHOOL=beijing DEPLOY_DOMAIN=https://beijing.dulwich-frontend.atalent.xyz npm run build  # Build Beijing with custom domain
 *
 * Sitemap APIs Used:
 * - Group: https://cms.dulwich.atalent.xyz/group/sitemap-{pages|news}.xml
 * - Schools: https://cms.dulwich.atalent.xyz/sitemap-{pages|news|people}.xml?subdomain={school}
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const axios = require('axios');

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://cms.dulwich.org';

// List of all school slugs
const schools = [
  'singapore',
  'shanghai-puxi',
  'shanghai-pudong',
  'suzhou',
  'suzhou-high-school',
  'hengqin-high-school',
  'beijing',
  'seoul',
  'bangkok'
];

// Helper function to fetch sitemap XML
const fetchSitemapXML = async (url) => {
  try {
    console.log(`📡 Fetching: ${url}`);
    const response = await axios.get(url, {
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    });
    return response.data;
  } catch (error) {
    console.error(`❌ Error fetching ${url}:`, error.message);
    return null;
  }
};

// Helper function to extract URLs from sitemap XML
const extractUrlsFromSitemap = (xmlContent, targetDomain) => {
  if (!xmlContent) return [];

  // Extract all <url> blocks from the XML
  const urlRegex = /<url>([\s\S]*?)<\/url>/g;
  const urls = [];
  let match;

  while ((match = urlRegex.exec(xmlContent)) !== null) {
    let urlBlock = match[1];

    // Replace any CMS domain URLs with the target domain
    if (targetDomain) {
      urlBlock = urlBlock.replace(
        /(https?:\/\/)[^\/]+/g,
        targetDomain
      );
    }

    urls.push(`  <url>${urlBlock}</url>`);
  }

  return urls;
};

// Generate sitemap for a school
const generateSchoolSitemap = async (schoolSlug, targetDomain) => {
  const sitemapTypes = ['pages', 'news', 'people'];
  const allUrls = [];

  for (const type of sitemapTypes) {
    const url = `${API_BASE_URL}/sitemap-${type}.xml?subdomain=${schoolSlug}`;
    const xmlContent = await fetchSitemapXML(url);

    if (xmlContent) {
      const urls = extractUrlsFromSitemap(xmlContent, targetDomain);
      allUrls.push(...urls);
      console.log(`  ✅ Found ${urls.length} URLs in sitemap-${type}.xml`);
    }
  }

  return allUrls;
};

// Generate sitemap for group site
const generateGroupSitemap = async (targetDomain) => {
  const sitemapTypes = ['pages', 'news'];
  const allUrls = [];

  for (const type of sitemapTypes) {
    const url = `${API_BASE_URL}/group/sitemap-${type}.xml`;
    const xmlContent = await fetchSitemapXML(url);

    if (xmlContent) {
      const urls = extractUrlsFromSitemap(xmlContent, targetDomain);
      allUrls.push(...urls);
      console.log(`  ✅ Found ${urls.length} URLs in group sitemap-${type}.xml`);
    }
  }

  return allUrls;
};

// Main function
const main = async () => {
  console.log('🚀 Generating static sitemap files...\n');

  const publicDir = path.join(__dirname, '..', 'public');

  // Ensure public directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Check if SCHOOL environment variable is set to generate school-specific sitemap
  // Also check for common school-related env vars used in different deployment platforms
  const schoolSlug = process.env.SCHOOL ||
                      process.env.REACT_APP_SCHOOL ||
                      process.env.NEXT_PUBLIC_SCHOOL ||
                      process.env.VITE_SCHOOL;

  if (schoolSlug) {
    // Generate school-specific sitemap
    console.log(`📄 Generating sitemap for school: ${schoolSlug}...\n`);

    // Use environment-specific domain or default to dulwich.org
    const deployDomain = process.env.DEPLOY_DOMAIN || `https://${schoolSlug}.dulwich.org`;
    const schoolUrls = await generateSchoolSitemap(schoolSlug, deployDomain);

    let schoolSitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    schoolSitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n';
    schoolUrls.forEach(url => {
      schoolSitemap += url + '\n';
    });
    schoolSitemap += '</urlset>';

    const sitemapPath = path.join(publicDir, 'sitemap.xml');
    fs.writeFileSync(sitemapPath, schoolSitemap);
    console.log(`\n✅ School sitemap for ${schoolSlug} saved to ${sitemapPath}`);
    console.log(`   Total URLs: ${schoolUrls.length}\n`);
  } else {
    // Generate group sitemap (for main dulwich.org site)
    console.log('📄 Generating group sitemap (no SCHOOL env variable set)...\n');
    const groupUrls = await generateGroupSitemap('https://www.dulwich.org');

    let groupSitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    groupSitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n';
    groupUrls.forEach(url => {
      groupSitemap += url + '\n';
    });
    groupSitemap += '</urlset>';

    const groupSitemapPath = path.join(publicDir, 'sitemap.xml');
    fs.writeFileSync(groupSitemapPath, groupSitemap);
    console.log(`\n✅ Group sitemap saved to ${groupSitemapPath}`);
    console.log(`   Total URLs: ${groupUrls.length}\n`);
  }

  console.log('✅ Sitemap generation complete!\n');
};

// Run the script
main().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
