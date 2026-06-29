"use client";

import { useState } from "react";
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

export function AddToStaffButton({
  officerId,
  isOnStaff,
  onAdded,
  onRemoved,
  className,
  size = "md",
}: AddToStaffButtonProps) {
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
        alert(data?.error || "Failed to update staff.");
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
              "border-red-500/30 text-red-100 hover:bg-red-500/10",
              size === "mobile" ? "!min-h-11 !text-sm" : "min-h-10 text-sm",
              className
            ),
          })
        )}
      >
        {loading ? "Removing..." : "Remove Staff"}
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
      {loading ? "Adding..." : "Add to Staff"}
    </button>
  );
}
