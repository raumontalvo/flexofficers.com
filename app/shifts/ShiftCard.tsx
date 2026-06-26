import Link from "next/link";
import type { ShiftStatus } from "@/app/generated/prisma/enums";
import {
  buttonClassName,
  Card,
  ShiftStatusBadge,
  StatusBadge,
} from "@/components/ui";
import { formatHourlyRate, formatShiftDateTime } from "@/lib/format-shift";

type ShiftCardProps = {
  id: string;
  title: string;
  hourlyRate: { toString: () => string };
  companyName?: string | null;
  location: string;
  startTime: Date;
  endTime: Date;
  positionsNeeded: number;
  filledCount: number;
  specialRequirements: string;
  status: ShiftStatus;
};

export function ShiftCard({
  id,
  title,
  hourlyRate,
  companyName,
  location,
  startTime,
  endTime,
  positionsNeeded,
  filledCount,
  specialRequirements,
  status,
}: ShiftCardProps) {
  const openPositions = Math.max(positionsNeeded - filledCount, 0);

  return (
    <Card variant="elevated" className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <ShiftStatusBadge status={status} />
        <StatusBadge variant="info">
          {openPositions} of {positionsNeeded} open
        </StatusBadge>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-bold tracking-tight text-fo-text sm:text-2xl">
          {title}
        </h2>

        <p className="text-3xl font-bold text-fo-primary-bright sm:text-4xl">
          {formatHourlyRate(hourlyRate)}
          <span className="ml-1 text-lg font-semibold text-fo-text-muted">
            /hr
          </span>
        </p>

        {companyName ? (
          <p className="text-sm font-medium text-fo-text-muted">{companyName}</p>
        ) : null}

        <p className="text-base text-fo-text">{location}</p>

        <div className="space-y-1 text-sm text-fo-text-muted">
          <p>Starts {formatShiftDateTime(startTime)}</p>
          <p>Ends {formatShiftDateTime(endTime)}</p>
        </div>
      </div>

      {specialRequirements ? (
        <div className="rounded-2xl border border-fo-border bg-fo-bg-elevated p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-fo-text-subtle">
            Special requirements
          </p>
          <p className="mt-2 text-sm text-fo-text">{specialRequirements}</p>
        </div>
      ) : null}

      <Link
        href={`/shifts/${id}`}
        className={buttonClassName({ fullWidth: true, className: "w-full" })}
      >
        View Shift
      </Link>
    </Card>
  );
}
