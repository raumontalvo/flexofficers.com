"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ApplicationStatus } from "@/app/generated/prisma/enums";
import { ClockConfirmationModal } from "@/components/attendance/clock-confirmation-modal";
import { buttonClassName } from "@/components/ui";
import {
  canClockIn,
  canClockOut,
  formatAttendanceLocationLabel,
  formatAttendanceTime,
  formatGoogleMapsUrl,
  formatShiftLocationLabel,
  getAttendanceStatus,
  getBrowserGeolocation,
  isClockInTooEarly,
} from "@/lib/attendance";
import type { OfficerAcceptedShiftData } from "@/lib/officer-accepted-shift-data";
import { formatShiftScheduleParts } from "@/lib/format-shift";
import { cn } from "@/lib/cn";

type ShiftClockActionsProps = {
  application: OfficerAcceptedShiftData;
  className?: string;
};

type ModalMode = "clock-in" | "clock-out" | null;

export function ShiftClockActions({
  application,
  className,
}: ShiftClockActionsProps) {
  const router = useRouter();
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const now = useMemo(() => new Date(), []);
  const attendanceStatus = getAttendanceStatus(application.attendance);
  const clockableApplication = {
    ...application.attendance,
    status: ApplicationStatus.ACCEPTED,
    shift: {
      status: application.shift.status,
      startTime: application.shift.startTime,
      endTime: application.shift.endTime,
      city: application.shift.city,
      state: application.shift.state,
      location: application.shift.location,
    },
  };
  const tooEarly = isClockInTooEarly(application.shift.startTime, now);
  const clockInAvailable = canClockIn(clockableApplication, now);
  const clockOutAvailable = canClockOut(clockableApplication);
  const startTime = new Date(application.shift.startTime);
  const schedule = formatShiftScheduleParts(
    startTime,
    new Date(application.shift.endTime)
  );
  const locationLabel = formatShiftLocationLabel(application.shift);
  const clockInLocationLabel = formatAttendanceLocationLabel(
    application.attendance.clockInLatitude,
    application.attendance.clockInLongitude
  );
  const clockOutLocationLabel = formatAttendanceLocationLabel(
    application.attendance.clockOutLatitude,
    application.attendance.clockOutLongitude
  );

  async function submitAttendance(action: "clock-in" | "clock-out") {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const coordinates = await getBrowserGeolocation();
      const response = await fetch(`/api/applications/${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicationId: application.id,
          latitude: coordinates?.latitude ?? undefined,
          longitude: coordinates?.longitude ?? undefined,
        }),
      });

      const payload = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        setErrorMessage(payload?.error ?? "Unable to save attendance.");
        return;
      }

      setModalMode(null);
      router.refresh();
    } catch {
      setErrorMessage("Unable to save attendance.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      {attendanceStatus === "CLOCKED_IN" ? (
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-3">
          <p className="text-sm font-semibold text-green-200">Clocked In</p>
          {application.attendance.clockInAt ? (
            <p className="mt-1 text-sm text-green-100/90">
              {formatAttendanceTime(application.attendance.clockInAt)}
            </p>
          ) : null}
          {clockInLocationLabel ? (
            <a
              href={formatGoogleMapsUrl(
                application.attendance.clockInLatitude!,
                application.attendance.clockInLongitude!
              )}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-block text-xs text-fo-primary-bright hover:underline"
            >
              {clockInLocationLabel}
            </a>
          ) : null}
        </div>
      ) : null}

      {attendanceStatus === "COMPLETED" ? (
        <div className="space-y-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-red-200">
              Clocked In
            </p>
            {application.attendance.clockInAt ? (
              <p className="mt-1 text-sm text-red-100/90">
                {formatAttendanceTime(application.attendance.clockInAt)}
                {clockInLocationLabel ? ` · ${clockInLocationLabel}` : ""}
              </p>
            ) : null}
            {application.attendance.clockInLatitude !== null &&
            application.attendance.clockInLongitude !== null ? (
              <a
                href={formatGoogleMapsUrl(
                  application.attendance.clockInLatitude,
                  application.attendance.clockInLongitude
                )}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-block text-xs text-fo-primary-bright hover:underline"
              >
                View Map
              </a>
            ) : null}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-red-200">
              Clocked Out
            </p>
            {application.attendance.clockOutAt ? (
              <p className="mt-1 text-sm text-red-100/90">
                {formatAttendanceTime(application.attendance.clockOutAt)}
                {clockOutLocationLabel ? ` · ${clockOutLocationLabel}` : ""}
              </p>
            ) : null}
            {application.attendance.clockOutLatitude !== null &&
            application.attendance.clockOutLongitude !== null ? (
              <a
                href={formatGoogleMapsUrl(
                  application.attendance.clockOutLatitude,
                  application.attendance.clockOutLongitude
                )}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-block text-xs text-fo-primary-bright hover:underline"
              >
                View Map
              </a>
            ) : null}
          </div>
        </div>
      ) : null}

      {attendanceStatus === "NOT_STARTED" && tooEarly ? (
        <button
          type="button"
          disabled
          className={buttonClassName({
            variant: "danger",
            size: "md",
            fullWidth: true,
            className:
              "w-full cursor-not-allowed border-red-500/40 bg-red-600/90 text-white opacity-90",
          })}
        >
          Clock In Opens 1 Hour Before Shift
        </button>
      ) : null}

      {attendanceStatus === "NOT_STARTED" && clockInAvailable ? (
        <button
          type="button"
          onClick={() => setModalMode("clock-in")}
          className={buttonClassName({
            size: "md",
            fullWidth: true,
            className:
              "w-full border-green-500/40 bg-green-600 text-white hover:bg-green-500",
          })}
        >
          Clock In
        </button>
      ) : null}

      {attendanceStatus === "CLOCKED_IN" && clockOutAvailable ? (
        <button
          type="button"
          onClick={() => setModalMode("clock-out")}
          className={buttonClassName({
            variant: "danger",
            size: "md",
            fullWidth: true,
            className: "w-full",
          })}
        >
          Clock Out
        </button>
      ) : null}

      {attendanceStatus === "COMPLETED" ? (
        <div
          className={buttonClassName({
            variant: "danger",
            size: "md",
            fullWidth: true,
            className:
              "w-full cursor-default border-red-500/40 bg-red-600/90 text-white",
          })}
        >
          ✓ Shift Completed
        </div>
      ) : null}

      {errorMessage ? (
        <p className="text-sm text-red-300" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <ClockConfirmationModal
        open={modalMode === "clock-in"}
        title="Clock In"
        message="Are you sure you want to clock in?"
        details={[
          { label: "Shift", value: application.shift.title },
          {
            label: "Scheduled Start",
            value: `${schedule.weekday}, ${schedule.monthDay} · ${schedule.timeRange}`,
          },
          { label: "Location", value: locationLabel },
        ]}
        confirmLabel="Yes, Clock In"
        confirmVariant="success"
        isSubmitting={isSubmitting}
        onClose={() => {
          if (!isSubmitting) {
            setModalMode(null);
          }
        }}
        onConfirm={() => submitAttendance("clock-in")}
      />

      <ClockConfirmationModal
        open={modalMode === "clock-out"}
        title="Clock Out"
        message="Are you sure you want to clock out?"
        details={[
          { label: "Shift", value: application.shift.title },
          {
            label: "Clock In",
            value: application.attendance.clockInAt
              ? `${formatAttendanceTime(application.attendance.clockInAt)}${clockInLocationLabel ? ` · ${clockInLocationLabel}` : ""}`
              : "—",
          },
          { label: "Location", value: locationLabel },
        ]}
        confirmLabel="Yes, Clock Out"
        confirmVariant="danger"
        isSubmitting={isSubmitting}
        onClose={() => {
          if (!isSubmitting) {
            setModalMode(null);
          }
        }}
        onConfirm={() => submitAttendance("clock-out")}
      />
    </div>
  );
}
