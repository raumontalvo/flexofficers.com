import { ApplicationStatus } from "@/app/generated/prisma/enums";
import type { CompanyShiftRecord } from "@/lib/company-dashboard-data";
import { buildCompanyServices } from "@/lib/company-profile-options";
import {
  parseCompanyProfileMeta,
  stripCompanyProfileMeta,
} from "@/lib/company-profile-meta";
import { formatShiftCityState } from "@/lib/format-shift";

export type CompanyLicenseInfo = {
  licenseNumber: string | null;
  licenseType: string | null;
  licenseState: string | null;
  issueDate: string | null;
  expirationDate: string | null;
  hasDocument: boolean;
};

export type SerializedCompanyProfile = {
  id: string;
  displayCompanyName: string;
  logoUrl: string | null;
  verified: boolean;
  categoryLabel: string | null;
  locationLabel: string;
  website: string | null;
  memberSinceLabel: string;
  showLicensedInsuredBadge: boolean;
  introduction: string | null;
  aboutDescription: string | null;
  services: string[];
  officerBenefits: string[];
  workEnvironment: string[];
  license: CompanyLicenseInfo;
  details: {
    industry: string | null;
    companySize: string | null;
    established: string | null;
    website: string | null;
    contactEmail: string | null;
    phone: string | null;
  };
  support: {
    businessHours: string | null;
    email: string | null;
    phone: string | null;
  };
  hasPublicProfile: boolean;
  showContactDetails: boolean;
};

type CompanyRecord = {
  id: string;
  companyName: string;
  logoUrl: string | null;
  description: string | null;
  city: string | null;
  state: string | null;
  website: string | null;
  contactName: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  verified: boolean;
  licenseType: string | null;
  licenseNumber: string | null;
  licenseState: string | null;
  createdAt: Date;
};

function formatProfileDate(value: string | null) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatMemberSince(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function sanitizeDisplayValue(value: string | null | undefined) {
  const trimmed = value?.trim();

  if (!trimmed || trimmed.toLowerCase() === "none") {
    return null;
  }

  return trimmed;
}

export function formatTitleCase(value: string | null | undefined) {
  const sanitized = sanitizeDisplayValue(value);

  if (!sanitized) {
    return null;
  }

  return sanitized
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function formatDisplayPhone(value: string | null | undefined) {
  const sanitized = sanitizeDisplayValue(value);

  if (!sanitized) {
    return null;
  }

  const digits = sanitized.replace(/\D/g, "");

  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  if (digits.length === 11 && digits.startsWith("1")) {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }

  return sanitized;
}

export function companyHasPublicProfile(input: {
  companyName: string | null | undefined;
  description: string | null | undefined;
  city: string | null | undefined;
  state: string | null | undefined;
  website: string | null | undefined;
}) {
  const companyName = sanitizeDisplayValue(input.companyName);

  if (!companyName) {
    return false;
  }

  return Boolean(
    sanitizeDisplayValue(input.description) ||
      (sanitizeDisplayValue(input.city) && sanitizeDisplayValue(input.state)) ||
      sanitizeDisplayValue(input.website)
  );
}

export function getCompanyFillRatePercent(
  shifts: Pick<CompanyShiftRecord, "positionsNeeded" | "applications">[]
) {
  const positionsNeeded = shifts.reduce(
    (sum, shift) => sum + shift.positionsNeeded,
    0
  );

  if (positionsNeeded === 0) {
    return null;
  }

  const acceptedCount = shifts.reduce(
    (sum, shift) =>
      sum +
      shift.applications.filter(
        (application) => application.status === ApplicationStatus.ACCEPTED
      ).length,
    0
  );

  return Math.round((acceptedCount / positionsNeeded) * 100);
}

export function buildCompanySpecialties(shifts: { requirements: string[] }[]) {
  const values = new Set<string>();

  for (const shift of shifts) {
    for (const requirement of shift.requirements) {
      const trimmed = requirement.trim();
      if (trimmed) {
        values.add(trimmed);
      }
    }
  }

  return [...values].sort((left, right) => left.localeCompare(right));
}

export function serializeCompanyProfile(input: {
  company: CompanyRecord;
  userEmail: string;
  shifts: { requirements: string[] }[];
  showContactDetails?: boolean;
}): SerializedCompanyProfile {
  const { company, userEmail, shifts, showContactDetails = true } = input;
  const rawDescription = company.description;
  const meta = parseCompanyProfileMeta(rawDescription);
  const description = sanitizeDisplayValue(stripCompanyProfileMeta(rawDescription));
  const tagline = sanitizeDisplayValue(company.contactName);
  const website = sanitizeDisplayValue(company.website);
  const city = sanitizeDisplayValue(company.city);
  const state = sanitizeDisplayValue(company.state);
  const licenseNumber = sanitizeDisplayValue(company.licenseNumber);
  const licenseType = sanitizeDisplayValue(company.licenseType);
  const licenseState = sanitizeDisplayValue(company.licenseState);
  const displayPhone = formatDisplayPhone(company.phone);
  const contactEmail = sanitizeDisplayValue(company.email) || userEmail.trim();
  const cityState = formatShiftCityState({
    city,
    state,
    location: company.address ?? "",
  });
  const locationLabel = [cityState, "USA"].filter(Boolean).join(", ");
  const hasBusinessLicense = Boolean(
    licenseType && licenseNumber && licenseState
  );
  const services =
    meta.services.length > 0 ? meta.services : buildCompanyServices(shifts);

  const profile: SerializedCompanyProfile = {
    id: company.id,
    displayCompanyName:
      formatTitleCase(company.companyName) ?? company.companyName.trim(),
    logoUrl: company.logoUrl,
    verified: company.verified,
    categoryLabel:
      tagline || licenseType || description?.split(".")[0]?.trim() || null,
    locationLabel: locationLabel || "Not provided",
    website,
    memberSinceLabel: formatMemberSince(company.createdAt),
    showLicensedInsuredBadge: hasBusinessLicense,
    introduction: description,
    aboutDescription: description,
    services,
    officerBenefits: meta.officerBenefits,
    workEnvironment: meta.workEnvironment,
    license: {
      licenseNumber,
      licenseType,
      licenseState,
      issueDate: formatProfileDate(meta.licenseIssueDate),
      expirationDate: formatProfileDate(meta.licenseExpirationDate),
      hasDocument: false,
    },
    details: {
      industry: sanitizeDisplayValue(meta.industry),
      companySize: sanitizeDisplayValue(meta.companySize),
      established: sanitizeDisplayValue(meta.established),
      website,
      contactEmail: showContactDetails ? contactEmail : null,
      phone: showContactDetails ? displayPhone : null,
    },
    support: {
      businessHours: meta.businessHours,
      email: showContactDetails ? contactEmail : null,
      phone: showContactDetails ? displayPhone : null,
    },
    hasPublicProfile: companyHasPublicProfile({
      companyName: company.companyName,
      description,
      city,
      state,
      website,
    }),
    showContactDetails,
  };

  return profile;
}
