"use client";

import { useState } from "react";
import { PhoneFrame } from "@/components/landing/PhoneFrame";
import { PhoneScreenshotCarousel } from "@/components/landing/PhoneScreenshotCarousel";
import type { LandingPhoneScreenshot } from "@/lib/landing-phone-screenshots";
import { LANDING_PHONE_CYCLE_MS } from "@/lib/landing-phone-screenshots";
import { cn } from "@/lib/cn";

type HeroRolePhoneProps = {
  roleLabel: string;
  screenshots: LandingPhoneScreenshot[];
  className?: string;
  style?: React.CSSProperties;
};

export function HeroRolePhone({
  roleLabel,
  screenshots,
  className,
  style,
}: HeroRolePhoneProps) {
  const [activeLabel, setActiveLabel] = useState(screenshots[0]?.label ?? "");

  if (screenshots.length === 0) {
    return null;
  }

  return (
    <div
      className={cn("flex w-full min-w-0 flex-col items-center gap-4 sm:gap-5", className)}
      style={style}
    >
      <div className="w-full text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-fo-primary-hover sm:text-base">
          {roleLabel}
        </p>
      </div>

      <PhoneFrame label={activeLabel} size="hero" className="w-full">
        <PhoneScreenshotCarousel
          screenshots={screenshots}
          intervalMs={LANDING_PHONE_CYCLE_MS}
          onSlideChange={(screenshot) => setActiveLabel(screenshot.label)}
        />
      </PhoneFrame>
    </div>
  );
}
