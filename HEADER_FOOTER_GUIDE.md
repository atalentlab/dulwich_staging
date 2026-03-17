# Dynamic Header/Footer System

## Overview
The app now automatically switches between **International** and **School-specific** headers/footers based on the current URL/subdomain.

## How It Works

### 1. **International Site** (No Subdomain)
- **URL**: `http://localhost:3000/` or `http://dulwich.loc:3000/`
- **Header**: Uses `src/components/layout/PageHeader.js`
- **Footer**: No footer (International site doesn't have one)
- **Rendered by**: `PageRenderer.js`

### 2. **School-Specific Sites** (With Subdomain)
- **URL Examples**:
  - `http://beijing.localhost:3000/`
  - `http://shanghai.dulwich.loc:3000/`
- **Header**: Uses `src/components/layout/school/PageHeader.js`
- **Footer**: Uses `src/components/layout/school/PageFooter.js`
- **Rendered by**: `SchoolPageRenderer.js`

## School Detection

The system uses `src/utils/schoolDetection.js` to automatically detect which school site you're on:

```javascript
import { getCurrentSchool, isSchoolSite } from '../utils/schoolDetection';

const currentSchool = getCurrentSchool(); // Returns "beijing", "shanghai", etc., or null
const isSchool = isSchoolSite(); // Returns true if on a school site
```

### Supported Schools
- beijing
- shanghai
- suzhou
- seoul
- singapore
- yangon
- zhuhai
- haikou
- tokyo
- hongkong
- london
- pudong
- puxi

## School Selection Flow

### When User Selects a School:

1. **In the Dropdown**:
   - User clicks on "Dulwich College Beijing"

2. **What Happens**:
   - `handleSchoolSelect()` is triggered
   - School slug is saved to `localStorage`
   - Page redirects to `beijing.localhost:3000` (or the appropriate subdomain)

3. **On New Page Load**:
   - System detects subdomain = "beijing"
   - Loads **School-specific Header** (`src/components/layout/school/PageHeader.js`)
   - Loads **School-specific Footer** (`src/components/layout/school/PageFooter.js`)
   - Selected school shows with ✓ checkmark

4. **School Name Display**:
   - Selected school is shown in the header dropdown
   - Appears as "Dulwich College Beijing" (with checkmark)

## File Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── PageHeader.js          # International header
│   │   ├── PageFooter.js          # International footer (not used)
│   │   └── school/
│   │       ├── PageHeader.js      # School-specific header
│   │       └── PageFooter.js      # School-specific footer
│   ├── PageRenderer.js            # Renders International pages
│   ├── school/
│   │   └── SchoolPageRenderer.js  # Renders School-specific pages
│   └── DynamicPageRenderer.js     # Routes between the two
└── utils/
    └── schoolDetection.js         # School detection utility
```

## Testing

### Test International Site:
1. Navigate to `http://localhost:3000/`
2. Should see International header
3. No footer

### Test Beijing School:
1. Navigate to `http://beijing.localhost:3000/`
   - *Note: You may need to add `127.0.0.1 beijing.localhost` to your `/etc/hosts` file*
2. Should see School-specific header
3. Should see School-specific footer
4. "Dulwich College Beijing" should be selected with ✓

### Test School Switching:
1. Start on International site
2. Click school dropdown
3. Select "Dulwich College Beijing"
4. Should redirect to `beijing.localhost:3000`
5. Header/footer should change to school-specific versions

## Troubleshooting

### School not detecting:
- Check your `/etc/hosts` file has the subdomain mapped
- Verify the school slug matches one in `schoolDetection.js`

### Wrong header/footer showing:
- Check browser console for detection logs
- Verify `DynamicPageRenderer` is being used in App.js routes

### Dropdown not working:
- Check that `availableSchools` is being fetched from API
- Verify `handleSchoolSelect()` is properly redirecting

## LocalStorage

The app stores:
- `selectedSchoolSlug`: The current school's slug (e.g., "beijing")
- `selectedSchoolName`: The full school name (e.g., "Dulwich College Beijing")

These are used as fallback when URL detection isn't available.
