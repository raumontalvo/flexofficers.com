"use client";

import Link from "next/link";
import { useState } from "react";
import { ShiftStatus } from "@/app/generated/prisma/enums";
import { MobileBottomSheet } from "@/components/ui/mobile";
import { cn } from "@/lib/cn";

type ShiftActionsMenuProps = {
  shiftId: string;
  status: ShiftStatus;
  rosterExpanded: boolean;
  onViewRoster: () => void;
  className?: string;
};

function MoreIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden className={className}>
      <circle cx="10" cy="4" r="1.35" />
      <circle cx="10" cy="10" r="1.35" />
      <circle cx="10" cy="16" r="1.35" />
    </svg>
  );
}

export async function cancelCompanyShift(shiftId: string) {
  const confirmed = window.confirm(
    "Are you sure you want to cancel this shift? It will be removed from Available Shifts but kept in your company history."
  );

  if (!confirmed) {
    return false;
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
    return true;
  }

  alert("Failed to cancel shift");
  return false;
}

export async function deleteCompanyShift(shiftId: string) {
  const confirmed = window.confirm(
    "Are you sure you want to delete this shift? This cannot be undone."
  );

  if (!confirmed) {
    return false;
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
    return true;
  }

  alert("Failed to delete shift");
  return false;
}

const menuItemClassName =
  "flex w-full items-center rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3 text-sm font-semibold text-fo-text transition hover:bg-white/[0.06]";

export function ShiftActionsMenu({
  shiftId,
  status,
  rosterExpanded,
  onViewRoster,
  className,
}: ShiftActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const isCancelled = status === ShiftStatus.CANCELLED;

  function closeMenu() {
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 text-fo-text-muted transition hover:bg-white/[0.05] hover:text-fo-text",
          className
        )}
        aria-label="Shift actions"
      >
        <MoreIcon className="h-4 w-4" />
      </button>

      <MobileBottomSheet
        open={open}
        onClose={closeMenu}
        title="Shift Actions"
      >
        <div className="space-y-2 pb-2">
          <button
            type="button"
            className={menuItemClassName}
            onClick={() => {
              onViewRoster();
              closeMenu();
            }}
          >
            {rosterExpanded ? "Hide Roster" : "View Roster"}
          </button>

          <Link
            href={`/shifts/${shiftId}`}
            className={menuItemClassName}
            onClick={closeMenu}
          >
            View
          </Link>

          {isCancelled ? (
            <button type="button" disabled className={cn(menuItemClassName, "opacity-40")}>
              Edit
            </button>
          ) : (
            <Link
              href={`/company/shifts/${shiftId}/edit`}
              className={menuItemClassName}
              onClick={closeMenu}
            >
              Edit
            </Link>
          )}

          <button
            type="button"
            disabled={isCancelled}
            className={cn(
              menuItemClassName,
              "text-amber-200",
              isCancelled && "opacity-40"
            )}
            onClick={() => {
              closeMenu();
              void cancelCompanyShift(shiftId);
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            className={cn(menuItemClassName, "border-red-500/20 text-red-200")}
            onClick={() => {
              closeMenu();
              void deleteCompanyShift(shiftId);
            }}
          >
            Delete
          </button>
        </div>
      </MobileBottomSheet>
    </>
  );
}
