"use client";

import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type DeleteInviteButtonProps = {
  inviteId: string;
  onDeleted?: (inviteId: string) => void;
  className?: string;
  label?: string;
  icon?: ReactNode;
};

export function DeleteInviteButton({
  inviteId,
  onDeleted,
  className,
  label = "Delete",
  icon,
}: DeleteInviteButtonProps) {
  async function deleteInvite() {
    const confirmed = window.confirm("Delete this declined invite from your list?");

    if (!confirmed) {
      return;
    }

    const response = await fetch("/api/invites/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inviteId }),
    });

    const data = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;

    if (response.ok) {
      onDeleted?.(inviteId);
      return;
    }

    alert(data?.error || "Failed to delete invite");
  }

  return (
    <button
      type="button"
      onClick={deleteInvite}
      className={cn(
        "inline-flex items-center justify-center",
        icon ? "gap-1.5" : undefined,
        className
      )}
    >
      {icon}
      {label}
    </button>
  );
}
