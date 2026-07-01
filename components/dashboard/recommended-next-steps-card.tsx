"use client";

import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import type { ArmedStatus } from "@/app/generated/prisma/enums";
import {
  AcceptedIcon,
  ProfileIcon,
  ShiftsIcon,
  UpcomingIcon,
} from "@/components/nav/icons";
import { buttonClassName, Card, CardDescription, CardTitle } from "@/components/ui";
import { getOfficerProfileCompletionFields } from "@/lib/officer-profile-completion";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { cn } from "@/lib/cn";

type RecommendedNextStepsCardProps = {
  officer: {
    phone?: string | null;
    armedStatuses?: ArmedStatus[];
    experienceCategories?: string[];
    experienceYears?: number | null;
    licenses?: Array<{
      id: string;
      licenseType: string;
      licenseNumber: string;
      issuingState: string;
      expirationDate: Date;
    }>;
  } | null;
  className?: string;
};

const fieldMeta: Record<
  string,
  { icon: ComponentType<SVGProps<SVGSVGElement>>; iconClassName: string }
> = {
  phone: { icon: ProfileIcon, iconClassName: "bg-violet-500/15 text-violet-300" },
  armedStatuses: {
    icon: AcceptedIcon,
    iconClassName: "bg-blue-500/15 text-blue-300",
  },
  experienceCategories: {
    icon: ShiftsIcon,
    iconClassName: "bg-amber-500/15 text-amber-300",
  },
  experienceYears: {
    icon: UpcomingIcon,
    iconClassName: "bg-emerald-500/15 text-emerald-300",
  },
  licenses: {
    icon: ShiftsIcon,
    iconClassName: "bg-sky-500/15 text-sky-300",
  },
};

export function RecommendedNextStepsCard({
  officer,
  className,
}: RecommendedNextStepsCardProps) {
  const { t } = useLandingLanguage();
  const copy = t.dashboard.officer;
  const incompleteFields = getOfficerProfileCompletionFields(officer).filter(
    (field) => !field.complete
  );

  if (incompleteFields.length === 0) {
    return null;
  }

  return (
    <Card
      variant="elevated"
      padding="none"
      className={cn("fo-glass-card fo-glass-card-hover space-y-3 p-3.5", className)}
    >
      <div>
        <CardTitle className="text-sm font-semibold">{copy.recommendedSteps}</CardTitle>
        <CardDescription className="mt-0.5 text-xs">
          {copy.recommendedStepsSubtitle}
        </CardDescription>
      </div>

      <ul className="space-y-2">
        {incompleteFields.map((field) => {
          const meta = fieldMeta[field.id];
          const Icon = meta?.icon ?? ProfileIcon;
          const label =
            copy.profileFields[field.id as keyof typeof copy.profileFields] ??
            field.label;

          return (
            <li
              key={field.id}
              className="flex flex-wrap items-center gap-2.5 rounded-xl border border-white/[0.06] bg-fo-bg/40 px-2.5 py-2 sm:flex-nowrap"
            >
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                  meta?.iconClassName ?? "bg-fo-neutral-bg text-fo-text-muted"
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <p className="min-w-0 flex-1 text-xs font-medium text-fo-text sm:text-sm">
                {label}
              </p>
              <Link
                href="/officer/profile"
                className={buttonClassName({
                  variant: "secondary",
                  size: "md",
                  className: "!min-h-8 shrink-0 !px-3 !py-1.5 !text-xs",
                })}
              >
                {t.common.addNow}
              </Link>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
