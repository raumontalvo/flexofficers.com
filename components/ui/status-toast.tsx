"use client";

import { useEffect } from "react";
import { cn } from "@/lib/cn";

type StatusToastProps = {
  message: string;
  onClose: () => void;
  durationMs?: number;
  tone?: "success" | "error";
};

export function StatusToast({
  message,
  onClose,
  durationMs = 4000,
  tone = "success",
}: StatusToastProps) {
  useEffect(() => {
    const timeoutId = window.setTimeout(onClose, durationMs);
    return () => window.clearTimeout(timeoutId);
  }, [durationMs, onClose]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed bottom-6 left-1/2 z-[70] w-[min(92vw,24rem)] -translate-x-1/2 rounded-xl border px-4 py-3 text-center text-sm font-semibold shadow-2xl backdrop-blur-sm",
        tone === "success"
          ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-50"
          : "border-red-500/30 bg-red-500/15 text-red-50"
      )}
    >
      {message}
    </div>
  );
}
