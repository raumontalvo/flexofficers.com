import Link from "next/link";
import type { ArmedStatus } from "@/app/generated/prisma/enums";
import {
  buttonClassName,
  Card,
  CardDescription,
  CardTitle,
} from "@/components/ui";
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
    licenses?: Array<{
      id: string;
      licenseType: string;
      licenseNumber: string;
      issuingState: string;
      expirationDate: Date;
    }>;
  } | null;
  className?: string;
  compact?: boolean;
};

export function ProfileCompletionCard({
  officer,
  className,
  compact = false,
}: ProfileCompletionCardProps) {
  const fields = getOfficerProfileCompletionFields(officer);
  const incompleteFields = fields.filter((field) => !field.complete);
  const completionPercent = getProfileCompletionPercent(officer);
  const isComplete = incompleteFields.length === 0;

  return (
    <Card
      variant="elevated"
      padding="none"
      className={cn(
        "fo-glass-card fo-glass-card-hover flex h-full flex-col justify-between gap-3 p-3.5",
        isComplete ? "border-emerald-500/25" : "border-sky-500/25",
        className
      )}
    >
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm font-semibold">Profile Completion</CardTitle>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-fo-primary-bright/30 bg-fo-primary/10">
            <span className="text-xs font-bold text-fo-primary-bright">
              {completionPercent}%
            </span>
          </div>
        </div>

        <CardDescription className="text-[11px] leading-snug">
          {isComplete
            ? "Ready to apply to shifts and be reviewed by companies."
            : "Complete your profile before you can apply to shifts."}
        </CardDescription>

        <div className="space-y-1 pt-1 md:pt-0">
          <div
            className="h-2 overflow-hidden rounded-full bg-slate-800/80 md:h-1.5"
            role="progressbar"
            aria-valuenow={completionPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Profile completion"
          >
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                isComplete
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                  : "bg-gradient-to-r from-fo-primary via-fo-primary-bright to-sky-400"
              )}
              style={{ width: `${completionPercent}%` }}
            />
          </div>
          <p className="text-[10px] text-fo-text-subtle">
            {isComplete
              ? "All fields complete"
              : `${incompleteFields.length} field${incompleteFields.length === 1 ? "" : "s"} left`}
          </p>
        </div>
      </div>

      <Link
        href="/officer/profile"
        className={buttonClassName({
          variant: isComplete ? "secondary" : "primary",
          size: "md",
          fullWidth: true,
          className: cn("!min-h-9 !py-2 !text-xs", compact && "w-full"),
        })}
      >
        {isComplete ? "Edit Profile" : "Complete Profile"}
      </Link>
    </Card>
  );
}
