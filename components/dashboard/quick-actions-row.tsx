import Link from "next/link";
import {
  AcceptedIcon,
  BrowseIcon,
  ShiftsIcon,
  UpcomingIcon,
} from "@/components/nav/icons";
import { Card, CardDescription, CardTitle } from "@/components/ui";
import { cn } from "@/lib/cn";

const quickActions = [
  {
    href: "/shifts",
    title: "Browse Shifts",
    description: "Explore open assignments.",
    icon: BrowseIcon,
    iconClassName: "bg-blue-500/20 text-blue-300",
  },
  {
    href: "/officer/applications",
    title: "Applications",
    description: "Track your applications.",
    icon: ShiftsIcon,
    iconClassName: "bg-violet-500/20 text-violet-300",
  },
  {
    href: "/officer/accepted-shifts",
    title: "Accepted Shifts",
    description: "View confirmed assignments.",
    icon: AcceptedIcon,
    iconClassName: "bg-emerald-500/20 text-emerald-300",
  },
  {
    href: "/officer/upcoming-shifts",
    title: "Upcoming Shifts",
    description: "See shifts starting soon.",
    icon: UpcomingIcon,
    iconClassName: "bg-amber-500/20 text-amber-300",
  },
] as const;

type QuickActionsRowProps = {
  className?: string;
};

export function QuickActionsRow({ className }: QuickActionsRowProps) {
  return (
    <section className={cn("space-y-2.5", className)}>
      <div>
        <h2 className="text-base font-bold text-fo-text">Quick Actions</h2>
        <p className="text-xs text-fo-text-muted">Jump to the tools you use most.</p>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
        {quickActions.map((action) => {
          const Icon = action.icon;

          return (
            <Link key={action.href} href={action.href} className="group block h-full">
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
