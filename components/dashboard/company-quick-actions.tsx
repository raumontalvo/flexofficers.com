import Link from "next/link";
import {
  ApplicantsIcon,
  SearchIcon,
  ShiftsIcon,
} from "@/components/nav/icons";
import { Card, CardDescription, CardTitle } from "@/components/ui";
import { cn } from "@/lib/cn";

const actions = [
  {
    href: "/shifts/create",
    title: "Post a New Shift",
    description: "Create a shift and start receiving applicants.",
    icon: ShiftsIcon,
    iconClassName: "bg-blue-500/20 text-blue-300",
  },
  {
    href: "/company/applications",
    title: "View Applications",
    description: "Review new officer applications.",
    icon: ApplicantsIcon,
    iconClassName: "bg-violet-500/20 text-violet-300",
  },
  {
    href: "/company/officers",
    title: "Manage Officers",
    description: "Search and review officer profiles.",
    icon: SearchIcon,
    iconClassName: "bg-emerald-500/20 text-emerald-300",
  },
] as const;

export function CompanyQuickActions({ canPostShifts }: { canPostShifts: boolean }) {
  const postShiftHref = canPostShifts ? "/shifts/create" : "/company/billing";

  return (
    <section className="space-y-2.5">
      <div>
        <h2 className="text-base font-bold text-fo-text">Quick Actions</h2>
        <p className="text-xs text-fo-text-muted">
          Jump to the tools you use most.
        </p>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon;
          const href =
            action.href === "/shifts/create" ? postShiftHref : action.href;

          return (
            <Link key={action.href} href={href} className="group block h-full">
              <Card
                variant="elevated"
                padding="none"
                className="fo-glass-card fo-glass-card-hover flex h-full flex-col gap-2.5 p-3.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg",
                      action.iconClassName
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span
                    className="text-xs text-fo-text-subtle transition group-hover:translate-x-0.5 group-hover:text-fo-primary-hover"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </div>
                <div className="space-y-0.5">
                  <CardTitle className="text-sm">{action.title}</CardTitle>
                  <CardDescription className="text-xs leading-snug">
                    {action.description}
                  </CardDescription>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
