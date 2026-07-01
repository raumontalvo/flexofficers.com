"use client";

import type { ComponentType, SVGProps } from "react";
import Link from "next/link";
import {
  AcceptedIcon,
  NotificationsIcon,
} from "@/components/nav/icons";
import {
  buttonClassName,
  Card,
  CardDescription,
  CardTitle,
} from "@/components/ui";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { cn } from "@/lib/cn";

type DashboardSidebarWidgetsProps = {
  upcomingCount: number;
  className?: string;
};

function WidgetEmptyState({
  icon: Icon,
  title,
  description,
  actionHref,
  actionLabel,
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center py-1 text-center">
      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-fo-neutral-bg text-fo-text-muted">
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-xs font-medium text-fo-text">{title}</p>
      <p className="mt-0.5 text-[11px] leading-snug text-fo-text-muted">
        {description}
      </p>
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className={buttonClassName({
            variant: "secondary",
            size: "md",
            className: "!min-h-8 mt-2.5 !px-3 !py-1.5 !text-xs",
          })}
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

export function DashboardSidebarWidgets({
  upcomingCount,
  className,
}: DashboardSidebarWidgetsProps) {
  const { t } = useLandingLanguage();
  const copy = t.dashboard.officer.sidebar;

  return (
    <div className={cn("space-y-2.5", className)}>
      <Card
        variant="elevated"
        padding="none"
        className="fo-glass-card fo-glass-card-hover space-y-2.5 p-3.5"
      >
        <CardTitle className="text-sm font-semibold">{copy.upcomingShift}</CardTitle>
        {upcomingCount > 0 ? (
          <div className="space-y-2">
            <p className="text-2xl font-bold leading-none text-fo-text">
              {upcomingCount}
            </p>
            <CardDescription className="text-xs">
              {upcomingCount === 1
                ? copy.acceptedStartingSoonOne
                : copy.acceptedStartingSoon}
            </CardDescription>
            <Link
              href="/officer/upcoming-shifts"
              className={buttonClassName({
                variant: "secondary",
                size: "md",
                fullWidth: true,
                className: "!min-h-8 !py-1.5 !text-xs",
              })}
            >
              {copy.viewUpcoming}
            </Link>
          </div>
        ) : (
          <WidgetEmptyState
            icon={AcceptedIcon}
            title={copy.noUpcoming}
            description={copy.noUpcomingDesc}
            actionHref="/shifts"
            actionLabel={copy.browseShifts}
          />
        )}
      </Card>

      <Card
        variant="elevated"
        padding="none"
        className="fo-glass-card fo-glass-card-hover space-y-2.5 p-3.5"
      >
        <CardTitle className="text-sm font-semibold">{copy.announcements}</CardTitle>
        <WidgetEmptyState
          icon={NotificationsIcon}
          title={copy.noAnnouncements}
          description={copy.noAnnouncementsDesc}
          actionHref="/officer/notifications"
          actionLabel={copy.viewNotifications}
        />
      </Card>
    </div>
  );
}
