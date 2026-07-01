"use client";

import Link from "next/link";
import { useState } from "react";
import { ShiftStatus } from "@/app/generated/prisma/enums";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { MobileBottomSheet } from "@/components/ui/mobile";
import { cn } from "@/lib/cn";
import { getShiftActionMessages } from "@/lib/i18n/ui-labels";

type ShiftActionsMenuProps = {
  shiftId: string;
  status: ShiftStatus;
  rosterExpanded: boolean;
  onViewRoster: () => void;
  className?: string;
};

type ShiftActionMessages = ReturnType<typeof getShiftActionMessages>;

function MoreIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden className={className}>
      <circle cx="10" cy="4" r="1.35" />
      <circle cx="10" cy="10" r="1.35" />
      <circle cx="10" cy="16" r="1.35" />
    </svg>
  );
}

export async function cancelCompanyShift(
  shiftId: string,
  messages: ShiftActionMessages
) {
  const confirmed = window.confirm(messages.cancelConfirm);

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

  alert(messages.cancelFailed);
  return false;
}

export async function deleteCompanyShift(
  shiftId: string,
  messages: ShiftActionMessages
) {
  const confirmed = window.confirm(messages.deleteConfirm);

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

  alert(messages.deleteFailed);
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
  const { t } = useLandingLanguage();
  const copy = getShiftActionMessages(t);
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
        aria-label={copy.ariaLabel}
      >
        <MoreIcon className="h-4 w-4" />
      </button>

      <MobileBottomSheet open={open} onClose={closeMenu} title={copy.title}>
        <div className="space-y-2 pb-2">
          <button
            type="button"
            className={menuItemClassName}
            onClick={() => {
              onViewRoster();
              closeMenu();
            }}
          >
            {rosterExpanded ? copy.hideRoster : copy.viewRoster}
          </button>

          <Link
            href={`/shifts/${shiftId}`}
            className={menuItemClassName}
            onClick={closeMenu}
          >
            {copy.view}
          </Link>

          {isCancelled ? (
            <button type="button" disabled className={cn(menuItemClassName, "opacity-40")}>
              {copy.edit}
            </button>
          ) : (
            <Link
              href={`/company/shifts/${shiftId}/edit`}
              className={menuItemClassName}
              onClick={closeMenu}
            >
              {copy.edit}
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
              void cancelCompanyShift(shiftId, copy);
            }}
          >
            {copy.cancel}
          </button>

          <button
            type="button"
            className={cn(menuItemClassName, "border-red-500/20 text-red-200")}
            onClick={() => {
              closeMenu();
              void deleteCompanyShift(shiftId, copy);
            }}
          >
            {copy.delete}
          </button>
        </div>
      </MobileBottomSheet>
    </>
  );
}
