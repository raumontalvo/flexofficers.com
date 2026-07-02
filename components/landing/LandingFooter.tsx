"use client";

import Link from "next/link";
import { FlexOfficersLogoLink } from "@/components/brand";
import { useLandingLanguage } from "@/components/landing/landing-language-context";

export function LandingFooter() {
  const { t } = useLandingLanguage();

  return (
    <footer className="border-t border-white/[0.06] py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 text-sm text-fo-text-subtle sm:px-8 md:flex-row">
        <div className="flex flex-col items-center gap-4 md:flex-row">
          <FlexOfficersLogoLink href="/" height={40} />
          <p>© {new Date().getFullYear()} FlexOfficers</p>
        </div>
        <div className="flex gap-8">
          <Link href="/privacy" className="transition hover:text-fo-text-muted">
            {t.footer.privacy}
          </Link>
          <Link href="/terms" className="transition hover:text-fo-text-muted">
            {t.footer.terms}
          </Link>
          <Link href="/contact" className="transition hover:text-fo-text-muted">
            {t.footer.contact}
          </Link>
        </div>
      </div>
    </footer>
  );
}
