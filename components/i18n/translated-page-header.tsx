"use client";

import { useLandingLanguage } from "@/components/landing/landing-language-context";
import type { PageTranslationKey } from "@/components/i18n/translated-section-heading";
import { cn } from "@/lib/cn";

type TranslatedPageHeaderProps = {
  page: PageTranslationKey;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
};

export function TranslatedPageHeader({
  page,
  className,
  titleClassName,
  subtitleClassName,
}: TranslatedPageHeaderProps) {
  const { t } = useLandingLanguage();
  const content = t.pages[page];

  return (
    <div className={cn("space-y-0.5 md:space-y-2", className)}>
      <h1
        className={cn(
          "text-xl font-bold tracking-tight text-fo-text md:text-3xl lg:text-4xl",
          titleClassName
        )}
      >
        {content.title}
      </h1>
      <p
        className={cn(
          "max-w-2xl text-sm text-fo-text-muted md:text-base lg:text-lg",
          subtitleClassName
        )}
      >
        {content.subtitle}
      </p>
    </div>
  );
}
