"use client";

import Link from "next/link";
import type { ApplicationStatus } from "@/app/generated/prisma/enums";
import { cn } from "@/lib/cn";
import { RemoveFromListButton } from "./RemoveFromListButton";
import WithdrawApplicationButton from "./WithdrawApplicationButton";

type ApplicationActionsProps = {
  applicationId: string;
  shiftId: string;
  status: ApplicationStatus;
  onListChange: () => void;
};

export function ApplicationActions({
  applicationId,
  shiftId,
  status,
  onListChange,
}: ApplicationActionsProps) {
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

      {status === "PENDING" ? (
        <WithdrawApplicationButton applicationId={applicationId} compact />
      ) : null}

      {status === "ACCEPTED" ? (
        <Link
          href="/officer/accepted-shifts"
          className="inline-flex min-h-8 items-center justify-center rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:border-red-500/50 hover:bg-red-500/10"
        >
          Cancel Assignment
        </Link>
      ) : null}

      {status === "REJECTED" || status === "WITHDRAWN" ? (
        <RemoveFromListButton
          applicationId={applicationId}
          onRemoved={onListChange}
        />
      ) : null}
    </div>
  );
}
