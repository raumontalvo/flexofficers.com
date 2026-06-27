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
    <section className="space-y-2">
      <div className="fo-glass-card rounded-lg border border-white/10 p-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-fo-text">{group.shift.title}</h2>
            <p className="mt-1 text-sm text-fo-text-muted">{schedule.dateLabel}</p>
            <p className="text-sm text-fo-text-muted">{schedule.timeLabel}</p>
          </div>

          <div className="min-w-[220px] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-fo-text-muted">
                Need: {group.shift.positionsNeeded}{" "}
                {group.shift.positionsNeeded === 1 ? "Officer" : "Officers"}
              </span>
              <span
                className={cn(
                  "font-semibold",
                  staffing.fullyStaffed ? "text-fo-success" : "text-fo-text"
                )}
              >
                {staffing.label}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-800/80">
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
                "text-xs font-medium",
                staffing.fullyStaffed ? "text-fo-success" : "text-fo-text-muted"
              )}
            >
              {staffing.remainingLabel}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        {group.officers.map((officerRecord) => (
          <AcceptedOfficerCard
            key={officerRecord.applicationId}
            officerRecord={officerRecord}
            showRemove={showRemove}
            showHideFromList={showHideFromList}
            cancelled={cancelled}
            shiftId={group.shift.id}
            onHidden={onHidden}
          />
        ))}
      </div>
    </section>
  );
}
