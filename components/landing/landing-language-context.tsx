"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getLandingTranslations,
  isLandingLanguage,
  LANDING_LANGUAGE_STORAGE_KEY,
  type LandingLanguage,
  type LandingTranslations,
} from "@/lib/landing-i18n";

type LandingLanguageContextValue = {
  language: LandingLanguage;
  setLanguage: (language: LandingLanguage) => void;
  t: LandingTranslations;
};

const LandingLanguageContext = createContext<LandingLanguageContextValue | null>(null);

export function LandingLanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LandingLanguage>("en");

  useEffect(() => {
    const saved = localStorage.getItem(LANDING_LANGUAGE_STORAGE_KEY);
    if (isLandingLanguage(saved)) {
      setLanguageState(saved);
    }
  }, []);

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (
        event.key === LANDING_LANGUAGE_STORAGE_KEY &&
        isLandingLanguage(event.newValue)
      ) {
        setLanguageState(event.newValue);
      }
    }

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((next: LandingLanguage) => {
    setLanguageState(next);
    localStorage.setItem(LANDING_LANGUAGE_STORAGE_KEY, next);
  }, []);

  const t = useMemo(() => getLandingTranslations(language), [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
    }),
    [language, setLanguage, t]
  );

  return (
    <LandingLanguageContext.Provider value={value}>
      {children}
    </LandingLanguageContext.Provider>
  );
}

export function useLandingLanguage() {
  const context = useContext(LandingLanguageContext);

  if (!context) {
    throw new Error("useLandingLanguage must be used within LandingLanguageProvider");
  }

  return context;
}
