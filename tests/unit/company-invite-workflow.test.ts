import { describe, expect, it } from "vitest";
import { ApplicationStatus } from "@/app/generated/prisma/enums";
import {
  getInviteableShiftIdsForOfficer,
  getInviteStateForShift,
  getOfficerInviteButtonState,
} from "@/lib/company-invite-workflow";
import { getCompanyApplicationsSummary } from "@/lib/company-dashboard-data";

describe("company invite workflow", () => {
  it("tracks invite state per shift", () => {
    const invites = [
      {
        id: "invite-1",
        officerId: "officer-1",
        shiftId: "shift-1",
        status: "PENDING" as const,
      },
    ];

    expect(getInviteStateForShift("officer-1", "shift-1", invites)).toEqual({
      kind: "pending",
      label: "Invitation Sent",
    });
    expect(getInviteStateForShift("officer-1", "shift-2", invites)).toEqual({
      kind: "invite",
    });
  });

  it("keeps invite available when another open shift can still be invited", () => {
    const invites = [
      {
        id: "invite-1",
        officerId: "officer-1",
        shiftId: "shift-1",
        status: "PENDING" as const,
      },
    ];

    expect(
      getOfficerInviteButtonState("officer-1", invites, ["shift-1", "shift-2"])
    ).toEqual({
      kind: "invite",
    });
    expect(
      getInviteableShiftIdsForOfficer("officer-1", ["shift-1", "shift-2"], invites)
    ).toEqual(["shift-2"]);
  });

  it("blocks inviting only when every open shift already has an active invite", () => {
    const invites = [
      {
        id: "invite-1",
        officerId: "officer-1",
        shiftId: "shift-1",
        status: "PENDING" as const,
      },
      {
        id: "invite-2",
        officerId: "officer-1",
        shiftId: "shift-2",
        status: "PENDING" as const,
      },
    ];

    expect(
      getOfficerInviteButtonState("officer-1", invites, ["shift-1", "shift-2"])
    ).toEqual({
      kind: "pending",
      label: "Invitation Sent",
    });
  });

  it("allows re-inviting after a declined invite", () => {
    const invites = [
      {
        id: "invite-1",
        officerId: "officer-1",
        shiftId: "shift-1",
        status: "DECLINED" as const,
      },
    ];

    expect(getInviteStateForShift("officer-1", "shift-1", invites)).toEqual({
      kind: "invite",
    });
  });

  it("summarizes pending applications, invited officers, and accepted officers", () => {
    expect(
      getCompanyApplicationsSummary({
        applications: [
          { status: ApplicationStatus.PENDING },
          { status: ApplicationStatus.PENDING },
          { status: ApplicationStatus.ACCEPTED },
        ],
        invitedCount: 2,
      })
    ).toEqual({
      total: 5,
      pending: 2,
      invited: 2,
      accepted: 1,
    });
  });
});
