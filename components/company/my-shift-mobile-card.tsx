"use client";

import { ShiftStatus } from "@/app/generated/prisma/enums";
import { ShiftActionsMenu } from "@/components/company/shift-actions-menu";
import { ShiftWorkforcePanel } from "@/components/company/shift-workforce-panel";
import { cn } from "@/lib/cn";
import {
  formatShiftDateBadgeParts,
  formatShiftDurationLabel,
  type SerializedCompanyShiftRow,
} from "@/lib/company-shifts-page";
import { formatHourlyRate, formatShiftTime } from "@/lib/format-shift";
import type { SerializedShiftWorkforce } from "@/lib/shift-workforce";

function MyShiftStatusBadge({ status }: { status: ShiftStatus }) {
  const styles = {
    [ShiftStatus.OPEN]:
      "border-green-500/25 bg-green-500/10 text-green-200",
    [ShiftStatus.INVITED]:
      "border-amber-500/25 bg-amber-500/10 text-amber-200",
    [ShiftStatus.PARTIALLY_FILLED]:
      "border-blue-500/25 bg-blue-500/10 text-blue-100",
    [ShiftStatus.FILLED]:
      "border-green-500/25 bg-green-500/10 text-green-200",
    [ShiftStatus.CANCELLED]:
      "border-red-500/20 bg-white/[0.04] text-fo-text-muted",
    [ShiftStatus.COMPLETED]:
      "border-blue-500/20 bg-white/[0.04] text-fo-text-muted",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center justify-center rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide",
        styles[status] ?? styles[ShiftStatus.COMPLETED]
      )}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}

type MyShiftMobileCardProps = {
  shift: SerializedCompanyShiftRow;
  workforce?: SerializedShiftWorkforce;
  rosterExpanded: boolean;
  onToggleRoster: () => void;
};

export function MyShiftMobileCard({
  shift,
  workforce,
  rosterExpanded,
  onToggleRoster,
}: MyShiftMobileCardProps) {
  const startTime = new Date(shift.startTime);
  const endTime = new Date(shift.endTime);
  const dateBadge = formatShiftDateBadgeParts(startTime);
  const duration = formatShiftDurationLabel(startTime, endTime);
  const openPositions = Math.max(shift.positionsNeeded - shift.filledCount, 0);
  const location = shift.locationSubtext
    ? `${shift.locationLabel} · ${shift.locationSubtext}`
    : shift.locationLabel;

  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.55)]">
      <div className="flex items-start gap-3">
        <div className="flex w-[3.25rem] shrink-0 flex-col items-center justify-center rounded-xl border border-fo-primary-bright/20 bg-fo-primary-bright/10 px-2 py-2 text-center">
          <span className="text-[10px] font-bold tracking-wide text-fo-primary-hover">
            {dateBadge.weekday}
          </span>
          <span className="mt-0.5 text-[10px] font-bold leading-none text-fo-primary-hover">
            {dateBadge.month}
          </span>
          <span className="mt-0.5 text-sm font-bold leading-none text-fo-primary-hover">
            {dateBadge.day}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-fo-text">{shift.title}</p>
          <p className="mt-0.5 truncate text-xs text-fo-text-muted">{location}</p>
          <p className="mt-1.5 text-xs text-fo-text-muted">
            {formatShiftTime(startTime)} – {formatShiftTime(endTime)}
            {duration ? ` ${duration}` : ""}
          </p>
          <p className="mt-1 text-xs text-fo-text-muted">
            {openPositions} open position
            {openPositions === 1 ? "" : "s"} remaining
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <MyShiftStatusBadge status={shift.status} />
          <p className="text-sm font-bold leading-none text-fo-primary-bright">
            {formatHourlyRate(shift.hourlyRate)}
            <span className="text-[10px] font-semibold text-fo-text-muted">/hr</span>
          </p>
          <ShiftActionsMenu
            shiftId={shift.id}
            status={shift.status}
            rosterExpanded={rosterExpanded}
            onViewRoster={onToggleRoster}
          />
        </div>
      </div>

      {rosterExpanded && workforce ? (
        <div className="mt-3 border-t border-white/[0.06] pt-3">
          <ShiftWorkforcePanel workforce={workforce} />
        </div>
      ) : null}
    </article>
  );
}
