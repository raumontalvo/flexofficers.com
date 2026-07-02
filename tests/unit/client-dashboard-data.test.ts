import { describe, expect, it } from "vitest";
import {
  LeadPaymentStatus,
  LeadStatus,
} from "@/app/generated/prisma/enums";
import {
  getClientApplicantsOverview,
  getClientDashboardStats,
  getClientLeadDisplayStatus,
  serializeClientDashboardLead,
} from "@/lib/client-dashboard-data";

describe("client dashboard data", () => {
  it("maps lead display statuses", () => {
    expect(
      getClientLeadDisplayStatus({
        status: LeadStatus.OPEN,
        paymentStatus: LeadPaymentStatus.PAID,
      })
    ).toBe("ACTIVE");

    expect(
      getClientLeadDisplayStatus({
        status: LeadStatus.OPEN,
        paymentStatus: LeadPaymentStatus.PENDING,
      })
    ).toBe("PENDING");

    expect(
      getClientLeadDisplayStatus({
        status: LeadStatus.FILLED,
        paymentStatus: LeadPaymentStatus.PAID,
      })
    ).toBe("COMPLETED");

    expect(
      getClientLeadDisplayStatus({
        status: LeadStatus.CANCELLED,
        paymentStatus: LeadPaymentStatus.PAID,
      })
    ).toBe("CANCELLED");
  });

  it("builds dashboard stats from leads and pending applicants", () => {
    expect(
      getClientDashboardStats({
        leads: [
          { status: LeadStatus.OPEN, paymentStatus: LeadPaymentStatus.PAID },
          { status: LeadStatus.OPEN, paymentStatus: LeadPaymentStatus.PENDING },
          { status: LeadStatus.FILLED, paymentStatus: LeadPaymentStatus.PAID },
        ],
        pendingApplicants: 4,
      })
    ).toEqual({
      totalLeads: 3,
      activeLeads: 1,
      pendingApplicants: 4,
    });
  });

  it("aggregates applicant overview counts", () => {
    expect(
      getClientApplicantsOverview([
        { status: "ACCEPTED" },
        { status: "PENDING" },
        { status: "PENDING" },
        { status: "REJECTED" },
      ])
    ).toEqual({
      hired: 1,
      pendingReview: 2,
      declined: 1,
      withdrawn: 0,
      total: 4,
    });
  });

  it("serializes recent dashboard leads", () => {
    const lead = serializeClientDashboardLead({
      id: "lead-1",
      serviceNeeded: "Warehouse Security",
      city: "Little Rock",
      state: "AR",
      dateNeeded: new Date("2026-07-02T12:00:00.000Z"),
      startTime: new Date("2026-07-02T14:00:00.000Z"),
      endTime: new Date("2026-07-02T22:00:00.000Z"),
      status: LeadStatus.OPEN,
      paymentStatus: LeadPaymentStatus.PAID,
      _count: { applications: 3 },
    });

    expect(lead.title).toBe("Warehouse Security");
    expect(lead.displayStatus).toBe("ACTIVE");
    expect(lead.locationLabel).toBe("Little Rock, AR");
    expect(lead.applicantCount).toBe(3);
    expect(lead.href).toBe("/client/leads/lead-1/applicants");
  });
});
