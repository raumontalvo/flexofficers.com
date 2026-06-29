import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type MobileStatGridProps = {
  children: ReactNode;
  className?: string;
  desktopColumns?: 3 | 4;
};

export function MobileStatGrid({
  children,
  className,
  desktopColumns = 4,
}: MobileStatGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3",
        desktopColumns === 4 && "xl:grid-cols-4",
        desktopColumns === 3 && "lg:grid-cols-3",
        className
      )}
    >
      {children}
    </div>
  );
}
