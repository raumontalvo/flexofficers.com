"use client";

import type { ComponentType, SVGProps } from "react";
import {
  IconCalendar,
  IconCheck,
  IconLayout,
  IconMessageCircle,
  IconShield,
  IconUsers,
} from "@/components/landing/icons";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import type { LandingTranslations } from "@/lib/landing-i18n";
import { Card } from "@/components/ui";
import { cn } from "@/lib/cn";

const stepIcons = [
  IconUsers,
  IconLayout,
  IconCalendar,
  IconMessageCircle,
  IconShield,
  IconLayout,
] as const;

const stepCardClass = cn(
  "landing-card-lift !h-auto !min-h-0 min-w-0 self-start rounded-2xl border border-blue-500/20",
  "bg-gradient-to-b from-[#0c1424]/95 via-fo-bg-elevated/85 to-[#070d18]/95",
  "p-5 shadow-[0_12px_40px_rgba(0,0,0,0.35)] lg:p-6",
  "transition hover:border-blue-500/35 hover:shadow-[0_16px_48px_-12px_rgba(37,99,235,0.28)]"
);

function StepIconBox({
  icon: Icon,
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10 text-fo-primary-bright shadow-[0_0_16px_-4px_rgba(37,99,235,0.35)]">
      <Icon className="h-5 w-5" strokeWidth={1.75} />
    </div>
  );
}

function StepLabel({ children }: { children: string }) {
  return (
    <p className="mt-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-fo-primary-hover">
      {children}
    </p>
  );
}

function StepTitle({ children }: { children: string }) {
  return (
    <h3 className="mt-1 text-base font-bold leading-snug tracking-tight text-fo-text lg:text-lg">
      {children}
    </h3>
  );
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 space-y-1.5">
      {items.map((item) => (
        <li
          key={item}
          className="flex min-w-0 items-start gap-2 text-xs leading-snug text-fo-text-muted"
        >
          <IconCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-fo-primary-bright" />
          <span className="min-w-0">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function RoleSections({
  roles,
}: {
  roles: Array<{ label: string; body: string }>;
}) {
  return (
    <div className="mt-2.5 space-y-2">
      {roles.map((role) => (
        <div key={role.label} className="min-w-0">
          <p className="text-xs font-semibold text-fo-text">{role.label}</p>
          <p className="mt-0.5 text-xs leading-snug text-fo-text-muted">
            {role.body}
          </p>
        </div>
      ))}
    </div>
  );
}

function ManageColumns({
  companies,
  officers,
  clients,
  labels,
}: {
  companies: string[];
  officers: string[];
  clients: string[];
  labels: { companies: string; officers: string; clients: string };
}) {
  return (
    <div className="mt-2.5 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-3">
      <div className="min-w-0">
        <p className="text-xs font-semibold text-fo-text">{labels.companies}</p>
        <CheckList items={companies} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-fo-text">{labels.officers}</p>
        <CheckList items={officers} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-fo-text">{labels.clients}</p>
        <CheckList items={clients} />
      </div>
    </div>
  );
}

function HowItWorksStepCard({
  step,
  icon,
  manageLabels,
}: {
  step: LandingTranslations["howItWorks"]["steps"][number];
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  manageLabels: LandingTranslations["howItWorks"]["manageLabels"];
}) {
  return (
    <Card padding="none" variant="elevated" className={stepCardClass}>
      <StepIconBox icon={icon} />
      <StepLabel>{step.step}</StepLabel>
      <StepTitle>{step.title}</StepTitle>

      {step.layout === "list" ? (
        <>
          <CheckList items={step.items} />
          <p className="mt-2 text-sm leading-snug text-fo-text-muted">
            {step.description}
          </p>
        </>
      ) : null}

      {step.layout === "roles" ? <RoleSections roles={step.roles} /> : null}

      {step.layout === "list-only" ? <CheckList items={step.items} /> : null}

      {step.layout === "manage" ? (
        <ManageColumns
          companies={step.companies}
          officers={step.officers}
          clients={step.clients}
          labels={manageLabels}
        />
      ) : null}
    </Card>
  );
}

function ImportantBar({
  items,
}: {
  items: Array<{ text: string; icon: ComponentType<SVGProps<SVGSVGElement>> }>;
}) {
  return (
    <Card
      padding="none"
      variant="muted"
      className="mt-8 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.25)]"
    >
      <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-3 md:gap-5">
        {items.map(({ text, icon: Icon }) => (
          <div
            key={text}
            className="flex min-w-0 items-start gap-2.5 md:items-center"
          >
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

export function LandingHowItWorks() {
  const { t } = useLandingLanguage();
  const { manageLabels } = t.howItWorks;

  return (
    <section
      id="how-it-works"
      className="scroll-mt-[var(--landing-header-h)] border-t border-white/[0.06] bg-gradient-to-b from-[#050a14] via-fo-bg to-[#0a1220] px-5 py-16 sm:px-8 sm:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-fo-primary-hover">
            {t.howItWorks.badge}
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-fo-text sm:text-4xl lg:text-5xl">
            {t.howItWorks.title}
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-fo-text-muted sm:mt-4 sm:text-base">
            {t.howItWorks.subtitle}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 items-start gap-5 lg:grid-cols-3 lg:gap-6">
          {t.howItWorks.steps.map((step, index) => {
            const Icon = stepIcons[index] ?? IconLayout;
            return (
              <HowItWorksStepCard
                key={step.step}
                step={step}
                icon={Icon}
                manageLabels={manageLabels}
              />
            );
          })}
        </div>

        <ImportantBar
          items={[
            { text: t.howItWorks.important.company, icon: IconShield },
            { text: t.howItWorks.important.officer, icon: IconCheck },
            { text: t.howItWorks.important.client, icon: IconUsers },
          ]}
        />
      </div>
    </section>
  );
}
