"use client";

import { cn } from "@/lib/cn";

const STORAGE_KEY = "flexofficers-hidden-company-workforce";

export function getHiddenCompanyWorkforceIds(): string[] {
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

export function hideCompanyWorkforceApplication(applicationId: string) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const hidden = new Set<string>(
      raw
        ? (JSON.parse(raw) as string[]).filter((entry) => typeof entry === "string")
        : []
    );
    hidden.add(applicationId);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...hidden]));
  } catch {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([applicationId]));
  }
}

type RemoveFromCompanyListButtonProps = {
  applicationId: string;
  onRemoved: () => void;
  label?: string;
  className?: string;
};

export function RemoveFromCompanyListButton({
  applicationId,
  onRemoved,
  label = "Remove from List",
  className,
}: RemoveFromCompanyListButtonProps) {
  function handleRemove() {
    const confirmed = window.confirm(
      "Remove this assignment from your list? This only hides it from your view."
    );

    if (!confirmed) {
      return;
    }

    hideCompanyWorkforceApplication(applicationId);
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
      {label}
    </button>
  );
}
