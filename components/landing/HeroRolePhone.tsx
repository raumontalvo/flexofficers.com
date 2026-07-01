"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { PhoneFrame } from "@/components/landing/PhoneFrame";
import { cn } from "@/lib/cn";

type HeroScreen = {
  label: string;
  content: ReactNode;
};

type HeroRolePhoneProps = {
  roleLabel: string;
  screens: HeroScreen[];
  className?: string;
  style?: React.CSSProperties;
};

export function HeroRolePhone({
  roleLabel,
  screens,
  className,
  style,
}: HeroRolePhoneProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeScreen = screens[activeIndex] ?? screens[0];

  if (!activeScreen) {
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

      <div
        className="flex w-full max-w-full flex-wrap items-center justify-center gap-1.5 px-1"
        role="tablist"
        aria-label={`${roleLabel} screens`}
      >
        {screens.map((screen, index) => {
          const selected = index === activeIndex;

          return (
            <button
              key={screen.label}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-[10px] font-semibold transition sm:px-3 sm:py-1.5 sm:text-xs",
                selected
                  ? "border-fo-primary-bright/45 bg-fo-primary/15 text-fo-primary-hover"
                  : "border-white/10 bg-white/[0.03] text-fo-text-muted hover:border-white/15 hover:text-fo-text"
              )}
            >
              {screen.label}
            </button>
          );
        })}
      </div>

      <PhoneFrame label={activeScreen.label} size="hero" className="w-full">
        {activeScreen.content}
      </PhoneFrame>
    </div>
  );
}
