"use client";

import { useState } from "react";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { buttonClassName } from "@/components/ui";
import { cn } from "@/lib/cn";

type AddToStaffButtonProps = {
  officerId: string;
  isOnStaff: boolean;
  onAdded?: () => void;
  onRemoved?: () => void;
  className?: string;
  size?: "md" | "mobile";
};

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

export function AddToStaffButton({
  officerId,
  isOnStaff,
  onAdded,
  onRemoved,
  className,
  size = "md",
}: AddToStaffButtonProps) {
  const { t } = useLandingLanguage();
  const copy = t.company.addToStaff;
  const [onStaff, setOnStaff] = useState(isOnStaff);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);

    try {
      const response = await fetch("/api/company/staff", {
        method: onStaff ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ officerId }),
      });

      const data = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        alert(data?.error || copy.updateFailed);
        return;
      }

      if (onStaff) {
        setOnStaff(false);
        onRemoved?.();
      } else {
        setOnStaff(true);
        onAdded?.();
      }
    } finally {
      setLoading(false);
    }
  }

  if (onStaff) {
    if (size === "mobile") {
      return (
        <button
          type="button"
          disabled={loading}
          onClick={handleClick}
          className={cn(
            buttonClassName({
              variant: "danger",
              size: "md",
              fullWidth: true,
              className:
                "min-h-11 gap-2 rounded-xl border border-red-400 bg-red-600 text-sm font-semibold text-white hover:bg-red-500",
            }),
            className
          )}
        >
          <TrashIcon className="h-4 w-4 shrink-0" />
          {loading ? copy.removing : copy.remove}
        </button>
      );
    }

    return (
      <button
        type="button"
        disabled={loading}
        onClick={handleClick}
        className={cn(
          buttonClassName({
            variant: "secondary",
            size: "md",
            className: cn(
              "min-h-10 border-red-500/30 text-sm text-red-100 hover:bg-red-500/10",
              className
            ),
          })
        )}
      >
        {loading ? copy.removing : copy.remove}
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={handleClick}
      className={cn(
        buttonClassName({
          variant: "secondary",
          size: "md",
          className: cn(
            size === "mobile" ? "!min-h-11 !text-sm" : "min-h-10 flex-1 px-4 text-sm",
            className
          ),
        })
      )}
    >
      {loading ? copy.adding : copy.add}
    </button>
  );
}
