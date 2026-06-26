import Link from "next/link";
import type { ShiftStatus } from "@/app/generated/prisma/enums";
import {
  buttonClassName,
  Card,
  ShiftStatusBadge,
  StatusBadge,
} from "@/components/ui";
import { formatHourlyRate, formatShiftDateTime } from "@/lib/format-shift";
import CancelShiftButton from "./CancelShiftButton";
import DeleteShiftButton from "./DeleteShiftButton";

type CompanyShiftCardProps = {
  shiftId: string;
  title: string;
  hourlyRate: { toString: () => string };
  location: string;
  startTime: Date;
  endTime: Date;
  positionsNeeded: number;
  filledCount: number;
  specialRequirements: string;
  status: ShiftStatus;
};

export function CompanyShiftCard({
  shiftId,
  title,
  hourlyRate,
  location,
  startTime,
  endTime,
  positionsNeeded,
  filledCount,
  specialRequirements,
  status,
}: CompanyShiftCardProps) {
  const openPositions = Math.max(positionsNeeded - filledCount, 0);

  return (
    <Card variant="elevated" className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <ShiftStatusBadge status={status} />
        <StatusBadge variant="info">
          {filledCount} of {positionsNeeded} filled
        </StatusBadge>
        {status === "OPEN" ? (
          <StatusBadge variant="success">
            {openPositions} open
          </StatusBadge>
        ) : null}
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

      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href={`/shifts/${shiftId}`}
          className={buttonClassName({
            variant: "secondary",
            fullWidth: true,
            className: "w-full",
          })}
        >
          View
        </Link>

        <Link
          href={`/company/shifts/${shiftId}/edit`}
          className={buttonClassName({
            variant: "secondary",
            fullWidth: true,
            className: "w-full",
          })}
        >
          Edit
        </Link>

        <CancelShiftButton shiftId={shiftId} />
        <DeleteShiftButton shiftId={shiftId} />
      </div>
    </Card>
  );
}
