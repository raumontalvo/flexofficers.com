"use client";

import { useEffect, useRef } from "react";
import { buttonClassName } from "@/components/ui";
import { cn } from "@/lib/cn";

type ClockConfirmationModalProps = {
  open: boolean;
  title: string;
  message: string;
  details: Array<{ label: string; value: string }>;
  confirmLabel: string;
  confirmVariant: "success" | "danger";
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function ClockConfirmationModal({
  open,
  title,
  message,
  details,
  confirmLabel,
  confirmVariant,
  isSubmitting = false,
  onClose,
  onConfirm,
}: ClockConfirmationModalProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    cancelRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, isSubmitting, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={isSubmitting ? undefined : onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="clock-confirmation-title"
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-slate-950/95 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl"
      >
        <h2 id="clock-confirmation-title" className="text-lg font-semibold text-white">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">{message}</p>

        <dl className="mt-4 space-y-2 rounded-xl border border-white/10 bg-white/5 p-3">
          {details.map((detail) => (
            <div key={detail.label}>
              <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                {detail.label}
              </dt>
              <dd className="mt-0.5 text-sm font-medium text-white">{detail.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            ref={cancelRef}
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className={buttonClassName({
              variant: "secondary",
              size: "md",
            })}
          >
            No
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className={cn(
              buttonClassName({
                size: "md",
              }),
              confirmVariant === "success"
                ? "border-green-500/40 bg-green-600 text-white hover:bg-green-500"
                : "border-red-500/40 bg-red-600 text-white hover:bg-red-500"
            )}
          >
            {isSubmitting ? "Saving..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
