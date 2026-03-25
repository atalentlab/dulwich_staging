import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { LocaleProvider, useLocale } from './contexts/LocaleContext';
import { SchoolsProvider } from './contexts/SchoolsContext';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Don't refetch on window focus
      retry: 1, // Retry failed requests once
      staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
    },
  },
});

// Suppress ResizeObserver loop error - this is a harmless error that occurs
// when layout recalculations happen faster than the browser can process them
const resizeObserverErrorHandler = (event) => {
  if (
    event.message === 'ResizeObserver loop completed with undelivered notifications.' ||
    event.message === 'ResizeObserver loop limit exceeded'
  ) {
    event.stopImmediatePropagation();
    event.preventDefault();
    return true;
  }
};

window.addEventListener('error', resizeObserverErrorHandler);

// Suppress cross-origin "Script error." (e.g. from Tree-Nation widget)
// These have no stack/filename and cannot be acted on — safe to suppress
window.addEventListener('error', (event) => {
  if (event.message === 'Script error.' && !event.error) {
    event.stopImmediatePropagation();
    event.preventDefault();
  }
}, true);

// Wrapper component to access locale from LocaleContext and pass to SchoolsProvider
// Defined BEFORE being used to avoid hoisting issues
function SchoolsProviderWrapper({ children }) {
  const { locale } = useLocale();
  return <SchoolsProvider locale={locale}>{children}</SchoolsProvider>;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <LocaleProvider defaultLocale="en">
            <SchoolsProviderWrapper>
              <App />
            </SchoolsProviderWrapper>
          </LocaleProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
);
reportWebVitals();
