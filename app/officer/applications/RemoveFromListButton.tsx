"use client";

import { cn } from "@/lib/cn";

const STORAGE_KEY = "flexofficers-hidden-applications";

export function getHiddenApplicationIds(): string[] {
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

export function hideApplicationFromList(applicationId: string) {
  const hidden = new Set(getHiddenApplicationIds());
  hidden.add(applicationId);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...hidden]));
}

type RemoveFromListButtonProps = {
  applicationId: string;
  onRemoved: () => void;
  className?: string;
};

export function RemoveFromListButton({
  applicationId,
  onRemoved,
  className,
}: RemoveFromListButtonProps) {
  function handleRemove() {
    const confirmed = window.confirm(
      "Remove this application from your list? This only hides it from your view."
    );

    if (!confirmed) {
      return;
    }

    hideApplicationFromList(applicationId);
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
      Remove from List
    </button>
  );
}
