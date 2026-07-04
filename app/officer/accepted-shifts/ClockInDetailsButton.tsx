"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { interpolate } from "@/lib/app-i18n";
import {
  formatAttendanceDateTime,
  formatAttendanceLocationLabel,
  formatGoogleMapsUrl,
} from "@/lib/attendance";
import { cn } from "@/lib/cn";
import type { OfficerAcceptedShiftData } from "@/lib/officer-accepted-shift-data";

type ClockInDetailsButtonProps = {
  attendance: OfficerAcceptedShiftData["attendance"];
  className?: string;
};

function computeTotalDuration(
  clockInAt: string | null,
  clockOutAt: string | null
) {
  if (!clockInAt || !clockOutAt) {
    return null;
  }

  const ms = new Date(clockOutAt).getTime() - new Date(clockInAt).getTime();
  if (!Number.isFinite(ms) || ms <= 0) {
    return null;
  }

  const totalMinutes = Math.round(ms / (1000 * 60));
  return {
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60,
  };
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-white/[0.06] pb-2 last:border-b-0 last:pb-0">
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-fo-text-subtle">
        {label}
      </dt>
      <dd className="text-sm text-fo-text">{children}</dd>
    </div>
  );
}

export function ClockInDetailsButton({
  attendance,
  className,
}: ClockInDetailsButtonProps) {
  const { t } = useLandingLanguage();
  const card = t.acceptedShifts.card;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const clockInLocation = formatAttendanceLocationLabel(
    attendance.clockInLatitude,
    attendance.clockInLongitude
  );
  const clockOutLocation = formatAttendanceLocationLabel(
    attendance.clockOutLatitude,
    attendance.clockOutLongitude
  );
  const totalDuration = computeTotalDuration(
    attendance.clockInAt,
    attendance.clockOutAt
  );
  const totalDurationLabel = totalDuration
    ? [
        totalDuration.hours > 0
          ? interpolate(card.attendanceHoursUnit, {
              hours: String(totalDuration.hours),
            })
          : null,
        totalDuration.minutes > 0 || totalDuration.hours === 0
          ? interpolate(card.attendanceMinutesUnit, {
              minutes: String(totalDuration.minutes),
            })
          : null,
      ]
        .filter(Boolean)
        .join(" ")
    : null;

  const modal =
    open && typeof document !== "undefined"
      ? createPortal(
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <button
              type="button"
              aria-label={card.attendanceClose}
              onClick={() => setOpen(false)}
              className="absolute inset-0 h-full w-full cursor-default bg-black/70"
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-label={card.attendanceTitle}
              className="relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-white/10 bg-slate-950/95 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
            >
              <h2 className="text-lg font-bold text-fo-text">
                {card.attendanceTitle}
              </h2>

              <dl className="mt-4 space-y-2.5">
                <DetailRow label={card.attendanceClockIn}>
                  {attendance.clockInAt
                    ? formatAttendanceDateTime(attendance.clockInAt)
                    : card.attendanceNotAvailable}
                </DetailRow>

                <DetailRow label={card.attendanceClockOut}>
                  {attendance.clockOutAt
                    ? formatAttendanceDateTime(attendance.clockOutAt)
                    : card.attendanceNotAvailable}
                </DetailRow>

                {clockInLocation ? (
                  <DetailRow label={card.attendanceClockInLocation}>
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-fo-text-muted">{clockInLocation}</span>
                      <a
                        href={formatGoogleMapsUrl(
                          attendance.clockInLatitude as number,
                          attendance.clockInLongitude as number
                        )}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-fo-primary-bright hover:text-fo-primary-hover"
                      >
                        {card.attendanceViewMap}
                      </a>
                    </span>
                  </DetailRow>
                ) : null}

                {clockOutLocation ? (
                  <DetailRow label={card.attendanceClockOutLocation}>
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-fo-text-muted">{clockOutLocation}</span>
                      <a
                        href={formatGoogleMapsUrl(
                          attendance.clockOutLatitude as number,
                          attendance.clockOutLongitude as number
                        )}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-fo-primary-bright hover:text-fo-primary-hover"
                      >
                        {card.attendanceViewMap}
                      </a>
                    </span>
                  </DetailRow>
                ) : null}

                {totalDurationLabel ? (
                  <DetailRow label={card.attendanceTotalHours}>
                    {totalDurationLabel}
                  </DetailRow>
                ) : null}
              </dl>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-5 inline-flex min-h-10 w-full items-center justify-center rounded-lg border border-white/15 px-3 py-2 text-sm font-semibold text-fo-text transition hover:bg-white/[0.06]"
              >
                {card.attendanceClose}
              </button>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex min-h-8 items-center justify-center rounded-lg border border-fo-primary-bright/40 px-3 py-1.5 text-xs font-semibold text-fo-primary-bright transition hover:border-fo-primary-bright hover:bg-fo-primary/10",
          className
        )}
      >
        {card.clockInDetails}
      </button>
      {modal}
    </>
  );
}
