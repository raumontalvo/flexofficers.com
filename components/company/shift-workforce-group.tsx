"use client";

import { cn } from "@/lib/cn";
import type { CompanyShiftWorkforceGroup } from "@/lib/company-workforce-data";
import {
  formatShiftGroupSchedule,
  getStaffingProgress,
} from "@/lib/company-workforce-data";
import { AcceptedOfficerCard } from "./accepted-officer-card";

type ShiftWorkforceGroupProps = {
  group: CompanyShiftWorkforceGroup;
  showRemove?: boolean;
  showHideFromList?: boolean;
  cancelled?: boolean;
  onHidden?: () => void;
};

function ShiftStaffingSummary({
  filledCount,
  positionsNeeded,
  staffing,
}: {
  filledCount: number;
  positionsNeeded: number;
  staffing: ReturnType<typeof getStaffingProgress>;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="font-semibold text-fo-text">
          {filledCount} / {positionsNeeded} Filled
        </span>
        <span
          className={cn(
            "font-medium",
            staffing.fullyStaffed ? "text-fo-success" : "text-fo-text-muted"
          )}
        >
          {staffing.remainingLabel}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-800/80">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            staffing.fullyStaffed ? "bg-green-500" : "bg-fo-primary-bright"
          )}
          style={{ width: `${staffing.percent}%` }}
        />
      </div>
    </div>
  );
}

export function ShiftWorkforceGroup({
  group,
  showRemove = true,
  showHideFromList = false,
  cancelled = false,
  onHidden,
}: ShiftWorkforceGroupProps) {
  const schedule = formatShiftGroupSchedule(
    group.shift.startTime,
    group.shift.endTime
  );
  const staffing = getStaffingProgress(
    group.filledCount,
    group.shift.positionsNeeded
  );

  return (
    <section>
      <div className="lg:hidden">
        <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
          <div className="border-b border-white/[0.06] p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-sm font-semibold text-fo-text">
                  {group.shift.title}
                </h2>
                <p className="mt-0.5 text-xs text-fo-text-muted">
                  {schedule.dateLabel} · {schedule.timeLabel}
                </p>
              </div>
              <span
                className={cn(
                  "shrink-0 text-xs font-semibold tabular-nums",
                  staffing.fullyStaffed ? "text-fo-success" : "text-fo-text"
                )}
              >
                {group.filledCount} / {group.shift.positionsNeeded}
              </span>
            </div>

            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800/80">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  staffing.fullyStaffed ? "bg-green-500" : "bg-fo-primary-bright"
                )}
                style={{ width: `${staffing.percent}%` }}
              />
            </div>

            <p
              className={cn(
                "mt-1 text-[11px] font-medium",
                staffing.fullyStaffed ? "text-fo-success" : "text-fo-text-muted"
              )}
            >
              {staffing.remainingLabel}
            </p>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {group.officers.map((officerRecord) => (
              <AcceptedOfficerCard
                key={officerRecord.applicationId}
                officerRecord={officerRecord}
                showRemove={showRemove}
                showHideFromList={showHideFromList}
                cancelled={cancelled}
                shiftId={group.shift.id}
                onHidden={onHidden}
                layout="mobile-compact"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="hidden overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] lg:block">
        <div className="border-b border-white/[0.06] px-4 py-3">
          <div className="flex items-start justify-between gap-6">
            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold text-fo-text">
                {group.shift.title}
              </h2>
              <p className="mt-1 text-sm text-fo-text-muted">
                {schedule.dateLabel} · {schedule.timeLabel}
              </p>
            </div>

            <div className="w-[220px] shrink-0">
              <ShiftStaffingSummary
                filledCount={group.filledCount}
                positionsNeeded={group.shift.positionsNeeded}
                staffing={staffing}
              />
            </div>
          </div>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {group.officers.map((officerRecord) => (
            <AcceptedOfficerCard
              key={officerRecord.applicationId}
              officerRecord={officerRecord}
              showRemove={showRemove}
              showHideFromList={showHideFromList}
              cancelled={cancelled}
              shiftId={group.shift.id}
              onHidden={onHidden}
              layout="desktop-row"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
