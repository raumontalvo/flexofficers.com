"use client";

import type { ReactNode } from "react";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNavbar } from "@/components/landing/LandingNavbar";

export function LegalPageShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen overflow-x-clip bg-fo-bg text-fo-text">
      <LandingNavbar useHomeAnchors />
      <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-24 lg:py-28">
        {children}
      </div>
      <LandingFooter />
    </main>
  );
}
