"use client";

import { useLandingLanguage } from "@/components/landing/landing-language-context";
import type { LandingLanguage } from "@/lib/landing-i18n";
import { cn } from "@/lib/cn";

type LanguageToggleProps = {
  className?: string;
};

const options: { code: LandingLanguage; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
];

export function LanguageToggle({ className }: LanguageToggleProps) {
  const { language, setLanguage } = useLandingLanguage();

  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-lg border border-white/10 bg-fo-bg-elevated p-1 text-xs font-semibold lg:text-sm",
        className
      )}
      role="group"
      aria-label="Language"
    >
      {options.map((option, index) => (
        <span key={option.code} className="inline-flex items-center gap-1">
          {index > 0 ? (
            <span className="px-0.5 text-fo-text-subtle" aria-hidden>
              |
            </span>
          ) : null}
          <button
            type="button"
            onClick={() => setLanguage(option.code)}
            className={cn(
              "min-h-8 rounded-md px-2.5 py-1 transition",
              language === option.code
                ? "bg-fo-primary/15 text-fo-primary-hover"
                : "text-fo-text-muted hover:text-fo-text"
            )}
            aria-pressed={language === option.code}
          >
            {option.label}
          </button>
        </span>
      ))}
    </div>
  );
}
