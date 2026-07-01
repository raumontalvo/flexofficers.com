"use client";

import { HeroBadge } from "@/components/landing/HeroBadge";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { FlexOfficersLogoLink } from "@/components/brand";
import Link from "next/link";
import { FeatureCard } from "@/components/landing/FeatureCard";
import {
  IconCalendar,
  IconCard,
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
import { LandingEyebrow, LandingHeading } from "@/components/landing/LandingHeading";
import { buttonClassName, Card, CardDescription, CardTitle } from "@/components/ui";
import { cn } from "@/lib/cn";

const companyFeatureIcons = [
  IconCalendar,
  IconUsers,
  IconSearch,
  IconZap,
  IconShield,
  IconCard,
] as const;

const officerFeatureIcons = [
  IconGift,
  IconLayout,
  IconClock,
  IconCheck,
  IconMessageCircle,
  IconSpark,
] as const;

const landingCardClass =
  "landing-card-lift border-white/[0.04] bg-fo-surface/35 p-8 shadow-[0_16px_48px_-28px_rgba(0,0,0,0.65)]";

function StepCard({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <Card
      variant="elevated"
      className={cn(landingCardClass, "h-full text-left sm:text-center")}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-fo-primary-hover">
        {step}
      </p>
      <CardTitle className="mt-4 text-2xl font-semibold tracking-tight">
        {title}
      </CardTitle>
      <CardDescription className="mt-4 text-base leading-relaxed text-fo-text-subtle">
        {description}
      </CardDescription>
    </Card>
  );
}

export function LandingPageContent() {
  const { t } = useLandingLanguage();

  return (
    <main className="min-h-screen overflow-x-clip bg-fo-bg text-fo-text">
      <LandingNavbar />

      {/* Hero */}
      <section className="relative overflow-x-hidden">
        <div className="landing-hero-glow absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-5 pb-28 max-lg:pt-[calc(var(--landing-header-h)+1.75rem)] sm:px-8 sm:pb-36 sm:max-lg:pt-[calc(var(--landing-header-h)+2rem)] lg:px-8 lg:py-36 xl:py-44">
          <div className="landing-fade-up relative z-10 mx-auto w-full max-w-4xl lg:max-w-5xl">
            <HeroBadge />
            <LandingEyebrow>{t.hero.eyebrow}</LandingEyebrow>
            <h1 className="mt-6 text-[2.75rem] font-bold leading-[1.04] tracking-tight sm:text-6xl sm:leading-[1.02] lg:text-7xl lg:leading-[1.02] xl:text-[4.5rem]">
              {t.hero.title}
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-fo-text-muted/90 sm:mt-9 sm:text-xl sm:leading-9 lg:mt-10 lg:max-w-3xl lg:text-2xl lg:leading-10">
              {t.hero.subtitle}
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:mt-12 sm:flex-row sm:items-center lg:mt-14">
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
                href="/sign-in"
                className={buttonClassName({
                  variant: "secondary",
                  size: "lg",
                  fullWidth: true,
                  className:
                    "sm:w-auto sm:min-w-[200px] border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06]",
                })}
              >
                {t.hero.signIn}
              </Link>
            </div>
          </div>
        </div>
      </section>

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
          <p className="mx-auto mt-8 max-w-5xl text-base leading-8 text-fo-text-muted sm:mt-10 sm:text-lg sm:leading-8">
            {t.introduction.body}
          </p>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="border-t border-white/[0.06] bg-fo-bg-elevated/30 px-5 py-28 sm:px-8 sm:py-36"
      >
        <div className="mx-auto max-w-7xl">
          <LandingHeading
            title={t.howItWorks.title}
            subtitle={t.howItWorks.subtitle}
            align="center"
            className="landing-fade-up"
          />

          <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
            {t.howItWorks.steps.map((item) => (
              <StepCard
                key={item.step}
                step={item.step}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
        </div>
      </section>

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
        <div className="relative mx-auto max-w-2xl">
          <LandingHeading
            title={t.pricing.title}
            subtitle={t.pricing.subtitle}
            align="center"
          />

          <Card
            variant="elevated"
            className={cn(
              landingCardClass,
              "mt-14 space-y-8 p-10 shadow-[0_32px_80px_-36px_rgba(37,99,235,0.3)] sm:p-12"
            )}
          >
            <div className="text-center">
              <LandingEyebrow>{t.pricing.annualPlan}</LandingEyebrow>
              <CardTitle className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                {t.pricing.planName}
              </CardTitle>
              <div className="mt-10 flex max-w-full min-w-0 flex-wrap items-end justify-center gap-2 overflow-hidden">
                <span className="text-[72px] font-bold leading-none tracking-tighter text-fo-primary-bright min-[390px]:text-[88px] sm:text-8xl md:text-9xl">
                  $599
                </span>
                <span className="mb-2 text-3xl font-semibold leading-none tracking-tight text-fo-text-muted min-[390px]:text-4xl sm:text-5xl">
                  {t.pricing.perYear}
                </span>
              </div>
              <p className="mt-5 inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm font-semibold text-fo-primary-hover sm:text-base">
                {t.pricing.trialBadge}
              </p>
              <div className="mx-auto mt-6 max-w-lg space-y-3 rounded-xl border border-blue-500/20 bg-blue-500/10 px-5 py-4 text-left sm:text-center">
                <p className="text-sm leading-relaxed text-fo-text-muted sm:text-base">
                  {t.pricing.trialStartNote}
                </p>
                <p className="text-sm font-medium text-fo-text sm:text-base">
                  {t.pricing.trialSubscribeNote}
                </p>
              </div>
            </div>

            <ul className="space-y-4">
              {t.pricing.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-4 text-base text-fo-text-muted"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-fo-primary/15 text-xs font-bold text-fo-primary-hover">
                    ✓
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/onboarding?force=1"
              className={buttonClassName({
                size: "lg",
                fullWidth: true,
                className:
                  "w-full shadow-[0_20px_40px_-16px_rgba(37,99,235,0.55)] transition hover:shadow-[0_24px_48px_-14px_rgba(37,99,235,0.65)]",
              })}
            >
              {t.pricing.getStarted}
            </Link>
          </Card>

          <p className="mt-12 text-center text-xl font-semibold tracking-tight text-fo-success sm:text-2xl">
            {t.pricing.officersJoinFree}
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative border-t border-white/[0.06] px-5 py-24 sm:px-8 sm:py-32 lg:py-40">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(37,99,235,0.12),transparent_70%)]"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <LandingEyebrow>{t.cta.eyebrow}</LandingEyebrow>
          <h2 className="mt-6 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            {t.cta.title}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-fo-text-muted sm:text-xl">
            {t.cta.subtitle}
          </p>
          <p className="mt-5 text-sm font-semibold tracking-wide text-fo-primary-hover sm:text-base">
            {t.cta.tagline}
          </p>
          <Link
            href="/onboarding?force=1"
            className={buttonClassName({
              size: "lg",
              className: cn(
                "mt-10 inline-flex min-w-[240px] px-10",
                "shadow-[0_24px_48px_-16px_rgba(37,99,235,0.6)] transition hover:shadow-[0_28px_56px_-14px_rgba(37,99,235,0.7)]"
              ),
            })}
          >
            {t.cta.getStarted}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 text-sm text-fo-text-subtle sm:px-8 md:flex-row">
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <FlexOfficersLogoLink href="/" height={40} />
            <p>© {new Date().getFullYear()} FlexOfficers</p>
          </div>
          <div className="flex gap-8">
            <a href="#" className="transition hover:text-fo-text-muted">
              {t.footer.privacy}
            </a>
            <a href="#" className="transition hover:text-fo-text-muted">
              {t.footer.terms}
            </a>
            <a
              href="mailto:hello@flexofficers.com"
              className="transition hover:text-fo-text-muted"
            >
              {t.footer.contact}
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
