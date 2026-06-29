"use client";

import { useState } from "react";
import { buttonClassName, StatusToast } from "@/components/ui";

export type CompanyOpenShiftOption = {
  id: string;
  title: string;
  city: string | null;
  state: string | null;
  startTime: string;
  visibility?: "PUBLIC" | "STAFF_ONLY";
};

type InviteOfficerToShiftProps = {
  officerId: string;
  openShifts: CompanyOpenShiftOption[];
};

async function createInvite(shiftId: string, officerId: string) {
  const response = await fetch("/api/invites", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ shiftId, officerId }),
  });

  if (response.ok) {
    return { ok: true as const };
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

export function InviteOfficerToShift({
  officerId,
  openShifts,
}: InviteOfficerToShiftProps) {
  const [shiftId, setShiftId] = useState(openShifts[0]?.id ?? "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showSentToast, setShowSentToast] = useState(false);

  if (openShifts.length === 0) {
    return (
      <LinkFallback message="Post an open shift to invite this officer." />
    );
  }

  async function handleInvite() {
    if (!shiftId) {
      return;
    }

    setLoading(true);
    setMessage(null);
    setShowSentToast(false);

    const result = await createInvite(shiftId, officerId);

    if (result.ok) {
      setMessage("Invite sent.");
      setShowSentToast(true);
    } else {
      setMessage(result.error);
    }

    setLoading(false);
  }

  return (
    <div className="space-y-2">
      {showSentToast ? (
        <StatusToast message="Invite sent" onClose={() => setShowSentToast(false)} />
      ) : null}

      <label className="block text-xs font-medium uppercase tracking-wide text-fo-text-muted">
        Invite to Shift
      </label>
      <select
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
      <button
        type="button"
        disabled={loading || !shiftId}
        onClick={handleInvite}
        className={buttonClassName({
          fullWidth: true,
          className: "w-full",
        })}
      >
        {loading ? "Sending..." : "Invite to Apply"}
      </button>
      {message ? (
        <p
          className={
            message === "Invite sent."
              ? "rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-100"
              : "text-xs text-red-300"
          }
        >
          {message}
        </p>
      ) : (
        <p className="text-xs text-fo-text-muted">
          The officer will receive a company invite they can accept or decline.
        </p>
      )}
    </div>
  );
}

function LinkFallback({ message }: { message: string }) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-fo-text-muted">{message}</p>
      <a
        href="/shifts/create"
        className={buttonClassName({
          variant: "secondary",
          fullWidth: true,
          className: "w-full text-center",
        })}
      >
        Post a Shift
      </a>
    </div>
  );
}
