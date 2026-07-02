import { describe, expect, it } from "vitest";
import { LeadPaymentStatus, LeadStatus } from "@/app/generated/prisma/enums";
import {
  buildClientsCsv,
  getAdminClientStats,
  getClientAccountStatus,
  serializeAdminClient,
} from "@/lib/admin-clients";

const baseClient = {
  id: "client-1",
  contactName: "Jordan Lee",
  companyName: "Sunset Events",
  phone: "555-0202",
  email: "jordan@example.com",
  profilePhotoUrl: null,
  industry: "Events",
  website: "https://sunsetevents.test",
  city: "Tampa",
  state: "FL",
  address: "Tampa, FL",
  createdAt: new Date("2026-05-10T12:00:00.000Z"),
  updatedAt: new Date("2026-06-20T12:00:00.000Z"),
  user: {
    email: "jordan@example.com",
    createdAt: new Date("2026-05-10T12:00:00.000Z"),
  },
  leads: [
    {
      id: "lead-1",
      paymentStatus: LeadPaymentStatus.PAID,
      status: LeadStatus.OPEN,
      createdAt: new Date("2026-06-01T12:00:00.000Z"),
      _count: {
        applications: 2,
      },
    },
  ],
  _count: {
    leads: 1,
  },
} as const;

describe("admin clients helpers", () => {
  it("derives active status from paid security requests", () => {
    expect(getClientAccountStatus(baseClient)).toBe("ACTIVE");
  });

  it("derives pending status from unpaid requests", () => {
    expect(
      getClientAccountStatus({
        ...baseClient,
        leads: [
          {
            ...baseClient.leads[0],
            paymentStatus: LeadPaymentStatus.PENDING,
          },
        ],
      })
    ).toBe("PENDING");
  });

  it("serializes client admin rows with activity counts", () => {
    const client = serializeAdminClient(baseClient);

    expect(client.displayName).toBe("Jordan Lee");
    expect(client.accountStatus).toBe("ACTIVE");
    expect(client.leadCount).toBe(1);
    expect(client.paidLeadCount).toBe(1);
    expect(client.applicationCount).toBe(2);
    expect(client.locationLabel).toBe("Tampa, FL");
  });

  it("builds client stats and csv export", () => {
    const clients = [
      serializeAdminClient(baseClient),
      serializeAdminClient({
        ...baseClient,
        id: "client-2",
        contactName: null,
        companyName: null,
        email: null,
        leads: [],
        _count: { leads: 0 },
        user: {
          email: "",
          createdAt: new Date("2026-05-10T12:00:00.000Z"),
        },
      }),
    ];

    expect(getAdminClientStats(clients)).toEqual({
      total: 2,
      active: 1,
      pending: 0,
      inactive: 1,
    });

    expect(buildClientsCsv(clients)).toContain("Jordan Lee");
  });
});
