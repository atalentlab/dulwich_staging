/**
 * Transforms the dynamic menu API response into the format expected by School PageHeader
 *
 * School menu structure uses navItems with sections, cards, and school-specific filtering
 */

/**
 * Helper to create slug from title
 * Handles both English and non-English characters
 */
const createSlug = (title) => {
    if (!title) return '';
    // For Chinese characters, use pinyin or just replace with dashes
    // Keep Chinese characters for now, just normalize spaces and special chars
    return title.toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with dashes
      .replace(/[^\w\u4e00-\u9fa5-]/g, '-')  // Keep alphanumeric, Chinese chars, and dashes
      .replace(/--+/g, '-')           // Replace multiple dashes with single dash
      .replace(/(^-|-$)/g, '');       // Remove leading/trailing dashes
  };
  
  /**
   * Recursively collect all highlighted items from nested menu structure
   */
  const collectHighlightedItems = (items) => {
    const highlighted = [];
  
    const traverse = (itemList) => {
      if (!Array.isArray(itemList)) return;
  
      itemList.forEach(item => {
        // Check if this item itself is highlighted
        if (item.highlight_menu) {
          highlighted.push(item);
        }
  
        // Recursively check child items
        if (item.items && item.items.length > 0) {
          traverse(item.items);
        }
      });
    };
  
    traverse(items);
    return highlighted;
  };
  
  /**
   * Get stable ID for subsections
   */
  const getStableSubsectionId = (subsection) => {
    // Try header_menu_title first
    if (subsection.header_menu_title) {
      return subsection.header_menu_title;
    }
  
    // Map known subsection IDs
    const idMapping = {
      1817: 'our-members',
      1818: 'life-at-dulwich',
      1820: 'highlighted',
      1815: 'holistic-education',
      795: 'core-curriculum'
    };
  
    if (subsection.id && idMapping[subsection.id]) {
      return idMapping[subsection.id];
    }
  
    // Fall back to slug from title
    return createSlug(subsection.title);
  };
  
  /**
   * Helper to clean and normalize URLs from API
   */
  const normalizeUrl = (url) => {
    if (!url || url === '#') return null;
    
    // Clean up escaped forward slashes
    let cleanUrl = url.replace(/\\\//g, '/');
    
    // If it's an absolute URL pointing to a dulwich-frontend domain, 
    // we might want to keep it as is or make it relative depending on use case.
    // For now, just ensuring it's a clean string.
    return cleanUrl;
  };
  
  /**
   * Process a subsection (2nd level menu item) into sections format
   */
  const processSubsection = (subsection) => {
    const sections = [];
    const childItems = subsection.items || [];
  
    if (childItems.length === 0) {
      return sections;
    }
  
    // Separate highlighted and regular items
    const highlightedItems = childItems.filter(child => child.highlight_menu);
    const regularItems = childItems.filter(child => !child.highlight_menu);
  
    // Create regular section FIRST if there are regular items
    if (regularItems.length > 0) {
      sections.push({
        id: getStableSubsectionId(subsection),
        heading: subsection.title,
        style: 'regular',
        url: normalizeUrl(subsection.url),
        links: regularItems.map(child => ({
          title: child.title,
          header_menu_title: child.header_menu_title,
          url: normalizeUrl(child.url)
        }))
      });
    }
  
    // Create highlighted section LAST if there are highlighted items
    if (highlightedItems.length > 0) {
      sections.push({
        id: 'highlighted',
        heading: 'HIGHLIGHTED',
        style: 'highlighted',
        url: normalizeUrl(subsection.url),
        links: highlightedItems.map(child => ({
          title: child.title,
          header_menu_title: child.header_menu_title,
          url: normalizeUrl(child.url),
          image: child.highlight_menu?.image,
          imageUrl: child.highlight_menu?.image,
          description: child.highlight_menu?.description,
          buttonText: child.highlight_menu?.button_text || child.highlight_menu?.title || child.title,
          isHighlighted: true
        }))
      });
    }
  
    return sections;
  };
  
  /**
   * Map API menu IDs or positions to consistent English IDs
   * This ensures menu items have stable IDs across different languages
   */
  const getStableMenuId = (menuItem, index) => {
    // Try to use header_menu_title if available
    if (menuItem.header_menu_title) {
      return menuItem.header_menu_title;
    }
  
    // Map by API ID if it matches known IDs
    const idMapping = {
      60: 'why-dulwich',
      795: 'learning',
      796: 'community',
      797: 'admissions'
    };
  
    if (menuItem.id && idMapping[menuItem.id]) {
      return idMapping[menuItem.id];
    }
  
    // Fall back to position-based mapping (0=why, 1=learning, 2=community, 3=admissions)
    const positionMapping = ['why-dulwich', 'learning', 'community', 'admissions'];
    if (index < positionMapping.length) {
      return positionMapping[index];
    }
  
    // Last resort: use slug from title
    return createSlug(menuItem.title);
  };
  
  /**
   * Transforms API menu data to School PageHeader navigation format
   */
  export const transformToSchoolNav = (apiData) => {
    if (!apiData?.success || !Array.isArray(apiData?.data)) {
      return [];
    }
  
    return apiData.data.map((menuItem, index) => {
      const items = menuItem.items || [];
      const sections = [];
      const allCards = [];
      const allHighlightedLinks = [];
  
      // Process each subsection (2nd level items)
      items.forEach(subsection => {
        const subsectionSections = processSubsection(subsection);
  
        // Separate regular and highlighted sections
        subsectionSections.forEach(sec => {
          if (sec.style === 'highlighted') {
            // Collect highlighted links instead of adding section
            allHighlightedLinks.push(...sec.links);
          } else {
            // Add regular sections
            sections.push(sec);
          }
        });
  
        // Collect highlighted items from this subsection for cards
        const highlightedInSubsection = collectHighlightedItems(subsection.items || []);
        highlightedInSubsection.forEach(item => {
          allCards.push({
            id: item.menu_name || createSlug(item.title),
            heading: item.title,
            url: item.url,
            image: item.highlight_menu?.image,
            description: item.highlight_menu?.description || '',
            weight: item.highlight_menu?.weight || 0
          });
        });
      });
  
      // Add ONE highlighted section at the end with all collected highlighted links
      if (allHighlightedLinks.length > 0) {
        sections.push({
          id: 'highlighted',
          heading: 'HIGHLIGHTED',
          style: 'highlighted',
          links: allHighlightedLinks
        });
      }
  
      // Sort cards by weight - items with null weight go last
      allCards.sort((a, b) => {
        const weightA = a.weight;
        const weightB = b.weight;

        // If both are null, maintain original order
        if (weightA === null && weightB === null) return 0;
        // If only A is null, it goes last
        if (weightA === null) return 1;
        // If only B is null, it goes last
        if (weightB === null) return -1;
        // Both have values, sort normally
        return weightA - weightB;
      });
  
      // Build subsectionLinks: flatten all 3rd-level child items
      // from every 2nd-level subsection so the left column shows real navigable links
      // Include both highlighted and non-highlighted items
      const subsectionLinks = [];
      items.forEach(subsection => {
        console.log('[transformer] subsection:', subsection.title, 'items:', subsection.items?.length, subsection.items?.map(c => ({title: c.title, highlight_menu: !!c.highlight_menu})));
        const childItems = subsection.items || [];
        if (childItems.length > 0) {
          // Use the child items (3rd level) as the actual links
          childItems.forEach(child => {
            subsectionLinks.push({
              id: child.id || createSlug(child.title),
              title: child.title,
              header_menu_title: child.header_menu_title,
              url: child.url && child.url !== '#' ? child.url : null,
            });
          });
        } else if (subsection.url && subsection.url !== '#') {
          // Fallback: if no children, use the subsection itself as a link
          subsectionLinks.push({
            id: getStableSubsectionId(subsection),
            title: subsection.title,
            url: subsection.url,
          });
        }
      });
      console.log('[transformer] menuItem:', menuItem.title, 'subsectionLinks:', subsectionLinks);
  
  
      return {
        id: getStableMenuId(menuItem, index),
        label: menuItem.title,
        url: normalizeUrl(menuItem.url),
        sections,
        subsectionLinks,
        cards: allCards,
        links: items.map(item => ({
          title: item.title,
          url: normalizeUrl(item.url)
        }))
      };
    });
  };
  
  /**
   * Main transformer function for school menus
   * @param {Object} apiData - The API response data
   * @param {string} locale - The current locale ('en' or 'zh')
   */
  export const transformSchoolMenuData = (apiData, locale = 'en') => {
    const isZh = locale === 'zh';
  
    return {
      navItems: transformToSchoolNav(apiData),
      topBar: {
        parentPortal: isZh ? '家长门户' : 'Parent Portal',
        schoolCalendar: isZh ? '学校日历' : 'School Calendar'
      },
      siteMapLabel: isZh ? '查看完整网站地图' : 'See Full Site Map',
      searchPlaceholder: isZh ? '搜索' : 'Search',
      searchResultsTitle: isZh ? '搜索结果' : 'Search Results',
      searchResultsClose: isZh ? '关闭' : 'Close',
      buttons: {
        enquire: isZh ? '咨询' : 'Enquire',
        applyNow: isZh ? '立即申请' : 'Apply Now'
      },
      mobile: {
        schools: isZh ? '学校' : 'Schools',
        fullSiteMap: isZh ? '完整网站地图' : 'Full Site Map',
        aiAssistant: isZh ? '人工智能助手' : 'AI ASSISTANT'
      }
    };
  };
  