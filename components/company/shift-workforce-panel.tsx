import {
  formatAttendanceTime,
  formatGoogleMapsUrl,
} from "@/lib/attendance";
import type { SerializedShiftWorkforce } from "@/lib/shift-workforce";

type ShiftWorkforcePanelProps = {
  workforce: SerializedShiftWorkforce;
};

function AttendanceLocationLink({
  latitude,
  longitude,
}: {
  latitude: number | null;
  longitude: number | null;
}) {
  if (latitude === null || longitude === null) {
    return <span className="text-fo-text-muted">—</span>;
  }

  return (
    <a
      href={formatGoogleMapsUrl(latitude, longitude)}
      target="_blank"
      rel="noreferrer"
      className="text-fo-primary-bright hover:underline"
    >
      View Map
    </a>
  );
}

export function ShiftWorkforcePanel({ workforce }: ShiftWorkforcePanelProps) {
  return (
    <div className="grid gap-4 border-t border-white/[0.06] bg-white/[0.02] px-4 py-4 md:grid-cols-2">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-fo-text-muted">
          Need {workforce.positionsNeeded} Officer
          {workforce.positionsNeeded === 1 ? "" : "s"}
        </p>

        <div className="mt-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-fo-text-subtle">
            Accepted
          </p>
          {workforce.acceptedOfficers.length === 0 ? (
            <p className="mt-1 text-sm text-fo-text-muted">No accepted officers yet.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {workforce.acceptedOfficers.map((officer) => (
                <li
                  key={officer.officerId}
                  className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2"
                >
                  <p className="text-sm font-semibold text-fo-text">
                    {officer.fullName}
                  </p>
                  <p className="mt-0.5 text-xs text-fo-text-muted">
                    {officer.detailLabel}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-fo-text-subtle">
          Pending Invites
        </p>
        {workforce.pendingInvites.length === 0 ? (
          <p className="mt-2 text-sm text-fo-text-muted">No pending invites.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {workforce.pendingInvites.map((invite) => (
              <li
                key={invite.officerId}
                className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2"
              >
                <p className="text-sm font-semibold text-fo-text">
                  {invite.fullName}
                </p>
                <p className="mt-0.5 text-xs text-amber-200/80">
                  {invite.detailLabel}
                </p>
              </li>
            ))}
          </ul>
        )}

        {workforce.openPositionsRemaining > 0 ? (
          <p className="mt-4 text-sm text-fo-text-muted">
            Open Positions Remaining:{" "}
            <span className="font-semibold text-fo-text">
              {workforce.openPositionsRemaining}
            </span>
          </p>
        ) : null}
      </div>

      {workforce.acceptedOfficers.length > 0 ? (
        <div className="md:col-span-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-fo-text-subtle">
            Attendance
          </p>
          <ul className="mt-2 space-y-3">
            {workforce.acceptedOfficers.map((officer) => (
              <li
                key={`attendance-${officer.officerId}`}
                className="rounded-xl border border-white/10 bg-slate-900/60 p-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-fo-text">
                    {officer.fullName}
                  </p>
                  <span
                    className={
                      officer.attendance.status === "COMPLETED"
                        ? "rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-200"
                        : officer.attendance.status === "CLOCKED_IN"
                          ? "rounded-full border border-green-500/30 bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-green-200"
                          : "rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-fo-text-muted"
                    }
                  >
                    {officer.attendance.statusLabel}
                  </span>
                </div>

                <dl className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
                  <div>
                    <dt className="text-fo-text-subtle">Clock In</dt>
                    <dd className="mt-0.5 font-medium text-fo-text">
                      {officer.attendance.clockInAt
                        ? formatAttendanceTime(officer.attendance.clockInAt)
                        : "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-fo-text-subtle">Clock Out</dt>
                    <dd className="mt-0.5 font-medium text-fo-text">
                      {officer.attendance.clockOutAt
                        ? formatAttendanceTime(officer.attendance.clockOutAt)
                        : "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-fo-text-subtle">Clock In Location</dt>
                    <dd className="mt-0.5">
                      <AttendanceLocationLink
                        latitude={officer.attendance.clockInLatitude}
                        longitude={officer.attendance.clockInLongitude}
                      />
                    </dd>
                  </div>
                  <div>
                    <dt className="text-fo-text-subtle">Clock Out Location</dt>
                    <dd className="mt-0.5">
                      <AttendanceLocationLink
                        latitude={officer.attendance.clockOutLatitude}
                        longitude={officer.attendance.clockOutLongitude}
                      />
                    </dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
