#!/usr/bin/env node

/**
 * Generate static sitemap.xml files for all school subdomains
 * This script fetches sitemap data from the CMS API and generates
 * static sitemap.xml files for each school during build time.
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
    const url = `${API_BASE_URL}/sitemap-${type}.xml?subdomain=${schoolSlug}-cms`;
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

  // Generate group sitemap (placeholder - will be replaced by server.js in production)
  console.log('📄 Generating group sitemap (placeholder)...');
  const groupUrls = await generateGroupSitemap('https://www.dulwich.org');

  let groupSitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  groupSitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n';
  groupUrls.forEach(url => {
    groupSitemap += url + '\n';
  });
  groupSitemap += '</urlset>';

  const groupSitemapPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(groupSitemapPath, groupSitemap);
  console.log(`✅ Group sitemap saved to ${groupSitemapPath}\n`);

  console.log('✅ Sitemap generation complete!\n');
};

// Run the script
main().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
