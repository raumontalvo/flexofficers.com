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
        "flex shrink-0 items-center gap-1.5 whitespace-nowrap text-sm",
        className
      )}
      role="group"
      aria-label="Language"
    >
      {options.map((option, index) => (
        <span key={option.code} className="inline-flex shrink-0 items-center gap-1.5">
          {index > 0 ? (
            <span className="shrink-0 text-gray-600" aria-hidden>
              |
            </span>
          ) : null}
          <button
            type="button"
            onClick={() => setLanguage(option.code)}
            className={cn(
              "shrink-0 whitespace-nowrap p-0 font-normal leading-none transition",
              language === option.code
                ? "font-semibold text-blue-500"
                : "text-gray-400 hover:text-white"
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
