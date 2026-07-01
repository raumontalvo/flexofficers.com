"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { LandingPhoneScreenshot } from "@/lib/landing-phone-screenshots";
import { cn } from "@/lib/cn";

type PhoneScreenshotCarouselProps = {
  screenshots: LandingPhoneScreenshot[];
  intervalMs?: number;
  onSlideChange?: (screenshot: LandingPhoneScreenshot, index: number) => void;
  className?: string;
};

function preloadScreenshot(screenshot: LandingPhoneScreenshot) {
  return new Promise<LandingPhoneScreenshot | null>((resolve) => {
    const image = new window.Image();
    image.onload = () => resolve(screenshot);
    image.onerror = () => resolve(null);
    image.src = screenshot.src;
  });
}

export function PhoneScreenshotCarousel({
  screenshots,
  intervalMs = 4000,
  onSlideChange,
  className,
}: PhoneScreenshotCarouselProps) {
  const [availableScreenshots, setAvailableScreenshots] = useState<
    LandingPhoneScreenshot[]
  >([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;

    Promise.all(screenshots.map((screenshot) => preloadScreenshot(screenshot))).then(
      (results) => {
        if (cancelled) {
          return;
        }

        const loaded = results.filter(
          (screenshot): screenshot is LandingPhoneScreenshot => screenshot !== null
        );
        setAvailableScreenshots(loaded);
        setActiveIndex(0);
        setHasChecked(true);
      }
    );

    return () => {
      cancelled = true;
    };
  }, [screenshots]);

  useEffect(() => {
    const screenshot = availableScreenshots[activeIndex];
    if (screenshot) {
      onSlideChange?.(screenshot, activeIndex);
    }
  }, [activeIndex, availableScreenshots, onSlideChange]);

  useEffect(() => {
    if (availableScreenshots.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % availableScreenshots.length);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [activeIndex, availableScreenshots.length, intervalMs]);

  if (!hasChecked) {
    return (
      <div
        className={cn(
          "flex aspect-[390/844] w-full items-center justify-center bg-fo-bg px-6 text-center",
          className
        )}
      >
        <p className="text-xs leading-relaxed text-fo-text-muted">
          Loading app preview…
        </p>
      </div>
    );
  }

  if (availableScreenshots.length === 0) {
    return (
      <div
        className={cn(
          "flex aspect-[390/844] w-full items-center justify-center bg-fo-bg px-6 text-center",
          className
        )}
      >
        <p className="text-xs leading-relaxed text-fo-text-muted">
          Screenshots are not available yet. Run{" "}
          <code className="text-fo-text">npm run capture:landing-screenshots</code>.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn("relative aspect-[390/844] w-full overflow-hidden bg-fo-bg", className)}
      role="region"
      aria-roledescription="carousel"
      aria-label="App screenshots"
    >
      {availableScreenshots.map((screenshot, index) => {
        const isActive = index === activeIndex;

        return (
          <div
            key={screenshot.src}
            className={cn(
              "absolute inset-0 bg-fo-bg transition-all duration-700 ease-in-out",
              isActive
                ? "z-10 translate-x-0 opacity-100"
                : "z-0 translate-x-2 opacity-0 pointer-events-none"
            )}
            aria-hidden={!isActive}
          >
            <Image
              src={screenshot.src}
              alt={screenshot.alt}
              fill
              priority={index === 0}
              sizes="(max-width: 640px) 100vw, 300px"
              className="object-cover object-top"
              draggable={false}
            />
          </div>
        );
      })}

      {availableScreenshots.length > 1 ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex justify-center gap-1.5">
          {availableScreenshots.map((screenshot, index) => (
            <span
              key={screenshot.src}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                index === activeIndex
                  ? "w-4 bg-fo-primary-bright"
                  : "w-1.5 bg-white/25"
              )}
              aria-hidden
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
