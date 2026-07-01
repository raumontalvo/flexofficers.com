import { describe, expect, it } from "vitest";
import { CompanyAccessStatus, CompanySubscriptionStatus } from "@/app/generated/prisma/enums";
import {
  canCompanyPostNewShifts,
  getEffectiveAccessStatus,
  getCompanyAccessSummary,
} from "@/lib/company-access";
import {
  buildTrialExtensionUpdate,
  calculateExtendedTrialEnd,
  getDefaultTrialFields,
  getPreTrialFields,
  getTrialDaysRemaining,
  getTrialStartUpdateIfEligible,
} from "@/lib/company-trial";

describe("company trial helpers", () => {
  const now = new Date("2026-06-25T12:00:00.000Z");

  it("initializes a 7-day trial on signup defaults", () => {
    const defaults = getDefaultTrialFields(now);

    expect(defaults.accessStatus).toBe(CompanyAccessStatus.TRIAL);
    expect(defaults.trialStartedAt).toEqual(now);
    expect(defaults.trialEndsAt).toEqual(new Date("2026-07-02T12:00:00.000Z"));
  });

  it("returns pre-trial fields before profile completion", () => {
    expect(getPreTrialFields()).toEqual({
      trialStartedAt: null,
      trialEndsAt: null,
      accessStatus: CompanyAccessStatus.EXPIRED,
    });
  });

  it("starts the trial only when profile is complete and trial has not started", () => {
    expect(
      getTrialStartUpdateIfEligible(null, false, now)
    ).toEqual({});
    expect(
      getTrialStartUpdateIfEligible({ trialStartedAt: now }, true, now)
    ).toEqual({});
    expect(getTrialStartUpdateIfEligible(null, true, now)).toEqual(
      getDefaultTrialFields(now)
    );
  });

  it("extends from the current trial end when still active", () => {
    const currentTrialEndsAt = new Date("2026-07-01T12:00:00.000Z");

    expect(calculateExtendedTrialEnd(currentTrialEndsAt, 7, now)).toEqual(
      new Date("2026-07-08T12:00:00.000Z")
    );
  });

  it("extends from today when the trial is expired or missing", () => {
    expect(
      calculateExtendedTrialEnd(new Date("2026-06-01T12:00:00.000Z"), 14, now)
    ).toEqual(new Date("2026-07-09T12:00:00.000Z"));

    expect(calculateExtendedTrialEnd(null, 30, now)).toEqual(
      new Date("2026-07-25T12:00:00.000Z")
    );
  });

  it("builds trial extension audit fields", () => {
    const update = buildTrialExtensionUpdate(
      { trialEndsAt: new Date("2026-07-01T12:00:00.000Z") },
      7,
      "admin-user-id",
      "Onboarding delay",
      now
    );

    expect(update).toEqual({
      trialEndsAt: new Date("2026-07-08T12:00:00.000Z"),
      accessStatus: CompanyAccessStatus.TRIAL,
      trialExtendedAt: now,
      trialExtendedByAdminId: "admin-user-id",
      trialExtensionReason: "Onboarding delay",
    });
  });

  it("calculates remaining trial days", () => {
    expect(
      getTrialDaysRemaining(new Date("2026-06-27T12:00:00.000Z"), now)
    ).toBe(2);
    expect(
      getTrialDaysRemaining(new Date("2026-06-25T10:00:00.000Z"), now)
    ).toBe(0);
    expect(getTrialDaysRemaining(null, now)).toBeNull();
  });
});

describe("company access rules", () => {
  const now = new Date("2026-06-25T12:00:00.000Z");

  it("treats future trials as active access", () => {
    const company = {
      accessStatus: CompanyAccessStatus.TRIAL,
      trialEndsAt: new Date("2026-07-01T12:00:00.000Z"),
      subscriptionStatus: CompanySubscriptionStatus.INACTIVE,
      subscriptionCurrentPeriodEnd: null,
    };

    expect(getEffectiveAccessStatus(company, now)).toBe(
      CompanyAccessStatus.TRIAL
    );
    expect(canCompanyPostNewShifts(company, now)).toBe(true);
  });

  it("treats expired trials as expired access", () => {
    const company = {
      accessStatus: CompanyAccessStatus.TRIAL,
      trialEndsAt: new Date("2026-06-01T12:00:00.000Z"),
      subscriptionStatus: CompanySubscriptionStatus.INACTIVE,
      subscriptionCurrentPeriodEnd: null,
    };

    expect(getEffectiveAccessStatus(company, now)).toBe(
      CompanyAccessStatus.EXPIRED
    );
    expect(canCompanyPostNewShifts(company, now)).toBe(false);
  });

  it("allows posting when access status is ACTIVE", () => {
    const company = {
      accessStatus: CompanyAccessStatus.ACTIVE,
      trialEndsAt: null,
      subscriptionStatus: CompanySubscriptionStatus.INACTIVE,
      subscriptionCurrentPeriodEnd: null,
    };

    expect(canCompanyPostNewShifts(company, now)).toBe(true);
  });

  it("blocks posting when access status is EXPIRED", () => {
    const company = {
      accessStatus: CompanyAccessStatus.EXPIRED,
      trialEndsAt: new Date("2026-07-01T12:00:00.000Z"),
      subscriptionStatus: CompanySubscriptionStatus.INACTIVE,
      subscriptionCurrentPeriodEnd: null,
    };

    expect(canCompanyPostNewShifts(company, now)).toBe(false);
  });

  it("blocks posting before the trial starts", () => {
    const company = {
      accessStatus: CompanyAccessStatus.EXPIRED,
      trialStartedAt: null,
      trialEndsAt: null,
      subscriptionStatus: CompanySubscriptionStatus.INACTIVE,
      subscriptionCurrentPeriodEnd: null,
    };

    expect(canCompanyPostNewShifts(company, now)).toBe(false);
  });

  it("summarizes trial days remaining for admin views", () => {
    const summary = getCompanyAccessSummary(
      {
        accessStatus: CompanyAccessStatus.TRIAL,
        trialEndsAt: new Date("2026-06-27T12:00:00.000Z"),
      },
      now
    );

    expect(summary).toEqual({
      effectiveStatus: CompanyAccessStatus.TRIAL,
      daysRemaining: 2,
      statusLabel: "Trial",
    });
  });
});
