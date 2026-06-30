import { describe, expect, it } from "vitest";
import { ApplicationStatus } from "@/app/generated/prisma/enums";
import {
  getInviteableShiftIdsForOfficer,
  getInviteStateForShift,
  getOfficerInviteButtonState,
  buildOfficerInviteNotificationPayload,
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

  it("blocks inviting an officer already assigned to a shift", () => {
    const acceptedAssignments = [
      { officerId: "officer-1", shiftId: "shift-1" },
    ];

    expect(
      getInviteStateForShift(
        "officer-1",
        "shift-1",
        [],
        acceptedAssignments
      )
    ).toEqual({
      kind: "accepted",
      label: "Assigned to Shift",
    });
    expect(
      getInviteableShiftIdsForOfficer(
        "officer-1",
        ["shift-1", "shift-2"],
        [],
        acceptedAssignments
      )
    ).toEqual(["shift-2"]);
    expect(
      getOfficerInviteButtonState(
        "officer-1",
        [],
        ["shift-1", "shift-2"],
        acceptedAssignments
      )
    ).toEqual({
      kind: "invite",
    });
  });

  it("builds officer invite notification and email copy", () => {
    expect(
      buildOfficerInviteNotificationPayload({
        companyName: "Acme Security",
        shiftTitle: "Night Patrol",
      })
    ).toEqual({
      title: "Company Invite to Apply",
      message: "Acme Security invited you to: Night Patrol",
      emailSubject: "Acme Security sent you an invite to apply",
      emailMessage:
        "Acme Security has sent you an invite to apply for Night Patrol. Sign in to FlexOfficers to review the invite and respond.",
    });

    expect(
      buildOfficerInviteNotificationPayload({
        companyName: "Acme Security",
        shiftTitle: "Night Patrol",
        message: "We need coverage this weekend.",
      })
    ).toMatchObject({
      emailMessage:
        "Acme Security has sent you an invite to apply for Night Patrol. Sign in to FlexOfficers to review the invite and respond.\n\nMessage from the company:\nWe need coverage this weekend.",
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
