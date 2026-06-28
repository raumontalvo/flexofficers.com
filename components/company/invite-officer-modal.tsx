"use client";

import { useEffect, useState } from "react";
import { buttonClassName } from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  hasPendingInviteForShift,
  type CompanyOfficerInviteRecord,
} from "@/lib/company-invite-workflow";
import type { CompanyOpenShiftOption } from "@/components/company/invite-officer-to-shift";

type InviteOfficerModalProps = {
  officerId: string | null;
  officerName: string;
  openShifts: CompanyOpenShiftOption[];
  invites: CompanyOfficerInviteRecord[];
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
  const date = new Date(shift.startTime).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return location ? `${shift.title} · ${location} · ${date}` : `${shift.title} · ${date}`;
}

export function InviteOfficerModal({
  officerId,
  officerName,
  openShifts,
  invites,
  onClose,
  onInviteSent,
}: InviteOfficerModalProps) {
  const isOpen = Boolean(officerId);
  const [shiftId, setShiftId] = useState(openShifts[0]?.id ?? "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentInvite, setSentInvite] = useState<CompanyOfficerInviteRecord | null>(
    null
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setShiftId(openShifts[0]?.id ?? "");
    setMessage("");
    setError(null);
    setSentInvite(null);
  }, [isOpen, officerId, openShifts]);

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

  const selectedShiftPending =
    shiftId &&
    hasPendingInviteForShift(officerId, shiftId, invites);

  async function handleSendInvite() {
    if (!shiftId || selectedShiftPending) {
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
      setSentInvite(result.invite);
      onInviteSent(result.invite);
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
          {sentInvite ? (
            <div className="text-center">
              <h2
                id="invite-officer-title"
                className="text-lg font-bold text-fo-text"
              >
                Invitation Sent
              </h2>
              <p className="mt-2 text-sm text-fo-text-muted">
                {officerName} will be notified about your shift invite.
              </p>
              <span className="mt-4 inline-flex rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-200">
                Invited
              </span>
              <button
                type="button"
                onClick={onClose}
                className={buttonClassName({
                  size: "md",
                  className: "mt-6 w-full",
                })}
              >
                Done
              </button>
            </div>
          ) : openShifts.length === 0 ? (
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
                    {openShifts.map((shift) => (
                      <option key={shift.id} value={shift.id}>
                        {formatShiftOptionLabel(shift)}
                      </option>
                    ))}
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

                {selectedShiftPending ? (
                  <p className="text-xs text-amber-200">
                    This officer already has a pending invite for the selected
                    shift.
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
                  disabled={loading || !shiftId || Boolean(selectedShiftPending)}
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
