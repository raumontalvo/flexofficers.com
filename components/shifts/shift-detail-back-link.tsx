"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/cn";
import { getShiftDetailReturnPath } from "@/lib/shift-detail-navigation";

type ShiftDetailBackLinkProps = {
  className?: string;
  fallbackHref?: string;
};

function ShiftDetailBackLinkInner({
  className,
  fallbackHref = "/shifts",
}: ShiftDetailBackLinkProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnPath = getShiftDetailReturnPath(searchParams.get("from"));

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    if (returnPath) {
      return;
    }

    event.preventDefault();

    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  }

  return (
    <Link
      href={returnPath ?? fallbackHref}
      onClick={handleClick}
      className={cn(
        "inline-flex min-h-9 items-center text-sm font-medium text-fo-primary-hover hover:text-fo-primary-bright",
        className
      )}
    >
      ← Back
    </Link>
  );
}

export function ShiftDetailBackLink(props: ShiftDetailBackLinkProps) {
  return (
    <Suspense
      fallback={
        <Link
          href={props.fallbackHref ?? "/shifts"}
          className={cn(
            "inline-flex min-h-9 items-center text-sm font-medium text-fo-primary-hover hover:text-fo-primary-bright",
            props.className
          )}
        >
          ← Back
        </Link>
      }
    >
      <ShiftDetailBackLinkInner {...props} />
    </Suspense>
  );
}
