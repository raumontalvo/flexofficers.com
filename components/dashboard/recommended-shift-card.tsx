import Link from "next/link";
import type { ShiftStatus } from "@/app/generated/prisma/enums";
import {
  buttonClassName,
  Card,
  ShiftStatusBadge,
} from "@/components/ui";
import { formatHourlyRate, formatShiftDateTime } from "@/lib/format-shift";

type RecommendedShiftCardProps = {
  id: string;
  title: string;
  companyName: string;
  location: string;
  hourlyRate: { toString: () => string };
  startTime: Date;
  endTime: Date;
  status: ShiftStatus;
};

export function RecommendedShiftCard({
  id,
  title,
  companyName,
  location,
  hourlyRate,
  startTime,
  endTime,
  status,
}: RecommendedShiftCardProps) {
  return (
    <Card variant="elevated" className="fo-glass-card space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ShiftStatusBadge status={status} />
        <p className="text-2xl font-bold text-fo-primary-bright">
          {formatHourlyRate(hourlyRate)}
          <span className="ml-1 text-sm font-semibold text-fo-text-muted">/hr</span>
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-bold text-fo-text">{title}</h3>
        <p className="text-sm font-medium text-fo-text-muted">{companyName}</p>
        <p className="text-sm text-fo-text">{location}</p>
        <div className="space-y-1 text-sm text-fo-text-muted">
          <p>Starts {formatShiftDateTime(startTime)}</p>
          <p>Ends {formatShiftDateTime(endTime)}</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href={`/shifts/${id}`}
          className={buttonClassName({
            variant: "secondary",
            fullWidth: true,
            className: "w-full",
          })}
        >
          View Shift
        </Link>
        <Link
          href={`/shifts/${id}`}
          className={buttonClassName({
            fullWidth: true,
            className: "w-full",
          })}
        >
          Apply
        </Link>
      </div>
    </Card>
  );
}
