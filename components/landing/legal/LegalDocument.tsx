"use client";

import type { ReactNode } from "react";
import type { LegalSection } from "@/lib/landing-legal-i18n";

type LegalDocumentProps = {
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: LegalSection[];
  footer?: ReactNode;
};

export function LegalDocument({
  title,
  subtitle,
  lastUpdated,
  sections,
  footer,
}: LegalDocumentProps) {
  return (
    <article>
      <header className="border-b border-white/[0.06] pb-8">
        <h1 className="text-3xl font-bold tracking-tight text-fo-text sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-fo-text-muted sm:text-lg">
          {subtitle}
        </p>
        <p className="mt-4 text-sm text-fo-text-subtle">{lastUpdated}</p>
      </header>

      <div className="mt-10 space-y-10">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-xl font-semibold tracking-tight text-fo-text sm:text-2xl">
              {section.title}
            </h2>
            <div className="mt-4 space-y-4">
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-sm leading-relaxed text-fo-text-muted sm:text-base sm:leading-7"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      {footer ? <div className="mt-12">{footer}</div> : null}
    </article>
  );
}
