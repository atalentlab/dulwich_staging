import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Locale Context for managing language across the app
 * Provides dynamic locale switching with automatic data refetching
 */
const LocaleContext = createContext();

export const LocaleProvider = ({ children, defaultLocale = 'en' }) => {
  // Get locale from localStorage or use default
  const [locale, setLocaleState] = useState(() => {
    const savedLocale = localStorage.getItem('selectedLocale');
    return savedLocale || defaultLocale;
  });

  // Save to localStorage whenever locale changes
  useEffect(() => {
    localStorage.setItem('selectedLocale', locale);
  }, [locale]);

  // Function to change locale
  const changeLocale = (newLocale) => {
    console.log(`Changing locale from ${locale} to ${newLocale}`);
    setLocaleState(newLocale);
  };

  const value = {
    locale,
    changeLocale,
    isEnglish: locale === 'en',
    isChinese: locale === 'zh',
  };

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
};

/**
 * Hook to access locale context
 */
export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context;
};

export default LocaleContext;
