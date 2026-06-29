import Link from "next/link";
import { buttonClassName, Card, CardDescription, CardTitle } from "@/components/ui";
import { getIncompleteProfileLabels } from "@/lib/officer-profile-completion";
import type { ArmedStatus } from "@/app/generated/prisma/enums";
import { cn } from "@/lib/cn";

type OfficerProfileApplyNoticeProps = {
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

export function OfficerProfileApplyNotice({
  officer,
  className,
  compact = false,
}: OfficerProfileApplyNoticeProps) {
  const incompleteLabels = getIncompleteProfileLabels(officer);

  if (incompleteLabels.length === 0) {
    return null;
  }

  return (
    <Card
      variant="elevated"
      padding="none"
      className={cn(
        "fo-glass-card border-sky-500/25",
        compact ? "space-y-2.5 p-3" : "space-y-3 p-4",
        className
      )}
    >
      <div className="space-y-1">
        <CardTitle className={cn("font-semibold", compact ? "text-sm" : "text-base")}>
          Complete your profile to apply
        </CardTitle>
        <CardDescription className={cn(compact ? "text-[11px]" : "text-sm")}>
          Finish the items below before you can apply to shifts.
        </CardDescription>
      </div>

      <ul
        className={cn(
          "list-disc space-y-1 pl-5 text-fo-text-muted",
          compact ? "text-[11px] leading-snug" : "text-sm leading-relaxed"
        )}
      >
        {incompleteLabels.map((label) => (
          <li key={label}>{label}</li>
        ))}
      </ul>

      <Link
        href="/officer/profile"
        className={buttonClassName({
          variant: "primary",
          size: compact ? "md" : "lg",
          fullWidth: true,
          className: compact ? "!min-h-9 !py-2 !text-xs" : undefined,
        })}
      >
        Complete Profile
      </Link>
    </Card>
  );
}
