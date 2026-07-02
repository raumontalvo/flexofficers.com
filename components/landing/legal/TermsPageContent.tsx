"use client";

import type { ComponentType, SVGProps } from "react";
import Link from "next/link";
import {
  IconCalendar,
  IconCircleSlash,
  IconClipboard,
  IconDollar,
  IconFilePen,
  IconIdCard,
  IconRefresh,
  IconShield,
  IconShieldAlert,
  IconShieldCheck,
  IconUser,
} from "@/components/landing/icons";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import type { LegalPagesTranslations } from "@/lib/landing-legal-i18n";
import { buttonClassName, Card } from "@/components/ui";
import { cn } from "@/lib/cn";

const termsCardClass = cn(
  "landing-card-lift rounded-2xl border border-blue-500/20",
  "bg-gradient-to-b from-[#0c1424]/95 via-fo-bg-elevated/85 to-[#070d18]/95",
  "p-6 shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition sm:rounded-3xl sm:p-8 lg:p-10",
  "hover:border-blue-500/35 hover:shadow-[0_16px_48px_-12px_rgba(37,99,235,0.28)]"
);

const sectionIcons = [
  IconUser,
  IconShield,
  IconIdCard,
  IconShieldCheck,
  IconCircleSlash,
  IconClipboard,
  IconDollar,
  IconRefresh,
  IconShieldAlert,
  IconFilePen,
] as const;

function TermsSection({
  icon: Icon,
  title,
  body,
  bullets,
  closing,
}: LegalPagesTranslations["terms"]["sections"][number] & {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10 text-fo-primary-bright shadow-[0_0_16px_-4px_rgba(37,99,235,0.35)]">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </div>
      <div className="min-w-0">
        <h2 className="text-base font-semibold tracking-tight text-fo-text sm:text-lg">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-fo-text-muted sm:text-[15px] sm:leading-7">
          {body}
        </p>
        {bullets?.length ? (
          <ul className="mt-2 space-y-1.5">
            {bullets.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm leading-relaxed text-fo-text-muted sm:text-[15px]"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-fo-primary-bright" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : null}
        {closing ? (
          <p className="mt-2 text-sm leading-relaxed text-fo-text-muted sm:text-[15px] sm:leading-7">
            {closing}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function TermsPageContent() {
  const { t } = useLandingLanguage();
  const terms = t.legalPages.terms;
  const leftSections = terms.sections.slice(0, 5);
  const rightSections = terms.sections.slice(5);

  return (
    <main className="relative min-h-screen overflow-x-clip bg-gradient-to-b from-[#050a14] via-fo-bg to-[#0a1220] text-fo-text">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(37,99,235,0.16),transparent_70%)]"
        aria-hidden="true"
      />

      <LandingNavbar useHomeAnchors />

      <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-12 sm:px-8 sm:pb-24 sm:pt-16 lg:pt-20">
        <header className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-fo-primary-hover">
            {terms.badge}
          </span>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-fo-text sm:text-4xl lg:text-5xl">
            {terms.title}
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-fo-text-muted sm:text-lg sm:leading-8">
            {terms.subtitle}
          </p>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-fo-text-muted sm:text-base">
            {terms.agreementNote}
          </p>
          <div className="mt-5 inline-flex items-center justify-center gap-2 text-sm text-fo-text-subtle">
            <IconCalendar className="h-4 w-4 text-fo-primary-hover" strokeWidth={1.75} />
            <span>
              {terms.lastUpdatedLabel} {terms.lastUpdatedDate}
            </span>
          </div>
        </header>

        <Card padding="none" variant="elevated" className={cn(termsCardClass, "mt-12")}>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-x-10 md:gap-y-12">
            <div className="space-y-10">
              {leftSections.map((section, index) => {
                const Icon = sectionIcons[index] ?? IconShield;
                return (
                  <TermsSection key={section.title} {...section} icon={Icon} />
                );
              })}
            </div>
            <div className="space-y-10">
              {rightSections.map((section, index) => {
                const Icon = sectionIcons[index + 5] ?? IconShield;
                return (
                  <TermsSection key={section.title} {...section} icon={Icon} />
                );
              })}
            </div>
          </div>
        </Card>

        <Card
          padding="none"
          variant="muted"
          className="mt-8 flex flex-col items-start justify-between gap-6 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.25)] sm:mt-10 sm:flex-row sm:items-center sm:rounded-3xl sm:p-8"
        >
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10 text-fo-primary-bright">
              <IconShield className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-fo-text sm:text-xl">
                {terms.questions.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-fo-text-muted sm:text-base">
                {terms.questions.body}
              </p>
            </div>
          </div>
          <Link
            href="/contact"
            className={buttonClassName({
              size: "lg",
              className:
                "w-full shrink-0 shadow-[0_20px_40px_-16px_rgba(37,99,235,0.55)] transition hover:shadow-[0_24px_48px_-14px_rgba(37,99,235,0.65)] sm:w-auto sm:min-w-[180px]",
            })}
          >
            {terms.questions.cta}
          </Link>
        </Card>
      </div>

      <LandingFooter />
    </main>
  );
}
