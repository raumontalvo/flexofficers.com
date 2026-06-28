import { ApplicationStatus, ArmedStatus } from "@/app/generated/prisma/enums";
import type { AdminOfficerRecord } from "@/lib/officer-fields";
import { getLicenseDisplayMeta } from "@/app/officer/profile/license-display";

export type OfficerAccountStatus = "ACTIVE" | "PENDING" | "INACTIVE";

export type SerializedAdminLicense = {
  id: string;
  licenseType: string;
  licenseNumber: string;
  issuingState: string;
  expirationDate: string;
  daysRemaining: number;
  expired: boolean;
  shortLabel: string;
};

export type SerializedAdminOfficer = {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  city: string | null;
  state: string | null;
  profilePhotoUrl: string | null;
  armedStatuses: ArmedStatus[];
  accountStatus: OfficerAccountStatus;
  licenseLabels: string[];
  licenseCount: number;
  licenses: SerializedAdminLicense[];
  nearestExpirationDate: string | null;
  nearestExpirationDaysRemaining: number | null;
  nearestExpirationExpired: boolean;
  lastAcceptedCompany: string | null;
  applicationCount: number;
  acceptedApplicationCount: number;
  pendingApplicationCount: number;
  lastAppliedAt: string | null;
  licenseCertificationAccepted: boolean;
  joinedAt: string;
  updatedAt: string;
};

export type AdminOfficerStats = {
  total: number;
  active: number;
  pending: number;
  inactive: number;
};

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function toIso(date: Date | null | undefined) {
  return date ? date.toISOString() : null;
}

export function getLicenseDaysRemaining(
  expirationDate: Date,
  now: Date = new Date()
) {
  const remainingMs = expirationDate.getTime() - now.getTime();
  return Math.ceil(remainingMs / MS_PER_DAY);
}

export function getOfficerAccountStatus(
  officer: Pick<
    AdminOfficerRecord,
    "licenseCertificationAccepted" | "licenses" | "applications"
  >
): OfficerAccountStatus {
  const hasAcceptedApplication = officer.applications.some(
    (application) => application.status === ApplicationStatus.ACCEPTED
  );

  const profileReady =
    officer.licenseCertificationAccepted && officer.licenses.length > 0;

  if (hasAcceptedApplication) {
    return "ACTIVE";
  }

  if (profileReady) {
    return "PENDING";
  }

  return "INACTIVE";
}

export function getOfficerLicenseLabels(
  licenses: AdminOfficerRecord["licenses"],
  armedStatuses: ArmedStatus[]
) {
  const labels = new Set<string>();

  for (const license of licenses) {
    const shortLabel = getLicenseDisplayMeta(license.licenseType).shortLabel;
    labels.add(shortLabel.replace(/\s+License$/i, ""));
  }

  for (const armedStatus of armedStatuses) {
    labels.add(armedStatus === ArmedStatus.ARMED ? "Armed" : "Unarmed");
  }

  return [...labels];
}

export function getNearestLicenseExpiration(
  licenses: AdminOfficerRecord["licenses"],
  now: Date = new Date()
) {
  if (licenses.length === 0) {
    return {
      date: null,
      daysRemaining: null,
      expired: false,
    };
  }

  const nearest = [...licenses].sort(
    (left, right) =>
      left.expirationDate.getTime() - right.expirationDate.getTime()
  )[0];

  const daysRemaining = getLicenseDaysRemaining(nearest.expirationDate, now);

  return {
    date: nearest.expirationDate,
    daysRemaining,
    expired: daysRemaining <= 0,
  };
}

export function getLastAcceptedCompanyName(
  applications: AdminOfficerRecord["applications"]
) {
  const acceptedApplication = applications.find(
    (application) => application.status === ApplicationStatus.ACCEPTED
  );

  return acceptedApplication?.shift.company.companyName ?? null;
}

export function serializeAdminLicense(
  license: AdminOfficerRecord["licenses"][number],
  now: Date = new Date()
): SerializedAdminLicense {
  const daysRemaining = getLicenseDaysRemaining(license.expirationDate, now);

  return {
    id: license.id,
    licenseType: license.licenseType,
    licenseNumber: license.licenseNumber,
    issuingState: license.issuingState,
    expirationDate: license.expirationDate.toISOString(),
    daysRemaining,
    expired: daysRemaining <= 0,
    shortLabel: getLicenseDisplayMeta(license.licenseType).shortLabel.replace(
      /\s+License$/i,
      ""
    ),
  };
}

export function serializeAdminOfficer(
  officer: AdminOfficerRecord,
  now: Date = new Date()
): SerializedAdminOfficer {
  const nearestExpiration = getNearestLicenseExpiration(officer.licenses, now);
  const acceptedApplicationCount = officer.applications.filter(
    (application) => application.status === ApplicationStatus.ACCEPTED
  ).length;
  const pendingApplicationCount = officer.applications.filter(
    (application) => application.status === ApplicationStatus.PENDING
  ).length;

  return {
    id: officer.id,
    fullName: `${officer.firstName} ${officer.lastName}`.trim(),
    firstName: officer.firstName,
    lastName: officer.lastName,
    email: officer.user.email,
    phone: officer.phone,
    city: officer.city,
    state: officer.state,
    profilePhotoUrl: officer.profilePhotoUrl,
    armedStatuses: officer.armedStatuses,
    accountStatus: getOfficerAccountStatus(officer),
    licenseLabels: getOfficerLicenseLabels(
      officer.licenses,
      officer.armedStatuses
    ),
    licenseCount: officer.licenses.length,
    licenses: officer.licenses.map((license) =>
      serializeAdminLicense(license, now)
    ),
    nearestExpirationDate: toIso(nearestExpiration.date),
    nearestExpirationDaysRemaining: nearestExpiration.daysRemaining,
    nearestExpirationExpired: nearestExpiration.expired,
    lastAcceptedCompany: getLastAcceptedCompanyName(officer.applications),
    applicationCount: officer._count.applications,
    acceptedApplicationCount,
    pendingApplicationCount,
    lastAppliedAt: toIso(officer.applications[0]?.appliedAt ?? null),
    licenseCertificationAccepted: officer.licenseCertificationAccepted,
    joinedAt: officer.user.createdAt.toISOString(),
    updatedAt: officer.updatedAt.toISOString(),
  };
}

export function getAdminOfficerStats(
  officers: Pick<SerializedAdminOfficer, "accountStatus">[]
): AdminOfficerStats {
  return officers.reduce<AdminOfficerStats>(
    (stats, officer) => {
      stats.total += 1;

      switch (officer.accountStatus) {
        case "ACTIVE":
          stats.active += 1;
          break;
        case "PENDING":
          stats.pending += 1;
          break;
        case "INACTIVE":
          stats.inactive += 1;
          break;
        default:
          break;
      }

      return stats;
    },
    { total: 0, active: 0, pending: 0, inactive: 0 }
  );
}

function escapeCsvValue(value: string | number | null | undefined) {
  const normalized = value == null ? "" : String(value);

  if (/[",\n]/.test(normalized)) {
    return `"${normalized.replaceAll('"', '""')}"`;
  }

  return normalized;
}

export function buildOfficersCsv(officers: SerializedAdminOfficer[]) {
  const headers = [
    "Officer",
    "Email",
    "Status",
    "Licenses",
    "License Expires",
    "Days Remaining",
    "Company",
    "Joined",
  ];

  const rows = officers.map((officer) => [
    officer.fullName,
    officer.email,
    officer.accountStatus,
    officer.licenseCount,
    officer.nearestExpirationDate
      ? new Date(officer.nearestExpirationDate).toLocaleDateString("en-US")
      : "",
    officer.nearestExpirationDaysRemaining ?? "",
    officer.lastAcceptedCompany ?? "",
    new Date(officer.joinedAt).toLocaleDateString("en-US"),
  ]);

  return [headers, ...rows]
    .map((row) => row.map((value) => escapeCsvValue(value)).join(","))
    .join("\n");
}

export function formatAdminDate(value: string | null) {
  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDaysRemaining(daysRemaining: number | null, expired = false) {
  if (daysRemaining === null) {
    return "—";
  }

  if (expired || daysRemaining <= 0) {
    return "Expired";
  }

  return `${daysRemaining} day${daysRemaining === 1 ? "" : "s"}`;
}

export function formatLocation(city: string | null, state: string | null) {
  if (city && state) {
    return `${city}, ${state}`;
  }

  return city ?? state ?? "—";
}
