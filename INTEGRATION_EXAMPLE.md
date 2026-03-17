# Integration Example

## Quick Start - Using HomePage

### Option 1: Standalone Route

Add HomePage to your existing App.js routing:

```javascript
// src/App.js
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
// ... your other imports

function App() {
  return (
    <Routes>
      {/* New dynamic blocks page */}
      <Route path="/dynamic" element={<HomePage />} />

      {/* Your existing routes */}
      <Route path="/" element={<YourExistingHomePage />} />
      {/* ... other routes */}
    </Routes>
  );
}

export default App;
```

Now visit `http://localhost:3000/dynamic` to see the dynamic blocks in action!

---

### Option 2: Replace Existing Homepage

```javascript
// src/App.js
import HomePage from './pages/HomePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* ... other routes */}
    </Routes>
  );
}
```

---

### Option 3: Test in Isolation (Quickest)

Create a new test file:

```javascript
// src/TestPage.js
import React from 'react';
import HomePage from './pages/HomePage';

function TestPage() {
  return (
    <div>
      <div style={{ background: '#ffeb3b', padding: '10px', textAlign: 'center' }}>
        <strong>🧪 Testing Dynamic Blocks Architecture</strong>
      </div>
      <HomePage />
    </div>
  );
}

export default TestPage;
```

Then add route:
```javascript
// src/App.js
import TestPage from './TestPage';

<Route path="/test" element={<TestPage />} />
```

Visit: `http://localhost:3000/test`

---

## Integration with Existing Components

### Using Existing Header/Footer

If you want to use your existing `Header.js` and `Footer.js` components instead of the new layout components:

```javascript
// src/pages/HomePage.js
import React from 'react';
import usePageData from '../hooks/usePageData';
import Header from '../components/Header';  // Your existing header
import Footer from '../components/Footer';  // Your existing footer
import BlockRenderer from '../components/blocks/BlockRenderer';
import Loading from '../components/common/Loading';

const HomePage = () => {
  const { pageData, loading, error } = usePageData('home', true);

  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;
  if (!pageData) return null;

  const { header, blocks, footer } = pageData;

  return (
    <div>
      {/* Use your existing Header with its props */}
      <Header
        selectedSchool={header.selectedSchool}
        availableSchools={header.availableSchools}
        // ... map API data to your existing Header props
      />

      {/* Dynamic blocks */}
      <main>
        <BlockRenderer blocks={blocks} />
      </main>

      {/* Use your existing Footer with its props */}
      <Footer
        availableSchools={footer.availableSchools}
        // ... map API data to your existing Footer props
      />
    </div>
  );
};

export default HomePage;
```

---

## Environment Configuration

### Development (Mock Data)

```javascript
// src/pages/HomePage.js
const { pageData, loading, error } = usePageData('home', true); // ← true = mock data
```

### Production (Real API)

1. Create `.env` file in project root:

```bash
# .env
REACT_APP_API_URL=https://your-api.com/api/v1
```

2. Update HomePage:

```javascript
// src/pages/HomePage.js
const { pageData, loading, error } = usePageData('home', false); // ← false = real API
```

3. Restart dev server (required for .env changes)

---

## Testing the Implementation

### 1. Start the Dev Server

```bash
npm start
```

### 2. Check the Console

You should see:
- No errors
- Mock API call simulated (800ms delay)
- Blocks rendering successfully

### 3. Visual Verification

You should see:
- ✅ Header with navigation
- ✅ Banner block (hero section)
- ✅ Triptych block (3 columns)
- ✅ Articles block (news grid)
- ✅ Schools block (school cards)
- ✅ Video block (embedded video)
- ✅ Footer

### 4. Open DevTools

Check React Components tab:
```
<HomePage>
  <PageHeader headerData={...} />
  <BlockRenderer blocks={[...]}>
    <BannerBlock content={...} />
    <TriptychBlock content={...} />
    <ArticlesBlock content={...} />
    <SchoolsBlock content={...} />
    <VideoBlock content={...} />
  </BlockRenderer>
  <PageFooter footerData={...} />
</HomePage>
```

---

## Quick Validation

### Test 1: Loading State
```javascript
// Temporarily increase delay in pageService.js
await new Promise(resolve => setTimeout(resolve, 3000)); // 3 seconds
```
You should see the loading spinner for 3 seconds.

### Test 2: Error State
```javascript
// In usePageData.js, temporarily throw error
throw new Error('Test error handling');
```
You should see the error UI with retry button.

### Test 3: Add New Block Type

1. Create `TestBlock.js`:
```javascript
// src/components/blocks/TestBlock.js
export default function TestBlock({ content }) {
  return <div style={{ padding: '20px', background: '#e3f2fd' }}>
    <h2>Test Block Works! 🎉</h2>
    <p>{content.message}</p>
  </div>;
}
```

2. Register it:
```javascript
// src/components/blocks/registry.js
import TestBlock from './TestBlock';

export const BLOCK_COMPONENTS = {
  // ... existing blocks
  test: TestBlock, // ← Add this line
};
```

3. Add to mock data:
```javascript
// src/api/pageService.js - in blocks array
{
  id: 'block-test',
  type: 'test',
  content: {
    message: 'If you see this, the architecture is working perfectly!'
  }
}
```

4. Refresh page - you should see your test block!

---

## Checklist

Before deploying to production:

- [ ] Switch from mock data to real API (`useMockData: false`)
- [ ] Set `REACT_APP_API_URL` environment variable
- [ ] Test with real API response
- [ ] Verify all block types render correctly
- [ ] Test error handling (network failures)
- [ ] Test loading states
- [ ] Check responsive design on mobile
- [ ] Verify accessibility (screen readers, keyboard navigation)
- [ ] Test in different browsers
- [ ] Check console for warnings/errors
- [ ] Verify image paths are correct
- [ ] Test with missing/optional data fields

---

## Common Issues & Solutions

### Issue: "Cannot find module './pages/HomePage'"
**Solution:** Make sure you created the `pages` directory and HomePage.js file.

### Issue: Styles not applying
**Solution:**
1. Make sure Tailwind CSS is configured
2. Or update block components to use your existing CSS framework
3. Check `index.css` imports Tailwind directives:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Issue: API call not working
**Solution:**
1. Check browser Network tab for request
2. Verify CORS is enabled on backend
3. Check authentication headers if required
4. Verify API endpoint URL is correct

### Issue: Unknown block type warning
**Solution:** This is expected! Add the new block type to `registry.js`:
```javascript
import NewBlock from './NewBlock';

export const BLOCK_COMPONENTS = {
  // ...existing
  newBlockType: NewBlock,
};
```

---

## Next Steps

1. **Replace mock data with real API** - Update `pageService.js`
2. **Customize styles** - Update block component styles to match your design
3. **Add more block types** - Follow the 3-step process in the guide
4. **Integrate with existing components** - Map API data to your Header/Footer
5. **Add TypeScript** - Create type definitions for better DX
6. **Optimize performance** - Add lazy loading, memoization
7. **Add tests** - Test each block component and the integration

---

## Need Help?

- Review `DYNAMIC_BLOCKS_GUIDE.md` for detailed architecture explanation
- Check mock data in `src/api/pageService.js` for examples
- Examine any block component for implementation patterns
- Look at `HomePage.js` for the complete integration

**You're all set! Happy coding! 🚀**
