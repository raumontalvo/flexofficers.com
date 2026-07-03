"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
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

const languageListeners = new Set<() => void>();

function readStoredLanguage(): LandingLanguage {
  if (typeof window === "undefined") {
    return "en";
  }

  const saved = localStorage.getItem(LANDING_LANGUAGE_STORAGE_KEY);
  return isLandingLanguage(saved) ? saved : "en";
}

function subscribeLanguage(onStoreChange: () => void) {
  languageListeners.add(onStoreChange);
  return () => {
    languageListeners.delete(onStoreChange);
  };
}

function getLanguageSnapshot(): LandingLanguage {
  return readStoredLanguage();
}

function getLanguageServerSnapshot(): LandingLanguage {
  return "en";
}

function notifyLanguageListeners() {
  languageListeners.forEach((listener) => listener());
}

function setStoredLanguage(language: LandingLanguage) {
  localStorage.setItem(LANDING_LANGUAGE_STORAGE_KEY, language);
  notifyLanguageListeners();
}

export function LandingLanguageProvider({ children }: { children: ReactNode }) {
  const language = useSyncExternalStore(
    subscribeLanguage,
    getLanguageSnapshot,
    getLanguageServerSnapshot
  );

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (
        event.key === LANDING_LANGUAGE_STORAGE_KEY &&
        isLandingLanguage(event.newValue)
      ) {
        notifyLanguageListeners();
      }
    }

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((next: LandingLanguage) => {
    setStoredLanguage(next);
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
