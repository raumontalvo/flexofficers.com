"use client";

import { cn } from "@/lib/cn";

const STORAGE_KEY = "flexofficers-hidden-company-applicants";

export function getHiddenCompanyApplicantIds(): string[] {
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

export function hideCompanyApplicantFromList(applicationId: string) {
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

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <path
        d="M3.5 5.5h9M6 5.5V4.5h4v1M5 5.5l.5 7h5l.5-7"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type RemoveCompanyApplicantButtonProps = {
  applicationId: string;
  officerName: string;
  onRemoved: () => void;
  className?: string;
};

export function RemoveCompanyApplicantButton({
  applicationId,
  officerName,
  onRemoved,
  className,
}: RemoveCompanyApplicantButtonProps) {
  function handleRemove() {
    const confirmed = window.confirm(
      `Remove ${officerName} from your applicant list? This only hides them from your view and does not delete their account.`
    );

    if (!confirmed) {
      return;
    }

    hideCompanyApplicantFromList(applicationId);
    onRemoved();
  }

  return (
    <button
      type="button"
      onClick={handleRemove}
      aria-label={`Remove ${officerName} from applicant list`}
      className={cn(
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-red-500/35 bg-red-500/10 text-red-200 transition hover:border-red-500/50 hover:bg-red-500/15 hover:text-red-100",
        className
      )}
    >
      <TrashIcon className="h-4 w-4" />
    </button>
  );
}
