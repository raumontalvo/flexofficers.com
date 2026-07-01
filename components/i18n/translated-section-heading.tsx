"use client";

import type { ReactNode } from "react";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { SectionHeading } from "@/components/ui";
import type { LandingTranslations } from "@/lib/landing-i18n";

export type PageTranslationKey = keyof LandingTranslations["pages"];

type TranslatedSectionHeadingProps = {
  page: PageTranslationKey;
  className?: string;
  align?: "left" | "center";
  action?: ReactNode;
};

export function TranslatedSectionHeading({
  page,
  className,
  align,
  action,
}: TranslatedSectionHeadingProps) {
  const { t } = useLandingLanguage();
  const content = t.pages[page];

  return (
    <SectionHeading
      title={content.title}
      subtitle={content.subtitle}
      className={className}
      align={align}
      action={action}
    />
  );
}

export function usePageCopy(page: PageTranslationKey) {
  const { t } = useLandingLanguage();
  return t.pages[page];
}
