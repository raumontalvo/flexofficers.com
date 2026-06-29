"use client";

import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type MobileBottomSheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
};

export function MobileBottomSheet({
  open,
  onClose,
  title,
  children,
  className,
}: MobileBottomSheetProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] md:hidden">
      <button
        type="button"
        aria-label="Close search"
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-bottom-sheet-title"
        className={cn(
          "absolute inset-x-0 bottom-[calc(var(--fo-nav-height)+env(safe-area-inset-bottom,0px))] flex max-h-[min(85vh,720px)] flex-col overflow-hidden rounded-t-2xl border border-white/10 bg-fo-bg-elevated shadow-[0_-16px_48px_rgba(0,0,0,0.45)]",
          className
        )}
      >
        <div className="shrink-0 border-b border-white/[0.06] px-4 pb-3 pt-3">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/20" aria-hidden />
          <div className="flex items-center justify-between gap-3">
            <h2 id="mobile-bottom-sheet-title" className="text-base font-semibold text-fo-text">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-2 py-1 text-sm font-medium text-fo-text-muted transition hover:text-fo-text"
            >
              Close
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
          {children}
        </div>
      </div>
    </div>
  );
}
