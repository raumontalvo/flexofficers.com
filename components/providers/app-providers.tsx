"use client";

import type { ReactNode } from "react";
import { LandingLanguageProvider } from "@/components/landing/landing-language-context";

export function AppProviders({ children }: { children: ReactNode }) {
  return <LandingLanguageProvider>{children}</LandingLanguageProvider>;
}
