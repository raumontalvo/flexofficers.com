"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { buttonClassName } from "@/components/ui";

export function ClientLandingCta() {
  const { t } = useLandingLanguage();
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return (
      <div className="mt-10 flex justify-center">
        <Link
          href="/client"
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

  return (
    <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
      <Link
        href="/client/sign-up"
        className={buttonClassName({
          size: "lg",
          fullWidth: true,
          className: "sm:w-auto sm:min-w-[240px]",
        })}
      >
        {t.clients.cta}
      </Link>
      <Link
        href="/client/sign-in"
        className={buttonClassName({
          variant: "secondary",
          size: "lg",
          fullWidth: true,
          className: "sm:w-auto sm:min-w-[200px]",
        })}
      >
        {t.clients.signIn}
      </Link>
    </div>
  );
}
