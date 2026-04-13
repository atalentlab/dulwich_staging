import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'dulwich_cookie_consent';

const DEFAULT_PREFS = {
  necessary: true,   // always on
  analytics: false,
  marketing: false,
};

/**
 * useCookieConsent
 * Persists cookie preferences in localStorage.
 * Returns:
 *   - consentGiven  : boolean — true if user has responded (any choice)
 *   - preferences   : { necessary, analytics, marketing }
 *   - acceptAll()   : accept every category
 *   - rejectAll()   : only necessary cookies
 *   - savePrefs(p)  : save custom preferences object
 *   - resetConsent(): clear consent (re-shows banner)
 */
const useCookieConsent = () => {
  const [consentGiven, setConsentGiven] = useState(false);
  const [preferences, setPreferences] = useState(DEFAULT_PREFS);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPreferences({ ...DEFAULT_PREFS, ...parsed.preferences });
        setConsentGiven(true);
      }
    } catch {
      // corrupted storage — ignore and show banner
    }
  }, []);

  const persist = useCallback((prefs) => {
    const record = { preferences: prefs, timestamp: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    setPreferences(prefs);
    setConsentGiven(true);
  }, []);

  const acceptAll = useCallback(() => {
    persist({ necessary: true, analytics: true, marketing: true });
  }, [persist]);

  const rejectAll = useCallback(() => {
    persist({ necessary: true, analytics: false, marketing: false });
  }, [persist]);

  const savePrefs = useCallback((prefs) => {
    persist({ ...DEFAULT_PREFS, ...prefs, necessary: true });
  }, [persist]);

  const resetConsent = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setPreferences(DEFAULT_PREFS);
    setConsentGiven(false);
  }, []);

  return { consentGiven, preferences, acceptAll, rejectAll, savePrefs, resetConsent };
};

export default useCookieConsent;
