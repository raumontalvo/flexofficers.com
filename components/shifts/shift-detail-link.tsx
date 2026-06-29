"use client";

import Link from "next/link";
import { Suspense, useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { shiftDetailHref } from "@/lib/shift-detail-navigation";

type ShiftDetailLinkProps = {
  shiftId: string;
  returnTo?: string;
  className?: string;
  children: React.ReactNode;
};

function ShiftDetailLinkInner({
  shiftId,
  returnTo,
  className,
  children,
}: ShiftDetailLinkProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const href = useMemo(() => {
    const query = searchParams.toString();
    const currentPath = query ? `${pathname}?${query}` : pathname;

    return shiftDetailHref(shiftId, returnTo ?? currentPath);
  }, [pathname, returnTo, searchParams, shiftId]);

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function useShiftDetailHref(shiftId: string, returnTo?: string) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return useMemo(() => {
    const query = searchParams.toString();
    const currentPath = query ? `${pathname}?${query}` : pathname;

    return shiftDetailHref(shiftId, returnTo ?? currentPath);
  }, [pathname, returnTo, searchParams, shiftId]);
}

export function ShiftDetailLink(props: ShiftDetailLinkProps) {
  return (
    <Suspense
      fallback={
        <Link href={`/shifts/${props.shiftId}`} className={props.className}>
          {props.children}
        </Link>
      }
    >
      <ShiftDetailLinkInner {...props} />
    </Suspense>
  );
}
