# React Query (TanStack Query) Integration

## ✅ What Was Implemented

Successfully migrated from custom `usePageData` hook to **TanStack React Query** for superior data fetching, caching, and state management.

---

## 📦 Packages Installed

```bash
npm install @tanstack/react-query
npm install @tanstack/react-query-devtools
```

---

## 🏗️ Architecture Changes

### **Before: Custom Hook**
```javascript
// Old approach - manual state management
const usePageData = (pageSlug, useMockData, locale) => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Manual fetch, loading, error handling
  }, [pageSlug, locale]);

  return { pageData, loading, error, refetch };
};
```

### **After: React Query**
```javascript
// New approach - automatic caching, refetching, and state management
const usePageDataQuery = (pageSlug, locale) => {
  const query = useQuery({
    queryKey: ['pageData', pageSlug, locale],
    queryFn: () => fetchPageData(pageSlug, locale),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    pageData: query.data,
    loading: query.isLoading,
    error: query.error?.message,
    refetch: query.refetch,
  };
};
```

---

## 📁 Files Modified/Created

### 1. **`src/index.js`** - QueryClient Setup
```javascript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Don't refetch on window focus
      retry: 1, // Retry failed requests once
      staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
    },
  },
});

root.render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </QueryClientProvider>
);
```

### 2. **`src/hooks/usePageDataQuery.js`** - New Hook (Created)
React Query hook that replaces the old custom hook:
```javascript
export const usePageDataQuery = (pageSlug = 'home', locale = 'zh') => {
  const query = useQuery({
    queryKey: ['pageData', pageSlug, locale],
    queryFn: () => fetchPageData(pageSlug, locale),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });

  return {
    pageData: query.data,
    loading: query.isLoading,
    error: query.error?.message,
    refetch: query.refetch,
    isError: query.isError,
    isFetching: query.isFetching,
  };
};
```

### 3. **`src/pages/HomePage.js`** - Updated to use React Query
```javascript
// Before
import usePageData from '../hooks/usePageData';
const { pageData, loading, error, refetch } = usePageData('home', false, 'zh');

// After
import usePageDataQuery from '../hooks/usePageDataQuery';
const { pageData, loading, error, refetch } = usePageDataQuery('home', 'zh');
```

### 4. **`src/App.js`** - Added DevTools
```javascript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <>
      {/* Your app components */}
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}
```

### 5. **`src/api/pageService.js`** - No changes needed
Already using `fetch()` - works perfectly with React Query!

---

## 🎯 Benefits of React Query

### 1. **Automatic Caching**
- Data is cached for 10 minutes
- No duplicate API calls for same data
- Instant loading from cache

```javascript
// First visit - fetches from API
usePageDataQuery('home', 'zh');

// Navigate away and back within 5 minutes - uses cache!
usePageDataQuery('home', 'zh'); // ← No API call!
```

### 2. **Smart Refetching**
- Automatically refetches stale data
- Refetches on internet reconnect
- Background refetching while showing cached data

### 3. **Loading & Error States**
```javascript
const { pageData, loading, error, isFetching } = usePageDataQuery('home', 'zh');

if (loading) return <Loading />; // Initial load
if (error) return <Error message={error} />; // Error state
if (isFetching) console.log('Updating in background...'); // Background fetch
```

### 4. **DevTools for Debugging**
- Visual query inspector
- See cache state
- Monitor refetches
- Debug queries in real-time

Open DevTools: Click the React Query icon (bottom-left corner in dev mode)

### 5. **Query Keys for Cache Management**
```javascript
queryKey: ['pageData', pageSlug, locale]
// Different keys = different cache entries
// ['pageData', 'home', 'zh'] ≠ ['pageData', 'about', 'en']
```

### 6. **Optimistic Updates & Mutations**
Easy to add later for POST/PUT/DELETE operations:
```javascript
const mutation = useMutation({
  mutationFn: (newData) => postData(newData),
  onSuccess: () => {
    queryClient.invalidateQueries(['pageData']);
  },
});
```

---

## 🔧 Configuration Options

### Global Config (in `index.js`)
```javascript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Don't refetch when tab gains focus
      retry: 1, // Number of retry attempts
      staleTime: 5 * 60 * 1000, // 5 min - data is "fresh"
      cacheTime: 10 * 60 * 1000, // 10 min - cache persists
    },
  },
});
```

### Per-Query Config (in hook)
```javascript
useQuery({
  queryKey: ['pageData', pageSlug, locale],
  queryFn: () => fetchPageData(pageSlug, locale),

  // Override global config for this query
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
  retry: 2, // Retry twice
  enabled: true, // Set to false to disable auto-fetch
});
```

---

## 📊 Query Lifecycle

```
1. Query Starts
   ↓
2. Check Cache
   ├─ Fresh data exists? → Return cached data (no fetch)
   └─ Stale or no data? → Continue to step 3
   ↓
3. Fetch from API
   ↓
4. Update Cache
   ↓
5. Return Data to Component
   ↓
6. Background Refetch (if stale)
```

---

## 🎨 Advanced Usage Examples

### Example 1: Prefetch Data
```javascript
import { useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();

// Prefetch about page data on hover
<Link
  to="/about"
  onMouseEnter={() => {
    queryClient.prefetchQuery({
      queryKey: ['pageData', 'about', 'zh'],
      queryFn: () => fetchPageData('about', 'zh'),
    });
  }}
>
  About
</Link>
```

### Example 2: Conditional Fetching
```javascript
const { pageData } = usePageDataQuery('home', 'zh', {
  enabled: user.isLoggedIn, // Only fetch if user is logged in
});
```

### Example 3: Dependent Queries
```javascript
// Fetch user first
const { data: user } = useQuery(['user'], fetchUser);

// Then fetch user's schools (depends on user data)
const { data: schools } = useQuery(
  ['schools', user?.id],
  () => fetchSchools(user.id),
  { enabled: !!user } // Only run when user exists
);
```

### Example 4: Manual Refetch
```javascript
const { refetch } = usePageDataQuery('home', 'zh');

<button onClick={() => refetch()}>
  Refresh Page Data
</button>
```

### Example 5: Invalidate Cache
```javascript
import { useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();

// Force refetch by invalidating cache
const handleUpdate = () => {
  queryClient.invalidateQueries(['pageData']);
};
```

---

## 🐛 DevTools Usage

### Open DevTools
Click the React Query icon in the bottom-left corner (development only)

### Features:
- **Query Inspector**: See all active queries
- **Query Details**: View data, status, timestamps
- **Refetch**: Manually trigger refetch
- **Cache Explorer**: Inspect cached data
- **Timeline**: See query history

### Useful for:
- ✅ Debugging why data isn't updating
- ✅ Checking cache status
- ✅ Monitoring API calls
- ✅ Testing refetch behavior

---

## 🔄 Migration Guide (Old Hook → React Query)

### Step 1: Import new hook
```javascript
// Before
import usePageData from '../hooks/usePageData';

// After
import usePageDataQuery from '../hooks/usePageDataQuery';
```

### Step 2: Update hook call
```javascript
// Before
const { pageData, loading, error } = usePageData('home', false, 'zh');

// After
const { pageData, loading, error } = usePageDataQuery('home', 'zh');
```

### Step 3: No other changes needed!
Component logic remains the same - same return values, same API.

---

## 📈 Performance Benefits

| Feature | Custom Hook | React Query |
|---------|-------------|-------------|
| **Automatic Caching** | ❌ Manual | ✅ Built-in |
| **Background Refetch** | ❌ No | ✅ Yes |
| **Deduplication** | ❌ No | ✅ Automatic |
| **Retry Logic** | ⚠️ Manual | ✅ Built-in |
| **DevTools** | ❌ No | ✅ Yes |
| **Optimistic Updates** | ⚠️ Complex | ✅ Easy |
| **Prefetching** | ❌ No | ✅ Built-in |
| **Cache Invalidation** | ❌ No | ✅ Easy |

---

## 🚀 Next Steps

### 1. **Add Mutations for Write Operations**
```javascript
// For submitting forms, updating data, etc.
import { useMutation } from '@tanstack/react-query';

const mutation = useMutation({
  mutationFn: (formData) => submitForm(formData),
  onSuccess: () => {
    queryClient.invalidateQueries(['pageData']);
  },
});
```

### 2. **Implement Infinite Queries**
```javascript
// For pagination, infinite scroll
import { useInfiniteQuery } from '@tanstack/react-query';

const { data, fetchNextPage } = useInfiniteQuery({
  queryKey: ['articles'],
  queryFn: ({ pageParam = 0 }) => fetchArticles(pageParam),
  getNextPageParam: (lastPage) => lastPage.nextCursor,
});
```

### 3. **Add Optimistic Updates**
```javascript
const mutation = useMutation({
  mutationFn: updateData,
  onMutate: async (newData) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries(['pageData']);

    // Snapshot previous value
    const previous = queryClient.getQueryData(['pageData']);

    // Optimistically update cache
    queryClient.setQueryData(['pageData'], newData);

    return { previous };
  },
  onError: (err, newData, context) => {
    // Rollback on error
    queryClient.setQueryData(['pageData'], context.previous);
  },
});
```

---

## 📚 Resources

- **Official Docs**: https://tanstack.com/query/latest
- **DevTools Docs**: https://tanstack.com/query/latest/docs/devtools
- **Examples**: https://tanstack.com/query/latest/docs/examples/react/basic

---

## ✅ Checklist

- [x] Installed `@tanstack/react-query`
- [x] Installed `@tanstack/react-query-devtools`
- [x] Set up `QueryClientProvider` in `index.js`
- [x] Created `usePageDataQuery` hook
- [x] Updated `HomePage` to use React Query
- [x] Added `ReactQueryDevtools` to `App.js`
- [x] API service already uses `fetch()`
- [x] Configured caching and retry logic

---

**Migration Complete! 🎉**

Your app now uses TanStack React Query for superior data fetching and state management!
