"use client";

import Link from "next/link";
import { ShiftStatus } from "@/app/generated/prisma/enums";
import { cn } from "@/lib/cn";

type ShiftRowActionsProps = {
  shiftId: string;
  status: ShiftStatus;
};

const iconButtonClassName =
  "flex h-8 w-8 items-center justify-center rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-fo-primary-bright/20 disabled:cursor-not-allowed disabled:opacity-40";

function ViewIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden="true"
    >
      <path d="M2.5 10s2.5-5 7.5-5 7.5 5 7.5 5-2.5 5-7.5 5-7.5-5-7.5-5Z" />
      <circle cx="10" cy="10" r="2.25" />
    </svg>
  );
}

function EditIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden="true"
    >
      <path d="M12.5 3.5 16.5 7.5 6.5 17.5H2.5v-4L12.5 3.5Z" />
    </svg>
  );
}

function CancelIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="7" />
      <path d="m7 7 6 6M13 7 7 13" />
    </svg>
  );
}

function DeleteIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 6h12M8 6V4h4v2M7 6v9h6V6" />
    </svg>
  );
}

export function ShiftRowActions({ shiftId, status }: ShiftRowActionsProps) {
  const isCancelled = status === ShiftStatus.CANCELLED;

  async function cancelShift() {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this shift? It will be removed from Available Shifts but kept in your company history."
    );

    if (!confirmed) {
      return;
    }

    const response = await fetch("/api/shifts/cancel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shiftId }),
    });

    if (response.ok) {
      window.location.reload();
    } else {
      alert("Failed to cancel shift");
    }
  }

  async function deleteShift() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this shift? This cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    const response = await fetch("/api/shifts/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shiftId }),
    });

    if (response.ok) {
      window.location.reload();
    } else {
      alert("Failed to delete shift");
    }
  }

  return (
    <div className="inline-flex items-center gap-1.5">
      <Link
        href={`/shifts/${shiftId}`}
        className={cn(
          iconButtonClassName,
          "border-blue-500/30 text-blue-200 hover:bg-blue-500/10"
        )}
        aria-label="View shift"
        title="View"
      >
        <ViewIcon className="h-4 w-4" />
      </Link>

      {isCancelled ? (
        <button
          type="button"
          disabled
          className={cn(
            iconButtonClassName,
            "border-blue-500/30 text-blue-200"
          )}
          aria-label="Edit shift"
          title="Edit"
        >
          <EditIcon className="h-4 w-4" />
        </button>
      ) : (
        <Link
          href={`/company/shifts/${shiftId}/edit`}
          className={cn(
            iconButtonClassName,
            "border-blue-500/30 text-blue-200 hover:bg-blue-500/10"
          )}
          aria-label="Edit shift"
          title="Edit"
        >
          <EditIcon className="h-4 w-4" />
        </Link>
      )}

      <button
        type="button"
        onClick={cancelShift}
        disabled={isCancelled}
        className={cn(
          iconButtonClassName,
          "border-amber-500/30 text-amber-200 hover:bg-amber-500/10"
        )}
        aria-label="Cancel shift"
        title="Cancel"
      >
        <CancelIcon className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={deleteShift}
        className={cn(
          iconButtonClassName,
          "border-red-500/30 text-red-200 hover:bg-red-500/10"
        )}
        aria-label="Delete shift"
        title="Delete"
      >
        <DeleteIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
