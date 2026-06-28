import { describe, expect, it } from "vitest";
import { ApplicationStatus, ArmedStatus } from "@/app/generated/prisma/enums";
import {
  buildOfficersCsv,
  getAdminOfficerStats,
  getLastAcceptedCompanyName,
  getNearestLicenseExpiration,
  getOfficerAccountStatus,
  getOfficerLicenseLabels,
  serializeAdminOfficer,
} from "@/lib/admin-officers";

const now = new Date("2026-06-25T12:00:00.000Z");

const baseOfficer = {
  id: "officer-1",
  firstName: "Alex",
  lastName: "Rivera",
  phone: "555-0101",
  city: "Miami",
  state: "FL",
  profilePhotoUrl: null,
  armedStatuses: [ArmedStatus.ARMED],
  licenseCertificationAccepted: true,
  createdAt: new Date("2026-05-01T12:00:00.000Z"),
  updatedAt: new Date("2026-06-20T12:00:00.000Z"),
  user: {
    email: "alex@example.com",
    createdAt: new Date("2026-05-01T12:00:00.000Z"),
  },
  licenses: [
    {
      id: "license-1",
      licenseType: "Armed Security",
      licenseNumber: "G12345",
      issuingState: "FL",
      expirationDate: new Date("2026-08-01T12:00:00.000Z"),
    },
    {
      id: "license-2",
      licenseType: "Unarmed Security",
      licenseNumber: "D67890",
      issuingState: "FL",
      expirationDate: new Date("2026-07-01T12:00:00.000Z"),
    },
  ],
  applications: [
    {
      status: ApplicationStatus.ACCEPTED,
      appliedAt: new Date("2026-06-10T12:00:00.000Z"),
      shift: {
        company: {
          companyName: "Acme Security",
        },
      },
    },
  ],
  _count: {
    applications: 1,
  },
};

describe("admin officers helpers", () => {
  it("derives active status from accepted applications", () => {
    expect(getOfficerAccountStatus(baseOfficer)).toBe("ACTIVE");
  });

  it("derives pending status from completed profile without accepted applications", () => {
    expect(
      getOfficerAccountStatus({
        ...baseOfficer,
        applications: [],
      })
    ).toBe("PENDING");
  });

  it("derives inactive status from incomplete profiles", () => {
    expect(
      getOfficerAccountStatus({
        ...baseOfficer,
        licenseCertificationAccepted: false,
        applications: [],
      })
    ).toBe("INACTIVE");
  });

  it("builds license labels from submitted licenses and armed status", () => {
    expect(getOfficerLicenseLabels(baseOfficer.licenses, baseOfficer.armedStatuses)).toEqual(
      ["G", "D", "Armed"]
    );
  });

  it("finds nearest license expiration", () => {
    expect(getNearestLicenseExpiration(baseOfficer.licenses, now)).toEqual({
      date: new Date("2026-07-01T12:00:00.000Z"),
      daysRemaining: 6,
      expired: false,
    });
  });

  it("returns last accepted company name", () => {
    expect(getLastAcceptedCompanyName(baseOfficer.applications)).toBe(
      "Acme Security"
    );
  });

  it("serializes officer records for the admin UI", () => {
    const serialized = serializeAdminOfficer(baseOfficer, now);

    expect(serialized.fullName).toBe("Alex Rivera");
    expect(serialized.accountStatus).toBe("ACTIVE");
    expect(serialized.licenseCount).toBe(2);
    expect(serialized.lastAcceptedCompany).toBe("Acme Security");
    expect(serialized.nearestExpirationDaysRemaining).toBe(6);
  });

  it("summarizes officer stats", () => {
    const serialized = [
      serializeAdminOfficer(baseOfficer, now),
      serializeAdminOfficer(
        {
          ...baseOfficer,
          id: "officer-2",
          applications: [],
        },
        now
      ),
      serializeAdminOfficer(
        {
          ...baseOfficer,
          id: "officer-3",
          licenseCertificationAccepted: false,
          licenses: [],
          applications: [],
        },
        now
      ),
    ];

    expect(getAdminOfficerStats(serialized)).toEqual({
      total: 3,
      active: 1,
      pending: 1,
      inactive: 1,
    });
  });

  it("builds a CSV export", () => {
    const csv = buildOfficersCsv([serializeAdminOfficer(baseOfficer, now)]);

    expect(csv).toContain("Officer,Email,Status");
    expect(csv).toContain("Alex Rivera");
    expect(csv).toContain("alex@example.com");
  });
});
