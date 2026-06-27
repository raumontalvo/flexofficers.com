"use client";

import Link from "next/link";
import { Button } from "@/components/ui";

export function ProfileSuccessScreen() {
  return (
    <div className="fo-glass-card mx-auto max-w-lg rounded-fo-card border border-emerald-500/25 p-6 text-center sm:p-8">
      <div className="text-4xl" aria-hidden>
        🎉
      </div>
      <h2 className="mt-3 text-2xl font-bold text-fo-text">Profile Complete</h2>
      <p className="mt-2 text-sm leading-relaxed text-fo-text-muted sm:text-base">
        Your profile is now ready for companies to review.
      </p>

      <div className="mt-6 rounded-xl border border-fo-border bg-fo-bg-elevated/40 p-4 text-left">
        <p className="text-sm font-semibold text-fo-text">Next steps</p>
        <ul className="mt-3 space-y-2 text-sm text-fo-text-muted">
          <li className="flex gap-2">
            <span className="text-fo-primary-bright">•</span>
            Browse available shifts
          </li>
          <li className="flex gap-2">
            <span className="text-fo-primary-bright">•</span>
            Apply to shifts
          </li>
          <li className="flex gap-2">
            <span className="text-fo-primary-bright">•</span>
            Keep licenses up to date
          </li>
        </ul>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link href="/dashboard" className="w-full sm:w-auto">
          <Button fullWidth className="w-full">
            Go to Dashboard
          </Button>
        </Link>
        <Link href="/shifts" className="w-full sm:w-auto">
          <Button variant="secondary" fullWidth className="w-full">
            Browse Shifts
          </Button>
        </Link>
      </div>
    </div>
  );
}
