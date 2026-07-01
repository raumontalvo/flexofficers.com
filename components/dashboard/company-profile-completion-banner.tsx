"use client";

import Link from "next/link";
import { buttonClassName } from "@/components/ui";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { interpolate } from "@/lib/app-i18n";
import type { CompanyProfileFieldId } from "@/lib/company-profile-completion";

type CompanyProfileCompletionBannerProps = {
  completionPercent: number;
  missingFieldIds: CompanyProfileFieldId[];
};

export function CompanyProfileCompletionBanner({
  completionPercent,
  missingFieldIds,
}: CompanyProfileCompletionBannerProps) {
  const { t } = useLandingLanguage();
  const copy = t.dashboard.company;

  if (missingFieldIds.length === 0) {
    return null;
  }

  return (
    <section className="fo-glass-card rounded-xl border border-amber-500/25 bg-amber-500/[0.04] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-semibold text-amber-100">
              {copy.profileBannerTitle}
            </h2>
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-200">
              {interpolate(copy.profileBannerPercent, { percent: completionPercent })}
            </span>
          </div>

          <ul className="mt-3 space-y-1.5">
            {missingFieldIds.map((fieldId) => (
              <li
                key={fieldId}
                className="flex items-center gap-2 text-xs text-fo-text-muted"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                <span>{copy.profileFields[fieldId]}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs leading-relaxed text-fo-text-muted">
            {copy.profileBannerNote}
          </p>
        </div>

        <Link
          href="/company/profile"
          className={buttonClassName({
            variant: "secondary",
            size: "md",
            className:
              "shrink-0 self-start border-amber-500/30 text-amber-100 hover:bg-amber-500/10",
          })}
        >
          {t.common.completeProfile}
        </Link>
      </div>
    </section>
  );
}
