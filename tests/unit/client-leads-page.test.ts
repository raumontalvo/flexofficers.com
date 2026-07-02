import { describe, expect, it } from "vitest";
import {
  LeadPaymentStatus,
  LeadStatus,
} from "@/app/generated/prisma/enums";
import {
  extractZipLabel,
  filterClientLeadsByTab,
  formatSecurityRequestId,
  getClientLeadSubtitle,
  getClientLeadsPageStats,
  paginateClientLeads,
  searchClientLeads,
  serializeClientSecurityRequest,
} from "@/lib/client-leads-page";

const baseLead = {
  id: "1005abcd-0000-4000-8000-000000000001",
  serviceNeeded: "Warehouse Security",
  description: "Warehouse Protection",
  city: "Little Rock",
  state: "AR",
  address: "123 Main St, Little Rock, AR 72201",
  dateNeeded: new Date("2026-07-02T12:00:00.000Z"),
  startTime: new Date("2026-07-02T14:00:00.000Z"),
  endTime: new Date("2026-07-02T22:00:00.000Z"),
  officersNeeded: 3,
  budgetOffer: "$1,200",
  status: LeadStatus.OPEN,
  paymentStatus: LeadPaymentStatus.PAID,
  createdAt: new Date("2026-07-01T12:00:00.000Z"),
  _count: { applications: 3 },
};

describe("client leads page helpers", () => {
  it("formats request ids and zip labels", () => {
    expect(formatSecurityRequestId(baseLead.id)).toBe("#SR-1005");
    expect(extractZipLabel(baseLead.address)).toBe("72201");
    expect(getClientLeadSubtitle(baseLead.description, baseLead.serviceNeeded)).toBe(
      "Warehouse Protection"
    );
  });

  it("builds page stats and filters by tab", () => {
    const leads = [
      baseLead,
      {
        ...baseLead,
        id: "pending-lead",
        paymentStatus: LeadPaymentStatus.PENDING,
      },
      {
        ...baseLead,
        id: "completed-lead",
        status: LeadStatus.FILLED,
      },
      {
        ...baseLead,
        id: "cancelled-lead",
        status: LeadStatus.CANCELLED,
      },
    ];

    expect(getClientLeadsPageStats(leads)).toEqual({
      total: 4,
      active: 1,
      pending: 1,
      completed: 1,
      cancelled: 1,
    });

    expect(filterClientLeadsByTab(leads, "active")).toHaveLength(1);
    expect(filterClientLeadsByTab(leads, "pending")).toHaveLength(1);
  });

  it("serializes, searches, and paginates requests", () => {
    const serialized = serializeClientSecurityRequest(baseLead);

    expect(serialized.title).toBe("Warehouse Security");
    expect(serialized.displayStatus).toBe("ACTIVE");
    expect(serialized.href).toBe(`/client/leads/${baseLead.id}`);

    const results = searchClientLeads([serialized], "warehouse");
    expect(results).toHaveLength(1);

    const pagination = paginateClientLeads(
      Array.from({ length: 12 }, (_, index) => ({
        ...serialized,
        id: `lead-${index}`,
        requestId: `#SR-${index}`,
      })),
      2,
      10
    );

    expect(pagination.items).toHaveLength(2);
    expect(pagination.rangeStart).toBe(11);
    expect(pagination.rangeEnd).toBe(12);
  });
});
