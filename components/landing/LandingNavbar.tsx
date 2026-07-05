"use client";

import { useCallback, useEffect, useId, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LanguageToggle } from "@/components/landing/LanguageToggle";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { buttonClassName } from "@/components/ui";
import { cn } from "@/lib/cn";

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

export function LandingNavbar({ useHomeAnchors = false }: { useHomeAnchors?: boolean }) {
  const { t, language } = useLandingLanguage();
  const [open, setOpen] = useState(false);
  const menuId = useId();

  const sectionLinks = useMemo(
    () => [
      { href: "#introduction", label: t.nav.introduction },
      { href: "#how-it-works", label: t.nav.howItWorks },
      { href: "#companies", label: t.nav.forCompanies },
      { href: "#officers", label: t.nav.forOfficers },
      { href: "#need-security", label: t.nav.needSecurity },
      { href: "#pricing", label: t.nav.pricing },
    ],
    [t]
  );

  const resolveHref = useCallback(
    (href: string) => (useHomeAnchors && href.startsWith("#") ? `/${href}` : href),
    [useHomeAnchors]
  );

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
      <header className="landing-header sticky top-0 z-[100] border-b border-white/[0.06] bg-fo-bg/90 backdrop-blur-xl min-[1200px]:z-40 min-[1200px]:border-white/[0.04] min-[1200px]:bg-fo-bg/80">
        <nav
          className={cn(
            "relative z-[110] mx-auto flex max-w-7xl min-w-0 items-center justify-between gap-1.5 px-3 py-3 min-[360px]:gap-2 min-[360px]:px-4 sm:px-6 sm:py-3.5 min-[768px]:py-4 min-[1200px]:grid min-[1200px]:grid-cols-[auto_minmax(0,1fr)_auto] min-[1200px]:items-center min-[1200px]:gap-4 min-[1200px]:px-8 min-[1200px]:py-5",
            language === "es" && "min-[1200px]:gap-3 min-[1400px]:gap-4"
          )}
        >
          <div className="flex shrink-0 items-center">
            <Link href="/" className="landing-nav-logo-clip shrink-0">
              <Image
                src="/branding/concepts/flexofficers-logo-concept.png"
                alt="FlexOfficers"
                width={448}
                height={112}
                priority
                sizes="(max-width: 389px) 104px, (max-width: 767px) 126px, (max-width: 1199px) 172px, (max-width: 1399px) 210px, 260px"
                className="landing-nav-logo-image"
              />
            </Link>
          </div>

          <div
            className={cn(
              "hidden min-w-0 items-center justify-center whitespace-nowrap text-fo-text-muted min-[1200px]:flex",
              language === "es"
                ? "gap-2 text-xs tracking-tight min-[1400px]:gap-3 min-[1400px]:text-sm"
                : "gap-3 text-xs tracking-tight min-[1400px]:gap-6 min-[1400px]:text-sm"
            )}
          >
            {sectionLinks.map((link) => (
              <a
                key={link.href}
                href={resolveHref(link.href)}
                className="shrink-0 transition hover:text-fo-text"
              >
                {link.label}
              </a>
            ))}
            <LanguageToggle
              className={cn(
                "shrink-0",
                language === "es" ? "ml-1 text-xs" : "ml-2 min-[1400px]:ml-5 min-[1400px]:mr-5"
              )}
            />
          </div>

          <div
            className={cn(
              "relative z-10 flex min-w-0 shrink-0 items-center gap-1.5 min-[360px]:gap-2 min-[1200px]:justify-end min-[1200px]:gap-3",
              language === "es" && "min-[1200px]:gap-2"
            )}
          >
            <Link
              href="/onboarding?force=1"
              className={buttonClassName({
                size: "md",
                className: cn(
                  "hidden shrink-0 whitespace-nowrap min-[360px]:inline-flex",
                  "max-[1199px]:min-h-9 max-[1199px]:px-2.5 max-[1199px]:text-[11px]",
                  "min-[768px]:max-[1199px]:min-h-10 min-[768px]:max-[1199px]:px-3 min-[768px]:max-[1199px]:text-xs",
                  "min-[1200px]:min-h-11 min-[1200px]:px-5 min-[1200px]:text-sm",
                  language === "es" && "min-[1200px]:px-3.5"
                ),
              })}
            >
              {t.nav.getStarted}
            </Link>
            <Link
              href="/sign-in"
              className={buttonClassName({
                variant: "secondary",
                size: "md",
                className: cn(
                  "hidden shrink-0 whitespace-nowrap min-[1200px]:inline-flex",
                  "min-[1200px]:min-h-11 min-[1200px]:border-transparent min-[1200px]:bg-transparent min-[1200px]:font-semibold min-[1200px]:text-fo-text-muted min-[1200px]:hover:bg-fo-surface min-[1200px]:hover:text-fo-text",
                  language === "es" ? "min-[1200px]:px-3 min-[1200px]:text-sm" : "min-[1200px]:px-5 min-[1200px]:text-sm"
                ),
              })}
            >
              {t.nav.signIn}
            </Link>
            <button
              type="button"
              className={cn(
                buttonClassName({
                  variant: "secondary",
                  size: "md",
                  className:
                    "inline-flex min-h-8 min-w-8 shrink-0 touch-manipulation px-1.5 min-[360px]:min-h-9 min-[360px]:min-w-9 min-[360px]:px-2 min-[768px]:min-h-10 min-[768px]:min-w-10 min-[1200px]:hidden",
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
        <div className="fixed inset-0 z-[90] min-[1200px]:hidden">
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
                  {t.nav.menu}
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

              <LanguageToggle className="mb-4" />

              <nav className="flex flex-col gap-1">
                {sectionLinks.map((link) => (
                  <a
                    key={link.href}
                    href={resolveHref(link.href)}
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
                  {t.nav.signIn}
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
                  {t.nav.getStarted}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
