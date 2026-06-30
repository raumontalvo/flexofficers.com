"use client";

import { useEffect, useState } from "react";
import { buttonClassName } from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  getInviteableShiftIdsForOfficer,
  getInviteStateForShift,
  type CompanyOfficerInviteRecord,
  type CompanyOfficerShiftAssignment,
} from "@/lib/company-invite-workflow";
import type { CompanyOpenShiftOption } from "@/components/company/invite-officer-to-shift";

type InviteOfficerModalProps = {
  officerId: string | null;
  officerName: string;
  openShifts: CompanyOpenShiftOption[];
  invites: CompanyOfficerInviteRecord[];
  acceptedAssignments?: CompanyOfficerShiftAssignment[];
  onClose: () => void;
  onInviteSent: (invite: CompanyOfficerInviteRecord) => void;
};

async function createInvite(input: {
  shiftId: string;
  officerId: string;
  message?: string;
}) {
  const response = await fetch("/api/invites", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (response.ok) {
    return {
      ok: true as const,
      invite: (await response.json()) as CompanyOfficerInviteRecord,
    };
  }

  const data = (await response.json().catch(() => null)) as {
    error?: string;
  } | null;

  return {
    ok: false as const,
    error: data?.error || "Failed to send invite.",
  };
}

function formatShiftOptionLabel(shift: CompanyOpenShiftOption) {
  const location = [shift.city, shift.state].filter(Boolean).join(", ");
  const date = new Date(shift.startTime).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
  const visibilityLabel =
    shift.visibility === "STAFF_ONLY" ? " · Staff only" : "";

  return `${shift.title}${location ? ` · ${location}` : ""} · ${date}${visibilityLabel}`;
}

export function InviteOfficerModal({
  officerId,
  officerName,
  openShifts,
  invites,
  acceptedAssignments = [],
  onClose,
  onInviteSent,
}: InviteOfficerModalProps) {
  const isOpen = Boolean(officerId);
  const [shiftId, setShiftId] = useState(openShifts[0]?.id ?? "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !officerId) {
      return;
    }

    const openShiftIds = openShifts.map((shift) => shift.id);
    const inviteableShiftIds = getInviteableShiftIdsForOfficer(
      officerId,
      openShiftIds,
      invites,
      acceptedAssignments
    );

    setShiftId(inviteableShiftIds[0] ?? openShifts[0]?.id ?? "");
    setMessage("");
    setError(null);
  }, [acceptedAssignments, isOpen, officerId, openShifts, invites]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !officerId) {
    return null;
  }

  const selectedShiftState =
    shiftId && officerId
      ? getInviteStateForShift(
          officerId,
          shiftId,
          invites,
          acceptedAssignments
        )
      : null;
  const canSendInvite = Boolean(shiftId) && selectedShiftState?.kind === "invite";

  async function handleSendInvite() {
    if (!shiftId || !canSendInvite) {
      return;
    }

    setLoading(true);
    setError(null);

    const result = await createInvite({
      shiftId,
      officerId: officerId!,
      message,
    });

    if (result.ok) {
      onInviteSent(result.invite);
      onClose();
    } else {
      setError(result.error);
    }

    setLoading(false);
  }

  return (
    <>
      <button
        type="button"
        aria-label="Close invite officer modal"
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="invite-officer-title"
          className="fo-glass-card w-full max-w-lg rounded-xl border border-white/10 p-5 shadow-2xl"
        >
          {openShifts.length === 0 ? (
            <div>
              <h2
                id="invite-officer-title"
                className="text-lg font-bold text-fo-text"
              >
                Invite Officer
              </h2>
              <p className="mt-2 text-sm text-fo-text-muted">
                Post an open shift before inviting {officerName}.
              </p>
              <div className="mt-5 flex gap-2">
                <a
                  href="/shifts/create"
                  className={buttonClassName({
                    size: "md",
                    className: "flex-1 text-center",
                  })}
                >
                  Post a Shift
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className={buttonClassName({
                    variant: "secondary",
                    size: "md",
                    className: "flex-1",
                  })}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2
                id="invite-officer-title"
                className="text-lg font-bold text-fo-text"
              >
                Invite Officer
              </h2>
              <p className="mt-1 text-sm text-fo-text-muted">
                Select one of your open shifts.
              </p>

              <div className="mt-5 space-y-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="invite-shift"
                    className="text-xs font-medium uppercase tracking-wide text-fo-text-muted"
                  >
                    Open Shifts
                  </label>
                  <select
                    id="invite-shift"
                    value={shiftId}
                    onChange={(event) => setShiftId(event.target.value)}
                    className="min-h-10 w-full rounded-lg border border-fo-border bg-fo-bg/80 px-3 py-2 text-sm text-fo-text"
                  >
                    {openShifts.map((shift) => {
                      const shiftState = getInviteStateForShift(
                        officerId,
                        shift.id,
                        invites,
                        acceptedAssignments
                      );
                      const shiftBlocked = shiftState.kind !== "invite";
                      const statusSuffix =
                        shiftState.kind === "pending"
                          ? " · Invite sent"
                          : shiftState.kind === "accepted"
                            ? ` · ${shiftState.label}`
                            : "";

                      return (
                        <option
                          key={shift.id}
                          value={shift.id}
                          disabled={shiftBlocked}
                        >
                          {formatShiftOptionLabel(shift)}
                          {statusSuffix}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="invite-message"
                    className="text-xs font-medium uppercase tracking-wide text-fo-text-muted"
                  >
                    Add a short message (optional)
                  </label>
                  <textarea
                    id="invite-message"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    rows={3}
                    placeholder="Let the officer know why this shift is a good fit."
                    className="w-full rounded-lg border border-fo-border bg-fo-bg/80 px-3 py-2 text-sm text-fo-text placeholder:text-fo-text-subtle"
                  />
                </div>

                {selectedShiftState?.kind === "pending" ? (
                  <p className="text-xs text-amber-200">
                    This officer already has a pending invite for the selected
                    shift.
                  </p>
                ) : null}

                {selectedShiftState?.kind === "accepted" ? (
                  <p className="text-xs text-emerald-200">
                    {selectedShiftState.label === "Assigned to Shift"
                      ? "This officer is already assigned to the selected shift."
                      : "This officer already accepted an invite for the selected shift."}
                  </p>
                ) : null}

                {error ? (
                  <p className="text-xs text-red-300">{error}</p>
                ) : null}
              </div>

              <div className="mt-6 flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className={buttonClassName({
                    variant: "secondary",
                    size: "md",
                    className: "flex-1",
                  })}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={loading || !canSendInvite}
                  onClick={handleSendInvite}
                  className={cn(
                    buttonClassName({
                      size: "md",
                      className: "flex-1",
                    })
                  )}
                >
                  {loading ? "Sending..." : "Send Invite"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
