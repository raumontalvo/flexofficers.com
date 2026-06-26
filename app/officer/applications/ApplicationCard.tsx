import Link from "next/link";
import type { ApplicationStatus, ShiftStatus } from "@/app/generated/prisma/enums";
import {
  ApplicationStatusBadge,
  buttonClassName,
  Card,
  ShiftStatusBadge,
  StatusBadge,
} from "@/components/ui";
import { formatHourlyRate, formatShiftDateTime } from "@/lib/format-shift";
import WithdrawApplicationButton from "./WithdrawApplicationButton";

type ApplicationCardProps = {
  applicationId: string;
  applicationStatus: ApplicationStatus;
  shiftId: string;
  title: string;
  hourlyRate: { toString: () => string };
  companyName?: string | null;
  location: string;
  startTime: Date;
  endTime: Date;
  positionsNeeded: number;
  specialRequirements: string;
  shiftStatus: ShiftStatus;
};

export function ApplicationCard({
  applicationId,
  applicationStatus,
  shiftId,
  title,
  hourlyRate,
  companyName,
  location,
  startTime,
  endTime,
  positionsNeeded,
  specialRequirements,
  shiftStatus,
}: ApplicationCardProps) {
  const isWithdrawn = applicationStatus === "WITHDRAWN";
  const isAccepted = applicationStatus === "ACCEPTED";
  const isPending = applicationStatus === "PENDING";
  const isShiftCancelled = shiftStatus === "CANCELLED";

  return (
    <Card
      variant={isWithdrawn ? "muted" : "elevated"}
      className="space-y-4"
    >
      <div className="flex flex-wrap items-center gap-2">
        <ApplicationStatusBadge status={applicationStatus} />
        <ShiftStatusBadge status={shiftStatus} />
        <StatusBadge variant="info">
          {positionsNeeded} {positionsNeeded === 1 ? "position" : "positions"}
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

      {isWithdrawn ? (
        <div className="rounded-2xl border border-fo-border-strong bg-fo-neutral-bg p-4">
          <p className="text-sm font-medium text-fo-text-muted">
            You withdrew this application. It is no longer under review.
          </p>
        </div>
      ) : null}

      {isAccepted ? (
        <div className="rounded-2xl border border-green-500/20 bg-fo-success-bg p-4">
          <p className="text-sm text-fo-success">
            You were accepted for this shift. View company contact details and
            reporting instructions on Accepted Shifts.
          </p>
        </div>
      ) : null}

      {isShiftCancelled ? (
        <div className="rounded-2xl border border-yellow-500/20 bg-fo-pending-bg p-4">
          <p className="text-sm text-fo-pending">
            This shift was cancelled by the company.
          </p>
        </div>
      ) : null}

      <div className="space-y-3">
        {isAccepted ? (
          <Link
            href="/officer/accepted-shifts"
            className={buttonClassName({ fullWidth: true, className: "w-full" })}
          >
            View Accepted Details
          </Link>
        ) : null}

        <Link
          href={`/shifts/${shiftId}`}
          className={buttonClassName({
            variant: isAccepted ? "secondary" : "primary",
            fullWidth: true,
            className: "w-full",
          })}
        >
          View Shift
        </Link>

        {isPending ? (
          <WithdrawApplicationButton applicationId={applicationId} />
        ) : null}
      </div>
    </Card>
  );
}
