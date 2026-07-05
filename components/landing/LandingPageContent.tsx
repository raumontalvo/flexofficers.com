"use client";

import type { ComponentType, SVGProps } from "react";
import { HeroBadge } from "@/components/landing/HeroBadge";
import { LandingAudienceCards } from "@/components/landing/landing-audience-cards";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import Link from "next/link";
import { FeatureCard } from "@/components/landing/FeatureCard";
import {
  IconCalendar,
  IconCheck,
  IconClock,
  IconGift,
  IconLayout,
  IconMessageCircle,
  IconSearch,
  IconShield,
  IconSpark,
  IconUsers,
  IconZap,
} from "@/components/landing/icons";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import type { LandingTranslations } from "@/lib/landing-i18n";
import { LandingEyebrow, LandingHeading } from "@/components/landing/LandingHeading";
import { LandingHowItWorks } from "@/components/landing/landing-how-it-works";
import { ClientLandingCta } from "@/components/landing/client-landing-cta";
import { buttonClassName, Card, CardTitle } from "@/components/ui";
import { cn } from "@/lib/cn";

const companyFeatureIcons = [
  IconCalendar,
  IconUsers,
  IconSearch,
  IconZap,
  IconShield,
  IconShield,
] as const;

const officerFeatureIcons = [
  IconGift,
  IconLayout,
  IconClock,
  IconCheck,
  IconMessageCircle,
  IconSpark,
] as const;

const pricingCardClass = cn(
  "landing-card-lift flex h-full min-h-0 min-w-0 flex-col rounded-2xl",
  "border border-blue-500/20 bg-gradient-to-b from-[#0c1424]/95 via-fo-bg-elevated/85 to-[#070d18]/95",
  "p-6 shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition sm:p-7",
  "hover:border-blue-500/35 hover:shadow-[0_16px_48px_-12px_rgba(37,99,235,0.28)]"
);

const pricingButtonClass =
  "mt-auto w-full shadow-[0_20px_40px_-16px_rgba(37,99,235,0.55)] transition hover:shadow-[0_24px_48px_-14px_rgba(37,99,235,0.65)]";

function PricingFeatureList({ features }: { features: string[] }) {
  return (
    <ul className="space-y-2.5">
      {features.map((feature) => (
        <li
          key={feature}
          className="flex min-w-0 items-start gap-2.5 text-sm leading-snug text-fo-text-muted"
        >
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-[10px] font-bold text-fo-primary-hover">
            ✓
          </span>
          <span className="min-w-0">{feature}</span>
        </li>
      ))}
    </ul>
  );
}

function PricingImportantBar({
  items,
}: {
  items: Array<{ text: string; icon: ComponentType<SVGProps<SVGSVGElement>> }>;
}) {
  return (
    <Card
      padding="none"
      variant="muted"
      className="mt-10 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.25)] sm:p-6"
    >
      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-3 md:gap-6">
        {items.map(({ text, icon: Icon }) => (
          <div key={text} className="flex min-w-0 items-start gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-blue-500/30 bg-blue-500/10 text-fo-primary-bright">
              <Icon className="h-4 w-4" strokeWidth={1.75} />
            </div>
            <p className="text-sm leading-snug text-fo-text-muted">{text}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

type PricingAudienceCardProps = {
  badge: string;
  title: string;
  price?: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

function PricingAudienceCard({
  badge,
  title,
  price,
  description,
  features,
  cta,
  href,
  icon: Icon,
}: PricingAudienceCardProps) {
  return (
    <Card padding="none" variant="elevated" className={pricingCardClass}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10 text-fo-primary-bright shadow-[0_0_16px_-4px_rgba(37,99,235,0.35)]">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </div>

      <div className="mt-4 min-w-0">
        <LandingEyebrow>{badge}</LandingEyebrow>
        <CardTitle className="mt-2 text-xl font-bold tracking-tight text-fo-text lg:text-2xl">
          {title}
        </CardTitle>
        {price ? (
          <p className="mt-2 text-lg font-semibold text-fo-primary-bright">
            {price}
          </p>
        ) : null}
        <p className="mt-2 text-sm leading-snug text-fo-text-muted">
          {description}
        </p>
      </div>

      <div className="mt-4 flex-1">
        <PricingFeatureList features={features} />
      </div>

      <Link
        href={href}
        className={buttonClassName({
          size: "lg",
          fullWidth: true,
          className: pricingButtonClass,
        })}
      >
        {cta}
      </Link>
    </Card>
  );
}

function CompanyPricingCard({
  pricing,
}: {
  pricing: LandingTranslations["pricing"];
}) {
  return (
    <Card
      padding="none"
      variant="elevated"
      className={cn(
        pricingCardClass,
        "ring-1 ring-blue-500/15 shadow-[0_20px_56px_-16px_rgba(37,99,235,0.32)]"
      )}
    >
      <div className="min-w-0">
        <LandingEyebrow>{pricing.annualPlan}</LandingEyebrow>
        <CardTitle className="mt-2 text-xl font-bold tracking-tight text-fo-text lg:text-2xl">
          {pricing.planName}
        </CardTitle>
        <div className="mt-3 flex min-w-0 flex-wrap items-end gap-1.5">
          <span className="text-4xl font-bold leading-none tracking-tight text-fo-primary-bright lg:text-[2.75rem]">
            $599
          </span>
          <span className="mb-0.5 text-lg font-semibold leading-none text-fo-text-muted">
            {pricing.perYear}
          </span>
        </div>
        <p className="mt-3 inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-fo-primary-hover sm:text-sm">
          {pricing.trialBadge}
        </p>
        <div className="mt-3 space-y-1.5 rounded-xl border border-blue-500/20 bg-blue-500/10 px-3.5 py-3">
          <p className="text-sm leading-snug text-fo-text-muted">
            {pricing.trialStartNote}
          </p>
          <p className="text-sm font-semibold leading-snug text-fo-text">
            {pricing.trialSubscribeNote}
          </p>
        </div>
      </div>

      <div className="mt-4 flex-1">
        <PricingFeatureList features={pricing.features} />
      </div>

      <Link
        href="/onboarding?force=1"
        className={buttonClassName({
          size: "lg",
          fullWidth: true,
          className: pricingButtonClass,
        })}
      >
        {pricing.getStarted}
      </Link>
    </Card>
  );
}

export function LandingPageContent() {
  const { t } = useLandingLanguage();

  return (
    <main className="min-h-[100svh] overflow-x-hidden bg-fo-bg text-fo-text">
      <LandingNavbar />

      {/* Hero */}
      <section className="relative overflow-x-hidden">
        <div className="landing-hero-glow absolute inset-0" aria-hidden="true" />
        <div className="landing-hero-inner relative mx-auto max-w-7xl px-4 pb-12 max-lg:pt-[calc(var(--landing-header-h)+1rem)] min-[390px]:px-5 sm:px-8 sm:pb-16 sm:max-lg:pt-[calc(var(--landing-header-h)+1.25rem)] lg:px-8 lg:py-16 xl:py-24">
          {/* Mobile — original centered hero layout */}
          <div className="landing-hero-mobile landing-fade-up relative z-10 mx-auto w-full max-w-4xl lg:hidden">
            <HeroBadge />
            <LandingEyebrow>{t.hero.badge}</LandingEyebrow>
            <h1 className="mt-4 text-[1.75rem] font-bold leading-[1.08] tracking-tight min-[360px]:text-[2rem] min-[390px]:text-[2.25rem] sm:text-5xl sm:leading-[1.04]">
              <span className="block">{t.hero.titleLine1}</span>
              <span className="block">{t.hero.titleLine2}</span>
              <span className="mt-1 block bg-gradient-to-r from-fo-primary-bright via-blue-400 to-sky-300 bg-clip-text text-transparent">
                {t.hero.titleHighlight}
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-fo-text-muted/90 min-[390px]:text-lg min-[390px]:leading-8 sm:mt-7 sm:text-xl sm:leading-9">
              {t.hero.subtitle}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center sm:gap-4">
              <Link
                href="/onboarding?force=1"
                className={buttonClassName({
                  size: "lg",
                  fullWidth: true,
                  className:
                    "sm:w-auto sm:min-w-[220px] shadow-[0_20px_40px_-16px_rgba(37,99,235,0.55)] transition hover:shadow-[0_24px_48px_-14px_rgba(37,99,235,0.65)]",
                })}
              >
                {t.hero.getStarted}
              </Link>
              <Link
                href="#need-security"
                className={buttonClassName({
                  variant: "secondary",
                  size: "lg",
                  fullWidth: true,
                  className:
                    "sm:w-auto sm:min-w-[200px] border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06]",
                })}
              >
                {t.hero.needSecurity}
              </Link>
            </div>
          </div>

          {/* Desktop — two-column hero layout */}
          <div className="landing-hero-desktop relative z-10 hidden min-w-0 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:items-center lg:gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,460px)] xl:gap-10 2xl:grid-cols-[minmax(0,1fr)_minmax(0,520px)]">
            <div className="landing-fade-up min-w-0">
              <span className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-fo-primary-hover">
                {t.hero.badge}
              </span>
              <h1 className="mt-5 text-5xl font-bold leading-[1.04] tracking-tight xl:text-6xl 2xl:text-[3.75rem]">
                <span className="block">{t.hero.titleLine1}</span>
                <span className="block">{t.hero.titleLine2}</span>
                <span className="mt-1 block bg-gradient-to-r from-fo-primary-bright via-blue-400 to-sky-300 bg-clip-text text-transparent">
                  {t.hero.titleHighlight}
                </span>
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-fo-text-muted/90 xl:text-xl xl:leading-9">
                {t.hero.subtitle}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3 xl:mt-10">
                <Link
                  href="/onboarding?force=1"
                  className={buttonClassName({
                    size: "lg",
                    className:
                      "min-w-[200px] shadow-[0_20px_40px_-16px_rgba(37,99,235,0.55)] transition hover:shadow-[0_24px_48px_-14px_rgba(37,99,235,0.65)]",
                  })}
                >
                  {t.hero.getStarted}
                </Link>
                <Link
                  href="#need-security"
                  className={buttonClassName({
                    variant: "secondary",
                    size: "lg",
                    className:
                      "min-w-[200px] border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06]",
                  })}
                >
                  {t.hero.needSecurity}
                </Link>
              </div>
            </div>

            <div className="flex min-w-0 flex-1 items-center justify-center">
              <HeroBadge variant="desktop" />
            </div>
          </div>
        </div>
      </section>

      <LandingAudienceCards />

      {/* Introduction */}
      <section
        id="introduction"
        className="scroll-mt-[var(--landing-header-h)] border-t border-white/[0.06] px-5 py-20 sm:px-8 sm:py-28 lg:py-32"
      >
        <div className="landing-fade-up mx-auto max-w-5xl text-center">
          <span className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-fo-primary-hover sm:text-sm">
            {t.introduction.badge}
          </span>
          <h2 className="mt-6 text-4xl font-bold tracking-tight text-fo-text sm:mt-8 sm:text-5xl lg:text-6xl">
            {t.introduction.title}
          </h2>
          <p className="mx-auto mt-8 max-w-5xl whitespace-pre-line text-base leading-8 text-fo-text-muted sm:mt-10 sm:text-lg sm:leading-8">
            {t.introduction.body}
          </p>
        </div>
      </section>

      <LandingHowItWorks />

      {/* Companies */}
      <section
        id="companies"
        className="mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-36"
      >
        <LandingHeading
          title={t.companies.title}
          subtitle={t.companies.subtitle}
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {t.companies.features.map((feature, index) => {
            const Icon = companyFeatureIcons[index];
            return (
              <FeatureCard
                key={feature.title}
                title={feature.title}
                description={feature.description}
                icon={Icon}
              />
            );
          })}
        </div>

        <div className="mt-10 rounded-2xl border border-blue-500/25 bg-blue-500/10 px-6 py-6 text-center sm:px-8 sm:py-8">
          <p className="text-lg font-semibold text-fo-primary-hover">
            {t.companies.trialDuration}
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-fo-text-muted sm:text-base">
            {t.companies.trialProfileNote} {t.companies.trialActiveNote}
          </p>
        </div>
      </section>

      {/* Clients */}
      <section
        id="need-security"
        className="border-t border-white/[0.06] bg-fo-bg-elevated/20 px-5 py-28 sm:px-8 sm:py-36"
      >
        <div className="mx-auto max-w-7xl">
          <LandingHeading title={t.clients.title} subtitle={t.clients.subtitle} />
          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
            {t.clients.features.map((feature) => (
              <FeatureCard
                key={feature.title}
                title={feature.title}
                description={feature.description}
                icon={IconShield}
              />
            ))}
          </div>
          <p className="mt-8 text-center text-sm font-medium text-fo-primary-hover sm:text-base">
            {t.clients.feeNote}
          </p>
          <ClientLandingCta />
        </div>
      </section>

      {/* Officers */}
      <section
        id="officers"
        className="border-t border-white/[0.06] bg-fo-bg-elevated/30 px-5 py-28 sm:px-8 sm:py-36"
      >
        <div className="mx-auto max-w-7xl">
          <LandingHeading
            title={t.officers.title}
            subtitle={t.officers.subtitle}
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {t.officers.features.map((feature, index) => {
              const Icon = officerFeatureIcons[index];
              return (
                <FeatureCard
                  key={feature.title}
                  title={feature.title}
                  description={feature.description}
                  icon={Icon}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section
        id="pricing"
        className="relative border-t border-white/[0.06] px-5 py-32 sm:px-8 sm:py-40"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(37,99,235,0.14),transparent_70%)]"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl overflow-x-hidden">
          <LandingHeading
            title={t.pricing.title}
            subtitle={t.pricing.subtitle}
            align="center"
          />

          <div className="mt-12 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3 lg:gap-8">
            <CompanyPricingCard pricing={t.pricing} />
            <PricingAudienceCard
              badge={t.pricing.officer.badge}
              title={t.pricing.officer.title}
              description={t.pricing.officer.description}
              features={t.pricing.officer.features}
              cta={t.pricing.officer.cta}
              href="/onboarding?role=OFFICER"
              icon={IconUsers}
            />
            <PricingAudienceCard
              badge={t.pricing.client.badge}
              title={t.pricing.client.title}
              price={t.pricing.client.price}
              description={t.pricing.client.description}
              features={t.pricing.client.features}
              cta={t.pricing.client.cta}
              href="/onboarding?role=CLIENT"
              icon={IconShield}
            />
          </div>

          <PricingImportantBar
            items={[
              { text: t.pricing.important.company, icon: IconShield },
              { text: t.pricing.important.officer, icon: IconCheck },
              { text: t.pricing.important.client, icon: IconUsers },
            ]}
          />
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}
