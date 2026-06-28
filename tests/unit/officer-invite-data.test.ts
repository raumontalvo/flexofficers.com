import { describe, expect, it } from "vitest";
import {
  filterInvitesByTab,
  formatInvitedTimeAgo,
  getInviteTabCounts,
  mapOfficerInvite,
  sortOfficerInvites,
} from "@/lib/officer-invite-data";

const baseInvite = {
  id: "invite-1",
  status: "PENDING" as const,
  invitedAt: new Date("2026-06-26T10:00:00.000Z"),
  respondedAt: null,
  shift: {
    id: "shift-1",
    title: "Retail Security",
    hourlyRate: { toString: () => "28" },
    location: "123 Main St",
    city: "Fort Myers",
    state: "FL",
    startTime: new Date("2026-06-28T14:00:00.000Z"),
    endTime: new Date("2026-06-28T22:00:00.000Z"),
    company: {
      companyName: "SecureCo",
      logoUrl: null,
    },
  },
};

describe("officer invite data", () => {
  it("maps invite records for the officer UI", () => {
    const invite = mapOfficerInvite(baseInvite);

    expect(invite.company.companyName).toBe("SecureCo");
    expect(invite.shift.title).toBe("Retail Security");
    expect(invite.status).toBe("PENDING");
  });

  it("counts invites by tab and filters pending", () => {
    const invites = [
      mapOfficerInvite(baseInvite),
      mapOfficerInvite({
        ...baseInvite,
        id: "invite-2",
        status: "ACCEPTED",
      }),
    ];

    expect(getInviteTabCounts(invites)).toEqual({
      all: 2,
      pending: 1,
      accepted: 1,
      declined: 0,
    });
    expect(filterInvitesByTab(invites, "pending")).toHaveLength(1);
  });

  it("sorts invites newest first", () => {
    const invites = [
      mapOfficerInvite({
        ...baseInvite,
        id: "older",
        invitedAt: new Date("2026-06-20T10:00:00.000Z"),
      }),
      mapOfficerInvite({
        ...baseInvite,
        id: "newer",
        invitedAt: new Date("2026-06-26T10:00:00.000Z"),
      }),
    ];

    expect(sortOfficerInvites(invites, "newest").map((invite) => invite.id)).toEqual([
      "newer",
      "older",
    ]);
  });

  it("formats invited time ago labels", () => {
    const now = new Date("2026-06-26T12:00:00.000Z");
    expect(
      formatInvitedTimeAgo("2026-06-26T10:00:00.000Z", now)
    ).toBe("Invited 2 hours ago");
  });
});
