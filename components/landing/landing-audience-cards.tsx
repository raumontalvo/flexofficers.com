"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { IconShield } from "@/components/landing/icons";
import { CompaniesIcon, ProfileIcon } from "@/components/nav/icons";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { buttonClassName, Card } from "@/components/ui";
import { cn } from "@/lib/cn";

const audienceCardClassName = cn(
  "flex h-full min-w-0 flex-col border-slate-700/80 bg-gradient-to-b from-[#0c1424] via-fo-bg-elevated to-[#070d18]",
  "p-5 shadow-[0_12px_40px_rgba(0,0,0,0.35)] sm:p-6"
);

function AudienceCard({
  title,
  description,
  bullets,
  cta,
  href,
  icon,
}: {
  title: string;
  description: string;
  bullets: string[];
  cta: string;
  href: string;
  icon: ReactNode;
}) {
  return (
    <Card variant="elevated" className={audienceCardClassName}>
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-fo-primary-bright/50 bg-fo-primary/10 text-fo-primary-bright">
        {icon}
      </div>
      <h3 className="text-lg font-bold tracking-tight text-fo-text sm:text-xl">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-fo-text-muted sm:text-base">
        {description}
      </p>
      <ul className="mt-4 space-y-2.5">
        {bullets.map((item) => (
          <li
            key={item}
            className="flex min-w-0 items-start gap-2.5 text-sm text-fo-text-muted"
          >
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-fo-primary/15 text-xs font-bold text-fo-primary-hover">
              ✓
            </span>
            <span className="min-w-0">{item}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-6">
        <Link
          href={href}
          className={buttonClassName({
            fullWidth: true,
            size: "md",
            className: "w-full gap-2",
          })}
        >
          {icon}
          {cta}
        </Link>
      </div>
    </Card>
  );
}

export function LandingAudienceCards() {
  const { t } = useLandingLanguage();
  const audience = t.audience;

  return (
    <section className="border-t border-white/[0.06] bg-fo-bg-elevated/20 px-5 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-3 lg:gap-6">
          <AudienceCard
            title={audience.officer.title}
            description={audience.officer.description}
            bullets={audience.officer.bullets}
            cta={audience.officer.cta}
            href="/onboarding?force=1&role=OFFICER"
            icon={<ProfileIcon className="h-5 w-5 shrink-0" />}
          />
          <AudienceCard
            title={audience.company.title}
            description={audience.company.description}
            bullets={audience.company.bullets}
            cta={audience.company.cta}
            href="/onboarding?force=1&role=COMPANY"
            icon={<CompaniesIcon className="h-5 w-5 shrink-0" />}
          />
          <AudienceCard
            title={audience.client.title}
            description={audience.client.description}
            bullets={audience.client.bullets}
            cta={audience.client.cta}
            href="/onboarding?force=1&role=CLIENT"
            icon={<IconShield className="h-5 w-5 shrink-0" />}
          />
        </div>

        <Card
          variant="muted"
          className="mt-6 border-blue-500/20 bg-blue-500/10 !p-4 sm:!p-5"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
            <IconShield className="mx-auto h-7 w-7 shrink-0 text-fo-primary-bright sm:mx-0" />
            <div className="space-y-2 text-center text-sm leading-relaxed text-fo-text sm:text-left sm:text-base">
              <p>{audience.important.company}</p>
              <p>{audience.important.officer}</p>
              <p>{audience.important.client}</p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
