"use client";

import { CancelAssignmentButton } from "@/app/officer/CancelAssignmentButton";
import { ShiftDetailLink } from "@/components/shifts/shift-detail-link";
import { cn } from "@/lib/cn";
import type { AcceptedShiftTab } from "@/lib/officer-accepted-shift-data";
import { RemoveFromAcceptedListButton } from "./RemoveFromAcceptedListButton";

type AcceptedShiftActionsProps = {
  applicationId: string;
  shiftId: string;
  tab: AcceptedShiftTab;
  completedDateLabel: string;
  onListChange: () => void;
  layout?: "compact" | "desktop" | "mobile-row";
};

const mobileActionClass =
  "inline-flex min-h-9 min-w-[calc(50%-0.25rem)] flex-1 items-center justify-center rounded-lg border px-2 text-xs font-semibold transition";

export function AcceptedShiftActions({
  applicationId,
  shiftId,
  tab,
  completedDateLabel,
  onListChange,
  layout = "compact",
}: AcceptedShiftActionsProps) {
  const desktop = layout === "desktop";
  const mobileRow = layout === "mobile-row";

  const viewShiftClassName = cn(
    desktop
      ? "inline-flex min-h-10 w-full items-center justify-center rounded-lg border border-fo-primary-bright/40 bg-transparent px-3 py-2 text-sm font-semibold text-fo-primary-bright transition hover:border-fo-primary-bright hover:bg-fo-primary/10"
      : mobileRow
        ? cn(
            mobileActionClass,
            "border-fo-primary-bright/40 text-fo-primary-bright hover:border-fo-primary-bright hover:bg-fo-primary/10"
          )
        : "inline-flex min-h-8 items-center justify-center rounded-lg border border-fo-primary-bright/40 bg-transparent px-3 py-1.5 text-xs font-semibold text-fo-primary-bright transition hover:border-fo-primary-bright hover:bg-fo-primary/10"
  );

  const cancelClassName = desktop
    ? "min-h-10 px-3 py-2 text-sm"
    : mobileRow
      ? cn(
          mobileActionClass,
          "border-red-500/35 text-red-300 hover:border-red-500/50 hover:bg-red-500/10"
        )
      : "min-h-8 px-3 py-1.5 text-xs";

  if (mobileRow) {
    return (
      <div className="space-y-1.5">
        {tab === "completed" ? (
          <p className="text-[10px] font-medium text-fo-text-muted">
            Completed on{" "}
            <span className="font-semibold text-fo-success">{completedDateLabel}</span>
          </p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <ShiftDetailLink shiftId={shiftId} className={viewShiftClassName}>
            View Shift
          </ShiftDetailLink>

          {tab === "upcoming" ? (
            <CancelAssignmentButton
              applicationId={applicationId}
              label="Cancel"
              className={cancelClassName}
            />
          ) : null}

          {tab === "cancelled" ? (
            <RemoveFromAcceptedListButton
              applicationId={applicationId}
              onRemoved={onListChange}
              className={cn(mobileActionClass, "border-fo-border text-fo-text-muted hover:text-fo-text")}
            />
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-stretch", desktop ? "gap-2" : "gap-1.5")}>
      <ShiftDetailLink shiftId={shiftId} className={viewShiftClassName}>
        View Shift
      </ShiftDetailLink>

      {tab === "upcoming" ? (
        <CancelAssignmentButton
          applicationId={applicationId}
          className={cancelClassName}
        />
      ) : null}

      {tab === "completed" ? (
        <div
          className={cn(
            "leading-tight text-fo-text-muted",
            desktop ? "text-xs" : "text-[10px]"
          )}
        >
          <p className="font-medium uppercase tracking-wide text-fo-text-subtle">
            Completed on
          </p>
          <p className="mt-0.5 font-semibold text-fo-success">{completedDateLabel}</p>
        </div>
      ) : null}

      {tab === "cancelled" ? (
        <RemoveFromAcceptedListButton
          applicationId={applicationId}
          onRemoved={onListChange}
          className={desktop ? "min-h-10 w-full text-sm" : undefined}
        />
      ) : null}
    </div>
  );
}
