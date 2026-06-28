import type { SerializedShiftWorkforce } from "@/lib/shift-workforce";

type ShiftWorkforcePanelProps = {
  workforce: SerializedShiftWorkforce;
};

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
    </div>
  );
}
