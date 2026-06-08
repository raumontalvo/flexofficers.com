import { describe, expect, it } from "vitest";
import { ApplicationStatus } from "@/app/generated/prisma/enums";
import { validateApplicationDecisionTransition } from "@/app/api/applications/status/decision-rules";

describe("validateApplicationDecisionTransition", () => {
  it("blocks updates when current status is not PENDING", () => {
    const result = validateApplicationDecisionTransition({
      currentStatus: ApplicationStatus.ACCEPTED,
      nextStatus: ApplicationStatus.REJECTED,
      acceptedCount: 0,
      positionsNeeded: 2,
    });

    expect(result.allowed).toBe(false);
    expect(result.message).toBe("Only pending applications can be updated.");
  });

  it("blocks ACCEPTED when shift is already at capacity", () => {
    const result = validateApplicationDecisionTransition({
      currentStatus: ApplicationStatus.PENDING,
      nextStatus: ApplicationStatus.ACCEPTED,
      acceptedCount: 2,
      positionsNeeded: 2,
    });

    expect(result.allowed).toBe(false);
    expect(result.message).toBe("This shift is already filled.");
  });
});
