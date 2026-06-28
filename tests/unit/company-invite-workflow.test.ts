import { describe, expect, it } from "vitest";
import { ApplicationStatus } from "@/app/generated/prisma/enums";
import { getOfficerInviteButtonState } from "@/lib/company-invite-workflow";
import { getCompanyApplicationsSummary } from "@/lib/company-dashboard-data";

describe("company invite workflow", () => {
  it("shows pending invite state on officer cards", () => {
    expect(
      getOfficerInviteButtonState("officer-1", [
        {
          id: "invite-1",
          officerId: "officer-1",
          shiftId: "shift-1",
          status: "PENDING",
        },
      ])
    ).toEqual({
      kind: "pending",
      label: "Invitation Sent",
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
