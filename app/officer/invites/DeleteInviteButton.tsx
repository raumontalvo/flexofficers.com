"use client";

import { useLandingLanguage } from "@/components/landing/landing-language-context";
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
  label,
  icon,
}: DeleteInviteButtonProps) {
  const { t } = useLandingLanguage();
  const copy = t.forms.deleteInvite;
  const buttonLabel = label ?? t.browse.notifications.actions.delete;

  async function deleteInvite() {
    const confirmed = window.confirm(copy.confirm);

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

    alert(data?.error || copy.failed);
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
      {buttonLabel}
    </button>
  );
}
