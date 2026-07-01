"use client";

import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { getInviteHowItWorksSteps } from "@/lib/i18n/ui-labels";

export function InvitesHowItWorksPanel() {
  const { t } = useLandingLanguage();
  const howItWorks = t.browse.invites.howItWorks;
  const steps = getInviteHowItWorksSteps(t);

  return (
    <aside className="hidden lg:block lg:sticky lg:top-6 lg:self-start">
      <section className="fo-glass-card rounded-xl border border-white/10 p-3">
        <h2 className="text-sm font-semibold text-fo-text">{howItWorks.title}</h2>
        <ol className="mt-3 space-y-2.5">
          {steps.map((step, index) => (
            <li key={step.title} className="flex gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10 text-[10px] font-bold text-blue-100">
                {index + 1}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-fo-text">{step.title}</p>
                <p className="mt-0.5 text-[11px] leading-snug text-fo-text-muted">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </aside>
  );
}
