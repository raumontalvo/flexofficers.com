import { describe, expect, it } from "vitest";
import { LeadApplicationStatus } from "@/app/generated/prisma/enums";
import {
  filterClientApplicationsByTab,
  formatClientApplicationsPagination,
  getClientApplicationDisplayStatus,
  getClientApplicationsPageStats,
  searchClientApplications,
  serializeClientLeadApplication,
} from "@/lib/client-applications-page";

const baseApplication = {
  id: "app-1",
  status: LeadApplicationStatus.PENDING,
  createdAt: new Date("2026-06-28T14:24:00.000Z"),
  securityLeadId: "lead-1",
  companyId: "company-1",
  company: {
    companyName: "SecurePro Services",
    logoUrl: null,
  },
  securityLead: {
    serviceNeeded: "Warehouse Security",
    city: "Little Rock",
    state: "AR",
    dateNeeded: new Date("2026-07-02T12:00:00.000Z"),
    startTime: new Date("2026-07-02T14:00:00.000Z"),
    endTime: new Date("2026-07-02T22:00:00.000Z"),
    budgetOffer: "$300",
  },
};

describe("client applications page helpers", () => {
  it("maps application display statuses", () => {
    expect(getClientApplicationDisplayStatus(LeadApplicationStatus.PENDING)).toBe(
      "PENDING_REVIEW"
    );
    expect(getClientApplicationDisplayStatus(LeadApplicationStatus.ACCEPTED)).toBe("HIRED");
    expect(getClientApplicationDisplayStatus(LeadApplicationStatus.REJECTED)).toBe("DECLINED");
  });

  it("builds stats and serializes applications", () => {
    const applications = [
      baseApplication,
      {
        ...baseApplication,
        id: "app-2",
        status: LeadApplicationStatus.ACCEPTED,
      },
      {
        ...baseApplication,
        id: "app-3",
        status: LeadApplicationStatus.REJECTED,
      },
    ];

    expect(getClientApplicationsPageStats(applications)).toEqual({
      total: 3,
      pending: 1,
      hired: 1,
      declined: 1,
      withdrawn: 0,
    });

    const serialized = serializeClientLeadApplication(baseApplication);
    expect(serialized.companyName).toBe("SecurePro Services");
    expect(serialized.displayStatus).toBe("PENDING_REVIEW");
    expect(serialized.profileHref).toBe("/client/leads/lead-1/companies/company-1");
  });

  it("filters, searches, and formats pagination", () => {
    const serialized = [
      serializeClientLeadApplication(baseApplication),
      serializeClientLeadApplication({
        ...baseApplication,
        id: "app-2",
        status: LeadApplicationStatus.ACCEPTED,
        company: { companyName: "Alpha Security", logoUrl: null },
      }),
    ];

    expect(filterClientApplicationsByTab(serialized, "pending")).toHaveLength(1);
    expect(searchClientApplications(serialized, "alpha")).toHaveLength(1);
    expect(formatClientApplicationsPagination(1, 6, 16)).toBe(
      "Showing 1 to 6 of 16 applications"
    );
  });
});
