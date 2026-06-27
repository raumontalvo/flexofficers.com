"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import type { AcceptedShiftTab } from "@/lib/officer-accepted-shift-data";
import { RemoveFromAcceptedListButton } from "./RemoveFromAcceptedListButton";

type AcceptedShiftActionsProps = {
  applicationId: string;
  shiftId: string;
  tab: AcceptedShiftTab;
  completedDateLabel: string;
  onListChange: () => void;
};

export function AcceptedShiftActions({
  applicationId,
  shiftId,
  tab,
  completedDateLabel,
  onListChange,
}: AcceptedShiftActionsProps) {
  return (
    <div className="flex flex-col items-stretch gap-1.5">
      <Link
        href={`/shifts/${shiftId}`}
        className={cn(
          "inline-flex min-h-8 items-center justify-center rounded-lg border border-fo-primary-bright/40 bg-transparent px-3 py-1.5 text-xs font-semibold text-fo-primary-bright transition hover:border-fo-primary-bright hover:bg-fo-primary/10"
        )}
      >
        View Shift
      </Link>

      {tab === "upcoming" ? (
        <div className="space-y-1">
          <button
            type="button"
            disabled
            title="Cancellation is not supported yet. Contact the company directly."
            className="inline-flex min-h-8 w-full cursor-not-allowed items-center justify-center rounded-lg border border-red-500/20 px-3 py-1.5 text-xs font-semibold text-red-300/50"
          >
            Cancel Assignment
          </button>
          <p className="text-[10px] leading-tight text-fo-text-subtle">
            Contact the company to cancel.
          </p>
        </div>
      ) : null}

      {tab === "completed" ? (
        <div className="text-[10px] leading-tight text-fo-text-muted">
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
        />
      ) : null}
    </div>
  );
}
