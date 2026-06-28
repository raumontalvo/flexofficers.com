import {
  ApplicationStatus,
  ShiftStatus,
  type ShiftArmedRequirement,
  type ShiftWorkType,
} from "@/app/generated/prisma/enums";
import type { OfficerApplicantRecord } from "@/lib/officer-fields";
import {
  formatShiftTableDate,
  getShiftLocationParts,
} from "@/lib/company-shifts-page";
import { formatHourlyRate, formatShiftTime } from "@/lib/format-shift";
import { formatLicenseExpirationDate } from "@/lib/officer-licenses";
import {
  getWorkTypeLabel,
  parseCertificationRequirementsFromShift,
  parseFreeformOtherRequirements,
  parseLicenseRequirementsFromShift,
} from "@/lib/shift-create-form";
import {
  formatArmedStatuses,
  normalizeExperienceCategories,
} from "@/lib/profile-options";
import {
  fromShiftArmedRequirement,
  fromShiftWorkType,
} from "@/lib/shift-form-options";

export type CompanyApplicantsTab = "all" | "pending" | "accepted" | "rejected";

export type CompanyApplicationRecord = {
  id: string;
  status: ApplicationStatus;
  appliedAt: Date;
  shift: {
    id: string;
    title: string;
    location: string;
    city: string | null;
    state: string | null;
    startTime: Date;
    endTime: Date;
    status: ShiftStatus;
    hourlyRate: { toString: () => string };
    positionsNeeded: number;
    workType: ShiftWorkType | null;
    requirements: string[];
    otherRequirements: string | null;
    armedRequirement: ShiftArmedRequirement | null;
  };
  officer: OfficerApplicantRecord & {
    phone?: string | null;
    state?: string | null;
    availability?: string[];
    user?: { email: string | null };
  };
};

export type SerializedApplicationLicense = {
  id: string;
  licenseType: string;
  licenseNumber: string;
  issuingState: string;
  expirationDateLabel: string;
};

export type SerializedApplicationOfficerProfile = {
  name: string;
  email: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  cityStateLabel: string;
  experienceYearsLabel: string;
  armedStatusLabel: string;
  experienceCategories: string[];
  introduction: string | null;
  certifications: string[];
  availability: string[];
  licenses: SerializedApplicationLicense[];
  profilePhotoUrl: string | null;
};

export type SerializedApplicationShiftDetails = {
  title: string;
  status: ShiftStatus;
  dateLabel: string;
  timeLabel: string;
  locationLabel: string;
  payRateLabel: string;
  workTypeLabel: string;
  openPositions: number;
  requiredLicenses: string[];
  requiredCertifications: string[];
  otherRequirements: string | null;
};

export type SerializedCompanyApplicant = {
  id: string;
  status: ApplicationStatus;
  appliedAt: string;
  appliedDateLabel: string;
  appliedTimeLabel: string;
  officerName: string;
  profilePhotoUrl: string | null;
  licenseNumbers: string[];
  phone: string | null;
  shiftId: string;
  shiftTitle: string;
  shiftLocationLabel: string;
  shiftLocationSubtext: string;
  shiftStartTime: string;
  shiftEndTime: string;
  shiftStatus: ShiftStatus;
  shiftHourlyRate: string;
  shiftPositionsNeeded: number;
  officerProfile: SerializedApplicationOfficerProfile;
  appliedShift: SerializedApplicationShiftDetails;
};

export type ShiftApplicantOverview = {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
};

function serializeOfficerProfile(
  officer: CompanyApplicationRecord["officer"]
): SerializedApplicationOfficerProfile {
  const city = officer.city?.trim() || null;
  const state = officer.state?.trim() || null;
  const cityStateLabel =
    [city, state].filter(Boolean).join(", ") || "Not provided";

  return {
    name: `${officer.firstName} ${officer.lastName}`.trim(),
    email: officer.user?.email?.trim() || null,
    phone: officer.phone?.trim() || null,
    city,
    state,
    cityStateLabel,
    experienceYearsLabel:
      officer.experienceYears !== null && officer.experienceYears !== undefined
        ? `${officer.experienceYears} years`
        : "Not provided",
    armedStatusLabel: formatArmedStatuses(officer.armedStatuses),
    experienceCategories: normalizeExperienceCategories(
      officer.experienceCategories
    ),
    introduction: officer.introduction?.trim() || null,
    certifications: [...officer.certifications],
    availability: [...(officer.availability ?? [])],
    licenses: officer.licenses.map((license) => ({
      id: license.id,
      licenseType: license.licenseType,
      licenseNumber: license.licenseNumber,
      issuingState: license.issuingState,
      expirationDateLabel: formatLicenseExpirationDate(license.expirationDate),
    })),
    profilePhotoUrl: officer.profilePhotoUrl,
  };
}

function serializeAppliedShift(
  shift: CompanyApplicationRecord["shift"]
): SerializedApplicationShiftDetails {
  const { locationLabel, locationSubtext } = getShiftLocationParts(shift);
  const locationParts = [locationLabel, locationSubtext].filter(Boolean);
  const workType = shift.workType ? fromShiftWorkType(shift.workType) : "";
  const armedRequirement = shift.armedRequirement
    ? fromShiftArmedRequirement(shift.armedRequirement)
    : null;

  return {
    title: shift.title,
    status: shift.status,
    dateLabel: formatShiftTableDate(shift.startTime),
    timeLabel: `${formatShiftTime(shift.startTime)} – ${formatShiftTime(shift.endTime)}`,
    locationLabel: locationParts.join(" · ") || shift.location,
    payRateLabel: `${formatHourlyRate(shift.hourlyRate)}/hr`,
    workTypeLabel: workType ? getWorkTypeLabel(workType) : "Not provided",
    openPositions: shift.positionsNeeded,
    requiredLicenses: parseLicenseRequirementsFromShift({
      requirements: shift.requirements,
      otherRequirements: shift.otherRequirements,
      armedRequirement,
    }),
    requiredCertifications: parseCertificationRequirementsFromShift({
      requirements: shift.requirements,
      otherRequirements: shift.otherRequirements,
    }),
    otherRequirements:
      parseFreeformOtherRequirements(shift.otherRequirements) || null,
  };
}

export function serializeCompanyApplicant(
  application: CompanyApplicationRecord
): SerializedCompanyApplicant {
  const { locationLabel, locationSubtext } = getShiftLocationParts(
    application.shift
  );
  const appliedAt = application.appliedAt;
  const officerProfile = serializeOfficerProfile(application.officer);

  return {
    id: application.id,
    status: application.status,
    appliedAt: appliedAt.toISOString(),
    appliedDateLabel: appliedAt.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    appliedTimeLabel: formatShiftTime(appliedAt),
    officerName: officerProfile.name,
    profilePhotoUrl: officerProfile.profilePhotoUrl,
    licenseNumbers: officerProfile.licenses.map((license) => license.licenseNumber),
    phone: officerProfile.phone,
    shiftId: application.shift.id,
    shiftTitle: application.shift.title,
    shiftLocationLabel: locationLabel,
    shiftLocationSubtext: locationSubtext,
    shiftStartTime: application.shift.startTime.toISOString(),
    shiftEndTime: application.shift.endTime.toISOString(),
    shiftStatus: application.shift.status,
    shiftHourlyRate: application.shift.hourlyRate.toString(),
    shiftPositionsNeeded: application.shift.positionsNeeded,
    officerProfile,
    appliedShift: serializeAppliedShift(application.shift),
  };
}

export function getCompanyApplicantsTabCounts(
  applications: SerializedCompanyApplicant[]
) {
  return {
    all: applications.length,
    pending: applications.filter(
      (application) => application.status === ApplicationStatus.PENDING
    ).length,
    accepted: applications.filter(
      (application) => application.status === ApplicationStatus.ACCEPTED
    ).length,
    rejected: applications.filter(
      (application) => application.status === ApplicationStatus.REJECTED
    ).length,
  };
}

export function filterCompanyApplicantsByTab(
  applications: SerializedCompanyApplicant[],
  tab: CompanyApplicantsTab
) {
  switch (tab) {
    case "pending":
      return applications.filter(
        (application) => application.status === ApplicationStatus.PENDING
      );
    case "accepted":
      return applications.filter(
        (application) => application.status === ApplicationStatus.ACCEPTED
      );
    case "rejected":
      return applications.filter(
        (application) => application.status === ApplicationStatus.REJECTED
      );
    case "all":
    default:
      return applications;
  }
}

export function searchCompanyApplicants(
  applications: SerializedCompanyApplicant[],
  query: string
) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return applications;
  }

  return applications.filter((application) => {
    const haystack = [
      application.officerName,
      application.officerProfile.email,
      application.shiftTitle,
      application.shiftLocationLabel,
      application.shiftLocationSubtext,
      application.licenseNumbers.join(" "),
      application.phone ?? "",
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalized);
  });
}

export function filterCompanyApplicantsByShift(
  applications: SerializedCompanyApplicant[],
  shiftId: string | null
) {
  if (!shiftId) {
    return applications;
  }

  return applications.filter((application) => application.shiftId === shiftId);
}

export function getUniqueApplicantShifts(
  applications: SerializedCompanyApplicant[]
) {
  const shifts = new Map<string, string>();

  for (const application of applications) {
    shifts.set(application.shiftId, application.shiftTitle);
  }

  return [...shifts.entries()]
    .map(([id, title]) => ({ id, title }))
    .sort((left, right) => left.title.localeCompare(right.title));
}

export function getShiftApplicantOverview(
  applications: SerializedCompanyApplicant[],
  shiftId: string
): ShiftApplicantOverview {
  const shiftApplications = applications.filter(
    (application) => application.shiftId === shiftId
  );

  return {
    total: shiftApplications.length,
    pending: shiftApplications.filter(
      (application) => application.status === ApplicationStatus.PENDING
    ).length,
    accepted: shiftApplications.filter(
      (application) => application.status === ApplicationStatus.ACCEPTED
    ).length,
    rejected: shiftApplications.filter(
      (application) => application.status === ApplicationStatus.REJECTED
    ).length,
  };
}

export function formatApplicantShiftSchedule(
  startTime: string,
  endTime: string
) {
  const start = new Date(startTime);
  const end = new Date(endTime);

  return {
    dateLabel: formatShiftTableDate(start),
    timeLabel: `${formatShiftTime(start)} – ${formatShiftTime(end)}`,
  };
}
