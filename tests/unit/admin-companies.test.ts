import { describe, expect, it } from "vitest";
import {
  CompanyAccessStatus,
  CompanySubscriptionStatus,
} from "@/app/generated/prisma/enums";
import {
  buildCompaniesCsv,
  getAdminCompanyStats,
  getCompanyPlanLabel,
  serializeAdminCompany,
} from "@/lib/admin-companies";

const now = new Date("2026-06-25T12:00:00.000Z");

const baseCompany = {
  id: "company-1",
  companyName: "Acme Security",
  contactName: "Jane Doe",
  phone: "555-0100",
  email: "billing@acme.test",
  website: "https://acme.test",
  address: "123 Main St",
  logoUrl: null,
  city: "Miami",
  state: "FL",
  verified: false,
  accessStatus: CompanyAccessStatus.TRIAL,
  trialStartedAt: new Date("2026-06-18T12:00:00.000Z"),
  trialEndsAt: new Date("2026-07-01T12:00:00.000Z"),
  trialExtendedAt: null,
  trialExtendedByAdminId: null,
  trialExtensionReason: null,
  subscriptionStatus: CompanySubscriptionStatus.INACTIVE,
  subscriptionCurrentPeriodEnd: null,
  stripeCustomerId: null,
  stripeSubscriptionId: null,
  createdAt: new Date("2026-06-01T12:00:00.000Z"),
  updatedAt: new Date("2026-06-20T12:00:00.000Z"),
  user: {
    email: "owner@acme.test",
  },
  _count: {
    shifts: 4,
  },
};

describe("admin companies helpers", () => {
  it("labels plans based on access and subscription state", () => {
    expect(getCompanyPlanLabel(baseCompany, now)).toBe("Trial");

    expect(
      getCompanyPlanLabel(
        {
          ...baseCompany,
          accessStatus: CompanyAccessStatus.ACTIVE,
          trialEndsAt: null,
        },
        now
      )
    ).toBe("Paid (Manual)");

    expect(
      getCompanyPlanLabel(
        {
          ...baseCompany,
          subscriptionStatus: CompanySubscriptionStatus.ACTIVE,
          subscriptionCurrentPeriodEnd: new Date("2027-01-01T00:00:00.000Z"),
        },
        now
      )
    ).toBe("Annual Subscription");
  });

  it("serializes company records for the admin UI", () => {
    const serialized = serializeAdminCompany(baseCompany, null, now);

    expect(serialized.companyName).toBe("Acme Security");
    expect(serialized.contactEmail).toBe("billing@acme.test");
    expect(serialized.effectiveStatus).toBe(CompanyAccessStatus.TRIAL);
    expect(serialized.planLabel).toBe("Trial");
    expect(serialized.shiftCount).toBe(4);
  });

  it("summarizes company access stats", () => {
    const serialized = [
      serializeAdminCompany(baseCompany, null, now),
      serializeAdminCompany(
        {
          ...baseCompany,
          id: "company-2",
          accessStatus: CompanyAccessStatus.ACTIVE,
          trialEndsAt: null,
        },
        null,
        now
      ),
      serializeAdminCompany(
        {
          ...baseCompany,
          id: "company-3",
          trialEndsAt: new Date("2026-06-01T00:00:00.000Z"),
        },
        null,
        now
      ),
    ];

    expect(getAdminCompanyStats(serialized)).toEqual({
      total: 3,
      active: 1,
      onTrial: 1,
      expired: 1,
    });
  });

  it("builds a CSV export", () => {
    const csv = buildCompaniesCsv([serializeAdminCompany(baseCompany, null, now)]);

    expect(csv).toContain("Company,Contact Email,Access Status");
    expect(csv).toContain("Acme Security");
    expect(csv).toContain("billing@acme.test");
  });
});
