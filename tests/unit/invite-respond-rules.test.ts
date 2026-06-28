import { describe, expect, it } from "vitest";
import { ApplicationStatus } from "@/app/generated/prisma/enums";
import {
  canAcceptInvite,
  inviteStatusForResponse,
  validateInviteResponseTransition,
} from "@/lib/invite-respond-rules";

describe("invite respond rules", () => {
  it("only allows pending invites to be updated", () => {
    expect(
      validateInviteResponseTransition({
        currentStatus: "PENDING",
        response: "accept",
      })
    ).toEqual({ allowed: true });

    expect(
      validateInviteResponseTransition({
        currentStatus: "ACCEPTED",
        response: "decline",
      })
    ).toEqual({
      allowed: false,
      message: "Only pending invites can be updated.",
    });
  });

  it("maps accept and decline responses to invite statuses", () => {
    expect(inviteStatusForResponse("accept")).toBe("ACCEPTED");
    expect(inviteStatusForResponse("decline")).toBe("DECLINED");
  });

  it("blocks acceptance when the shift is already filled", () => {
    expect(
      canAcceptInvite({
        acceptedCount: 1,
        positionsNeeded: 1,
        existingApplicationStatus: null,
      })
    ).toEqual({
      allowed: false,
      message: "This shift is already filled.",
    });
  });

  it("allows acceptance when the officer is already accepted", () => {
    expect(
      canAcceptInvite({
        acceptedCount: 1,
        positionsNeeded: 1,
        existingApplicationStatus: ApplicationStatus.ACCEPTED,
      })
    ).toEqual({
      allowed: true,
      message: null,
    });
  });
});
