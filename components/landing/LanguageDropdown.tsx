"use client";

import { LANDING_LANGUAGE_OPTIONS, isLandingLanguage } from "@/lib/landing-i18n";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { cn } from "@/lib/cn";

type LanguageDropdownProps = {
  className?: string;
  id?: string;
};

const selectClassName =
  "w-full min-h-10 rounded-lg border border-white/10 bg-fo-bg-elevated px-3 py-2 text-sm text-fo-text transition focus:border-fo-primary-bright focus:outline-none focus:ring-2 focus:ring-fo-primary-bright/30";

export function LanguageDropdown({ className, id = "landing-language" }: LanguageDropdownProps) {
  const { language, setLanguage, t } = useLandingLanguage();

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-xs font-medium text-fo-text-muted">
        {t.nav.language}
      </label>
      <select
        id={id}
        value={language}
        onChange={(event) => {
          const value = event.target.value;
          if (isLandingLanguage(value)) {
            setLanguage(value);
          }
        }}
        className={selectClassName}
        aria-label={t.nav.language}
      >
        {LANDING_LANGUAGE_OPTIONS.map((option) => (
          <option key={option.code} value={option.code}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function LanguageDropdownCompact({
  className,
  id = "landing-language-desktop",
}: LanguageDropdownProps) {
  const { language, setLanguage, t } = useLandingLanguage();

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <label htmlFor={id} className="sr-only">
        {t.nav.language}
      </label>
      <select
        id={id}
        value={language}
        onChange={(event) => {
          const value = event.target.value;
          if (isLandingLanguage(value)) {
            setLanguage(value);
          }
        }}
        className={cn(
          selectClassName,
          "w-auto min-w-[9.5rem] py-1.5 text-xs lg:text-sm"
        )}
        aria-label={t.nav.language}
      >
        {LANDING_LANGUAGE_OPTIONS.map((option) => (
          <option key={option.code} value={option.code}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
