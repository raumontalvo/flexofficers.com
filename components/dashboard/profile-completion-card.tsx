import Link from "next/link";
import type { ArmedStatus } from "@/app/generated/prisma/enums";
import {
  buttonClassName,
  Card,
  CardDescription,
  CardTitle,
  StatusBadge,
} from "@/components/ui";
import {
  formatArmedStatusLabel,
} from "@/lib/profile-options";
import {
  getOfficerProfileCompletionFields,
  getProfileCompletionPercent,
} from "@/lib/officer-profile-completion";
import { cn } from "@/lib/cn";

type ProfileCompletionCardProps = {
  officer: {
    phone?: string | null;
    armedStatuses?: ArmedStatus[];
    experienceCategories?: string[];
    experienceYears?: number | null;
    licenseExpirationDate?: Date | null;
  } | null;
};

export function ProfileCompletionCard({ officer }: ProfileCompletionCardProps) {
  const fields = getOfficerProfileCompletionFields(officer);
  const incompleteFields = fields.filter((field) => !field.complete);
  const completionPercent = getProfileCompletionPercent(officer);
  const isComplete = incompleteFields.length === 0;

  return (
    <Card
      variant="elevated"
      className={cn(
        "fo-glass-card space-y-5",
        isComplete ? "border-green-500/20" : "border-yellow-500/20"
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <CardTitle className="text-xl">
            {isComplete ? "Profile complete" : "Complete your profile"}
          </CardTitle>
          <CardDescription className="mt-2 max-w-2xl">
            {isComplete
              ? "Companies can review your qualifications, experience, and credentials."
              : "Finish these items so companies can review you for open shifts."}
          </CardDescription>
        </div>

        <div className="rounded-2xl border border-fo-border bg-fo-bg/60 px-4 py-3 text-center">
          <p className="text-2xl font-bold text-fo-primary-bright">
            {completionPercent}%
          </p>
          <p className="text-xs uppercase tracking-wide text-fo-text-subtle">
            Complete
          </p>
        </div>
      </div>

      {!isComplete ? (
        <ul className="space-y-2 text-sm text-fo-text">
          {incompleteFields.map((field) => (
            <li key={field.id} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-fo-pending" />
              <span>{field.label}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {(officer?.armedStatuses?.length ?? 0) > 0 ||
      (officer?.experienceCategories?.length ?? 0) > 0 ? (
        <div className="space-y-4 rounded-2xl border border-fo-border bg-fo-bg/50 p-4">
          {(officer?.armedStatuses?.length ?? 0) > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-fo-text-subtle">
                Armed / Unarmed
              </p>
              <div className="flex flex-wrap gap-2">
                {officer?.armedStatuses?.map((status) => (
                  <StatusBadge key={status} variant="info">
                    {formatArmedStatusLabel(status)}
                  </StatusBadge>
                ))}
              </div>
            </div>
          ) : null}

          {(officer?.experienceCategories?.length ?? 0) > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-fo-text-subtle">
                Experience
              </p>
              <div className="flex flex-wrap gap-2">
                {officer?.experienceCategories?.map((category) => (
                  <StatusBadge key={category} variant="neutral">
                    {category}
                  </StatusBadge>
                ))}
              </div>
            </div>
          ) : null}

          {officer?.experienceYears !== null &&
          officer?.experienceYears !== undefined ? (
            <p className="text-sm text-fo-text-muted">
              {officer.experienceYears} years of experience
              {officer.licenseExpirationDate
                ? ` · License expires ${officer.licenseExpirationDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                : ""}
            </p>
          ) : null}
        </div>
      ) : null}

      {!isComplete ? (
        <Link
          href="/officer/profile"
          className={buttonClassName({
            variant: "primary",
            size: "md",
            className: "w-full sm:w-auto",
          })}
        >
          Complete Profile
        </Link>
      ) : (
        <Link
          href="/officer/profile"
          className={buttonClassName({
            variant: "secondary",
            size: "md",
            className: "w-full sm:w-auto",
          })}
        >
          Edit Profile
        </Link>
      )}
    </Card>
  );
}
