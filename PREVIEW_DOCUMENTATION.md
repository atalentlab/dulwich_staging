# Preview Page Documentation

## Overview
The Preview Page feature allows CMS users to preview unpublished pages before they go live. It supports both Group pages and School pages.

---

## URL Formats

### **Group Preview**

#### Path Parameter Format (Recommended):
```
https://www.dulwich.org/preview/page/mkjrrn5lf51775126879
https://www.dulwich.org/preview/page/mkjrrn5lf51775126879?locale=zh
```

#### Query Parameter Format:
```
https://www.dulwich.org/preview/page?slug=mkjrrn5lf51775126879
https://www.dulwich.org/preview/page?slug=mkjrrn5lf51775126879&locale=zh
```

**API Endpoint:**
```
GET /api/preview/page?slug=mkjrrn5lf51775126879
GET /api/preview/page?slug=mkjrrn5lf51775126879&locale=zh
```

---

### **School Preview**

#### Path Parameter Format (Recommended):
```
https://beijing.dulwich.org/preview/page/ldx500q2s11775127037?school=beijing-cms
https://beijing.dulwich.org/preview/page/ldx500q2s11775127037?school=beijing-cms&locale=zh
```

#### Query Parameter Format:
```
https://beijing.dulwich.org/preview/page?slug=ldx500q2s11775127037&school=beijing-cms
https://beijing.dulwich.org/preview/page?slug=ldx500q2s11775127037&school=beijing-cms&locale=zh
```

**API Endpoint:**
```
GET /api/school/preview/page?slug=ldx500q2s11775127037&school=beijing-cms
GET /api/school/preview/page?slug=ldx500q2s11775127037&school=beijing-cms&locale=zh
```

---

## Parameters

### Required Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `slug` | string | Preview slug (unique identifier) | `mkjrrn5lf51775126879` |
| `school` | string | School identifier (required for school previews only) | `beijing-cms` |

### Optional Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `locale` | string | Language/locale code | `zh`, `en` |

---

## API Service Functions

### Group Preview API
**File:** `/src/api/pageService.js`

```javascript
fetchPreviewPage(slug, locale)
```

**Parameters:**
- `slug` (required): Preview slug
- `locale` (optional): Language code

**Returns:** Promise with page data including:
- `banner`: Banner/hero section data
- `meta`: SEO metadata
- `blocks`: Array of content blocks
- `header`: Header configuration (static)
- `footer`: Footer configuration (static)

---

### School Preview API
**File:** `/src/api/schoolPageService.js`

```javascript
fetchSchoolPreviewPage(slug, school, locale)
```

**Parameters:**
- `slug` (required): Preview slug
- `school` (required): School identifier (e.g., `beijing-cms`)
- `locale` (optional): Language code

**Returns:** Promise with page data including:
- `banner`: Banner/hero section data
- `meta`: SEO metadata
- `blocks`: Array of content blocks
- `header`: School-specific header configuration
- `footer`: School-specific footer configuration
- `school`: School information

---

## Component Structure

### PreviewPage Component
**File:** `/src/pages/PreviewPage.js`

**Features:**
- Automatically detects Group vs School preview based on `school` parameter
- Supports multiple URL formats (path and query parameters)
- Shows yellow "PREVIEW MODE" banner at the top
- Handles all page layout types:
  - Standard layout
  - Parallax scroll layout
  - ScrollSpy layout
- Displays loading state while fetching data
- Shows error messages if preview fails

**Logic Flow:**
```
1. Extract slug from URL (path param or query param)
2. Check if 'school' parameter exists
3. If school exists → School Preview, else → Group Preview
4. Fetch preview data from appropriate API
5. Detect layout type from banner.page_layout_type
6. Render with appropriate layout and components
```

---

## Layout Support

The preview page supports all three layout types:

### 1. Standard Layout (default)
```
Preview Banner
↓
Header
↓
Banner Block
↓
Content Blocks
↓
Footer
```

### 2. Parallax Scroll Layout
```
Preview Banner
↓
Header
↓
Parallax Layout (banner + blocks)
↓
Footer
```

### 3. ScrollSpy Layout
```
Preview Banner
↓
ScrollSpy Page (integrated navigation)
```

---

## Usage Examples

### Example 1: Group Page Preview (English)
```
URL: https://www.dulwich.org/preview/page/mkjrrn5lf51775126879
API: GET /api/preview/page?slug=mkjrrn5lf51775126879
```

### Example 2: Group Page Preview (Chinese)
```
URL: https://www.dulwich.org/preview/page/mkjrrn5lf51775126879?locale=zh
API: GET /api/preview/page?slug=mkjrrn5lf51775126879&locale=zh
```

### Example 3: School Page Preview (Beijing - English)
```
URL: https://beijing.dulwich.org/preview/page/ldx500q2s11775127037?school=beijing-cms
API: GET /api/school/preview/page?slug=ldx500q2s11775127037&school=beijing-cms
```

### Example 4: School Page Preview (Beijing - Chinese)
```
URL: https://beijing.dulwich.org/preview/page/ldx500q2s11775127037?school=beijing-cms&locale=zh
API: GET /api/school/preview/page?slug=ldx500q2s11775127037&school=beijing-cms&locale=zh
```

---

## Files Modified/Created

### Created Files:
1. `/src/pages/PreviewPage.js` - Main preview page component

### Modified Files:
1. `/src/api/pageService.js` - Added `fetchPreviewPage()` function
2. `/src/api/schoolPageService.js` - Added `fetchSchoolPreviewPage()` function
3. `/src/App.js` - Added preview routes

### Routes Added:
```javascript
<Route path="/preview/page/:slug" element={<PreviewPage />} />
<Route path="/preview/page" element={<PreviewPage />} />
```

---

## Preview Indicator

A yellow banner is shown at the top of all preview pages with high z-index (9999) to clearly indicate preview mode:

```
🔍 PREVIEW MODE - Group Page
🔍 PREVIEW MODE - School Page
🔍 PREVIEW MODE - Group Page (Parallax)
🔍 PREVIEW MODE - School Page (ScrollSpy)
```

---

## Error Handling

The preview page includes comprehensive error handling:

1. **Missing slug**: Shows error message requesting slug parameter
2. **API errors**: Displays friendly error message with details
3. **Loading state**: Shows loading spinner while fetching data
4. **No data**: Shows "No Preview Data" message

---

## Testing

### Test Group Preview:
```bash
# Local
http://localhost:3000/preview/page/mkjrrn5lf51775126879

# With locale
http://localhost:3000/preview/page/mkjrrn5lf51775126879?locale=zh
```

### Test School Preview:
```bash
# Local
http://localhost:3000/preview/page/ldx500q2s11775127037?school=beijing-cms

# With locale
http://localhost:3000/preview/page/ldx500q2s11775127037?school=beijing-cms&locale=zh
```

---

## Notes

- Preview slugs are unique identifiers generated by the CMS
- The `school` parameter must match the school's CMS identifier (usually `{school-name}-cms`)
- Preview pages use the same layout components as published pages
- SEO metadata is rendered but typically blocked from indexing via meta tags
- The preview indicator banner is sticky and always visible at the top
