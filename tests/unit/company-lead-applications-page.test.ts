import { describe, expect, it } from "vitest";
import { LeadApplicationStatus } from "@/app/generated/prisma/enums";
import {
  filterCompanyApplicationsByTab,
  getCompanyApplicationDisplayStatus,
  getCompanyApplicationsPageStats,
  getCompanyClientDisplayName,
  paginateCompanyApplications,
  searchCompanyApplications,
  serializeCompanyLeadApplication,
} from "@/lib/company-lead-applications-page";

const baseApplication = {
  id: "app-1",
  status: LeadApplicationStatus.PENDING,
  createdAt: new Date("2026-06-28T14:24:00.000Z"),
  securityLeadId: "lead-1",
  securityLead: {
    serviceNeeded: "Warehouse Security",
    city: "Little Rock",
    state: "AR",
    dateNeeded: new Date("2026-07-02T12:00:00.000Z"),
    startTime: new Date("2026-07-02T14:00:00.000Z"),
    endTime: new Date("2026-07-02T22:00:00.000Z"),
    budgetOffer: "$300",
    companyName: "Central Logistics Inc.",
    contactName: "Jordan Lee",
    client: {
      companyName: "Central Logistics Inc.",
      contactName: "Jordan Lee",
      profilePhotoUrl: null,
    },
  },
};

describe("company lead applications page helpers", () => {
  it("maps display statuses from application records", () => {
    expect(getCompanyApplicationDisplayStatus(LeadApplicationStatus.PENDING)).toBe(
      "PENDING_REVIEW"
    );
    expect(getCompanyApplicationDisplayStatus(LeadApplicationStatus.ACCEPTED)).toBe("HIRED");
    expect(getCompanyApplicationDisplayStatus(LeadApplicationStatus.REJECTED)).toBe(
      "NOT_SELECTED"
    );
  });

  it("resolves client display names from lead and client fields", () => {
    expect(getCompanyClientDisplayName(baseApplication.securityLead)).toBe(
      "Central Logistics Inc."
    );

    expect(
      getCompanyClientDisplayName({
        ...baseApplication.securityLead,
        companyName: null,
        contactName: "BuildRight Group",
        client: { companyName: null, contactName: null, profilePhotoUrl: null },
      })
    ).toBe("BuildRight Group");
  });

  it("builds stats, filters, searches, and serializes applications", () => {
    const applications = [
      baseApplication,
      { ...baseApplication, id: "app-2", status: LeadApplicationStatus.ACCEPTED },
      { ...baseApplication, id: "app-3", status: LeadApplicationStatus.REJECTED },
    ];

    expect(getCompanyApplicationsPageStats(applications)).toEqual({
      total: 3,
      pending: 1,
      hired: 1,
      notSelected: 1,
    });

    const serialized = applications.map(serializeCompanyLeadApplication);
    expect(serialized[0]?.leadTitle).toBe("Warehouse Security");
    expect(serialized[0]?.clientName).toBe("Central Logistics Inc.");
    expect(serialized[0]?.detailHref).toBe("/company/leads/lead-1");

    expect(filterCompanyApplicationsByTab(serialized, "pending")).toHaveLength(1);
    expect(searchCompanyApplications(serialized, "warehouse")).toHaveLength(3);

    const page = paginateCompanyApplications(serialized, 1, 6);
    expect(page.items).toHaveLength(3);
  });
});
