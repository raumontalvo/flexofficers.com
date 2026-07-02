import { describe, expect, it } from "vitest";
import { LeadStatus } from "@/app/generated/prisma/enums";
import {
  filterCompanyLeadsByTab,
  formatCompanyLeadsPagination,
  getCompanyLeadDisplayStatus,
  getCompanyLeadsPageStats,
  paginateCompanyLeads,
  searchCompanyLeads,
  serializeCompanySecurityLead,
} from "@/lib/company-leads-page";

const now = new Date("2026-07-02T12:00:00.000Z");

const baseLead = {
  id: "1005abcd-0000-4000-8000-000000000001",
  serviceNeeded: "Warehouse Security",
  city: "Little Rock",
  state: "AR",
  address: "123 Main St, Little Rock, AR 72201",
  dateNeeded: new Date("2026-07-02T12:00:00.000Z"),
  startTime: new Date("2026-07-02T14:00:00.000Z"),
  endTime: new Date("2026-07-02T22:00:00.000Z"),
  officersNeeded: 3,
  budgetOffer: "$300",
  status: LeadStatus.OPEN,
};

describe("company leads page helpers", () => {
  it("maps display statuses from lead records", () => {
    expect(getCompanyLeadDisplayStatus(baseLead, now)).toBe("ACTIVE");

    expect(
      getCompanyLeadDisplayStatus(
        { ...baseLead, endTime: new Date("2026-06-01T22:00:00.000Z") },
        now
      )
    ).toBe("CLOSED");

    expect(
      getCompanyLeadDisplayStatus({ ...baseLead, status: LeadStatus.FILLED }, now)
    ).toBe("FILLED");

    expect(
      getCompanyLeadDisplayStatus({ ...baseLead, status: LeadStatus.CANCELLED }, now)
    ).toBe("CANCELLED");
  });

  it("builds page stats and filters by tab", () => {
    const leads = [
      baseLead,
      { ...baseLead, id: "filled-lead", status: LeadStatus.FILLED },
      {
        ...baseLead,
        id: "closed-lead",
        endTime: new Date("2026-06-01T22:00:00.000Z"),
      },
      { ...baseLead, id: "cancelled-lead", status: LeadStatus.CANCELLED },
    ];

    expect(getCompanyLeadsPageStats(leads, now)).toEqual({
      total: 4,
      active: 1,
      filled: 1,
      closed: 1,
      cancelled: 1,
    });

    expect(filterCompanyLeadsByTab(leads, "active", now)).toHaveLength(1);
    expect(filterCompanyLeadsByTab(leads, "filled", now)).toHaveLength(1);
    expect(filterCompanyLeadsByTab(leads, "closed", now)).toHaveLength(1);
  });

  it("serializes, searches, and paginates leads", () => {
    const serialized = serializeCompanySecurityLead(baseLead, now);

    expect(serialized.title).toBe("Warehouse Security");
    expect(serialized.displayStatus).toBe("ACTIVE");
    expect(serialized.zipLabel).toBe("72201");
    expect(serialized.href).toBe(`/company/leads/${baseLead.id}`);

    const results = searchCompanyLeads(
      [
        serialized,
        { ...serialized, id: "2", title: "Event Security", city: "Dallas" },
      ],
      "warehouse"
    );

    expect(results).toHaveLength(1);

    const page = paginateCompanyLeads(results, 1, 6);
    expect(page.items).toHaveLength(1);
    expect(formatCompanyLeadsPagination(1, 6, 24)).toBe("Showing 1 to 6 of 24 leads");
    expect(formatCompanyLeadsPagination(page.rangeStart, page.rangeEnd, page.totalItems)).toBe(
      "Showing 1 to 1 of 1 leads"
    );
  });
});
