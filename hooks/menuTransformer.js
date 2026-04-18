/**
 * Transforms the dynamic menu API response into the format expected by PageHeader
 *
 * API Structure:
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": 19,
 *       "title": "About",
 *       "url": "#",
 *       "items": [
 *         {
 *           "id": 1139,
 *           "title": "Our Origins",
 *           "url": "https://www.dulwich.org/about-dulwich/our-origins",
 *           "highlight_menu": null
 *         },
 *         {
 *           "id": 1332,
 *           "title": "Live Worldwise",
 *           "url": "https://www.dulwich.org/about-dulwich/live-worldwise",
 *           "highlight_menu": {
 *             "description": "We nurture students...",
 *             "image": "https://dulwich.blob.core.chinacloudapi.cn/...",
 *             "weight": 1
 *           }
 *         }
 *       ]
 *     }
 *   ]
 * }
 */

// Mapping of menu item IDs or titles to image keys used in PageHeader
const getImageKeyFromMenuItem = (item) => {
    const title = item.title?.toLowerCase() || '';
    const description = item.highlight_menu?.description?.toLowerCase() || '';
  
    // Map based on title keywords
    if (title.includes('experiential learning') || description.includes('experiential')) return 'el';
    if (title.includes('live worldwise') || title.includes('worldwise')) return 'live';
    if (title.includes('matriculation') || title.includes('university')) return 'matric';
    if (title.includes('student leadership') || title.includes('leadership')) return 'sle';
    if (title.includes('wellbeing') || title.includes('well-being')) return 'wellbeing';
    if (title.includes('worldwide') || title.includes('global')) return 'wan';
    if (title.includes('we are dulwich')) return 'we';
    if (title.includes('excellence') || title.includes('excel')) return 'excel';
    if (title.includes('university') || title.includes('higher education')) return 'uni';
    if (title.includes('curriculum') || title.includes('academic')) return 'curriculum';
    if (title.includes('co-curricular') || title.includes('cocurricular')) return 'co-curricular';
  
    return 'curriculum'; // default fallback
  };
  
  /**
   * Recursively collect all highlighted items from nested menu structure
   */
  const collectAllHighlights = (itemList) => {
    const results = [];
    if (!Array.isArray(itemList)) return results;
    itemList.forEach(item => {
      if (item.highlight_menu) {
        results.push(item);
      }
      if (item.items && item.items.length > 0) {
        results.push(...collectAllHighlights(item.items));
      }
    });
    return results;
  };
  
  /**
   * Transforms API menu data to PageHeader desktop navigation format.
   * - subsectionLinks: 2nd-level items (title + url) shown as left column list
   * - cards: highlight items from ANY nesting level, sorted by weight
   * - links: direct non-highlighted children (fallback / flat menus)
   */
  export const transformToDesktopNav = (apiData) => {
    if (!apiData?.success || !Array.isArray(apiData?.data)) {
      return [];
    }
  
    return apiData.data.map((menuItem) => {
      const items = menuItem.items || [];
  
      // 2nd-level items that are NOT themselves highlighted → subsection titles
      const subsectionLinks = items
        .filter(item => !item.highlight_menu)
        .map(item => ({
          id: item.id,
          title: item.title,
          url: item.url && item.url !== '#' ? item.url : null,
        }));
  
      // Collect ALL highlighted items recursively (level 2, 3, ...)
      const allHighlights = collectAllHighlights(items);
  
      // Sort by weight
      allHighlights.sort((a, b) => (a.highlight_menu?.weight || 0) - (b.highlight_menu?.weight || 0));
  
      // Flat links: only used when there are NO subsections (simple menus)
      const directHighlights = items.filter(item => item.highlight_menu);
      const directRegular = items.filter(item => !item.highlight_menu);
  
      return {
        id: menuItem.id,
        label: menuItem.title,
        subsectionLinks,
        links: directRegular.map(item => ({ title: item.title, url: item.url })),
        cards: allHighlights.map(item => ({
          heading: item.title,
          url: item.url,
          imageKey: getImageKeyFromMenuItem(item),
          imageUrl: item.highlight_menu?.image,
          imageAlt: item.title,
          description: item.highlight_menu?.description || '',
          buttonText: 'Learn More'
        }))
      };
    });
  };
  
  /**
   * Transforms API menu data to PageHeader mobile navigation format
   */
  export const transformToMobileNav = (apiData) => {
    if (!apiData?.success || !Array.isArray(apiData?.data)) {
      return [];
    }
  
    return apiData.data.map((menuItem) => {
      const items = menuItem.items || [];
  
      // Separate highlighted items from regular links
      const highlightedItems = items.filter(item => item.highlight_menu);
      const regularItems = items.filter(item => !item.highlight_menu);
  
      // Sort highlighted items by weight
      const sortedHighlightedItems = highlightedItems.sort((a, b) => {
        const weightA = a.highlight_menu?.weight || 0;
        const weightB = b.highlight_menu?.weight || 0;
        return weightA - weightB;
      });
  
      // Determine navigation type
      const type = highlightedItems.length > 0 ? 'complex' : 'simple';
  
      if (type === 'simple') {
        return {
          id: menuItem.id,
          label: menuItem.title,
          type: 'simple',
          borderFull: true,
          links: regularItems.map(item => ({
            title: item.title,
            url: item.url
          }))
        };
      } else {
        // Complex navigation with sections
        const sections = [];
  
        // Add highlighted section if there are highlighted items
        if (sortedHighlightedItems.length > 0) {
          sections.push({
            heading: 'HIGHLIGHTED',
            style: 'highlighted',
            links: sortedHighlightedItems.map(item => ({
              title: item.title,
              url: item.url,
              image: getImageKeyFromMenuItem(item),
              imageUrl: item.highlight_menu?.image // Add actual image URL from API
            }))
          });
        }
  
        // Add regular links section if there are regular items
        if (regularItems.length > 0) {
          sections.push({
            heading: menuItem.title.toUpperCase(),
            style: 'regular',
            links: regularItems.map(item => ({
              title: item.title,
              url: item.url
            }))
          });
        }
  
        return {
          id: menuItem.id,
          label: menuItem.title,
          type: 'complex',
          borderFull: true,
          sections
        };
      }
    });
  };
  
  /**
   * Main transformer function that creates the complete navigation object
   */
  export const transformMenuData = (apiData) => {
    return {
      desktopNav: transformToDesktopNav(apiData),
      mobileNav: transformToMobileNav(apiData),
      topBar: {
        admissions: {
          label: 'Admissions',
          url: 'https://www.dulwich.org/admissions'
        },
        careers: {
          label: 'Careers',
          url: 'https://www.dulwich.org/working-at-dulwich'
        }
      },
      mobileExtraLinks: [
        {
          label: 'Full Site Map',
          href: '/sitemap',
          icon: 'Icon-Schools'
        },
        {
          label: 'Schools',
          href: '#',
          icon: 'Icon-Menu'
        }
      ],
      siteMapLabel: 'Site Map',
      searchResultsTitle: 'Search Results',
      searchResultsClose: 'Close'
    };
  };
  