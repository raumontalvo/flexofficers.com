"use client";

import Link from "next/link";
import { ShiftStatus } from "@/app/generated/prisma/enums";
import {
  cancelCompanyShift,
  deleteCompanyShift,
} from "@/components/company/shift-actions-menu";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { MobilePrimaryButton, MobileSecondaryButton } from "@/components/ui";
import { cn } from "@/lib/cn";
import { getShiftActionMessages } from "@/lib/i18n/ui-labels";

type ShiftRowActionsProps = {
  shiftId: string;
  status: ShiftStatus;
  stacked?: boolean;
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

export function ShiftRowActions({ shiftId, status, stacked = false }: ShiftRowActionsProps) {
  const { t } = useLandingLanguage();
  const copy = getShiftActionMessages(t);
  const isCancelled = status === ShiftStatus.CANCELLED;

  if (stacked) {
    return (
      <div className="flex w-full flex-col gap-2">
        <MobileSecondaryButton href={`/shifts/${shiftId}`}>{copy.view}</MobileSecondaryButton>
        {isCancelled ? (
          <MobileSecondaryButton disabled>{copy.edit}</MobileSecondaryButton>
        ) : (
          <MobileSecondaryButton href={`/company/shifts/${shiftId}/edit`}>
            {copy.edit}
          </MobileSecondaryButton>
        )}
        <MobileSecondaryButton
          onClick={() => void cancelCompanyShift(shiftId, copy)}
          disabled={isCancelled}
        >
          {copy.cancel}
        </MobileSecondaryButton>
        <MobilePrimaryButton
          onClick={() => void deleteCompanyShift(shiftId, copy)}
          variant="danger"
        >
          {copy.delete}
        </MobilePrimaryButton>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5">
      <Link
        href={`/shifts/${shiftId}`}
        className={cn(
          iconButtonClassName,
          "border-blue-500/30 text-blue-200 hover:bg-blue-500/10"
        )}
        aria-label={copy.viewShiftAria}
        title={copy.view}
      >
        <ViewIcon className="h-4 w-4" />
      </Link>

      {isCancelled ? (
        <button
          type="button"
          disabled
          className={cn(iconButtonClassName, "border-blue-500/30 text-blue-200")}
          aria-label={copy.editShiftAria}
          title={copy.edit}
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
          aria-label={copy.editShiftAria}
          title={copy.edit}
        >
          <EditIcon className="h-4 w-4" />
        </Link>
      )}

      <button
        type="button"
        onClick={() => void cancelCompanyShift(shiftId, copy)}
        disabled={isCancelled}
        className={cn(
          iconButtonClassName,
          "border-amber-500/30 text-amber-200 hover:bg-amber-500/10"
        )}
        aria-label={copy.cancelShiftAria}
        title={copy.cancel}
      >
        <CancelIcon className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={() => void deleteCompanyShift(shiftId, copy)}
        className={cn(
          iconButtonClassName,
          "border-red-500/30 text-red-200 hover:bg-red-500/10"
        )}
        aria-label={copy.deleteShiftAria}
        title={copy.delete}
      >
        <DeleteIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
