import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import EventsPage from './pages/EventsPage';
import DataGrid from './pages/DataGrid';
import TestPage from './pages/TestPage';
import TextBlockDemo from './pages/TextBlockDemo';
import LiveWorldWiseGridPage from './pages/LiveWorldWiseGridPage';
import DynamicPageRenderer from './components/DynamicPageRenderer';
import ArticlePageRenderer from './components/article/ArticlePageRenderer';
import CookiePolicyPage from './pages/CookiePolicyPage';
import SitemapPage from './pages/SitemapPage';
import CookieConsentBanner from './components/common/CookieConsentBanner';
import StickyOurDulwich from './components/common/StickyOurDulwich';
import SmoothScrolling from './components/SmoothScrolling';
import './App.css';

// // Component to handle home page routing based on domain
// const HomePageRouter = () => {
//   const hostname = window.location.hostname;

//   // Singapore domain shows TestPage
//   if (hostname.includes('singapore.dulwich-frontend.atalent.xyz')) {
//     return <Homesg />;
//   }
//   // suzho domain shows TestPage
//   if (hostname.includes('suzhou.dulwich-frontend.atalent.xyz')) {
//     return <Home />;
//   }
//   // All other domains use DynamicPageRenderer
//   return <DynamicPageRenderer />;
// };

function App() {
  const location = useLocation();

  // Update HTML lang attribute based on current path
  useEffect(() => {
    const isChineseVersion = location.pathname.startsWith('/zh/') || location.pathname === '/zh';
    document.documentElement.lang = isChineseVersion ? 'zh' : 'en';
  }, [location.pathname]);

  return (
    <SmoothScrolling>
      <div className="App">
        <Routes>
          {/* Static routes for testing only */}
         {/* // <Route path="/home" element={<Home />} /> */}
          <Route path="/events" element={<EventsPage />} />
          <Route path="/datagrid" element={<DataGrid />} />
          <Route path="/static-blocks" element={<TestPage />} />
      
          <Route path="/text-block-demo" element={<TextBlockDemo />} />
          <Route path="/live-world-wise-test" element={<LiveWorldWiseGridPage />} />

          {/* Article detail routes */}
          <Route path="/article/:slug" element={<ArticlePageRenderer />} />
          <Route path="/:locale/article/:slug" element={<ArticlePageRenderer />} />

          {/* Dulwich Life article routes */}
          <Route path="/dulwich-life/:slug" element={<ArticlePageRenderer />} />
          <Route path="/:locale/dulwich-life/:slug" element={<ArticlePageRenderer />} />

          {/* Cookie Policy */}
          <Route path="/cookie-policy" element={<CookiePolicyPage />} />

          {/* Sitemap */}
          <Route path="/sitemap" element={<SitemapPage />} />
          <Route path="/:locale/sitemap" element={<SitemapPage />} />

          {/* Home page - conditional based on domain */}
          {/* <Route path="/" element={<HomePageRouter />} /> */}

          {/* Catch-all route for dynamic pages */}
          <Route path="/*" element={<DynamicPageRenderer />} />
        </Routes>

        {/* Cookie Consent Banner — shown globally until user responds */}
        <CookieConsentBanner />

        {/* Sticky Our Dulwich widget — fixed on right edge, all pages */}
        <StickyOurDulwich />
      </div>

      {/* React Query DevTools - Only shows in development */}
      <ReactQueryDevtools initialIsOpen={false} />
    </SmoothScrolling>
  );
}

export default App;
