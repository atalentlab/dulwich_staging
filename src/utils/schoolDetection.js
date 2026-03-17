/**
 * School Detection Utility
 * Detects school from hostname (subdomain)
 *
 * Examples:
 * - beijing.dulwich.loc:3000 → school: "beijing"
 * - shanghai.dulwich.loc:3000 → school: "shanghai"
 * - singapore.atalent.xyz → school: "singapore" (new format)
 * - www.singapore.dulwich-frontend.atalent.xyz → school: "singapore" (old format)
 * - www.atalent.xyz → school: null (main site)
 */

/**
 * Extracts school identifier from hostname
 * @param {string} hostname - The current hostname
 * @returns {string|null} - School identifier or null if main site
 */
export const getSchoolFromHostname = (hostname) => {
  // Remove port number if present
  const cleanHostname = hostname.split(':')[0];

  // Split hostname by dots
  const parts = cleanHostname.split('.');

  // Valid school subdomains - all Dulwich schools
  const validSchools = [
    'bangkok',
    'beijing',
    'seoul',
    'shanghai-pudong',
    'shanghai-puxi',
    'singapore',
    'suzhou',
    'hengqin-high-school',
    'suzhou-high-school',
    'international',
    // Legacy single-word slugs (for backward compatibility)
    'shanghai',
    'yangon',
    'zhuhai',
    'haikou',
    'tokyo',
    'hongkong',
    'london',
    'pudong',
    'puxi'
  ];

  // Pattern 1: Old format - www.singapore.dulwich-frontend.atalent.xyz
  // parts = ['www', 'singapore', 'dulwich-frontend', 'atalent', 'xyz']
  // School is in parts[1]
  if (parts.length >= 4 && parts[0] === 'www' && parts[2].includes('dulwich')) {
    const schoolSlug = parts[1].toLowerCase();
    if (validSchools.includes(schoolSlug)) {
      return schoolSlug;
    }
  }

  // Pattern 2: New format - singapore.atalent.xyz
  // parts = ['singapore', 'atalent', 'xyz']
  // School is in parts[0]
  if (parts.length === 3 && parts[1] === 'atalent') {
    const schoolSlug = parts[0].toLowerCase();
    if (validSchools.includes(schoolSlug)) {
      return schoolSlug;
    }
  }

  // Pattern 3: Development - school.localhost
  if (hostname.endsWith('localhost')) {
    const subdomain = parts[0].toLowerCase();
    if (validSchools.includes(subdomain)) {
      return subdomain;
    }
  }

  // Pattern 4: Generic subdomain pattern - school.domain.com
  if (parts.length >= 3) {
    const subdomain = parts[0].toLowerCase();
    if (validSchools.includes(subdomain)) {
      return subdomain;
    }
  }

  // No school found (main site)
  return null;
};

/**
 * Determines if current site is a school site or main site
 * @returns {boolean} - True if school site, false if main site
 */
export const isSchoolSite = () => {
  const school = getSchoolFromHostname(window.location.hostname);
  return school !== null;
};

/**
 * Gets the current school identifier
 * @returns {string|null} - School identifier or null
 */
export const getCurrentSchool = () => {
  return getSchoolFromHostname(window.location.hostname);
};

/**
 * Gets the base domain without school subdomain
 * @returns {string} - Base domain (main site URL)
 *
 * Examples:
 * - www.singapore.dulwich-frontend.atalent.xyz → www.atalent.xyz
 * - singapore.atalent.xyz → www.atalent.xyz
 * - beijing.localhost → localhost
 */
export const getBaseDomain = () => {
  const hostname = window.location.hostname.split(':')[0];
  const parts = hostname.split('.');

  // Special handling for localhost
  if (hostname.endsWith('localhost')) {
    return 'localhost';
  }

  // Old format: www.singapore.dulwich-frontend.atalent.xyz
  // Remove school part, keep www.atalent.xyz
  if (parts.length >= 4 && parts[0] === 'www' && parts[2].includes('dulwich')) {
    // Return www.atalent.xyz (skip the school and dulwich-frontend parts)
    return `www.${parts.slice(-2).join('.')}`;
  }

  // New format: singapore.atalent.xyz
  // Return www.atalent.xyz (add www, keep atalent.xyz)
  if (parts.length === 3 && parts[1] === 'atalent') {
    return `www.${parts.slice(-2).join('.')}`;
  }

  // Fallback: return last two parts
  if (parts.length >= 2) {
    return parts.slice(-2).join('.');
  }

  return hostname;
};

/**
 * Builds URL for a specific school
 * @param {string} school - School identifier
 * @param {string} path - URL path (optional)
 * @returns {string} - Full URL
 *
 * Maintains the same domain format as current URL:
 * - If on old format: www.singapore.dulwich-frontend.atalent.xyz
 *   → Returns: www.beijing.dulwich-frontend.atalent.xyz
 * - If on new format: singapore.atalent.xyz
 *   → Returns: beijing.atalent.xyz
 */
export const getSchoolUrl = (school, path = '') => {
  const protocol = window.location.protocol;
  const port = window.location.port ? `:${window.location.port}` : '';
  const hostname = window.location.hostname.split(':')[0];
  const parts = hostname.split('.');

  // Old format: www.singapore.dulwich-frontend.atalent.xyz
  // Build: www.{school}.dulwich-frontend.atalent.xyz
  if (parts.length >= 4 && parts[0] === 'www' && parts[2].includes('dulwich')) {
    const baseDomain = parts.slice(-2).join('.'); // atalent.xyz
    return `${protocol}//www.${school}.dulwich-frontend.${baseDomain}${port}${path}`;
  }

  // New format: singapore.atalent.xyz or localhost
  // Build: {school}.atalent.xyz
  const baseDomain = getBaseDomain();

  // For atalent.xyz domains, don't include 'www' prefix for schools
  if (baseDomain.startsWith('www.atalent')) {
    const cleanBase = baseDomain.replace('www.', '');
    return `${protocol}//${school}.${cleanBase}${port}${path}`;
  }

  return `${protocol}//${school}.${baseDomain}${port}${path}`;
};
