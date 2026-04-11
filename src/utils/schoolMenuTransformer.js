/**
 * Transforms the dynamic menu API response into the format expected by School PageHeader
 *
 * School menu structure uses navItems with sections, cards, and school-specific filtering
 */

/**
 * Helper to create slug from title
 */
const createSlug = (title) => {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
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
 * Process a subsection (2nd level menu item) into sections format
 */
const processSubsection = (subsection) => {
  const sections = [];
  const childItems = subsection.items || [];

  // If subsection has child items, create a section for them
  if (childItems.length > 0) {
    sections.push({
      id: createSlug(subsection.title),
      heading: subsection.title.toUpperCase(),
      style: 'regular',
      links: childItems.map(child => ({
        title: child.title,
        url: child.url
      }))
    });
  }

  return sections;
};

/**
 * Transforms API menu data to School PageHeader navigation format
 */
export const transformToSchoolNav = (apiData) => {
  if (!apiData?.success || !Array.isArray(apiData?.data)) {
    return [];
  }

  return apiData.data.map((menuItem) => {
    const items = menuItem.items || [];
    const sections = [];
    const allCards = [];

    // Process each subsection (2nd level items)
    items.forEach(subsection => {
      const subsectionSections = processSubsection(subsection);
      sections.push(...subsectionSections);

      // Collect highlighted items from this subsection for cards
      const highlightedInSubsection = collectHighlightedItems(subsection.items || []);
      highlightedInSubsection.forEach(item => {
        allCards.push({
          id: createSlug(item.title),
          heading: item.title,
          url: item.url,
          image: item.highlight_menu?.image,
          description: item.highlight_menu?.description || '',
          weight: item.highlight_menu?.weight || 0
        });
      });
    });

    // Sort cards by weight
    allCards.sort((a, b) => a.weight - b.weight);

    return {
      id: createSlug(menuItem.title),
      label: menuItem.title,
      sections,
      cards: allCards,
      links: items.map(item => ({
        title: item.title,
        url: item.url
      }))
    };
  });
};

/**
 * Main transformer function for school menus
 */
export const transformSchoolMenuData = (apiData) => {
  return {
    navItems: transformToSchoolNav(apiData),
    topBar: {
      parentPortal: 'Parent Portal',
      schoolCalendar: 'School Calendar'
    },
    siteMapLabel: 'See Full Site Map',
    searchPlaceholder: 'Search',
    searchResultsTitle: 'Search Results',
    searchResultsClose: 'Close',
    buttons: {
      enquire: 'Enquire',
      applyNow: 'Apply Now'
    },
    mobile: {
      schools: 'Schools',
      fullSiteMap: 'Full Site Map',
      aiAssistant: 'AI ASSISTANT'
    }
  };
};
