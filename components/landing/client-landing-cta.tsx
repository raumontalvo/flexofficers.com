"use client";

import Link from "next/link";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { buttonClassName } from "@/components/ui";

export function ClientLandingCta() {
  const { t } = useLandingLanguage();

  return (
    <div className="mt-10 flex justify-center">
      <Link
        href="/onboarding?force=1"
        className={buttonClassName({
          size: "lg",
          fullWidth: true,
          className: "sm:w-auto sm:min-w-[240px]",
        })}
      >
        {t.clients.cta}
      </Link>
    </div>
  );
}
