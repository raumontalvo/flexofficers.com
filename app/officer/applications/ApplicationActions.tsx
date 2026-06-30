"use client";

import type { ApplicationStatus, ShiftStatus } from "@/app/generated/prisma/enums";
import { ShiftDetailLink } from "@/components/shifts/shift-detail-link";
import { cn } from "@/lib/cn";
import { canOfficerDeleteApplication } from "@/lib/officer-application-delete";
import { CancelAssignmentButton } from "@/app/officer/CancelAssignmentButton";
import { DeleteApplicationButton } from "./DeleteApplicationButton";
import WithdrawApplicationButton from "./WithdrawApplicationButton";

type ApplicationActionsProps = {
  applicationId: string;
  shiftId: string;
  status: ApplicationStatus;
  shiftStatus: ShiftStatus;
  shiftEndTime: string;
  onListChange: () => void;
  onDeleted?: (applicationId: string) => void;
  layout?: "compact" | "mobile-row" | "desktop";
};

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <path
        d="M1.5 8s2.2-4.5 6.5-4.5S14.5 8 14.5 8s-2.2 4.5-6.5 4.5S1.5 8 1.5 8Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function UndoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <path
        d="M4 5.5H2v2M2 7.5c1.2 1.8 3.2 3 5.5 3 3 0 5.5-2 6.5-4.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <path
        d="M3.5 5.5h9M6 5.5V4.5h4v1M5 5.5l.5 7h5l.5-7"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const compactButtonClass =
  "inline-flex min-h-8 items-center justify-center rounded-lg px-3 py-1.5 text-xs font-semibold transition";

const mobileActionClass =
  "inline-flex min-h-11 min-w-[calc(50%-0.25rem)] flex-1 basis-[calc(33.333%-0.34rem)] items-center justify-center gap-1.5 rounded-lg border px-2 text-xs font-semibold transition";

const deleteButtonClass =
  "border-red-500/35 text-red-300 hover:border-red-500/50 hover:bg-red-500/10";

export function ApplicationActions({
  applicationId,
  shiftId,
  status,
  shiftStatus,
  shiftEndTime,
  onListChange,
  onDeleted,
  layout = "compact",
}: ApplicationActionsProps) {
  const mobileRow = layout === "mobile-row";
  const desktop = layout === "desktop";
  const showDelete = canOfficerDeleteApplication({
    status,
    shiftStatus,
    shiftEndTime,
  });

  function handleDeleted(applicationId: string) {
    onDeleted?.(applicationId);
  }

  const viewShiftClassName = cn(
    desktop
      ? "inline-flex min-h-10 w-full items-center justify-center rounded-lg border border-fo-primary-bright/40 bg-transparent px-3 py-2 text-sm font-semibold text-fo-primary-bright transition hover:border-fo-primary-bright hover:bg-fo-primary/10"
      : cn(
          compactButtonClass,
          "border border-fo-primary-bright/40 bg-transparent text-fo-primary-bright hover:border-fo-primary-bright hover:bg-fo-primary/10"
        )
  );

  const actionButtonClass = desktop
    ? "min-h-10 w-full px-3 py-2 text-sm"
    : compactButtonClass;

  if (mobileRow) {
    return (
      <div className="flex flex-wrap gap-2">
        <ShiftDetailLink
          shiftId={shiftId}
          className={cn(
            mobileActionClass,
            "border-fo-primary-bright/40 text-fo-primary-bright hover:border-fo-primary-bright hover:bg-fo-primary/10"
          )}
        >
          <EyeIcon className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">View Shift</span>
        </ShiftDetailLink>

        {status === "PENDING" ? (
          <WithdrawApplicationButton
            applicationId={applicationId}
            compact
            label="Withdraw"
            className={cn(
              mobileActionClass,
              "border-amber-500/40 text-fo-pending hover:border-amber-500/60 hover:bg-fo-pending-bg"
            )}
            icon={<UndoIcon className="h-3.5 w-3.5 shrink-0" />}
          />
        ) : null}

        {status === "ACCEPTED" && !showDelete ? (
          <CancelAssignmentButton
            applicationId={applicationId}
            label="Cancel"
            className={cn(mobileActionClass, deleteButtonClass)}
          />
        ) : null}

        {showDelete ? (
          <DeleteApplicationButton
            applicationId={applicationId}
            onDeleted={handleDeleted}
            label="Delete"
            className={cn(mobileActionClass, deleteButtonClass)}
            icon={<TrashIcon className="h-3.5 w-3.5 shrink-0" />}
          />
        ) : null}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-stretch", desktop ? "gap-2" : "gap-1.5")}>
      <ShiftDetailLink shiftId={shiftId} className={viewShiftClassName}>
        View Shift
      </ShiftDetailLink>

      {status === "PENDING" ? (
        <WithdrawApplicationButton
          applicationId={applicationId}
          compact
          label="Withdraw"
          className={desktop ? actionButtonClass : undefined}
        />
      ) : null}

      {status === "ACCEPTED" && !showDelete ? (
        <CancelAssignmentButton
          applicationId={applicationId}
          className={cn(actionButtonClass, deleteButtonClass)}
        />
      ) : null}

      {showDelete ? (
        <DeleteApplicationButton
          applicationId={applicationId}
          onDeleted={handleDeleted}
          label="Delete"
          className={cn(actionButtonClass, deleteButtonClass)}
        />
      ) : null}
    </div>
  );
}
