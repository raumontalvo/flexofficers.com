"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { ShiftDetailLink } from "@/components/shifts/shift-detail-link";
import { buttonClassName, ProfileAvatar } from "@/components/ui";
import {
  MobileListCardActions,
  MobilePrimaryButton,
  MobileSecondaryButton,
  MobileSettingsRow,
} from "@/components/ui/mobile";
import { cn } from "@/lib/cn";
import {
  formatInviteHourlyRate,
  formatInviteLocation,
  formatInviteSchedule,
  formatInvitedTimeAgo,
  INVITE_STATUS_LABELS,
  type OfficerInviteData,
} from "@/lib/officer-invite-data";
import { shiftDetailHref } from "@/lib/shift-detail-navigation";
import { DeleteInviteButton } from "./DeleteInviteButton";

const statusBadgeClasses = {
  PENDING: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  ACCEPTED: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  DECLINED: "border-red-500/30 bg-red-500/10 text-red-200",
} as const;

type InviteActionsProps = {
  invite: OfficerInviteData;
  onRespond: () => void;
  onDeleted?: (inviteId: string) => void;
  stacked?: boolean;
  layout?: "compact" | "desktop";
};

async function respondToInvite(inviteId: string, response: "accept" | "decline") {
  const responseResult = await fetch("/api/invites/respond", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inviteId, response }),
  });

  if (responseResult.ok) {
    window.location.reload();
    return;
  }

  const data = (await responseResult.json().catch(() => null)) as {
    error?: string;
  } | null;

  alert(data?.error || "Failed to update invite.");
}

function LocationIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden="true">
      <path d="M10 17s5-4.5 5-8.5a5 5 0 1 0-10 0C5 12.5 10 17 10 17Z" />
      <circle cx="10" cy="8.5" r="1.75" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden="true">
      <rect x="3.5" y="4.5" width="13" height="12" rx="1.5" />
      <path d="M7 3.5v2M13 3.5v2M3.5 8h13" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden="true">
      <circle cx="10" cy="10" r="6.5" />
      <path d="M10 7v3.2l2 1.3" strokeLinecap="round" />
    </svg>
  );
}

function DollarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden="true">
      <path d="M10 3.5v13M7.5 6.5c0-1.2 1.1-2 2.5-2s2.5.8 2.5 2-1.1 2-2.5 2.2S7.5 10.7 7.5 12c0 1.2 1.1 2 2.5 2s2.5-.8 2.5-2" strokeLinecap="round" />
    </svg>
  );
}

export function InviteActions({
  invite,
  onRespond,
  onDeleted,
  stacked = false,
  layout = "compact",
}: InviteActionsProps) {
  const [loading, setLoading] = useState<"accept" | "decline" | null>(null);
  const pathname = usePathname();
  const shiftHref = shiftDetailHref(invite.shift.id, pathname);
  const desktop = layout === "desktop";

  const actionColumnClass = desktop
    ? "flex w-full flex-col justify-center gap-2"
    : "flex w-[148px] shrink-0 flex-col justify-center gap-2";

  const viewShiftClass = buttonClassName({
    variant: "secondary",
    size: "md",
    className: cn(
      desktop ? "min-h-10 w-full px-3 text-sm" : "min-h-9 w-full px-3 text-xs",
      "border-fo-primary-bright/40 text-center text-fo-primary-bright hover:border-fo-primary-bright hover:bg-fo-primary/10"
    ),
  });

  const primaryActionClass = buttonClassName({
    size: "md",
    className: desktop ? "min-h-10 w-full px-3 text-sm" : "min-h-9 w-full px-3 text-xs",
  });

  const secondaryActionClass = buttonClassName({
    variant: "secondary",
    size: "md",
    className: desktop ? "min-h-10 w-full px-3 text-sm" : "min-h-9 w-full px-3 text-xs",
  });

  async function handleRespond(response: "accept" | "decline") {
    setLoading(response);
    try {
      await respondToInvite(invite.id, response);
      onRespond();
    } finally {
      setLoading(null);
    }
  }

  if (stacked && invite.status === "PENDING") {
    return (
      <MobileListCardActions>
        <MobilePrimaryButton
          onClick={() => handleRespond("accept")}
          disabled={loading !== null}
          loading={loading === "accept"}
        >
          Accept Invite
        </MobilePrimaryButton>
        <MobileSettingsRow label="View Shift" href={shiftHref} />
        <MobileSecondaryButton
          onClick={() => handleRespond("decline")}
          disabled={loading !== null}
          loading={loading === "decline"}
        >
          Decline Invite
        </MobileSecondaryButton>
      </MobileListCardActions>
    );
  }

  if (stacked && invite.status === "ACCEPTED") {
    return (
      <MobileListCardActions>
        <MobileSettingsRow label="View Shift Details" href={shiftHref} />
      </MobileListCardActions>
    );
  }

  if (stacked && invite.status === "DECLINED") {
    return (
      <MobileListCardActions>
        <MobileSettingsRow label="View Shift" href={shiftHref} />
        <DeleteInviteButton
          inviteId={invite.id}
          onDeleted={onDeleted}
          label="Delete"
          className={buttonClassName({
            variant: "secondary",
            size: "md",
            className:
              "min-h-11 w-full border-red-500/35 px-3 text-xs text-red-300 hover:border-red-500/50 hover:bg-red-500/10",
          })}
        />
      </MobileListCardActions>
    );
  }

  if (invite.status === "PENDING") {
    return (
      <div className={actionColumnClass}>
        <ShiftDetailLink shiftId={invite.shift.id} className={viewShiftClass}>
          View Shift Details
        </ShiftDetailLink>
        <button
          type="button"
          disabled={loading !== null}
          onClick={() => handleRespond("accept")}
          className={primaryActionClass}
        >
          {loading === "accept" ? "Accepting..." : "Accept Invite"}
        </button>
        <button
          type="button"
          disabled={loading !== null}
          onClick={() => handleRespond("decline")}
          className={secondaryActionClass}
        >
          {loading === "decline" ? "Declining..." : "Decline Invite"}
        </button>
      </div>
    );
  }

  if (invite.status === "ACCEPTED") {
    return (
      <div className={actionColumnClass}>
        <ShiftDetailLink shiftId={invite.shift.id} className={viewShiftClass}>
          View Shift Details
        </ShiftDetailLink>
      </div>
    );
  }

  return (
    <div className={actionColumnClass}>
      <ShiftDetailLink shiftId={invite.shift.id} className={viewShiftClass}>
        View Shift Details
      </ShiftDetailLink>
      <DeleteInviteButton
        inviteId={invite.id}
        onDeleted={onDeleted}
        label="Delete"
        className={buttonClassName({
          variant: "secondary",
          size: "md",
          className: cn(
            desktop ? "min-h-10 w-full px-3 text-sm" : "min-h-9 w-full px-3 text-xs",
            "border-red-500/35 text-red-300 hover:border-red-500/50 hover:bg-red-500/10"
          ),
        })}
      />
    </div>
  );
}

type InviteCardProps = {
  invite: OfficerInviteData;
  onRespond: () => void;
  onDeleted?: (inviteId: string) => void;
};

function InviteCardMobile({
  invite,
  onRespond,
  onDeleted,
}: {
  invite: OfficerInviteData;
  onRespond: () => void;
  onDeleted?: (inviteId: string) => void;
}) {
  const schedule = formatInviteSchedule(invite);
  const locationLabel = formatInviteLocation(invite);
  const hourlyRateLabel = formatInviteHourlyRate(invite);
  const invitedLabel = formatInvitedTimeAgo(invite.invitedAt);

  return (
    <article className="fo-glass-card overflow-hidden rounded-2xl border border-white/10 lg:hidden">
      <div className="space-y-3 p-4">
        <div className="flex items-start gap-3">
          <ProfileAvatar
            name={invite.company.companyName}
            src={invite.company.logoUrl}
            size="md"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <p className="truncate text-sm font-semibold text-fo-primary-bright">
                {invite.company.companyName}
              </p>
              <span
                className={cn(
                  "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                  statusBadgeClasses[invite.status]
                )}
              >
                {INVITE_STATUS_LABELS[invite.status]}
              </span>
            </div>
            <h2 className="mt-1 text-base font-bold leading-snug text-fo-text">
              {invite.shift.title}
            </h2>
            <p className="mt-1 text-[11px] text-fo-text-subtle">{invitedLabel}</p>
          </div>
        </div>

        <p className="flex items-center gap-1.5 text-sm text-fo-text-muted">
          <LocationIcon className="h-3.5 w-3.5 shrink-0 text-red-400" />
          <span className="min-w-0 truncate">{locationLabel}</span>
        </p>

        <p className="text-2xl font-bold leading-none text-fo-primary-bright">
          {hourlyRateLabel}
          <span className="text-sm font-semibold text-fo-text-muted">/hr</span>
        </p>

        <div className="flex items-center gap-3 border-t border-white/[0.06] pt-3 text-xs text-fo-text-muted">
          <span className="flex min-w-0 items-center gap-1.5">
            <CalendarIcon className="h-3.5 w-3.5 shrink-0 text-fo-text-subtle" />
            <span className="truncate">
              {schedule.weekday} {schedule.monthDay}
            </span>
          </span>
          <span className="flex min-w-0 items-center gap-1.5">
            <ClockIcon className="h-3.5 w-3.5 shrink-0 text-fo-text-subtle" />
            <span className="truncate">{schedule.timeRange}</span>
          </span>
        </div>

        {invite.status === "PENDING" ? (
          <p className="rounded-lg border border-blue-500/25 bg-blue-500/10 px-3 py-2 text-xs leading-relaxed text-blue-100">
            Once you accept an invite, it will move to your Accepted Shifts.
          </p>
        ) : null}

        <InviteActions
          invite={invite}
          onRespond={onRespond}
          onDeleted={onDeleted}
          stacked
        />
      </div>
    </article>
  );
}

export function InviteCard({
  invite,
  onRespond,
  onDeleted,
}: InviteCardProps) {
  const schedule = formatInviteSchedule(invite);
  const locationLabel = formatInviteLocation(invite);
  const hourlyRateLabel = formatInviteHourlyRate(invite);
  const invitedLabel = formatInvitedTimeAgo(invite.invitedAt);

  return (
    <>
      <InviteCardMobile
        invite={invite}
        onRespond={onRespond}
        onDeleted={onDeleted}
      />

      <article className="fo-glass-card fo-glass-card-hover hidden min-h-[150px] rounded-xl border border-white/10 transition lg:block">
        <div className="grid h-full min-h-[150px] grid-cols-[minmax(0,1.4fr)_minmax(0,2fr)_minmax(0,1.4fr)] gap-5 p-5">
          <div className="flex min-w-0 flex-col justify-center gap-3 border-r border-white/[0.06] pr-5">
            <div className="flex items-start gap-3">
              <ProfileAvatar
                name={invite.company.companyName}
                src={invite.company.logoUrl}
                size="md"
                className="shrink-0"
              />
              <div className="min-w-0 space-y-2">
                <p className="text-base font-semibold leading-snug text-fo-text">
                  {invite.company.companyName}
                </p>
                <span
                  className={cn(
                    "inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-semibold",
                    statusBadgeClasses[invite.status]
                  )}
                >
                  {INVITE_STATUS_LABELS[invite.status]}
                </span>
                <p className="text-xs text-fo-text-subtle">{invitedLabel}</p>
              </div>
            </div>
          </div>

          <div className="flex min-w-0 flex-col justify-center gap-2 border-r border-white/[0.06] px-1 pr-5">
            <h2 className="text-lg font-bold leading-snug text-fo-text">{invite.shift.title}</h2>
            <p className="flex items-start gap-2 text-sm leading-snug text-fo-text-muted">
              <LocationIcon className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
              <span className="min-w-0">{locationLabel}</span>
            </p>
            <p className="flex items-center gap-2 text-sm text-fo-text">
              <CalendarIcon className="h-4 w-4 shrink-0 text-fo-text-subtle" />
              <span>
                {schedule.weekday}, {schedule.monthDay}
              </span>
            </p>
            <p className="flex items-center gap-2 text-sm text-fo-text-muted">
              <ClockIcon className="h-4 w-4 shrink-0 text-fo-text-subtle" />
              <span>{schedule.timeRange}</span>
            </p>
            <p className="flex items-center gap-2 text-sm text-fo-primary-bright">
              <DollarIcon className="h-4 w-4 shrink-0 text-fo-text-subtle" />
              <span className="text-base font-bold">
                {hourlyRateLabel}
                <span className="ml-0.5 text-sm font-semibold text-fo-text-muted">/hr</span>
              </span>
            </p>
          </div>

          <InviteActions
            invite={invite}
            onRespond={onRespond}
            onDeleted={onDeleted}
            layout="desktop"
          />
        </div>
      </article>
    </>
  );
}
