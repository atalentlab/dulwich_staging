import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { fetchSchools as fetchSchoolsFromService } from '../api/schoolPageService';

/**
 * Schools Context for managing schools data across the app
 * Fetches schools once and caches them to prevent duplicate API calls
 */
const SchoolsContext = createContext();

export const SchoolsProvider = ({ children, locale = 'en' }) => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Track the last fetched locale to prevent duplicate fetches
  const lastFetchedLocale = useRef(null);
  const isFetchingRef = useRef(false);

  // Fetch schools when provider mounts or locale changes
  useEffect(() => {
    let isMounted = true;

    const fetchSchools = async () => {
      // Skip if already fetched for this locale or currently fetching
      if (lastFetchedLocale.current === locale || isFetchingRef.current) {
        console.log(`[SchoolsContext] Skipping fetch - already have data for locale: ${locale}`);
        return;
      }

      isFetchingRef.current = true;
      console.log(`[SchoolsContext] Fetching schools for locale: ${locale}`);
      try {
        setLoading(true);
        setError(null);

        const processedSchools = await fetchSchoolsFromService(locale);

        // Only update state if component is still mounted
        if (isMounted) {
          setSchools(processedSchools);
          lastFetchedLocale.current = locale;
        }
      } catch (err) {
        console.error('[SchoolsContext] Error fetching schools:', err);
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          isFetchingRef.current = false;
        }
      }
    };

    fetchSchools();

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, [locale]);

  const value = {
    schools,
    loading,
    error,
    refetch: () => {
      setLoading(true);
      setError(null);
    }
  };

  return (
    <SchoolsContext.Provider value={value}>
      {children}
    </SchoolsContext.Provider>
  );
};

/**
 * Hook to access schools context
 * Usage: const { schools, loading, error } = useSchools();
 */
export const useSchools = () => {
  const context = useContext(SchoolsContext);
  if (!context) {
    throw new Error('useSchools must be used within SchoolsProvider');
  }
  return context;
};

export default SchoolsContext;
