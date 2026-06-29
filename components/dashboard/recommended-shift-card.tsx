import Link from "next/link";
import type { ShiftStatus } from "@/app/generated/prisma/enums";
import { ShiftDetailLink } from "@/components/shifts/shift-detail-link";
import {
  buttonClassName,
  Card,
  ShiftStatusBadge,
} from "@/components/ui";
import { formatHourlyRate, formatShiftDateTime } from "@/lib/format-shift";
import { ShiftsIcon } from "@/components/nav/icons";

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
    <Card
      variant="elevated"
      padding="none"
      className="fo-glass-card fo-glass-card-hover flex h-full flex-col gap-2.5 p-3.5"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1 space-y-0.5">
          <h3 className="text-sm font-bold text-fo-text">{title}</h3>
          <p className="text-xs font-medium text-fo-primary-hover">{companyName}</p>
        </div>
        <ShiftStatusBadge status={status} />
      </div>

      <div className="space-y-1.5 text-xs">
        <p className="text-fo-text-muted">{location}</p>
        <p className="text-xl font-bold text-fo-primary-bright">
          {formatHourlyRate(hourlyRate)}
          <span className="ml-1 text-xs font-semibold text-fo-text-muted">/hr</span>
        </p>
        <div className="space-y-0.5 text-fo-text-subtle">
          <p>Starts {formatShiftDateTime(startTime)}</p>
          <p>Ends {formatShiftDateTime(endTime)}</p>
        </div>
      </div>

      <ShiftDetailLink
        shiftId={id}
        className={buttonClassName({
          fullWidth: true,
          className: "mt-auto !min-h-9 w-full !py-2 !text-xs",
        })}
      >
        View &amp; Apply
      </ShiftDetailLink>
    </Card>
  );
}

export function EmptyShiftsCard() {
  return (
    <Card
      variant="elevated"
      padding="none"
      className="fo-glass-card fo-glass-card-hover relative overflow-hidden px-4 py-8 text-center"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.1),transparent_70%)]"
        aria-hidden="true"
      />
      <div className="relative">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-300">
          <ShiftsIcon className="h-6 w-6" />
        </div>
        <p className="text-sm font-semibold text-fo-text">
          No open shifts available right now.
        </p>
        <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-fo-text-muted">
          Check back soon as companies post new security assignments.
        </p>
        <Link
          href="/shifts"
          className={buttonClassName({
            variant: "primary",
            size: "md",
            className: "!min-h-9 mt-4 !px-4 !py-2 !text-xs",
          })}
        >
          Browse All Shifts
        </Link>
      </div>
    </Card>
  );
}
