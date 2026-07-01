"use client";

import { useCallback, useEffect, useId, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { buttonClassName } from "@/components/ui";
import { cn } from "@/lib/cn";

const SECTION_LINKS = [
  { href: "#how-it-works", label: "How It Works" },
  { href: "#companies", label: "For Companies" },
  { href: "#officers", label: "For Officers" },
  { href: "#pricing", label: "Pricing" },
] as const;

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      {open ? (
        <>
          <path d="M6 6l12 12M18 6 6 18" />
        </>
      ) : (
        <>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </>
      )}
    </svg>
  );
}

export function LandingNavbar() {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  const closeMenu = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, closeMenu]);

  return (
    <>
      <header className="landing-header sticky top-0 z-[100] border-b border-white/[0.06] bg-fo-bg/90 backdrop-blur-xl lg:z-40 lg:border-white/[0.04] lg:bg-fo-bg/80">
        <nav className="relative z-[110] mx-auto flex max-w-7xl min-w-0 items-center justify-between gap-2 px-4 py-3.5 sm:px-6 sm:py-4 lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center lg:gap-4 lg:px-8 lg:py-5">
          <div className="flex max-w-[130px] shrink-0 items-center sm:max-w-[150px] lg:min-w-fit lg:max-w-none">
            <Link href="/" className="flex shrink-0 items-center">
              <Image
                src="/branding/concepts/flexofficers-logo-concept.png"
                alt="FlexOfficers"
                width={448}
                height={112}
                priority
                sizes="(max-width: 1023px) 150px, 448px"
                className="h-20 w-auto object-contain lg:h-28"
              />
            </Link>
          </div>

          <div className="hidden items-center justify-center gap-8 whitespace-nowrap text-sm text-fo-text-muted lg:flex lg:gap-10 xl:gap-12">
            {SECTION_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="transition hover:text-fo-text"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="relative z-10 flex min-w-0 shrink-0 items-center gap-2 lg:col-start-3 lg:justify-end lg:gap-3">
            <Link
              href="/onboarding?force=1"
              className={buttonClassName({
                size: "md",
                className:
                  "inline-flex shrink-0 whitespace-nowrap max-lg:min-h-9 max-lg:px-2.5 max-lg:text-[11px] lg:min-h-11 lg:px-5 lg:text-sm",
              })}
            >
              Get Started
            </Link>
            <Link
              href="/sign-in"
              className={buttonClassName({
                variant: "secondary",
                size: "md",
                className:
                  "inline-flex shrink-0 whitespace-nowrap max-lg:min-h-9 max-lg:px-2.5 max-lg:text-[11px] lg:border-transparent lg:bg-transparent lg:font-semibold lg:text-fo-text-muted lg:hover:bg-fo-surface lg:hover:text-fo-text",
              })}
            >
              Sign In
            </Link>
            <button
              type="button"
              className={cn(
                buttonClassName({
                  variant: "secondary",
                  size: "md",
                  className:
                    "inline-flex min-h-9 min-w-9 shrink-0 touch-manipulation px-2 lg:hidden",
                })
              )}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls={menuId}
              onClick={() => setOpen((value) => !value)}
            >
              <MenuIcon open={open} />
            </button>
          </div>
        </nav>
      </header>

      {open ? (
        <div className="fixed inset-0 z-[90] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-fo-bg/80 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={closeMenu}
          />

          <div className="absolute inset-x-0 top-[var(--landing-header-h)] flex justify-center px-3 pb-4 sm:px-4">
            <div
              id={menuId}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              className="landing-mobile-menu w-full max-w-lg max-h-[min(32rem,calc(100dvh-var(--landing-header-h)-env(safe-area-inset-bottom,0px)-1rem))] overflow-y-auto rounded-fo-card border border-white/[0.06] bg-fo-bg-elevated p-4 shadow-[0_24px_64px_-16px_rgba(0,0,0,0.75)] sm:p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-fo-primary-hover">
                  Menu
                </p>
                <button
                  type="button"
                  className={buttonClassName({
                    variant: "ghost",
                    size: "md",
                    className: "min-h-10 min-w-10 touch-manipulation px-0",
                  })}
                  aria-label="Close menu"
                  onClick={closeMenu}
                >
                  <MenuIcon open />
                </button>
              </div>

              <nav className="flex flex-col gap-1">
                {SECTION_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="rounded-xl px-4 py-4 text-base font-medium text-fo-text transition hover:bg-fo-surface hover:text-fo-primary-hover"
                    onClick={closeMenu}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              <div className="mt-4 flex flex-col gap-3 border-t border-white/[0.06] pt-4">
                <Link
                  href="/sign-in"
                  className={buttonClassName({
                    variant: "secondary",
                    size: "lg",
                    fullWidth: true,
                    className: "w-full",
                  })}
                  onClick={closeMenu}
                >
                  Sign In
                </Link>
                <Link
                  href="/onboarding?force=1"
                  className={buttonClassName({
                    size: "lg",
                    fullWidth: true,
                    className: "w-full",
                  })}
                  onClick={closeMenu}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
