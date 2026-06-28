import { describe, expect, it } from "vitest";
import { ApplicationStatus } from "@/app/generated/prisma/enums";
import { serializeShiftWorkforce } from "@/lib/shift-workforce";

describe("shift workforce", () => {
  it("labels accepted officers by invitation or application source", () => {
    const workforce = serializeShiftWorkforce({
      id: "shift-1",
      positionsNeeded: 3,
      applications: [
        {
          status: ApplicationStatus.ACCEPTED,
          officer: {
            id: "officer-1",
            firstName: "Raul",
            lastName: "Martinez",
          },
        },
        {
          status: ApplicationStatus.ACCEPTED,
          officer: {
            id: "officer-2",
            firstName: "Michael",
            lastName: "Johnson",
          },
        },
      ],
      shiftInvites: [
        {
          status: "ACCEPTED",
          officer: {
            id: "officer-1",
            firstName: "Raul",
            lastName: "Martinez",
          },
        },
        {
          status: "PENDING",
          officer: {
            id: "officer-3",
            firstName: "Ashley",
            lastName: "Rodriguez",
          },
        },
      ],
    });

    expect(workforce.acceptedOfficers).toEqual([
      {
        officerId: "officer-1",
        fullName: "Raul Martinez",
        source: "invitation",
        detailLabel: "Accepted by Invitation",
      },
      {
        officerId: "officer-2",
        fullName: "Michael Johnson",
        source: "application",
        detailLabel: "Accepted by Application",
      },
    ]);
    expect(workforce.pendingInvites).toEqual([
      {
        officerId: "officer-3",
        fullName: "Ashley Rodriguez",
        detailLabel: "Pending Response",
      },
    ]);
    expect(workforce.openPositionsRemaining).toBe(1);
  });
});
