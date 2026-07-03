"use client";

import Link from "next/link";
import { IconShield } from "@/components/landing/icons";
import { buttonClassName, Card } from "@/components/ui";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { cn } from "@/lib/cn";

type ClientDashboardCtaProps = {
  className?: string;
};

export function ClientDashboardCta({ className }: ClientDashboardCtaProps) {
  const { t } = useLandingLanguage();
  const copy = t.dashboard.client;

  return (
    <Card
      variant="elevated"
      padding="none"
      className={cn(
        "fo-glass-card fo-glass-card-hover border border-white/10 p-4 sm:p-5",
        className
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-300 shadow-[0_0_20px_-6px_rgba(59,130,246,0.35)]">
            <IconShield className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="break-words text-base font-bold text-fo-text sm:text-lg">
              {copy.ctaTitle}
            </h2>
            <p className="mt-1.5 break-words text-sm leading-relaxed text-fo-text-muted">
              {copy.ctaDescription}
            </p>
          </div>
        </div>

        <Link
          href="/client/leads/new"
          className={buttonClassName({
            size: "md",
            className: "w-full sm:w-auto sm:self-start",
          })}
        >
          {copy.createLead}
        </Link>
      </div>
    </Card>
  );
}
