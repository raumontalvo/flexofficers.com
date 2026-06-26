import { describe, expect, it } from "vitest";
import { ApplicationStatus } from "@/app/generated/prisma/enums";
import { validateApplicationWithdrawal } from "@/app/api/applications/withdraw/rules";

describe("validateApplicationWithdrawal", () => {
  it("allows withdrawal from PENDING", () => {
    const result = validateApplicationWithdrawal({
      currentStatus: ApplicationStatus.PENDING,
    });

    expect(result.allowed).toBe(true);
  });

  it("blocks withdrawal after ACCEPTED", () => {
    const result = validateApplicationWithdrawal({
      currentStatus: ApplicationStatus.ACCEPTED,
    });

    expect(result.allowed).toBe(false);
    expect(result.message).toBe("Only pending applications can be withdrawn.");
  });

  it("blocks withdrawal after REJECTED", () => {
    const result = validateApplicationWithdrawal({
      currentStatus: ApplicationStatus.REJECTED,
    });

    expect(result.allowed).toBe(false);
    expect(result.message).toBe("Only pending applications can be withdrawn.");
  });

  it("blocks withdrawal when already WITHDRAWN", () => {
    const result = validateApplicationWithdrawal({
      currentStatus: ApplicationStatus.WITHDRAWN,
    });

    expect(result.allowed).toBe(false);
    expect(result.message).toBe("Only pending applications can be withdrawn.");
  });
});
