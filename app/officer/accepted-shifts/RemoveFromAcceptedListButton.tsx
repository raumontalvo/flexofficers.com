"use client";

import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { cn } from "@/lib/cn";

const STORAGE_KEY = "flexofficers-hidden-accepted-shifts";

export function getHiddenAcceptedShiftIds(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((entry): entry is string => typeof entry === "string")
      : [];
  } catch {
    return [];
  }
}

export function hideAcceptedShiftFromList(applicationId: string) {
  const hidden = new Set(getHiddenAcceptedShiftIds());
  hidden.add(applicationId);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...hidden]));
}

type RemoveFromAcceptedListButtonProps = {
  applicationId: string;
  onRemoved: () => void;
  className?: string;
};

export function RemoveFromAcceptedListButton({
  applicationId,
  onRemoved,
  className,
}: RemoveFromAcceptedListButtonProps) {
  const { t } = useLandingLanguage();
  const card = t.acceptedShifts.card;

  function handleRemove() {
    const confirmed = window.confirm(card.removeConfirm);

    if (!confirmed) {
      return;
    }

    hideAcceptedShiftFromList(applicationId);
    onRemoved();
  }

  return (
    <button
      type="button"
      onClick={handleRemove}
      className={cn(
        "inline-flex min-h-8 items-center justify-center rounded-lg border border-fo-border px-3 py-1.5 text-xs font-semibold text-fo-text-muted transition hover:border-fo-border-strong hover:text-fo-text",
        className
      )}
    >
      {card.removeFromList}
    </button>
  );
}
