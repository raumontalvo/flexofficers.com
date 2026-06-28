import Link from "next/link";
import { buttonClassName } from "@/components/ui";
import { cn } from "@/lib/cn";

type CompanyDashboardHeaderProps = {
  displayName: string;
  canPostShifts: boolean;
  className?: string;
};

export function CompanyDashboardHeader({
  displayName,
  canPostShifts,
  className,
}: CompanyDashboardHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between",
        className
      )}
    >
      <div className="min-w-0">
        <h1 className="text-xl font-bold tracking-tight text-fo-text sm:text-2xl">
          Welcome back, {displayName}!{" "}
          <span aria-hidden="true">👋</span>
        </h1>
        <p className="mt-1 text-sm text-fo-text-muted">
          Here&apos;s what&apos;s happening with your security operations today.
        </p>
      </div>

      <Link
        href={canPostShifts ? "/shifts/create" : "/company/billing"}
        className={buttonClassName({
          size: "md",
          className: "shrink-0 self-start",
        })}
      >
        Post a New Shift
      </Link>
    </header>
  );
}
